# Project Constitution: AI Powered Todo Chatbot (v5.0)
## Hackathon Phase 5 - Part A & Part B

This document serves as the supreme governing law for Phase 5 of the "Evolution of Todo" project. It outlines the architectural principles, development workflow, and technical constraints required to transform the application into an event-driven distributed system running locally on Kubernetes.

---

## 🎯 Primary Objective
Transform the Todo application from a CRUD-based application into an **Event-Driven Distributed System** running locally on **Kubernetes (Minikube)**, leveraging **Dapr** and **Kafka**.

---

## 🚀 Goals
1.  **Event-Driven Evolution**: Refactor the existing chatbot architecture into loosely coupled microservices.
2.  **Advanced Feature Integration**: Implement sophisticated task management features (Priority, Tags, Recurrence, Reminders).
3.  **Dapr Abstraction Layer**: Use Dapr building blocks for all cross-cutting concerns: Pub/Sub, State, Jobs, Secrets, and Service Invocation.
4.  **Local Kubernetes Excellence**: Achieve full operational status on Minikube before proceeding to cloud deployment.

---

## ⚖️ Non-Negotiable Rules

### 1. Spec-Driven Development (SDD)
- **Zero Manual Coding**: All production code MUST be generated through the SDD lifecycle:
  `Constitution → Specify → Plan → Tasks → Implement`
- **Tracing**: Every code change must be explicitly mapped back to a specific `sp.specify`, `sp.plan`, or `sp.tasks` command.
- **Hierarchy Enforcement**: No agent or process may deviate from the `Constitution > Spec > Plan > Task > Implement` order.

### 2. Event-Driven Architecture (EDA) & Kafka
- **Dapr-Only Messaging**: **Kafka must NEVER be accessed directly** from application logic. All publishing and subscribing MUST flow through Dapr Pub/Sub components.
- **Topic Topology**: The following Kafka topics are mandatory:
    - `task-events` (Mutations: created, updated, deleted)
    - `reminders` (Scheduled notifications)
    - `task-updates` (Real-time synchronization events)
- **CRUD to Event Mapping**: Every single Task CRUD operation must emit a corresponding CloudEvent via Dapr.

### 3. Microservices & Coupling
- **Loose Coupling**: Services must remain independent. Direct service-to-service calls are prohibited; use **Dapr Service Invocation** or **Events**.
- **Required Services**:
    - **Chat API / Backend Service**: The primary entry point and task orchestration hub.
    - **Recurring Task Service**: Background service that consumes completion events and creates next instances.
    - **Notification Service**: Handles the delivery of reminders and real-time alerts.
    - *Optional: Audit Service (log capture).*

### 4. Mandatory Advanced Features
The following features are non-optional and must be fully implemented and integrated:
- **Priorities**: High, Medium, and Low levels.
- **Tags & Search**: Full tagging support with advanced filtering and search.
- **Sorting**: Multi-attribute sorting on the dashboard.
- **Due Dates & Reminders**: Temporal task management.
- **Recurring Tasks**: Automated task regeneration logic.

### 5. Dapr & Multi-Environment Constraints
- **Required Building Blocks**:
    - **Pub/Sub (Kafka)**: For inter-service communication.
    - **State Management**: For reliable persistence of non-relational state.
    - **Jobs API**: MUST be used for reminder scheduling (polling/cron in app code is banned).
    - **Service Invocation**: For synchronous inter-service communication.
    - **Secrets Store**: Secure retrieval of credentials from Kubernetes or Dapr.
- **No Hardcoding**: Credentials, API keys, Kafka brokers, or Database connection strings must NEVER be hardcoded. Use Dapr Components or Kubernetes Secrets.

### 6. Local Deployment (Minikube)
- **Cluster**: Deploy to Minikube using managed manifests or Helm charts.
- **Dapr Integration**: Dapr must be initialized in Kubernetes mode (`dapr init -k`).
- **Kafka Strategy**: Kafka must be deployed using the **Strimzi Operator**.
- **Annotations**: All Kubernetes deployments MUST include:
    - `dapr.io/enabled: "true"`
    - `dapr.io/app-id: <unique-id>`
    - `dapr.io/app-port: <service-port>`

---

## ✅ Acceptance Criteria (Definition of Done)
1.  **Feature Completeness**: All "Advanced Features" are visible and functional in the UI and Chat interface.
2.  **Event Integrity**: Every task mutation is verified to produce a valid CloudEvent in the Kafka cluster.
3.  **Logic Automation**: Reminders fire correctly according to scheduled jobs, and recurring tasks are auto-created upon completion events.
4.  **Cluster Stability**: The entire stack (Backend, Frontend, Dapr, Kafka, Database) runs stable on Minikube.
5.  **Audit Trail**: Every significant prompt is recorded in a **Prompt History Record (PHR)**.

---

**This constitution applies strictly to Phase 5 Part A and Part B.**
**Failure to adhere to these principles constitutes a failure of the phase.**
