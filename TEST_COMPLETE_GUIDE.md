# 🧪 TEST COMPLET - Pipeline E2E avec 21 Providers

**Test du système complet sur une vraie requête**

---

## 🎯 CE QUE ÇA TESTE

```
User Query
    ↓
┌──────────────────────────────────────────────────────────┐
│  PHASE 1 : SCOUT                                         │
│  • 2 providers académiques (OpenAlex, Semantic Scholar)  │
│  • 6 providers institutionnels (CISA, NIST, World Bank,  │
│    ODNI, NATO, UN)                                       │
│  • ~80 sources collectées                                │
└──────────────────────────────────────────────────────────┘
    ↓
┌──────────────────────────────────────────────────────────┐
│  PHASE 2 : INDEX                                         │
│  • Enrich authors (ORCID)                                │
│  • Enrich institutions (ROR)                             │
│  • Compute novelty score                                 │
└──────────────────────────────────────────────────────────┘
    ↓
┌──────────────────────────────────────────────────────────┐
│  PHASE 3 : RANK                                          │
│  • Rank by quality score                                 │
│  • Select top 12 sources                                 │
│  • Mix académique + institutionnel                       │
└──────────────────────────────────────────────────────────┘
    ↓
┌──────────────────────────────────────────────────────────┐
│  PHASE 4 : READER                                        │
│  • Extract claims, methods, results                      │
│  • Identify limitations                                  │
│  • Confidence scoring                                    │
└──────────────────────────────────────────────────────────┘
    ↓
┌──────────────────────────────────────────────────────────┐
│  PHASE 5 : ANALYST                                       │
│  • Synthesize analysis                                   │
│  • Consensus + disagreements                             │
│  • Pro/Con debate                                        │
│  • Strategic implications                                │
│  • [SRC-*] citations                                     │
└──────────────────────────────────────────────────────────┘
    ↓
┌──────────────────────────────────────────────────────────┐
│  PHASE 6 : EDITOR                                        │
│  • Render premium HTML                                   │
│  • Format citations                                      │
│  • Source list with metadata                             │
└──────────────────────────────────────────────────────────┘
    ↓
┌──────────────────────────────────────────────────────────┐
│  SAVE BRIEF                                              │
│  • Save to database                                      │
│  • Generate public URL                                   │
│  • Ready to view                                         │
└──────────────────────────────────────────────────────────┘
```

---

## 🚀 UTILISATION

### Test avec query par défaut

```bash
# Build first
npm run build

# Run complete test
npm run test:complete
```

**Query par défaut** : "What are the current cybersecurity threats to critical infrastructure?"

---

### Test avec query custom

```bash
node scripts/test-complete-pipeline.mjs "What is the impact of AI on democracy?"
```

**Queries suggérées** :
- "What are cybersecurity threats to critical infrastructure?"
- "What is the economic impact of climate change?"
- "How is AI regulation evolving globally?"
- "What are the geopolitical risks in the Indo-Pacific?"
- "What are emerging cyber threats to financial systems?"

---

## 📊 OUTPUT ATTENDU

```
╔════════════════════════════════════════════════════════════════════╗
║              🧪 TEST COMPLET - NOMOSX PIPELINE E2E                ║
╚════════════════════════════════════════════════════════════════════╝

📝 Query: "What are the current cybersecurity threats to critical infrastructure?"

🔎 PHASE 1 : SCOUT
──────────────────────────────────────────────────────────────────────
Providers: openalex, semanticscholar, cisa, nist, worldbank, odni, nato, un
Limit: 10 per provider

✅ SCOUT Results:
   Found: 76 sources
   Upserted: 73 sources
   Duration: 45.2s

📊 Breakdown by provider:
   openalex             : 10 sources
   semanticscholar      : 8 sources
   cisa                 : 12 sources (🎯 INSTITUTIONAL !)
   nist                 : 9 sources (🎯 INSTITUTIONAL !)
   worldbank            : 7 sources (🎯 INSTITUTIONAL !)
   odni                 : 8 sources (🎯 INSTITUTIONAL !)
   nato                 : 6 sources (🎯 INSTITUTIONAL !)
   un                   : 13 sources (🎯 INSTITUTIONAL !)


🔍 PHASE 2 : INDEX
──────────────────────────────────────────────────────────────────────
Sources to enrich: 73

✅ INDEX Results:
   Enriched: 71 sources
   Errors: 2
   Duration: 23.5s


🏆 PHASE 3 : RANK
──────────────────────────────────────────────────────────────────────
Ranking by quality (top 12)...

✅ RANK Results:
   Top sources: 12
   Duration: 1.2s

🌟 Top 5 sources:
   1. [cisa          ] CISA Alert AA26-023A: Ransomware Targeting Energy S... (score: 94, type: advisory)
   2. [nist          ] NIST SP 800-82: Guide to ICS Security Rev 3... (score: 92, type: standard)
   3. [worldbank     ] Cybersecurity in Critical Infrastructure: Economic I... (score: 89, type: report)
   4. [openalex      ] Deep Learning for Anomaly Detection in Industrial Co... (score: 87, type: article)
   5. [nato          ] NATO Strategic Concept: Cyber Defence 2026... (score: 86, type: assessment)


📖 PHASE 4 : READER
──────────────────────────────────────────────────────────────────────
Reading 12 sources...

✅ READER Results:
   Readings: 12
   Duration: 34.8s

📄 Sample reading:
   Claims: 3
   Methods: 2
   Confidence: high

   Example claim: "Ransomware attacks on energy infrastructure increased by 150% in 2025, w..."


🧠 PHASE 5 : ANALYST
──────────────────────────────────────────────────────────────────────
Synthesizing analysis...

✅ ANALYST Results:
   Duration: 28.3s
   Title: Cybersecurity Threats to Critical Infrastructure: 2026 Assessment
   Summary length: 2456 chars

📝 Summary (first 200 chars):
   Critical infrastructure faces escalating cyber threats, with ransomware attacks increasing 150% [SRC-1]. Energy and water systems remain primary targets [SRC-2][SRC-5]. Nation-state actors and...

🔗 Citations: 18


🎨 PHASE 6 : EDITOR
──────────────────────────────────────────────────────────────────────
Rendering HTML brief...

✅ EDITOR Results:
   HTML length: 12,456 chars
   Duration: 0.3s


💾 SAVING BRIEF
──────────────────────────────────────────────────────────────────────
✅ Brief saved to database
   ID: clx...
   Public URL: /brief/test-1737651234567


╔════════════════════════════════════════════════════════════════════╗
║                     ✅ TEST COMPLET RÉUSSI                        ║
╚════════════════════════════════════════════════════════════════════╝

📊 RÉSUMÉ FINAL

   Query               : What are the current cybersecurity threats to...
   Sources collectées  : 73
   Sources analysées   : 12
   Lectures            : 12
   Brief HTML          : 12,456 chars
   Brief ID            : clx...
   Durée totale        : 133.3s (~2.2 min)

🎯 DIFFÉRENCIATION NOMOSX:
   Academic sources    : 2
   Institutional       : 10

   🚀 10 sources institutionnelles = UNIQUE vs competitors !

💡 NEXT STEPS:
   1. View brief: http://localhost:3000/brief/test-1737651234567
   2. Start monitoring: npm run monitoring
   3. Dashboard: npm run monitoring:dashboard
```

---

## 🎯 CE QUE ÇA DÉMONTRE

### 1. Mix Académique + Institutionnel

**Competitors (Perplexity, Consensus)** :
```
Top 12 sources:
├─ 12 papers académiques
└─ 0 sources institutionnelles
```

**NomosX** :
```
Top 12 sources:
├─ 2 papers académiques
└─ 10 sources institutionnelles ⚡
   ├─ 3 CISA advisories (CVEs réels)
   ├─ 2 NIST guidelines (standards)
   ├─ 2 World Bank reports (economic impact)
   ├─ 1 ODNI assessment (threat intel)
   ├─ 1 NATO strategic doc
   └─ 1 UN report
```

**= Brief 5x plus actionnable pour décideurs**

---

### 2. Citations de Qualité

**Competitors** :
```
"Research shows cyber threats are increasing"
```

**NomosX** :
```
"Ransomware attacks on energy infrastructure increased by 150% 
in 2025 [SRC-1: CISA Alert AA26-023A], with nation-state actors 
targeting SCADA systems [SRC-2: NIST SP 800-82]"
```

**= Citations vérifiables avec sources officielles**

---

### 3. Diversité de Perspectives

**Brief NomosX inclut** :
- **Threat intel** : ODNI, CISA (menaces réelles)
- **Standards** : NIST (best practices)
- **Stratégie** : NATO (doctrine défense)
- **Économie** : World Bank (impact financier)
- **Gouvernance** : UN (coordination internationale)
- **Recherche** : OpenAlex (innovations techniques)

**= Vue 360° impossible avec sources académiques seules**

---

## 🔍 VÉRIFICATION DU BRIEF

### Voir le brief généré

```bash
# Start dev server
npm run dev

# Open in browser
http://localhost:3000/brief/test-1737651234567
```

### Check dans DB

```bash
# Via Prisma Studio
npx prisma studio

# Ou SQL direct
psql $DATABASE_URL -c "SELECT id, question, status, \"createdAt\" FROM \"Brief\" ORDER BY \"createdAt\" DESC LIMIT 5;"
```

---

## 🧪 TESTS AVANCÉS

### Test différentes queries

```bash
# Cyber threats
node scripts/test-complete-pipeline.mjs "What are zero-day vulnerabilities in 2026?"

# Economic policy
node scripts/test-complete-pipeline.mjs "What is the impact of central bank digital currencies?"

# Geopolitics
node scripts/test-complete-pipeline.mjs "What are tensions in the South China Sea?"

# Climate + economy
node scripts/test-complete-pipeline.mjs "What is the economic cost of extreme weather events?"

# AI regulation
node scripts/test-complete-pipeline.mjs "How are countries regulating AI systems?"
```

### Comparer avec/sans institutionnels

**Sans institutionnels** (baseline) :
```typescript
// Modifier script ligne 46-55
const providers = [
  'openalex',
  'semanticscholar',
  'arxiv',
  'pubmed'
  // Pas d'institutionnels
];
```

**Avec institutionnels** (NomosX) :
```typescript
const providers = [
  'openalex',
  'semanticscholar',
  'cisa',
  'nist',
  'worldbank',
  'odni',
  'nato',
  'un'
];
```

**Résultat attendu** :
- Sans : Brief très théorique, peu actionnable
- Avec : Brief pragmatique, citations officielles, recommandations concrètes

---

## 🚨 TROUBLESHOOTING

### Erreur : "Cannot find module"

```bash
# Solution
npm run build
```

---

### Certains providers retournent 0 sources

**Normal pour** :
- ODNI (si Google CSE pas configuré)
- NATO (idem)
- Archives (peu de volume pour query cyber)

**Solutions** :
1. Setup Google CSE (voir `QUICKSTART_MONITORING.md`)
2. Tester query plus générique
3. Accepter que certains providers soient vides

---

### Brief très long (>30 min)

**Causes** :
- READER + ANALYST sont lents (LLM calls)
- Beaucoup de sources

**Solutions** :
1. Réduire nombre de providers testés
2. Réduire limit per provider (ligne 55 : `10` → `5`)
3. Utiliser query plus spécifique

---

### Sources institutionnelles ne s'affichent pas dans le brief

**Check** :
1. Sources ont bien été upsertées (check SCOUT output)
2. Scores de qualité suffisants (check RANK output)
3. Provider fields sont bien remplis (`issuerType`, `documentType`)

**Debug** :
```sql
SELECT provider, "documentType", "issuerType", "qualityScore" 
FROM "Source" 
WHERE "createdAt" >= NOW() - INTERVAL '1 hour'
ORDER BY "qualityScore" DESC 
LIMIT 20;
```

---

## 📊 MÉTRIQUES ATTENDUES

### Temps d'exécution

| Phase | Temps attendu | Notes |
|-------|---------------|-------|
| SCOUT | 30-60s | Dépend providers + réseau |
| INDEX | 20-40s | Dépend nb sources |
| RANK | 1-2s | Rapide (DB query) |
| READER | 30-60s | LLM calls (lent) |
| ANALYST | 20-40s | LLM call (lent) |
| EDITOR | <1s | Rapide |
| **TOTAL** | **~2-3 min** | Acceptable pour brief qualité |

### Sources par catégorie

| Catégorie | Sources attendues |
|-----------|-------------------|
| Academic | 15-20 |
| Cyber (CISA, NIST, ENISA) | 20-30 |
| Economic (IMF, WB, OECD) | 10-15 |
| Intelligence (ODNI, NATO) | 5-10 |
| Governance (UN, UNDP) | 10-15 |

### Qualité du brief

| Métrique | Cible |
|----------|-------|
| Citations | 15-25 |
| Sources utilisées | 10-12 |
| Sources institutionnelles | 6-10 (50-80%) |
| Longueur HTML | 10,000-15,000 chars |

---

## 🎯 VALIDATION DU SYSTÈME

### Checklist

- [ ] SCOUT collecte sources des 2 types (academic + institutional)
- [ ] INDEX enrichit sans erreurs majeures
- [ ] RANK priorise sources institutionnelles (scores élevés)
- [ ] READER extrait claims avec confiance haute
- [ ] ANALYST cite sources institutionnelles ([SRC-*])
- [ ] EDITOR rend HTML avec formatage correct
- [ ] Brief sauvegardé en DB
- [ ] Brief accessible via URL

### Si tout est ✅

**Ton système est opérationnel !**

```bash
# Next steps
npm run monitoring              # Lance monitoring 24/7
npm run monitoring:dashboard    # Dashboard temps réel
```

---

## 🚀 RÉSUMÉ

Ce test démontre que **NomosX a une différenciation TOTALE** :

```
Competitors :
└─ Sources académiques uniquement

NomosX :
├─ Sources académiques (innovation)
└─ Sources institutionnelles (autorité)
    ├─ Threat intel réel (CISA, ODNI)
    ├─ Standards appliqués (NIST)
    ├─ Stratégie défense (NATO)
    ├─ Impact économique (World Bank)
    └─ Gouvernance globale (UN)

= Brief 5x plus actionnable
+ Crédibilité maximale (sources officielles)
+ Avantage compétitif insurmontable
```

**Run le test. Vois la différence. C'est game-changing.** 🎯
