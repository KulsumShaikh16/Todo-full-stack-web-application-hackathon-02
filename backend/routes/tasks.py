"""Task API endpoints with JWT authentication and user-scoped access."""

from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select, func
from datetime import datetime

from db import get_db
from dependencies.auth import get_current_user, TokenPayload
from models import (
    Todo,
    TodoCreate,
    TodoUpdate,
    TodoResponse,
    TodoListResponse,
)


router = APIRouter(prefix="/api/tasks", tags=["tasks"])


def get_task_or_404(
    task_id: int,
    user_id: str,
    db: Session,
) -> Todo:
    """Get a task by ID, verifying ownership.

    Args:
        task_id: The task ID to retrieve
        user_id: The authenticated user's ID
        db: Database session

    Returns:
        The task if found and owned by user

    Raises:
        HTTPException: 404 if not found, 403 if not owned
    """
    task = db.get(Todo, task_id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    if task.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this task",
        )

    return task


@router.get("", response_model=TodoListResponse)
async def list_tasks(
    skip: int = 0,
    limit: int = 100,
    current_user: TokenPayload = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> TodoListResponse:
    """List all tasks for the authenticated user.

    Args:
        skip: Number of tasks to skip (pagination)
        limit: Maximum number of tasks to return
        current_user: Authenticated user from JWT
        db: Database session

    Returns:
        List of tasks owned by the user with pagination info
    """
    # Count total tasks for user
    count_query = (
        select(func.count(Todo.id))
        .where(Todo.user_id == current_user.sub)
    )
    total = db.execute(count_query).scalar() or 0

    # Fetch tasks with pagination and user filtering
    query = (
        select(Todo)
        .where(Todo.user_id == current_user.sub)
        .order_by(Todo.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    tasks = db.execute(query).scalars().all()

    return TodoListResponse(
        tasks=[TodoResponse.model_validate(t) for t in tasks],
        total=total,
    )


@router.post("", response_model=TodoResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_data: TodoCreate,
    current_user: TokenPayload = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> TodoResponse:
    """Create a new task for the authenticated user.

    Args:
        task_data: Task creation data
        current_user: Authenticated user from JWT
        db: Database session

    Returns:
        The created task
    """
    task = Todo(
        user_id=current_user.sub,
        title=task_data.title,
        description=task_data.description,
        completed=False,
    )

    db.add(task)
    db.commit()
    db.refresh(task)

    return TodoResponse.model_validate(task)


@router.get("/{task_id}", response_model=TodoResponse)
async def get_task(
    task_id: int,
    current_user: TokenPayload = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> TodoResponse:
    """Get a specific task by ID.

    Args:
        task_id: The task ID to retrieve
        current_user: Authenticated user from JWT
        db: Database session

    Returns:
        The task if found and owned by user

    Raises:
        HTTPException: 404 if not found, 403 if not owned
    """
    task = get_task_or_404(task_id, current_user.sub, db)
    return TodoResponse.model_validate(task)


@router.put("/{task_id}", response_model=TodoResponse)
async def update_task(
    task_id: int,
    task_data: TodoUpdate,
    current_user: TokenPayload = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> TodoResponse:
    """Update an existing task.

    Args:
        task_id: The task ID to update
        task_data: Task update data
        current_user: Authenticated user from JWT
        db: Database session

    Returns:
        The updated task

    Raises:
        HTTPException: 404 if not found, 403 if not owned
    """
    task = get_task_or_404(task_id, current_user.sub, db)

    # Update only provided fields
    update_data = task_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(task, field, value)

    task.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(task)

    return TodoResponse.model_validate(task)


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: int,
    current_user: TokenPayload = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> None:
    """Delete a task.

    Args:
        task_id: The task ID to delete
        current_user: Authenticated user from JWT
        db: Database session

    Raises:
        HTTPException: 404 if not found, 403 if not owned
    """
    task = get_task_or_404(task_id, current_user.sub, db)

    db.delete(task)
    db.commit()


@router.patch("/{task_id}/complete", response_model=TodoResponse)
async def toggle_complete(
    task_id: int,
    current_user: TokenPayload = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> TodoResponse:
    """Toggle task completion status.

    Args:
        task_id: The task ID to toggle
        current_user: Authenticated user from JWT
        db: Database session

    Returns:
        The updated task with toggled completion status

    Raises:
        HTTPException: 404 if not found, 403 if not owned
    """
    task = get_task_or_404(task_id, current_user.sub, db)

    # Toggle completion status
    task.completed = not task.completed
    task.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(task)

    return TodoResponse.model_validate(task)
