# NomosX Backend Architecture - CTO-Grade

## Principles

1. **Domain-Driven Design**: Organized by business domains, not technical layers
2. **Clean Architecture**: Dependencies point inward (domain → application → infrastructure)
3. **SOLID**: Single responsibility, dependency inversion, interface segregation
4. **Observability-First**: Structured logging, correlation IDs, metrics at every layer
5. **Type Safety**: Strict TypeScript, Zod validation, compile-time guarantees

## Folder Structure

```
backend/
├── src/
│   ├── domain/              # Core business logic (pure, no dependencies)
│   │   ├── claim/
│   │   │   ├── entities/    # Claim, EvidenceSpan, Contradiction
│   │   │   ├── value-objects/ # TrustScore, ClaimType, etc.
│   │   │   ├── repositories/ # Interfaces (no implementation)
│   │   │   └── services/    # Domain logic (claim extraction, trust scoring)
│   │   │
│   │   ├── evidence/
│   │   │   ├── entities/
│   │   │   ├── services/    # Evidence binding, contradiction detection
│   │   │   └── repositories/
│   │   │
│   │   ├── retrieval/
│   │   │   ├── entities/
│   │   │   ├── services/    # Hybrid search, reranking
│   │   │   └── repositories/
│   │   │
│   │   ├── orchestration/
│   │   │   ├── entities/    # AnalysisRun, Job, Step
│   │   │   ├── services/    # Pipeline orchestrator, retry logic
│   │   │   └── repositories/
│   │   │
│   │   └── common/
│   │       ├── errors/      # Domain errors
│   │       └── events/      # Domain events
│   │
│   ├── application/         # Use cases, application services
│   │   ├── usecases/
│   │   │   ├── CreateAnalysisRun.ts
│   │   │   ├── ExtractClaims.ts
│   │   │   ├── BindEvidence.ts
│   │   │   ├── DetectContradictions.ts
│   │   │   ├── ComputeTrustScore.ts
│   │   │   ├── ProcessFeedback.ts
│   │   │   └── HybridRetrieval.ts
│   │   │
│   │   ├── dto/             # Data transfer objects
│   │   └── ports/           # Interfaces for infrastructure
│   │
│   ├── infrastructure/      # External concerns (DB, APIs, queues)
│   │   ├── persistence/
│   │   │   ├── prisma/      # Prisma client, repos implementation
│   │   │   ├── repositories/
│   │   │   └── migrations/
│   │   │
│   │   ├── queue/
│   │   │   ├── redis/       # Redis queue implementation
│   │   │   ├── workers/     # Background workers
│   │   │   └── jobs/        # Job handlers
│   │   │
│   │   ├── ai/
│   │   │   ├── openai/      # OpenAI client, embeddings, LLM calls
│   │   │   ├── cohere/      # Cohere reranking
│   │   │   └── providers/   # Academic APIs (OpenAlex, etc.)
│   │   │
│   │   ├── cache/
│   │   │   └── redis/       # Redis caching layer
│   │   │
│   │   └── observability/
│   │       ├── logging/     # Structured logging (Pino/Winston)
│   │       ├── metrics/     # Prometheus metrics
│   │       └── tracing/     # OpenTelemetry
│   │
│   ├── api/                 # API layer (Next.js API routes or Express)
│   │   ├── routes/
│   │   │   ├── v1/
│   │   │   │   ├── analysis/
│   │   │   │   ├── claims/
│   │   │   │   ├── feedback/
│   │   │   │   ├── retrieval/
│   │   │   │   └── admin/
│   │   │   │
│   │   │   └── v2/          # Future API version
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   ├── rateLimit.ts
│   │   │   ├── correlationId.ts
│   │   │   ├── validation.ts
│   │   │   └── errorHandler.ts
│   │   │
│   │   ├── contracts/       # OpenAPI/Zod schemas
│   │   └── clients/         # Typed API clients for frontend
│   │
│   ├── config/              # Configuration
│   │   ├── database.ts
│   │   ├── queue.ts
│   │   ├── ai.ts
│   │   ├── features.ts      # Feature flags
│   │   └── thresholds.ts    # Trust thresholds, cost limits
│   │
│   └── shared/              # Shared utilities
│       ├── types/
│       ├── utils/
│       └── constants/
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── scripts/
│   ├── migrate.ts           # Run migrations
│   ├── seed.ts              # Seed database
│   ├── worker.ts            # Start background worker
│   └── cron.ts              # Start cron jobs
│
└── docs/
    ├── api/                 # API documentation
    ├── architecture/        # Architecture decision records
    └── runbook/             # Operational guides
```

## Key Modules

### 1. Domain Layer

**Claim Module** (`domain/claim/`):
- `entities/Claim.ts` - Claim entity with business logic
- `entities/EvidenceSpan.ts` - Evidence span entity
- `value-objects/TrustScore.ts` - Trust score computation
- `services/ClaimExtractor.ts` - Extract claims from LLM output
- `services/TrustScorer.ts` - Compute trust scores
- `repositories/IClaimRepository.ts` - Interface only

**Evidence Module** (`domain/evidence/`):
- `services/EvidenceBinder.ts` - Bind evidence spans to claims
- `services/ContradictionDetector.ts` - Detect contradictions
- `services/EvidenceGraphBuilder.ts` - Build evidence relations

**Retrieval Module** (`domain/retrieval/`):
- `services/HybridSearcher.ts` - Semantic + keyword search
- `services/Reranker.ts` - Rerank results by relevance
- `services/QueryExpander.ts` - Expand queries for better retrieval

**Orchestration Module** (`domain/orchestration/`):
- `services/PipelineOrchestrator.ts` - Coordinate analysis pipeline
- `services/RetryManager.ts` - Handle retries and failures
- `services/IdempotencyGuard.ts` - Ensure idempotent operations

### 2. Application Layer

**Use Cases**:
- `CreateAnalysisRun` - Start new analysis
- `ExtractClaims` - Extract claims from analysis
- `BindEvidence` - Link evidence to claims
- `DetectContradictions` - Find contradicting claims
- `ComputeTrustScore` - Calculate trust metrics
- `ProcessFeedback` - Handle user feedback
- `HybridRetrieval` - Execute hybrid search

### 3. Infrastructure Layer

**Persistence**:
- Prisma repositories implementing domain interfaces
- Transaction management
- Query optimization

**Queue**:
- Redis-based job queue (Bull/BullMQ)
- Worker processes
- Dead-letter queue handling

**AI**:
- OpenAI client for LLM calls
- Embedding generation
- Provider abstraction

**Observability**:
- Structured logging with Pino
- Prometheus metrics
- OpenTelemetry tracing

### 4. API Layer

**REST API** (Next.js API routes or Express):
- `/api/v1/analysis` - Create and manage analysis runs
- `/api/v1/claims` - Query claims, provide feedback
- `/api/v1/evidence` - Query evidence spans
- `/api/v1/retrieval` - Test retrieval strategies
- `/api/v1/admin` - Admin endpoints (health, metrics)

**Middleware**:
- Auth: JWT validation
- Rate limiting: Redis-based
- Correlation ID: UUID per request
- Validation: Zod schemas
- Error handling: Consistent error responses

## Data Flow

```
User Request
    ↓
API Layer (auth, validation, correlation ID)
    ↓
Application Layer (use case)
    ↓
Domain Layer (business logic)
    ↓
Infrastructure Layer (DB, queue, AI)
    ↓
Response (with correlation ID, timing, cost)
```

## Async Flow (Background Jobs)

```
API creates AnalysisRun
    ↓
Enqueue SCOUT job → Redis
    ↓
Worker picks up job
    ↓
Execute domain logic
    ↓
Enqueue next job (INDEX)
    ↓
Repeat until pipeline complete
    ↓
Update AnalysisRun status
```

## Error Handling

```
Domain Error (ValidationError, BusinessRuleViolation)
    ↓
Application Layer (map to appropriate HTTP status)
    ↓
API Layer (serialize error, add correlation ID)
    ↓
Client (typed error response)
```

## Observability

Every operation emits:
1. **Logs**: Structured JSON with correlation ID
2. **Metrics**: Counters, histograms, gauges
3. **Traces**: Distributed tracing across services

Example log:
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

## Configuration

All config via environment variables or config files:
- `config/database.ts` - DB connection
- `config/queue.ts` - Queue settings
- `config/ai.ts` - AI models, API keys
- `config/features.ts` - Feature flags
- `config/thresholds.ts` - Trust thresholds, cost limits

## Testing Strategy

1. **Unit Tests**: Domain and application logic (no external dependencies)
2. **Integration Tests**: Infrastructure layer (test doubles for external APIs)
3. **E2E Tests**: Full pipeline with real DB and queue

## Security

1. **Auth**: JWT tokens, role-based access control
2. **Rate Limiting**: Per-user, per-IP
3. **Audit Logging**: All sensitive operations logged
4. **Input Validation**: Zod schemas at API boundary
5. **SQL Injection**: Prisma parameterized queries
6. **Secrets**: Environment variables, never committed

## Cost Control

1. **Quotas**: Per-user limits (runs/day, cost/month)
2. **Cost Tracking**: Every AI call logged with cost
3. **Feature Flags**: Expensive features behind flags
4. **Caching**: Aggressive caching of embeddings, LLM responses
5. **Budgets**: Alert when approaching limits

## Scalability

1. **Horizontal Scaling**: Stateless API, multiple workers
2. **DB Optimization**: Indexes, query optimization, read replicas
3. **Caching**: Redis for hot data
4. **Queue**: Distributed job processing
5. **CDN**: Static assets via CDN

## Deployment

1. **Containerized**: Docker for all services
2. **Orchestration**: Kubernetes or Docker Compose
3. **CI/CD**: GitHub Actions, automated tests
4. **Monitoring**: Prometheus + Grafana
5. **Alerting**: PagerDuty/Opsgenie for critical issues

## Migration Path

From current state to this architecture:

### Phase 1: Foundation (Week 1-2)
- [ ] Apply new Prisma schema
- [ ] Set up Redis queue
- [ ] Implement correlation IDs
- [ ] Add structured logging

### Phase 2: Core Engine (Week 3-4)
- [ ] Implement claim extraction
- [ ] Build evidence binding
- [ ] Add trust scoring
- [ ] Implement contradiction detection

### Phase 3: Retrieval (Week 5-6)
- [ ] Add pgvector support
- [ ] Implement hybrid search
- [ ] Add reranking
- [ ] Optimize query performance

### Phase 4: Quality Loop (Week 7-8)
- [ ] Build feedback system
- [ ] Implement learning pipeline
- [ ] Add admin dashboard
- [ ] Set up monitoring

### Phase 5: Production Hardening (Week 9-10)
- [ ] Load testing
- [ ] Security audit
- [ ] Cost optimization
- [ ] Documentation completion

---

**This is a production-grade architecture designed for 10+ year lifespan.**
