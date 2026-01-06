"""Database configuration and session management for SQLModel with Neon PostgreSQL."""

import logging
from pathlib import Path
from typing import Generator
from sqlmodel import create_engine, Session, SQLModel, select, text
from pydantic_settings import BaseSettings, SettingsConfigDict
from models import User, Todo
import uuid
from passlib.context import CryptContext


# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Password hashing context for seeding
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    model_config = SettingsConfigDict(
        env_file=Path(__file__).parent / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    database_url: str
    better_auth_secret: str
    backend_host: str = "0.0.0.0"
    backend_port: int = 8000
    cors_origins: str = "http://localhost:3000,http://127.0.0.1:3000"
    jwt_expiration_minutes: int = 60  # Token expires after 60 minutes


settings = Settings()

# Create SQLModel engine for Neon PostgreSQL
engine_args = {
    "echo": False,  # Set to True for debugging
    "pool_pre_ping": True,  # Enable connection health checks
}

# Add pool settings only for PostgreSQL (not SQLite for testing)
if "postgresql" in settings.database_url.lower():
    engine_args["pool_size"] = 5
    engine_args["max_overflow"] = 10

engine = create_engine(settings.database_url, **engine_args)


def get_db() -> Generator[Session, None, None]:
    """Dependency that provides a database session."""
    with Session(engine) as session:
        try:
            yield session
        finally:
            session.close()


def init_db() -> None:
    """Initialize database tables and seed with test data."""
    # Check if database connection is successful
    try:
        with Session(engine) as session:
            # Test basic connection
            session.exec(text("SELECT 1"))
        logger.info("Database connection successful")
    except Exception as e:
        logger.error(f"Database connection failed: {e}")
        raise

    # Create tables - this will create or update tables according to model
    # Use checkfirst=True to handle existing tables properly
    SQLModel.metadata.create_all(engine)
    logger.info("Database tables created or already exist")

    # Small delay to ensure tables are ready
    import time
    time.sleep(2)

    # Seed database with test data (idempotent)
    seed_test_data()


def seed_test_data() -> None:
    """Seed the database with a test user and sample todos."""
    try:
        with Session(engine) as session:
            # Check if test user already exists
            test_user_email = "test@example.com"
            existing_user = session.exec(select(User).where(User.email == test_user_email)).first()

            if existing_user:
                logger.info("Test user already exists, skipping seeding")
                return

            # Create test user
            user_id = str(uuid.uuid4())
            test_user = User(
                id=user_id,
                email=test_user_email,
                password_hash=pwd_context.hash("password"),  # Properly hashed "password"
                name="Test User"
            )
            session.add(test_user)
            session.commit()
            session.refresh(test_user)
            logger.info(f"Created test user with ID: {test_user.id}")

            # Create 3 sample todos for the test user
            sample_todos = [
                Todo(
                    user_id=test_user.id,
                    title="Complete project setup",
                    description="Set up the initial project structure and dependencies",
                    completed=False
                ),
                Todo(
                    user_id=test_user.id,
                    title="Implement authentication",
                    description="Create login and signup functionality",
                    completed=True
                ),
                Todo(
                    user_id=test_user.id,
                    title="Add task management",
                    description="Implement CRUD operations for tasks",
                    completed=False
                )
            ]

            for todo in sample_todos:
                session.add(todo)

            session.commit()
            logger.info(f"Added 3 sample todos for test user")
    except Exception as e:
        # If seeding fails (e.g., due to schema mismatch), log and continue
        logger.warning(f"Database seeding failed (may be due to schema mismatch): {e}")
        logger.info("Continuing startup without seeding")
