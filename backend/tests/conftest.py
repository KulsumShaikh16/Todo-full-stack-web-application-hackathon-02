"""Pytest configuration and fixtures for backend tests."""

import os
import sys
from datetime import datetime, timedelta
from typing import Generator
from unittest.mock import MagicMock, patch

import pytest
from fastapi.testclient import TestClient
from jose import jwt
from sqlalchemy import create_engine
from sqlalchemy.pool import StaticPool
from sqlmodel import SQLModel, Session, Field

# Set test environment before importing app modules
os.environ.setdefault("BETTER_AUTH_SECRET", "test-secret-key")
os.environ.setdefault("DATABASE_URL", "sqlite:///:memory:")
os.environ.setdefault("CORS_ORIGINS", "http://localhost:3000")

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.db import get_db, settings
from backend.main import app
from backend.models import User as UserModel
from backend.models import Todo as TodoModel


# Create in-memory SQLite engine for testing
test_engine = create_engine(
    "sqlite:///:memory:",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)


@pytest.fixture(scope="function")
def db_session() -> Generator[Session, None, None]:
    """Create a fresh database session for each test."""
    # Create tables
    SQLModel.metadata.create_all(test_engine)

    with Session(test_engine) as session:
        yield session

    # Drop all tables after test
    SQLModel.metadata.drop_all(test_engine)


@pytest.fixture(scope="function")
def client(db_session: Session) -> Generator[TestClient, None, None]:
    """Create a test client with database session override."""

    def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()


@pytest.fixture
def test_user(db_session: Session) -> UserModel:
    """Create a test user in the database."""
    user = UserModel(
        id="test-user-123",
        email="test@example.com",
        created_at=datetime.utcnow(),
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture
def test_tasks(db_session: Session, test_user: UserModel) -> list[TodoModel]:
    """Create test tasks for the test user."""
    tasks = [
        TodoModel(
            user_id=test_user.id,
            title="Task 1",
            description="Description 1",
            completed=False,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        ),
        TodoModel(
            user_id=test_user.id,
            title="Task 2",
            description="Description 2",
            completed=True,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        ),
        TodoModel(
            user_id=test_user.id,
            title="Task 3",
            description=None,
            completed=False,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        ),
    ]
    for task in tasks:
        db_session.add(task)
    db_session.commit()
    for task in tasks:
        db_session.refresh(task)
    return tasks


@pytest.fixture
def other_user(db_session: Session) -> UserModel:
    """Create another user to test isolation."""
    user = UserModel(
        id="other-user-456",
        email="other@example.com",
        created_at=datetime.utcnow(),
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture
def other_user_tasks(db_session: Session, other_user: UserModel) -> list[TodoModel]:
    """Create tasks for the other user to test isolation."""
    tasks = [
        TodoModel(
            user_id=other_user.id,
            title="Other User Task",
            description="Should not be accessible",
            completed=False,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        ),
    ]
    for task in tasks:
        db_session.add(task)
    db_session.commit()
    for task in tasks:
        db_session.refresh(task)
    return tasks


@pytest.fixture
def valid_token(test_user: UserModel) -> str:
    """Generate a valid JWT token for the test user."""
    payload = {
        "sub": test_user.id,
        "email": test_user.email,
        "exp": datetime.utcnow() + timedelta(hours=1),
    }
    return jwt.encode(payload, settings.better_auth_secret, algorithm="HS256")


@pytest.fixture
def expired_token(test_user: UserModel) -> str:
    """Generate an expired JWT token for testing."""
    payload = {
        "sub": test_user.id,
        "email": test_user.email,
        "exp": datetime.utcnow() - timedelta(hours=1),
    }
    return jwt.encode(payload, settings.better_auth_secret, algorithm="HS256")


@pytest.fixture
def auth_headers(valid_token: str) -> dict:
    """Return authorization headers with valid token."""
    return {"Authorization": f"Bearer {valid_token}"}
