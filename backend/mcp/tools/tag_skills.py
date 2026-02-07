"""Tag management skills for FocusFlow AI."""

from typing import List
from sqlmodel import Session, select
import logging

try:
    from models import Todo, Tag, TaskTag
    from db import engine
except ImportError:
    import sys
    import os
    sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    from models import Todo, Tag, TaskTag
    from db import engine

logger = logging.getLogger(__name__)

def list_tags() -> list:
    """Retrieve all available tags."""
    try:
        with Session(engine) as session:
            tags = session.exec(select(Tag)).all()
            return [{"id": t.id, "name": t.name} for t in tags]
    except Exception as e:
        logger.error(f"Error listing tags: {e}")
        return []

def add_tags_to_task(user_id: str, task_id: int, tags: List[str]) -> dict:
    """Add multiple tags to a specific task."""
    try:
        with Session(engine) as session:
            todo = session.exec(
                select(Todo).where(Todo.id == task_id, Todo.user_id == user_id)
            ).first()
            if not todo:
                return {"error": f"Task {task_id} not found."}
            
            added = []
            for tag_name in tags:
                tag_name = tag_name.strip().lower()
                if not tag_name: continue
                
                tag = session.exec(select(Tag).where(Tag.name == tag_name)).first()
                if not tag:
                    tag = Tag(name=tag_name)
                    session.add(tag)
                    session.commit()
                    session.refresh(tag)
                
                # Check if already linked
                link = session.exec(
                    select(TaskTag).where(TaskTag.task_id == task_id, TaskTag.tag_id == tag.id)
                ).first()
                if not link:
                    task_tag = TaskTag(task_id=task_id, tag_id=tag.id)
                    session.add(task_tag)
                    added.append(tag_name)
            
            session.commit()
            return {"task_id": task_id, "added_tags": added, "status": "success"}
    except Exception as e:
        logger.error(f"Error adding tags: {e}")
        return {"error": str(e)}

def remove_tag_from_task(user_id: str, task_id: int, tag_name: str) -> dict:
    """Remove a tag from a task."""
    try:
        tag_name = tag_name.strip().lower()
        with Session(engine) as session:
            todo = session.exec(
                select(Todo).where(Todo.id == task_id, Todo.user_id == user_id)
            ).first()
            if not todo:
                return {"error": f"Task {task_id} not found."}
            
            tag = session.exec(select(Tag).where(Tag.name == tag_name)).first()
            if not tag:
                return {"error": f"Tag '{tag_name}' not found."}
            
            link = session.exec(
                select(TaskTag).where(TaskTag.task_id == task_id, TaskTag.tag_id == tag.id)
            ).first()
            if link:
                session.delete(link)
                session.commit()
                return {"task_id": task_id, "removed_tag": tag_name, "status": "success"}
            else:
                return {"error": f"Task {task_id} does not have tag '{tag_name}'."}
    except Exception as e:
        logger.error(f"Error removing tag: {e}")
        return {"error": str(e)}
