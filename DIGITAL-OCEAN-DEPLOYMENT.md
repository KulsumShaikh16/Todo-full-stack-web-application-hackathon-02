# Digital Ocean Deployment Guide

## ✅ Completed Steps

### 1. Prerequisites
- ✅ `doctl` CLI installed (v1.150.0)
- ✅ Authenticated with Digital Ocean
- ✅ GitHub CLI (`gh`) installed and authenticated
- ✅ Container Registry exists: `todo-registry-kulsumshaikh16`
- ✅ Kubernetes Cluster exists: `todo-cluster` (NYC1, Kubernetes 1.34.1)

### 2. GitHub Secrets Configured
- ✅ `DIGITALOCEAN_ACCESS_TOKEN` - Added
- ✅ `NEXT_PUBLIC_API_URL` - Added (placeholder, will update after deployment)
- ✅ `NEON_API_KEY` - Already existed

### 3. Configuration Files
- ✅ GitHub Actions workflow: `.github/workflows/deploy-digitalocean.yml`
- ✅ Helm values: `helm/todo-app/values-digitalocean.yaml` (Dapr components enabled)
- ✅ Ingress configured (TLS disabled for initial setup)
- ✅ Dapr Cloud Components added to Helm (`helm/todo-app/templates/dapr-cloud-components.yaml`)

---

## ⚠️ CRITICAL: Token Permissions & Infrastructure Setup

The current Digital Ocean token has **read-only access** to Kubernetes (403 error).
You MUST fix this to install the required infrastructure (Dapr & Kafka).

### Step 1: Fix Token Permissions
1. Go to https://cloud.digitalocean.com/account/api/tokens
2. Generate a new token with **Read + Write** scopes
3. Update GitHub secret:
   ```bash
   gh secret set DIGITALOCEAN_ACCESS_TOKEN --body "NEW_TOKEN_HERE" --repo KulsumShaikh16/Todo-full-stack-web-application-hackathon-02
   ```
4. Re-authenticate locally:
   ```bash
   doctl auth init -t NEW_TOKEN_HERE
   ```
5. Configure kubectl access:
   ```bash
   doctl kubernetes cluster kubeconfig save todo-cluster
   ```

### Step 2: Install Infrastructure (Completed)
- ✅ Dapr initialized with `dapr init -k`
- ✅ Strimzi Kafka installed and configured with KRaft mode (version 4.0.0)
- ✅ NGINX Ingress Controller installed
- ✅ Load Balancer IP obtained: `157.230.65.206`
- ✅ Host configured: `157.230.65.206.nip.io`
- ✅ GitHub secrets updated (`NEXT_PUBLIC_API_URL`)

---

---

## 🚀 Deploying the Application

Once infrastructure is ready, you can deploy the app.

### Option 1: Deploy via GitHub Actions (Recommended)

1. **Commit and push the current changes:**
   ```bash
   git add .
   git commit -m "Configure Digital Ocean deployment with Dapr and Kafka"
   git push origin main
   ```

2. **Monitor the deployment:**
   - Go to: https://github.com/KulsumShaikh16/Todo-full-stack-web-application-hackathon-02/actions
   - Watch the "Deploy to Digital Ocean" workflow

3. **After successful deployment, get the Load Balancer IP:**
   ```bash
   kubectl get svc -n ingress-nginx
   # Or via doctl:
   doctl compute load-balancer list
   ```

4. **Update the ingress host:**
   - Get the External IP (e.g., `123.45.67.89`)
   - Update `helm/todo-app/values-digitalocean.yaml`:
     ```yaml
     host: "123.45.67.89.nip.io"
     ```
   - Update GitHub secret:
     ```bash
     gh secret set NEXT_PUBLIC_API_URL --body "http://123.45.67.89.nip.io/api"
     ```
   - Redeploy (Push again or re-run workflow)

### Option 2: Manual Deployment

See `scripts/deploy-manual.ps1` (create if needed) or use steps above.

---

## ✅ Deployment Verification (Latest Status)

### Current Deployment Status - February 9, 2026
**✅ APPLICATION IS SUCCESSFULLY DEPLOYED AND RUNNING!**

#### Services Status:
- **Backend**: 2 pods running (2/2 containers each - app + Dapr sidecar)
- **Frontend**: 2 pods running (2/2 containers each - app + Dapr sidecar)
- **Load Balancer IP**: `157.230.65.206`
- **Application URL**: http://157.230.65.206.nip.io

#### Access Points:
- **Frontend**: ✅ http://157.230.65.206.nip.io (WORKING)
- **API Endpoints**: ✅ http://157.230.65.206.nip.io/api/health (WORKING - Rewrites Configured)

#### Infrastructure:
- ✅ Dapr system running
- ✅ Kafka cluster running (Strimzi)  
#### Known Issues:
- **None.** The previous API routing issues have been resolved.
   - **Ingress Logic**: The Ingress now correctly passes `/api/*` traffic to the backend, which handles the routing (e.g., `/api/tasks`).
   - **Frontend Config**: Ensure `NEXT_PUBLIC_API_URL` is set to the **base URL** (e.g., `http://157.230.65.206.nip.io`), NOT `.../api`, because the frontend code appends `/api` automatically.

---

### Important: Frontend Environment Variable Update

If you are seeing 404 errors on the frontend (e.g., "Not Found" on Signup), it is likely because `NEXT_PUBLIC_API_URL` includes a trailing `/api`.

**Correct Configuration:**
```bash
# CORRECT (Base URL only):
gh secret set NEXT_PUBLIC_API_URL --body "http://157.230.65.206.nip.io"

# INCORRECT (Do NOT do this):
# gh secret set NEXT_PUBLIC_API_URL --body "http://157.230.65.206.nip.io/api"
```
After updating the secret, you must **re-run the deployment workflow** for the changes to take effect in the frontend build.

---

## 🔍 Troubleshooting

### Check Pod Status
```bash
kubectl get pods -n todo-app
kubectl get pods -n kafka
kubectl get pods -n dapr-system
```

### Check Logs (Updated with correct label)
```bash
# Backend logs
kubectl logs -n todo-app -l app.kubernetes.io/name=todo-backend -c backend --tail=50

# Frontend logs
kubectl logs -n todo-app -l app.kubernetes.io/name=todo-frontend -c frontend --tail=50
```

### Check Services and Ingress
```bash
kubectl get svc -n todo-app
kubectl get ingress -n todo-app
kubectl describe ingress todo-app-ingress -n todo-app
```
