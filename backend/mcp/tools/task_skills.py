"""Task manipulation skills for FocusFlow AI."""

from typing import Optional, List
from datetime import datetime
from sqlmodel import Session, select
import logging

try:
    from models import Todo, Priority, Tag, TaskTag
    from db import engine
    from services import get_event_publisher, get_recurrence_service, get_jobs_service
except ImportError:
    import sys
    import os
    sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    from models import Todo, Priority, Tag, TaskTag
    from db import engine
    from services import get_event_publisher, get_recurrence_service, get_jobs_service

logger = logging.getLogger(__name__)

def add_task(
    user_id: str, 
    title: str, 
    description: Optional[str] = None,
    priority: Optional[str] = "MEDIUM",
    due_date: Optional[str] = None,
    tags: Optional[List[str]] = None,
    recurrence_pattern: Optional[str] = None,
    reminder_time: Optional[str] = None
) -> dict:
    """Create a new task with Phase 5 features."""
    try:
        # Parse dates
        due_dt = datetime.fromisoformat(due_date.replace('Z', '+00:00')) if due_date else None
        reminder_dt = datetime.fromisoformat(reminder_time.replace('Z', '+00:00')) if reminder_time else None
        
        # Validate priority
        try:
            prio = Priority(priority.upper()) if priority else Priority.MEDIUM
        except ValueError:
            prio = Priority.MEDIUM

        with Session(engine) as session:
            todo = Todo(
                user_id=user_id,
                title=title,
                description=description,
                priority=prio,
                due_date=due_dt,
                recurrence_pattern=recurrence_pattern,
                reminder_time=reminder_dt,
                completed=False
            )
            session.add(todo)
            session.commit()
            session.refresh(todo)
            
            # Handle tags
            if tags:
                for tag_name in tags:
                    tag_name = tag_name.strip().lower()
                    if not tag_name: continue
                    
                    tag = session.exec(select(Tag).where(Tag.name == tag_name)).first()
                    if not tag:
                        tag = Tag(name=tag_name)
                        session.add(tag)
                        session.commit()
                        session.refresh(tag)
                    
                    # Link tag
                    task_tag = TaskTag(task_id=todo.id, tag_id=tag.id)
                    session.add(task_tag)
                session.commit()

            # Publish Event (Simple version for tool)
            try:
                event_publisher = get_event_publisher()
                event_publisher.publish_task_created({
                    "id": todo.id,
                    "user_id": user_id,
                    "title": todo.title,
                    "priority": todo.priority.value
                })
            except Exception as e:
                logger.warning(f"Failed to publish event: {e}")

            return {
                "task_id": todo.id, 
                "status": "created", 
                "title": todo.title,
                "priority": todo.priority.value,
                "due_date": todo.due_date.isoformat() if todo.due_date else None,
                "tags": tags or []
            }
    except Exception as e:
        logger.error(f"Error in add_task skill: {e}")
        return {"error": str(e)}

def update_task(
    user_id: str, 
    task_id: int, 
    title: Optional[str] = None, 
    description: Optional[str] = None,
    priority: Optional[str] = None,
    due_date: Optional[str] = None,
    completed: Optional[bool] = None,
    recurrence_pattern: Optional[str] = None,
    reminder_time: Optional[str] = None
) -> dict:
    """Update an existing task."""
    try:
        with Session(engine) as session:
            todo = session.exec(
                select(Todo).where(Todo.id == task_id, Todo.user_id == user_id)
            ).first()
            if not todo:
                return {"error": f"Task with ID {task_id} not found."}
            
            if title is not None: todo.title = title
            if description is not None: todo.description = description
            if completed is not None: todo.completed = completed
            if recurrence_pattern is not None: todo.recurrence_pattern = recurrence_pattern
            
            if priority:
                try:
                    todo.priority = Priority(priority.upper())
                except ValueError:
                    pass
            
            if due_date:
                todo.due_date = datetime.fromisoformat(due_date.replace('Z', '+00:00'))
            elif due_date == "": # Clear due date
                todo.due_date = None
                
            if reminder_time:
                todo.reminder_time = datetime.fromisoformat(reminder_time.replace('Z', '+00:00'))
            elif reminder_time == "": # Clear reminder
                todo.reminder_time = None

            todo.updated_at = datetime.utcnow()
            session.add(todo)
            session.commit()
            session.refresh(todo)
            
            return {"task_id": todo.id, "status": "updated", "title": todo.title}
    except Exception as e:
        logger.error(f"Error in update_task skill: {e}")
        return {"error": str(e)}

def complete_task(user_id: str, task_id: int) -> dict:
    """Mark task as complete and handle recurrence."""
    try:
        with Session(engine) as session:
            todo = session.exec(
                select(Todo).where(Todo.id == task_id, Todo.user_id == user_id)
            ).first()
            if not todo:
                return {"error": f"Task {task_id} not found."}
            
            if todo.completed:
                return {"task_id": todo.id, "status": "already_completed", "title": todo.title}
                
            todo.completed = True
            todo.updated_at = datetime.utcnow()
            session.add(todo)
            session.commit()
            
            # Handle Recurrence via Events
            if todo.recurrence_pattern:
                event_publisher = get_event_publisher()
                task_dict = {
                    "id": todo.id,
                    "user_id": todo.user_id,
                    "title": todo.title,
                    "recurrence_pattern": todo.recurrence_pattern,
                    "updated_at": todo.updated_at,
                }
                # Publish event - the Recurrence Agent in routes/events.py will handle creation
                event_publisher.publish_task_completed(task_dict)

            return {"task_id": todo.id, "status": "completed", "title": todo.title}

    except Exception as e:
        logger.error(f"Error in complete_task skill: {e}")
        return {"error": str(e)}

def delete_task(user_id: str, task_id: int) -> dict:
    """Delete a task."""
    try:
        with Session(engine) as session:
            todo = session.exec(
                select(Todo).where(Todo.id == task_id, Todo.user_id == user_id)
            ).first()
            if not todo:
                return {"error": f"Task {task_id} not found."}
            
            title = todo.title
            session.delete(todo)
            session.commit()
            return {"task_id": task_id, "status": "deleted", "title": title}
    except Exception as e:
        logger.error(f"Error in delete_task skill: {e}")
        return {"error": str(e)}
