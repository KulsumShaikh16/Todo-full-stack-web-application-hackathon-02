"""Database models for the Todo application using SQLModel."""

from datetime import datetime
from typing import Optional
from sqlmodel import Field, Relationship, SQLModel


class User(SQLModel, table=True):
    """User model - references Better Auth managed users.

    Table: users
    """
    __tablename__ = "users"

    id: str = Field(
        primary_key=True,
        description="User ID from Better Auth"
    )
    email: str = Field(
        unique=True,
        index=True,
        description="User email address"
    )
    password_hash: str = Field(
        description="Hashed password"
    )
    name: Optional[str] = Field(
        default=None,
        description="Optional user display name"
    )
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="Account creation timestamp"
    )


class Todo(SQLModel, table=True):
    """Todo model representing a task owned by a user.

    Table: todos
    """
    __tablename__ = "todos"

    id: int = Field(
        default=None,
        primary_key=True,
        description="Unique task identifier"
    )
    user_id: str = Field(
        foreign_key="users.id",
        nullable=False,
        index=True,
        description="Owner of this task - foreign key to User"
    )
    title: str = Field(
        min_length=1,
        max_length=200,
        description="Task title (1-200 characters)"
    )
    description: Optional[str] = Field(
        default=None,
        description="Optional task description"
    )
    completed: bool = Field(
        default=False,
        description="Task completion status"
    )
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="Creation timestamp"
    )
    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="Last update timestamp"
    )


# Pydantic models for API requests/responses
class TodoCreate(SQLModel):
    """Model for creating a new todo."""
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None


class TodoUpdate(SQLModel):
    """Model for updating an existing todo."""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    completed: Optional[bool] = None


class TodoResponse(SQLModel):
    """Model for todo response."""
    id: int
    user_id: str
    title: str
    description: Optional[str]
    completed: bool
    created_at: datetime
    updated_at: datetime


class TodoListResponse(SQLModel):
    """Model for list of todos response."""
    tasks: list[TodoResponse]
    total: int


# Authentication models
class SignupRequest(SQLModel):
    """Model for user signup request."""
    email: str = Field(..., description="User email address")
    password: str = Field(..., min_length=8, description="User password (min 8 characters)")
    name: Optional[str] = None


class SigninRequest(SQLModel):
    """Model for user signin request."""
    email: str = Field(..., description="User email address")
    password: str = Field(..., description="User password")


class UserResponse(SQLModel):
    """Model for user response."""
    id: str
    email: str
    name: Optional[str] = None


class AuthResponse(SQLModel):
    """Model for authentication response."""
    user: UserResponse
    token: str
    expires_at: int


# ============================================
# Phase III: AI Chatbot Models
# ============================================

class Conversation(SQLModel, table=True):
    """Conversation model for chat sessions.

    Table: conversations
    """
    __tablename__ = "conversations"

    id: int = Field(
        default=None,
        primary_key=True,
        description="Unique conversation identifier"
    )
    user_id: str = Field(
        foreign_key="users.id",
        nullable=False,
        index=True,
        description="Owner of this conversation"
    )
    title: Optional[str] = Field(
        default=None,
        max_length=200,
        description="Optional conversation title"
    )
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="Creation timestamp"
    )
    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="Last update timestamp"
    )


class Message(SQLModel, table=True):
    """Message model for chat messages.

    Table: messages
    """
    __tablename__ = "messages"

    id: int = Field(
        default=None,
        primary_key=True,
        description="Unique message identifier"
    )
    user_id: str = Field(
        foreign_key="users.id",
        nullable=False,
        index=True,
        description="Owner of this message"
    )
    conversation_id: int = Field(
        foreign_key="conversations.id",
        nullable=False,
        index=True,
        description="Conversation this message belongs to"
    )
    role: str = Field(
        description="Message role: 'user' or 'assistant'"
    )
    content: str = Field(
        description="Message content"
    )
    tool_calls: Optional[str] = Field(
        default=None,
        description="JSON string of tool calls made (for assistant messages)"
    )
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="Creation timestamp"
    )


# Chat API request/response models
class ChatRequest(SQLModel):
    """Model for chat request."""
    message: str = Field(..., min_length=1, description="User's message")
    conversation_id: Optional[int] = Field(
        default=None,
        description="Existing conversation ID (creates new if not provided)"
    )


class ToolCallInfo(SQLModel):
    """Model for tool call information."""
    tool: str
    arguments: dict
    result: dict


class ChatResponse(SQLModel):
    """Model for chat response."""
    conversation_id: int
    response: str
    tool_calls: list[ToolCallInfo] = []


class MessageResponse(SQLModel):
    """Model for message in conversation history."""
    id: int
    role: str
    content: str
    tool_calls: Optional[str] = None
    created_at: datetime


class ConversationResponse(SQLModel):
    """Model for conversation with messages."""
    id: int
    title: Optional[str]
    created_at: datetime
    updated_at: datetime
    messages: list[MessageResponse] = []


class ConversationListItem(SQLModel):
    """Model for conversation list item."""
    id: int
    title: Optional[str]
    created_at: datetime
    updated_at: datetime


class ConversationListResponse(SQLModel):
    """Model for list of conversations."""
    conversations: list[ConversationListItem]
    total: int
