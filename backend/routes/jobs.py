"""Jobs Callback Router for Dapr Jobs API triggers."""

import logging
from fastapi import APIRouter, Request, Depends
from services.event_publisher import get_event_publisher, EventPublisher

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/jobs", tags=["jobs"])


@router.post("/trigger")
async def handle_job_trigger(
    request: Request,
    event_publisher: EventPublisher = Depends(get_event_publisher)
):
    """Callback endpoint for Dapr Jobs API.
    
    This is called by Dapr at the scheduled time.
    """
    try:
        job_data = await request.json()
        logger.info(f"🔔 Received Dapr Job trigger: {job_data}")
        
        # Extract payload data
        data = job_data.get("data", {})
        job_type = data.get("type", "unknown")
        
        if job_type == "reminder":
            task_id = data.get("task_id")
            user_id = data.get("user_id")
            
            logger.info(f"⏰ Reminder fired for Task {task_id} (User {user_id})")
            
            # Publish event to Kafka via Dapr Pub/Sub
            # This allows other services (notification, audit) to react
            event_publisher.publish_task_overdue({
                "id": task_id,
                "user_id": user_id,
                "title": "Reminder: Task is due soon!",
                "due_date": None  # We could fetch this from DB if needed
            })
            
            return {"status": "SUCCESS", "message": f"Reminder processed for task {task_id}"}
            
        else:
            logger.warning(f"⚠️ Received unknown job type: {job_type}")
            return {"status": "IGNORED", "message": f"Unknown job type: {job_type}"}
            
    except Exception as e:
        logger.error(f"❌ Error processing job trigger: {str(e)}")
        return {"status": "FAILURE", "error": str(e)}
