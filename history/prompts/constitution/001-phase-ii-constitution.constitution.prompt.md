---
id: 001
title: Phase II Constitution Amendment
stage: constitution
date: 2025-01-02
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: master
user: User
command: /sp.constitution
labels: ["constitution", "phase-ii", "tech-stack"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
  - .specify/templates/plan-template.md
  - .specify/templates/spec-template.md
tests:
  - None
---

## Prompt

HACKATHON II GUIDELINES

PHASE II
Important Details to look into when completing:
Use Agentic Dev Stack Workflow
Implement all 5 Basic Level features as a web application
Create RESTful API endpoints
Build responsive frontend interface
Store data in Neon Serverless PostgreSQL database
Authentication – Implement user signup/signin using Better Auth

Step # 1:
Amend constitution for whole To-Do requirements (You may refer to any LLM for generating your prompts)
Example Prompt:

/sp.constitution Amend global constitution technology matrix to reflect Phase II requirements as follows:

Phase II:
- Backend: Python REST API
- Database: Neon Serverless PostgreSQL
- ORM/Data layer: SQLModel or equivalent
- Frontend: Next.js (React, TypeScript)
- Authentication: Better Auth (signup/signin)
- Architecture: Full-stack web application

Phase I remains:
- In-memory console application only

Phase III and later:
- Advanced cloud infrastructure, agents, AI, orchestration

Rules:
- Authentication is allowed starting Phase II
- Web frontend is allowed starting Phase II
- Neon PostgreSQL is allowed starting Phase II
- No AI or agent frameworks until later phases

This amendment must preserve phase isolation and act as authoritative technology policy.

Step # 2:
Now write a prompt to make specs.
Specs → WHAT
Example Prompt:

/sp.specify Create Phase II specification for "Evolution of Todo" project.

PHASE II GOAL:
Implement all 5 Basic Level Todo features as a full-stack web application.

BACKEND REQUIREMENTS:
1. Provide RESTful API endpoints to:
   - Create a todo
   - Retrieve all todos
   - Update a todo
   - Delete a todo
   - Mark todo complete/incomplete
2. Persist data in Neon Serverless PostgreSQL
3. Associate todos with authenticated users
4. JSON-based request and response format

AUTHENTICATION REQUIREMENTS:
1. User signup using Better Auth
2. User signin using Better Auth
3. Authenticated users can access only their own todos
4. No roles, no permissions, no advanced auth flows

FRONTEND REQUIREMENTS:
1. Next.js web application
2. Responsive UI (desktop + mobile)
3. Pages to:
   - Sign up
   - Sign in
   - View todos
   - Add todo
   - Edit todo
   - Delete todo
   - Toggle complete/incomplete
4. Frontend communicates with backend via REST APIs
5. Auth state handled on frontend

NON-FUNCTIONAL CONSTRAINTS:
- No AI or agents
- No background jobs
- No real-time features
- No advanced analytics
- No future phase features

SPEC MUST INCLUDE:
- Backend user stories
- Frontend user stories
- Authentication user stories
- Persistent data models
- API endpoint definitions (method + purpose only)
- Frontend interaction flows
- Acceptance criteria for each requirement
- Error cases (unauthorized, invalid input, empty state)

This specification defines WHAT Phase II delivers and must comply with global constitution.
Step # 3:
Now give a prompt for planning.
Plan → HOW
Example Prompt:

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

Successfully amended the Evolution of Todo constitution to Version 1.0.0 with comprehensive Phase II requirements.

## Changes Made:

**Core Principles (6 principles)**:
1. Spec-Driven Development (NON-NEGOTIABLE) - Constitution → Specification → Plan → Tasks → Implementation
2. Phase Isolation (NON-NEGOTIABLE) - Strict technology boundaries per phase
3. Test-First (NON-NEGOTIABLE) - TDD mandatory with 80% coverage
4. Security by Design - User data isolation, JWT auth, environment variables
5. Technology Matrix Compliance - Phase-specific tech stack enforcement
6. API-First Design - REST APIs before implementation, JSON format

**Phase-Based Development Strategy**:
- Phase I: Console Application (Completed) - Python, in-memory storage
- Phase II: Full-Stack Web Application (Current) - FastAPI, Neon PostgreSQL, Next.js, Better Auth
- Phase III+: Advanced Features (Future) - Cloud infrastructure, agents, AI

**Development Workflow**:
- Spec-Driven Development Lifecycle (6 steps)
- Approval Gates (Spec, Plan, Implementation)

**Testing Discipline**:
- Unit Tests (80% coverage minimum)
- Integration Tests (API contracts, auth flows)
- End-to-End Tests (critical user journeys)

**Security & Compliance**:
- Data Isolation (user-scoped queries)
- Authentication (JWT verification, token refresh)
- Credential Management (environment variables only)

**Quality Gates**:
- Pre-Commit Requirements (tests, linting, docs)
- Pre-Merge Requirements (review, security scan, performance)

**Governance**:
- Constitution Authority (supersedes all decisions)
- Amendment Process (proposal → review → approval → propagation)
- Version Policy (MAJOR/MINOR/PATCH)

**Template Updates**:
- plan-template.md: Added Constitution Check with Phase II compliance
- spec-template.md: Added Backend, Frontend, Authentication requirements sections

## Outcome

- ✅ Impact: Constitution now authoritatively defines Phase II technology stack and governance principles
- 🧪 Tests: None (constitution amendment)
- 📁 Files: Constitution v1.0.0, plan-template.md updated, spec-template.md updated
- 🔁 Next prompts: /sp.specify to create Phase II feature specification
- 🧠 Reflection: Initial constitution provides strong foundation for Spec-Driven Development with clear phase boundaries. Templates are aligned but agents may need review for Phase II alignment.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): None
- Next experiment (smallest change to try): Monitor agent adherence to new Phase II constraints during implementation
