from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select, func
from typing import List, Optional
import json
import logging

from db import get_db
from models import (
    Conversation, Message, ChatRequest, ChatResponse, 
    ConversationListResponse, ConversationResponse, 
    ConversationListItem, MessageResponse, ToolCallInfo
)
from dependencies.auth import get_current_user, TokenPayload
from agents.todo_agent import run_todo_agent

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/chat", tags=["chat"])

@router.get("", include_in_schema=False)
async def chat_root_get():
    return {"message": "Chat API is running. Use POST to send messages."}

@router.post("", response_model=ChatResponse)
async def send_chat_message(
    request: ChatRequest,
    current_user: TokenPayload = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Send a message to the AI agent and get a response.
    If conversation_id is provided, continues that conversation.
    Otherwise, starts a new one.
    """
    user_id = current_user.sub
    
    # 0. Verify user exists (important after DB resets)
    from models import User
    user_exists = db.get(User, user_id)
    if not user_exists:
        raise HTTPException(
            status_code=401, 
            detail="User record not found. Please sign out and sign up again."
        )
    
    # 1. Get or create conversation
    if request.conversation_id:
        conversation = db.exec(
            select(Conversation).where(
                Conversation.id == request.conversation_id,
                Conversation.user_id == user_id
            )
        ).first()
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
    else:
        # Create a basic title from the first message
        title = request.message[:50] + ("..." if len(request.message) > 50 else "")
        conversation = Conversation(user_id=user_id, title=title)
        db.add(conversation)
        db.commit()
        db.refresh(conversation)
    
    # 2. Fetch history from database for Gemini context
    db_messages = db.exec(
        select(Message)
        .where(Message.conversation_id == conversation.id)
        .order_by(Message.created_at)
    ).all()
    
    # Format history for Gemini (requires role: user/model and parts: [text])
    # Note: Google-GenAI uses 'model' instead of 'assistant' in history list
    gemini_history = []
    for msg in db_messages:
        role = "user" if msg.role == "user" else "model"
        gemini_history.append({"role": role, "parts": [msg.content]})
    
    # 3. Save user message to database
    user_msg = Message(
        user_id=user_id,
        conversation_id=conversation.id,
        role="user",
        content=request.message
    )
    db.add(user_msg)
    db.commit()
    
    # 4. Run the Agent
    try:
        agent_result = await run_todo_agent(user_id, request.message, history=gemini_history)
    except Exception as e:
        logger.error(f"Agent execution error: {e}")
        raise HTTPException(status_code=500, detail=f"AI Agent error: {str(e)}")
    
    # 5. Save assistant response to database
    tool_calls_json = json.dumps(agent_result["tool_calls"]) if agent_result["tool_calls"] else None
    
    assistant_msg = Message(
        user_id=user_id,
        conversation_id=conversation.id,
        role="assistant",
        content=agent_result["response"],
        tool_calls=tool_calls_json
    )
    db.add(assistant_msg)
    
    # Update conversation timestamp
    conversation.updated_at = func.now()
    db.add(conversation)
    
    db.commit()
    
    return ChatResponse(
        conversation_id=conversation.id,
        response=agent_result["response"],
        tool_calls=[ToolCallInfo(**tc) for tc in agent_result["tool_calls"]]
    )

@router.get("/conversations", response_model=ConversationListResponse)
async def list_conversations(
    current_user: TokenPayload = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List all chat conversations for the current user."""
    user_id = current_user.sub
    
    conversations = db.exec(
        select(Conversation)
        .where(Conversation.user_id == user_id)
        .order_by(Conversation.updated_at.desc())
    ).all()
    
    result = []
    for conv in conversations:
        result.append(ConversationListItem(
            id=conv.id,
            title=conv.title,
            created_at=conv.created_at,
            updated_at=conv.updated_at
        ))
        
    return ConversationListResponse(
        conversations=result,
        total=len(result)
    )

@router.get("/conversations/{conversation_id}", response_model=ConversationResponse)
async def get_conversation_details(
    conversation_id: int,
    current_user: TokenPayload = Depends(get_current_user),
    db: Session = Depends(get_db)
) :
    """Get the full message history of a specific conversation."""
    user_id = current_user.sub
    
    conversation = db.exec(
        select(Conversation).where(
            Conversation.id == conversation_id,
            Conversation.user_id == user_id
        )
    ).first()
    
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    messages = db.exec(
        select(Message)
        .where(Message.conversation_id == conversation_id)
        .order_by(Message.created_at.asc())
    ).all()
    
    msg_responses = []
    for msg in messages:
        msg_responses.append(MessageResponse(
            id=msg.id,
            role=msg.role,
            content=msg.content,
            tool_calls=msg.tool_calls,
            created_at=msg.created_at
        ))
        
    return ConversationResponse(
        id=conversation.id,
        title=conversation.title,
        created_at=conversation.created_at,
        updated_at=conversation.updated_at,
        messages=msg_responses
    )

@router.delete("/conversations/{conversation_id}")
async def delete_conversation(
     conversation_id: int,
     current_user: TokenPayload = Depends(get_current_user),
     db: Session = Depends(get_db)
):
    """Delete a conversation and all its messages."""
    user_id = current_user.sub
    
    conversation = db.exec(
        select(Conversation).where(
            Conversation.id == conversation_id,
            Conversation.user_id == user_id
        )
    ).first()
    
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    # Delete associated messages
    db_messages = db.exec(
        select(Message).where(Message.conversation_id == conversation_id)
    ).all()
    
    for msg in db_messages:
        db.delete(msg)
        
    db.delete(conversation)
    db.commit()
    
    return {"status": "success", "message": "Conversation deleted"}
