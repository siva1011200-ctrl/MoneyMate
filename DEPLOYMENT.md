# MoneyMate Deployment Guide

This guide covers deploying MoneyMate to production using Docker and Docker Compose.

## Prerequisites

- Docker (version 20.10 or higher)
- Docker Compose (version 2.0 or higher)
- At least 2GB RAM available
- 10GB free disk space

## Environment Configuration

### Backend Environment Variables

Create `backend/.env` from `backend/.env.example`:

```bash
cp backend/.env.example backend/.env
```

Update the following values:

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET_KEY`: Secure random string (min 64 characters)
- `CORS_ORIGINS`: Comma-separated list of allowed origins
- `ENVIRONMENT`: Set to `production`

### Frontend Environment Variables

Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

Update the following values:

- `VITE_API_URL`: Backend API URL (e.g., `http://your-domain.com:8000`)

## Quick Start

### Using Deployment Scripts

**Linux/Mac:**
```bash
chmod +x deploy.sh
./deploy.sh
```

**Windows (PowerShell):**
```powershell
.\deploy.ps1
```

### Manual Deployment

1. **Build and start containers:**
```bash
docker-compose up -d --build
```

2. **Check service health:**
```bash
docker-compose ps
```

3. **View logs:**
```bash
docker-compose logs -f
```

4. **Stop containers:**
```bash
docker-compose down
```

## Development Mode

For development with hot-reload, use the development docker-compose:

```bash
docker-compose -f docker-compose.dev.yml up -d
```

This will:
- Run frontend with Vite dev server on port 5173
- Mount source code for hot-reload
- Use development database (moneymate_dev)
- Enable debug logging

## Service Architecture

The application consists of three main services:

1. **PostgreSQL Database** (port 5432)
   - Stores all application data
   - Persistent volume for data retention
   - Health check enabled

2. **Backend API** (port 8000)
   - FastAPI application
   - 4 worker processes
   - Health check at `/health`
   - Auto-restart on failure

3. **Frontend** (port 80)
   - Nginx serving React SPA
   - Gzip compression enabled
   - Static file caching
   - Health check enabled

## Health Checks

All services have health checks configured:

- **PostgreSQL**: Checks database readiness
- **Backend**: Checks `/health` endpoint every 30s
- **Frontend**: Checks root endpoint every 30s

View health status:
```bash
docker-compose ps
```

## Database Management

### Backup Database

```bash
docker-compose exec postgres pg_dump -U moneymate_user moneymate > backup.sql
```

### Restore Database

```bash
cat backup.sql | docker-compose exec -T postgres psql -U moneymate_user moneymate
```

### Access Database Shell

```bash
docker-compose exec postgres psql -U moneymate_user moneymate
```

## Monitoring

### View Logs

All services:
```bash
docker-compose logs -f
```

Specific service:
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Resource Usage

```bash
docker stats
```

## Troubleshooting

### Containers won't start

1. Check logs: `docker-compose logs`
2. Verify environment variables in `.env` files
3. Ensure ports 80, 8000, 5432 are not in use
4. Check Docker is running: `docker ps`

### Database connection errors

1. Verify PostgreSQL is healthy: `docker-compose ps postgres`
2. Check DATABASE_URL in backend/.env
3. Ensure backend waits for postgres (handled by health check)

### Frontend can't reach backend

1. Verify VITE_API_URL in .env
2. Check backend is running: `curl http://localhost:8000/health`
3. Check CORS_ORIGINS in backend/.env

### Rebuild without cache

```bash
docker-compose build --no-cache
docker-compose up -d
```

## Production Considerations

### Security

1. **Change default passwords** in environment variables
2. **Use strong JWT_SECRET_KEY** (generate with: `openssl rand -base64 64`)
3. **Enable HTTPS** using reverse proxy (nginx, traefik, etc.)
4. **Restrict CORS origins** to your domain only
5. **Use secrets management** (Docker secrets, AWS Secrets Manager, etc.)

### SSL/TLS

For production, enable HTTPS using:

- **Let's Encrypt** with certbot
- **Cloudflare** SSL
- **Load balancer** SSL termination

Example nginx SSL config:
```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    
    # ... rest of config
}
```

### Scaling

To scale backend workers:

```yaml
# In docker-compose.yml
backend:
  deploy:
    replicas: 3
```

Or manually:
```bash
docker-compose up -d --scale backend=3
```

### Backup Strategy

1. **Automated backups**: Use cron job or backup service
2. **Off-site storage**: Store backups in cloud storage
3. **Retention policy**: Keep daily backups for 30 days, weekly for 12 weeks

Example backup script:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker-compose exec postgres pg_dump -U moneymate_user moneymate > "backup_$DATE.sql"
aws s3 cp "backup_$DATE.sql" s3://your-bucket/backups/
```

## Updating the Application

1. **Pull latest code**
2. **Rebuild containers**:
```bash
docker-compose build
docker-compose up -d
```

3. **Or use deployment script**:
```bash
./deploy.sh
```

## Performance Tuning

### Backend

- Adjust worker count in Dockerfile CMD
- Tune database connection pool in backend/.env
- Enable query caching

### Frontend

- Nginx already configured with gzip
- Static files cached for 1 year
- Consider CDN for static assets

### Database

- Tune PostgreSQL settings in docker-compose.yml
- Add indexes for frequently queried columns
- Regular vacuum and analyze

## Support

For issues or questions:
- Check logs: `docker-compose logs`
- Review this guide
- Check application documentation
