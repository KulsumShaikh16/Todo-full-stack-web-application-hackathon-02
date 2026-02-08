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

## 🔍 Troubleshooting

### Check Pod Status
```bash
kubectl get pods -n todo-app
kubectl get pods -n kafka
kubectl get pods -n dapr-system
```

### Check Logs
```bash
kubectl logs -n todo-app -l app=todo-backend --tail=50
```
