# NomosX V1 Setup Guide

**Quick start guide for deployment and first run**

---

## 🚀 Initial Setup

### 1. Environment Configuration

Create `.env` file in project root:

```bash
# Required
DATABASE_URL=postgresql://user:password@host:5432/nomosx
OPENAI_API_KEY=sk-proj-...
OPENAI_MODEL=gpt-4-turbo-preview

# Recommended
UNPAYWALL_EMAIL=your@email.com
ADMIN_KEY=your-secret-admin-key-here

# Optional (defaults provided)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Database Migration

```bash
# Generate Prisma client
npm run prisma:gen

# Push schema to database
npm run db:push

# Verify tables created
npx prisma studio
```

Expected tables:
- Source, Author, Institution
- SourceAuthor, SourceInstitution
- Topic, Brief, Digest
- MacroSeries, MacroPoint
- Job, IngestionRun
- AlertSubscription

### 3. Install Dependencies

```bash
npm install
```

Key dependencies:
- `@prisma/client` — Database ORM
- `openai` — AI inference + embeddings
- `zod` — Environment validation
- `next` — Framework
- `@sparticuz/chromium` — PDF export (Netlify-safe)

### 4. Run Development Server

```bash
npm run dev
```

Visit: `http://localhost:3000`

---

## 🏃 First Run

### Option A: Full Pipeline (Recommended)

1. **Create a Topic** (via Prisma Studio or SQL):
   ```sql
   INSERT INTO "Topic" (id, name, query, tags, "isActive")
   VALUES (
     'topic1',
     'Carbon Pricing',
     'carbon tax emissions trading',
     ARRAY['climate', 'policy'],
     true
   );
   ```

2. **Create Full Pipeline Job**:
   ```bash
   curl -X POST http://localhost:3000/api/runs \
     -H "x-admin-key: your-secret-admin-key-here" \
     -H "Content-Type: application/json" \
     -d '{
       "query": "carbon tax impact emissions",
       "providers": ["openalex", "crossref"]
     }'
   ```

3. **Run Worker**:
   ```bash
   node scripts/worker-v2.mjs
   ```

4. **Check Results**:
   - View sources: `http://localhost:3000/`
   - View briefs: `http://localhost:3000/briefs`

### Option B: Step-by-Step Testing

**Test SCOUT**:
```typescript
import { scout } from './lib/agent/pipeline-v2';

const result = await scout("carbon tax", ["openalex"], 10);
console.log(result); // { found: 10, upserted: 10, sourceIds: [...] }
```

**Test INDEX**:
```typescript
import { index } from './lib/agent/pipeline-v2';

const result = await index(sourceIds);
console.log(result); // { enriched: 10, errors: [] }
```

**Test RANK**:
```typescript
import { rank } from './lib/agent/pipeline-v2';

const top = await rank("carbon tax", 5, "quality");
console.log(top); // [{ id, title, qualityScore, ... }]
```

**Test Embeddings**:
```typescript
import { embedSources } from './lib/embeddings';

const result = await embedSources(sourceIds);
console.log(result); // { success: 10, failed: 0 }
```

**Test Hybrid Search**:
```typescript
import { hybridSearch } from './lib/embeddings';

const results = await hybridSearch("carbon tax", { limit: 10 });
console.log(results); // [{ id, title, ... }]
```

---

## 🚢 Netlify Deployment

### 1. Push to Git

```bash
git add .
git commit -m "Initial NomosX V1"
git push origin main
```

### 2. Create Netlify Site

- Go to Netlify dashboard
- Click "New site from Git"
- Connect repository
- Configure:
  - **Build command**: `npm run build`
  - **Publish directory**: `.next`
  - **Functions directory**: `netlify/functions` (auto-detected)

### 3. Set Environment Variables

In Netlify dashboard > Site settings > Environment variables:

```
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4-turbo-preview
UNPAYWALL_EMAIL=your@email.com
ADMIN_KEY=your-secret-admin-key
NEXT_PUBLIC_APP_URL=https://your-site.netlify.app
```

### 4. Enable Scheduled Functions

Scheduled functions are configured in `netlify.toml`:
- `daily-ingest` — 2 AM UTC daily
- `weekly-digest` — Monday 10 AM UTC
- `embed-sources` — 4 AM UTC daily

These run automatically once deployed.

### 5. Deploy

```bash
# Automatic on git push
git push origin main

# Or trigger manual deploy in Netlify dashboard
```

### 6. Verify Deployment

- Check build logs for errors
- Visit your site URL
- Test API: `https://your-site.netlify.app/api/search?q=test`

---

## 🔧 Common Issues

### "Invalid environment variables"

**Cause**: Missing or malformed env vars

**Fix**:
1. Check `.env` file exists
2. Verify `DATABASE_URL` format: `postgresql://user:pass@host:port/db`
3. Verify `OPENAI_API_KEY` starts with `sk-`
4. Run `node -e "require('./lib/env').env"` to test validation

### "Prisma Client not generated"

**Cause**: Prisma client not built

**Fix**:
```bash
npx prisma generate
npm run build
```

### "Worker processes no jobs"

**Cause**: No jobs in queue or wrong status

**Fix**:
1. Check job queue:
   ```sql
   SELECT * FROM "Job" WHERE status='PENDING';
   ```
2. If empty, create a job via `/api/runs`
3. Check for failed jobs:
   ```sql
   SELECT * FROM "Job" WHERE status='FAILED' ORDER BY "updatedAt" DESC LIMIT 5;
   ```

### "Search returns empty results"

**Cause**: No sources ingested or embeddings missing

**Fix**:
1. Check source count:
   ```sql
   SELECT COUNT(*) FROM "Source";
   ```
2. If 0, run ingestion
3. Check embeddings:
   ```sql
   SELECT COUNT(*) FROM "Source" WHERE embeddings IS NOT NULL;
   ```
4. If 0, run:
   ```bash
   node netlify/functions/embed-sources.mjs
   ```

### "OpenAI rate limit errors"

**Cause**: Too many concurrent requests

**Fix**:
1. Reduce `SCOUT_PER_PROVIDER` in `lib/agent/pipeline-v2.ts`
2. Add delays between embedding batches
3. Use `gpt-4o-mini` for testing (cheaper)

### "PDF export fails"

**Cause**: Missing chromium binary

**Fix**:
1. Verify `@sparticuz/chromium` in `package.json`
2. On Netlify, this is automatic
3. Locally, ensure Node 18+ and sufficient memory

---

## 📊 Monitoring

### Check System Health

**Sources Ingested**:
```sql
SELECT COUNT(*), provider FROM "Source" GROUP BY provider;
```

**Jobs Status**:
```sql
SELECT status, COUNT(*) FROM "Job" GROUP BY status;
```

**Recent Briefs**:
```sql
SELECT id, question, "createdAt" FROM "Brief" ORDER BY "createdAt" DESC LIMIT 10;
```

**Failed Jobs (last 24h)**:
```sql
SELECT type, "lastError", "createdAt" 
FROM "Job" 
WHERE status='FAILED' AND "createdAt" > NOW() - INTERVAL '24 hours'
ORDER BY "createdAt" DESC;
```

### Performance Metrics

**Average Agent Runtime**:
```sql
SELECT type, 
  AVG(EXTRACT(EPOCH FROM ("finishedAt" - "startedAt"))) as avg_seconds
FROM "Job" 
WHERE status='DONE' AND "finishedAt" IS NOT NULL
GROUP BY type;
```

**Top Quality Sources**:
```sql
SELECT title, year, "qualityScore", provider 
FROM "Source" 
ORDER BY "qualityScore" DESC 
LIMIT 10;
```

---

## 🎯 Next Steps

1. **Create Topics** for your research areas
2. **Schedule Regular Ingestion** (automatic via Netlify)
3. **Generate First Brief** via `/brief` page
4. **Set up Weekly Digests** (create AlertSubscriptions)
5. **Monitor Job Queue** for failures
6. **Scale Embeddings** as source count grows

---

## 📚 Additional Resources

- [README.md](./README.md) — Full documentation
- [ARCHITECTURE.md](./ARCHITECTURE.md) — System design
- [AGENTS.md](./AGENTS.md) — Agent specifications
- [AUDIT.md](./AUDIT.md) — Implementation audit

---

**Setup v1.0** — You're ready to run an autonomous think tank.
