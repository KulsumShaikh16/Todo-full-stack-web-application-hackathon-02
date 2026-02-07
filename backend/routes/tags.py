"""Tag API endpoints for Phase V - Task categorization."""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select, func
from datetime import datetime

from db import get_db
from dependencies.auth import get_current_user, TokenPayload
from models import (
    Tag,
    TaskTag,
    Todo,
    TagResponse,
    TagListResponse,
    AddTagsRequest,
)


router = APIRouter(prefix="/api/tags", tags=["tags"])


@router.get("", response_model=TagListResponse)
async def list_tags(
    current_user: TokenPayload = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> TagListResponse:
    """List all tags with usage counts.

    Returns tags sorted by most used first.

    Args:
        current_user: Authenticated user from JWT
        db: Database session

    Returns:
        List of tags with usage counts
    """
    # Get all tags with usage counts
    query = (
        select(
            Tag.id,
            Tag.name,
            Tag.created_at,
            func.count(TaskTag.task_id).label("usage_count")
        )
        .outerjoin(TaskTag, TaskTag.tag_id == Tag.id)
        .group_by(Tag.id, Tag.name, Tag.created_at)
        .order_by(func.count(TaskTag.task_id).desc(), Tag.name.asc())
    )
    
    results = db.execute(query).all()
    
    tags = [
        TagResponse(
            id=row.id,
            name=row.name,
            created_at=row.created_at,
            usage_count=row.usage_count or 0
        )
        for row in results
    ]
    
    return TagListResponse(tags=tags, total=len(tags))


@router.post("/{task_id}/tags", status_code=status.HTTP_201_CREATED)
async def add_tags_to_task(
    task_id: int,
    request: AddTagsRequest,
    current_user: TokenPayload = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict:
    """Add tags to a task.

    Creates tags if they don't exist. Maximum 10 tags per task.

    Args:
        task_id: Task ID to add tags to
        request: Request with list of tag names
        current_user: Authenticated user from JWT
        db: Database session

    Returns:
        Success message with added tags

    Raises:
        HTTPException: 404 if task not found, 403 if not owned, 400 if validation fails
    """
    # Verify task exists and user owns it
    task = db.get(Todo, task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    if task.user_id != current_user.sub:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to modify this task"
        )
    
    # Check current tag count
    current_count = db.execute(
        select(func.count(TaskTag.tag_id)).where(TaskTag.task_id == task_id)
    ).scalar() or 0
    
    if current_count + len(request.tags) > 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Maximum 10 tags allowed. Task currently has {current_count} tags."
        )
    
    added_tags = []
    for tag_name in request.tags:
        if not tag_name or not tag_name.strip():
            continue
        
        tag_name = tag_name.strip().lower()
        
        # Get or create tag
        tag = db.execute(
            select(Tag).where(Tag.name == tag_name)
        ).scalar_one_or_none()
        
        if not tag:
            tag = Tag(name=tag_name)
            db.add(tag)
            db.commit()
            db.refresh(tag)
        
        # Check if association already exists
        existing = db.execute(
            select(TaskTag).where(
                TaskTag.task_id == task_id,
                TaskTag.tag_id == tag.id
            )
        ).scalar_one_or_none()
        
        if not existing:
            task_tag = TaskTag(task_id=task_id, tag_id=tag.id)
            db.add(task_tag)
            added_tags.append(tag_name)
    
    db.commit()
    
    return {
        "message": "Tags added successfully",
        "added_tags": added_tags,
        "task_id": task_id
    }


@router.delete("/{task_id}/tags/{tag_name}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_tag_from_task(
    task_id: int,
    tag_name: str,
    current_user: TokenPayload = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> None:
    """Remove a tag from a task.

    The tag itself is not deleted, only the association.

    Args:
        task_id: Task ID to remove tag from
        tag_name: Name of tag to remove
        current_user: Authenticated user from JWT
        db: Database session

    Raises:
        HTTPException: 404 if task or tag not found, 403 if not owned
    """
    # Verify task exists and user owns it
    task = db.get(Todo, task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    if task.user_id != current_user.sub:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to modify this task"
        )
    
    # Find tag
    tag = db.execute(
        select(Tag).where(Tag.name == tag_name.lower())
    ).scalar_one_or_none()
    
    if not tag:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tag not found"
        )
    
    # Remove association
    result = db.execute(
        select(TaskTag).where(
            TaskTag.task_id == task_id,
            TaskTag.tag_id == tag.id
        )
    )
    task_tag = result.scalar_one_or_none()
    
    if task_tag:
        db.delete(task_tag)
        db.commit()
