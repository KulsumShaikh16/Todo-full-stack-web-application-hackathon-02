"""Overdue Service for Phase V - Task Monitoring.

This service identifies overdue tasks and triggers events.
"""

import logging
from typing import List
from datetime import datetime
from sqlmodel import Session, select

from models import Todo
from .event_publisher import get_event_publisher

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class OverdueService:
    """Service for managing overdue tasks."""
    
    def __init__(self, db: Session):
        self.db = db
        self.event_publisher = get_event_publisher()

    def check_and_publish_overdue_tasks(self) -> int:
        """Find overdue tasks and publish events.
        
        Returns:
            Number of overdue tasks found
        """
        logger.info("Running overdue task check...")
        
        # Find tasks that are:
        # 1. Past due date
        # 2. Not completed
        # 3. Not already marked as is_overdue (to avoid spamming events)
        # Note: is_overdue is a computed property, but for this service we might want 
        # to track if we've already notified to avoid repeated notifications.
        # However, sticking to the spec, we will find all overdue tasks.
        # To emulate state tracking without a DB field 'notification_sent', 
        # we will just log them for now. In a real production system, 
        # we would update a 'last_notification_sent_at' field.
        
        # Since 'is_overdue' is computed, we query valid tasks and check logic in python or query.
        now = datetime.utcnow()
        query = select(Todo).where(
            Todo.due_date < now,
            Todo.completed == False
        )
        
        tasks = self.db.exec(query).all()
        count = 0
        
        for task in tasks:
            # publish event
            task_dict = {
                "id": task.id,
                "user_id": task.user_id,
                "title": task.title,
                "due_date": task.due_date,
            }
            # We don't have BackgroundTasks context here usually, so we call directly
            # The publisher handles async offloading if configured, blocking otherwise.
            # Ideally we run this in a background job queue.
            self.event_publisher.publish_task_overdue(task_dict)
            count += 1
            
        if count > 0:
            logger.info(f" फाउंड {count} overdue tasks, published events.")
        
        return count


from db import engine

def get_overdue_service(db: Session) -> OverdueService:
    """Get an OverdueService instance."""
    return OverdueService(db)

def check_overdue_tasks_job():
    """Job function to be called by scheduler."""
    with Session(engine) as session:
        service = get_overdue_service(session)
        service.check_and_publish_overdue_tasks()


