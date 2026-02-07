"""FastAPI application for Todo backend with JWT authentication."""

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from db import init_db, settings
from routes.tasks import router as tasks_router
from routes.auth import router as auth_router
from routes.chat import router as chat_router
from routes.tags import router as tags_router  # Phase V
from routes.jobs import router as jobs_router  # Phase V
from routes.events import router as events_router  # Phase V
from routes.websocket import router as ws_router  # Phase V

# Phase V: Event-driven architecture
from services.event_publisher import get_event_publisher
from services.overdue_service import check_overdue_tasks_job
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Scheduler instance
scheduler = BackgroundScheduler()

# Configure CORS
# Process CORS origins to handle various common formats
cors_origins_list = []
if settings.cors_origins:
    for origin in settings.cors_origins.split(","):
        trimmed = origin.strip().rstrip("/").lower()
        if trimmed:
            cors_origins_list.append(trimmed)
            # Add both http and https versions if not specified, 
            # and both localhost and 127.0.0.1
            if "localhost" in trimmed:
                cors_origins_list.append(trimmed.replace("localhost", "127.0.0.1"))
            elif "127.0.0.1" in trimmed:
                cors_origins_list.append(trimmed.replace("127.0.0.1", "localhost"))

# Ensure we don't have duplicates
cors_origins_list = list(set(cors_origins_list))

# Add the Vercel frontend domain to allow requests from the deployed frontend
vercel_domain = "https://todo-full-stack-web-application-pha.vercel.app"
if vercel_domain not in cors_origins_list:
    cors_origins_list.append(vercel_domain)

# Also add common development origins if not already present
dev_origins = ["http://localhost:3000", "http://127.0.0.1:3000"]
for origin in dev_origins:
    if origin not in cors_origins_list:
        cors_origins_list.append(origin)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler for startup/shutdown events."""
    # Startup: Initialize database tables
    logger.info("Starting up Todo API application...")
    init_db()
    
    # Phase V: Initialize event publisher
    event_publisher = get_event_publisher()
    logger.info(f"✅ Event Publisher initialized (Dapr: {event_publisher.dapr_url})")
    
    # Phase V: Start Scheduler
    try:
        scheduler.add_job(
            check_overdue_tasks_job,
            trigger=IntervalTrigger(hours=1),  # Run every hour
            id="check_overdue_tasks",
            name="Check for overdue tasks",
            replace_existing=True,
        )
        scheduler.start()
        logger.info("✅ APScheduler started for background jobs")
    except Exception as e:
        logger.error(f"❌ Failed to start scheduler: {e}")

    logger.info("Todo API application startup completed")
    logger.info("--- CORS Configuration ---")
    logger.info(f"Raw origins string: '{settings.cors_origins}'")
    logger.info(f"Processed origins list: {cors_origins_list}")
    logger.info("---------------------------")
    yield
    # Shutdown: Clean up if needed
    logger.info("Shutting down Todo API application...")
    scheduler.shutdown()


app = FastAPI(
    title="Todo API",
    description="RESTful API for Todo application with JWT authentication",
    version="1.0.0",
    lifespan=lifespan,
)

# Add request logging middleware
@app.middleware("http")
async def log_requests(request, call_next):
    logger.info(f"Incoming request: {request.method} {request.url}")
    # Only log headers for OPTIONS or if specifically debugging to avoid log bloat
    if request.method == "OPTIONS":
        logger.info(f"OPTIONS Headers: {dict(request.headers)}")
    
    response = await call_next(request)
    
    if response.status_code >= 400:
        logger.warning(f"Response status: {response.status_code} for {request.method} {request.url}")
        
    return response

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(tasks_router)
app.include_router(chat_router)
app.include_router(tags_router)  # Phase V
app.include_router(jobs_router)  # Phase V
app.include_router(events_router)  # Phase V
app.include_router(ws_router)    # Phase V


@app.get("/health")
async def health_check():
    """Health check endpoint for load balancers and monitoring."""
    return {"status": "healthy", "version": "1.0.0"}


@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "name": "Todo API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health",
    }


# ============================================
# Phase V: Dapr Integration Endpoints
# ============================================

@app.get("/dapr/subscribe")
async def dapr_subscribe():
    """Dapr subscription endpoint.
    
    Returns list of topics this app subscribes to.
    """
    return [
        {
            "pubsubname": settings.dapr_pubsub_name,
            "topic": "todo.task.events",
            "route": "/api/events/task-events"
        },
        {
            "pubsubname": settings.dapr_pubsub_name,
            "topic": "todo.task.reminders",
            "route": "/api/events/reminders"
        }
    ]


@app.get("/dapr/config")
async def dapr_config():
    """Dapr configuration endpoint for diagnostics."""
    event_publisher = get_event_publisher()
    return {
        "dapr_url": event_publisher.dapr_url,
        "pubsub_name": event_publisher.pubsub_name,
        "topic": event_publisher.topic,
        "enabled": event_publisher.enabled,
    }

