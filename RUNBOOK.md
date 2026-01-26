# NomosX Production Runbook

## Overview

This runbook provides step-by-step instructions for deploying, operating, and maintaining NomosX in production.

**Target Audience**: DevOps engineers, SREs, Backend engineers

**Prerequisites**:
- Docker & Docker Compose installed
- PostgreSQL 15+ with pgvector extension
- Redis 7+
- Node.js 20+
- Access to OpenAI API

---

## 1. INITIAL SETUP

### 1.1 Environment Variables

Create `.env.production`:

```bash
# Core
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/nomosx
REDIS_URL=redis://:password@host:6379

# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o

# Academic APIs
OPENALEX_API=https://api.openalex.org/works
CROSSREF_API=https://api.crossref.org/works
SEMANTICSCHOLAR_API=https://api.semanticscholar.org/graph/v1/paper/search
UNPAYWALL_EMAIL=your-email@domain.com

# Identity Enrichment
ROR_API=https://api.ror.org/organizations
ORCID_API=https://pub.orcid.org/v3.0

# Security
JWT_SECRET=<generate-strong-secret>
ADMIN_KEY=<generate-strong-key>

# Monitoring
SENTRY_DSN=<your-sentry-dsn>

# App
NEXT_PUBLIC_APP_URL=https://nomosx.ai
```

### 1.2 Database Setup

```bash
# 1. Create database
psql -U postgres -c "CREATE DATABASE nomosx;"

# 2. Enable pgvector extension
psql -U postgres -d nomosx -c "CREATE EXTENSION IF NOT EXISTS vector;"

# 3. Run migrations
npm run prisma:migrate:deploy

# 4. Seed initial data (domains, feature flags)
npm run seed:production
```

### 1.3 Redis Setup

```bash
# Configure Redis for production
redis-cli CONFIG SET maxmemory 4gb
redis-cli CONFIG SET maxmemory-policy allkeys-lru
redis-cli CONFIG SET save "900 1 300 10 60 10000"
```

---

## 2. DEPLOYMENT

### 2.1 Docker Deployment

**Build images**:

```bash
# API server
docker build -t nomosx-api:latest -f Dockerfile.api .

# Workers
docker build -t nomosx-worker:latest -f Dockerfile.worker .

# Cron jobs
docker build -t nomosx-cron:latest -f Dockerfile.cron .
```

**Deploy with Docker Compose**:

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  api:
    image: nomosx-api:latest
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    env_file:
      - .env.production
    depends_on:
      - postgres
      - redis
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '2'
          memory: 4G

  worker:
    image: nomosx-worker:latest
    environment:
      - NODE_ENV=production
    env_file:
      - .env.production
    depends_on:
      - postgres
      - redis
    deploy:
      replicas: 5
      resources:
        limits:
          cpus: '4'
          memory: 8G

  cron:
    image: nomosx-cron:latest
    environment:
      - NODE_ENV=production
    env_file:
      - .env.production
    depends_on:
      - postgres
      - redis

  postgres:
    image: pgvector/pgvector:pg15
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      POSTGRES_USER: nomosx
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: nomosx

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

Deploy:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### 2.2 Kubernetes Deployment

See `k8s/` folder for full Kubernetes manifests.

Key deployments:
- `api-deployment.yaml` - API servers (HPA: 3-10 pods)
- `worker-deployment.yaml` - Workers (HPA: 5-20 pods)
- `cron-cronjob.yaml` - Cron jobs
- `postgres-statefulset.yaml` - PostgreSQL with persistent volume
- `redis-statefulset.yaml` - Redis with persistent volume

Deploy:

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/configmaps.yaml
kubectl apply -f k8s/
```

---

## 3. OPERATIONS

### 3.1 Health Checks

**API Health**:

```bash
curl https://api.nomosx.ai/health

# Expected response:
{
  "status": "healthy",
  "timestamp": "2026-01-21T10:00:00Z",
  "version": "2.0.0",
  "checks": {
    "database": "ok",
    "redis": "ok",
    "workers": "ok"
  }
}
```

**Queue Metrics**:

```bash
curl https://api.nomosx.ai/admin/queues/metrics

# Expected response:
{
  "queues": {
    "scout": { "waiting": 5, "active": 2, "completed": 1523, "failed": 3 },
    "analyst": { "waiting": 0, "active": 1, "completed": 845, "failed": 1 }
  }
}
```

### 3.2 Monitoring

**Key Metrics to Watch**:

1. **Request Rate**: `http_requests_total`
2. **Request Duration**: `http_request_duration_seconds`
3. **Queue Length**: `queue_waiting_count`
4. **Job Processing Time**: `job_duration_seconds`
5. **Error Rate**: `errors_total`
6. **Trust Score Distribution**: `trust_score_histogram`
7. **Cost per Run**: `cost_per_run_usd`
8. **Token Usage**: `tokens_used_total`

**Prometheus Queries**:

```promql
# Request rate (per minute)
rate(http_requests_total[1m])

# P95 latency
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))

# Error rate
rate(errors_total[5m]) / rate(http_requests_total[5m])

# Queue backlog
queue_waiting_count{queue="analyst"}

# Average cost per run
avg(cost_per_run_usd)
```

**Grafana Dashboards**:
- `NomosX - Overview` - High-level metrics
- `NomosX - API Performance` - API latency, error rates
- `NomosX - Queue Health` - Queue lengths, processing times
- `NomosX - Trust & Quality` - Trust scores, evidence quality
- `NomosX - Costs` - Token usage, cost per run

### 3.3 Alerts

**Critical Alerts**:

```yaml
# alertmanager-rules.yaml

groups:
  - name: nomosx-critical
    rules:
      - alert: HighErrorRate
        expr: rate(errors_total[5m]) / rate(http_requests_total[5m]) > 0.05
        for: 5m
        annotations:
          summary: "High error rate: {{ $value }}"
        
      - alert: QueueBacklog
        expr: queue_waiting_count > 1000
        for: 10m
        annotations:
          summary: "Queue backlog: {{ $labels.queue }}"
      
      - alert: DatabaseDown
        expr: up{job="postgres"} == 0
        for: 1m
        annotations:
          summary: "Database is down"
      
      - alert: HighCostPerRun
        expr: avg_over_time(cost_per_run_usd[1h]) > 5.0
        for: 30m
        annotations:
          summary: "Cost per run exceeds $5"
```

### 3.4 Logs

**Structured Logging**:

All logs are JSON-formatted with correlation IDs:

```json
{
  "level": "info",
  "timestamp": "2026-01-21T10:30:00Z",
  "correlationId": "abc-123",
  "service": "claim-extractor",
  "operation": "extract_claims",
  "duration_ms": 1234,
  "claims_extracted": 15,
  "cost_usd": 0.05
}
```

**Log Aggregation** (Elasticsearch/Loki):

```bash
# Search by correlation ID
curl -X GET "localhost:9200/nomosx-logs/_search" -H 'Content-Type: application/json' -d'
{
  "query": {
    "match": {
      "correlationId": "abc-123"
    }
  }
}'

# Find high-cost operations
curl -X GET "localhost:9200/nomosx-logs/_search" -H 'Content-Type: application/json' -d'
{
  "query": {
    "range": {
      "cost_usd": { "gte": 1.0 }
    }
  }
}'
```

---

## 4. MAINTENANCE

### 4.1 Database Maintenance

**Vacuum & Analyze** (weekly):

```bash
psql -U nomosx -d nomosx -c "VACUUM ANALYZE;"
```

**Rebuild Indexes** (monthly):

```bash
psql -U nomosx -d nomosx -c "REINDEX DATABASE nomosx;"
```

**Backup**:

```bash
# Daily backups
pg_dump -U nomosx -d nomosx -F c -f /backups/nomosx-$(date +%Y%m%d).dump

# Restore from backup
pg_restore -U nomosx -d nomosx /backups/nomosx-20260121.dump
```

### 4.2 Queue Maintenance

**Clean old jobs** (daily via cron):

```bash
npm run queue:clean -- --grace=86400000
```

**Process dead-letter queue**:

```bash
# List dead-letter jobs
npm run queue:dead-letter:list

# Retry a job
npm run queue:dead-letter:retry -- --jobId=<job-id>

# Archive old dead-letter jobs
npm run queue:dead-letter:archive -- --older-than=30d
```

### 4.3 Cost Optimization

**Monitor token usage**:

```sql
-- Top costly operations (last 7 days)
SELECT 
  operation,
  COUNT(*) as count,
  SUM(tokens_total) as total_tokens,
  SUM(cost_usd) as total_cost,
  AVG(cost_usd) as avg_cost
FROM "CostLog"
WHERE "createdAt" > NOW() - INTERVAL '7 days'
GROUP BY operation
ORDER BY total_cost DESC;
```

**Cost reduction strategies**:
1. **Cache embeddings**: Don't re-embed same text
2. **Batch LLM calls**: Combine multiple claims in one call
3. **Use cheaper models**: GPT-4o-mini for simple tasks
4. **Limit retries**: Max 3 attempts per job
5. **Feature flags**: Disable expensive features for low-priority users

---

## 5. INCIDENT RESPONSE

### 5.1 Common Issues

**Issue: High queue backlog**

Symptoms:
- `queue_waiting_count` > 1000
- Slow analysis completion

Resolution:
```bash
# 1. Check worker health
kubectl get pods -l app=worker

# 2. Scale up workers
kubectl scale deployment nomosx-worker --replicas=15

# 3. Check for stuck jobs
npm run queue:inspect -- --queue=analyst

# 4. Clear stuck jobs if necessary
npm run queue:clear-stuck -- --queue=analyst --older-than=1h
```

**Issue: High error rate**

Symptoms:
- Error rate > 5%
- Failed jobs in queue

Resolution:
```bash
# 1. Check logs for error patterns
kubectl logs -l app=api --since=1h | grep -i error

# 2. Check OpenAI API status
curl https://status.openai.com/api/v2/status.json

# 3. Rollback if recent deployment
kubectl rollout undo deployment/nomosx-api

# 4. Enable circuit breaker
kubectl set env deployment/nomosx-api CIRCUIT_BREAKER_ENABLED=true
```

**Issue: Database performance degradation**

Symptoms:
- Slow query times
- High CPU on database

Resolution:
```bash
# 1. Check slow queries
SELECT * FROM pg_stat_statements ORDER BY mean_exec_time DESC LIMIT 10;

# 2. Analyze query plans
EXPLAIN ANALYZE SELECT ...;

# 3. Add missing indexes
CREATE INDEX CONCURRENTLY idx_name ON table(column);

# 4. Scale up database
# (Provision larger instance)
```

### 5.2 Rollback Procedure

```bash
# 1. Identify last stable version
kubectl rollout history deployment/nomosx-api

# 2. Rollback to previous version
kubectl rollout undo deployment/nomosx-api

# 3. Verify health
curl https://api.nomosx.ai/health

# 4. Check metrics
# (Monitor Grafana for 10 minutes)

# 5. Notify team
# (Post in #incidents channel)
```

---

## 6. SECURITY

### 6.1 Security Checklist

- [ ] All secrets in environment variables (not committed)
- [ ] JWT tokens expire after 24h
- [ ] Rate limiting enabled (100 req/min per user)
- [ ] SQL injection protection (Prisma parameterized queries)
- [ ] XSS protection (sanitize HTML output)
- [ ] CORS configured (whitelist only)
- [ ] HTTPS enforced
- [ ] Database backups encrypted
- [ ] Audit logs enabled
- [ ] MFA for admin accounts

### 6.2 Access Control

**Roles**:
- `user`: Standard user (create runs, view own data)
- `analyst`: Verify claims, provide feedback
- `admin`: Full access, manage users, view all data

**API Authentication**:

```bash
# Get JWT token
curl -X POST https://api.nomosx.ai/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "..."}'

# Use token in requests
curl https://api.nomosx.ai/api/v1/analysis \
  -H "Authorization: Bearer <jwt-token>"
```

---

## 7. SCALING

### 7.1 Horizontal Scaling

**API Servers**:
- Min: 3 pods
- Max: 10 pods
- Target CPU: 70%

**Workers**:
- Min: 5 pods
- Max: 20 pods
- Target queue length: 50 jobs/worker

**Autoscaling**:

```bash
# API HPA
kubectl autoscale deployment nomosx-api \
  --cpu-percent=70 \
  --min=3 \
  --max=10

# Worker HPA
kubectl autoscale deployment nomosx-worker \
  --cpu-percent=80 \
  --min=5 \
  --max=20
```

### 7.2 Vertical Scaling

**When to scale up**:
- Worker OOM (out of memory)
- High CPU consistently above 80%
- P95 latency > 5s

**Resource recommendations**:
- API: 2 CPU, 4GB RAM
- Worker: 4 CPU, 8GB RAM (handles LLM calls)
- Postgres: 8 CPU, 32GB RAM, 500GB SSD
- Redis: 4 CPU, 16GB RAM

---

## 8. PERFORMANCE TUNING

### 8.1 Database Optimization

```sql
-- Add indexes for common queries
CREATE INDEX CONCURRENTLY idx_claim_run_id ON "Claim"("runId");
CREATE INDEX CONCURRENTLY idx_claim_trust_score ON "Claim"("trustScore");
CREATE INDEX CONCURRENTLY idx_evidence_claim_id ON "EvidenceSpan"("claimId");

-- Optimize full-text search
CREATE INDEX idx_source_search ON "Source" USING GIN (search_vector);

-- Optimize vector search
CREATE INDEX idx_chunk_embedding ON "SourceChunk" USING ivfflat (embedding vector_cosine_ops);
```

### 8.2 Caching Strategy

**Redis caching**:
- Embeddings: 7 days TTL
- Source metadata: 1 day TTL
- Analysis results: 1 hour TTL

**Example**:

```typescript
// Cache embedding
await redis.setex(
  `embedding:${hash}`,
  604800, // 7 days
  JSON.stringify(embedding)
);

// Get from cache
const cached = await redis.get(`embedding:${hash}`);
if (cached) return JSON.parse(cached);
```

---

## 9. DISASTER RECOVERY

### 9.1 Backup Strategy

**Daily**:
- Full database backup
- Redis snapshot
- Config files

**Weekly**:
- Offsite backup to S3/GCS
- Test restore procedure

**Monthly**:
- DR drill (restore from backup)

### 9.2 Recovery Procedures

**Scenario: Database corruption**

```bash
# 1. Stop all writes
kubectl scale deployment nomosx-api --replicas=0
kubectl scale deployment nomosx-worker --replicas=0

# 2. Restore from latest backup
pg_restore -U nomosx -d nomosx_new /backups/latest.dump

# 3. Verify data integrity
psql -U nomosx -d nomosx_new -c "SELECT COUNT(*) FROM \"AnalysisRun\";"

# 4. Switch to restored database
# (Update DATABASE_URL)

# 5. Restart services
kubectl scale deployment nomosx-api --replicas=3
kubectl scale deployment nomosx-worker --replicas=5
```

---

## 10. CONTACT & ESCALATION

**On-Call Rotation**: PagerDuty schedule
**Escalation Path**:
1. L1: DevOps team (response time: 15 min)
2. L2: Backend team (response time: 30 min)
3. L3: CTO (response time: 1 hour)

**Communication Channels**:
- Slack: #incidents
- Email: ops@nomosx.ai
- PagerDuty: https://nomosx.pagerduty.com

---

**Last Updated**: 2026-01-21
**Version**: 2.0.0
**Owner**: Platform Team
