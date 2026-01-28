# ==============================================================================
# Create Kubernetes Secrets from .env file
# ==============================================================================
# This script reads the backend .env file and creates a Kubernetes secret
# ==============================================================================

param(
    [string]$Namespace = "todo-app",
    [string]$SecretName = "todo-app-secrets"
)

$PROJECT_ROOT = Split-Path -Parent $PSScriptRoot
$ENV_FILE = Join-Path $PROJECT_ROOT "backend\.env"

Write-Host "Creating Kubernetes secrets from .env file..." -ForegroundColor Yellow

# Check if .env file exists
if (-not (Test-Path $ENV_FILE)) {
    Write-Host "Error: .env file not found at $ENV_FILE" -ForegroundColor Red
    exit 1
}

# Read .env file and extract required values
$envContent = Get-Content $ENV_FILE

$DATABASE_URL = ""
$BETTER_AUTH_SECRET = ""
$GEMINI_API_KEY = ""

foreach ($line in $envContent) {
    if ($line -match "^DATABASE_URL=(.+)$") {
        $DATABASE_URL = $matches[1].Trim()
    }
    if ($line -match "^BETTER_AUTH_SECRET=(.+)$") {
        $BETTER_AUTH_SECRET = $matches[1].Trim()
    }
    if ($line -match "^GEMINI_API_KEY=(.+)$") {
        $GEMINI_API_KEY = $matches[1].Trim()
    }
}

# Validate values
if (-not $DATABASE_URL) {
    Write-Host "Error: DATABASE_URL not found in .env file" -ForegroundColor Red
    exit 1
}
if (-not $BETTER_AUTH_SECRET) {
    Write-Host "Error: BETTER_AUTH_SECRET not found in .env file" -ForegroundColor Red
    exit 1
}
if (-not $GEMINI_API_KEY) {
    Write-Host "Error: GEMINI_API_KEY not found in .env file" -ForegroundColor Red
    exit 1
}

# Create namespace if it doesn't exist
Write-Host "Ensuring namespace '$Namespace' exists..." -ForegroundColor Gray
kubectl create namespace $Namespace --dry-run=client -o yaml | kubectl apply -f -

# Delete existing secret if it exists
Write-Host "Cleaning up existing secret..." -ForegroundColor Gray
kubectl delete secret $SecretName --namespace $Namespace --ignore-not-found

# Create the secret using an array for arguments
Write-Host "Creating new secret..." -ForegroundColor Gray
$secretArgs = @(
    "create", "secret", "generic", $SecretName,
    "--namespace", $Namespace,
    "--from-literal=DATABASE_URL=$DATABASE_URL",
    "--from-literal=BETTER_AUTH_SECRET=$BETTER_AUTH_SECRET",
    "--from-literal=GEMINI_API_KEY=$GEMINI_API_KEY"
)

& kubectl @secretArgs

if ($LASTEXITCODE -eq 0) {
    Write-Host "Success: Secret '$SecretName' created in namespace '$Namespace'" -ForegroundColor Green
    Write-Host ""
    Write-Host "Verify with: kubectl get secret $SecretName -n $Namespace" -ForegroundColor Gray
} else {
    Write-Host "Error: Failed to create secret" -ForegroundColor Red
    exit 1
}
