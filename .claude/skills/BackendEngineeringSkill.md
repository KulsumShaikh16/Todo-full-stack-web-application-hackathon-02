# Backend Engineering Skill (FastAPI + SQLModel)

## Purpose
Expertise in building responsive, type-safe, and event-driven backends for Phase 5 task management.

## Core Competencies
1. **REST API Design**: Implementing endpoints that follow the Phase 5 API specification precisely.
2. **Model Design (SQLModel)**: Designing schemas for Priority, Tags (Many-to-Many), Due Dates, and Recurrence patterns.
3. **Database Migrations**: Managing schema evolution as features advance while preserving user data.
4. **Dapr SDK Usage**:
   - `DaprClient`: For publishing events and retrieving secrets.
   - `Dapr-ext-FastAPI`: For handling subscriptions and triggers.

## Implementation Guidelines
- **Background Jobs**: Use the Dapr Jobs API (scheduled for Phase 5) or event-driven triggers for long-running or delayed tasks (reminders).
- **Recurring Logic**: Implement robust date calculations for Daily, Weekly, and Monthly patterns using `python-dateutil`.
- **State Management**: Use Dapr State Store for transient state and Neon PostgreSQL for permanent task records.

## Quality Standards
- 100% Type-hinting coverage.
- Pydantic models for all Request/Response validation.
- Every query MUST be filtered by `user_id`.
- Graceful error handling with appropriate HTTP status codes.

## Dapr-Integrated Backend
- **Secrets**: Retrieve DB credentials via `client.get_secret()`.
- **Pub/Sub**: Publish `task.completed` to trigger recurrence consumers.
