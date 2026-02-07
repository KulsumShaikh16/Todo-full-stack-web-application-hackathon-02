Write-Host "🔄 Phase 5 Part B: Resetting Minikube Environment..." -ForegroundColor Cyan

# 1. Stop and Delete existing cluster
Write-Host "Stopping Minikube..."
minikube stop
minikube delete

# 2. Start with higher resources (Kafka + Dapr needs this)
Write-Host "Starting Minikube with 2 CPUs and 2GB RAM..."
minikube start --cpus 2 --memory 2048 --driver=docker

# 3. Enable Ingress
Write-Host "Enabling Ingress Addon..."
minikube addons enable ingress

# 4. Configure Docker Env
Write-Host "Configuring Docker Environment..."
minikube -p minikube docker-env | Invoke-Expression

# 5. Initialize Dapr
Write-Host "Initializing Dapr on Kubernetes..."
dapr init -k

Write-Host "✅ Minikube Reset Complete! Ready for Kafka deployment." -ForegroundColor Green
