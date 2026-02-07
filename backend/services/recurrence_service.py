"""Recurrence Service for Phase V - Recurring Tasks.

This service handles the creation of next instances for recurring tasks.
"""

import logging
from datetime import datetime, timedelta
from typing import Optional
from dateutil.relativedelta import relativedelta

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class RecurrenceService:
    """Service for managing recurring task logic."""
    
    @staticmethod
    def calculate_next_due_date(pattern: str, current_due_date: datetime) -> Optional[datetime]:
        """Calculate the next due date based on recurrence pattern.
        
        Args:
            pattern: Recurrence pattern ("daily", "weekly", "monthly")
            current_due_date: Current due date
            
        Returns:
            Next due date, or None if pattern invalid
        """
        if not pattern or not current_due_date:
            return None
        
        pattern = pattern.lower().strip()
        
        try:
            if pattern == "daily":
                return current_due_date + timedelta(days=1)
            
            elif pattern == "weekly":
                return current_due_date + timedelta(weeks=1)
            
            elif pattern == "monthly":
                # Use relativedelta to handle month-end dates properly
                next_date = current_due_date + relativedelta(months=1)
                return next_date
            
            else:
                logger.warning(f"Unknown recurrence pattern: {pattern}")
                return None
                
        except Exception as e:
            logger.error(f"Error calculating next due date: {str(e)}")
            return None
    
    @staticmethod
    def create_next_instance_data(completed_task: dict) -> Optional[dict]:
        """Create data for next recurring task instance.
        
        Args:
            completed_task: Dictionary of completed task data
            
        Returns:
            Dictionary with data for new task, or None if not recurring
        """
        recurrence_pattern = completed_task.get("recurrence_pattern")
        current_due_date = completed_task.get("due_date")
        
        if not recurrence_pattern:
            logger.info(f"Task {completed_task.get('id')} has no recurrence pattern")
            return None
        
        # Calculate next due date
        next_due_date = RecurrenceService.calculate_next_due_date(
            recurrence_pattern,
            current_due_date
        )
        
        if not next_due_date:
            logger.warning(f"Could not calculate next due date for task {completed_task.get('id')}")
            return None
        
        # Calculate next reminder time if original had one
        next_reminder_time = None
        if completed_task.get("reminder_time") and current_due_date:
            # Maintain the same time difference
            time_diff = current_due_date - completed_task["reminder_time"]
            next_reminder_time = next_due_date - time_diff
        
        # Create new task data (copy from completed task)
        new_task_data = {
            "title": completed_task.get("title"),
            "description": completed_task.get("description"),
            "priority": completed_task.get("priority"),
            "due_date": next_due_date,
            "recurrence_pattern": recurrence_pattern,
            "reminder_time": next_reminder_time,
            "completed": False,  # New task is not completed
            "user_id": completed_task.get("user_id"),
        }
        
        logger.info(
            f"✅ Created next instance data for recurring task: "
            f"{completed_task.get('title')} (next due: {next_due_date.isoformat()})"
        )
        
        return new_task_data


# Singleton instance
_recurrence_service: Optional[RecurrenceService] = None


def get_recurrence_service() -> RecurrenceService:
    """Get or create RecurrenceService singleton.
    
    Returns:
        RecurrenceService instance
    """
    global _recurrence_service
    if _recurrence_service is None:
        _recurrence_service = RecurrenceService()
    return _recurrence_service
