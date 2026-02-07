# Windows - Automated deployment
.\scripts\deploy-minikube.ps1

# Or manual deployment with Helm
helm install todo-app ./helm/todo-app -f ./helm/todo-app/values-dev.yaml --create-namespace# Phase 4: Local Kubernetes Deployment

This guide covers deploying the Todo Full-Stack Application using Docker, Kubernetes, and Helm.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Structure](#project-structure)
3. [Docker Setup](#docker-setup)
4. [Kubernetes Manifests](#kubernetes-manifests)
5. [Helm Charts](#helm-charts)
6. [AI-Assisted DevOps Tools](#-ai-assisted-devops-tools-optional)
7. [Secrets Management](#-secrets-management)
8. [Requirements & Compliance](#-requirements--compliance)
9. [Environment Configuration](#-environment-configuration)
10. [Architecture Details](#-architecture-details)
11. [Monitoring & Debugging](#-monitoring--debugging)
12. [Deployment Guide](#-deployment-guide)
13. [Testing & Validation](#-testing--validation)
14. [Architecture Flow](#-architecture-flow)
15. [Best Practices](#-best-practices)
16. [Additional Resources](#-additional-resources)
17. [Troubleshooting](#-troubleshooting)
18. [Memory Hook](#-one-line-memory-hook)

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

### Chart Structure

The Helm chart provides templated Kubernetes manifests with environment-specific customization:

```
helm/todo-app/
├── Chart.yaml                 # Chart metadata
├── values.yaml               # Base values (defaults)
├── values-dev.yaml          # Development overrides
├── values-staging.yaml       # Staging overrides
├── values-prod.yaml         # Production overrides
└── templates/               # Kubernetes manifest templates
    ├── _helpers.tpl        # Helper functions
    ├── namespace.yaml
    ├── configmap.yaml
    ├── secrets.yaml
    ├── backend-deployment.yaml
    ├── backend-service.yaml
    ├── frontend-deployment.yaml
    ├── frontend-service.yaml
    ├── ingress.yaml
    └── backend-hpa.yaml
```

### Install with Helm (Recommended)

```bash
# Development environment
helm install todo-app ./helm/todo-app -f ./helm/todo-app/values-dev.yaml --create-namespace

# Staging environment
helm install todo-app ./helm/todo-app -f ./helm/todo-app/values-staging.yaml --create-namespace

# Production environment
helm install todo-app ./helm/todo-app -f ./helm/todo-app/values-prod.yaml --create-namespace
```

### Dry-Run (Test without Installing)
```bash
helm install todo-app ./helm/todo-app -f ./helm/todo-app/values-dev.yaml --create-namespace --dry-run --debug
```

### Update Deployment
```bash
helm upgrade todo-app ./helm/todo-app -f ./helm/todo-app/values-dev.yaml -n todo-app
```

### Rollback
```bash
helm rollback todo-app 1 -n todo-app
```

### View Release Status
```bash
helm status todo-app -n todo-app
helm history todo-app -n todo-app
```

### Uninstall
```bash
helm uninstall todo-app -n todo-app
```

---

## 🤖 AI-Assisted DevOps Tools (Optional)

### Docker AI (Gordon)

Docker AI can assist with Dockerfile optimization and best practices:

```bash
# Get Docker AI recommendations for your Dockerfile
docker ai suggest Dockerfile

# Generate optimized Dockerfile
docker ai generate Dockerfile
```

**Use Cases**:
- Optimize multi-stage builds for smaller image sizes
- Ensure non-root user execution
- Configure health checks properly
- Best practices recommendations

### kubectl-ai

kubectl-ai provides AI-powered explanations and insights for Kubernetes operations:

```bash
# Explain pod status
kubectl-ai "What is wrong with pod todo-backend-xxxxx?"

# Get deployment insights
kubectl-ai "Why is my frontend deployment using so much memory?"

# Troubleshoot issues
kubectl-ai "Debug connection refused error in backend"
```

**Use Cases**:
- Troubleshoot pod crashes and CrashLoopBackOff states
- Understand deployment issues
- Get optimization suggestions
- Explain Kubernetes errors

### Kagent

Kagent analyzes cluster health and provides optimization recommendations:

```bash
# Analyze cluster performance
kagent analyze-cluster

# Get optimization suggestions
kagent recommend-optimization

# Diagnose specific issues
kagent diagnose-issue "CrashLoopBackOff"
```

**Use Cases**:
- Cluster health analysis
- Resource optimization recommendations
- Performance diagnostics
- Capacity planning insights

---

## 🔐 Secrets Management

### Creating Secrets from Environment Variables

```bash
# Windows PowerShell
.\scripts\create-secrets.ps1

# This creates Kubernetes secrets from your .env file:
# - DATABASE_URL
# - GEMINI_API_KEY
# - JWT_SECRET
# - NEXT_PUBLIC_API_URL
```

### Manual Secret Creation

```bash
# Create secret from literal values
kubectl create secret generic todo-secrets \
  --from-literal=DATABASE_URL="postgresql://..." \
  --from-literal=GEMINI_API_KEY="sk-..." \
  --from-literal=JWT_SECRET="your-secret-key" \
  -n todo-app

# Create from environment file
kubectl create secret generic todo-secrets \
  --from-env-file=.env \
  -n todo-app
```

### Secret Storage Locations

- `.env` - Local development (never commit)
- `k8s/base/secrets.yaml` - Template (never commit actual values)
- `Kubernetes Secret` - Actual runtime credentials (encrypted in etcd)

### Security Best Practices

✅ **DO**:
- Store secrets in Kubernetes Secrets
- Use RBAC to limit secret access
- Rotate secrets regularly
- Use sealed-secrets for GitOps workflows

❌ **DON'T**:
- Store credentials in ConfigMaps
- Hardcode secrets in environment files
- Include .env files in Docker images
- Log sensitive values

---

## 📋 Requirements & Compliance

### Docker Requirements Checklist

- [ ] **DR-001**: Backend Dockerfile uses multi-stage build
- [ ] **DR-002**: Frontend Dockerfile uses standalone Next.js output
- [ ] **DR-003**: Both images run as non-root user
- [ ] **DR-004**: Images include health check commands
- [ ] **DR-005**: .dockerignore excludes unnecessary files
- [ ] **DR-006**: Docker AI assisted with Dockerfile (optional)
- [ ] **DR-007**: Dockerfiles follow Docker AI recommendations (if used)

### Kubernetes Requirements Checklist

- [ ] **KR-001**: Application runs in dedicated namespace (todo-app)
- [ ] **KR-002**: Deployments use rolling update strategy
- [ ] **KR-003**: Services use ClusterIP type
- [ ] **KR-004**: Ingress routes /api/* to backend and /* to frontend
- [ ] **KR-005**: ConfigMaps store non-sensitive configuration
- [ ] **KR-006**: Secrets store sensitive credentials
- [ ] **KR-007**: Health probes configured for auto-healing
- [ ] **KR-008**: Kubernetes cluster is Minikube (local only)
- [ ] **KR-009**: No cloud providers (EKS, GKE, AKS) used
- [ ] **KR-010**: kubectl-ai used for operations (optional)
- [ ] **KR-011**: Kagent used for cluster analysis (optional)

### Helm Requirements Checklist

- [ ] **HR-001**: Chart supports multiple environments via values files
- [ ] **HR-002**: Templates use proper helper functions for labeling
- [ ] **HR-003**: Values are overridable for replicas, resources, and secrets
- [ ] **HR-004**: Chart supports optional HPA for autoscaling
- [ ] **HR-005**: Helm charts used for application deployment

### Application Preservation Checklist

- [ ] **APR-001**: No new application features added
- [ ] **APR-002**: No UI changes made
- [ ] **APR-003**: No backend/frontend logic changes
- [ ] **APR-004**: No authentication changes
- [ ] **APR-005**: No database schema changes

### Success Criteria

- [ ] **SC-001**: Application deploys in under 5 minutes
- [ ] **SC-002**: Backend image < 500MB, Frontend image < 500MB
- [ ] **SC-003**: Application recovers from pod failure within 60 seconds
- [ ] **SC-004**: Zero secrets in Docker image layers
- [ ] **SC-005**: Helm deployment succeeds on first attempt
- [ ] **SC-006**: Application accessible via browser
- [ ] **SC-007**: All Phase III functionality remains operational
- [ ] **SC-008**: kubectl-ai and Kagent provide assistance (if used)
- [ ] **SC-009**: Docker AI assists with Dockerfile (if used)
- [ ] **SC-010**: No new features or UI changes introduced
- [ ] **SC-011**: Deployment uses local Minikube only
- [ ] **SC-012**: Helm charts manage all Kubernetes resources

---

## � Environment Configuration

### Configuration Layers

```
Values File (values-dev.yaml)
        ↓
Helm Templates (templates/*.yaml)
        ↓
ConfigMap (public configuration)
Secrets (sensitive credentials)
        ↓
Pod Environment Variables
```

### ConfigMap Variables

Non-sensitive configuration stored in ConfigMaps:

```yaml
# logs via: kubectl get configmap -n todo-app
ENVIRONMENT: development
LOG_LEVEL: info
NEXT_PUBLIC_API_URL: http://localhost:8000
API_TIMEOUT: 30
MAX_CONNECTIONS: 100
```

### Secret Variables

Sensitive credentials stored as Kubernetes Secrets:

```yaml
# Store via: kubectl create secret generic todo-secrets
DATABASE_URL: postgresql://user:password@neon.tech/dbname
GEMINI_API_KEY: sk-...
JWT_SECRET: your-secret-key
```

### Environment-Specific Values

```yaml
# Development (values-dev.yaml)
replicas: 1
resources:
  requests:
    memory: "128Mi"
    cpu: "100m"
  limits:
    memory: "512Mi"
    cpu: "500m"

# Staging (values-staging.yaml)
replicas: 2
resources:
  requests:
    memory: "256Mi"
    cpu: "250m"
  limits:
    memory: "1Gi"
    cpu: "500m"

# Production (values-prod.yaml)
replicas: 3
resources:
  requests:
    memory: "512Mi"
    cpu: "500m"
  limits:
    memory: "2Gi"
    cpu: "1000m"
autoscaling:
  enabled: true
  minReplicas: 3
  maxReplicas: 10
```

---

## 🏗️ Architecture Details

### Network Flow

```
┌─────────────────────────────────────────────┐
│          Browser / External Client          │
└──────────────────┬──────────────────────────┘
                   │ HTTP/HTTPS
                   ▼
┌─────────────────────────────────────────────┐
│       NGINX Ingress Controller              │
│  - Path /api/* → routes to backend-service │
│  - Path /* → routes to frontend-service    │
│  - Hostname: todo-app.local                 │
└──────────────┬──────────────────┬───────────┘
               │                  │
         GET /api/tasks     GET /
               │                  │
               ▼                  ▼
    ┌──────────────────┐ ┌──────────────────┐
    │ backend-service  │ │frontend-service  │
    │ (ClusterIP)      │ │ (ClusterIP)      │
    │ Port 8000        │ │ Port 3000        │
    └────────┬─────────┘ └────────┬─────────┘
             │                    │
      ┌──────┴────┬────────┐     │
      ▼           ▼        ▼     ▼
   ┌─────┐    ┌─────┐  ┌─────┐ ┌──────┐
   │Pod-1│    │Pod-2│  │Pod-3│ │Pod-4 │
   │Back-│    │Back-│  │Front│ │Front │
   │end  │    │end  │  │end-1│ │end-2 │
   └──┬──┘    └──┬──┘  └──┬──┘ └──┬───┘
      │          │        │       │
      └──────────┴────────┴───────┘
             │
             ▼
    ┌──────────────────────────┐
    │   Neon PostgreSQL DB     │
    │  (External - No Changes) │
    └──────────────────────────┘
```

### Pod Lifecycle

```
Helm Install
    ↓
Create Namespace
    ↓
Create ConfigMap
    ↓
Create Secrets
    ↓
Create Backend Deployment → Pods start
    ↓
Create Backend Service
    ↓
Create Frontend Deployment → Pods start
    ↓
Create Frontend Service
    ↓
Create Ingress
    ↓
Application Ready
```

### Health Check Flow

```
Kubernetes Scheduler
    ↓
Pod starts container
    ↓
Startup Probe (30s)
    │ → Waits for app to be ready
    ▼
Readiness Probe (10s intervals)
    │ → Checks if pod can accept traffic
    ├─ Pass → Pod added to Service endpoints
    └─ Fail → Pod removed from load balancer
    ▼
Liveness Probe (10s intervals)
    │ → Checks if pod is still healthy
    ├─ Pass → Pod stays running
    └─ Fail → Pod restarted automatically
```

---

## 📊 Monitoring & Debugging

### View Resource Usage

```bash
# Pod resource usage
kubectl top pods -n todo-app

# Node resource usage
kubectl top nodes

# Detailed node info
kubectl describe node $(minikube node list | head -1)
```

### View Events

```bash
# Get cluster events
kubectl get events -n todo-app --sort-by='.lastTimestamp'

# Watch events
kubectl get events -n todo-app --watch
```

### Verify Health Probes

```bash
# Check probe configuration
kubectl get deployment todo-backend -n todo-app -o yaml | grep -A 10 "livenessProbe"
kubectl get deployment todo-backend -n todo-app -o yaml | grep -A 10 "readinessProbe"
kubectl get deployment todo-backend -n todo-app -o yaml | grep -A 10 "startupProbe"
```

### Debug Ingress

```bash
# Check ingress configuration
kubectl describe ingress todo-app-ingress -n todo-app

# Verify ingress controller
kubectl get pods -n ingress-nginx

# Test ingress routing
# 1. Get Minikube IP
minikube ip

# 2. Test from inside cluster
kubectl run -it --rm debug --image=curlimages/curl --restart=Never -- sh
# Inside the pod:
curl http://todo-frontend-service:3000
curl http://todo-backend-service:8000/health
```

### Image Inspection

```bash
# List Minikube images
minikube image ls

# Inspect image layers
docker inspect todo-backend:latest
docker history todo-backend:latest

# Check for secrets in layers (should find none)
docker inspect todo-backend:latest | grep -i "password\|secret\|key"
```

---

## �🚀 Deployment Guide

### Automated Deployment (Recommended)

#### Prerequisites Check

Before running deployment script, verify all tools are installed:

```powershell
# Windows PowerShell - Verify all prerequisites
Write-Host "Checking prerequisites..."

# Docker
if (docker --version) { Write-Host "✓ Docker installed" } else { Write-Host "✗ Docker missing" }

# Minikube
if (minikube version) { Write-Host "✓ Minikube installed" } else { Write-Host "✗ Minikube missing" }

# kubectl
if (kubectl version --client) { Write-Host "✓ kubectl installed" } else { Write-Host "✗ kubectl missing" }

# Helm
if (helm version) { Write-Host "✓ Helm installed" } else { Write-Host "✗ Helm missing" }
```

#### Windows PowerShell
```powershell
# Run from project root
.\scripts\deploy-minikube.ps1

# The script will:
# 1. Check Docker Desktop is running
# 2. Start Minikube
# 3. Build Docker images
# 4. Load images into Minikube
# 5. Create secrets
# 6. Deploy with Helm
```

#### Linux/macOS
```bash
# Run from project root
chmod +x ./scripts/deploy-minikube.sh
./scripts/deploy-minikube.sh

# The script will:
# 1. Check Docker is running
# 2. Start Minikube
# 3. Build Docker images
# 4. Load images into Minikube
# 5. Create secrets
# 6. Deploy with Helm
```

#### Deployment Script Features

The automated deployment scripts handle:

✅ **Pre-Checks**
- Docker Desktop running
- Required tools installed
- Sufficient system resources (4GB RAM minimum)

✅ **Infrastructure Setup**
- Minikube cluster creation
- Ingress controller enablement
- Namespace creation

✅ **Container Builds**
- Multi-stage Docker builds
- Image optimization
- Health check verification

✅ **Kubernetes Deployment**
- Secret creation from .env
- Helm chart installation
- Service endpoint verification

✅ **Validation**
- Pod readiness checks
- Service connectivity tests
- Application accessibility verification

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

### Common Issues & Solutions

#### Pod CrashLoopBackOff

**Symptom**: Pod keeps restarting and crashes immediately

```bash
# 1. Check logs
kubectl logs <pod-name> -n todo-app --tail=50

# 2. Check previous logs (from crash)
kubectl logs <pod-name> -n todo-app --previous

# 3. Describe pod for details
kubectl describe pod <pod-name> -n todo-app

# 4. Check environment variables
kubectl exec -it <pod-name> -n todo-app -- env | grep DATABASE_URL

# 5. Check health probe configuration
kubectl get pod <pod-name> -n todo-app -o yaml | grep -A 15 "livenessProbe"
```

**Common Causes**:
- Missing environment variables or secrets
- Database connection failure
- Port already in use
- Insufficient memory/CPU
- Invalid health check endpoint

**Solution**:
```bash
# Verify secrets exist
kubectl get secrets -n todo-app

# Verify configmap exists
kubectl get configmap -n todo-app

# Check if secret values are correct
kubectl get secret todo-secrets -n todo-app -o yaml

# Restart pod
kubectl rollout restart deployment/todo-backend -n todo-app
```

#### ImagePullBackOff

**Symptom**: Image cannot be pulled from registry

```bash
# Check image pull policy
kubectl get deployment todo-backend -n todo-app -o yaml | grep imagePullPolicy

# Verify image exists in Minikube
minikube image ls | grep todo

# Check image pull events
kubectl describe pod <pod-name> -n todo-app | grep -A 5 "Events:"
```

**Solution**:
```bash
# For local Minikube, use IfNotPresent policy
# This is configured in Helm values: imagePullPolicy: IfNotPresent

# Rebuild image and load into Minikube
docker build -t todo-backend:latest backend/
minikube image load todo-backend:latest

# Redeploy
helm upgrade todo-app ./helm/todo-app -f ./helm/todo-app/values-dev.yaml -n todo-app
```

#### Connection Refused

**Symptom**: Cannot connect to backend or frontend from browser/curl

```bash
# 1. Check services exist
kubectl get svc -n todo-app

# 2. Check service endpoints (pods)
kubectl get endpoints -n todo-app

# 3. Test connectivity from another pod
kubectl run -it --rm debug --image=curlimages/curl --restart=Never -- \
  curl -v http://todo-backend-service:8000/health

# 4. Check ingress configuration
kubectl describe ingress todo-app-ingress -n todo-app

# 5. Check ingress controller logs
kubectl logs -n ingress-nginx deployment/ingress-nginx-controller
```

**Common Causes**:
- Pods not running
- Service not targeting pods
- Incorrect port configuration
- Ingress not pointing to correct service
- Firewall blocking connections

**Solution**:
```bash
# Ensure pods are running
kubectl get pods -n todo-app -o wide

# Check service selector matches pod labels
kubectl get pod <pod-name> -n todo-app --show-labels
kubectl get svc todo-backend-service -n todo-app -o yaml | grep -A 5 "selector:"

# Port-forward as temporary fix
kubectl port-forward svc/todo-backend-service 8000:8000 -n todo-app
```

#### Ingress Not Working

**Symptom**: Cannot access application via hostname (todo-app.local)

```bash
# 1. Check ingress controller is running
kubectl get pods -n ingress-nginx

# 2. Check ingress resource
kubectl get ingress -n todo-app
kubectl describe ingress todo-app-ingress -n todo-app

# 3. Check DNS resolution
# From Windows CMD:
nslookup todo-app.local
ipconfig /all | findstr "DNS"

# From Linux/macOS:
dig todo-app.local
cat /etc/hosts | grep todo-app

# 4. Verify Minikube IP
minikube ip
```

**Common Causes**:
- Ingress addon not enabled in Minikube
- /etc/hosts entry missing
- Ingress controller pod not running
- Wrong routing rules

**Solution**:
```bash
# Enable ingress addon
minikube addons enable ingress

# Check addon status
minikube addons list | grep ingress

# Add to hosts file
# Windows: C:\Windows\System32\drivers\etc\hosts
# Linux/macOS: /etc/hosts
<MINIKUBE_IP> todo-app.local

# Or use port-forward instead
kubectl port-forward svc/todo-frontend-service 3000:3000 -n todo-app
kubectl port-forward svc/todo-backend-service 8000:8000 -n todo-app
```

#### Persistent Storage Issues

**Symptom**: Data lost after pod restart

```bash
# Check PersistentVolume status
kubectl get pv -n todo-app

# Check PersistentVolumeClaim
kubectl get pvc -n todo-app
```

**Note**: Current deployment uses external Neon PostgreSQL. No local persistent storage is configured.

#### Memory/CPU Issues

**Symptom**: Pods being evicted or performance degradation

```bash
# Check resource requests vs actual usage
kubectl top pods -n todo-app
kubectl get pods -n todo-app -o yaml | grep -E "requests:|limits:"

# Check node capacity
kubectl describe node minikube
minikube top

# Check Minikube memory allocation
minikube ssh "free -h"
```

**Solution**:
```bash
# Increase Minikube resources
minikube stop
minikube start --memory=8192 --cpus=4

# Or adjust values in Helm
helm upgrade todo-app ./helm/todo-app \
  --set backend.resources.requests.memory=256Mi \
  --set frontend.resources.requests.memory=256Mi \
  -n todo-app
```

### Debug Commands Reference

```bash
# Get comprehensive resource information
kubectl get all -n todo-app

# Get detailed resource information
kubectl get all -n todo-app -o wide

# Watch resources in real-time
kubectl get pods -n todo-app --watch

# Get YAML definition of resource
kubectl get deployment todo-backend -n todo-app -o yaml

# Execute command in pod
kubectl exec -it <pod-name> -n todo-app -- /bin/sh

# Copy file from pod
kubectl cp todo-app/<pod-name>:/app/logs.txt ./logs.txt

# View resource events
kubectl get events -n todo-app --sort-by='.lastTimestamp'

# Check resource limits
kubectl describe resourcequota -n todo-app

# Check RBAC (if issues with permissions)
kubectl auth can-i get pods --as=<service-account> -n todo-app
```

### Using kubectl-ai for Debugging

If kubectl-ai is installed, use it for intelligent troubleshooting:

```bash
# Explain pod status
kubectl-ai "Pod todo-backend-xxxxx is in CrashLoopBackOff, what's wrong?"

# Get recommendations
kubectl-ai "How can I improve the performance of my cluster?"

# Troubleshoot specific issues
kubectl-ai "Why can't my frontend connect to the backend?"

# Understand logs
kubectl logs <pod-name> -n todo-app | kubectl-ai "Explain this error"
```

### Using Kagent for Cluster Analysis

If Kagent is installed:

```bash
# Full cluster analysis
kagent analyze-cluster

# Resource optimization
kagent recommend-optimization

# Diagnostic report
kagent diagnose

# Performance metrics
kagent metrics --namespace=todo-app
```

---

## ✅ Testing & Validation

### Pre-Deployment Validation

#### 1. Docker Image Validation

```bash
# Build images
cd backend && docker build -t todo-backend:latest .
cd ../frontend && docker build -t todo-frontend:latest .

# Verify image sizes (should be < 500MB each)
docker images | grep todo

# Check for security vulnerabilities
docker scout cves todo-backend:latest
docker scout cves todo-frontend:latest

# Verify non-root user
docker inspect todo-backend:latest | grep "User"
docker inspect todo-frontend:latest | grep "User"

# Check for secrets in layers (should find NONE)
docker history todo-backend:latest
docker inspect todo-backend:latest | grep -i "secret\|password\|key"

# Test image locally
docker run -p 8000:8000 --env-file .env todo-backend:latest
docker run -p 3000:3000 todo-frontend:latest
```

#### 2. Kubernetes Manifest Validation

```bash
# Validate YAML syntax
kubectl apply -f k8s/base/namespace.yaml --dry-run=client -o yaml
kubectl apply -f k8s/base/configmap.yaml --dry-run=client -o yaml
kubectl apply -f k8s/base/backend-deployment.yaml --dry-run=client -o yaml

# Validate all manifests at once
for file in k8s/base/*.yaml; do
  kubectl apply -f "$file" --dry-run=client
done

# Check resource definitions
kubectl explain deployment.spec.replicas
kubectl explain pod.spec.containers[0].livenessProbe
```

#### 3. Helm Chart Validation

```bash
# Validate chart syntax
helm lint ./helm/todo-app

# Template rendering (dry-run)
helm install todo-app ./helm/todo-app \
  -f ./helm/todo-app/values-dev.yaml \
  --create-namespace \
  --dry-run --debug

# Check template output
helm template todo-app ./helm/todo-app \
  -f ./helm/todo-app/values-dev.yaml | less
```

### Post-Deployment Testing

#### 1. Verify Cluster Status

```bash
# Check all resources
kubectl get all -n todo-app

# Expected output:
# - 1 namespace (todo-app)
# - 2 deployments (todo-backend, todo-frontend)
# - 2+ pods (from each deployment)
# - 2 services (backend and frontend)
# - 1 ingress (todo-app-ingress)

# Check pod status (should be Running)
kubectl get pods -n todo-app

# Check service endpoints (should have IPs)
kubectl get svc -n todo-app
kubectl get endpoints -n todo-app
```

#### 2. Verify Application Health

```bash
# Check pod readiness
kubectl wait --for=condition=ready pod \
  -l app=todo-backend \
  -n todo-app \
  --timeout=300s

# Check pod startup
kubectl wait --for=condition=ready pod \
  -l app=todo-frontend \
  -n todo-app \
  --timeout=300s

# Check deployment readiness
kubectl rollout status deployment/todo-backend -n todo-app
kubectl rollout status deployment/todo-frontend -n todo-app
```

#### 3. Test API Connectivity

```bash
# Port-forward backend
kubectl port-forward svc/todo-backend-service 8000:8000 -n todo-app

# In another terminal, test API
curl http://localhost:8000/health
curl http://localhost:8000/api/tasks

# Test with authentication
curl -X POST http://localhost:8000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

#### 4. Test Frontend Access

```bash
# Port-forward frontend
kubectl port-forward svc/todo-frontend-service 3000:3000 -n todo-app

# In browser: http://localhost:3000

# Or access via ingress
# 1. Add to hosts file: <MINIKUBE_IP> todo-app.local
# 2. Visit: http://todo-app.local
```

#### 5. Test Feature Functionality

```bash
# Test all Phase III features:

# 1. User Authentication
# - Sign up new user
# - Sign in with credentials
# - Sign out

# 2. Todo Management
# - Create new todo
# - Read/view todos
# - Update todo status
# - Delete todo

# 3. AI Chatbot
# - Send message to chatbot
# - Verify response from Gemini API
# - Test task creation via chatbot
# - Test task management via chatbot

# 4. Persistence
# - Create todo
# - Refresh page
# - Verify todo still exists
# - Check database has entry
```

#### 6. Test Kubernetes Features

```bash
# Test pod auto-restart
kubectl delete pod <backend-pod-name> -n todo-app
kubectl get pods -n todo-app --watch
# Verify new pod is created automatically

# Test service discovery
kubectl exec -it <frontend-pod> -n todo-app -- \
  nslookup todo-backend-service
# Should resolve to service IP

# Test rolling update
kubectl set image deployment/todo-backend \
  todo-backend=todo-backend:v2 \
  -n todo-app --record

# Test rollback
helm rollback todo-app 1 -n todo-app

# Test autoscaling (if HPA enabled)
kubectl get hpa -n todo-app
```

### Test Results Checklist

After deployment, verify:

- [ ] Cluster Status
  - [ ] All pods are Running
  - [ ] All services are available
  - [ ] Ingress is configured correctly

- [ ] Application Accessibility
  - [ ] Frontend accessible via browser
  - [ ] Backend API responding to requests
  - [ ] Health check endpoints responding

- [ ] Feature Verification
  - [ ] User authentication working
  - [ ] Todo CRUD operations working
  - [ ] AI chatbot responding
  - [ ] Database persistence working

- [ ] Kubernetes Features
  - [ ] Pod recovery from crashes
  - [ ] Service discovery working
  - [ ] Rolling updates succeeding
  - [ ] Helm operations (install, upgrade, rollback) working

- [ ] Security
  - [ ] Secrets not exposed in logs
  - [ ] Non-root users running containers
  - [ ] RBAC restrictions applied (if configured)
  - [ ] No secrets in image layers

- [ ] Performance
  - [ ] Application responsive
  - [ ] Pods healthy (low restart count)
  - [ ] Resource usage reasonable
  - [ ] No memory/CPU throttling

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

## 🏆 Best Practices

### Docker Best Practices

✅ **DO**:
- Use multi-stage builds to minimize image size
- Run containers as non-root users
- Include health checks in Dockerfile
- Keep images small (< 500MB)
- Use specific base image versions (not `latest`)
- Exclude unnecessary files with `.dockerignore`
- Cache layers efficiently (put frequently changing stuff last)

❌ **DON'T**:
- Hardcode secrets in Dockerfile
- Use `RUN apt-get update && apt-get install` on separate lines
- Include unnecessary packages
- Run services as root user
- Use `latest` tags in production
- Skip `.dockerignore` configuration

### Kubernetes Best Practices

✅ **DO**:
- Use namespaces to organize resources
- Implement resource requests and limits
- Configure health probes (startup, readiness, liveness)
- Use StatefulSets for stateful applications
- Implement RBAC for access control
- Enable network policies for security
- Monitor resource usage regularly

❌ **DON'T**:
- Run containers as root
- Store secrets in ConfigMaps
- Use latest image tags in production
- Skip resource limits
- Rely on single-pod deployments
- Store credentials in environment variables directly

### Helm Best Practices

✅ **DO**:
- Use semantic versioning for charts
- Provide multiple values files for environments
- Document all values in `values.yaml`
- Use `_helpers.tpl` for template functions
- Validate charts with `helm lint`
- Test charts thoroughly before release
- Version your releases

❌ **DON'T**:
- Hardcode values in templates
- Skip chart documentation
- Deploy without testing
- Ignore deprecation warnings
- Use uncommitted code in production

### Security Best Practices

✅ **DO**:
- Store secrets in Kubernetes Secrets
- Use RBAC to limit access
- Scan images for vulnerabilities
- Keep base images updated
- Use network policies to control traffic
- Rotate credentials regularly
- Audit container registries

❌ **DON'T**:
- Hardcode secrets in code or containers
- Use privileged containers unnecessarily
- Store secrets in version control
- Skip vulnerability scanning
- Trust untrusted registries

---

## 📚 Additional Resources

### Official Documentation

- **Docker**: https://docs.docker.com/
- **Kubernetes**: https://kubernetes.io/docs/
- **Minikube**: https://minikube.sigs.k8s.io/docs/
- **Helm**: https://helm.sh/docs/
- **NGINX Ingress**: https://kubernetes.github.io/ingress-nginx/

### Learning Resources

- **Kubernetes By Example**: https://kubernetesbyexample.com/
- **Docker Best Practices**: https://docs.docker.com/develop/dev-best-practices/
- **Helm Best Practices**: https://helm.sh/docs/chart_best_practices/

### Tools & Utilities

- **kubectl plugins**: https://kubernetes.io/docs/tasks/extend-kubectl/kubectl-plugins/
- **Docker Scout**: https://docs.docker.com/scout/
- **Kubernetes Dashboard**: https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/
- **k9s** (Terminal UI): https://k9scli.io/

### AI DevOps Tools

- **Docker AI**: https://www.docker.com/blog/docker-ai/
- **kubectl-ai**: https://github.com/sozercan/kubectl-ai
- **Kagent**: https://github.com/kubeagi/kagent

---

## 🔑 One-Line Memory Hook

> **"Docker packs it, Helm installs it, Kubernetes runs it, Ingress exposes it."**
