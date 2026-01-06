"""API contract tests for task endpoints."""

import pytest
from fastapi import status
from fastapi.testclient import TestClient


class TestHealthEndpoint:
    """Tests for health check endpoint."""

    def test_health_check(self, client: TestClient):
        """Test health check returns 200."""
        response = client.get("/health")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["status"] == "healthy"
        assert "version" in data


class TestRootEndpoint:
    """Tests for root endpoint."""

    def test_root_endpoint(self, client: TestClient):
        """Test root endpoint returns API info."""
        response = client.get("/")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["name"] == "Todo API"
        assert "version" in data
        assert data["docs"] == "/docs"


class TestListTasks:
    """Tests for GET /api/tasks endpoint."""

    def test_list_tasks_unauthorized(self, client: TestClient):
        """Test list tasks without auth returns 403 (FastAPI HTTPBearer behavior)."""
        response = client.get("/api/tasks")
        # FastAPI's HTTPBearer returns 403 when no token is provided
        assert response.status_code in [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN]

    def test_list_tasks_empty(self, client: TestClient, auth_headers: dict):
        """Test list tasks returns empty list for new user."""
        response = client.get("/api/tasks", headers=auth_headers)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["tasks"] == []
        assert data["total"] == 0

    def test_list_tasks_with_data(
        self, client: TestClient, auth_headers: dict, test_tasks: list
    ):
        """Test list tasks returns user's tasks only."""
        response = client.get("/api/tasks", headers=auth_headers)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data["tasks"]) == 3
        assert data["total"] == 3

    def test_list_tasks_user_isolation(
        self, client: TestClient, auth_headers: dict, other_user_tasks: list
    ):
        """Test user only sees their own tasks."""
        response = client.get("/api/tasks", headers=auth_headers)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        # Should not see other user's tasks
        for task in data["tasks"]:
            assert task["title"] != "Other User Task"

    def test_list_tasks_pagination(
        self, client: TestClient, auth_headers: dict, test_tasks: list
    ):
        """Test list tasks pagination."""
        response = client.get("/api/tasks?skip=1&limit=1", headers=auth_headers)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data["tasks"]) == 1
        assert data["total"] == 3


class TestCreateTask:
    """Tests for POST /api/tasks endpoint."""

    def test_create_task_unauthorized(self, client: TestClient):
        """Test create task without auth returns 403 (FastAPI HTTPBearer behavior)."""
        response = client.post("/api/tasks", json={"title": "New Task"})
        assert response.status_code in [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN]

    def test_create_task_valid(self, client: TestClient, auth_headers: dict):
        """Test create task with valid data."""
        response = client.post(
            "/api/tasks",
            json={"title": "New Task", "description": "New Description"},
            headers=auth_headers,
        )
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["title"] == "New Task"
        assert data["description"] == "New Description"
        assert data["completed"] is False
        assert "id" in data
        assert "created_at" in data

    def test_create_task_minimal(self, client: TestClient, auth_headers: dict):
        """Test create task with minimal data."""
        response = client.post(
            "/api/tasks", json={"title": "Minimal Task"}, headers=auth_headers
        )
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["title"] == "Minimal Task"
        assert data["description"] is None

    def test_create_task_empty_title(self, client: TestClient, auth_headers: dict):
        """Test create task with empty title returns 422."""
        response = client.post(
            "/api/tasks", json={"title": ""}, headers=auth_headers
        )
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_create_task_missing_title(self, client: TestClient, auth_headers: dict):
        """Test create task without title returns 422."""
        response = client.post(
            "/api/tasks", json={}, headers=auth_headers
        )
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_create_task_title_too_long(self, client: TestClient, auth_headers: dict):
        """Test create task with title too long returns 422."""
        response = client.post(
            "/api/tasks",
            json={"title": "x" * 201},
            headers=auth_headers,
        )
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


class TestGetTask:
    """Tests for GET /api/tasks/{id} endpoint."""

    def test_get_task_unauthorized(self, client: TestClient):
        """Test get task without auth returns 403 (FastAPI HTTPBearer behavior)."""
        response = client.get("/api/tasks/1")
        assert response.status_code in [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN]

    def test_get_task_not_found(self, client: TestClient, auth_headers: dict):
        """Test get nonexistent task returns 404."""
        response = client.get("/api/tasks/99999", headers=auth_headers)
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_get_task_valid(
        self, client: TestClient, auth_headers: dict, test_tasks: list
    ):
        """Test get existing task returns 200."""
        task_id = test_tasks[0].id
        response = client.get(f"/api/tasks/{task_id}", headers=auth_headers)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["id"] == task_id
        assert data["title"] == test_tasks[0].title

    def test_get_task_other_user(
        self, client: TestClient, auth_headers: dict, other_user_tasks: list
    ):
        """Test get other user's task returns 403."""
        task_id = other_user_tasks[0].id
        response = client.get(f"/api/tasks/{task_id}", headers=auth_headers)
        assert response.status_code == status.HTTP_403_FORBIDDEN


class TestUpdateTask:
    """Tests for PUT /api/tasks/{id} endpoint."""

    def test_update_task_unauthorized(self, client: TestClient):
        """Test update task without auth returns 403 (FastAPI HTTPBearer behavior)."""
        response = client.put("/api/tasks/1", json={"title": "Updated"})
        assert response.status_code in [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN]

    def test_update_task_not_found(self, client: TestClient, auth_headers: dict):
        """Test update nonexistent task returns 404."""
        response = client.put(
            "/api/tasks/99999", json={"title": "Updated"}, headers=auth_headers
        )
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_update_task_title(
        self, client: TestClient, auth_headers: dict, test_tasks: list
    ):
        """Test update task title."""
        task_id = test_tasks[0].id
        response = client.put(
            f"/api/tasks/{task_id}",
            json={"title": "Updated Title"},
            headers=auth_headers,
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["title"] == "Updated Title"

    def test_update_task_completed(
        self, client: TestClient, auth_headers: dict, test_tasks: list
    ):
        """Test update task completed status."""
        task_id = test_tasks[0].id
        response = client.put(
            f"/api/tasks/{task_id}",
            json={"completed": True},
            headers=auth_headers,
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["completed"] is True

    def test_update_task_all_fields(
        self, client: TestClient, auth_headers: dict, test_tasks: list
    ):
        """Test update task with all fields."""
        task_id = test_tasks[0].id
        response = client.put(
            f"/api/tasks/{task_id}",
            json={"title": "New Title", "description": "New Desc", "completed": True},
            headers=auth_headers,
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["title"] == "New Title"
        assert data["description"] == "New Desc"
        assert data["completed"] is True

    def test_update_task_other_user(
        self, client: TestClient, auth_headers: dict, other_user_tasks: list
    ):
        """Test update other user's task returns 403."""
        task_id = other_user_tasks[0].id
        response = client.put(
            f"/api/tasks/{task_id}",
            json={"title": "Hacked"},
            headers=auth_headers,
        )
        assert response.status_code == status.HTTP_403_FORBIDDEN


class TestDeleteTask:
    """Tests for DELETE /api/tasks/{id} endpoint."""

    def test_delete_task_unauthorized(self, client: TestClient):
        """Test delete task without auth returns 403 (FastAPI HTTPBearer behavior)."""
        response = client.delete("/api/tasks/1")
        assert response.status_code in [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN]

    def test_delete_task_not_found(self, client: TestClient, auth_headers: dict):
        """Test delete nonexistent task returns 404."""
        response = client.delete("/api/tasks/99999", headers=auth_headers)
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_delete_task_valid(
        self, client: TestClient, auth_headers: dict, test_tasks: list
    ):
        """Test delete task returns 204."""
        task_id = test_tasks[0].id
        response = client.delete(f"/api/tasks/{task_id}", headers=auth_headers)
        assert response.status_code == status.HTTP_204_NO_CONTENT

        # Verify task is deleted
        get_response = client.get(f"/api/tasks/{task_id}", headers=auth_headers)
        assert get_response.status_code == status.HTTP_404_NOT_FOUND

    def test_delete_task_other_user(
        self, client: TestClient, auth_headers: dict, other_user_tasks: list
    ):
        """Test delete other user's task returns 403."""
        task_id = other_user_tasks[0].id
        response = client.delete(f"/api/tasks/{task_id}", headers=auth_headers)
        assert response.status_code == status.HTTP_403_FORBIDDEN


class TestToggleComplete:
    """Tests for PATCH /api/tasks/{id}/complete endpoint."""

    def test_toggle_complete_unauthorized(self, client: TestClient):
        """Test toggle without auth returns 403 (FastAPI HTTPBearer behavior)."""
        response = client.patch("/api/tasks/1/complete")
        assert response.status_code in [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN]

    def test_toggle_complete_not_found(self, client: TestClient, auth_headers: dict):
        """Test toggle nonexistent task returns 404."""
        response = client.patch("/api/tasks/99999/complete", headers=auth_headers)
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_toggle_complete_false_to_true(
        self, client: TestClient, auth_headers: dict, test_tasks: list
    ):
        """Test toggle incomplete to complete."""
        task_id = test_tasks[0].id  # task is incomplete
        response = client.patch(
            f"/api/tasks/{task_id}/complete", headers=auth_headers
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["completed"] is True

    def test_toggle_complete_true_to_false(
        self, client: TestClient, auth_headers: dict, test_tasks: list
    ):
        """Test toggle complete to incomplete."""
        task_id = test_tasks[1].id  # task is complete
        response = client.patch(
            f"/api/tasks/{task_id}/complete", headers=auth_headers
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["completed"] is False

    def test_toggle_complete_other_user(
        self, client: TestClient, auth_headers: dict, other_user_tasks: list
    ):
        """Test toggle other user's task returns 403."""
        task_id = other_user_tasks[0].id
        response = client.patch(
            f"/api/tasks/{task_id}/complete", headers=auth_headers
        )
        assert response.status_code == status.HTTP_403_FORBIDDEN


class TestAuthErrors:
    """Tests for authentication error handling."""

    def test_invalid_token(self, client: TestClient):
        """Test invalid token returns 401."""
        response = client.get(
            "/api/tasks", headers={"Authorization": "Bearer invalid-token"}
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_missing_auth_header(self, client: TestClient):
        """Test missing auth header returns 403 (FastAPI HTTPBearer behavior)."""
        response = client.get("/api/tasks")
        # FastAPI's HTTPBearer with auto_error=True returns 403 when no header
        assert response.status_code in [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN]

    def test_malformed_auth_header(self, client: TestClient):
        """Test malformed auth header returns 403 (FastAPI HTTPBearer behavior)."""
        response = client.get(
            "/api/tasks", headers={"Authorization": "NotBearer token"}
        )
        # FastAPI returns 403 for non-Bearer tokens
        assert response.status_code in [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN]

    def test_expired_token(self, client: TestClient, expired_token: str):
        """Test expired token returns 401."""
        response = client.get(
            "/api/tasks", headers={"Authorization": f"Bearer {expired_token}"}
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
