# Tasks: Phase II Backend Only

**Input**: User command specifying backend-only implementation
**Prerequisites**: None - this is the authoritative task list

## Format: `[ID] [P?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

---

## Path Conventions

- **Backend**: `backend/`
- **Root**: Environment files, README, configuration

---

## Phase 1: Setup

**Purpose**: Project initialization and basic structure

- [x] T001 Create backend directory structure (backend/{main.py,db.py,models.py,dependencies/,routes/})
- [x] T002 Initialize backend Python project with pyproject.toml
- [x] T003 Create .env.example file with required variables
- [x] T004 Create backend README.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY task endpoints can be implemented

**CRITICAL**: No endpoint work can begin until this phase is complete

### Dependencies

- [x] T005 Install backend dependencies: fastapi, uvicorn, sqlmodel, psycopg2-binary, python-jose, pydantic, pydantic-settings

### Database Layer

- [x] T006 Create database configuration in backend/db.py (DATABASE_URL from env, SQLModel engine)
- [x] T007 Create User model in backend/models.py (id (string), email, created_at)
- [x] T008 Create Todo model in backend/models.py (id (int, PK), user_id (FK→User), title, description, completed, created_at, updated_at)

### Authentication Layer

- [x] T009 Create JWT verification dependency in backend/dependencies/auth.py (get_current_user from Authorization header)

### Application Layer

- [x] T010 Create FastAPI application in backend/main.py (CORS, middleware)

---

## Phase 3: Task Endpoints

**Purpose**: Implement all protected REST API endpoints

All endpoints MUST:
- Require valid JWT
- Enforce user-specific access (user_id from token)
- Return JSON

### Endpoints Implementation

- [x] T011 Implement GET /api/tasks (list user tasks with user_id filtering)
- [x] T012 Implement POST /api/tasks (create task with user_id from JWT)
- [x] T013 Implement GET /api/tasks/{id} (retrieve task, verify ownership)
- [x] T014 Implement PUT /api/tasks/{id} (update task, verify ownership)
- [x] T015 Implement DELETE /api/tasks/{id} (delete task, verify ownership)
- [x] T016 Implement PATCH /api/tasks/{id}/complete (toggle completion, verify ownership)

---

## Phase 4: Validation & Error Handling

- [x] T017 Handle 401 Unauthorized (invalid/missing JWT)
- [x] T018 Handle 404 Not Found (nonexistent task)
- [x] T019 Handle 400 Bad Request (validation errors)
- [x] T020 Handle empty task list response

---

## Phase 5: Security Guarantees

- [x] T021 Verify users cannot access other users' tasks (user_id filtering)
- [x] T022 Ensure no hard-coded secrets (use .env)

---

## Phase 6: Testing

**Purpose**: Unit and integration tests for backend components

### Test Infrastructure

- [x] T023 Create pytest configuration in backend/tests/conftest.py (fixtures, test client, mocking)
- [x] T024 Install test dependencies: pytest, pytest-asyncio, httpx

### Unit Tests

- [x] T025 Unit tests for JWT authentication (test_auth.py) - decode_token, get_current_user
- [x] T026 Unit tests for database models (test_models.py) - User, Todo, Pydantic schemas

### API Contract Tests

- [x] T027 Health check and root endpoint tests (test_tasks_api.py)
- [x] T028 GET /api/tasks endpoint tests - list, pagination, user isolation
- [x] T029 POST /api/tasks endpoint tests - create, validation
- [x] T030 GET /api/tasks/{id} endpoint tests - retrieve, ownership
- [x] T031 PUT /api/tasks/{id} endpoint tests - update, ownership
- [x] T032 DELETE /api/tasks/{id} endpoint tests - delete, ownership
- [x] T033 PATCH /api/tasks/{id}/complete endpoint tests - toggle, ownership
- [x] T034 Authentication error handling tests - 401 for invalid/expired tokens

---

## Dependencies & Execution Order

1. Phase 1: Setup - no dependencies
2. Phase 2: Foundational - depends on Phase 1, BLOCKS all other work
3. Phase 3: Endpoints - depends on Phase 2
4. Phase 4: Validation - depends on Phase 3
5. Phase 5: Security - depends on Phase 4

---

## Summary

| Metric | Value |
|--------|-------|
| **Total Tasks** | 34 |
| **Phase 1: Setup** | 4 tasks |
| **Phase 2: Foundational** | 6 tasks (BLOCKS all) |
| **Phase 3: Endpoints** | 6 tasks |
| **Phase 4: Validation** | 4 tasks |
| **Phase 5: Security** | 2 tasks |
| **Phase 6: Testing** | 12 tasks |

---

## Completion Criteria

Backend is complete only if:

- FastAPI server runs successfully
- Neon PostgreSQL persists data
- JWT authentication enforced
- All CRUD operations work
- Tasks are user-scoped
- No frontend code exists
- All tests pass (pytest)
