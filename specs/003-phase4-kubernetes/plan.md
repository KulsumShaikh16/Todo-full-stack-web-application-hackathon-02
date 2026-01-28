# Implementation Plan: Phase 4 - Local Kubernetes Deployment

**Branch**: `phase4-kubernetes-deployment` | **Date**: 2026-01-27 | **Status**: Approved ✅
**Objective**: Deploy the Phase III Todo Chatbot as a cloud-native application on a local Kubernetes cluster using Minikube, Docker, and Helm.

## 1. LOCAL KUBERNETES SETUP
*   **Container Runtime**: Use Docker Desktop as the primary container runtime.
*   **Cluster Configuration**:
    *   Start Minikube with optimized resources: `minikube start --driver=docker --memory=4096 --cpus=2`.
    *   Enable mandatory addons: `minikube addons enable ingress`.
*   **Tools Verification**:
    *   Verify `kubectl` context points to `minikube`.
    *   Check cluster health via `kubectl cluster-info` and `kubectl get nodes`.

## 2. CONTAINERIZATION PLAN
*   **Backend (FastAPI)**:
    *   Location: `./backend/Dockerfile`
    *   Strategy: Multi-stage build using `python:3.12-slim`.
    *   Security: Run as non-root user (`appuser`).
    *   Optimization: Exclude unnecessary files via `.dockerignore`.
*   **Frontend (Next.js)**:
    *   Location: `./frontend/Dockerfile`
    *   Strategy: Multi-stage build using `node:20-alpine`.
    *   Mode: Use Next.js `standalone` output for minimal image size.
    *   Security: Run as non-root user (`nextjs`).
*   **AI Assistance**: Use Docker AI Agent (Gordon) for Dockerfile optimization and best practices verification.
*   **Build & Load**:
    *   Build images locally tagged as `todo-backend:latest` and `todo-frontend:latest`.
    *   Load images directly into Minikube: `minikube image load <image_name>`.

## 3. HELM CHART PLAN
*   **Structure**: Single umbrella chart `helm/todo-app` or separate charts for frontend/backend.
*   **Core Components**:
    *   `Chart.yaml`: Metadata for the Todo application.
    *   `values.yaml`: Default configurations for ports, replicas, and image tags.
    *   `templates/`: Kubernetes resource templates (Deployments, Services, Ingress, HPA).
*   **Separation of Concerns**: Separate values for `frontend` and `backend` within the global `values.yaml` to ensure modularity.
*   **Configurability**: Ensure replicas, resource limits, and environment variables (except secrets) are configurable via Helm.

## 4. KUBERNETES DEPLOYMENT PLAN
*   **Deployment Sequence**:
    1.  Deploy **Backend** service and deployment first.
    2.  Verify backend availability.
    3.  Deploy **Frontend** service and deployment.
*   **Internal Communication**: Frontend communicates with backend via Kubernetes DNS: `http://todo-backend-service:8000`.
*   **External Access**:
    *   Expose frontend via Ingress at `todo-app.local`.
    *   Path-based routing: `/api/*` routed to backend, `/*` routed to frontend.
    *   Alternative: Use `kubectl port-forward` for direct service access during development.

## 5. AI DEVOPS PLAN
*   **kubectl-ai**:
    *   Use for generating complex resource YAMLs.
    *   Troubleshoot deployment errors using natural language queries.
    *   Debug Pod and Service status.
*   **Kagent**:
    *   Perform cluster health checks.
    *   Analyze resource usage and suggest optimizations for CPU/Memory limits.
    *   Diagnose performance bottlenecks in the local cluster.

## 6. VERIFICATION PLAN
*   **Resource Status**: `kubectl get pods -n todo-app` - all pods must be `Running`.
*   **Service Reachability**: `kubectl get svc -n todo-app` - verify ClusterIP and Ingress endpoints.
*   **Integration Test**:
    *   Access `http://todo-app.local` (or port-forwarded 3000).
    *   Perform a chatbot query to confirm Frontend-to-Backend-to-Gemini communication.
*   **Self-Healing**: Delete a pod and verify Kubernetes restarts it automatically.

## CONSTRAINTS
*   **Strict Preservation**: No application code changes, no new features, no UI changes.
*   **Environment**: Local deployment only; no cloud infrastructure (AWS/GCP/Azure).
*   **Scope**: No production deployment, no CI/CD pipelines, no external secrets management (Vault).
*   **Security**: No secrets allowed in Docker images or Helm values (must use K8s Secrets).
