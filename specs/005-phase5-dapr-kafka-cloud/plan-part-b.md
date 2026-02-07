# Implementation Plan: Phase 5 Part B - Minikube Deployment

**Created**: 2026-02-04
**Status**: Ready for Implementation
**Prerequisite**: Phase 5 Part A (Code Changes) completed.

---

## 1. Environment Preparation
**Objective**: Prepare Minikube for Dapr and Kafka.

- **Task 1.1**: Start/Reset Minikube with sufficient resources.
  - `minikube start --cpus 4 --memory 8192` (Kafka + Dapr needs RAM)
- **Task 1.2**: Initialize Dapr on Kubernetes.
  - `dapr init -k`
  - Verify status: `dapr status -k`
- **Task 1.3**: Install Strimzi Kafka Operator (via Helm).
  - Add Helm repo: `helm repo add strimzi https://strimzi.io/charts/`
  - Install: `helm install strimzi-kafka-operator strimzi/strimzi-kafka-operator`

## 2. Kafka Setup
**Objective**: Deploy a Kafka cluster for Strimzi.

- **Task 2.1**: Define Kafka Cluster YAML (`k8s/kafka/kafka-cluster.yaml`).
  - Kind: `Kafka`
  - Replicas: 1 (Zookeeper), 1 (Kafka)
  - Storage: Ephemeral
- **Task 2.2**: Define Kafka Topic YAML (`k8s/kafka/kafka-topics.yaml`).
  - Topic: `todo.task.events`
- **Task 2.3**: Application Manifests.
  - Apply manifest: `kubectl apply -f k8s/kafka/`
  - Wait for ready: `kubectl wait kafka/my-cluster --for=condition=Ready`

## 3. Dapr Component Configuration
**Objective**: Configure Dapr to use the Strimzi Kafka cluster.

- **Task 3.1**: Create `k8s/dapr/pubsub-kafka.yaml`.
  - Type: `pubsub.kafka`
  - Metadata: brokers (`my-cluster-kafka-bootstrap:9092`)
- **Task 3.2**: Apply Component.
  - `kubectl apply -f k8s/dapr/pubsub-kafka.yaml`

## 4. Application Dockerization
**Objective**: Update Docker images with Phase 5 code.

- **Task 4.1**: Build Backend Image.
  - Context: `backend/`
  - Tag: `todo-backend:v5.0-dapr`
  - *Must run eval $(minikube docker-env) first*
- **Task 4.2**: Build Frontend Image.
  - Context: `frontend/`
  - Tag: `todo-frontend:v5.0`

## 5. Helm Chart Updates
**Objective**: Update Helm charts to support Dapr.

- **Task 5.1**: Update `helm/todo-app/values.yaml`.
  - Add `dapr` section or annotations config.
- **Task 5.2**: Update `deployment.yaml` templates (if not using pod annotations in values).
  - Ensure annotations are on the `Pod` spec (metadata inside template).
  - `dapr.io/enabled: "true"`
  - `dapr.io/app-id: "todo-backend"`
- **Task 5.3**: Configure Environment Variables.
  - K8s DB connection strings (internal DNS).

## 6. Deployment and Verification
**Objective**: Deploy app and verify loop.

- **Task 6.1**: Deploy Postgres (if not using external).
  - Use Helm chart or existing manifest.
- **Task 6.2**: Helm Install/Upgrade Todo App.
  - `helm upgrade --install todo-app ./helm/todo-app`
- **Task 6.3**: Verify Pods.
  - Ensure 2/2 containers for backend (main + daprd).
- **Task 6.4**: Test Functionality.
  - Port-forward frontend.
  - Create task.
  - Check Backend Logs: `kubectl logs -l app=todo-backend -c todo-backend`
  - Check Dapr Logs: `kubectl logs -l app=todo-backend -c daprd`

## 7. Risks & Mitigation
- **Resource Exhaustion**: Minikube might crash. *Mitigation*: Stop unrelated containers, increase allocated RAM.
- **Kafka Startup Time**: Strimzi takes time. *Mitigation*: Use `kubectl wait` loops in scripts.
- **Networking**: Dapr sidecar communication issues. *Mitigation*: Check `dapr dashboard -k`.
