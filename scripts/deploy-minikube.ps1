# ==============================================================================
# Minikube Local Deployment Script for Windows
# ==============================================================================
# This script sets up and deploys the Todo app to a local Minikube cluster
# ==============================================================================

# Configuration
$PROJECT_ROOT = Split-Path -Parent $PSScriptRoot
$BACKEND_DIR = Join-Path $PROJECT_ROOT "backend"
$FRONTEND_DIR = Join-Path $PROJECT_ROOT "frontend"
$HELM_DIR = Join-Path $PROJECT_ROOT "helm\todo-app"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Todo App - Minikube Deployment      " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check prerequisites
Write-Host "[1/8] Checking prerequisites..." -ForegroundColor Yellow

# Check Docker
try {
    $dockerVersion = docker --version
    Write-Host "Docker: $dockerVersion" -ForegroundColor Green
    
    # Check if Docker Daemon is responsive (with timeout)
    Write-Host "Verifying Docker Daemon connectivity..." -ForegroundColor Gray
    $job = Start-Job -ScriptBlock { docker ps -q }
    if (-not (Wait-Job $job -Timeout 5)) {
        Stop-Job $job
        Remove-Job $job
        throw "Docker Daemon is unresponsive (timed out). Please restart Docker Desktop."
    }
    $results = Receive-Job $job
    Remove-Job $job
} catch {
    Write-Host "Docker not found or not running. Please ensure Docker Desktop is running." -ForegroundColor Red
    exit 1
}

# Check Minikube
try {
    $minikubeVersion = minikube version --short 2>$null
    Write-Host "Minikube: $minikubeVersion" -ForegroundColor Green
} catch {
    # Check default install path
    if (Test-Path "C:\Program Files\Kubernetes\Minikube\minikube.exe") {
        $env:PATH = "$env:PATH;C:\Program Files\Kubernetes\Minikube"
        $minikubeVersion = minikube version --short
        Write-Host "Minikube: $minikubeVersion (found in Program Files)" -ForegroundColor Green
    } else {
        Write-Host "Minikube not found. Please install Minikube." -ForegroundColor Red
        exit 1
    }
}

# Check kubectl
try {
    $kubectlVersion = kubectl version --client --short 2>$null
    Write-Host "kubectl: $kubectlVersion" -ForegroundColor Green
} catch {
    Write-Host "kubectl not found. Please install kubectl." -ForegroundColor Red
    exit 1
}

# Check Helm
try {
    $helmVersion = helm version --short
    Write-Host "Helm: $helmVersion" -ForegroundColor Green
} catch {
    Write-Host "Helm not found. Please install Helm." -ForegroundColor Red
    exit 1
}

Write-Host ""

# Start Minikube if not running
Write-Host "[2/8] Starting Minikube cluster..." -ForegroundColor Yellow
$minikubeStatus = minikube status --format="{{.Host}}" 2>$null
if ($minikubeStatus -ne "Running") {
    Write-Host "Starting Minikube with Docker driver (2GB Limit)..." -ForegroundColor Gray
    minikube start --driver=docker --memory=2000 --cpus=2
    if ($LASTEXITCODE -ne 0) { Write-Host "Failed to start Minikube" -ForegroundColor Red; exit 1 }
} else {
    Write-Host "Minikube already running" -ForegroundColor Green
}

# Enable Ingress addon
Write-Host ""
Write-Host "[3/8] Enabling Ingress addon..." -ForegroundColor Yellow
minikube addons enable ingress
Write-Host "Ingress addon enabled" -ForegroundColor Green

# Set Docker environment to use Minikube's Docker daemon
Write-Host ""
Write-Host "[4/8] Configuring Docker to use Minikube..." -ForegroundColor Yellow
$dockerEnv = minikube -p minikube docker-env --shell powershell
if ($dockerEnv) {
    $dockerEnv | Invoke-Expression
    Write-Host "Docker configured for Minikube" -ForegroundColor Green
} else {
    Write-Host "Warning: Could not configure Docker env, using Local Load method instead." -ForegroundColor Cyan
}

# Build Backend Docker image
Write-Host ""
Write-Host "[5/8] Building Backend Docker image..." -ForegroundColor Yellow
Push-Location $BACKEND_DIR
docker build -t todo-backend:latest .
Pop-Location
if ($LASTEXITCODE -ne 0) { Write-Host "Backend build failed" -ForegroundColor Red; exit 1 }
Write-Host "Backend image built" -ForegroundColor Green

# Build Frontend Docker image
Write-Host ""
Write-Host "[6/8] Building Frontend Docker image..." -ForegroundColor Yellow
Push-Location $FRONTEND_DIR
docker build -t todo-frontend:latest --build-arg NEXT_PUBLIC_API_URL=http://todo-app.local .
Pop-Location
if ($LASTEXITCODE -ne 0) { Write-Host "Frontend build failed" -ForegroundColor Red; exit 1 }
Write-Host "Frontend image built" -ForegroundColor Green

# Load images into Minikube
Write-Host ""
Write-Host "[7/8] Loading images into Minikube..." -ForegroundColor Yellow
minikube image load todo-backend:latest
minikube image load todo-frontend:latest
Write-Host "Images loaded into Minikube" -ForegroundColor Green

# Read secrets from .env
Write-Host ""
Write-Host "Reading secrets from backend/.env..." -ForegroundColor Yellow
$ENV_FILE = Join-Path $BACKEND_DIR ".env"
if (-not (Test-Path $ENV_FILE)) {
    Write-Host "Error: .env file not found at $ENV_FILE" -ForegroundColor Red
    exit 1
}

$envContent = Get-Content $ENV_FILE
$DATABASE_URL = ""
$BETTER_AUTH_SECRET = ""
$GEMINI_API_KEY = ""

foreach ($line in $envContent) {
    if ($line -match "^DATABASE_URL=(.+)$") { $DATABASE_URL = $matches[1].Trim() }
    if ($line -match "^BETTER_AUTH_SECRET=(.+)$") { $BETTER_AUTH_SECRET = $matches[1].Trim() }
    if ($line -match "^GEMINI_API_KEY=(.+)$") { $GEMINI_API_KEY = $matches[1].Trim() }
}

if (-not $DATABASE_URL -or -not $BETTER_AUTH_SECRET -or -not $GEMINI_API_KEY) {
    Write-Host "Error: Missing required secrets in .env" -ForegroundColor Red
    exit 1
}

# Deploy with Helm
Write-Host ""
Write-Host "[8/8] Deploying with Helm..." -ForegroundColor Yellow
Push-Location $HELM_DIR

# Check if release exists
$releaseExists = helm list -n todo-app -q | Select-String -Pattern "todo-app"
if ($releaseExists) {
    Write-Host "Upgrading existing release..." -ForegroundColor Gray
    helm upgrade todo-app . -f values-dev.yaml -n todo-app --set "secrets.databaseUrl=$DATABASE_URL" --set "secrets.betterAuthSecret=$BETTER_AUTH_SECRET" --set "secrets.geminiApiKey=$GEMINI_API_KEY"
} else {
    Write-Host "Installing new release..." -ForegroundColor Gray
    helm install todo-app . -f values-dev.yaml --create-namespace --namespace todo-app --set "secrets.databaseUrl=$DATABASE_URL" --set "secrets.betterAuthSecret=$BETTER_AUTH_SECRET" --set "secrets.geminiApiKey=$GEMINI_API_KEY"
}
Pop-Location
if ($LASTEXITCODE -ne 0) { Write-Host "Helm deployment failed" -ForegroundColor Red; exit 1 }
Write-Host "Helm deployment complete" -ForegroundColor Green

# Wait for pods to be ready
Write-Host ""
Write-Host "Waiting for pods to be ready..." -ForegroundColor Yellow
kubectl wait --for=condition=ready pod -l app.kubernetes.io/component=backend -n todo-app --timeout=60s
kubectl wait --for=condition=ready pod -l app.kubernetes.io/component=frontend -n todo-app --timeout=60s

# Get Minikube IP
$minikubeIP = minikube ip

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Deployment Complete!                " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Add this to your hosts file:" -ForegroundColor Yellow
Write-Host "  $minikubeIP todo-app.local" -ForegroundColor White
Write-Host ""
Write-Host "Access the app at:" -ForegroundColor Yellow
Write-Host "  http://todo-app.local" -ForegroundColor White
Write-Host ""
Write-Host "Useful commands:" -ForegroundColor Yellow
Write-Host "  kubectl get pods -n todo-app" -ForegroundColor Gray
Write-Host "  kubectl logs -f deployment/todo-backend -n todo-app" -ForegroundColor Gray
Write-Host ""
