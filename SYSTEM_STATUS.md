# 🏛️ NomosX - Autonomous Think Tank System

**Status: ✅ PRODUCTION-READY**  
**Last validated: 2026-01-29**

---

## 🎯 System Overview

NomosX est un **think tank autonome** qui:
1. **Veille en continu** sur les sources institutionnelles mondiales
2. **Détecte les signaux** (nouvelles publications, tendances émergentes)
3. **Analyse et synthétise** via des agents IA spécialisés
4. **Publie des briefs** de qualité institutionnelle

---

## 📊 Test Results (2026-01-29)

### Monitoring Cycle Test
```
✅ Duration:           18.9s
✅ Providers checked:   5
✅ Sources found:       20
✅ New sources:         16
✅ Upserted to DB:      16
✅ Errors:              0
```

### Provider Status

| Category | Provider | Status | Sources |
|----------|----------|--------|---------|
| **Stable** | World Bank | ✅ Working | 5 |
| **Stable** | CISA | ✅ Working | 5 |
| **V2 API** | UK Archives | ⚠️ Intermittent | 0-3 |
| **V2 API** | CIA FOIA (Archive.org) | ✅ Working | 5 |
| **V2 API** | NIST (NVD) | ✅ Working | 5 |
| **V2 API** | NARA | ⚠️ Limited | 0 |
| **V2 API** | UN | ❌ 403 (anti-bot) | 0 |
| **V2 API** | IMF | ❌ 403 (anti-bot) | 0 |
| **V2 API** | OECD | ❌ 403 (anti-bot) | 0 |
| **V2 API** | BIS | ❌ 404 | 0 |
| **Google CSE** | ODNI, NATO, ENISA | ⏭️ Requires API key | - |
| **Think Tanks** | 20 sources | ⏭️ Requires API key | - |

### Database Operations
```
✅ Prisma Client: Generated
✅ Source upsert: Working
✅ Job logging: Working
✅ Quality scoring: Working
```

---

## 🚀 Quick Start

### 1. Test all providers
```bash
npx tsx scripts/test-all-providers.ts
```

### 2. Run monitoring cycle (one-time)
```bash
npx tsx scripts/test-monitoring-full.ts
```

### 3. Run continuous monitoring
```bash
npm run monitoring
# OR
npx tsx scripts/start-monitoring.mjs --once
```

---

## 🔧 Configuration

### Environment Variables

```env
# Required
DATABASE_URL=postgresql://...

# Optional (enables 20+ additional providers)
GOOGLE_CSE_KEY=your_google_cse_api_key
GOOGLE_CSE_CX=your_custom_search_engine_id

# For AI analysis
OPENAI_API_KEY=sk-...
```

### Monitoring Config

Edit `lib/agent/monitoring-agent.ts`:

```typescript
const DEFAULT_INSTITUTIONAL_MONITORING = {
  providers: ['cisa', 'nist', 'worldbank', 'odni', 'nato', ...],
  queries: ['cybersecurity', 'AI policy', 'climate change', ...],
  interval: 360,        // 6 hours
  limit: 10,            // per query
  minQualityScore: 70,  // filter threshold
  notifyOnNew: true
};
```

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `lib/agent/monitoring-agent.ts` | Core monitoring logic |
| `lib/agent/pipeline-v2.ts` | Full agentic pipeline |
| `lib/providers/institutional/` | All data providers |
| `lib/providers/institutional/presets.ts` | Provider presets |
| `scripts/test-all-providers.ts` | Provider validation |
| `scripts/test-monitoring-full.ts` | Full cycle test |

---

## 🔄 Agentic Pipeline

```
User Query
    ↓
┌─────────────────────────────────────────────────────────┐
│  SCOUT → INDEX → RANK → READER → ANALYST → EDITOR      │
│    ↓        ↓       ↓       ↓         ↓         ↓      │
│  Crawl   Enrich  Select  Extract  Synthesize  Format   │
│  APIs    ROR/    Top N   Claims   Analysis    HTML     │
│          ORCID   Sources Methods  + Debate    Brief    │
└─────────────────────────────────────────────────────────┘
    ↓
Published Brief (with [SRC-*] citations)
```

---

## 📈 Provider Categories

### 1. Stable APIs (Always work)
- World Bank Documents API
- CISA Advisories RSS

### 2. V2 APIs (Direct access)
- NARA (US National Archives)
- UK National Archives
- Archive.org (CIA FOIA collection)
- NIST NVD (CVE database)

### 3. Google CSE (Requires API key)
- Intelligence: ODNI, NSA, CIA
- Defense: NATO, EDA
- Cyber: ENISA, CISA
- Economic: IMF, OECD, BIS, World Bank

### 4. Think Tanks (20 innovative sources)
- AI Governance: GovAI, CSET, AI Now, CAIP
- Policy: Brookings, RAND, CNAS, New America
- Tech: LawZero, Abundance Institute, R Street
- Privacy: CDT, CAIDP, Data & Society

---

## ⚠️ Known Limitations

1. **Anti-bot protection**: UN, IMF, OECD block direct API access
   - Solution: Use Google CSE with API key

2. **Rate limiting**: Some providers limit requests
   - Solution: Built-in delays between requests

3. **API changes**: External APIs may change without notice
   - Solution: Multiple fallback sources per provider

---

## 🎯 Next Steps

1. **Configure Google CSE** to unlock 20+ additional providers
2. **Set up PM2** for production continuous monitoring
3. **Configure notifications** (Slack/email) for new signals
4. **Deploy dashboard** for real-time monitoring

---

## 📞 Support

For issues or questions, check:
- `MONITORING_AGENT.md` - Detailed monitoring docs
- `QUICKSTART_MONITORING.md` - Quick setup guide
- `TOP-20-THINK-TANKS.md` - Think tank sources list
- `AGENTS.md` - Full agent specifications
