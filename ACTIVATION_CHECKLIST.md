# NomosX V1 — Activation Checklist

**Step-by-step guide to activate your agentic think tank**

---

## ☑️ Phase 1: Environment Setup

- [ ] **Copy environment template**
  ```bash
  # Create .env from ENV.md template
  touch .env
  ```

- [ ] **Set required variables** (edit `.env`):
  - [ ] `DATABASE_URL` — Your PostgreSQL connection string
  - [ ] `OPENAI_API_KEY` — Your OpenAI API key (starts with `sk-`)
  - [ ] `OPENAI_MODEL` — Set to `gpt-4-turbo-preview` or `gpt-4o`

- [ ] **Set recommended variables**:
  - [ ] `UNPAYWALL_EMAIL` — Your email for Unpaywall API
  - [ ] `ADMIN_KEY` — Secret key for admin endpoints (generate strong password)
  - [ ] `NEXT_PUBLIC_APP_URL` — Your app URL (localhost for dev)

- [ ] **Validate environment**
  ```bash
  node -e "require('./lib/env').env"
  ```
  Should output no errors. If errors, fix env vars.

---

## ☑️ Phase 2: Database Setup

- [ ] **Install dependencies**
  ```bash
  npm install
  ```

- [ ] **Generate Prisma client**
  ```bash
  npx prisma generate
  ```

- [ ] **Push schema to database**
  ```bash
  npx prisma db push
  ```
  
  ⚠️ **Important**: This will create/update tables. If you have existing data, review the migration first.

- [ ] **Verify tables created**
  ```bash
  npx prisma studio
  ```
  Open browser, check these tables exist:
  - Source, Author, Institution
  - SourceAuthor, SourceInstitution
  - Topic, Brief, Digest
  - MacroSeries, MacroPoint
  - Job, IngestionRun
  - AlertSubscription

---

## ☑️ Phase 3: Local Testing

- [ ] **Start development server**
  ```bash
  npm run dev
  ```
  Should start on `http://localhost:3000`

- [ ] **Verify UI loads**
  - [ ] Open `http://localhost:3000` — Should see Radar page (empty)
  - [ ] Click "Search" — Should see search page
  - [ ] Click "Brief" — Should see brief creation page
  - [ ] Click "Settings" — Should see settings page

- [ ] **Create test topic** (via Prisma Studio or SQL):
  ```sql
  INSERT INTO "Topic" (id, name, query, tags, "isActive", "createdAt", "updatedAt")
  VALUES (
    'test_topic_1',
    'Test: Carbon Pricing',
    'carbon tax emissions',
    ARRAY['climate', 'policy'],
    true,
    NOW(),
    NOW()
  );
  ```

- [ ] **Test ingestion API**
  ```bash
  curl -X POST http://localhost:3000/api/runs \
    -H "x-admin-key: YOUR_ADMIN_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "query": "carbon tax",
      "providers": ["openalex"]
    }'
  ```
  Should return: `{"success": true, "runId": "..."}`

- [ ] **Check job created**
  ```bash
  npx prisma studio
  ```
  Go to "Job" table, should see SCOUT job with status PENDING

- [ ] **Run worker (in separate terminal)**
  ```bash
  node scripts/worker-v2.mjs
  ```
  Should process jobs and create sources

- [ ] **Verify sources ingested**
  - Refresh Radar page (`http://localhost:3000`)
  - Should see source cards
  - Check Prisma Studio: Source table should have rows

- [ ] **Test search**
  - Go to `http://localhost:3000/search`
  - Enter "carbon" in search box
  - Should see results (lexical search will work even without embeddings)

---

## ☑️ Phase 4: Full Pipeline Test

- [ ] **Generate embeddings** (required for hybrid search):
  ```bash
  node netlify/functions/embed-sources.mjs
  ```
  Wait ~5-10 min for 50 sources at 10 req/s

- [ ] **Test hybrid search**
  - Go to `http://localhost:3000/search`
  - Search for "carbon emissions"
  - Results should be semantically relevant

- [ ] **Generate first brief**
  - Go to `http://localhost:3000/brief`
  - Enter question: "What is the economic impact of carbon taxes?"
  - Click generate (or trigger via API)
  - Worker should create FULL_PIPELINE job
  - Wait ~15 minutes for completion

- [ ] **View brief**
  - Go to `http://localhost:3000/briefs`
  - Click on your brief
  - Should see:
    - Executive summary with [SRC-*] citations
    - Consensus section
    - Disagreements section
    - Debate (pro/con/synthesis)
    - Evidence, implications, risks
    - "What would change our mind" section
    - Source list

- [ ] **Test PDF export**
  - On brief page, click "Export PDF"
  - Should download PDF with formatting

- [ ] **Test public share**
  - On brief page, click "Share"
  - Copy public link
  - Open in incognito window
  - Should see brief (read-only)

---

## ☑️ Phase 5: Netlify Deployment

- [ ] **Push to Git**
  ```bash
  git add .
  git commit -m "NomosX V1 complete"
  git push origin main
  ```

- [ ] **Create Netlify site**
  - Go to Netlify dashboard
  - Click "New site from Git"
  - Connect your repository
  - Settings:
    - Build command: `npm run build`
    - Publish directory: `.next`
    - Node version: 18

- [ ] **Set environment variables** (Netlify dashboard):
  Copy all env vars from your local `.env`

- [ ] **Deploy**
  - Trigger deploy
  - Wait for build (~5 min)
  - Check build logs for errors

- [ ] **Test deployed site**
  - [ ] Visit your Netlify URL
  - [ ] Verify Radar page loads
  - [ ] Test search
  - [ ] View existing briefs

- [ ] **Verify scheduled functions**
  - In Netlify dashboard, go to "Functions"
  - Should see:
    - `daily-ingest` (runs at 2 AM UTC)
    - `weekly-digest` (runs Monday 10 AM UTC)
    - `embed-sources` (runs at 4 AM UTC)
  - Check logs after first scheduled run (next day)

---

## ☑️ Phase 6: Production Operations

- [ ] **Create production topics**
  - Create 3-5 topics for your actual research areas
  - Set `isActive = true` for topics you want auto-ingested

- [ ] **Set up monitoring**
  - Bookmark Prisma Studio URL (or use database UI)
  - Create saved queries:
    - Pending jobs count
    - Failed jobs (last 24h)
    - Recent briefs
    - Sources by provider

- [ ] **Schedule regular checks**
  - Daily: Check failed jobs
  - Weekly: Review brief quality
  - Monthly: Audit source distribution

- [ ] **Configure alerts** (optional)
  - Set up database alerts for:
    - Failed jobs threshold (>10 per day)
    - No ingestions in 48 hours
    - OpenAI rate limit errors

---

## ☑️ Phase 7: First Deliverables

- [ ] **Generate first production brief**
  - Choose your most important research question
  - Ensure at least 50 relevant sources ingested
  - Run FULL_PIPELINE
  - Review output quality

- [ ] **Create first weekly digest**
  - Wait 1 week after topic creation
  - Manually trigger digest job (or wait for Monday)
  - Review digest HTML
  - (V2: Send via email)

- [ ] **Generate radar cards**
  - Ensure at least 20 novel sources (noveltyScore > 60)
  - Call `/api/radar` endpoint (when implemented)
  - Review signals identified

- [ ] **Share with stakeholders**
  - Export PDF brief
  - Generate public share link
  - Collect feedback on:
    - Citation quality
    - Synthesis depth
    - Actionability
    - Debate balance

---

## ☑️ Phase 8: Optimization (Week 2+)

- [ ] **Tune provider mix**
  - Review source distribution by provider
  - Adjust provider selection based on quality
  - Balance between coverage and quality

- [ ] **Optimize embedding coverage**
  - Check: `SELECT COUNT(*) FROM "Source" WHERE embeddings IS NOT NULL`
  - Target: 100% of sources with abstracts
  - Schedule daily embedding runs

- [ ] **Monitor OpenAI usage**
  - Check OpenAI dashboard for token usage
  - Estimate monthly cost
  - Adjust model if needed (gpt-4o-mini for dev)

- [ ] **Review job queue health**
  - Check average processing times
  - Identify bottleneck agents (likely READER/ANALYST)
  - Consider adding more workers if needed

- [ ] **Scale database if needed**
  - Monitor query performance
  - Add indexes if slow queries found
  - Consider read replicas if >100K sources

---

## 🎯 Success Criteria

Your NomosX V1 is fully operational when:

✅ **Autonomous Ingestion**
- Daily ingestion runs automatically
- At least 100 sources per topic per week
- <5% job failure rate

✅ **Quality Outputs**
- Briefs have ≥5 citations per section
- Debate section shows multiple perspectives
- "What changes mind" section is specific
- Stakeholders find briefs actionable

✅ **System Health**
- No FAILED jobs older than 24h
- All active topics have recent sources
- Search returns relevant results
- PDF export works consistently

✅ **User Satisfaction**
- Stakeholders use briefs in decisions
- Weekly digests have >50% open rate (when email enabled)
- Radar signals lead to new research directions

---

## 🚨 Troubleshooting

If you hit issues, refer to:
1. [SETUP.md](./SETUP.md) — Common issues section
2. [ARCHITECTURE.md](./ARCHITECTURE.md) — System internals
3. [AGENTS.md](./AGENTS.md) — Agent specifications

Quick diagnostics:
```sql
-- System health check
SELECT 
  (SELECT COUNT(*) FROM "Source") as sources,
  (SELECT COUNT(*) FROM "Brief") as briefs,
  (SELECT COUNT(*) FROM "Job" WHERE status='PENDING') as pending_jobs,
  (SELECT COUNT(*) FROM "Job" WHERE status='FAILED') as failed_jobs;
```

---

## 📞 Support Checklist

Before asking for help, verify:
- [ ] All env vars set correctly
- [ ] Database schema pushed (`npx prisma db push`)
- [ ] OpenAI API key valid (test with `curl`)
- [ ] Worker running (`node scripts/worker-v2.mjs`)
- [ ] No database connection errors in logs
- [ ] Netlify build succeeded (if deployed)

Provide in support request:
- Environment (local/Netlify)
- Error message (full stack trace)
- Job ID or Brief ID (if relevant)
- Steps to reproduce

---

## 🎉 You're Ready!

Once this checklist is complete, you have a **fully operational agentic think tank**.

NomosX will continuously:
- Scout new research (daily)
- Rank by quality and novelty
- Extract claims and methods
- Synthesize strategic intelligence
- Publish decision-ready briefs
- Distribute via web, PDF, and digests (when email configured)

**Welcome to autonomous research intelligence.** 🚀
