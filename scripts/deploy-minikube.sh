#!/bin/bash
# ==============================================================================
# Minikube Local Deployment Script for Linux/macOS
# ==============================================================================
# This script sets up and deploys the Todo app to a local Minikube cluster
# ==============================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BACKEND_DIR="$PROJECT_ROOT/backend"
FRONTEND_DIR="$PROJECT_ROOT/frontend"
HELM_DIR="$PROJECT_ROOT/helm/todo-app"

echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}   Todo App - Minikube Deployment      ${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""

# Check prerequisites
echo -e "${YELLOW}[1/8] Checking prerequisites...${NC}"

# Check Docker
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✓ Docker: $(docker --version)${NC}"
else
    echo -e "${RED}✗ Docker not found. Please install Docker.${NC}"
    echo "  Download: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check Minikube
if command -v minikube &> /dev/null; then
    echo -e "${GREEN}✓ Minikube: $(minikube version --short)${NC}"
else
    echo -e "${RED}✗ Minikube not found. Please install Minikube.${NC}"
    echo "  Download: https://minikube.sigs.k8s.io/docs/start/"
    exit 1
fi

# Check kubectl
if command -v kubectl &> /dev/null; then
    echo -e "${GREEN}✓ kubectl: $(kubectl version --client --short 2>/dev/null)${NC}"
else
    echo -e "${RED}✗ kubectl not found. Please install kubectl.${NC}"
    echo "  Download: https://kubernetes.io/docs/tasks/tools/"
    exit 1
fi

# Check Helm
if command -v helm &> /dev/null; then
    echo -e "${GREEN}✓ Helm: $(helm version --short)${NC}"
else
    echo -e "${RED}✗ Helm not found. Please install Helm.${NC}"
    echo "  Download: https://helm.sh/docs/intro/install/"
    exit 1
fi

echo ""

# Start Minikube if not running
echo -e "${YELLOW}[2/8] Starting Minikube cluster...${NC}"
if minikube status | grep -q "Running"; then
    echo -e "${GREEN}✓ Minikube already running${NC}"
else
    echo "Starting Minikube with Docker driver..."
    minikube start --driver=docker --memory=3000 --cpus=2
fi

# Enable Ingress addon
echo ""
echo -e "${YELLOW}[3/8] Enabling Ingress addon...${NC}"
minikube addons enable ingress
echo -e "${GREEN}✓ Ingress addon enabled${NC}"

# Set Docker environment to use Minikube's Docker daemon
echo ""
echo -e "${YELLOW}[4/8] Configuring Docker to use Minikube...${NC}"
eval $(minikube docker-env)
echo -e "${GREEN}✓ Docker configured for Minikube${NC}"

# Build Backend Docker image
echo ""
echo -e "${YELLOW}[5/8] Building Backend Docker image...${NC}"
cd "$BACKEND_DIR"
docker build -t todo-backend:latest .
echo -e "${GREEN}✓ Backend image built${NC}"

# Build Frontend Docker image
echo ""
echo -e "${YELLOW}[6/8] Building Frontend Docker image...${NC}"
cd "$FRONTEND_DIR"
docker build -t todo-frontend:latest --build-arg NEXT_PUBLIC_API_URL=http://todo-app.local .
echo -e "${GREEN}✓ Frontend image built${NC}"

# Load images into Minikube
echo ""
echo -e "${YELLOW}[7/8] Loading images into Minikube...${NC}"
minikube image load todo-backend:latest
minikube image load todo-frontend:latest
echo -e "${GREEN}✓ Images loaded into Minikube${NC}"

# Deploy with Helm
echo ""
echo -e "${YELLOW}[8/8] Deploying with Helm...${NC}"
cd "$HELM_DIR"

if helm list -n todo-app -q | grep -q "todo-app"; then
    echo "Upgrading existing release..."
    helm upgrade todo-app . -f values-dev.yaml -n todo-app
else
    echo "Installing new release..."
    helm install todo-app . -f values-dev.yaml --create-namespace
fi
echo -e "${GREEN}✓ Helm deployment complete${NC}"

# Wait for pods to be ready
echo ""
echo "Waiting for pods to be ready..."
kubectl wait --for=condition=ready pod -l app.kubernetes.io/component=backend -n todo-app --timeout=120s
kubectl wait --for=condition=ready pod -l app.kubernetes.io/component=frontend -n todo-app --timeout=120s

# Get Minikube IP
MINIKUBE_IP=$(minikube ip)

echo ""
echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}   Deployment Complete!                ${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""
echo -e "${YELLOW}Add this to your /etc/hosts file:${NC}"
echo "  $MINIKUBE_IP todo-app.local"
echo ""
echo -e "${YELLOW}Access the app at:${NC}"
echo "  http://todo-app.local"
echo ""
echo -e "${YELLOW}Or use port-forward:${NC}"
echo "  kubectl port-forward svc/todo-frontend-service 3000:3000 -n todo-app"
echo "  kubectl port-forward svc/todo-backend-service 8000:8000 -n todo-app"
echo ""
echo -e "${YELLOW}Useful commands:${NC}"
echo "  kubectl get pods -n todo-app"
echo "  kubectl logs -f deployment/todo-backend -n todo-app"
echo "  helm status todo-app -n todo-app"
echo ""
