"""Task API endpoints with JWT authentication and Phase V advanced features."""

from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks, Query
from sqlmodel import Session, select, func, or_
from datetime import datetime

from db import get_db
from dependencies.auth import get_current_user, TokenPayload
from models import (
    Todo,
    TodoCreate,
    TodoUpdate,
    TodoResponse,
    TodoListResponse,
    User,
    Tag,
    TaskTag,
    Priority,
)
from services import get_event_publisher, get_recurrence_service, get_jobs_service


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


def get_task_tags(task_id: int, db: Session) -> List[str]:
    """Get all tag names for a task.
    
    Args:
        task_id: Task ID
        db: Database session
        
    Returns:
        List of tag names
    """
    query = (
        select(Tag.name)
        .join(TaskTag, TaskTag.tag_id == Tag.id)
        .where(TaskTag.task_id == task_id)
    )
    tags = db.execute(query).scalars().all()
    return list(tags)


def task_to_response(task: Todo, db: Session) -> TodoResponse:
    """Convert Todo model to TodoResponse with tags.
    
    Args:
        task: Todo model instance
        db: Database session
        
    Returns:
        TodoResponse with tags
    """
    tags = get_task_tags(task.id, db)
    return TodoResponse(
        id=task.id,
        user_id=task.user_id,
        title=task.title,
        description=task.description,
        completed=task.completed,
        created_at=task.created_at,
        updated_at=task.updated_at,
        priority=task.priority,
        tags=tags,
        due_date=task.due_date,
        recurrence_pattern=task.recurrence_pattern,
        reminder_time=task.reminder_time,
        is_overdue=task.is_overdue,
    )


def add_tags_to_task(task_id: int, tag_names: List[str], db: Session) -> None:
    """Add tags to a task, creating tags if they don't exist.
    
    Args:
        task_id: Task ID
        tag_names: List of tag names to add
        db: Database session
    """
    for tag_name in tag_names:
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
            select(TaskTag)
            .where(TaskTag.task_id == task_id, TaskTag.tag_id == tag.id)
        ).scalar_one_or_none()
        
        if not existing:
            task_tag = TaskTag(task_id=task_id, tag_id=tag.id)
            db.add(task_tag)
    
    db.commit()


# ============================================
# CRUD Endpoints with Phase V Enhancements
# ============================================

@router.get("", response_model=TodoListResponse)
async def list_tasks(
    skip: int = 0,
    limit: int = 100,
    priority: Optional[Priority] = Query(None, description="Filter by priority"),
    tags: Optional[str] = Query(None, description="Comma-separated tags to filter by"),
    completed: Optional[bool] = Query(None, description="Filter by completion status"),
    sort_by: str = Query("created_at", description="Field to sort by"),
    order: str = Query("desc", description="Sort order: asc or desc"),
    current_user: TokenPayload = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> TodoListResponse:
    """List all tasks for the authenticated user with filtering and sorting.

    Args:
        skip: Number of tasks to skip (pagination)
        limit: Maximum number of tasks to return
        priority: Filter by priority (HIGH, MEDIUM, LOW)
        tags: Comma-separated list of tags to filter by
        completed: Filter by completion status
        sort_by: Field to sort by (created_at, updated_at, priority, due_date)
        order: Sort order (asc, desc)
        current_user: Authenticated user from JWT
        db: Database session

    Returns:
        List of tasks owned by the user with pagination info
    """
    user_id = current_user.sub
    user_exists = db.get(User, user_id)
    if not user_exists:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User record not found. Please sign out and sign up again.",
        )

    # Build query with filters
    query = select(Todo).where(Todo.user_id == user_id)
    
    # Apply filters
    if priority:
        query = query.where(Todo.priority == priority)
    
    if completed is not None:
        query = query.where(Todo.completed == completed)
    
    # Tag filtering
    if tags:
        tag_list = [t.strip().lower() for t in tags.split(",") if t.strip()]
        if tag_list:
            query = (
                query
                .join(TaskTag, TaskTag.task_id == Todo.id)
                .join(Tag, Tag.id == TaskTag.tag_id)
                .where(Tag.name.in_(tag_list))
                .distinct()
            )
    
    # Count total (before pagination)
    count_query = select(func.count()).select_from(query.subquery())
    total = db.execute(count_query).scalar() or 0
    
    # Apply sorting
    sort_field = getattr(Todo, sort_by, Todo.created_at)
    if order == "asc":
        query = query.order_by(sort_field.asc())
    else:
        query = query.order_by(sort_field.desc())
    
    # Apply pagination
    query = query.offset(skip).limit(limit)
    
    # Execute query
    tasks = db.execute(query).scalars().all()

    return TodoListResponse(
        tasks=[task_to_response(t, db) for t in tasks],
        total=total,
    )


@router.post("", response_model=TodoResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_data: TodoCreate,
    background_tasks: BackgroundTasks,
    current_user: TokenPayload = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> TodoResponse:
    """Create a new task for the authenticated user with Phase V features.

    Args:
        task_data: Task creation data (includes priority, tags, due_date, etc.)
        background_tasks: FastAPI BackgroundTasks for async event publishing
        current_user: Authenticated user from JWT
        db: Database session

    Returns:
        The created task with tags
    """
    user_id = current_user.sub
    user_exists = db.get(User, user_id)
    if not user_exists:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User record not found. Please sign out and sign up again.",
        )

    # Validation: max 10 tags
    if task_data.tags and len(task_data.tags) > 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Maximum 10 tags allowed per task",
        )
    
    # Validation: reminder_time must be before due_date
    if task_data.reminder_time and task_data.due_date:
        if task_data.reminder_time >= task_data.due_date:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Reminder time must be before due date",
            )

    # Create task
    task = Todo(
        user_id=user_id,
        title=task_data.title,
        description=task_data.description,
        completed=False,
        priority=task_data.priority or Priority.MEDIUM,
        due_date=task_data.due_date,
        recurrence_pattern=task_data.recurrence_pattern,
        reminder_time=task_data.reminder_time,
    )

    db.add(task)
    db.commit()
    db.refresh(task)
    
    # Add tags if provided
    if task_data.tags:
        add_tags_to_task(task.id, task_data.tags, db)

    # Publish task.created event
    event_publisher = get_event_publisher()
    task_dict = {
        "id": task.id,
        "user_id": task.user_id,
        "title": task.title,
        "description": task.description,
        "priority": task.priority.value,
        "tags": task_data.tags or [],
        "due_date": task.due_date,
        "recurrence_pattern": task.recurrence_pattern,
        "completed": task.completed,
        "created_at": task.created_at,
    }
    event_publisher.publish_task_created(task_dict, background_tasks)

    # Phase V: Schedule reminder via Dapr Jobs API
    if task.reminder_time:
        jobs_service = get_jobs_service()
        background_tasks.add_task(
            jobs_service.schedule_reminder,
            task.id,
            task.reminder_time,
            task.user_id
        )

    return task_to_response(task, db)


@router.get("/{task_id}", response_model=TodoResponse)
async def get_task(
    task_id: int,
    current_user: TokenPayload = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> TodoResponse:
    """Get a specific task by ID with tags.

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
    return task_to_response(task, db)


@router.put("/{task_id}", response_model=TodoResponse)
async def update_task(
    task_id: int,
    task_data: TodoUpdate,
    background_tasks: BackgroundTasks,
    current_user: TokenPayload = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> TodoResponse:
    """Update an existing task with Phase V features.

    Args:
        task_id: The task ID to update
        task_data: Task update data
        background_tasks: FastAPI BackgroundTasks for async event publishing
        current_user: Authenticated user from JWT
        db: Database session

    Returns:
        The updated task

    Raises:
        HTTPException: 404 if not found, 403 if not owned
    """
    task = get_task_or_404(task_id, current_user.sub, db)
    
    # Track changes for events
    changes = {}
    old_priority = task.priority
    old_completed = task.completed
    old_tags = set(get_task_tags(task.id, db))

    # Update only provided fields
    update_data = task_data.model_dump(exclude_unset=True, exclude={"tags"})
    for field, value in update_data.items():
        if hasattr(task, field):
            old_value = getattr(task, field)
            if old_value != value:
                changes[field] = {"old": old_value, "new": value}
                setattr(task, field, value)

    task.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(task)
    
    # Handle tag updates
    if task_data.tags is not None:
        # Remove all existing tags
        db.execute(
            select(TaskTag).where(TaskTag.task_id == task.id)
        ).scalars().all()
        db.query(TaskTag).filter(TaskTag.task_id == task.id).delete()
        
        # Add new tags
        if task_data.tags:
            if len(task_data.tags) > 10:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Maximum 10 tags allowed per task",
                )
            add_tags_to_task(task.id, task_data.tags, db)
        
        # Track tag changes
        new_tags = set(task_data.tags or [])
        added_tags = list(new_tags - old_tags)
        removed_tags = list(old_tags - new_tags)
        
        if added_tags or removed_tags:
            changes["tags"] = {"added": added_tags, "removed": removed_tags}

    # Publish events
    event_publisher = get_event_publisher()
    task_dict = {
        "id": task.id,
        "user_id": task.user_id,
        "title": task.title,
        "updated_at": task.updated_at,
    }
    
    # Publish task.updated event
    if changes:
        event_publisher.publish_task_updated(task_dict, changes, background_tasks)
    
    # Publish priority.changed event
    if "priority" in changes:
        event_publisher.publish_priority_changed(
            task_dict,
            old_priority.value,
            task.priority.value,
            background_tasks
        )
    
    # Publish tags.updated event
    if "tags" in changes:
        event_publisher.publish_tags_updated(
            {**task_dict, "tags": get_task_tags(task.id, db)},
            changes["tags"]["added"],
            changes["tags"]["removed"],
            background_tasks
        )
    
    # Check if task was just completed and has recurrence pattern
    if not old_completed and task.completed and task.recurrence_pattern:
        # Publish task.completed event
        event_publisher.publish_task_completed(task_dict, background_tasks)
        
        # Create next recurring instance
        recurrence_service = get_recurrence_service()
        task_dict_full = {
            "id": task.id,
            "title": task.title,
            "description": task.description,
            "priority": task.priority.value,
            "due_date": task.due_date,
            "recurrence_pattern": task.recurrence_pattern,
            "reminder_time": task.reminder_time,
            "user_id": task.user_id,
        }
        next_instance_data = recurrence_service.create_next_instance_data(task_dict_full)
        
        if next_instance_data:
            # Create the next task
            next_task = Todo(**next_instance_data)
            db.add(next_task)
            db.commit()
            db.refresh(next_task)
            
            # Copy tags to new task
            current_tags = get_task_tags(task.id, db)
            if current_tags:
                add_tags_to_task(next_task.id, current_tags, db)
            
            # Publish recurrence.triggered event
            event_publisher.publish_recurrence_triggered(
                task_dict_full,
                {
                    "id": next_task.id,
                    "due_date": next_task.due_date,
                    "user_id": next_task.user_id,
                },
                background_tasks
            )

    # Phase V: Update reminder job if reminder_time changed
    if "reminder_time" in changes:
        jobs_service = get_jobs_service()
        if task.reminder_time:
            background_tasks.add_task(jobs_service.schedule_reminder, task.id, task.reminder_time, task.user_id)
        else:
            background_tasks.add_task(jobs_service.delete_reminder, task.id)

    return task_to_response(task, db)


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: int,
    background_tasks: BackgroundTasks,
    current_user: TokenPayload = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> None:
    """Delete a task.

    Args:
        task_id: The task ID to delete
        background_tasks: FastAPI BackgroundTasks for async event publishing
        current_user: Authenticated user from JWT
        db: Database session

    Raises:
        HTTPException: 404 if not found, 403 if not owned
    """
    task = get_task_or_404(task_id, current_user.sub, db)
    user_id = task.user_id

    db.delete(task)
    db.commit()
    
    # Publish task.deleted event
    event_publisher = get_event_publisher()
    event_publisher.publish_task_deleted(task_id, user_id, background_tasks)
    
    # Phase V: Cancel reminder job
    jobs_service = get_jobs_service()
    background_tasks.add_task(jobs_service.delete_reminder, task_id)


@router.patch("/{task_id}/complete", response_model=TodoResponse)
async def toggle_complete(
    task_id: int,
    background_tasks: BackgroundTasks,
    current_user: TokenPayload = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> TodoResponse:
    """Toggle task completion status with recurring task support.

    Args:
        task_id: The task ID to toggle
        background_tasks: FastAPI BackgroundTasks for async event publishing
        current_user: Authenticated user from JWT
        db: Database session

    Returns:
        The updated task with toggled completion status

    Raises:
        HTTPException: 404 if not found, 403 if not owned
    """
    task = get_task_or_404(task_id, current_user.sub, db)
    old_completed = task.completed

    # Toggle completion status
    task.completed = not task.completed
    task.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(task)
    
    # Publish events
    event_publisher = get_event_publisher()
    
    # If task was just completed and is recurring
    if not old_completed and task.completed and task.recurrence_pattern:
        task_dict = {
            "id": task.id,
            "user_id": task.user_id,
            "title": task.title,
            "recurrence_pattern": task.recurrence_pattern,
            "updated_at": task.updated_at,
        }
        # This event will be consumed by the Recurrence Agent in routes/events.py
        event_publisher.publish_task_completed(task_dict, background_tasks)


    # Phase V: Cancel reminder if task completed
    if task.completed:
        jobs_service = get_jobs_service()
        background_tasks.add_task(jobs_service.delete_reminder, task_id)
    elif not task.completed and task.reminder_time:
        # Reschedule if un-completed and had reminder
        jobs_service = get_jobs_service()
        background_tasks.add_task(jobs_service.schedule_reminder, task.id, task.reminder_time, task.user_id)

    return task_to_response(task, db)


# ============================================
# Phase V: Search Endpoint
# ============================================

@router.get("/search", response_model=TodoListResponse)
async def search_tasks(
    q: str = Query(..., min_length=1, description="Search query"),
    priority: Optional[Priority] = Query(None, description="Filter by priority"),
    completed: Optional[bool] = Query(None, description="Filter by completion status"),
    skip: int = 0,
    limit: int = 100,
    current_user: TokenPayload = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> TodoListResponse:
    """Search tasks by title, description, or tags.

    Args:
        q: Search query string
        priority: Optional priority filter
        completed: Optional completion status filter
        skip: Pagination offset
        limit: Pagination limit
        current_user: Authenticated user from JWT
        db: Database session

    Returns:
        Matching tasks
    """
    user_id = current_user.sub
    
    # Build search query
    search_pattern = f"%{q}%"
    query = select(Todo).where(
        Todo.user_id == user_id,
        or_(
            Todo.title.ilike(search_pattern),
            Todo.description.ilike(search_pattern),
        )
    )
    
    # Apply filters
    if priority:
        query = query.where(Todo.priority == priority)
    if completed is not None:
        query = query.where(Todo.completed == completed)
    
    # Count total
    count_query = select(func.count()).select_from(query.subquery())
    total = db.execute(count_query).scalar() or 0
    
    # Apply pagination and execute
    query = query.order_by(Todo.updated_at.desc()).offset(skip).limit(limit)
    tasks = db.execute(query).scalars().all()
    
    return TodoListResponse(
        tasks=[task_to_response(t, db) for t in tasks],
        total=total,
    )
