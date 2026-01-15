from sqlmodel import Session, select
import logging
try:
    from models import Todo
    from db import engine
except ImportError:
    import sys
    import os
    sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    from models import Todo
    from db import engine

logger = logging.getLogger(__name__)

def add_task(user_id: str, title: str, description: str = None) -> dict:
    """Create a new task for the user."""
    try:
        with Session(engine) as session:
            todo = Todo(user_id=user_id, title=title, description=description)
            session.add(todo)
            session.commit()
            session.refresh(todo)
            return {"task_id": todo.id, "status": "created", "title": todo.title}
    except Exception as e:
        logger.error(f"Error in add_task tool: {e}")
        return {"error": str(e)}

def list_tasks(user_id: str, status: str = "all") -> list:
    """List tasks for the user with optional status filter."""
    try:
        with Session(engine) as session:
            query = select(Todo).where(Todo.user_id == user_id)
            if status == "pending":
                query = query.where(Todo.completed == False)
            elif status == "completed":
                query = query.where(Todo.completed == True)
            tasks = session.exec(query).all()
            return [{"id": t.id, "title": t.title, "completed": t.completed} for t in tasks]
    except Exception as e:
        logger.error(f"Error in list_tasks tool: {e}")
        return [{"error": str(e)}]

def complete_task(user_id: str, task_id: int) -> dict:
    """Mark a task as complete."""
    try:
        with Session(engine) as session:
            todo = session.exec(
                select(Todo).where(Todo.id == task_id, Todo.user_id == user_id)
            ).first()
            if not todo:
                return {"error": f"Task with ID {task_id} not found for this user"}
            todo.completed = True
            session.add(todo)
            session.commit()
            return {"task_id": todo.id, "status": "completed", "title": todo.title}
    except Exception as e:
        logger.error(f"Error in complete_task tool: {e}")
        return {"error": str(e)}

def delete_task(user_id: str, task_id: int) -> dict:
    """Delete a task."""
    try:
        with Session(engine) as session:
            todo = session.exec(
                select(Todo).where(Todo.id == task_id, Todo.user_id == user_id)
            ).first()
            if not todo:
                return {"error": f"Task with ID {task_id} not found for this user"}
            title = todo.title
            session.delete(todo)
            session.commit()
            return {"task_id": task_id, "status": "deleted", "title": title}
    except Exception as e:
        logger.error(f"Error in delete_task tool: {e}")
        return {"error": str(e)}

def update_task(user_id: str, task_id: int, title: str = None, description: str = None) -> dict:
    """Update a task's title or description."""
    try:
        with Session(engine) as session:
            todo = session.exec(
                select(Todo).where(Todo.id == task_id, Todo.user_id == user_id)
            ).first()
            if not todo:
                return {"error": f"Task with ID {task_id} not found for this user"}
            if title is not None:
                todo.title = title
            if description is not None:
                todo.description = description
            session.add(todo)
            session.commit()
            return {"task_id": todo.id, "status": "updated", "title": todo.title}
    except Exception as e:
        logger.error(f"Error in update_task tool: {e}")
        return {"error": str(e)}
