"""Event Subscription Router for Dapr.

This router handles incoming events from Dapr Pub/Sub.
"""

import logging
from fastapi import APIRouter, Request, BackgroundTasks
from services.recurrence_service import get_recurrence_service
from services.event_publisher import get_event_publisher

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/events", tags=["events"])


@router.post("/task-events")
async def handle_task_events(request: Request, background_tasks: BackgroundTasks):
    """
    Main Event Consumer (Agent Gateway).
    Handles all task-related events and dispatches to specific logic.
    """
    try:
        event = await request.json()
        event_type = event.get("type")
        event_data = event.get("data", {})
        
        # 🟢 AGENT 1: Audit Service (Requirement: Activity/Audit Log)
        # Every task operation publishes here. We log for the complete history.
        logger.info(f"📋 [AUDIT AGENT] Observed Event: {event_type} | ID: {event.get('id', 'N/A')}")
        logger.info(f"   > User {event_data.get('user_id')} performed action on Task {event_data.get('task_id')}")
        
        # 🟢 AGENT 2: Recurring Task Service (Consumer)
        # Requirement: When a recurring task is marked complete, auto-create next occurrence.
        if event_type == "com.todo.task.completed" and event_data.get("recurrence_pattern"):
            logger.info(f"🔄 [RECURRENCE AGENT] Processing completed recurring task {event_data.get('task_id')}...")
            
            # This logic is triggered asynchronously by the event
            from db import Session, engine
            from models import Todo
            from services.recurrence_service import get_recurrence_service
            from routes.tasks import get_task_tags, add_tags_to_task
            
            with Session(engine) as session:
                # 1. Get the original task with full data
                task_id = event_data.get("task_id")
                user_id = event_data.get("user_id")
                task = session.get(Todo, task_id)
                
                if task and task.recurrence_pattern:
                    recurrence_service = get_recurrence_service()
                    
                    # Convert to dict for service
                    task_dict = {
                        "id": task.id,
                        "title": task.title,
                        "description": task.description,
                        "priority": task.priority.value,
                        "due_date": task.due_date,
                        "recurrence_pattern": task.recurrence_pattern,
                        "reminder_time": task.reminder_time,
                        "user_id": task.user_id,
                    }
                    
                    next_instance_data = recurrence_service.create_next_instance_data(task_dict)
                    
                    if next_instance_data:
                        next_task = Todo(**next_instance_data)
                        session.add(next_task)
                        session.commit()
                        session.refresh(next_task)
                        
                        # Copy tags (Agent should handle related data)
                        current_tags = get_task_tags(task.id, session)
                        if current_tags:
                            add_tags_to_task(next_task.id, current_tags, session)
                        
                        logger.info(f"✅ [RECURRENCE AGENT] Spun up next instance: Task {next_task.id} (Due: {next_task.due_date})")
                        
                        # Publish recurrence trigger event
                        event_publisher = get_event_publisher()
                        event_publisher.publish_recurrence_triggered(
                            task_dict,
                            {
                                "id": next_task.id,
                                "due_date": next_task.due_date,
                                "user_id": next_task.user_id,
                            },
                            background_tasks
                        )

        # 🟢 AGENT 4: WebSocket Sync Service (Consumer)
        # Requirement: Changes from one client are broadcast to all connected clients in real-time.
        # We broadcast any task change to the specific user's connections.
        if event_type and event_type.startswith("com.todo.task."):
            from services.websocket_manager import get_websocket_manager
            ws_manager = get_websocket_manager()
            user_id = event_data.get("user_id")
            if user_id:
                # Dispatch broadcast in background to not block the event handler
                background_tasks.add_task(
                    ws_manager.broadcast_to_user,
                    user_id,
                    {
                        "type": "TASK_UPDATE",
                        "event": event_type,
                        "data": event_data
                    }
                )
                logger.info(f"📡 [SYNC AGENT] Queued broadcast for User {user_id} (Event: {event_type})")

        return {"status": "SUCCESS"}

    except Exception as e:
        logger.error(f"❌ Error in Event Agent Gateway: {str(e)}")
        import traceback
        logger.error(traceback.format_exc())
        return {"status": "FAILURE", "error": str(e)}


@router.post("/reminders")
async def handle_reminder_events(request: Request):
    """
    🟢 AGENT 3: Notification Service (Consumer).
    Handles reminder triggers from Dapr Jobs API or direct events.
    """
    try:
        event = await request.json()
        # Dapr Jobs API might send data directly if it was a scheduled job
        # Or a standard CloudEvent if coming from Pub/Sub
        event_data = event.get("data", event)
        
        user_id = event_data.get('user_id')
        task_id = event_data.get('task_id')
        title = event_data.get('title', 'Your task')
        
        logger.info(f"🔔 [NOTIFICATION AGENT] Alerting User {user_id}...")
        logger.info(f"📢 [PUSH]: Your task '{title}' is due now! (Task ID: {task_id})")
        
        # In production, this would call FCM (Push), SendGrid (Email), or Twilio (SMS)
        
        return {"status": "SUCCESS"}
    except Exception as e:
        logger.error(f"❌ Error in Notification Agent: {str(e)}")
        return {"status": "FAILURE", "error": str(e)}

