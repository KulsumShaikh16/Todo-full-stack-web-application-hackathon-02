Write-Host "🐳 Phase 5: Building Docker Images..." -ForegroundColor Cyan

# Ensure we are using Minikube's Docker daemon
Write-Host "Setting Docker Context to Minikube..."
& minikube -p minikube docker-env --shell powershell | Invoke-Expression

# Build Backend
Write-Host "Building Todo Backend (v5.0-dapr)..."
docker build -t todo-backend:v5.0-dapr -f backend/Dockerfile ./backend

# Build Frontend
Write-Host "Building Todo Frontend (v5.0)..."
docker build -t todo-frontend:v5.0 -f frontend/Dockerfile ./frontend

# List Images
docker images | findstr "todo"

Write-Host "✅ Build Complete!" -ForegroundColor Green
