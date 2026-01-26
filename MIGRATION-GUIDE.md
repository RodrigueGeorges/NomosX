# NomosX Migration Guide - MVP to Production

## Overview

This guide outlines the migration from the current MVP to the production-grade CTO architecture.

**Timeline**: 10 weeks
**Team**: 3-4 senior engineers
**Budget**: Estimate $150K-200K for development + infrastructure

---

## Phase 1: Foundation (Week 1-2)

### Objectives
- Set up production infrastructure
- Apply new database schema
- Implement core observability

### Tasks

#### 1.1 Infrastructure Setup
```bash
# Provision resources
- PostgreSQL 15+ with pgvector (AWS RDS / GCP Cloud SQL)
- Redis 7+ (AWS ElastiCache / GCP Memorystore)
- Kubernetes cluster (EKS / GKE) or Docker Swarm

# Configure monitoring
- Prometheus + Grafana
- Sentry for error tracking
- Structured logging (Elasticsearch/Loki)
```

#### 1.2 Database Migration
```bash
# 1. Backup current database
pg_dump -U postgres -d nomosx_old > backup_$(date +%Y%m%d).sql

# 2. Create new database
psql -U postgres -c "CREATE DATABASE nomosx_new;"

# 3. Enable pgvector
psql -U postgres -d nomosx_new -c "CREATE EXTENSION vector;"

# 4. Apply new schema
prisma migrate deploy --schema=prisma/schema-upgraded.prisma

# 5. Migrate existing data
npm run migrate:data:old-to-new

# 6. Verify data integrity
npm run verify:data-integrity

# 7. Switch applications to new database
# (Update DATABASE_URL in production)
```

#### 1.3 Observability Setup
```typescript
// Implement structured logging
import { createLogger } from './shared/logging/Logger';

const logger = createLogger({
  service: 'nomosx-api',
  level: 'info',
  // Send to Elasticsearch/Loki
});

// Add correlation IDs to all requests
app.use(correlationIdMiddleware);

// Expose Prometheus metrics
app.get('/metrics', prometheusMetricsHandler);
```

**Deliverables**:
- [ ] Infrastructure provisioned
- [ ] New database schema applied
- [ ] Logging configured
- [ ] Metrics exposed

---

## Phase 2: Core Engine (Week 3-4)

### Objectives
- Implement claim extraction
- Build evidence binding
- Add trust scoring

### Tasks

#### 2.1 Claim Extraction
```typescript
// Implement domain/claim/services/ClaimExtractor.ts
import { ClaimExtractor } from './domain/claim/services/ClaimExtractor';

const extractor = new ClaimExtractor(openai, logger);

const claims = await extractor.extract({
  runId: 'abc-123',
  analysisText: '...',
  correlationId: 'corr-456',
});

// Store claims in database
for (const claim of claims) {
  await prisma.claim.create({
    data: {
      ...claim.toPersistence(),
    },
  });
}
```

#### 2.2 Evidence Binding
```typescript
// Implement domain/evidence/services/EvidenceBinder.ts
import { EvidenceBinder } from './domain/evidence/services/EvidenceBinder';

const binder = new EvidenceBinder(openai, logger);

for (const claim of claims) {
  const evidenceSpans = await binder.bind({
    claim,
    sources,
    correlationId,
  });

  // Store evidence spans
  for (const span of evidenceSpans) {
    await prisma.evidenceSpan.create({
      data: {
        claimId: claim.id,
        ...span,
      },
    });
  }
}
```

#### 2.3 Trust Scoring
```typescript
// Implement domain/claim/services/TrustScorer.ts
import { TrustScorer } from './domain/claim/services/TrustScorer';

const scorer = new TrustScorer(logger);

const trustResult = scorer.computeRunTrust({
  claims,
  evidenceSpans,
  sourceMetrics,
  correlationId,
});

// Update run with trust score
await prisma.analysisRun.update({
  where: { id: runId },
  data: {
    trustScore: trustResult.overallTrust.getValue(),
    qualityScore: trustResult.metrics.sourceQuality,
    citationCoverage: trustResult.metrics.citationCoverage,
  },
});
```

**Deliverables**:
- [ ] Claim extraction working
- [ ] Evidence binding implemented
- [ ] Trust scores computed
- [ ] Tests passing (>80% coverage)

---

## Phase 3: Retrieval Upgrade (Week 5-6)

### Objectives
- Add pgvector support
- Implement hybrid search
- Add reranking

### Tasks

#### 3.1 Embeddings Migration
```typescript
// Generate embeddings for all existing sources
import { generateEmbedding } from './infrastructure/ai/openai/embeddings';

const sources = await prisma.source.findMany();

for (const source of sources) {
  if (!source.abstract) continue;

  const embedding = await generateEmbedding(source.abstract);

  await prisma.source.update({
    where: { id: source.id },
    data: {
      embedding: `[${embedding.join(',')}]`, // pgvector format
      embeddingModel: 'text-embedding-3-small',
    },
  });
}
```

#### 3.2 Hybrid Search
```typescript
// Implement semantic + keyword search
async function hybridSearch(query: string, k: number = 12) {
  // 1. Semantic search (pgvector)
  const queryEmbedding = await generateEmbedding(query);

  const semanticResults = await prisma.$queryRaw`
    SELECT id, title, abstract,
      embedding <=> ${queryEmbedding}::vector AS distance
    FROM "Source"
    ORDER BY distance
    LIMIT ${k * 2}
  `;

  // 2. Keyword search (full-text)
  const keywordResults = await prisma.$queryRaw`
    SELECT id, title, abstract,
      ts_rank(search_vector, plainto_tsquery(${query})) AS rank
    FROM "Source"
    WHERE search_vector @@ plainto_tsquery(${query})
    ORDER BY rank DESC
    LIMIT ${k * 2}
  `;

  // 3. Merge and deduplicate
  const merged = mergeResults(semanticResults, keywordResults);

  // 4. Rerank with Cohere
  const reranked = await rerank(query, merged);

  return reranked.slice(0, k);
}
```

#### 3.3 Reranking
```typescript
// Add Cohere reranking
import { CohereClient } from 'cohere-ai';

const cohere = new CohereClient({ apiKey: process.env.COHERE_API_KEY });

async function rerank(query: string, documents: any[]) {
  const response = await cohere.rerank({
    model: 'rerank-english-v2.0',
    query,
    documents: documents.map(d => d.abstract || d.title),
    topN: 12,
  });

  return response.results.map(r => documents[r.index]);
}
```

**Deliverables**:
- [ ] Embeddings generated
- [ ] Hybrid search working
- [ ] Reranking implemented
- [ ] Query performance < 500ms

---

## Phase 4: Orchestration (Week 7-8)

### Objectives
- Set up Redis queues
- Implement workers
- Add retry logic

### Tasks

#### 4.1 Queue Setup
```typescript
// Initialize queue manager
import { QueueManager, QUEUE_NAMES } from './infrastructure/queue/QueueManager';

const queueManager = new QueueManager(
  {
    host: process.env.REDIS_HOST,
    port: 6379,
    password: process.env.REDIS_PASSWORD,
  },
  logger
);

// Create queues for each agent
for (const queueName of Object.values(QUEUE_NAMES)) {
  queueManager.getQueue(queueName);
}
```

#### 4.2 Worker Registration
```typescript
// Register workers for each job type
queueManager.registerWorker(
  QUEUE_NAMES.CLAIM_EXTRACTOR,
  async (job, logger) => {
    const { runId, analysisText, correlationId } = job.data;

    const extractor = new ClaimExtractor(openai, logger);
    const claims = await extractor.extract({
      runId,
      analysisText,
      correlationId,
    });

    return { claims: claims.map(c => c.toDTO()) };
  },
  { concurrency: 5 }
);

// Start worker
// npm run worker:start
```

#### 4.3 Pipeline Orchestration
```typescript
// Coordinate full pipeline
async function orchestratePipeline(runId: string, correlationId: string) {
  // 1. Scout
  await queueManager.addJob(
    QUEUE_NAMES.SCOUT,
    { runId, correlationId, data: { query: '...' } },
    { priority: 8, idempotencyKey: `scout-${runId}` }
  );

  // 2. Index (after Scout completes)
  await queueManager.addJob(
    QUEUE_NAMES.INDEX,
    { runId, correlationId, data: { sourceIds: [...] } },
    { priority: 7, delay: 5000 }
  );

  // 3. Continue pipeline...
}
```

**Deliverables**:
- [ ] Redis queues running
- [ ] Workers deployed (5+ instances)
- [ ] Retry logic working
- [ ] Dead-letter queue configured

---

## Phase 5: Quality Loop (Week 9-10)

### Objectives
- Implement feedback system
- Add learning pipeline
- Build admin dashboard

### Tasks

#### 5.1 Feedback Collection
```typescript
// API endpoint for feedback
app.post('/api/v1/analysis/:runId/feedback', async (req, res) => {
  const { runId } = req.params;
  const feedback = SubmitFeedbackRequestSchema.parse(req.body);

  await prisma.runFeedback.create({
    data: {
      runId,
      userId: req.user.id,
      ...feedback,
    },
  });

  // Trigger feedback analysis (async)
  await queueManager.addJob('feedback-analyzer', {
    runId,
    correlationId: req.correlationId,
    data: feedback,
  });

  res.json({ message: 'Feedback submitted' });
});
```

#### 5.2 Learning Pipeline
```typescript
// Analyze feedback to improve system
async function analyzeFeedback(runId: string) {
  const feedback = await prisma.runFeedback.findMany({
    where: { runId },
  });

  const avgRating = feedback.reduce((sum, f) => sum + f.overallRating, 0) / feedback.length;

  if (avgRating < 3) {
    // Low-rated run, analyze what went wrong
    const run = await prisma.analysisRun.findUnique({
      where: { id: runId },
      include: { claims: true },
    });

    // Store insights for future improvement
    await prisma.qualityInsight.create({
      data: {
        runId,
        issue: 'low_rating',
        avgRating,
        claimCount: run.claims.length,
        trustScore: run.trustScore,
        recommendations: ['Need more evidence', 'Improve source quality'],
      },
    });
  }
}
```

#### 5.3 Admin Dashboard
```typescript
// Admin endpoints
app.get('/admin/metrics', requireAdmin, async (req, res) => {
  const [
    totalRuns,
    avgTrustScore,
    avgCost,
    queueMetrics,
  ] = await Promise.all([
    prisma.analysisRun.count(),
    prisma.analysisRun.aggregate({ _avg: { trustScore: true } }),
    prisma.costLog.aggregate({ _avg: { costUsd: true } }),
    queueManager.getMetrics(QUEUE_NAMES.ANALYST),
  ]);

  res.json({
    totalRuns,
    avgTrustScore: avgTrustScore._avg.trustScore,
    avgCost: avgCost._avg.costUsd,
    queues: queueMetrics,
  });
});
```

**Deliverables**:
- [ ] Feedback system live
- [ ] Learning pipeline running
- [ ] Admin dashboard deployed
- [ ] Quality reports automated

---

## Phase 6: Production Hardening (Week 11-12)

### Objectives
- Load testing
- Security audit
- Cost optimization
- Documentation complete

### Tasks

#### 6.1 Load Testing
```bash
# Use k6 for load testing
k6 run --vus 100 --duration 30s load-test.js

# Expected results:
# - P95 latency < 5s
# - Error rate < 1%
# - Throughput > 50 req/s
```

#### 6.2 Security Audit
- [ ] Penetration testing
- [ ] Dependency audit (`npm audit`)
- [ ] Secrets scan (`git-secrets`)
- [ ] OWASP Top 10 check

#### 6.3 Cost Optimization
```typescript
// Implement caching
const embeddingCache = new Map<string, number[]>();

async function getCachedEmbedding(text: string) {
  const hash = crypto.createHash('sha256').update(text).digest('hex');

  // Check cache
  let embedding = await redis.get(`embedding:${hash}`);
  if (embedding) {
    return JSON.parse(embedding);
  }

  // Generate and cache
  embedding = await generateEmbedding(text);
  await redis.setex(`embedding:${hash}`, 604800, JSON.stringify(embedding));

  return embedding;
}
```

#### 6.4 Documentation
- [ ] API documentation (OpenAPI)
- [ ] Architecture diagrams
- [ ] Runbook complete
- [ ] Onboarding guide

**Deliverables**:
- [ ] Load tests passing
- [ ] Security audit complete
- [ ] Cost per run < $2
- [ ] All docs finalized

---

## Rollout Strategy

### Blue-Green Deployment

```bash
# 1. Deploy new version (green) alongside old (blue)
kubectl apply -f k8s/green/

# 2. Route 10% traffic to green
kubectl patch service nomosx-api --patch '{"spec":{"selector":{"version":"green"}}}'

# 3. Monitor metrics for 1 hour
# - Error rate
# - Latency
# - Trust scores

# 4. If stable, route 50% traffic
# (Canary deployment)

# 5. If still stable, route 100% traffic
kubectl patch service nomosx-api --patch '{"spec":{"selector":{"version":"green"}}}'

# 6. Decommission blue
kubectl delete -f k8s/blue/
```

### Rollback Plan

```bash
# If issues detected, immediate rollback
kubectl patch service nomosx-api --patch '{"spec":{"selector":{"version":"blue"}}}'

# Investigate issues
kubectl logs -l version=green --since=1h > green-logs.txt

# Fix and redeploy
```

---

## Success Criteria

### Technical Metrics
- [ ] Claim extraction accuracy > 90%
- [ ] Evidence binding precision > 85%
- [ ] Trust score correlation with human ratings > 0.8
- [ ] P95 API latency < 5s
- [ ] Uptime > 99.9%
- [ ] Error rate < 1%

### Business Metrics
- [ ] Cost per run < $2
- [ ] Average trust score > 0.7
- [ ] User satisfaction > 4/5
- [ ] Contradiction detection rate > 80%

### Operational Metrics
- [ ] MTTR (Mean Time To Recovery) < 15 min
- [ ] Deploy frequency: 2-3x per week
- [ ] Test coverage > 80%
- [ ] Documentation completeness: 100%

---

## Risk Mitigation

### High-Risk Areas

1. **Data Migration**
   - Risk: Data loss or corruption
   - Mitigation: Full backups, staged rollout, data verification

2. **Cost Overruns**
   - Risk: OpenAI costs exceed budget
   - Mitigation: Caching, rate limiting, feature flags

3. **Performance Degradation**
   - Risk: Slow queries, high latency
   - Mitigation: Load testing, query optimization, caching

4. **Breaking Changes**
   - Risk: API changes break frontend
   - Mitigation: Versioned APIs, backward compatibility, blue-green deployment

---

## Team Structure

**Required Roles**:
- 1x Tech Lead (orchestrate migration)
- 2x Senior Backend Engineers (implement core engine)
- 1x DevOps Engineer (infrastructure, deployment)
- 1x QA Engineer (testing, quality assurance)

**Part-time**:
- 1x Security Engineer (audit, penetration testing)
- 1x Data Engineer (migration, optimization)

---

## Budget Estimate

### Development (10 weeks)
- 3 Senior Engineers × $150/hour × 400 hours = $180,000
- 1 DevOps Engineer × $120/hour × 200 hours = $24,000
- **Total**: $204,000

### Infrastructure (monthly)
- AWS/GCP: $2,000-5,000
- OpenAI API: $5,000-10,000
- Monitoring/Logging: $500
- **Total**: $7,500-15,500/month

### One-time
- Security audit: $10,000
- Load testing: $5,000
- **Total**: $15,000

**Grand Total**: ~$220,000 + $10,000/month operating costs

---

## Timeline Summary

| Week | Phase | Key Deliverables |
|------|-------|------------------|
| 1-2 | Foundation | Infrastructure, DB migration, observability |
| 3-4 | Core Engine | Claim extraction, evidence binding, trust scoring |
| 5-6 | Retrieval | Hybrid search, reranking, embeddings |
| 7-8 | Orchestration | Redis queues, workers, retry logic |
| 9-10 | Quality Loop | Feedback system, learning pipeline, admin dashboard |
| 11-12 | Hardening | Load testing, security audit, cost optimization |

---

**Ready for production? Let's ship it.** 🚀
