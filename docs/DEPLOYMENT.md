# Deployment Guide

## Deployment Architecture

### Recommended Stack
- **Frontend**: Vercel (Next.js native) or AWS CloudFront + S3
- **Backend**: AWS ECS/Fargate or Heroku
- **Database**: AWS RDS PostgreSQL
- **DNS**: Route 53 (AWS) or Cloudflare

## Pre-Deployment Checklist

- [ ] All tests passing (`npm run test`)
- [ ] No console errors or warnings
- [ ] Environment variables configured
- [ ] Database migrations up-to-date
- [ ] SSL certificates configured
- [ ] Backups configured
- [ ] Monitoring/logging set up
- [ ] Security headers configured

## Option 1: Vercel + AWS (Recommended)

### Frontend Deployment (Vercel)

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect GitHub to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure environment variables:
     ```
     NEXT_PUBLIC_API_URL=https://api.tinychanges.com
     NEXT_PUBLIC_GOOGLE_CLIENT_ID=xxx
     ```

3. **Deploy**
   - Vercel automatically deploys on push to main
   - Preview deployments for pull requests

### Backend Deployment (AWS ECS)

1. **Create ECR Repository**
   ```bash
   aws ecr create-repository --repository-name tinychanges-api
   ```

2. **Build and Push Docker Image**
   ```bash
   cd backend
   docker build -t tinychanges-api .
   
   # Tag and push to ECR
   docker tag tinychanges-api:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/tinychanges-api:latest
   docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/tinychanges-api:latest
   ```

3. **Create ECS Task Definition**
   - CPU: 256, Memory: 512 (adjust as needed)
   - Environment variables:
     ```
     NODE_ENV=production
     DATABASE_URL=postgresql://...
     GOOGLE_CLIENT_ID=xxx
     GOOGLE_CLIENT_SECRET=xxx
     JWT_SECRET=xxx
     FRONTEND_URL=https://tinychanges.com
     ```

4. **Create ECS Service**
   - Launch type: Fargate
   - Desired count: 2 (high availability)
   - Load balancer: Application Load Balancer

5. **Set up RDS Database**
   ```bash
   # Create RDS instance
   aws rds create-db-instance \
     --db-instance-identifier tinychanges-db \
     --db-instance-class db.t3.micro \
     --engine postgres \
     --master-username admin \
     --master-user-password yourpassword \
     --allocated-storage 20 \
     --vpc-security-group-ids sg-xxxxx
   ```

6. **Run Migrations**
   ```bash
   # Via ECS task
   aws ecs run-task \
     --cluster tinychanges \
     --task-definition tinychanges-migration \
     --launch-type FARGATE
   ```

### Database Setup (AWS RDS)

1. **Create database backup policy**
   - Backup retention: 30 days
   - Multi-AZ deployment for production

2. **Enable enhanced monitoring**
   ```bash
   aws rds modify-db-instance \
     --db-instance-identifier tinychanges-db \
     --enable-cloudwatch-logs-exports postgresql \
     --apply-immediately
   ```

### Domain & SSL Setup

1. **Register domain** (Route 53 or external registrar)

2. **Create SSL certificate** (AWS ACM)
   ```bash
   aws acm request-certificate \
     --domain-name tinychanges.com \
     --domain-name "*.tinychanges.com" \
     --validation-method DNS
   ```

3. **Configure DNS** (Route 53)
   - Create A record pointing to ALB
   - Create CNAME for API subdomain

## Option 2: Docker Compose on VPS

### Prerequisites
- Linux VPS (Ubuntu 20.04+)
- Docker and Docker Compose
- SSH access

### Setup

1. **Clone repository on VPS**
   ```bash
   git clone https://github.com/anoopnair-aipm/tinyChanges.git
   cd tinyChanges
   ```

2. **Create production docker-compose.yml**
   ```yaml
   version: '3.8'
   services:
     postgres:
       image: postgres:16-alpine
       environment:
         POSTGRES_DB: tinychanges
         POSTGRES_PASSWORD: ${DB_PASSWORD}
       volumes:
         - postgres_data:/var/lib/postgresql/data
       restart: always

     backend:
       build: ./backend
       ports:
         - "5000:5000"
       environment:
         NODE_ENV: production
         DATABASE_URL: postgresql://postgres:${DB_PASSWORD}@postgres:5432/tinychanges
         GOOGLE_CLIENT_ID: ${GOOGLE_CLIENT_ID}
         GOOGLE_CLIENT_SECRET: ${GOOGLE_CLIENT_SECRET}
       depends_on:
         - postgres
       restart: always

     frontend:
       build: ./frontend
       ports:
         - "3000:3000"
       environment:
         NEXT_PUBLIC_API_URL: https://api.tinychanges.com
       restart: always

     nginx:
       image: nginx:alpine
       ports:
         - "80:80"
         - "443:443"
       volumes:
         - ./nginx.conf:/etc/nginx/nginx.conf
         - ./certs:/etc/nginx/certs
       depends_on:
         - backend
         - frontend
       restart: always

   volumes:
     postgres_data:
   ```

3. **Set environment variables**
   ```bash
   cat > .env.production << EOF
   DB_PASSWORD=your_secure_password
   GOOGLE_CLIENT_ID=xxx
   GOOGLE_CLIENT_SECRET=xxx
   EOF
   chmod 600 .env.production
   ```

4. **Deploy**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   docker-compose exec backend npm run db:migrate
   ```

## Monitoring & Logging

### CloudWatch (AWS)

```bash
# Create log group
aws logs create-log-group --log-group-name /tinychanges/api

# View logs
aws logs tail /tinychanges/api --follow
```

### Application Performance Monitoring

Consider integrating:
- **Sentry** for error tracking
- **DataDog** for APM
- **New Relic** for full-stack monitoring

### Set up alerts
- Database CPU > 80%
- API response time > 500ms
- Error rate > 1%
- Disk space < 20%

## Backup & Recovery

### Automated Backups

**AWS RDS**:
- Automated backups: 30 days
- Manual snapshots: Daily

**Application Data**:
```bash
# S3 backup script
0 2 * * * aws s3 sync /data s3://tinychanges-backups/$(date +\%Y-\%m-\%d)
```

### Recovery Plan

1. **Database failure**: Restore from RDS snapshot
2. **Application failure**: Redeploy from Docker image
3. **Data loss**: Restore from S3 backups

## Security Best Practices

1. **Secrets Management**
   - Use AWS Secrets Manager or HashiCorp Vault
   - Rotate credentials regularly

2. **Network Security**
   - VPC with private subnets for database
   - Security groups with least privilege access
   - WAF rules for common attacks

3. **Data Encryption**
   - RDS: Encryption at rest (KMS)
   - ECS: Encryption in transit (TLS 1.2+)
   - S3: Server-side encryption

4. **Access Control**
   - IAM policies for AWS resources
   - Database user with minimal permissions
   - API authentication/authorization

## Scaling Considerations

### Horizontal Scaling
- ECS: Auto-scaling based on CPU/memory
- RDS: Read replicas for read-heavy workloads
- CloudFront: CDN for static assets

### Database Optimization
- Connection pooling (PgBouncer)
- Query optimization and indexes
- Caching layer (Redis) for future

## Post-Deployment

1. **Health checks**
   - Monitor API endpoints
   - Database connectivity
   - SSL certificate expiry

2. **Regular updates**
   - OS and dependency patches
   - Security updates
   - Performance optimization

3. **Disaster recovery testing**
   - Test backup restoration monthly
   - Document runbooks
   - Practice incident response

## Useful Deployment Commands

```bash
# View logs
docker-compose logs -f backend

# Scale backend instances
docker-compose up -d --scale backend=3

# Database maintenance
docker-compose exec postgres psql -U postgres -d tinychanges -c "VACUUM ANALYZE;"

# Update and restart
git pull origin main
docker-compose up -d --build
docker-compose exec backend npm run db:migrate
```
