"""Jobs Service for Phase V - Dapr Jobs API integration.

This service manages exact-time scheduling of reminders using the Dapr Jobs API.
"""

import logging
import requests
from datetime import datetime
from typing import Optional, Any, Dict
from db import settings

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class JobsService:
    """Service for interacting with the Dapr Jobs API."""
    
    def __init__(self, dapr_http_port: Optional[int] = None):
        """Initialize Jobs Service.
        
        Args:
            dapr_http_port: Port where Dapr sidecar is running (default: from settings)
        """
        port = dapr_http_port or settings.dapr_http_port
        self.dapr_url = f"http://localhost:{port}/v1.0-alpha1/jobs"
        self.enabled = True
        
    def schedule_reminder(self, task_id: int, remind_at: datetime, user_id: int) -> bool:
        """Schedule a reminder job via Dapr Jobs API.
        
        Args:
            task_id: ID of the task
            remind_at: When the reminder should fire
            user_id: ID of the user to notify
            
        Returns:
            True if scheduled successfully, False otherwise
        """
        job_name = f"reminder-task-{task_id}"
        
        # Dapr Jobs API expects ISO 8601 string
        # Format: CCYY-MM-DDThh:mm:ssZ
        schedule_time = remind_at.strftime("%Y-%m-%dT%H:%M:%SZ")
        
        payload = {
            "dueTime": schedule_time,
            "data": {
                "task_id": task_id,
                "user_id": user_id,
                "type": "reminder"
            }
        }
        
        try:
            url = f"{self.dapr_url}/{job_name}"
            response = requests.post(url, json=payload, timeout=5)
            
            if response.status_code in [200, 204]:
                logger.info(f"✅ Scheduled reminder for task {task_id} at {schedule_time}")
                return True
            else:
                logger.error(f"❌ Failed to schedule reminder via Dapr: {response.status_code} - {response.text}")
                return False
                
        except requests.exceptions.ConnectionError:
            logger.warning(f"⚠️ Dapr not available - Job '{job_name}' not scheduled")
            return False
        except Exception as e:
            logger.error(f"❌ Error scheduling job '{job_name}': {str(e)}")
            return False

    def delete_reminder(self, task_id: int) -> bool:
        """Delete/cancel a reminder job.
        
        Args:
            task_id: ID of the task
            
        Returns:
            True if deleted successfully, False otherwise
        """
        job_name = f"reminder-task-{task_id}"
        
        try:
            url = f"{self.dapr_url}/{job_name}"
            response = requests.delete(url, timeout=5)
            
            if response.status_code in [200, 204]:
                logger.info(f"✅ Deleted reminder job for task {task_id}")
                return True
            elif response.status_code == 404:
                # Job might have already fired or never existed
                return True
            else:
                logger.error(f"❌ Failed to delete job via Dapr: {response.status_code}")
                return False
                
        except requests.exceptions.ConnectionError:
            return False
        except Exception as e:
            logger.error(f"❌ Error deleting job '{job_name}': {str(e)}")
            return False


# Singleton instance
_jobs_service: Optional[JobsService] = None


def get_jobs_service() -> JobsService:
    """Get or create JobsService singleton.
    
    Returns:
        JobsService instance
    """
    global _jobs_service
    if _jobs_service is None:
        _jobs_service = JobsService(dapr_http_port=settings.dapr_http_port)
    return _jobs_service
