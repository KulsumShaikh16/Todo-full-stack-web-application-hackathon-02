# System Design Skill

## Purpose
This skill provides the framework and principles for designing scalable, maintainable, and high-performance distributed systems for the "Evolution of Todo" project, with a focus on Phase 5 requirements.

## Core Principles
1. **Separation of Concerns**: Decouple business logic from infrastructure using Dapr abstractions.
2. **Statelessness**: Ensure all services (FastAPI, Next.js) are stateless to facilitate horizontal scaling.
3. **Draft-First Architectural Integrity**: Always prioritize using Dapr for Pub/Sub, Secrets, and State management.
4. **Data Isolation**: Enforce multi-tenancy at the architectural level using `user_id` as the primary partition key.

## Design Patterns
- **Event-Driven Architecture (EDA)**: Use asynchronous event flows (via Kafka/Dapr) to handle side effects like recurrence generation and reminders.
- **Sidecar Pattern**: Utilize Dapr sidecars to manage distributed system complexities (auth, retries, state) away from the business code.
- **Repository Pattern**: Abstract data access logic using SQLModel to simplify testing and schema evolution.

## Architecture Guidelines (Phase 5)
- **Consistency**: Use CloudEvents 1.0 for all inter-service messages.
- **Resilience**: Implement circuit breakers and retries via Dapr resiliency policies.
- **Observability**: Design for distributed tracing (Zipkin) and structured logging from day one.

## Success Criteria
- The system can scale horizontally by adding replicas.
- Infrastructure (Kafka, DB) can be swapped (e.g., local to cloud) without changing application code.
- All operations are idempotent.
