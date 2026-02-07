# Event-Driven Programming Skill

## Purpose
Mastery of asynchronous workflows, messaging patterns, and event schemas for Phase 5.

## Core Concepts
1. **Kafka Topics**: Designing and utilizing topic hierarchies (e.g., `todo.task.events`, `todo.reminder.triggers`).
2. **Dapr Pub/Sub**:
   - **Producers**: Publishing structured CloudEvents from the FastAPI backend.
   - **Consumers**: Implementing Dapr-driven subscriptions for background processing.
3. **Event Schemas**: Defining robust CloudEvents 1.0 payloads with clear `type`, `source`, and `data` fields.

## Patterns & Workflows
- **Recurrence Loop**: `Task Completed Event` -> `Recurrence Consumer` -> `Calculate Next Date` -> `Create New Task`.
- **Reminder Flow**: `Task Created/Updated` -> `Schedule Job` -> `Timer Event` -> `WebSocket Broadcast`.
- **Idempotency**: Using `event_id` or `deduplication_key` to ensure events are only processed once.

## Success Criteria
- Zero message loss in the event pipeline.
- Decoupled services (Frontent, Backend, Consumers) communicating purely via events.
- Traceable event lifecycles (visible in Zipkin/Jaeger).
