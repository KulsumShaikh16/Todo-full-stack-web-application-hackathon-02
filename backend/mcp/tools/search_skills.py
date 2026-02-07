"""Search and filtering skills for FocusFlow AI."""

from typing import Optional, List
from sqlmodel import Session, select, or_
import logging

try:
    from models import Todo, Tag, TaskTag, Priority
    from db import engine
except ImportError:
    import sys
    import os
    sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    from models import Todo, Tag, TaskTag, Priority
    from db import engine

logger = logging.getLogger(__name__)

def list_tasks(
    user_id: str, 
    status: str = "all", 
    priority: Optional[str] = None,
    tags: Optional[List[str]] = None
) -> list:
    """List tasks with Phase 5 filters."""
    try:
        with Session(engine) as session:
            query = select(Todo).where(Todo.user_id == user_id)
            
            if status == "pending":
                query = query.where(Todo.completed == False)
            elif status == "completed":
                query = query.where(Todo.completed == True)
            
            if priority:
                try:
                    prio = Priority(priority.upper())
                    query = query.where(Todo.priority == prio)
                except ValueError:
                    pass
            
            if tags:
                # This is a bit complex in SQLModel/SQLAlchemy for many-to-many
                # filtering for tasks that have ALL tags in the list
                for tag_name in tags:
                    tag_name = tag_name.strip().lower()
                    query = (
                        query
                        .join(TaskTag, TaskTag.task_id == Todo.id)
                        .join(Tag, Tag.id == TaskTag.tag_id)
                        .where(Tag.name == tag_name)
                    )

            tasks = session.exec(query).all()
            
            # Helper to get tags for each task
            results = []
            for t in tasks:
                # Get tags for this task
                tag_query = (
                    select(Tag.name)
                    .join(TaskTag, TaskTag.tag_id == Tag.id)
                    .where(TaskTag.task_id == t.id)
                )
                task_tags = session.exec(tag_query).all()
                
                results.append({
                    "id": t.id, 
                    "title": t.title, 
                    "completed": t.completed,
                    "priority": t.priority.value,
                    "due_date": t.due_date.isoformat() if t.due_date else None,
                    "tags": list(task_tags),
                    "is_overdue": t.is_overdue
                })
            return results
    except Exception as e:
        logger.error(f"Error in list_tasks skill: {e}")
        return [{"error": str(e)}]

def search_tasks(user_id: str, query_text: str) -> list:
    """Search tasks by title or description."""
    try:
        with Session(engine) as session:
            search_pattern = f"%{query_text}%"
            query = select(Todo).where(
                Todo.user_id == user_id,
                or_(
                    Todo.title.ilike(search_pattern),
                    Todo.description.ilike(search_pattern)
                )
            )
            tasks = session.exec(query).all()
            
            results = []
            for t in tasks:
                tag_query = (
                    select(Tag.name)
                    .join(TaskTag, TaskTag.tag_id == Tag.id)
                    .where(TaskTag.task_id == t.id)
                )
                task_tags = session.exec(tag_query).all()
                
                results.append({
                    "id": t.id, 
                    "title": t.title, 
                    "completed": t.completed,
                    "priority": t.priority.value,
                    "tags": list(task_tags)
                })
            return results
    except Exception as e:
        logger.error(f"Error in search_tasks skill: {e}")
        return [{"error": str(e)}]
