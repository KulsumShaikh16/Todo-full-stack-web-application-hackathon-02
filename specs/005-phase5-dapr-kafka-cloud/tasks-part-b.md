# Implementation Tasks: Phase 5 Part B - Minikube Deployment

**Created**: 2026-02-04
**Status**: Ready for Execution

---

## 1. Environment Setup

### Task B.1.1: Reset Minikube with High Resources
**Command**: `reset_minikube.ps1` (to be created)
**Actions**:
- Delete existing cluster: `minikube delete`
- Start new cluster: `minikube start --cpus 4 --memory 8192`
- Enable ingress: `minikube addons enable ingress`
- Configure Docker env: `minikube -p minikube docker-env | Invoke-Expression`

### Task B.1.2: Initialize Dapr on Kubernetes
**Actions**:
- Run `dapr init -k`
- Verify system pods: `kubectl get pods -n dapr-system`

### Task B.1.3: Install Strimzi Kafka Operator
**Actions**:
- Create namespace: `kubectl create ns kafka`
- Add Helm repo: `helm repo add strimzi https://strimzi.io/charts/`
- Install: `helm install strimzi-cluster-operator strimzi/strimzi-kafka-operator --namespace kafka -n kafka`

---

## 2. Infrastructure Deployment (Kafka & Dapr)

### Task B.2.1: Define Kafka Cluster
**File**: `k8s/kafka/kafka-cluster.yaml`
**Content**: `Kafka` resource definition (ephemeral storage)

### Task B.2.2: Define Kafka Topic
**File**: `k8s/kafka/kafka-topic.yaml`
**Content**: `KafkaTopic` resource for `todo.task.events`

### Task B.2.3: Deploy Kafka
**Actions**:
- Apply manifests: `kubectl apply -f k8s/kafka/ -n kafka`
- Wait for readiness.

### Task B.2.4: Define Dapr Kafka Component
**File**: `k8s/dapr/pubsub-kafka.yaml`
**Content**: `Component` resource (pubsub.kafka) pointing to `my-cluster-kafka-bootstrap.kafka.svc.cluster.local:9092`

### Task B.2.5: Apply Dapr Component
**Actions**:
- Apply manifest: `kubectl apply -f k8s/dapr/pubsub-kafka.yaml -n default` (App namespace)

---

## 3. Application Packaging

### Task B.3.1: Create Container Build Script
**File**: `scripts/build_phase5_images.ps1`
**Actions**:
- Set Minikube Docker Env
- Build Backend: `docker build -t todo-backend:v5.0-dapr ./backend`
- Build Frontend: `docker build -t todo-frontend:v5.0 ./frontend`

### Task B.3.2: Execute Build
**Action**: Run the build script.

---

## 4. Helm Deployment

### Task B.4.1: Update Helm Values
**File**: `helm/todo-app/values.yaml`
**Actions**:
- Update image tags to `v5.0-dapr` / `v5.0`.
- Add global Dapr configuration if needed.
- Ensure database is configured (Postgres).

### Task B.4.2: Update Backend Deployment Template
**File**: `helm/todo-app/templates/backend-deployment.yaml`
**Actions**:
- Add annotations to `spec.template.metadata.annotations`:
  ```yaml
  dapr.io/enabled: "true"
  dapr.io/app-id: "todo-backend"
  dapr.io/app-port: "8000"
  dapr.io/config: "appconfig" # Optional tracing config
  ```

### Task B.4.3: Deploy Application
**Actions**:
- `helm upgrade --install todo-app ./helm/todo-app`

---

## 5. Verification

### Task B.5.1: Validate End-to-End
**Actions**:
- Get Minikube IP: `minikube ip`
- Add entry to hosts file or allow access.
- Access Frontend.
- Create Task.
- Check Logs: `kubectl logs -l app=todo-backend -c daprd` (Should show Pub/Sub connection)
