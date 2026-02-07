#!/usr/bin/env pwsh
# Digital Ocean Infrastructure Setup Script
# Installs Dapr, Strimzi Kafka, and NGINX Ingress

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Digital Ocean Infrastructure Setup" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check kubectl connection
Write-Host "Checking kubectl connection..." -ForegroundColor Yellow
$kchk = kubectl cluster-info 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Unable to connect to Kubernetes cluster" -ForegroundColor Red
    Write-Host "Please fix your Digital Ocean token permissions and run:" -ForegroundColor Yellow
    Write-Host "  doctl kubernetes cluster kubeconfig save todo-cluster" -ForegroundColor White
    exit 1
}
Write-Host "✅ Connected to cluster" -ForegroundColor Green

# 1. Install Dapr
Write-Host "`n-------------------------------------" -ForegroundColor Cyan
Write-Host "1. Installing Dapr..." -ForegroundColor Yellow
if (dapr status -k | Select-String "dapr-operator") {
    Write-Host "✅ Dapr is already installed" -ForegroundColor Green
}
else {
    Write-Host "Initializing Dapr..." -ForegroundColor White
    dapr init -k
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Dapr installation failed" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Dapr installed successfully" -ForegroundColor Green
}

# 2. Install Strimzi Kafka
Write-Host "`n-------------------------------------" -ForegroundColor Cyan
Write-Host "2. Installing Strimzi Kafka..." -ForegroundColor Yellow

# Create namespace
kubectl create namespace kafka --dry-run=client -o yaml | kubectl apply -f - 

# Install Operator
Write-Host "Applying Strimzi operator..." -ForegroundColor White
kubectl apply -f 'https://strimzi.io/install/latest?namespace=kafka' -n kafka
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Strimzi operator installation failed" -ForegroundColor Red
    exit 1
}

# Wait for operator (brief pause)
Write-Host "Waiting for operator (10s)..." -ForegroundColor White
Start-Sleep -Seconds 10

# Deploy Cluster
Write-Host "Deploying Kafka cluster..." -ForegroundColor White
kubectl apply -f k8s/kafka/kafka-cluster.yaml -n kafka
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Kafka cluster deployment failed" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Kafka deployment initiated (may take a few minutes to be ready)" -ForegroundColor Green

# 3. Install NGINX Ingress
Write-Host "`n-------------------------------------" -ForegroundColor Cyan
Write-Host "3. Installing NGINX Ingress..." -ForegroundColor Yellow
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/do/deploy.yaml
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Ingress installation failed" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Ingress controller installing..." -ForegroundColor Green

# Final Instructions
Write-Host "`n=====================================" -ForegroundColor Cyan
Write-Host "✅ Setup commands executed" -ForegroundColor Green
Write-Host "Please wait for all pods to be ready before deploying the application." -ForegroundColor Yellow
Write-Host "Monitor status with:" -ForegroundColor White
Write-Host "  kubectl get pods -n kafka" -ForegroundColor Gray
Write-Host "  kubectl get pods -n dapr-system" -ForegroundColor Gray
Write-Host "  kubectl get pods -n ingress-nginx" -ForegroundColor Gray
Write-Host ""
