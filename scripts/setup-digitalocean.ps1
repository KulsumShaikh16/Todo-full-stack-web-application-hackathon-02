# Digital Ocean Infrastructure Setup Script
# This script helps you provision the resources needed for Phase 5.
# Pre-requisite: Install doctl (https://docs.digitalocean.com/reference/doctl/how-to/install/)

param (
    [string]$ClusterName = "todo-cluster",
    [string]$RegistryName = "todo-registry",
    [string]$Region = "nyc1"
)

Write-Host "🚀 Starting Digital Ocean Setup..." -ForegroundColor Cyan

# 1. Authenticate (if not done)
# Write-Host "Checking authentication..."
# doctl auth init

# 2. Create Container Registry
Write-Host "📦 Creating Container Registry: $RegistryName..."
doctl registry create $RegistryName --region $Region

# 3. Create Kubernetes Cluster
Write-Host "☸️ Creating DOKS Cluster: $ClusterName (this may take 5-10 minutes)..."
doctl kubernetes cluster create $ClusterName `
    --region $Region `
    --node-pool "name=worker-pool;size=s-2vcpu-4gb;count=2;auto-scale=true;min-nodes=2;max-nodes=4"

# 4. Get Kubeconfig
Write-Host "💾 Saving Kubeconfig..."
doctl kubernetes cluster kubeconfig save $ClusterName

# 5. Initialize Dapr
Write-Host "🧩 Initializing Dapr on Cluster..."
dapr init -k

# 6. Setup Strimzi Kafka
Write-Host "🎡 Installing Strimzi Kafka Operator..."
kubectl create namespace kafka
kubectl apply -f https://strimzi.io/install/latest?namespace=kafka

Write-Host "✅ Infrastructure Setup Complete!" -ForegroundColor Green
Write-Host "Next steps:"
Write-Host "1. Add DIGITALOCEAN_ACCESS_TOKEN to GitHub Secrets."
Write-Host "2. Add NEXT_PUBLIC_API_URL to GitHub Secrets."
Write-Host "3. Run 'kubectl apply -f k8s/kafka/kafka-cluster.yaml' to create the Kafka cluster."
