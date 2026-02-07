# Feature Specification: Phase 5 Part B - Minikube Deployment

**Created**: 2026-02-04
**Status**: DRAFT

---

## 1. Executive Summary
This phase involves deploying the containerized Todo application (Frontend + Backend) to a local Kubernetes (Minikube) cluster. The deployment will integrate Dapr for event-driven communication and Strimzi Kafka as the event broker. This creates a production-like environment on the local machine.

## 2. User Stories

### US-3.1: Containerize Application
**As a** DevOps engineer  
**I want to** build Docker images for the frontend and backend  
**So that** they can be deployed to Kubernetes  

### US-3.2: Deploy Strimzi Kafka
**As a** system architect  
**I want to** deploy Strimzi Kafka Operator and a Kafka cluster to Minikube  
**So that** we have a reliable message broker for CloudEvents  

### US-3.3: Configure Dapr in Kubernetes
**As a** developer  
**I want to** initialize Dapr in the Minikube cluster and configure Pub/Sub components  
**So that** my application can use Dapr sidecars for event publishing/subscribing  

### US-3.4: Deploy Application with Helm
**As a** developer  
**I want to** deploy the Todo application using Helm charts with Dapr annotations  
**So that** the application runs with sidecars enabled and connects to Kafka  

### US-3.5: Verify Event Flow
**As a** tester  
**I want to** create a task via the frontend and verify the event reaches the backend/Kafka  
**So that** I know the event-driven architecture is working  

## 3. Requirements

### 3.1 Dockerization
- **Backend Image**: Python 3.12-slim, install dependencies (including dapr-ext-fastapi), expose port 8000.
- **Frontend Image**: Node 18-alpine, build Next.js app, expose port 3000.
- **Image Registry**: Use local Minikube docker registry (`eval $(minikube docker-env)`) or Docker Hub.

### 3.2 Kafka (Strimzi)
- Install Strimzi Cluster Operator via Helm.
- Create `Kafka` custom resource (minimal: 1 replica, ephemeral storage for dev).
- Create `KafkaTopic` custom resource for `todo.task.events`.

### 3.3 Dapr Configuration
- Install Dapr on Minikube (`dapr init -k`).
- Create `Component` resource for `pubsub-kafka` (pubsub.kafka).
  - Bootstrap servers: `my-cluster-kafka-bootstrap:9092`
  - Auth: None (for local/Minikube)

### 3.4 Kubernetes Resources (Helm)
- Update Helm charts from Phase 4.
- **Backend Deployment**:
  - Add annotations:
    - `dapr.io/enabled: "true"`
    - `dapr.io/app-id: "todo-backend"`
    - `dapr.io/app-port: "8000"`
  - Env vars: Database URL (Postgres in K8s), Dapr settings.
- **Frontend Deployment**:
  - Add annotations (optional, if frontend needs Dapr, currently backend-driven).
- **Ingress**: Expose frontend on `todo.local`.

## 4. Acceptance Criteria

- [ ] Docker images built and available in Minikube.
- [ ] Strimzi Operator running.
- [ ] Kafka cluster (1 broker) running and healthy.
- [ ] Dapr system pods running (sidecar-injector, operator, placement, sentry).
- [ ] Redis container running (default Dapr state store).
- [ ] `pubsub-kafka` component verified (`dapr components -k`).
- [ ] Todo Backend and Frontend pods running with 2/2 containers (app + sidecar).
- [ ] Can access application at `http://todo.local` (or Minikube IP).
- [ ] Creating a task triggers a log in the backend sidecar indicating successful publish to `pubsub-kafka`.

## 5. Technical Constraints
- Use Minikube with sufficient memory (start with `minikube start --memory=4096 --cpus=2`).
- Kafka can be heavy; use ephemeral storage and low replicas.
- Ensure `specvalid` CloudEvents are generated.
