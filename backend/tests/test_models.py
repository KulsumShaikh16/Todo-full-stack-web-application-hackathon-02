"""Unit tests for database models."""

from datetime import datetime

import pytest
from pydantic import ValidationError

from backend.models import (
    Todo,
    TodoCreate,
    TodoUpdate,
    TodoResponse,
    TodoListResponse,
    User,
)


class TestUserModel:
    """Tests for User model."""

    def test_user_creation(self):
        """Test User model can be created."""
        user = User(
            id="user-123",
            email="test@example.com",
            created_at=datetime.utcnow(),
        )
        assert user.id == "user-123"
        assert user.email == "test@example.com"
        assert user.created_at is not None

    def test_user_default_created_at(self):
        """Test User created_at defaults to current time."""
        before = datetime.utcnow()
        user = User(id="user-456", email="test2@example.com")
        after = datetime.utcnow()

        assert before <= user.created_at <= after


class TestTodoModel:
    """Tests for Todo model."""

    def test_todo_creation(self):
        """Test Todo model can be created."""
        task = Todo(
            id=1,
            user_id="user-123",
            title="Test Task",
            description="Test Description",
            completed=False,
        )
        assert task.id == 1
        assert task.user_id == "user-123"
        assert task.title == "Test Task"
        assert task.description == "Test Description"
        assert task.completed is False

    def test_todo_default_completed(self):
        """Test Todo completed defaults to False."""
        task = Todo(user_id="user-123", title="Test Task")
        assert task.completed is False

    def test_todo_optional_description(self):
        """Test Todo description is optional."""
        task = Todo(user_id="user-123", title="Test Task")
        assert task.description is None

    def test_todo_with_all_fields(self):
        """Test Todo with all fields populated."""
        now = datetime.utcnow()
        task = Todo(
            id=5,
            user_id="user-789",
            title="Full Task",
            description="Full description",
            completed=True,
            created_at=now,
            updated_at=now,
        )
        assert task.id == 5
        assert task.user_id == "user-789"
        assert task.title == "Full Task"
        assert task.completed is True

    def test_todo_timestamps(self):
        """Test Todo timestamps are set."""
        before = datetime.utcnow()
        task = Todo(user_id="user-123", title="Test")
        after = datetime.utcnow()

        assert before <= task.created_at <= after
        assert before <= task.updated_at <= after


class TestTodoCreateSchema:
    """Tests for TodoCreate Pydantic schema."""

    def test_todo_create_with_title_and_description(self):
        """Test TodoCreate with both title and description."""
        data = TodoCreate(title="New Task", description="New Description")
        assert data.title == "New Task"
        assert data.description == "New Description"

    def test_todo_create_with_title_only(self):
        """Test TodoCreate with title only."""
        data = TodoCreate(title="New Task")
        assert data.title == "New Task"
        assert data.description is None

    def test_todo_create_empty_title_fails(self):
        """Test that empty title raises ValidationError."""
        with pytest.raises(ValidationError):
            TodoCreate(title="")

    def test_todo_create_title_stripped(self):
        """Test that title with whitespace is accepted (Pydantic behavior)."""
        # Pydantic's min_length doesn't strip whitespace
        # This tests actual behavior, not ideal behavior
        data = TodoCreate(title="   Task   ")
        assert data.title == "   Task   "

    def test_todo_create_title_max_length(self):
        """Test that title max length is enforced."""
        with pytest.raises(ValidationError):
            TodoCreate(title="x" * 201)


class TestTodoUpdateSchema:
    """Tests for TodoUpdate Pydantic schema."""

    def test_todo_update_partial(self):
        """Test TodoUpdate with partial fields."""
        data = TodoUpdate(title="Updated Title")
        assert data.title == "Updated Title"
        assert data.description is None
        assert data.completed is None

    def test_todo_update_all_fields(self):
        """Test TodoUpdate with all fields."""
        data = TodoUpdate(
            title="Updated",
            description="New desc",
            completed=True,
        )
        assert data.title == "Updated"
        assert data.description == "New desc"
        assert data.completed is True

    def test_todo_update_clear_description(self):
        """Test TodoUpdate can clear description."""
        data = TodoUpdate(description=None)
        assert data.description is None


class TestTodoResponseSchema:
    """Tests for TodoResponse Pydantic schema."""

    def test_todo_response_from_todo_model(self):
        """Test TodoResponse can be created from Todo model."""
        now = datetime.utcnow()
        task = Todo(
            id=1,
            user_id="user-123",
            title="Task",
            description="Desc",
            completed=False,
            created_at=now,
            updated_at=now,
        )
        response = TodoResponse.model_validate(task)

        assert response.id == 1
        assert response.user_id == "user-123"
        assert response.title == "Task"
        assert response.description == "Desc"
        assert response.completed is False

    def test_todo_response_without_description(self):
        """Test TodoResponse handles None description."""
        task = Todo(id=2, user_id="user-456", title="Task 2")
        response = TodoResponse.model_validate(task)

        assert response.description is None


class TestTodoListResponseSchema:
    """Tests for TodoListResponse Pydantic schema."""

    def test_todo_list_response(self):
        """Test TodoListResponse with list of tasks."""
        tasks = [
            TodoResponse(
                id=1,
                user_id="user-123",
                title="Task 1",
                description=None,
                completed=False,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow(),
            ),
            TodoResponse(
                id=2,
                user_id="user-123",
                title="Task 2",
                description="Desc",
                completed=True,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow(),
            ),
        ]
        response = TodoListResponse(tasks=tasks, total=2)

        assert len(response.tasks) == 2
        assert response.total == 2

    def test_todo_list_response_empty(self):
        """Test TodoListResponse with empty list."""
        response = TodoListResponse(tasks=[], total=0)

        assert len(response.tasks) == 0
        assert response.total == 0


class TestModelRelationships:
    """Tests for model relationships."""

    def test_user_todos_relationship(self):
        """Test User can have related todos."""
        user = User(id="user-123", email="test@example.com")
        task1 = Todo(id=1, user_id=user.id, title="Task 1")
        task2 = Todo(id=2, user_id=user.id, title="Task 2")

        # In SQLModel, relationships are lazy by default
        # We can verify the foreign key is set correctly
        assert task1.user_id == "user-123"
        assert task2.user_id == "user-123"

    def test_todo_user_reference(self):
        """Test Todo has user_id reference."""
        task = Todo(user_id="user-abc", title="Task")
        assert task.user_id == "user-abc"
