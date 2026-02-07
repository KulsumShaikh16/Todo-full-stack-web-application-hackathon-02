# Atomic Tasks: Phase 5 - Advanced Todo Features & EDA (Minikube)

**Status**: Draft
**Version**: 5.0
**Target Phase**: Phase 5 (Part A - Features & Part B - Local Kubernetes)
**Traceability**: Refers to `specs/005-phase5-dapr-kafka-cloud/plan.md`

---

## 1. Backend Development Tasks (Core API)

### 1.1 Database & Models (Trace: Plan 2.1)
- [ ] **Task-BE-001**: Define `Priority` Enum (HIGH, MEDIUM, LOW) in `models.py`.
- [ ] **Task-BE-002**: Extend `Task` SQLModel with `priority`, `due_date`, `recurrence_pattern`, and `reminder_time`.
- [ ] **Task-BE-003**: Create `Tag` model and `TaskTag` join table for Many-to-Many relationships.
- [ ] **Task-BE-004**: Generate and execute Alembic migration for schema updates (or update `create_db_and_tables` for local dev).

### 1.2 Dapr Integration & Eventing (Trace: Plan 2.2, 2.3)
- [ ] **Task-BE-005**: Implement `EventPublisher` service using Dapr Python SDK.
- [ ] **Task-BE-006**: Update `create_task`, `update_task`, and `delete_task` CRUD logic to call `EventPublisher`.
- [ ] **Task-BE-007**: Implement Dapr `Jobs API` wrapper in the backend for scheduling/evicting reminders.
- [ ] **Task-BE-008**: Create `/dapr/subscribe` endpoint and register interest in `task-events` and `reminders`.
- [ ] **Task-BE-009**: Implement Service Invocation endpoints for cross-microservice state retrieval.

---

## 2. Frontend Development Tasks (UI/UX)

### 2.1 Metadata Controls (Trace: Plan 3.1)
- [ ] **Task-FE-001**: Implement `PriorityPicker` component with color-coded levels.
- [ ] **Task-FE-002**: Build `TagInput` component with autocomplete and "Max 10" validation.
- [ ] **Task-FE-003**: Integrate `DatePicker` and `TimePicker` for Due Dates and Reminders.
- [ ] **Task-FE-004**: Add `RecurrenceToggle` to the task creation form (Daily/Weekly/Monthly options).

### 2.2 Dashboard & Discovery (Trace: Plan 3.2, 3.3)
- [ ] **Task-FE-005**: Implement `FilterSidebar` to drill down tasks by tag and priority.
- [ ] **Task-FE-006**: Build `GlobalSearch` bar with debounced API queries.
- [ ] **Task-FE-007**: Implement `SortControls` for ordering tasks by Importance (Priority) and Deadline (Due Date).
- [ ] **Task-FE-008**: Implement `useRealTimeSync` hook to listen for WebSocket events via the Notification Service.

---

## 3. Microservices Development (Distributed)

### 3.1 Recurring Task Service (Trace: Plan 1.1, 5.1)
- [ ] **Task-SVC-001**: Bootstrap standalone FastAPI service for `Recurrence Handler`.
- [ ] **Task-SVC-002**: Implement event consumer for `com.todo.task.completed`.
- [ ] **Task-SVC-003**: Implement `dateutil` logic to calculate the next valid instance for all supported patterns.
- [ ] **Task-SVC-004**: Integrate Dapr Service Invocation to call the Core API's "Create Task" endpoint.

### 3.2 Notification Service (Trace: Plan 1.1, 5.2)
- [ ] **Task-SVC-005**: Bootstrap standalone service for `Notifications`.
- [ ] **Task-SVC-006**: Implement WebSocket `ConnectionManager` for active browser clients.
- [ ] **Task-SVC-007**: Implement event consumer for the `reminders` topic.
- [ ] **Task-SVC-008**: Broadcast reminder payloads to the correct `user_id` over established WebSocket connections.

---

## 4. Infrastructure & DevOps Tasks (Local K8s)

### 4.1 Environment Setup (Trace: Plan 4.1)
- [ ] **Task-INF-001**: Initialize Minikube with increased resources (4 CPUs, 8GB RAM).
- [ ] **Task-INF-002**: Install **Dapr** in K8s mode via `dapr init -k`.
- [ ] **Task-INF-003**: Install **Strimzi Kafka Operator** using Helm.
- [ ] **Task-INF-004**: Deploy the `Kafka` cluster custom resource and verify broker health.

### 4.2 Dapr & Helm Layout (Trace: Plan 4.2, 4.3)
- [ ] **Task-INF-005**: Create `pubsub-kafka.yaml` Dapr component pointing to Strimzi bootstrap.
- [ ] **Task-INF-006**: Create `statestore.yaml` and `secretstore.yaml` Dapr components.
- [ ] **Task-INF-007**: Update Helm charts for all 4 services (Core, Recurrence, Notification, Frontend).
- [ ] **Task-INF-008**: Add Dapr annotations (`dapr.io/enabled`, `app-id`, `app-port`) to Deployment templates.

---

## 5. Testing & Verification Tasks

### 5.1 Distributed Logic Verification (Trace: Plan 6.1)
- [ ] **Task-TST-001**: Verify `task.completed` creates a new database record via the Recurrence Service.
- [ ] **Task-TST-002**: Verify reminder fires exactly at the set time via Notification Service logs.
- [ ] **Task-TST-003**: Inspect Kafka topics using `kubectl run kafka-sniffer` to verify CloudEvent 1.0 compliance.

### 5.2 Resilience & Scalability (Trace: Plan 6.2)
- [ ] **Task-TST-004**: Perform "Scale to Zero" and "Scale Up" test for backend pods to verify Dapr state recovery.
- [ ] **Task-TST-005**: Validate Multi-Tenancy: Completing User A's task must never trigger a new task for User B.

---

## 6. Execution Order & Dependencies
1.  **Phase 1**: Task-INF-001 to 004 (Cluster Setup).
2.  **Phase 2**: Task-BE-001 to 004 (Schema Evolution).
3.  **Phase 3**: Task-INF-005 to 006 (Dapr Config).
4.  **Phase 4**: Task-BE-005 to 009 (Backend Integration).
5.  **Phase 5**: Task-SVC-001 to 008 (Microservices Implementation).
6.  **Phase 6**: Task-FE-001 to 008 (Frontend Polish).
7.  **Phase 7**: Task-TST-001 to 005 (Final Verification).
