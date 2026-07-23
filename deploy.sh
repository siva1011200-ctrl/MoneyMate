#!/bin/bash

# MoneyMate Production Deployment Script
# This script builds and deploys the application using Docker Compose

set -e

echo "=========================================="
echo "MoneyMate Production Deployment"
echo "=========================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    print_warning ".env file not found. Creating from .env.example..."
    cp .env.example .env
    print_warning "Please update .env with your production values before running this script again."
    exit 1
fi

# Check if backend .env file exists
if [ ! -f backend/.env ]; then
    print_warning "backend/.env file not found. Creating from backend/.env.example..."
    cp backend/.env.example backend/.env
    print_warning "Please update backend/.env with your production values before running this script again."
    exit 1
fi

# Prompt for confirmation
echo ""
read -p "This will rebuild and restart all containers. Continue? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_warning "Deployment cancelled."
    exit 0
fi

# Stop existing containers
echo ""
print_success "Stopping existing containers..."
docker-compose down

# Build images
echo ""
print_success "Building Docker images..."
docker-compose build --no-cache

# Start containers
echo ""
print_success "Starting containers..."
docker-compose up -d

# Wait for services to be healthy
echo ""
print_success "Waiting for services to be healthy..."
sleep 10

# Check service health
echo ""
print_success "Checking service health..."
docker-compose ps

# Run database migrations if needed
echo ""
print_success "Running database migrations..."
docker-compose exec -T backend python -c "from app.database import engine; from app.models import Base; Base.metadata.create_all(bind=engine); print('Database tables created successfully')"

echo ""
echo "=========================================="
print_success "Deployment completed successfully!"
echo "=========================================="
echo ""
echo "Application is now running at:"
echo "  - Frontend: http://localhost"
echo "  - Backend API: http://localhost:8000"
echo "  - API Documentation: http://localhost:8000/docs"
echo ""
echo "To view logs: docker-compose logs -f"
echo "To stop: docker-compose down"
echo ""
