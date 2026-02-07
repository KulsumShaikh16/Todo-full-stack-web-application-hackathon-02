# Specification: Phase 5 - Advanced Todo Features & Event-Driven Architecture (Local K8s)

**Status**: Draft
**Version**: 5.0
**Target Phase**: Phase 5 (Part A - Features & Part B - Local Kubernetes)

---

## 1. Executive Summary
This specification defines the evolution of the Todo Chatbot into a cloud-native, event-driven microservices architecture. The system will support advanced task management features like priorities, tags, recurrence, and reminders. Infrastructure will be abstracted using Dapr (via Kafka on Minikube) to ensure loose coupling and environmental portability.

---

## 2. Functional Requirements

### 2.1 Intermediate Features (Metadata & Discovery)
- **Task Priority**: Support `HIGH`, `MEDIUM`, and `LOW` levels. Default is `MEDIUM`.
- **Task Tags**: Support multiple alphanumeric tags (e.g., `Work`, `Personal`, `Home`).
- **Search**: Keyword search across task titles and tag names.
- **Filter**: Narrow down tasks by specific priority levels or tags.
- **Sorting**: Display tasks ordered by title, due date, or priority importance.

### 2.2 Advanced Features (Automation & Intelligence)
- **Due Dates**: Explicit deadline assignment for tasks.
- **Reminders**: Scheduling of notifications to fire *before* the due date.
- **Recurring Tasks**: Support for `daily`, `weekly`, and `monthly` patterns.
- **Auto-Recurrence Flow**: Automatically create the next instance of a recurring task immediately after the current instance is completed.

---

## 3. Architecture Design (Event-Driven)

### 3.1 Distributed System Principles
- **Loose Coupling**: Services must never share databases or have hard dependencies.
- **Async Communication**: Primary inter-service communication via events.
- **Dapr Abstraction Layer**: 
    - No direct Kafka SDK usage.
    - All publishing/subscribing via Dapr HTTP/gRPC APIs (port 3500).
    - Service discovery via Dapr Service Invocation.

### 3.2 Kafka Topology (Required Topics)
- `task-events`: Stream for all Task lifecycle events (created, updated, completed, deleted).
- `reminders`: Stream for scheduled reminder triggers.
- `task-updates`: Stream for real-time UI synchronization events (WebSockets).

### 3.3 Microservices Suite
- **Backend Chat API**: The core orchestrator handling user interaction and task CRUD.
- **Recurring Task Service**: Background consumer that processes completion events and triggers next-instance creation.
- **Notification Service**: Consumer that handles reminder alerts and pushes to WebSockets.
- **Audit Service (Optional)**: Persistent log of all system mutations for compliance.

### 3.4 Dapr Building Blocks
- **Pub/Sub**: Using Kafka for the event backbone.
- **State Management**: Using Redis/PostgreSQL for persistent state.
- **Jobs API**: For robust scheduling of reminders.
- **Service Invocation**: For synchronous retrieval of user context or metadata.
- **Secrets Management**: Using K8s secrets to inject DB and API credentials.

---

## 4. Local Deployment Strategy (Minikube)

### 4.1 Cluster Requirements
- **Cluster**: Minikube (v1.30+) with Docker driver.
- **Dapr**: Initialized in Kubernetes mode (`dapr init -k`).
- **Kafka**: Managed by **Strimzi Operator** with a single-node broker for development.

### 4.2 Orchestration
- **Helm**: Application services must be packaged as Helm charts.
- **Annotations**: Every service deployment MUST include:
    ```yaml
    dapr.io/enabled: "true"
    dapr.io/app-id: "service-name"
    dapr.io/app-port: "8000"
    ```

---

## 5. Event Specifications

### 5.1 Task Event Schema
```json
{
  "event_type": "created | updated | completed | deleted",
  "task_id": "integer",
  "user_id": "integer",
  "timestamp": "ISO-8601",
  "task_data": {
    "title": "string",
    "priority": "HIGH|MEDIUM|LOW",
    "tags": ["string"],
    "due_date": "ISO-8601",
    "recurrence_pattern": "string"
  }
}
```

### 5.2 Reminder Event Schema
```json
{
  "task_id": "integer",
  "user_id": "integer",
  "title": "string",
  "due_at": "ISO-8601",
  "remind_at": "ISO-8601"
}
```

---

## 6. User Journeys

### Journey 1: The High-Priority Recurring Task
1. User tells the AI: "Create a high priority task 'Pay Rent' recurring monthly on the 1st with a reminder 2 days before."
2. Backend API creates the task and publishes `task.created`.
3. Notification Service sees the reminder intent and schedules a job via Dapr Jobs API.
4. On the 1st, User completes the task.
5. Backend publishes `task.completed`.
6. Recurring Task Service consumes the event, calculates the next 1st of the month, and calls Backend to create the new instance.

### Journey 2: Real-time Discovery
1. User filters task list by "Work" tag and "High" priority.
2. User searches for "Sprint".
3. System returns the intersection of filters and search immediately.

---

## 7. Domain Rules
- **Idempotency**: Creating a next instance of a recurring task must check if it already exists for that period.
- **Isolation**: A user must NEVER see events or data belonging to another user.
- **Validation**: Cron expressions and date formats must be validated before event publication.
- **Reminder Window**: Reminders cannot be set in the past.

---

## 8. Event Flows
1. **Task Completion Flow**:
   `User` → `Backend (Complete)` → `Dapr Pub` → `Kafka (task-events)` → `Recurring Service (Consume)` → `Dapr Service Call` → `Backend (Create New)`
2. **Reminder Flow**:
   `User` → `Backend (Set Reminder)` → `Dapr Jobs API` → `Reminder Timer` → `Dapr Pub` → `Kafka (reminders)` → `Notification Service (Consume)` → `WebSockets`

---

## 9. Acceptance Criteria
- [ ] **Functional**: Priorities, Tags, Search, Filtering, and Sorting are working correctly.
- [ ] **Automation**: Recurring tasks auto-create their next instance upon completion of the previous.
- [ ] **Temporal**: Reminders fire exactly at the scheduled time (verified via logs/UI).
- [ ] **EDA**: All inter-service communication is verified to use Dapr + Kafka.
- [ ] **K8s Verification**: Services are running in Minikube with Dapr sidecars injected (2/2 containers).
- [ ] **Zero Hardcoding**: Secrets correctly injected via Dapr Secret Store.
- [ ] **SDD Compliance**: All code changes traced back to this specification and subsequent implementation plans.
