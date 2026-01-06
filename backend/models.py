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
