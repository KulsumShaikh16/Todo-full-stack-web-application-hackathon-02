# Implementation Plan: Phase 5 - Digital Ocean Cloud Deployment

**Created**: 2026-02-04
**Status**: Ready for Implementation
**Prerequisite**: specification `spec-digital-ocean.md` approved.

---

## 🏗️ Phase 1: Advanced Dapr Integration (Backend Updates)
**Objective**: Finalize the "Reminder" feature using the Dapr Jobs API.

- **Task 1.1**: Implement `JobsService` in `backend/services/jobs_service.py`.
  - Handle scheduling of jobs via Dapr alpha1 Jobs API (`/v1.0-alpha1/jobs/`).
- **Task 1.2**: Implement `/api/jobs/trigger` endpoint in `backend/routes/jobs.py`.
  - Handle callbacks from Dapr when a job (reminder) is due.
- **Task 1.3**: Update `Todo` creation logic to schedule a job if `reminder_time` is set.
- **Task 1.4**: Update `EventPublisher` to support `com.todo.reminder.fired` event.

## 🐳 Phase 2: Dockerization & Registration
**Objective**: Prepare images for the cloud.

- **Task 2.1**: Update `backend/Dockerfile` and `frontend/Dockerfile` for production optimization.
- **Task 2.2**: Configure GitHub Actions to build and push images to **Digital Ocean Container Registry (DOCR)**.
- **Task 2.3**: Verify images are available in DOCR.

## ☁️ Phase 3: Digital Ocean Infrastructure (DOKS)
**Objective**: Provision the cloud environment.

- **Task 3.1**: Provision DOKS cluster using `doctl` or DO Dashboard.
  - Spec: `s-2vcpu-4gb` nodes (at least 2).
- **Task 3.2**: Configure `doctl` credentials and `kubectl` context.
- **Task 3.3**: Install Dapr on DOKS (`dapr init -k`).
- **Task 3.4**: Deploy Strimzi Kafka Operator to DOKS for self-hosted Kafka.
  - Alternatively: Configure Redpanda Cloud credentials in K8s secrets.

## 🚢 Phase 4: Helm Chart Cloud Migration
**Objective**: Deploy the application to DOKS.

- **Task 4.1**: Create `helm/todo-app/values-digitalocean.yaml`.
  - Update repository to DOCR paths.
  - Set Dapr annotations for sidecar injection.
  - Configure Ingress for Digital Ocean Load Balancer.
- **Task 4.2**: Define Dapr Components for Cloud (`k8s/dapr/cloud/`).
  - `pubsub-kafka.yaml` (connecting to Strimzi/Redpanda).
  - `statestore-pg.yaml` (connecting to Neon/DO Postgres).
  - `secretstore.yaml` (Kubernetes secrets).
- **Task 4.3**: Deploy via Helm: `helm upgrade --install todo-app ./helm/todo-app -f values-digitalocean.yaml`.

## 🔄 Phase 5: CI/CD & Monitoring
**Objective**: Automate and observe.

- **Task 5.1**: Create `.github/workflows/deploy-digitalocean.yml`.
  - Build, Push, and Helm Upgrade workflows.
- **Task 5.2**: Configure Dapr monitoring (Prometheus/Grafana) or use Dapr Dashboard.
- **Task 5.3**: Verify end-to-end flow: Create task with reminder -> Job fires -> Event published -> Application log recorded.

---
## 📊 Risk Mitigation
- **Resource Limits**: Ensure DOKS nodes have enough RAM for Kafka.
- **Networking**: Verify Dapr sidecars can reach each other via mTLS.
- **Secrets**: Ensure no plain-text secrets in YAML files (use K8s Secrets).
