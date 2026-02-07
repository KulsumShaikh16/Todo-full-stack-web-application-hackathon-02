# Implementation Plan: Phase 5 - Advanced Todo Features & EDA (Minikube)

**Status**: Draft
**Version**: 5.0
**Target Phase**: Phase 5 (Part A - Features & Part B - Local Kubernetes)
**Traceability**: Refers to `specs/005-phase5-dapr-kafka-cloud/spec.md`

---

## 1. Technical Architecture Overview
The system will be transitioned from a monolithic backend to a **sidecar-based distributed system** using Dapr. 

### 1.1 Service Boundaries
1.  **Chat API Service (Core)**:
    - Responsible for user interaction, FastAPI endpoints, and primary task persistence (SQLModel).
    - Publishes `task-events` to Dapr.
2.  **Recurring Task Service**:
    - Subscribes to `task-events.completed`.
    - Calculates next instance dates using `python-dateutil`.
    - Calls Chat API (Service Invocation) to create the next task.
3.  **Notification Service**:
    - Subscribes to `reminders`.
    - Pushes real-time alerts to the frontend via WebSockets.
    - Manages active client connections.

---

## 2. Backend Implementation Strategy

### 2.1 SQLModel & Database Schema
- **Update `Task` Model**:
    - `priority`: Enum (HIGH, MEDIUM, LOW).
    - `due_date`: DateTime (ISO 8601).
    - `recurrence_pattern`: String (daily, weekly, monthly).
    - `reminder_time`: DateTime.
- **New `Tag` Table**: `id`, `name` (unique).
- **New `TaskTag` Table**: Many-to-many join table for `Task` and `Tag`.

### 2.2 Dapr Integration (Backend)
- **Pub/Sub Broker**: Configure `pubsub-kafka` component using Strimzi Kafka.
- **Jobs API**: Use `dapr.client.schedule_job` for reminders instead of local cron.
- **State Store**: Use Redis or PostgreSQL (via Dapr) for non-task transient data (e.g., active subscription state).
- **Secret Store**: Use Kubernetes `Secret` provider to store DB URLs and API Keys.

### 2.3 Event Publishing Logic
- Implement `DaprEventPublisher` service in `backend/services/`.
- Every `CREATE`, `UPDATE`, `COMPLETE`, `DELETE` action will call `publisher.broadcast(task, event_type)`.

---

## 3. Frontend Implementation Strategy

### 3.1 Advanced Metadata Controls
- **Priority Picker**: Harmonious color-coded dropdown (High=Red, Med=Amber, Low=Blue).
- **Tag Management**: Multi-select input with autocomplete for existing tags.
- **Date/Time Picker**: Shadcn UI component for Due Dates and Reminders.

### 3.2 Dashboard Overhaul
- **Filtering**: State-driven sidebar to filter by Status, Priority, and Tags.
- **Global Search**: Debounced search bar querying the enhanced Backend search endpoint.
- **Sorting**: Header-based sorting (Priority weight, Chronological Due Date).

### 3.3 Real-time Synchronization
- Implement `useWebSocketSync` React hook.
- Connect to Notification Service socket.
- Trigger `queryClient.invalidateQueries` when a "TASK_UPDATED" or "REMINDER_FIRED" message is received.

---

## 4. Infrastructure & Deployment (Part B)

### 4.1 Minikube Environment Setup
1.  Start Minikube: `minikube start --memory=8192 --cpus=4`.
2.  Install Dapr: `dapr init -k`.
3.  Install Strimzi: `helm repo add strimzi https://strimzi.io/charts/ && helm install kafka-operator strimzi/strimzi-kafka-operator`.
4.  Deploy Kafka Cluster: `kubectl apply -f k8s/kafka-cluster.yaml`.

### 4.2 Dapr Component Manifests
- `pubsub-kafka.yaml`: Connects to `my-cluster-kafka-bootstrap:9092`.
- `statestore.yaml`: Default Redis store initialized by Dapr.
- `secretstore.yaml`: Kubernetes-based secret provider.

### 4.3 Helm Chart Structure
- `todo-app/`: Parent Chart.
    - `charts/api-service`: Backend deployment + Dapr annotations.
    - `charts/recurrence-service`: Background consumer.
    - `charts/notification-service`: WebSocket + Notification logic.
    - `charts/frontend`: Next.js deployment.

---

## 5. Sequence Diagrams (Event Flows)

### 5.1 Recurring Task Flow
1.  **User** marks task `T1` as complete → **Chat API**.
2.  **Chat API** persists state and publishes `com.todo.task.completed` → **Dapr Sidecar**.
3.  **Dapr** pushes event to **Kafka** topic `task-events`.
4.  **Recurring Task Service** (Consumer) receives event.
5.  Service calculates `T2` date and calls `POST /tasks` via **Dapr Service Invocation**.
6.  **Chat API** creates `T2` and triggers notification if needed.

### 5.2 Reminder Flow
1.  **User** sets reminder for task → **Chat API**.
2.  **Chat API** calls **Dapr Jobs API** to schedule `reminder-job-1`.
3.  **Dapr** triggers job at the scheduled time.
4.  Job call publishes to `reminders` topic.
5.  **Notification Service** consumes event and sends message to **User's WebSocket**.

---

## 6. Testing & Validation Plan

### 6.1 Local Verification Checklist
- [ ] **Schema**: Inspect database tables via `psql` to verify new columns and join tables.
- [ ] **Kafka Inspection**: Use `dapr pubsub publish` to manually test consumers.
- [ ] **Logs**: Verify `204 No Content` response from Dapr when publishing via HTTP.
- [ ] **UI**: Verify real-time toast appears when a reminder is manually triggered.

### 6.2 Acceptance Gate Checkpoints
- **Gate 1**: Backend compiles with SQLModel updates and Dapr SDK.
- **Gate 2**: Kafka topics auto-created by Strimzi or Dapr.
- **Gate 3**: End-to-end Recurrence: Completing a task automatically spawns the next instance in the DB.

---

## 7. Deliverables & Folder Structure
```text
.
├── .claude/
│   ├── agents/          # Updated Personas
│   └── skills/          # New EDA/K8s Skills
├── dapr-components/     # YAML manifests for sidecars
├── helm/                # Multi-service Helm charts
├── k8s/                 # Kafka Cluster and Operator configs
├── backend/
│   ├── models/          # Updated SQLModel definitions
│   ├── services/        # EventPublisher, RecurrenceService
│   └── consumers/       # Dapr subscription handlers
└── frontend/
    ├── components/      # PriorityPicker, TagList
    └── hooks/           # useRealTimeSync
```

---

## 8. Next Steps
1.  Finalize `plan.md` review.
2.  Execute `/sp.tasks` to generate atomic implementation steps.
3.  Begin with **Task-001: SQLModel and Database Migration**.
