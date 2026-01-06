# Implementation Plan: Phase II Full-Stack Web Application

**Branch**: `001-phase2-web` | **Date**: 2025-01-02 | **Spec**: [specs/001-phase2-web/spec.md](../spec.md)

**Note**: This plan is strictly derived from Phase II specification and constitution.

## Summary

Transform the Evolution of Todo project from a Phase I in-memory console application into a Phase II full-stack web application. The plan implements 7 prioritized user stories with 30 functional requirements, ensuring proper authentication, data persistence, and responsive UI. All technical decisions align with the constitution v1.0.0 Phase II technology matrix.

## Technical Context

**Language/Version**: Python 3.11+, TypeScript/JavaScript for Next.js
**Primary Dependencies**: FastAPI, SQLModel, Next.js (App Router), React, Better Auth, Neon PostgreSQL (via pgvector/asyncpg)
**Storage**: Neon Serverless PostgreSQL (Neon.tech)
**Testing**: pytest (backend), Jest/React Testing Library (frontend)
**Target Platform**: Linux server (backend), Web browsers (frontend - Chrome, Firefox, Safari, Edge)
**Project Type**: web (backend + frontend)
**Performance Goals**: API responses <500ms p95, page load <2s, support 1000 concurrent users
**Constraints**: JSON-only API format, Better Auth for auth only, no AI/agents, no real-time features
**Scale/Scope**: Full-stack web application with user-scoped data, support 1000+ users

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Phase Compliance

- **Phase I (Console)**: In-memory storage, CLI interface, Python only
- **Phase II (Web App)**:
  - Backend: Python REST API (FastAPI)
  - Database: Neon Serverless PostgreSQL
  - ORM/Data Layer: SQLModel
  - Frontend: Next.js (React, TypeScript)
  - Authentication: Better Auth (signup/signin only)
- **Phase III+ (Advanced)**: Cloud infrastructure, agents, AI (not applicable to Phase II)

### Principle Validation

- **Spec-Driven Development**: No implementation without spec → plan → tasks
- **Phase Isolation**: No future phase technologies (no AI, agents, advanced cloud)
- **Test-First**: Tests MUST exist before implementation (80% coverage minimum)
- **Security by Design**: User data isolation, JWT auth, environment variables for secrets
- **Technology Matrix Compliance**: All technologies align with current phase
- **API-First Design**: REST APIs defined before implementation, JSON format

### Gate Outcome

- [x] PASS: All principles satisfied → Proceed to Phase 0
- [ ] FAIL WITH JUSTIFICATION: Violations documented and approved → Proceed with tracking
- [ ] BLOCK: Critical violations → Amend spec or plan

**Status**: **PASS** - All constitution principles satisfied. Proceeding with Phase 0 research.

## Project Structure

### Documentation (this feature)

```text
specs/001-phase2-web/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
├── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
├── checklists/
│   └── requirements.md   # Spec quality validation
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── models/
│   │   ├── user.py           # User model (external reference via Better Auth)
│   │   └── task.py           # Task model with SQLModel
│   ├── services/
│   │   │   ├── auth_service.py  # Better Auth integration service
│   │   │   └── task_service.py  # Task CRUD operations
│   ├── api/
│   │   │   ├── deps.py        # Dependencies (JWT verification, auth state)
│   │   │   ├── main.py        # FastAPI application entry
│   │   │   ├── routes/
│   │   │   │   ├── auth.py  # Authentication endpoints (signup/signin/logout)
│   │   │   │   └── tasks.py  # Task CRUD endpoints
│   │   │   └── middleware.py
│   │   └── config.py
│   └── tests/
│   │       ├── contract/
│   │       ├── integration/
│   │       └── unit/
│   └── main.py

frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Root layout with providers
│   │   ├── page.tsx        # Home page
│   │   ├── (auth)/
│   │   │   ├── signup/
│   │   │   │   └── page.tsx
│   │   │   │   ├── signin/
│   │   │   │   │   └── page.tsx
│   │   │   ├── (tasks)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx         # Todo list page
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx     # Task detail page
│   │   │   └── new/
│   │   │   │       └── page.tsx   # Create todo modal/form
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── AuthProvider.tsx   # Better Auth provider wrapper
│   │   │   │   ├── SigninForm.tsx      # Signin form
│   │   │   │   └── SignupForm.tsx     # Signup form
│   │   │   ├── ui/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── TodoCard.tsx
│   │   │   │   ├── TodoList.tsx
│   │   │   │   └── TodoForm.tsx
│   │   │   ├── TodoItem.tsx
│   │   │   └── StatusToggle.tsx
│   │   │   └── DeleteButton.tsx
│   │   │   ├── loading/
│   │   │   │   └── LoadingSpinner.tsx
│   │   ├── lib/
│   │   │   ├── api-client.ts  # API client with JWT attachment
│   │   │   ├── auth-utils.ts  # Auth utilities
│   │   │   └── types.ts      # TypeScript types
│   └── tests/
├── public/
    ├── vite.svg
    ├── robots.txt
    └── favicon.ico
├── tailwind.config.ts
├── tsconfig.json
├── package.json
```

**Structure Decision**: Web application structure (backend + frontend) selected per Phase II requirements.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A       | N/A           | No violations - all principles satisfied           | N/A |

---

## Phases

### Phase 0: Outline & Research

**Purpose**: Research technical unknowns and resolve them before design.

Since Phase II uses well-established technologies (FastAPI, Next.js, Neon PostgreSQL, Better Auth), most technical context is known. Research phase will focus on:

- Better Auth integration patterns with Next.js
- Neon PostgreSQL connection strategies
- SQLModel + asyncpg best practices
- FastAPI middleware patterns for JWT verification
- CORS configuration for frontend-backend communication
- OpenAPI/Swagger documentation generation

**Research Items to Resolve**:
1. Better Auth session management with Next.js App Router
2. Neon PostgreSQL pooling and connection management
3. FastAPI dependency injection patterns for auth
4. SQLModel migration strategy with Alembic
5. Environment variable management for secrets

---

### Phase 1: Design & Contracts

**Prerequisites**: `research.md` complete

#### Data Model

**Todo Entity** (from spec):
```python
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from datetime import datetime
from uuid import UUID

class Task(SQLModel, table=True):
    """
    Task model per specs/001-phase2-web/spec.md

    Table: tasks
    """
    __tablename__ = "tasks"

    id: UUID = Field(
        default_factory=uuid4,
        primary_key=True,
        index=True,
        description="Unique task identifier"
    )
    user_id: UUID = Field(
        foreign_key="users.id",
        nullable=False,
        index=True,
        description="Owner of this task - foreign key to User entity managed by Better Auth"
    )
    description: str = Field(
        ...,
        min_length=1,
        max_length=500,
        description="Task description (1-500 characters)"
    )
    status: str = Field(
        default="pending",
        index=True,
        description="Task status: pending, in_progress, complete"
    )
    due_date: Optional[datetime] = Field(
        default=None,
        index=True,
        description="Optional due date for the task"
    )
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        nullable=False,
        description="Creation timestamp"
    )
    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        sa_column_kwargs={"onupdate": datetime.utcnow},
        nullable=False,
        description="Last update timestamp"
    )
    is_deleted: bool = Field(
        default=False,
        index=True,
        description="Soft delete flag - instead of hard delete"
    )
    deleted_at: Optional[datetime] = Field(
        default=None,
        description="Deletion timestamp (used with is_deleted)"
    )
```

**User Entity** (external reference):
```python
# User entity is managed by Better Auth
# We reference it but don't create tables
# Better Auth provides: id, email, name, created_at
```

#### API Contracts

**REST API Endpoints** (from spec):

| Endpoint | Method | Purpose | Request | Response | Error Cases |
|----------|--------|---------|--------|------------|
| Auth | | | | | | |
| POST /api/auth/signup | Create user account | {email, password} | {user, access_token, expires_at} | 400, 409 | |
| POST /api/auth/signin | Authenticate user | {email, password} | {user, access_token, expires_at} | 400, 401, 404 | |
| POST /api/auth/logout | Invalidate session | {} | {} | 401 | |
| | | | | | |
| Tasks | | | | | |
| POST /api/tasks | Create task | {description, status, due_date?} | {task} | 400, 422, 401 | |
| GET /api/tasks | List all tasks | ?status, ?skip, ?limit | {tasks, total} | 400, 401 | |
| GET /api/tasks/{id} | Get specific task | N/A | {task} | 400, 401, 404 | |
| PUT /api/tasks/{id} | Update task | {description, status, due_date?} | {task} | 400, 422, 401, 404 | |
| DELETE /api/tasks/{id} | Delete task | N/A | {} | 400, 401, 404 | |
| PATCH /api/tasks/{id}/status | Toggle completion | {status} | {task} | 400, 401, 404 | |

**Request/Response Models**:
```typescript
// TaskCreate
interface TaskCreate {
  description: string;
  status?: 'pending' | 'in_progress' | 'complete';
  due_date?: string;
}

// TaskUpdate
interface TaskUpdate {
  description?: string;
  status?: 'pending' | 'in_progress' | 'complete';
  due_date?: string;
}

// Task
interface Task {
  id: string;
  user_id: string;
  description: string;
  status: 'pending' | 'in_progress' | 'complete';
  due_date: string | null;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

// TaskListResponse
interface TaskListResponse {
  tasks: Task[];
  total: number;
  skip: number;
  limit: number;
}

// AuthResponse
interface AuthResponse {
  user: {
    id: string;
    email: string;
    name?: string;
  };
  access_token: string;
  expires_at: number;
}

// ApiError
interface ApiError {
  detail: string;
  error_code?: string;
}
```

#### Quick Start Guide

```markdown
# Phase II Quick Start

## Prerequisites

1. Clone repository
2. Install Python dependencies: `pip install fastapi uvicorn[standard] sqlmodel asyncpg`
3. Install Node.js dependencies: `npm install`
4. Configure environment variables (see .env.example)
5. Provision Neon PostgreSQL database
6. Configure Better Auth
7. Start backend: `uvicorn backend.main:app --reload`
8. Start frontend: `npm run dev`

## Environment Variables

Required (.env file):
```
# Database
DATABASE_URL=postgresql://user:password@ep-xyz.region.aws.neon.tech/neondb?sslmode=require

# Backend
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Running the Application

Backend:
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Frontend:
```bash
cd frontend
npm run dev
```

## API Endpoints Overview

- **Auth**:
  - POST /api/auth/signup - Create user account
  - POST /api/auth/signin - Authenticate user
  - POST /api/auth/logout - Logout user

- **Tasks**:
  - POST /api/tasks - Create task
  - GET /api/tasks - List user's tasks (with status filter)
  - GET /api/tasks/{id} - Get specific task
  - PUT /api/tasks/{id} - Update task
  - DELETE /api/tasks/{id} - Delete task
  - PATCH /api/tasks/{id}/status - Toggle completion status

## Authentication Flow

1. User navigates to signup page → Fills form → POST /api/auth/signup
2. Better Auth creates user account → Returns JWT token and user info
3. Frontend stores token → Attaches to Authorization header on all API requests
4. Protected routes require valid token → Backend validates using Better Auth
5. Logout clears token → Backend invalidates session

## Development Workflow

1. Implement backend models (Task)
2. Set up Better Auth integration
3. Create API endpoints (auth + tasks)
4. Implement JWT verification middleware
5. Set up database connection and migrations
6. Create frontend pages (signup, signin, tasks)
7. Implement API client with JWT attachment
8. Test end-to-end flows

## Testing Strategy

Backend:
- Unit tests for service layer (mock dependencies)
- Contract tests for API endpoints
- Integration tests with test database

Frontend:
- Component tests for UI components
- Integration tests for auth flows
- E2E tests for critical user journeys
```

**Output**: research.md, data-model.md, contracts/ directory, quickstart.md

#### Agent Context Update

- Run `.specify/scripts/powershell/update-agent-context.ps1 -AgentType claude`
- These scripts detect which AI agent is in use
- Update the appropriate agent-specific context file
- Add only new technology from current plan
- Preserve manual additions between markers

**Output**: agent-specific file updated with Phase II technology stack.

---

## Phase 2: Foundation & Infrastructure (BLOCKS ALL USER STORIES)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete!

### Database Layer

- [ ] T001 Setup Neon PostgreSQL connection with SQLModel
- [ ] T002 Configure Alembic for database migrations
- [ ] T003 Create initial migration for tasks table
- [ ] T004 Set up database session management
- [ ] T005 Create task model with user relationship

### Authentication Layer

- [ ] T006 Integrate Better Auth configuration
- [ ] T007 Create user session models (reference Better Auth)
- [ ] T008 Implement JWT token verification service
- [ ] T009 Configure CORS middleware

### API Layer

- [ ] T010 Create FastAPI application structure
- [ ] T011 Set up router and middleware stack
- [ ] T012 Configure logging and error handling
- [ ] T013 Implement dependency injection for services

### Frontend Layer

- [ ] T014 Initialize Next.js project with TypeScript
- [ ] T015 Configure environment variables
- [ ] T016 Set up Better Auth client configuration
- [ ] T017 Create root layout with auth provider
- [ ] T018 Configure Tailwind CSS

### Testing Infrastructure

- [ ] T019 Set up pytest configuration
- [ ] T020 Set up Jest configuration
- [ ] T021 Create test database fixtures

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - User Sign Up (Priority: P1) 🎯 MVP

**Goal**: Enable new users to create accounts and access the application.

**Independent Test**: User can create account, receive JWT token, and access protected endpoints.

### Tests for User Story 1 (OPTIONAL) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T022 Contract test for /api/auth/signup (201 response)
- [ ] T023 Contract test for /api/auth/signin (200 response, valid token)
- [ ] T024 Integration test: signup → signin → todo access

### Implementation for User Story 1

#### Backend Implementation

- [ ] T025 Implement Better Auth signup endpoint in `api/routes/auth.py`
- [ ] T026 Configure JWT generation with Better Auth
- [ ] T027 Add CORS headers to auth endpoints
- [ ] T028 Create error handling for duplicate email (409 Conflict)

#### Frontend Implementation

- [ ] T029 Create signup page (`frontend/src/app/(auth)/signup/page.tsx`)
- [ ] T030 Create signup form component with validation
- [ ] T031 Implement API client auth methods (`signup()` function)
- [ ] T032 Handle form submission and redirect
- [ ] T033 Display error messages appropriately

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - User Sign In (Priority: P1) 🎯 MVP

**Goal**: Enable existing users to authenticate and access their existing todos.

**Independent Test**: User can sign in with valid credentials, receive JWT token, and view their todos.

### Tests for User Story 2 (OPTIONAL) ⚠️

- [ ] T034 Contract test for /api/auth/signin (200 response, valid token)
- [ ] T035 Integration test: signin → load todos

### Implementation for User Story 2

#### Backend Implementation

- [ ] T036 Implement Better Auth signin endpoint in `api/routes/auth.py`
- [ ] T037 Validate credentials against Better Auth
- [ ] T038 Return user info with JWT token

#### Frontend Implementation

- [ ] T039 Create signin page (`frontend/src/app/(auth)/signin/page.tsx`)
- [ ] T040 Create signin form component with validation
- [ ] T041 Implement API client signin method (`signin()` function)
- [ ] T042 Handle successful auth (store token, redirect to todos)
- [ ] T043 Display error messages for invalid credentials

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently.

---

## Phase 5: User Story 3 - View and Manage Todos (Priority: P1) 🎯 MVP

**Goal**: Allow signed-in users to view their todo list and manage tasks.

**Independent Test**: User can view all their todos with descriptions and statuses, perform CRUD operations.

### Tests for User Story 3 (OPTIONAL) ⚠️

- [ ] T044 Contract test for GET /api/tasks (200 response, user's own todos only)
- [ ] T045 Integration test: load todos → display correctly
- [ ] T046 Contract test for GET /api/tasks/{id} (200 response, user's task or 404)

### Implementation for User Story 3

#### Backend Implementation

- [ ] T047 Implement task CRUD service in `backend/src/services/task_service.py`
- [ ] T048 Implement list endpoint with user filtering in `api/routes/tasks.py`
- [ ] T049 Implement get endpoint with user validation in `api/routes/tasks.py`
- [ ] T050 Implement validation (description length, required fields)

#### Frontend Implementation

- [ ] T051 Create todo list page (`frontend/src/app/(tasks)/page.tsx`)
- [ ] T052 Create todo card component with edit/delete actions
- [ ] T053 Implement API client task methods (`listTasks()`, `getTask()`)
- [ ] T054 Implement auth-protected route wrapper
- [ ] T055 Handle loading states
- [ ] T056 Display empty state when no todos

**Checkpoint**: At this point, Users 1, 2, and 3 should all work independently. MVP is complete!

---

## Phase 6: User Story 4 - Create Todo (Priority: P1) 🎯 MVP

**Goal**: Enable users to create new todos and add them to their list.

**Independent Test**: User can create a task via form, see it appear in their list.

### Tests for User Story 4 (OPTIONAL) ⚠️

- [ ] T057 Contract test for POST /api/tasks (201 response, returns created task)
- [ ] T058 Contract test: duplicate description returns 409 Conflict

### Implementation for User Story 4

#### Backend Implementation

- [ ] T059 Implement create endpoint in `api/routes/tasks.py`
- [ ] T060 Validate user_id from JWT token
- [ ] T061 Set default status to "pending"
- [ ] T062 Validate input (description length 1-500)
- [ ] T063 Handle duplicate task (409 Conflict)

#### Frontend Implementation

- [ ] T064 Create create todo modal/form (`frontend/src/app/(tasks)/new/page.tsx` or inline form)
- [ ] T065 Implement `createTask()` API client method
- [ ] T066 Handle success/error states
- [ ] T067 Refresh todo list after creation

---

## Phase 7: User Story 5 - Update Todo (Priority: P2)

**Goal**: Enable users to modify existing todo descriptions while preserving status.

**Independent Test**: User can update a todo, see the change reflected in their list.

### Tests for User Story 5 (OPTIONAL) ⚠️

- [ ] T068 Contract test for PUT /api/tasks/{id} (200 response, user's task only)
- [ ] T069 Contract test: Update nonexistent task returns 404

### Implementation for User Story 5

#### Backend Implementation

- [ ] T070 Implement update endpoint in `api/routes/tasks.py`
- [ ] T071 Validate user owns task
- [ ] T072 Validate input (description length, status values)

#### Frontend Implementation

- [ ] T073 Create edit modal or form
- [ ] T074 Implement `updateTask()` API client method
- [ ] T075 Handle success/error states

---

## Phase 8: User Story 6 - Delete Todo (Priority: P2)

**Goal**: Enable users to remove completed or unwanted todos from their list.

**Independent Test**: User can delete a todo, confirm it no longer appears in their list.

### Tests for User Story 6 (OPTIONAL) ⚠️

- [ ] T076 Contract test for DELETE /api/tasks/{id} (204 No Content)
- [ ] T077 Contract test: Delete nonexistent task returns 404

### Implementation for User Story 6

#### Backend Implementation

- [ ] T078 Implement delete endpoint in `api/routes/tasks.py`
- [ ] T079 Implement soft delete (set is_deleted flag)
- [ ] T080 Validate user owns task

#### Frontend Implementation

- [ ] T081 Add delete button to todo card
- [ ] T082 Implement `deleteTask()` API client method
- [ ] T083 Handle confirmation dialog
- [ ] T084 Remove task from list state after deletion

---

## Phase 9: User Story 7 - Toggle Todo Completion (Priority: P2)

**Goal**: Enable users to mark todos as complete or incomplete with toggle button.

**Independent Test**: User can toggle task status, see visual feedback, reverse the action.

### Tests for User Story 7 (OPTIONAL) ⚠️

- [ ] T085 Contract test for PATCH /api/tasks/{id}/status (200 response)
- [ ] T086 Contract test: Toggle nonexistent task returns 404

### Implementation for User Story 7

#### Backend Implementation

- [ ] T087 Implement status toggle endpoint in `api/routes/tasks.py`
- [ ] T088 Validate new status value (pending ↔ in_progress ↔ complete)
- [ ] T089 Validate user owns task

#### Frontend Implementation

- [ ] T090 Create status toggle component (checkbox or button)
- [ ] T091 Implement `toggleTaskStatus()` API client method
- [ ] T092 Update todo list state after toggle
- [ ] T093 Provide visual feedback (completed styling)

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories.

- [ ] T094 Generate OpenAPI/Swagger documentation
- [ ] T095 Write API documentation in README
- [ ] T096 Add request/response logging
- [ ] T097 Implement rate limiting (optional, if needed)
- [ ] T098 Security hardening review
- [ ] T099 Accessibility audit of all pages
- [ ] T100 Performance optimization (indexing, query optimization)
- [ ] T101 Additional unit tests (if needed)
- [ ] T102 Code cleanup and refactoring
- [ ] T103 Run quickstart validation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 0)**: No dependencies - can start immediately
- **Foundational (Phase 1)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 2-9)**: All depend on Foundational phase completion
- **Polish (Phase 10)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational - No dependencies on other stories
- **User Story 3 (P1)**: Can start after Foundational - No dependencies on other stories
- **User Story 4 (P1)**: Can start after Foundational - Integrates with User Stories 1, 2, 3
- **User Story 5 (P2)**: Can start after Foundational - Integrates with User Stories 1, 2, 3
- **User Story 6 (P2)**: Can start after Foundational - Integrates with User Stories 1, 2, 3
- **User Story 7 (P2)**: Can start after Foundational - Integrates with User Stories 1, 2, 3

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks can run in parallel
- All Foundational tasks can run in parallel (within Phase 1)
- Once Foundational is done:
  - User Stories 1, 2, 3 can run in parallel
  - User Stories 4, 5, 6, 7 can run in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Implementation Strategy

### MVP First (User Stories 1-3 Only)

1. Complete Setup (Phase 0) - Infrastructure initialization
2. Complete Foundational (Phase 1) - Core backend + frontend infrastructure
3. Complete User Story 1 - Sign Up
4. Complete User Story 2 - Sign In
5. **STOP AND VALIDATE**: Test User Stories 1 and 2 independently → Deploy/Demo (MVP!)
6. Complete User Story 3 - View and Manage Todos

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 (Sign Up) → Test independently → Deploy/Demo (MVP increment)
3. Add User Story 2 (Sign In) → Test independently → Deploy/Demo (MVP increment)
4. Add User Story 3 (View Todos) → Test independently → Deploy/Demo (MVP increment)
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Stories 1, 2, 3 (parallel)
   - Developer B: User Stories 4, 5, 6, 7 (parallel)
3. Stories complete and integrate independently
