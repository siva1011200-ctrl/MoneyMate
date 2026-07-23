# MoneyMate Production Deployment Script (Windows PowerShell)
# This script builds and deploys the application using Docker Compose

$ErrorActionPreference = "Stop"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "MoneyMate Production Deployment" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Function to print colored output
function Print-Success {
    param([string]$Message)
    Write-Host "✓ $Message" -ForegroundColor Green
}

function Print-Warning {
    param([string]$Message)
    Write-Host "⚠ $Message" -ForegroundColor Yellow
}

function Print-Error {
    param([string]$Message)
    Write-Host "✗ $Message" -ForegroundColor Red
}

# Check if Docker is installed
try {
    docker --version | Out-Null
    Print-Success "Docker is installed"
} catch {
    Print-Error "Docker is not installed. Please install Docker Desktop first."
    exit 1
}

# Check if Docker Compose is installed
try {
    docker-compose --version | Out-Null
    Print-Success "Docker Compose is installed"
} catch {
    Print-Error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
}

# Check if .env file exists
if (-not (Test-Path .env)) {
    Print-Warning ".env file not found. Creating from .env.example..."
    Copy-Item .env.example .env
    Print-Warning "Please update .env with your production values before running this script again."
    exit 1
}

# Check if backend .env file exists
if (-not (Test-Path backend\.env)) {
    Print-Warning "backend/.env file not found. Creating from backend/.env.example..."
    Copy-Item backend\.env.example backend\.env
    Print-Warning "Please update backend/.env with your production values before running this script again."
    exit 1
}

# Prompt for confirmation
Write-Host ""
$confirmation = Read-Host "This will rebuild and restart all containers. Continue? (y/n)"
if ($confirmation -ne "y" -and $confirmation -ne "Y") {
    Print-Warning "Deployment cancelled."
    exit 0
}

# Stop existing containers
Write-Host ""
Print-Success "Stopping existing containers..."
docker-compose down

# Build images
Write-Host ""
Print-Success "Building Docker images..."
docker-compose build --no-cache

# Start containers
Write-Host ""
Print-Success "Starting containers..."
docker-compose up -d

# Wait for services to be healthy
Write-Host ""
Print-Success "Waiting for services to be healthy..."
Start-Sleep -Seconds 10

# Check service health
Write-Host ""
Print-Success "Checking service health..."
docker-compose ps

# Run database migrations if needed
Write-Host ""
Print-Success "Running database migrations..."
docker-compose exec -T backend python -c "from app.database import engine; from app.models import Base; Base.metadata.create_all(bind=engine); print('Database tables created successfully')"

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Print-Success "Deployment completed successfully!"
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Application is now running at:"
Write-Host "  - Frontend: http://localhost"
Write-Host "  - Backend API: http://localhost:8000"
Write-Host "  - API Documentation: http://localhost:8000/docs"
Write-Host ""
Write-Host "To view logs: docker-compose logs -f"
Write-Host "To stop: docker-compose down"
Write-Host ""
