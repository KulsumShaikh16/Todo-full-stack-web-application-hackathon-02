"""Event Publisher Service for Phase V - Event-Driven Architecture.

This service publishes CloudEvents to Dapr Pub/Sub for all task operations.
Events are published asynchronously to avoid blocking API responses.
"""

import logging
import uuid
from datetime import datetime
from typing import Dict, List, Optional, Any
import requests
from fastapi import BackgroundTasks
from db import settings

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class EventPublisher:
    """Service for publishing CloudEvents via Dapr Pub/Sub.
    
    All events follow the CloudEvents 1.0 specification:
    https://github.com/cloudevents/spec/blob/v1.0/spec.md
    """
    
    def __init__(self, dapr_http_port: Optional[int] = None, pubsub_name: Optional[str] = None):
        """Initialize Event Publisher.
        
        Args:
            dapr_http_port: Port where Dapr sidecar is running (default: from settings)
            pubsub_name: Name of Dapr Pub/Sub component (default: from settings)
        """
        port = dapr_http_port or settings.dapr_http_port
        self.dapr_url = f"http://localhost:{port}"
        self.pubsub_name = pubsub_name or settings.dapr_pubsub_name
        self.topic = "todo.task.events"
        self.enabled = True  # Can be disabled if Dapr is not running
        
    def _create_cloud_event(self, event_type: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a CloudEvent conforming to v1.0 spec.
        
        Args:
            event_type: Event type (e.g., "com.todo.task.created")
            data: Event data payload
            
        Returns:
            CloudEvent dictionary
        """
        return {
            "specversion": "1.0",
            "id": str(uuid.uuid4()),
            "source": "todo-backend",
            "type": event_type,
            "datacontenttype": "application/json",
            "time": datetime.utcnow().isoformat() + "Z",
            "data": data
        }
    
    def _publish_to_dapr(self, event: Dict[str, Any]) -> None:
        """Publish event to Dapr Pub/Sub (async, non-blocking).
        
        Args:
            event: CloudEvent to publish
        """
        if not self.enabled:
            logger.warning(f"Event publishing disabled - Event: {event['type']}")
            return
            
        try:
            url = f"{self.dapr_url}/v1.0/publish/{self.pubsub_name}/{self.topic}"
            response = requests.post(
                url,
                json=event,
                timeout=5  # 5 second timeout
            )
            
            if response.status_code == 200:
                logger.info(f"✅ Published event: {event['type']} (ID: {event['id'][:8]}...)")
            else:
                logger.error(f"❌ Failed to publish event: {event['type']} - Status: {response.status_code}")
                
        except requests.exceptions.ConnectionError:
            logger.warning(f"⚠️  Dapr not available - Event not published: {event['type']}")
            logger.info("To enable events, run backend with Dapr: dapr run --app-id todo-backend --app-port 8000 --dapr-http-port 3500 -- python run_server.py")
        except Exception as e:
            logger.error(f"❌ Error publishing event {event['type']}: {str(e)}")
    
    # ============================================
    # Task Lifecycle Events
    # ============================================
    
    def publish_task_created(self, task: Dict[str, Any], background_tasks: Optional[BackgroundTasks] = None) -> None:
        """Publish task.created event.
        
        Args:
            task: Task data (dict or Todo model converted to dict)
            background_tasks: FastAPI BackgroundTasks for async execution
        """
        event = self._create_cloud_event(
            event_type="com.todo.task.created",
            data={
                "task_id": task.get("id"),
                "user_id": task.get("user_id"),
                "title": task.get("title"),
                "priority": task.get("priority"),
                "tags": task.get("tags", []),
                "due_date": task.get("due_date").isoformat() if task.get("due_date") else None,
                "recurrence_pattern": task.get("recurrence_pattern"),
                "completed": task.get("completed", False),
                "created_at": task.get("created_at").isoformat() if task.get("created_at") else None,
            }
        )
        
        if background_tasks:
            background_tasks.add_task(self._publish_to_dapr, event)
        else:
            self._publish_to_dapr(event)
    
    def publish_task_updated(
        self,
        task: Dict[str, Any],
        changes: Dict[str, Any],
        background_tasks: Optional[BackgroundTasks] = None
    ) -> None:
        """Publish task.updated event.
        
        Args:
            task: Updated task data
            changes: Dictionary of fields that changed
            background_tasks: FastAPI BackgroundTasks for async execution
        """
        event = self._create_cloud_event(
            event_type="com.todo.task.updated",
            data={
                "task_id": task.get("id"),
                "user_id": task.get("user_id"),
                "title": task.get("title"),
                "changes": changes,
                "updated_at": task.get("updated_at").isoformat() if task.get("updated_at") else None,
            }
        )
        
        if background_tasks:
            background_tasks.add_task(self._publish_to_dapr, event)
        else:
            self._publish_to_dapr(event)
    
    def publish_task_completed(self, task: Dict[str, Any], background_tasks: Optional[BackgroundTasks] = None) -> None:
        """Publish task.completed event.
        
        This event triggers recurring task creation if task has recurrence_pattern.
        
        Args:
            task: Completed task data
            background_tasks: FastAPI BackgroundTasks for async execution
        """
        event = self._create_cloud_event(
            event_type="com.todo.task.completed",
            data={
                "task_id": task.get("id"),
                "user_id": task.get("user_id"),
                "title": task.get("title"),
                "recurrence_pattern": task.get("recurrence_pattern"),
                "completed_at": task.get("updated_at").isoformat() if task.get("updated_at") else None,
            }
        )
        
        if background_tasks:
            background_tasks.add_task(self._publish_to_dapr, event)
        else:
            self._publish_to_dapr(event)
    
    def publish_task_deleted(
        self,
        task_id: int,
        user_id: str,
        background_tasks: Optional[BackgroundTasks] = None
    ) -> None:
        """Publish task.deleted event.
        
        Args:
            task_id: ID of deleted task
            user_id: Owner of the task
            background_tasks: FastAPI BackgroundTasks for async execution
        """
        event = self._create_cloud_event(
            event_type="com.todo.task.deleted",
            data={
                "task_id": task_id,
                "user_id": user_id,
                "deleted_at": datetime.utcnow().isoformat() + "Z",
            }
        )
        
        if background_tasks:
            background_tasks.add_task(self._publish_to_dapr, event)
        else:
            self._publish_to_dapr(event)
    
    # ============================================
    # Field-Specific Change Events
    # ============================================
    
    def publish_priority_changed(
        self,
        task: Dict[str, Any],
        old_priority: str,
        new_priority: str,
        background_tasks: Optional[BackgroundTasks] = None
    ) -> None:
        """Publish task.priority.changed event.
        
        Args:
            task: Task data
            old_priority: Previous priority value
            new_priority: New priority value
            background_tasks: FastAPI BackgroundTasks for async execution
        """
        event = self._create_cloud_event(
            event_type="com.todo.task.priority.changed",
            data={
                "task_id": task.get("id"),
                "user_id": task.get("user_id"),
                "old_priority": old_priority,
                "new_priority": new_priority,
                "changed_at": datetime.utcnow().isoformat() + "Z",
            }
        )
        
        if background_tasks:
            background_tasks.add_task(self._publish_to_dapr, event)
        else:
            self._publish_to_dapr(event)
    
    def publish_tags_updated(
        self,
        task: Dict[str, Any],
        added_tags: List[str],
        removed_tags: List[str],
        background_tasks: Optional[BackgroundTasks] = None
    ) -> None:
        """Publish task.tags.updated event.
        
        Args:
            task: Task data
            added_tags: List of tags that were added
            removed_tags: List of tags that were removed
            background_tasks: FastAPI BackgroundTasks for async execution
        """
        event = self._create_cloud_event(
            event_type="com.todo.task.tags.updated",
            data={
                "task_id": task.get("id"),
                "user_id": task.get("user_id"),
                "added_tags": added_tags,
                "removed_tags": removed_tags,
                "current_tags": task.get("tags", []),
                "updated_at": datetime.utcnow().isoformat() + "Z",
            }
        )
        
        if background_tasks:
            background_tasks.add_task(self._publish_to_dapr, event)
        else:
            self._publish_to_dapr(event)
    
    # ============================================
    # Advanced Feature Events
    # ============================================
    
    def publish_task_overdue(self, task: Dict[str, Any], background_tasks: Optional[BackgroundTasks] = None) -> None:
        """Publish task.overdue event.
        
        Args:
            task: Overdue task data
            background_tasks: FastAPI BackgroundTasks for async execution
        """
        event = self._create_cloud_event(
            event_type="com.todo.task.overdue",
            data={
                "task_id": task.get("id"),
                "user_id": task.get("user_id"),
                "title": task.get("title"),
                "due_date": task.get("due_date").isoformat() if task.get("due_date") else None,
                "overdue_since": datetime.utcnow().isoformat() + "Z",
            }
        )
        
        if background_tasks:
            background_tasks.add_task(self._publish_to_dapr, event)
        else:
            self._publish_to_dapr(event)
    
    def publish_recurrence_triggered(
        self,
        old_task: Dict[str, Any],
        new_task: Dict[str, Any],
        background_tasks: Optional[BackgroundTasks] = None
    ) -> None:
        """Publish task.recurrence.triggered event.
        
        Args:
            old_task: Completed recurring task
            new_task: Newly created next instance
            background_tasks: FastAPI BackgroundTasks for async execution
        """
        event = self._create_cloud_event(
            event_type="com.todo.task.recurrence.triggered",
            data={
                "completed_task_id": old_task.get("id"),
                "new_task_id": new_task.get("id"),
                "user_id": old_task.get("user_id"),
                "recurrence_pattern": old_task.get("recurrence_pattern"),
                "old_due_date": old_task.get("due_date").isoformat() if old_task.get("due_date") else None,
                "new_due_date": new_task.get("due_date").isoformat() if new_task.get("due_date") else None,
                "triggered_at": datetime.utcnow().isoformat() + "Z",
            }
        )
        
        if background_tasks:
            background_tasks.add_task(self._publish_to_dapr, event)
        else:
            self._publish_to_dapr(event)


# Singleton instance
_event_publisher: Optional[EventPublisher] = None


def get_event_publisher() -> EventPublisher:
    """Get or create EventPublisher singleton.
    
    Returns:
        EventPublisher instance
    """
    global _event_publisher
    if _event_publisher is None:
        _event_publisher = EventPublisher(
            dapr_http_port=settings.dapr_http_port,
            pubsub_name=settings.dapr_pubsub_name
        )
    return _event_publisher
