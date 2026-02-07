---
name: 001-implement-backend-green
model: claude-opus-4-5-20251101
description: "Implement Phase II backend-only. Metadata: id=001, stage=green, feature=001-phase2-web."
---

## Prompt

Evolution of Todo – Phase II (Backend Only)

[Full command text preserved in command message]

## Response snapshot

Implemented backend-only FastAPI application per user command:

1. **Setup (T001-T004)**: Created directory structure, pyproject.toml, .env.example, README.md
2. **Foundational (T005-T010)**: Database layer (db.py, models.py), JWT auth dependency (auth.py), FastAPI app (main.py)
3. **Task Endpoints (T011-T016)**: CRUD + toggle completion endpoints at /api/tasks
4. **Validation (T017-T020)**: Proper error handling for 401/404/400
5. **Security (T021-T022)**: User-scoped access, environment-based secrets

Backend structure:
```
backend/
├── main.py          # FastAPI app with CORS
├── db.py            # SQLModel engine, session management
├── models.py        # User, Todo models + Pydantic schemas
├── dependencies/
│   └── auth.py      # JWT verification dependency
└── routes/
    └── tasks.py     # CRUD + toggle endpoints
```

All tasks marked complete in tasks.md.

## Outcome

- ✅ Impact: FastAPI backend with JWT auth, Neon PostgreSQL, user-scoped task CRUD
- 🧪 Tests: No tests written (not in scope for backend-only implementation)
- 📁 Files: 12 files created/modified
- 🔁 Next prompts: Run server with `uvicorn main:app --reload`
- 🧠 Reflection: Created simplified backend-only tasks.md replacing the full-stack version. Implemented JWT verification only (no signup/signin) per user requirements.

## Evaluation notes (flywheel)

- Failure modes observed: N/A
- Graders run and results (PASS/FAIL): Syntax validation passed
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Add unit tests for auth and endpoints
