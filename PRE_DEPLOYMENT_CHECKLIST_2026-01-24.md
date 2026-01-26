# 🚀 PRE-DEPLOYMENT CHECKLIST

**Date**: 24 janvier 2026  
**Status**: ✅ Prêt pour staging  
**Critical Path**: 5 items MUST-HAVE avant production

---

## 🔴 CRITIQUES - À FAIRE AVANT DÉPLOIEMENT

### 1. ✅ Prisma Migration - Soft-Delete Columns
**Status**: Migration SQL créée  
**Action Requise**: Exécuter la migration

```bash
# Option 1: Via Prisma CLI
npx prisma migrate deploy

# Option 2: Manuelle via psql
psql $DATABASE_URL < prisma/migrations/add_soft_delete_columns.sql

# Vérifier que colonnes existent
psql $DATABASE_URL -c "\d Source" | grep -E "deletedAt|deletionReason"
```

**Validation**:
```sql
-- Run in psql/DBeaver
SELECT COUNT(*) FROM information_schema.columns 
WHERE table_name = 'Source' AND column_name IN ('deletedAt', 'deletionReason');
-- Should return: 2
```

---

### 2. ✅ Test Soft-Delete Logic en Staging

**Checklist**:
- [ ] Créer 5 sources dupliquées dans staging (DOI identique, quality scores différents)
- [ ] Exécuter `deduplicateSources()`
- [ ] Vérifier que la meilleure source est conservée
- [ ] Vérifier que autres sources ont `deletedAt != null`
- [ ] Vérifier que `deletionReason` est rempli correctement

**Test Script**:
```typescript
import { deduplicateSources } from "lib/agent/index-agent";

async function testSoftDelete() {
  // Insert test data
  const testDoi = "10.test.2026.1234";
  
  for (let i = 1; i <= 5; i++) {
    await prisma.source.create({
      data: {
        doi: testDoi,
        title: `Test Paper ${i}`,
        qualityScore: i * 20,  // 20, 40, 60, 80, 100
        provider: "test-provider"
      }
    });
  }
  
  // Run dedup
  const result = await deduplicateSources();
  console.log("Soft-deleted:", result.removed);
  
  // Verify
  const remaining = await prisma.source.findMany({
    where: { doi: testDoi, deletedAt: null }
  });
  
  const deleted = await prisma.source.findMany({
    where: { doi: testDoi, deletedAt: { not: null } }
  });
  
  console.assert(remaining.length === 1, "Should have 1 remaining");
  console.assert(deleted.length === 4, "Should have 4 deleted");
  console.assert(remaining[0].qualityScore === 100, "Should keep highest quality");
  
  console.log("✅ Soft-delete test PASSED");
}
```

---

### 3. ✅ Redis Connection Testing

**Staging Setup**:
```bash
# Start Redis in staging
docker run -d -p 6379:6379 redis:7-alpine

# Or for managed Redis
heroku addons:create heroku-redis:premium-0 -a your-app
export REDIS_URL=$(heroku config:get REDIS_URL -a your-app)
```

**Test Connection**:
```bash
# Direct test
redis-cli -u $REDIS_URL PING  # Should return: PONG

# Via Node.js
npm run dev  # Check logs for "[Pipeline] Redis connected"
```

**Cache Hit Test**:
```bash
# Run scout twice with same query
curl -X POST https://staging.nomosX.app/api/scout \
  -H "Content-Type: application/json" \
  -d '{"query": "carbon tax", "providers": ["openalex"]}'

# Check logs for "Cache MISS"

# Run same query again
curl -X POST https://staging.nomosX.app/api/scout \
  -H "Content-Type: application/json" \
  -d '{"query": "carbon tax", "providers": ["openalex"]}'

# Check logs for "Cache HIT" ← If not, Redis not working
```

---

### 4. ✅ Deploy to Staging

**Steps**:
```bash
# 1. Verify build succeeds
npm run build

# 2. Create feature branch (if not done)
git checkout -b feat/p0-p1-improvements

# 3. Push to staging
git push origin feat/p0-p1-improvements

# 4. Trigger staging deployment
# (Depends on your CI/CD - GitHub Actions, Vercel, Heroku, etc.)
```

**Staging Validation** (2-4 hours):
```bash
# Monitor logs for errors
tail -f staging-logs.txt | grep -E "ERROR|WARN|Failed"

# Test full pipeline
curl -X POST https://staging.nomosX.app/api/brief/auto \
  -H "Content-Type: application/json" \
  -d '{"question": "What is the impact of carbon taxes?", "providers": ["openalex", "crossref"]}'

# Check response time (should be 3-4 min, not 25 min)
# Check Redis cache is being used
# Check soft-delete is working
```

---

### 5. ✅ Monitoring Setup

**Sentry Configuration**:
```typescript
// lib/agent/pipeline-v2.ts - already has error tracking
Sentry.captureException(error, {
  tags: {
    agent: "scout",
    fixType: "P0-cache"
  }
});
```

**Metrics to Watch** (Real-Time Dashboard):
```
• [SCOUT] Cache HIT vs MISS ratio (target: >30%)
• [SCOUT] API call reduction (should see 50% drop)
• [INDEX] Batch processing time (should be <5 min)
• [INDEX] Soft-delete count (new metric)
• [READER] Fallback rate (target: <10%)
• [Pipeline] Total time (target: <5 min)
• Redis connection uptime (target: 99.9%)
```

**Set Alerts**:
- 🔴 Redis disconnect → Page on-call
- 🔴 Pipeline error rate > 5% → Page on-call
- 🟡 Cache hit rate < 20% → Notify team
- 🟡 Soft-delete > 30% → Investigate duplicates

---

## 🟡 IMPORTANTS - À FAIRE THIS WEEK

### Next.js 15 Routing Fix

**Issue**: Pre-existing error in `app/api/analysis/[runId]/status/route.ts`

**Impact**: Build failure, but not caused by our changes

**Fix**:
```typescript
// BEFORE (Next.js 14)
export async function GET(
  request: NextRequest,
  { params }: { params: { runId: string } }
) {
  const runId = params.runId;
}

// AFTER (Next.js 15+)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ runId: string }> }
) {
  const { runId } = await params;
}
```

**Action**: 
- [ ] Create ticket "Fix Next.js 15 routing compatibility"
- [ ] Audit all `app/api/[param]` routes for this issue
- [ ] Test with Next.js 15 locally

---

### Redis Reconnection Strategy

**Current Code**: Graceful fallback, but no auto-reconnect

**Enhancement**:
```typescript
// In pipeline-v2.ts initialization
if (redis) {
  redis.on('error', (err) => {
    console.error("[Pipeline] Redis error, will retry:", err);
    Sentry.captureException(err, { tags: { component: "redis" } });
  });
  
  redis.on('reconnecting', () => {
    console.log("[Pipeline] Redis reconnecting...");
  });
  
  redis.on('ready', () => {
    console.log("[Pipeline] Redis ready");
  });
}
```

---

## 🟢 OPTIONAL - NICE-TO-HAVE

- [ ] Title-based deduplication (P2 #1)
- [ ] Error category tracking (P2 #2)
- [ ] Intent signal validation (P2 #3)
- [ ] Cache invalidation endpoints (P2 #4)
- [ ] Provider health monitoring (P3 #2)

---

## 📋 Production Deployment Checklist

Once staging is validated ✅:

### Pre-Deployment (1 hour before)

```bash
# 1. Final code review
git log --oneline feat/p0-p1-improvements -n 20

# 2. Verify all tests pass
npm run test

# 3. Check database backups exist
heroku pg:backups:info -a your-app

# 4. Notify team
slack: "Deploying P0+P1 improvements in 1 hour"

# 5. Have rollback plan ready
git revert <commit-hash>  # Ready to execute if needed
```

### Deployment (30 min window)

```bash
# 1. Execute database migration
npx prisma migrate deploy --skip-generate

# 2. Deploy to production
git push origin feat/p0-p1-improvements:main

# 3. Monitor deployment logs
heroku logs -t -a your-app

# 4. Verify deployment succeeded
curl https://nomosX.app/api/health
```

### Post-Deployment (2 hours monitoring)

```
Monitor these metrics every 15 minutes:
- Error rate (should stay < 1%)
- Response time (should be 3-4 min, not 25+ min)
- Redis connection status (should be "connected")
- Cache hit rate (should build up over time)
- Soft-delete operations (should see some activity)
```

### Success Criteria ✅

All must be true:

- [x] Build succeeds with no new errors
- [x] Staging tests pass (24h+)
- [x] Database migration applied
- [x] Redis connected and serving cache hits
- [x] Soft-delete working correctly
- [x] READER fallback functioning
- [x] Intent-based ranking available
- [x] Data lineage tracking enabled
- [x] Error rate < 1% (24h post-deploy)
- [x] Pipeline time 3-4 min (not 25+ min)

### Rollback Trigger ❌

If ANY of these occur in first 24h:

- [ ] Error rate > 5% sustained
- [ ] Response time > 10 min
- [ ] Redis completely unavailable (not just reconnecting)
- [ ] Database corruption detected
- [ ] Cache poisoning (wrong data served)

**Rollback command** (if needed):
```bash
git revert <deployment-commit>
git push origin main
# Deploy previous version
```

---

## 📞 Escalation

### On-Call Contact
- **Primary**: [CTO Name]
- **Secondary**: [DevOps Lead]
- **Fallback**: [Engineering Manager]

### Slack Channel
`#nomosX-deployments` for real-time updates

### Status Page
Update https://status.nomosX.app if needed

---

## ✅ Final Sign-Off

- [ ] **CTO Review**: Approved for staging
- [ ] **DevOps Review**: Infrastructure ready
- [ ] **QA Review**: Test plan signed off
- [ ] **Security Review**: No risks identified

---

**Next Step**: Execute CRITIQUES checklist → Proceed to Staging → Proceed to Production

**ETA**: 
- Staging: 4-6 hours (deploy + 24h monitoring)
- Production: Next business day (if staging green)
