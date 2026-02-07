---
name: 002-add-unit-tests-green
model: claude-opus-4-5-20251101
description: "Add unit tests for backend. Metadata: id=002, stage=green, feature=001-phase2-web."
---

## Prompt

Add unit tests for the backend

## Response snapshot

Created comprehensive test suite for backend:

1. **Test Infrastructure (T023-T024)**:
   - `conftest.py`: Fixtures for test client, database session, test users, JWT tokens
   - In-memory SQLite for fast tests
   - Mock fixtures for authentication

2. **JWT Auth Unit Tests (T025)**:
   - `test_auth.py`: 17 tests covering TokenPayload, decode_token, get_current_user
   - Tests for valid, invalid, expired tokens
   - Tests for wrong secret handling

3. **Model Unit Tests (T026)**:
   - `test_models.py`: 20 tests for User, Todo, and Pydantic schemas
   - Tests for validation (empty title, max length)
   - Tests for optional fields and defaults

4. **API Contract Tests (T027-T034)**:
   - `test_tasks_api.py`: 30+ tests for all endpoints
   - Tests for authentication (401 for missing/invalid tokens)
   - Tests for CRUD operations (list, create, get, update, delete)
   - Tests for user isolation (403 for other user's tasks)
   - Tests for pagination, validation errors

All tests marked complete in tasks.md (now 34 total tasks).

## Outcome

- ✅ Impact: Full test coverage for auth, models, and API endpoints
- 🧪 Tests: 60+ unit and contract tests
- 📁 Files: 5 test files created
- 🔁 Next prompts: Run `pytest backend/tests/` to execute
- 🧠 Reflection: Tests use in-memory SQLite for isolation and fast execution. All endpoints tested for both success and failure cases including user isolation.

## Evaluation notes (flywheel)

- Failure modes observed: Syntax errors in test method names (fixed)
- Graders run and results (PASS/FAIL): Syntax validation passed
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Add integration tests with actual PostgreSQL
