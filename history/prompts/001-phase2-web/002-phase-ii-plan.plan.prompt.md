---
id: 002
title: Phase II technical plan
stage: plan
date: 2025-01-02
surface: agent
model: claude-opus-4-5-20251101
feature: 001-phase2-web
branch: 001-phase2-web
user: User
command: /sp.plan
labels: ["phase-ii", "plan", "architecture", "implementation"]
links:
  spec: specs/001-phase2-web/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-phase2-web/plan.md
tests:
  - None
---

## Prompt

/sp.plan Create Phase II technical plan for "Evolution of Todo" project.

The plan must be strictly derived from Phase II specification and constitution.

BACKEND PLAN:
1. Backend framework responsibility (REST API)
2. API routing and controller structure
3. Authentication integration using Better Auth
4. Data persistence using Neon PostgreSQL
5. User-to-do data ownership handling
6. Error handling and validation approach

FRONTEND PLAN:
1. Next.js application structure
2. Page-level authentication working correctly
- Data persisted in Neon PostgreSQL

## Response snapshot

Successfully created Phase II technical implementation plan for "Evolution of Todo" project with 103 specific tasks across 10 phases.

### Summary

**10 Implementation Phases**:
- Phase 0: Outline & Research (5 research items)
- Phase 1: Design & Contracts (data models, API contracts, quick start guide)
- Phase 2: Foundation & Infrastructure (21 blocking tasks - CRITICAL for all user stories)
- Phase 3: User Story 1 - User Sign Up (8 tasks) - P1 MVP
- Phase 4: User Story 2 - User Sign In (10 tasks) - P1 MVP
- Phase 5: User Story 3 - View and Manage Todos (13 tasks) - P1 MVP
- Phase 6: User Story 4 - Create Todo (9 tasks) - P1 MVP
- Phase 7: User Story 5 - Update Todo (6 tasks) - P2
- Phase 8: User Story 6 - Delete Todo (9 tasks) - P2
- Phase 9: User Story 7 - Toggle Todo Completion (8 tasks) - P2
- Phase 10: Polish & Cross-Cutting Concerns (10 tasks)

**Total: 103 specific tasks**

**Constitution Check**: PASS - All Phase II principles satisfied
- Spec-Driven Development: Followed
- Phase Isolation: No future phase technologies included
- Test-First: 80% coverage minimum specified
- Security by Design: User data isolation, JWT auth defined
- Technology Matrix Compliance: FastAPI, Neon PostgreSQL, Next.js, Better Auth
- API-First Design: REST endpoints with JSON format

**Project Structure**:
- backend/ - Python FastAPI with SQLModel
- frontend/ - Next.js App Router with TypeScript
- Database: Neon Serverless PostgreSQL
- Authentication: Better Auth with JWT tokens

**Implementation Strategy**:
1. MVP First (User Stories 1-3): Sign up, Sign in, View todos
2. Incremental Delivery: Each story adds value independently
3. Parallel Execution: Foundation complete, then user stories in parallel
4. Test-First: Tests written and FAIL before implementation

**Dependencies**:
- Phase 0-1: Setup and Foundation (BLOCKS all user stories)
- User Stories 1-3: P1 MVP - can run in parallel after foundation
- User Stories 4-7: P2 - can run in parallel after foundation
- Phase 10: Polish after all desired stories complete

### Key Technical Decisions

1. **Repository Pattern**: Data access abstraction via task_service.py
2. **JWT Authentication**: Bearer tokens extracted from Authorization header
3. **User-Scoped Queries**: WHERE user_id = current_user_id enforced in all queries
4. **Soft Delete**: is_deleted flag instead of hard delete for todos
5. **Server Components**: Next.js Server Components by default for performance
6. **Connection Pooling**: QueuePool for Neon PostgreSQL connections
7. **Pagination**: skip/limit parameters for todo list retrieval

### Data Models Defined

**Todo Entity**:
- id (UUID, primary key)
- user_id (UUID, foreign key to User)
- description (string, 1-500 chars)
- status (pending, in_progress, complete)
- due_date (optional datetime)
- created_at, updated_at (timestamps)
- is_deleted (boolean, soft delete)
- deleted_at (optional datetime)

**User Entity**: Managed by Better Auth (id, email, name, created_at)

### API Contracts Defined (9 Endpoints)

**Auth Endpoints**:
- POST /api/auth/signup - Create user account
- POST /api/auth/signin - Authenticate user
- POST /api/auth/logout - Invalidate session

**Task Endpoints**:
- POST /api/tasks - Create task
- GET /api/tasks - List user's tasks (with status filter, pagination)
- GET /api/tasks/{id} - Get specific task
- PUT /api/tasks/{id} - Update task
- DELETE /api/tasks/{id} - Delete task (soft delete)
- PATCH /api/tasks/{id}/status - Toggle completion status

## Outcome

- ✅ Impact: Complete Phase II technical plan defining HOW to build (103 tasks, 10 phases, clear dependencies)
- 🧪 Tests: None (technical plan has no tests)
- 📁 Files: plan.md with complete implementation strategy
- 🔁 Next prompts: /sp.tasks to create actionable tasks.md from the plan
- 🧠 Reflection: Plan is comprehensive, constitution-compliant, and ready for task breakdown. All 7 user stories mapped to specific implementation tasks with clear dependencies. Foundation phase correctly identified as blocking all user story work. MVP path (Stories 1-3) is clear for incremental delivery.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): Constitution check PASSED
- Prompt variant (if applicable): None
- Next experiment (smallest change to try): Monitor agent adherence to Phase II constraints during `/sp.tasks` - ensure tasks are strictly derived from plan with no scope creep
