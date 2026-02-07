# GitHub Secrets Setup for Digital Ocean Deployment

## Required Secrets

You need to add the following secrets to your GitHub repository:

### 1. DIGITALOCEAN_ACCESS_TOKEN
**Value:** `YOUR_TOKEN_HERE`

**Important:** This token needs the following scopes:
- ✅ `read` (already has)
- ✅ `write` (for pushing to container registry)
- ⚠️ **Kubernetes access** (currently missing - 403 error)

### 2. NEXT_PUBLIC_API_URL
**Value:** TBD after deployment (will be the ingress URL)
**Temporary Value:** `https://todo.your-domain.com/api`

---

## How to Add Secrets to GitHub

### Option 1: Using GitHub Web UI
1. Go to your repository: `https://github.com/KulsumShaikh16/Todo-full-stack-web-application-hackathon-02`
2. Click on **Settings**
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Add each secret:
   - Name: `DIGITALOCEAN_ACCESS_TOKEN`
   - Value: (paste the token above)
   - Click **Add secret**
6. Repeat for `NEXT_PUBLIC_API_URL`

### Option 2: Using GitHub CLI (if installed)
```bash
gh secret set DIGITALOCEAN_ACCESS_TOKEN --body "YOUR_TOKEN_HERE"
gh secret set NEXT_PUBLIC_API_URL --body "https://todo.your-domain.com/api"
```

---

## Fixing the Token Permission Issue

The current token has a **403 Unauthorized** error when accessing Kubernetes.

### Solution: Generate a New Token with Full Scopes

1. Go to Digital Ocean Dashboard: https://cloud.digitalocean.com/account/api/tokens
2. Click **Generate New Token**
3. Name it: `todo-app-github-actions`
4. Select scopes:
   - ✅ Read
   - ✅ Write
5. Click **Generate Token**
6. Copy the new token
7. Update the `DIGITALOCEAN_ACCESS_TOKEN` secret in GitHub with the new token

---

## Verification

After adding secrets, you can verify by:
1. Going to **Settings** → **Secrets and variables** → **Actions**
2. You should see both secrets listed (values are hidden)

---

## What Happens Next

Once secrets are configured:
1. Push code to `main` branch
2. GitHub Actions will:
   - Build Docker images
   - Push to Digital Ocean Container Registry
   - Deploy to Kubernetes using Helm
3. Access your app via the ingress URL
