# Phase 5 - Quick Command Cheat Sheet

## 🚀 Quick Start

```powershell
# Navigate to project
cd "e:\gemini-cli\Todo Full-Stack Web Application"
```

---

## 📝 Part A - Advanced Features

```powershell
# Step 1: Specify
sp specify "Advanced Features Integration - Phase 5"

# Step 2: Plan
sp plan "Advanced Features Integration - Phase 5"

# Step 3: Tasks
sp task "Advanced Features Integration - Phase 5"

# Step 4: Implement
sp implement "Advanced Features Integration - Phase 5"
```

---

## 🐳 Part B - Minikube + Dapr + Kafka

```powershell
# Step 1: Specify
sp specify "Minikube Deployment with Dapr and Self-Hosted Kafka"

# Step 2: Plan
sp plan "Minikube Deployment with Dapr and Self-Hosted Kafka"

# Step 3: Tasks
sp task "Minikube Deployment with Dapr and Self-Hosted Kafka"

# Step 4: Implement
sp implement "Minikube Deployment with Dapr and Self-Hosted Kafka"

# Manual Deployment Commands
minikube start --memory=4096 --cpus=2
dapr init -k
kubectl create namespace kafka
kubectl apply -f https://strimzi.io/install/latest?namespace=kafka
helm install todo-app ./helm/todo-app -f values-local.yaml
```

---

## ☁️ Part C - Cloud Deployment (OKE)

```powershell
# Step 1: Specify
sp specify "Cloud Kubernetes Deployment on OKE with Redpanda Cloud"

# Step 2: Plan
sp plan "Cloud Kubernetes Deployment on OKE with Redpanda Cloud"

# Step 3: Tasks
sp task "Cloud Kubernetes Deployment on OKE with Redpanda Cloud"

# Step 4: Implement
sp implement "Cloud Kubernetes Deployment on OKE with Redpanda Cloud"

# Manual Cloud Commands
oci ce cluster create-kubeconfig --cluster-id <cluster-ocid>
kubectl get nodes
dapr init -k
helm install todo-app ./helm/todo-app -f values-production.yaml
kubectl get ingress -n todo-app
```

---

## 🧪 Testing Commands

```powershell
# Check Dapr status
dapr status -k

# Check all pods
kubectl get pods --all-namespaces

# Check Kafka pods
kubectl get pods -n kafka

# View Dapr logs
kubectl logs -l app=todo-backend -c daprd --tail=50

# View application logs
kubectl logs -l app=todo-backend -c todo-backend --tail=50

# Test event publishing
curl -X POST http://todo-app.local/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Task","priority":"HIGH"}'
```

---

## 📊 Verification Commands

```powershell
# Verify Helm deployment
helm list -n todo-app

# Verify services
kubectl get svc -n todo-app

# Verify ingress
kubectl get ingress -n todo-app

# Verify Dapr components
kubectl get components -n todo-app

# Scale deployment
kubectl scale deployment todo-backend --replicas=3 -n todo-app

# Check HPA
kubectl get hpa -n todo-app
```

---

## 🔥 One-Liner for Each Part

### Part A (Features)
```powershell
sp specify "Advanced Features Integration - Phase 5" && sp plan "Advanced Features Integration - Phase 5" && sp task "Advanced Features Integration - Phase 5" && sp implement "Advanced Features Integration - Phase 5"
```

### Part B (Minikube)
```powershell
sp specify "Minikube Deployment with Dapr and Self-Hosted Kafka" && sp plan "Minikube Deployment with Dapr and Self-Hosted Kafka" && sp task "Minikube Deployment with Dapr and Self-Hosted Kafka" && sp implement "Minikube Deployment with Dapr and Self-Hosted Kafka"
```

### Part C (Cloud)
```powershell
sp specify "Cloud Kubernetes Deployment on OKE with Redpanda Cloud" && sp plan "Cloud Kubernetes Deployment on OKE with Redpanda Cloud" && sp task "Cloud Kubernetes Deployment on OKE with Redpanda Cloud" && sp implement "Cloud Kubernetes Deployment on OKE with Redpanda Cloud"
```

---

## 📖 Review Constitution
```powershell
code specs/005-phase5-dapr-kafka-cloud/constitution.md
```

## 📖 Review Full Commands Guide
```powershell
code specs/005-phase5-dapr-kafka-cloud/PHASE5-COMMANDS.md
```

---

**Start Now:**
```powershell
cd "e:\gemini-cli\Todo Full-Stack Web Application"
sp specify "Advanced Features Integration - Phase 5"
```
