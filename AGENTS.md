# NomosX Agents

**Complete specification of the agentic pipeline**

---

## 🧠 Agent Philosophy

Each agent in NomosX has:
- **Single responsibility**: One clear task
- **Deterministic behavior**: Same inputs → same outputs (within LLM variance)
- **Traceable outputs**: All decisions logged
- **Fail-safe**: Graceful degradation on errors

Agents communicate via:
- Database (Prisma ORM)
- Job queue (priority-based)
- JSON payloads (structured data)

---

## 📋 Agent Catalog

### 1. SCOUT Agent

**File**: `lib/agent/pipeline-v2.ts:scout()`

**Purpose**: Collect raw research from academic APIs

**Inputs**:
- `query: string` — Search query
- `providers: string[]` — Which sources to query
- `perProvider: number` — Results per source

**Process**:
1. Query providers in parallel (Promise.allSettled)
2. Normalize responses to common schema
3. Compute quality score
4. Enrich with Unpaywall (if DOI present)
5. Upsert to `Source` table

**Outputs**:
- `found: number` — Total results
- `upserted: number` — Saved to DB
- `sourceIds: string[]` — Created/updated IDs

**Determinism**: ⚠️ Semi-deterministic (external API variance)

**Error Handling**:
- Provider failures are logged but don't stop pipeline
- Empty results are allowed (returns empty arrays)

**Example**:
```typescript
const result = await scout("carbon tax", ["openalex", "crossref"], 20);
// { found: 35, upserted: 33, sourceIds: ["openalex:W123...", ...] }
```

---

### 2. INDEX Agent

**File**: `lib/agent/index-agent.ts:indexAgent()`

**Purpose**: Normalize sources, enrich identities (ROR/ORCID), deduplicate

**Inputs**:
- `sourceIds: string[]` — Sources to enrich

**Process**:
1. For each source:
   a. Extract authors from raw data
   b. Search/create `Author` records
   c. Enrich with ORCID if available
   d. Extract institutions from raw data
   e. Search/create `Institution` records
   f. Enrich with ROR API (by name or ID)
   g. Create `SourceAuthor` / `SourceInstitution` links
2. Compute novelty score
3. Update `Source.noveltyScore`

**Outputs**:
- `enriched: number` — Successfully processed
- `errors: string[]` — Failed sources

**Determinism**: ⚠️ Semi-deterministic (ROR/ORCID lookups may vary)

**Error Handling**:
- Individual source failures logged
- Continue processing remaining sources

**Deduplication** (`deduplicateSources()`):
- Groups sources by DOI
- Keeps earliest (by createdAt), deletes rest
- Returns `{ removed: number }`

**Example**:
```typescript
const result = await indexAgent(["openalex:W123", "crossref:10.1234"]);
// { enriched: 2, errors: [] }
```

---

### 3. RANK Agent V3

**File**: `lib/agent/pipeline-v2.ts:rank()`

**Purpose**: Select top sources with relevance/date filtering and diversity controls

**Inputs**:
- `query: string` — Search query (used for relevance scoring)
- `limitOrOptions: number | RankOptions` — Limit or full options object
- `mode: "quality" | "novelty" | "balanced"` — Ranking criteria

**RankOptions Interface**:
```typescript
interface RankOptions {
  limit?: number;                  // Max sources (default: 12)
  mode?: "quality" | "novelty" | "balanced";
  // Date filtering
  minYear?: number;                // Minimum publication year
  maxYear?: number;                // Maximum publication year
  recentOnly?: boolean;            // Only last 3 years
  // Relevance filtering
  minQuality?: number;             // Quality score threshold (default: 70)
  excludeProviders?: string[];     // Providers to exclude
  includeProviders?: string[];     // Providers to include only
  // Content filtering
  requireAbstract?: boolean;       // Must have abstract
  minAbstractLength?: number;      // Minimum abstract length
  // Diversity controls
  maxPerProvider?: number;         // Max sources per provider (default: 4)
  maxPerYear?: number;             // Max sources per year (default: 3)
  minProviderDiversity?: number;   // Min different providers (default: 3)
}
```

**Process**:
1. Build dynamic WHERE clause from options
2. Query `Source` table with filters
3. Calculate composite score (quality + novelty + recency)
4. Calculate relevance score (keyword matching)
5. Apply diversity constraints
6. Return top N diverse sources

**Outputs**:
- `Source[]` — Ranked sources with relations, compositeScore, relevanceScore

**Determinism**: ✅ Fully deterministic

**Error Handling**:
- Empty results → relax constraints automatically
- Database errors bubble up

**Examples**:
```typescript
// Simple usage (backward compatible)
const top = await rank("carbon tax", 12, "quality");

// Advanced usage with filtering
const filtered = await rank("AI regulation", {
  limit: 20,
  mode: "balanced",
  recentOnly: true,           // Only 2023-2026
  minQuality: 75,
  requireAbstract: true,
  minAbstractLength: 300,
  excludeProviders: ["cia-foia", "nara"],  // No archive sources
  maxPerProvider: 5
});
```

---

### 4. READER Agent

**File**: `lib/agent/reader-agent.ts:readerAgent()`

**Purpose**: Extract key claims, methods, results, limitations from abstracts

**Inputs**:
- `sources: Source[]` — Sources to read

**Process**:
1. For each source:
   a. Extract title + abstract (max 2000 chars)
   b. Prompt GPT-4 Turbo to extract:
      - Claims (max 3)
      - Methods (max 3)
      - Results (max 3)
      - Limitations (max 2)
      - Confidence (high/medium/low)
   c. Parse JSON response

**Outputs**:
- `ReadingResult[]`:
  ```typescript
  {
    sourceId: string,
    claims: string[],
    methods: string[],
    results: string[],
    limitations: string[],
    confidence: "high" | "medium" | "low"
  }
  ```

**Determinism**: ⚠️ Semi-deterministic (LLM variance, temp=0.1)

**Error Handling**:
- Missing/insufficient abstracts → low confidence
- LLM failures → empty arrays + error in limitations

**Example**:
```typescript
const readings = await readerAgent(sources);
// [{ sourceId: "...", claims: ["Carbon tax reduces emissions by 10-15%"], ... }]
```

---

### 5. ANALYST Agent

**File**: `lib/agent/analyst-agent.ts:analystAgent()`

**Purpose**: Synthesize research into decision-ready analysis

**Inputs**:
- `question: string` — Research question
- `sources: Source[]` — Top sources
- `readings?: ReadingResult[]` — Optional READER output

**Process**:
1. Build rich context from sources + readings
2. Prompt GPT-4 Turbo to produce:
   - Title
   - Executive summary
   - Consensus (what researchers agree on)
   - Disagreements (conflicts in evidence)
   - Debate:
     - Pro arguments
     - Con arguments
     - Synthesis
   - Evidence quality assessment
   - Strategic implications
   - Risks & limitations
   - Open questions
   - What would change our mind
3. Enforce [SRC-*] citation tags
4. Parse JSON response

**Outputs**:
- `AnalysisOutput`:
  ```typescript
  {
    title: string,
    summary: string,
    consensus: string,
    disagreements: string,
    debate: { pro, con, synthesis },
    evidence: string,
    implications: string,
    risks: string,
    open_questions: string,
    what_changes_mind: string
  }
  ```

**Determinism**: ⚠️ Semi-deterministic (LLM variance, temp=0.2)

**Error Handling**:
- LLM failures → return error structure
- Missing fields → empty strings

**Example**:
```typescript
const analysis = await analystAgent("What is the impact of carbon taxes?", sources, readings);
// { title: "Carbon Tax Impact: Mixed Evidence...", summary: "Research shows 10-20% emission reductions [SRC-1][SRC-3]...", ... }
```

---

### 5b. STRATEGIC ANALYST Agent (NEW)

**File**: `lib/agent/strategic-analyst-agent.ts:strategicAnalystAgent()`

**Purpose**: Produce comprehensive 10-15 page Strategic Reports with deep analysis

**Inputs**:
- `question: string` — Research question
- `sources: Source[]` — Top sources (typically 20-25 for strategic reports)
- `readings?: ReadingResult[]` — Optional READER output
- `options?: { focusAreas?, targetAudience?, urgencyContext? }`

**Process**:
1. Build comprehensive context from sources + readings
2. Prompt GPT-4 with extended prompt (16K tokens output)
3. Generate structured analysis with 10 sections:
   - Executive Summary + Key Findings
   - Literature Review (overview, frameworks, methodologies)
   - Thematic Analysis (themes, consensus, controversies, trends)
   - Debate (position 1, position 2, synthesis, nuances)
   - Evidence Quality Assessment
   - Stakeholder Impact Matrix
   - Scenario Planning (3-5 scenarios with probabilities)
   - Recommendations (immediate, short-term, long-term, risk mitigation)
   - Implementation Roadmap
   - Conclusion + Open Questions

**Outputs**:
- `StrategicAnalysisOutput`:
  ```typescript
  {
    title: string,
    executiveSummary: string,        // 500+ words
    keyFindings: string[],           // 5 key findings
    urgencyLevel: "critical" | "high" | "medium" | "low",
    confidenceLevel: "high" | "medium" | "low",
    literatureOverview: string,      // 800+ words
    theoreticalFrameworks: string,
    methodologicalApproaches: string,
    keyStudies: Array<{ citation, contribution, limitations }>,
    themes: Array<{ name, description, evidence, sources }>,
    consensus: string,
    controversies: string,
    emergingTrends: string,
    debate: {
      position1: { label, arguments, evidence, proponents },
      position2: { label, arguments, evidence, proponents },
      synthesis: string,
      nuances: string
    },
    evidenceQuality: {
      overallScore: number,          // 1-10
      methodology, sampleSizes, replication, biases, gaps
    },
    stakeholderAnalysis: Array<{ stakeholder, impact, magnitude, details }>,
    scenarios: Array<{ name, probability, description, implications, signals }>,
    recommendations: { immediate[], shortTerm[], longTerm[], riskMitigation[] },
    implementation: { prerequisites[], timeline, resources, metrics[], obstacles[] },
    conclusion: string,
    openQuestions: string[],
    whatChangesMind: string
  }
  ```

**Determinism**: ⚠️ Semi-deterministic (LLM variance, temp=0.2, maxTokens=16000)

**Error Handling**:
- LLM failures → return error structure
- Missing fields → logged as warning, analysis continues

**Example**:
```typescript
const analysis = await strategicAnalystAgent(
  "Impact of AI on scientific research methodology",
  sources,
  readings,
  {
    focusAreas: ["reproducibility", "peer review"],
    targetAudience: "Research institutions",
    urgencyContext: "Rapid AI adoption requires policy guidance"
  }
);
// Returns comprehensive 10-15 page analysis structure
```

---

### 6. CITATION GUARD

**File**: `lib/agent/pipeline-v2.ts:citationGuard()`

**Purpose**: Validate all [SRC-*] citations are valid

**Inputs**:
- `json: any` — ANALYST output
- `sourceCount: number` — Number of available sources

**Process**:
1. Stringify JSON
2. Extract all [SRC-N] patterns via regex
3. Check:
   - At least 1 citation present
   - All N values are 1 ≤ N ≤ sourceCount
4. Return validation result

**Outputs**:
- `{ ok: boolean, usedCount: number, invalid: number[] }`

**Determinism**: ✅ Fully deterministic

**Error Handling**:
- If !ok, caller should retry ANALYST with stronger prompt

**Example**:
```typescript
const guard = citationGuard(analysis, 12);
// { ok: true, usedCount: 8, invalid: [] }
```

---

### 7. EDITOR Agent

**File**: `lib/agent/pipeline-v2.ts:renderBriefHTML()`

**Purpose**: Render analysis into premium HTML brief

**Inputs**:
- `out: AnalysisOutput` — ANALYST output
- `sources: Source[]` — Source list for citations

**Process**:
1. Escape HTML entities
2. Render sections (summary, consensus, debate, etc.)
3. Format debate with color coding:
   - Pro: cyan (#5EEAD4)
   - Con: rose (#FB7185)
   - Synthesis: default
4. Render source list with authors, year, provider

**Outputs**:
- `string` — HTML document

**Determinism**: ✅ Fully deterministic

**Error Handling**:
- Missing fields → skip section
- Null values → empty string

**Example**:
```typescript
const html = renderBriefHTML(analysis, sources);
// "<article><h1>Carbon Tax Impact...</h1>..."
```

---

### 8. PUBLISHER Agent

**File**: `scripts/worker-v2.mjs` (job handler)

**Purpose**: Save brief to database, optionally set publicId

**Inputs**:
- `briefId: string` — Brief to publish

**Process**:
1. Update `Brief.publicId = briefId` (or generate unique ID)
2. Mark as published

**Outputs**:
- None (side effect: DB update)

**Determinism**: ✅ Fully deterministic

**Error Handling**:
- Database errors bubble up

---

### 9. DIGEST Agent

**File**: `lib/agent/digest-agent.ts:generateDigest()`

**Purpose**: Create weekly summary for topic subscriptions

**Inputs**:
- `topicId: string` — Topic to summarize
- `period: string` — e.g., "2026-W03"
- `limit: number` — Max sources (default 10)

**Process**:
1. Fetch topic
2. Find sources created in last 7 days matching topic query/tags
3. Rank by quality + novelty
4. Prompt GPT-4 Turbo to create digest:
   - Highlight 3-5 most significant sources
   - "Why it matters" for each
   - Signals section (emerging trends)
   - <500 words, email-safe HTML
5. Save to `Digest` table

**Outputs**:
- `string` — Digest ID

**Determinism**: ⚠️ Semi-deterministic (LLM variance, temp=0.3)

**Error Handling**:
- No new sources → return "No new research" message
- LLM failures bubble up

**Example**:
```typescript
const digestId = await createDigest({ topicId: "...", period: "2026-W03" });
```

---

### 10. RADAR Agent

**File**: `lib/agent/radar-agent.ts:generateRadarCards()`

**Purpose**: Identify weak signals and emerging trends

**Inputs**:
- `limit: number` — Max radar cards (default 5)

**Process**:
1. Fetch recent high-novelty sources (noveltyScore ≥ 60)
2. Prompt GPT-4 Turbo to identify signals:
   - Signal title
   - What we're seeing
   - Why it matters
   - Supporting sources [SRC-*]
   - Confidence (high/medium/low)
3. Parse JSON array

**Outputs**:
- `RadarCard[]`:
  ```typescript
  {
    title: string,
    signal: string,
    why_it_matters: string,
    sources: string[],
    confidence: "high" | "medium" | "low"
  }
  ```

**Determinism**: ⚠️ Semi-deterministic (LLM variance, temp=0.4)

**Error Handling**:
- No novel sources → return []
- LLM failures → return []

**Example**:
```typescript
const cards = await generateRadarCards(5);
// [{ title: "AI-driven carbon accounting", signal: "Emerging research shows...", ... }]
```

---

## 🔄 Agent Orchestration

### Report Formats

| Format | Pages | Audience | Sources | Time |
|--------|-------|----------|---------|------|
| Brief | 2-3 | C-level | 12 | 5-10 min |
| Strategic Report | 10-15 | Analysts | 20-25 | 30-45 min |
| Research Dossier | 30-50 | Researchers | 50+ | 2-3 hours |

### Sequential Flow (BRIEF)

```typescript
async function runFullPipeline(query: string, providers: string[]) {
  // 1. SCOUT
  const { sourceIds } = await scout(query, providers, 20);
  
  // 2. INDEX
  await index(sourceIds);
  
  // 3. DEDUPE
  await deduplicateSources();
  
  // 4. RANK
  const topSources = await rank(query, 12, "quality");
  
  // 5. READER
  const readings = await read(topSources);
  
  // 6. ANALYST
  const analysis = await analyst(query, topSources, readings);
  
  // 7. GUARD
  const guard = citationGuard(analysis, topSources.length);
  if (!guard.ok) throw new Error("Citation guard failed");
  
  // 8. EDITOR
  const html = renderBriefHTML(analysis, topSources);
  
  // 9. PUBLISHER
  const brief = await prisma.brief.create({ data: { question: query, html, sources: topSources.map(s => s.id) } });
  
  return { briefId: brief.id };
}
```

### Sequential Flow (STRATEGIC REPORT) — NEW

```typescript
async function runStrategicPipeline(query: string, options: StrategicPipelineOptions) {
  // 1. SCOUT (more sources)
  const { sourceIds } = await scout(query, providers, 30);
  
  // 2. INDEX
  await index(sourceIds);
  
  // 3. DEDUPE
  await deduplicateSources();
  
  // 4. RANK V3 (enhanced filtering)
  const topSources = await rank(query, {
    limit: 25,
    recentOnly: true,
    requireAbstract: true,
    minAbstractLength: 200,
    minQuality: 65,
    maxPerProvider: 6,
    minProviderDiversity: 4
  });
  
  // 5. READER
  const readings = await read(topSources);
  
  // 6. STRATEGIC ANALYST (16K tokens output)
  const analysis = await strategicAnalystAgent(query, topSources, readings, {
    focusAreas: options.focusAreas,
    targetAudience: options.targetAudience,
    urgencyContext: options.urgencyContext
  });
  
  // 7. GUARD
  const guard = citationGuard(analysis, topSources.length);
  
  // 8. STRATEGIC EDITOR (10-section HTML)
  const html = renderStrategicReportHTML(analysis, topSources);
  
  // 9. PUBLISHER
  const brief = await prisma.brief.create({ 
    data: { kind: "strategic", question: query, html, sources: topSources.map(s => s.id) }
  });
  
  return { briefId: brief.id, format: "strategic" };
}
```

### Universal Pipeline Runner

```typescript
// Choose format at runtime
const result = await runPipeline(query, "strategic", {
  providers: ["openalex", "semanticscholar", "crossref"],
  focusAreas: ["methodology", "policy"],
  targetAudience: "Policy makers"
});
```

### Job-Based Flow (Asynchronous)

```
User creates IngestionRun
  → SCOUT job (priority 10)
    → INDEX job (priority 8)
      → RANK job (priority 7)
        → READER job (priority 6)
          → ANALYST job (priority 5)
            → [retry if citation guard fails]
            → EDITOR job (priority 4)
              → PUBLISHER job (priority 3)
```

---

## 🎯 Determinism Rules

| Agent | Determinism | Variance Source |
|-------|-------------|-----------------|
| SCOUT | Semi | External API changes |
| INDEX | Semi | ROR/ORCID lookup variance |
| RANK | Full | — |
| READER | Semi | LLM (temp=0.1) |
| ANALYST | Semi | LLM (temp=0.2) |
| GUARD | Full | — |
| EDITOR | Full | — |
| PUBLISHER | Full | — |
| DIGEST | Semi | LLM (temp=0.3) |
| RADAR | Semi | LLM (temp=0.4) |

**Strategies for reproducibility**:
1. **Low temperature**: READER (0.1), ANALYST (0.2)
2. **Structured output**: JSON mode for all LLM calls
3. **Version pinning**: Specify OpenAI model (gpt-4-turbo-preview)
4. **Retries**: Citation guard enforces consistency
5. **Audit logs**: All job payloads + responses stored

---

## 🚨 Error Scenarios

### Provider Down
- **SCOUT** logs error, continues with other providers
- Pipeline proceeds with partial results

### ROR/ORCID Lookup Fails
- **INDEX** logs error, continues without enrichment
- Sources still usable, just less metadata

### LLM Timeout/Failure
- **READER/ANALYST** retries up to 3 times
- If max retries hit, job fails with error
- User can re-run manually

### Citation Guard Fails
- **ANALYST** retries with stronger prompt (append "CRITICAL: Include [SRC-*] citations")
- Max 3 attempts
- If still fails, job marked FAILED

### Database Constraint Violation
- Unique constraint (e.g., duplicate DOI): upsert logic handles
- Foreign key constraint: indicates logic bug, job fails

---

## 📊 Agent Metrics

### Performance
```sql
-- Average agent runtime
SELECT type, AVG(EXTRACT(EPOCH FROM (finishedAt - startedAt))) as avg_seconds
FROM "Job" WHERE status='DONE' AND type IN ('SCOUT', 'INDEX', 'RANK', 'READER', 'ANALYST', 'EDITOR')
GROUP BY type;
```

### Success Rate
```sql
-- Failure rate by agent
SELECT type, 
  COUNT(*) FILTER (WHERE status='FAILED') * 100.0 / COUNT(*) as failure_rate
FROM "Job" GROUP BY type;
```

### Citation Quality
```sql
-- Briefs with low citation counts (potential quality issue)
SELECT id, question, LENGTH(html) - LENGTH(REPLACE(html, '[SRC-', '')) / 5 as citation_count
FROM "Brief"
WHERE LENGTH(html) - LENGTH(REPLACE(html, '[SRC-', '')) / 5 < 3
ORDER BY createdAt DESC;
```

---

## 🔧 Agent Configuration

**Environment Variables**:
```bash
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4-turbo-preview  # Agent inference
```

**Pipeline Defaults** (in code):
```typescript
const SCOUT_PER_PROVIDER = 20;
const RANK_LIMIT = 12;
const READER_TEMP = 0.1;
const ANALYST_TEMP = 0.2;
const DIGEST_TEMP = 0.3;
const RADAR_TEMP = 0.4;
const MAX_JOB_RETRIES = 3;
```

---

## 🎓 Agent Design Principles

1. **Single Responsibility**: Each agent does one thing well
2. **Composability**: Agents can be used standalone or in pipeline
3. **Idempotency**: Re-running same agent with same inputs is safe
4. **Observability**: All inputs/outputs logged to Job table
5. **Graceful Degradation**: Failures don't cascade (except GUARD)
6. **Human-in-the-Loop**: Failed jobs can be manually re-run or corrected

---

**Agents v1.0** — Production-ready autonomous research system.
