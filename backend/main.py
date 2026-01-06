"""FastAPI application for Todo backend with JWT authentication."""

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from db import init_db, settings
from routes.tasks import router as tasks_router
from routes.auth import router as auth_router

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler for startup/shutdown events."""
    # Startup: Initialize database tables
    logger.info("Starting up Todo API application...")
    init_db()
    logger.info("Todo API application startup completed")
    yield
    # Shutdown: Clean up if needed
    logger.info("Shutting down Todo API application...")


app = FastAPI(
    title="Todo API",
    description="RESTful API for Todo application with JWT authentication",
    version="1.0.0",
    lifespan=lifespan,
)

# Configure CORS
cors_origins = [origin.strip() for origin in settings.cors_origins.split(",")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(tasks_router)


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
