---
name: gemini-chatbot
description: Skill for implementing AI chatbot features with Google Gemini API, LangChain, and MCP tools
---

# Gemini Chatbot Implementation Skill

This skill provides guidance for implementing the Phase III AI Chatbot using Google Gemini.

## Prerequisites

- Python 3.10+
- Google Gemini API key (in backend/.env as GEMINI_API_KEY)
- Existing Phase II backend and frontend

## Required Dependencies

### Backend (add to requirements.txt)
```
google-generativeai>=0.3.0
langchain>=0.1.0
langchain-google-genai>=0.0.6
```

### Installation
```bash
cd backend
pip install google-generativeai langchain langchain-google-genai
```

## Implementation Steps

### Step 1: Database Models

Add to `backend/models.py`:

```python
from typing import Optional, List
from sqlmodel import Field, SQLModel, JSON
from datetime import datetime

class Conversation(SQLModel, table=True):
    """Conversation model for chat sessions."""
    __tablename__ = "conversations"
    
    id: int = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="users.id", index=True)
    title: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class Message(SQLModel, table=True):
    """Message model for chat messages."""
    __tablename__ = "messages"
    
    id: int = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="users.id", index=True)
    conversation_id: int = Field(foreign_key="conversations.id", index=True)
    role: str = Field(description="'user' or 'assistant'")
    content: str
    tool_calls: Optional[dict] = Field(default=None, sa_type=JSON)
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

### Step 2: MCP Tools

Create `backend/mcp/tools.py`:

```python
from sqlmodel import Session, select
from models import Todo
from db import engine

def add_task(user_id: str, title: str, description: str = None) -> dict:
    """Create a new task for the user."""
    with Session(engine) as session:
        todo = Todo(user_id=user_id, title=title, description=description)
        session.add(todo)
        session.commit()
        session.refresh(todo)
        return {"task_id": todo.id, "status": "created", "title": todo.title}

def list_tasks(user_id: str, status: str = "all") -> list:
    """List tasks for the user with optional status filter."""
    with Session(engine) as session:
        query = select(Todo).where(Todo.user_id == user_id)
        if status == "pending":
            query = query.where(Todo.completed == False)
        elif status == "completed":
            query = query.where(Todo.completed == True)
        tasks = session.exec(query).all()
        return [{"id": t.id, "title": t.title, "completed": t.completed} for t in tasks]

def complete_task(user_id: str, task_id: int) -> dict:
    """Mark a task as complete."""
    with Session(engine) as session:
        todo = session.exec(
            select(Todo).where(Todo.id == task_id, Todo.user_id == user_id)
        ).first()
        if not todo:
            return {"error": "Task not found"}
        todo.completed = True
        session.add(todo)
        session.commit()
        return {"task_id": todo.id, "status": "completed", "title": todo.title}

def delete_task(user_id: str, task_id: int) -> dict:
    """Delete a task."""
    with Session(engine) as session:
        todo = session.exec(
            select(Todo).where(Todo.id == task_id, Todo.user_id == user_id)
        ).first()
        if not todo:
            return {"error": "Task not found"}
        title = todo.title
        session.delete(todo)
        session.commit()
        return {"task_id": task_id, "status": "deleted", "title": title}

def update_task(user_id: str, task_id: int, title: str = None, description: str = None) -> dict:
    """Update a task's title or description."""
    with Session(engine) as session:
        todo = session.exec(
            select(Todo).where(Todo.id == task_id, Todo.user_id == user_id)
        ).first()
        if not todo:
            return {"error": "Task not found"}
        if title:
            todo.title = title
        if description:
            todo.description = description
        session.add(todo)
        session.commit()
        return {"task_id": todo.id, "status": "updated", "title": todo.title}
```

### Step 3: Gemini Agent

Create `backend/agents/todo_agent.py`:

```python
import os
import google.generativeai as genai
from mcp.tools import add_task, list_tasks, complete_task, delete_task, update_task

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

SYSTEM_PROMPT = """You are a helpful todo management assistant. You help users manage their tasks through natural conversation.

When a user wants to:
- Add/create/remember something → use add_task tool
- See/show/list tasks → use list_tasks tool  
- Mark done/complete/finish → use complete_task tool
- Delete/remove/cancel → use delete_task tool
- Change/update/rename → use update_task tool

Always confirm actions with a friendly response. Handle errors gracefully."""

# Define tools for Gemini
tools = [
    {
        "function_declarations": [
            {
                "name": "add_task",
                "description": "Create a new task",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "title": {"type": "string", "description": "Task title"},
                        "description": {"type": "string", "description": "Optional description"}
                    },
                    "required": ["title"]
                }
            },
            {
                "name": "list_tasks", 
                "description": "List user's tasks",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "status": {"type": "string", "enum": ["all", "pending", "completed"]}
                    }
                }
            },
            {
                "name": "complete_task",
                "description": "Mark a task as complete",
                "parameters": {
                    "type": "object", 
                    "properties": {
                        "task_id": {"type": "integer", "description": "ID of task to complete"}
                    },
                    "required": ["task_id"]
                }
            },
            {
                "name": "delete_task",
                "description": "Delete a task",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "task_id": {"type": "integer", "description": "ID of task to delete"}
                    },
                    "required": ["task_id"]
                }
            },
            {
                "name": "update_task",
                "description": "Update a task's title or description",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "task_id": {"type": "integer", "description": "ID of task to update"},
                        "title": {"type": "string", "description": "New title"},
                        "description": {"type": "string", "description": "New description"}
                    },
                    "required": ["task_id"]
                }
            }
        ]
    }
]

TOOL_FUNCTIONS = {
    "add_task": add_task,
    "list_tasks": list_tasks,
    "complete_task": complete_task,
    "delete_task": delete_task,
    "update_task": update_task
}

async def run_agent(user_id: str, message: str, history: list = None) -> dict:
    """Run the todo agent with the user's message."""
    model = genai.GenerativeModel(
        model_name=os.getenv("GEMINI_MODEL", "gemini-1.5-flash"),
        tools=tools,
        system_instruction=SYSTEM_PROMPT
    )
    
    # Build conversation history
    chat = model.start_chat(history=history or [])
    
    # Send message and get response
    response = chat.send_message(message)
    
    tool_calls = []
    final_response = ""
    
    # Handle function calls
    for part in response.parts:
        if hasattr(part, 'function_call') and part.function_call:
            func_name = part.function_call.name
            func_args = dict(part.function_call.args)
            
            # Add user_id to all tool calls
            func_args["user_id"] = user_id
            
            # Execute the tool
            if func_name in TOOL_FUNCTIONS:
                result = TOOL_FUNCTIONS[func_name](**func_args)
                tool_calls.append({
                    "tool": func_name,
                    "arguments": func_args,
                    "result": result
                })
                
                # Send function result back to model
                response = chat.send_message(
                    genai.protos.Content(
                        parts=[genai.protos.Part(
                            function_response=genai.protos.FunctionResponse(
                                name=func_name,
                                response={"result": result}
                            )
                        )]
                    )
                )
        
        if hasattr(part, 'text') and part.text:
            final_response += part.text
    
    # Get final text response
    if not final_response:
        for part in response.parts:
            if hasattr(part, 'text') and part.text:
                final_response += part.text
    
    return {
        "response": final_response,
        "tool_calls": tool_calls
    }
```

### Step 4: Chat API Endpoint

Create `backend/routes/chat.py`:

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import Optional
from pydantic import BaseModel

from db import get_session
from models import Conversation, Message
from dependencies.auth import get_current_user, UserAuth
from agents.todo_agent import run_agent

router = APIRouter(prefix="/api", tags=["chat"])

class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[int] = None

class ChatResponse(BaseModel):
    conversation_id: int
    response: str
    tool_calls: list = []

@router.post("/chat", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    current_user: UserAuth = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Send a message and get AI response."""
    user_id = current_user.user_id
    
    # Get or create conversation
    if request.conversation_id:
        conversation = session.exec(
            select(Conversation).where(
                Conversation.id == request.conversation_id,
                Conversation.user_id == user_id
            )
        ).first()
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
    else:
        conversation = Conversation(user_id=user_id)
        session.add(conversation)
        session.commit()
        session.refresh(conversation)
    
    # Load conversation history
    messages = session.exec(
        select(Message)
        .where(Message.conversation_id == conversation.id)
        .order_by(Message.created_at)
    ).all()
    
    # Format history for Gemini
    history = []
    for msg in messages:
        history.append({
            "role": msg.role,
            "parts": [msg.content]
        })
    
    # Save user message
    user_message = Message(
        user_id=user_id,
        conversation_id=conversation.id,
        role="user",
        content=request.message
    )
    session.add(user_message)
    session.commit()
    
    # Run agent
    result = await run_agent(user_id, request.message, history)
    
    # Save assistant message
    assistant_message = Message(
        user_id=user_id,
        conversation_id=conversation.id,
        role="assistant",
        content=result["response"],
        tool_calls=result["tool_calls"] if result["tool_calls"] else None
    )
    session.add(assistant_message)
    session.commit()
    
    return ChatResponse(
        conversation_id=conversation.id,
        response=result["response"],
        tool_calls=result["tool_calls"]
    )
```

### Step 5: Frontend Chat UI

See the frontend implementation in the tasks for creating React components.

## Testing

### Test the Chat Endpoint

```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"message": "Add a task to buy groceries"}'
```

### Expected Response

```json
{
  "conversation_id": 1,
  "response": "I've added 'buy groceries' to your task list. Is there anything else you'd like me to help with?",
  "tool_calls": [
    {
      "tool": "add_task",
      "arguments": {"title": "buy groceries", "user_id": "..."},
      "result": {"task_id": 5, "status": "created", "title": "buy groceries"}
    }
  ]
}
```

## Troubleshooting

### API Key Issues
- Verify GEMINI_API_KEY is set in backend/.env
- Check key is valid at https://aistudio.google.com/app/apikey

### Import Errors
- Run `pip install -r requirements.txt` after updating dependencies
- Restart the backend server after adding new files

### Tool Call Failures
- Check user_id is being passed to all tools
- Verify database connection is working
- Check logs for detailed error messages
