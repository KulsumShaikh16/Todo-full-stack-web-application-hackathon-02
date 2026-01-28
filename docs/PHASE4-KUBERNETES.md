# Phase 4: Local Kubernetes Deployment

This guide covers deploying the Todo Full-Stack Application using Docker, Kubernetes, and Helm.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Structure](#project-structure)
3. [Docker Setup](#docker-setup)
4. [Kubernetes Manifests](#kubernetes-manifests)
5. [Helm Charts](#helm-charts)
6. [Deployment Guide](#deployment-guide)
7. [Troubleshooting](#troubleshooting)

---

## 🔧 Prerequisites

Before proceeding, install the following tools:

### Docker (24+)
```bash
# Verify installation
docker --version
```
Install: https://docs.docker.com/get-docker/

### kubectl (1.28+)
```bash
# Verify installation
kubectl version --client
```
Install: https://kubernetes.io/docs/tasks/tools/

### Helm (3.x)
```bash
# Verify installation
helm version
```
Install: https://helm.sh/docs/intro/install/

### Minikube (1.32+)
```bash
# Verify installation
minikube version
```
Install: https://minikube.sigs.k8s.io/docs/start/

---

## 📁 Project Structure

```
Todo Full-Stack Web Application/
├── backend/
│   ├── Dockerfile          # Backend container image
│   ├── .dockerignore       # Files to exclude from build
│   └── ...
├── frontend/
│   ├── Dockerfile          # Frontend container image
│   ├── .dockerignore       # Files to exclude from build
│   └── ...
├── k8s/
│   └── base/               # Raw Kubernetes manifests
│       ├── namespace.yaml
│       ├── configmap.yaml
│       ├── secrets.yaml
│       ├── backend-deployment.yaml
│       ├── backend-service.yaml
│       ├── frontend-deployment.yaml
│       ├── frontend-service.yaml
│       ├── ingress.yaml
│       └── backend-hpa.yaml
├── helm/
│   └── todo-app/           # Helm chart
│       ├── Chart.yaml
│       ├── values.yaml
│       ├── values-dev.yaml
│       ├── values-staging.yaml
│       ├── values-prod.yaml
│       └── templates/
├── scripts/
│   ├── deploy-minikube.ps1 # Windows deployment script
│   ├── deploy-minikube.sh  # Linux/macOS deployment script
│   └── create-secrets.ps1  # Create K8s secrets from .env
└── docker-compose.yml      # Local Docker testing
```

---

## 🐳 Docker Setup

### Build Backend Image
```bash
cd backend
docker build -t todo-backend:latest .
```

### Build Frontend Image
```bash
cd frontend
docker build -t todo-frontend:latest .
```

### Test with Docker Compose
```bash
# From project root
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## ☸️ Kubernetes Manifests

Raw Kubernetes manifests are in `k8s/base/`. To deploy directly:

```bash
# Create namespace
kubectl apply -f k8s/base/namespace.yaml

# Create ConfigMap and Secrets (edit secrets.yaml first!)
kubectl apply -f k8s/base/configmap.yaml
kubectl apply -f k8s/base/secrets.yaml

# Deploy applications
kubectl apply -f k8s/base/backend-deployment.yaml
kubectl apply -f k8s/base/backend-service.yaml
kubectl apply -f k8s/base/frontend-deployment.yaml
kubectl apply -f k8s/base/frontend-service.yaml

# Create Ingress
kubectl apply -f k8s/base/ingress.yaml

# Optional: Enable autoscaling
kubectl apply -f k8s/base/backend-hpa.yaml
```

---

## ⎈ Helm Charts

### Install with Helm (Recommended)

```bash
# Development environment
helm install todo-app ./helm/todo-app -f ./helm/todo-app/values-dev.yaml --create-namespace

# Staging environment
helm install todo-app ./helm/todo-app -f ./helm/todo-app/values-staging.yaml --create-namespace

# Production environment
helm install todo-app ./helm/todo-app -f ./helm/todo-app/values-prod.yaml --create-namespace
```

### Update Deployment
```bash
helm upgrade todo-app ./helm/todo-app -f ./helm/todo-app/values-dev.yaml -n todo-app
```

### Rollback
```bash
helm rollback todo-app 1 -n todo-app
```

### Uninstall
```bash
helm uninstall todo-app -n todo-app
```

---

## 🚀 Deployment Guide

### Automated Deployment (Recommended)

#### Windows PowerShell
```powershell
.\scripts\deploy-minikube.ps1
```

#### Linux/macOS
```bash
chmod +x ./scripts/deploy-minikube.sh
./scripts/deploy-minikube.sh
```

### Manual Deployment

#### Step 1: Start Minikube
```bash
minikube start --driver=docker --memory=4096 --cpus=2
minikube addons enable ingress
```

#### Step 2: Configure Docker for Minikube
```bash
# Linux/macOS
eval $(minikube docker-env)

# Windows PowerShell
& minikube -p minikube docker-env --shell powershell | Invoke-Expression
```

#### Step 3: Build Images
```bash
cd backend && docker build -t todo-backend:latest .
cd ../frontend && docker build -t todo-frontend:latest .
```

#### Step 4: Load Images into Minikube
```bash
minikube image load todo-backend:latest
minikube image load todo-frontend:latest
```

#### Step 5: Create Secrets
```powershell
# Windows
.\scripts\create-secrets.ps1

# Or manually create from .env values
```

#### Step 6: Deploy with Helm
```bash
helm install todo-app ./helm/todo-app -f ./helm/todo-app/values-dev.yaml --create-namespace
```

#### Step 7: Access the Application

Option 1: Add to hosts file
```bash
# Get Minikube IP
minikube ip

# Add to hosts file
# Windows: C:\Windows\System32\drivers\etc\hosts
# Linux/macOS: /etc/hosts
<MINIKUBE_IP> todo-app.local
```

Option 2: Port Forward
```bash
kubectl port-forward svc/todo-frontend-service 3000:3000 -n todo-app
kubectl port-forward svc/todo-backend-service 8000:8000 -n todo-app
```

---

## 🔍 Useful Commands

### View Resources
```bash
# List all resources in namespace
kubectl get all -n todo-app

# Get pods
kubectl get pods -n todo-app

# Get services
kubectl get svc -n todo-app

# Get ingress
kubectl get ingress -n todo-app
```

### View Logs
```bash
# Backend logs
kubectl logs -f deployment/todo-backend -n todo-app

# Frontend logs
kubectl logs -f deployment/todo-frontend -n todo-app
```

### Describe Resources
```bash
kubectl describe pod <pod-name> -n todo-app
kubectl describe deployment todo-backend -n todo-app
```

### Scale Deployment
```bash
kubectl scale deployment todo-backend --replicas=3 -n todo-app
```

### Check Helm Release
```bash
helm status todo-app -n todo-app
helm history todo-app -n todo-app
```

---

## 🐛 Troubleshooting

### Pod CrashLoopBackOff
```bash
# Check logs
kubectl logs <pod-name> -n todo-app

# Check events
kubectl describe pod <pod-name> -n todo-app
```

### ImagePullBackOff
```bash
# Verify image is loaded in Minikube
minikube image ls | grep todo

# Ensure imagePullPolicy is IfNotPresent
```

### Connection Refused
```bash
# Check service endpoints
kubectl get endpoints -n todo-app

# Verify pods are running
kubectl get pods -n todo-app
```

### Ingress Not Working
```bash
# Check ingress controller
kubectl get pods -n ingress-nginx

# Verify ingress configuration
kubectl describe ingress todo-app-ingress -n todo-app
```

---

## 📊 Architecture Flow

```
Developer writes code
   ↓
Docker builds images
   ↓
Helm deploys to Kubernetes
   ↓
Deployments create Pods
   ↓
Services connect Pods
   ↓
Ingress exposes app
   ↓
Users access app
   ↓
Kubernetes auto-heals + scales
```

---

## 🔑 One-Line Memory Hook

> **"Docker packs it, Helm installs it, Kubernetes runs it, Ingress exposes it."**
