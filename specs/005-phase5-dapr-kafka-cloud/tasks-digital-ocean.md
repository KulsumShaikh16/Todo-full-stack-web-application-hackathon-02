# Implementation Tasks: Phase 5 - Digital Ocean Cloud Deployment

**Total Tasks**: 15
**Status**: Pending Approval

---

## Phase 1: Advanced Dapr Logic (Backend)

### Task 1.1: Implement Dapr Jobs Service
**File**: `backend/services/jobs_service.py`
- Create a service to interact with the Dapr Jobs API.
- Method `schedule_reminder(task_id, remind_at, data)` calls `POST /v1.0-alpha1/jobs/<name>`.
- Method `cancel_reminder(task_id)` calls `DELETE /v1.0-alpha1/jobs/<name>`.

### Task 1.2: Implement Jobs Callback Route
**File**: `backend/routes/jobs.py`
- Create `@app.post("/api/jobs/trigger")` endpoint.
- Logic: When triggered, publish `com.todo.reminder.fired` event via `EventPublisher`.
- Register the route in `main.py`.

### Task 1.3: Integrate Reminders into Task Lifecycle
**File**: `backend/routes/tasks.py`
- On `create_task`: If `reminder_time` is present, call `jobs_service.schedule_reminder`.
- On `update_task`: If `reminder_time` changed, reschedule or cancel.
- On `delete_task`: Cancel any pending reminders.

### Task 1.4: Implement Audit/Activity Log Service
**File**: `backend/services/audit_service.py`
- Create a service that subscribes to all `todo.task.events`.
- Logic: Print a structured activity log (e.g., "User 1 created Task 123 at 10:00").
- Note: Requires Dapr subscription configuration.

---

## Phase 2: Cloud Infrastructure (Digital Ocean)

### Task 2.1: Provision DOCR and DOKS
**Tool**: `doctl` or DO Dashboard
- Create Container Registry: `todo-registry`.
- Create Kubernetes Cluster: `todo-cluster` (2 nodes, 4GB RAM).
- Connect cluster: `doctl kubernetes cluster kubeconfig save todo-cluster`.

### Task 2.2: Install Dapr on DOKS
**Command**: `dapr init -k`
- Run initialization on the cloud cluster.
- Verify: `dapr status -k`.

### Task 2.3: Install Strimzi Kafka Operator
**Command**: `kubectl apply -f https://strimzi.io/install/latest?namespace=kafka`
- Deploy Strimzi to the `kafka` namespace.
- Apply `k8s/kafka/kafka-cluster.yaml` (1 broker, ephemeral).

---

## Phase 3: Deployment Packaging

### Task 3.1: Create GitHub Actions Workflow
**File**: `.github/workflows/deploy.yml`
- Steps: Checkout, DO Login, DOCR Login, Docker Build, Docker Push, Helm Upgrade.
- Add secrets: `DIGITALOCEAN_ACCESS_TOKEN`, `DOCR_NAME`.

### Task 3.2: Create Cloud Helm Values
**File**: `helm/todo-app/values-digitalocean.yaml`
- Set `backend.image.repository` to DOCR path.
- Enable Dapr annotations in `backend` and `frontend`.
- Set `NEXT_PUBLIC_API_URL` to the LoadBalancer ingress host.

### Task 3.3: Define Cloud Dapr Components
**Folder**: `k8s/dapr/cloud/`
- `pubsub-kafka.yaml`: Brokers set to `my-cluster-kafka-bootstrap.kafka:9092`.
- `statestore-pg.yaml`: Postgres connection string (secret-referenced).

---

## Phase 4: Implementation & Verification

### Task 4.1: Deploy DB and Secrets
- Create Kubernetes labels and secrets for PostgreSQL (Neon).
- Ensure DB is reachable from DOKS.

### Task 4.2: Execute Helm Deployment
- Run `helm upgrade --install todo-app ./helm/todo-app -f helm/todo-app/values-digitalocean.yaml`.
- Verify pods are running with 2/2 containers.

### Task 4.3: Verify Event-Driven Flow in Cloud
- Create task with 1-minute reminder.
- Watch Dapr logs: `kubectl logs -l app=todo-backend -c daprd`.
- Verify Audit Service logs the creation and the reminder fire.

### Task 4.4: Final Polish & Documentation
- Update `PHASE5-COMPLETION-REPORT.md` with Digital Ocean details.
- Update `README.md` with cloud access URL.

---
**End of Tasks**
