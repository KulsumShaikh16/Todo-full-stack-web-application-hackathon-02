#!/usr/bin/env pwsh
# Quick Deployment Script for Digital Ocean
# This script helps deploy the Todo app to Digital Ocean Kubernetes

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Todo App - Digital Ocean Deployment" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check if doctl is installed
Write-Host "Checking prerequisites..." -ForegroundColor Yellow
if (-not (Get-Command doctl -ErrorAction SilentlyContinue)) {
    Write-Host "❌ doctl is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please restart your PowerShell session after installing doctl" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ doctl found: " -NoNewline -ForegroundColor Green
doctl version

# Check authentication
Write-Host "`nChecking Digital Ocean authentication..." -ForegroundColor Yellow
$authCheck = doctl auth list 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Not authenticated with Digital Ocean" -ForegroundColor Red
    Write-Host "Run: doctl auth init -t YOUR_TOKEN" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ Authenticated with Digital Ocean" -ForegroundColor Green

# Check cluster access
Write-Host "`nChecking Kubernetes cluster..." -ForegroundColor Yellow
$cluster = doctl kubernetes cluster list --format Name --no-header 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Cannot access Kubernetes cluster" -ForegroundColor Red
    Write-Host "This might be a token permission issue" -ForegroundColor Yellow
    Write-Host "Recommendation: Use GitHub Actions for deployment" -ForegroundColor Cyan
}
else {
    Write-Host "✅ Cluster found: $cluster" -ForegroundColor Green
}

# Check registry
Write-Host "`nChecking Container Registry..." -ForegroundColor Yellow
$registry = doctl registry get --format Name --no-header 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Registry found: $registry" -ForegroundColor Green
}
else {
    Write-Host "⚠️  No registry found" -ForegroundColor Yellow
}

Write-Host "`n=====================================" -ForegroundColor Cyan
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Option 1 (Recommended): Deploy via GitHub Actions" -ForegroundColor Yellow
Write-Host "  1. Commit and push your changes:" -ForegroundColor White
Write-Host "     git add ." -ForegroundColor Gray
Write-Host "     git commit -m 'Configure Digital Ocean deployment'" -ForegroundColor Gray
Write-Host "     git push origin main" -ForegroundColor Gray
Write-Host ""
Write-Host "  2. Monitor deployment:" -ForegroundColor White
Write-Host "     https://github.com/KulsumShaikh16/Todo-full-stack-web-application-hackathon-02/actions" -ForegroundColor Gray
Write-Host ""
Write-Host "Option 2: Manual Deployment (requires token with K8s access)" -ForegroundColor Yellow
Write-Host "  See DIGITAL-OCEAN-DEPLOYMENT.md for detailed steps" -ForegroundColor White
Write-Host ""
Write-Host "For more information, see:" -ForegroundColor Cyan
Write-Host "  - DIGITAL-OCEAN-DEPLOYMENT.md" -ForegroundColor White
Write-Host "  - scripts/setup-github-secrets.md" -ForegroundColor White
Write-Host ""
