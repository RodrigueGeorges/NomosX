# Comment Fonctionnent les Agents NomosX ?

**Guide complet pour comprendre le système**

---

## 🎯 Sélection de Domaines : État Actuel

### Système de Topics

**Actuellement**, l'utilisateur sélectionne ses domaines via le **système de Topics** :

1. **Page Settings** (`/settings`)
   - L'utilisateur crée des "Topics" (sujets de veille)
   - Chaque Topic a :
     - **Nom** : ex. "Carbon Pricing", "AI in Medicine", "Quantum Computing"
     - **Query** : Mots-clés de recherche (ex. "carbon tax emissions trading")
     - **Tags** : Catégories (ex. "climate, policy, economics")
     - **Description** : Détails optionnels

2. **Exemples de Topics**
   ```
   Topic: "Taxe Carbone en Europe"
   Query: "carbon tax european union emissions"
   Tags: ["économie", "écologie", "politique"]
   
   Topic: "IA en Médecine"
   Query: "artificial intelligence medical diagnosis treatment"
   Tags: ["médecine", "technologie", "IA"]
   
   Topic: "Physique Quantique Appliquée"
   Query: "quantum computing applications cryptography"
   Tags: ["science", "physique", "technologie"]
   ```

3. **Recherche par Topic**
   - Les agents SCOUT cherchent sur les providers académiques avec les mots-clés du Topic
   - Les résultats sont automatiquement tagués avec les tags du Topic
   - Les briefs générés sont associés au Topic

### Ce Qui Manque Actuellement

❌ **Pas de sélecteur de domaine visuel** (économie, science, écologie, médecine)
❌ **Pas de filtrage par domaine** dans la page Search
❌ **Pas de catégories prédéfinies** (l'utilisateur doit créer manuellement les topics)

---

## 🤖 Comment Fonctionnent les Agents ?

### Vue d'Ensemble

NomosX utilise **10 agents autonomes** qui travaillent en pipeline pour transformer la recherche académique en intelligence stratégique.

```
Query de l'utilisateur
    ↓
[SCOUT] → Collecte sources
    ↓
[INDEX] → Enrichit identités
    ↓
[RANK] → Sélectionne top sources
    ↓
[READER] → Extrait insights
    ↓
[ANALYST] → Synthétise
    ↓
[CITATION GUARD] → Valide
    ↓
[EDITOR] → Formate HTML
    ↓
[PUBLISHER] → Publie
```

---

### 1. SCOUT Agent 🔍

**Rôle** : Collecter les sources académiques

**Comment ça marche** :
1. Reçoit une query (ex. "carbon tax impact")
2. Interroge **9 providers** en parallèle :
   - **OpenAlex** : 28M+ papers scientifiques
   - **Crossref** : 150M+ publications avec DOI
   - **Semantic Scholar** : 200M+ papers IA-indexés
   - **theses.fr** : Thèses françaises
   - **Unpaywall** : Open access metadata
   - **Eurostat** : Données macro-économiques
   - **ECB** : Données Banque Centrale Européenne
   - **INSEE** : Données économiques françaises
   - **ROR + ORCID** : Identités institutions/auteurs

3. Pour chaque résultat :
   - Normalise le format
   - Calcule **Quality Score** (0-100)
     - Citation count pondéré
     - Année de publication (bonus récent)
     - Présence de DOI
     - Journal impact factor (si disponible)
   - Extrait metadata :
     - Titre, abstract, auteurs
     - Année, DOI, URL
     - Topics, JEL codes (économie)
   - Enrich avec Unpaywall si DOI présent (PDF open access)

4. Upsert dans la base de données (table `Source`)

**Exemple d'output** :
```json
{
  "found": 35,
  "upserted": 33,
  "sourceIds": ["openalex:W123...", "crossref:10.1234/..."]
}
```

---

### 2. INDEX Agent 📊

**Rôle** : Enrichir les sources avec identités vérifiées

**Comment ça marche** :
1. Reçoit une liste de `sourceIds`
2. Pour chaque source :
   
   **A. Traiter les auteurs** :
   - Extrait les noms d'auteurs depuis la source
   - Cherche dans la DB si auteur existe déjà (par nom)
   - Si ORCID disponible dans source :
     - Appelle API ORCID pour récupérer profil complet
     - Enrichit : h-index, citation count, affiliations
   - Crée/update record `Author`
   - Crée lien `SourceAuthor` (many-to-many)
   
   **B. Traiter les institutions** :
   - Extrait les affiliations depuis la source
   - Cherche dans la DB si institution existe
   - Si nom d'institution :
     - Appelle API ROR (Research Organization Registry)
     - Match par nom ou ROR ID
     - Enrichit : pays, type (university, research org, company)
   - Crée/update record `Institution`
   - Crée lien `SourceInstitution`
   
   **C. Calculer Novelty Score** :
   - Analyse la combinaison de topics
   - Compare avec sources existantes
   - Score 0-100 (100 = très novateur)
   - Update `Source.noveltyScore`

**Exemple d'output** :
```json
{
  "enriched": 33,
  "errors": []
}
```

**Effet** : Les sources sont maintenant liées à des auteurs et institutions vérifiées, avec scores de qualité et nouveauté.

---

### 3. RANK Agent 🏆

**Rôle** : Sélectionner les meilleures sources

**Comment ça marche** :
1. Reçoit :
   - `query` : Query originale
   - `limit` : Nombre max de sources (ex. 12)
   - `mode` : "quality" ou "novelty"

2. Query la base de données :
   ```sql
   SELECT * FROM Source
   WHERE topics LIKE '%carbon%' OR abstract LIKE '%carbon%'
   ORDER BY qualityScore DESC (ou noveltyScore DESC)
   LIMIT 12
   INCLUDE authors, institutions
   ```

3. Retourne les top N sources avec toutes leurs relations

**Exemple d'output** :
```json
[
  {
    "id": "openalex:W123",
    "title": "Carbon Tax Impact on EU Emissions",
    "year": 2024,
    "qualityScore": 92,
    "noveltyScore": 78,
    "authors": [
      { "name": "Dr. Jane Smith", "orcid": "0000-0001-2345-6789" }
    ],
    "institutions": [
      { "name": "MIT", "country": "US" }
    ]
  }
]
```

---

### 4. READER Agent 📖

**Rôle** : Extraire les insights clés de chaque source

**Comment ça marche** :
1. Reçoit la liste des top sources
2. Pour chaque source :
   - Extrait titre + abstract (max 2000 chars)
   - Envoie à **GPT-4 Turbo** avec prompt structuré :
     ```
     Extract from this abstract:
     1. Main claims (max 3)
     2. Methods used (max 3)
     3. Key results (max 3)
     4. Limitations (max 2)
     5. Confidence (high/medium/low)
     ```
   - Temperature: 0.1 (très déterministe)
   - Format: JSON structuré

3. Parse la réponse JSON

**Exemple d'output** :
```json
[
  {
    "sourceId": "openalex:W123",
    "claims": [
      "Carbon tax reduces emissions by 10-15% in first 5 years",
      "Effect varies significantly by sector",
      "Revenue recycling policy matters"
    ],
    "methods": [
      "Difference-in-differences econometric analysis",
      "Panel data from 42 countries (2010-2024)",
      "Robustness checks with synthetic controls"
    ],
    "results": [
      "Average emission reduction: 12.3% (CI: 9.8-14.7%)",
      "Manufacturing sector: -18%, Transport: -8%",
      "No evidence of carbon leakage"
    ],
    "limitations": [
      "Observational data, not RCT",
      "Short-term effects only (5 years)"
    ],
    "confidence": "high"
  }
]
```

---

### 5. ANALYST Agent 🧠

**Rôle** : Synthétiser tout en intelligence stratégique

**Comment ça marche** :
1. Reçoit :
   - `question` : Question de recherche de l'utilisateur
   - `sources` : Top sources (avec metadata)
   - `readings` : Output du READER

2. Construit un prompt massif pour GPT-4 Turbo :
   ```
   You are a strategic research analyst for decision-makers.
   
   Question: [question]
   
   Sources:
   [SRC-1] Title, Authors, Year, Abstract, Claims, Methods, Results
   [SRC-2] ...
   [SRC-12] ...
   
   Produce a strategic analysis with:
   1. Executive Summary
   2. Consensus (what researchers agree on)
   3. Disagreements (conflicts in evidence)
   4. Debate:
      - Pro arguments
      - Con arguments
      - Synthesis
   5. Evidence Quality Assessment
   6. Strategic Implications
   7. Risks & Limitations
   8. Open Questions
   9. What Would Change Our Mind
   
   CRITICAL: Cite every claim with [SRC-N] tags.
   ```

3. Temperature: 0.2 (créatif mais stable)
4. Parse la réponse JSON structurée

**Exemple d'output** :
```json
{
  "title": "Carbon Tax Impact: Mixed Evidence with Strong Sectoral Variations",
  "summary": "Research consistently shows 10-20% emission reductions [SRC-1][SRC-3], but effects vary significantly by sector [SRC-2]. Revenue recycling policy design is critical [SRC-5].",
  "consensus": "Carbon taxes reduce emissions, with strongest evidence for reductions between 10-20% over 5 years [SRC-1][SRC-3][SRC-7]...",
  "disagreements": "Researchers disagree on carbon leakage effects. [SRC-4] finds significant leakage to non-taxed jurisdictions, while [SRC-9] finds no evidence...",
  "debate": {
    "pro": "Carbon taxes create price signals that drive innovation [SRC-2]...",
    "con": "Regressive effects on low-income households [SRC-6]...",
    "synthesis": "Evidence suggests carbon taxes work when paired with redistribution..."
  },
  "evidence": "High quality: 8/12 studies use robust econometric methods [SRC-1][SRC-3][SRC-7]...",
  "implications": "Policy-makers should consider sector-specific adjustments [SRC-2]...",
  "risks": "Political backlash risk if not paired with visible benefits [SRC-8]...",
  "open_questions": "Optimal tax rate remains debated...",
  "what_changes_mind": "RCT evidence from large-scale carbon tax experiment..."
}
```

---

### 6. CITATION GUARD Agent ✅

**Rôle** : Valider que toutes les citations sont correctes

**Comment ça marche** :
1. Reçoit l'output JSON de l'ANALYST
2. Extrait tous les `[SRC-N]` avec regex
3. Vérifie :
   - Au moins 1 citation présente
   - Tous les N sont entre 1 et nombre de sources
   - Pas de `[SRC-13]` si seulement 12 sources
4. Retourne `{ ok: boolean, usedCount: number, invalid: number[] }`

**Si échec** :
- Le worker retry l'ANALYST avec prompt renforcé
- Max 3 tentatives
- Si toujours échec → job FAILED

---

### 7. EDITOR Agent 🎨

**Rôle** : Transformer le JSON en HTML premium

**Comment ça marche** :
1. Reçoit :
   - `analysis` : Output de l'ANALYST
   - `sources` : Liste des sources pour références

2. Génère HTML avec :
   - Escape HTML entities (sécurité)
   - Structure sémantique (`<article>`, `<section>`, `<h2>`)
   - Styling inline (pour emails)
   - Débat coloré :
     - Pro : cyan (#5EEAD4)
     - Con : rose (#FB7185)
     - Synthesis : default
   - Liste des sources citées :
     - Numérotation [1], [2], [3]
     - Titre, auteurs, année
     - Lien vers source (DOI ou URL)
     - Provider badge

**Exemple d'output** :
```html
<article style="color: #EDE9E2; background: #0B0E12;">
  <h1>Carbon Tax Impact: Mixed Evidence</h1>
  <section>
    <h2>Executive Summary</h2>
    <p>Research consistently shows 10-20% emission reductions 
       <sup><a href="#src-1">[1]</a></sup>
       <sup><a href="#src-3">[3]</a></sup>...
    </p>
  </section>
  
  <section class="debate">
    <h2>Debate</h2>
    <div class="pro" style="border-left: 3px solid #5EEAD4;">
      <h3>Pro Arguments</h3>
      <p>Carbon taxes create price signals...</p>
    </div>
    <div class="con" style="border-left: 3px solid #FB7185;">
      <h3>Con Arguments</h3>
      <p>Regressive effects on low-income...</p>
    </div>
  </section>
  
  <section class="sources">
    <h2>Sources</h2>
    <ol>
      <li id="src-1">
        <strong>Carbon Tax Impact on EU Emissions</strong><br>
        Smith, J. et al. (2024) · OpenAlex · QS 92
        <a href="https://doi.org/10.1234/abc">View Source</a>
      </li>
    </ol>
  </section>
</article>
```

---

### 8. PUBLISHER Agent 📤

**Rôle** : Publier le brief dans la base de données

**Comment ça marche** :
1. Reçoit `briefId`
2. Met à jour le record `Brief` :
   - `publicId = briefId` (ou génère ID unique)
   - `updatedAt = now()`
3. Le brief devient accessible à `/s/[publicId]`

**Effet** : Le brief est maintenant partageable publiquement.

---

### 9. DIGEST Agent 📬

**Rôle** : Créer des résumés hebdomadaires pour les Topics suivis

**Comment ça marche** :
1. Scheduled function (Monday 10 AM UTC)
2. Pour chaque Topic actif :
   - Cherche sources créées dans les 7 derniers jours
   - Filtre par query + tags du Topic
   - Rank par qualité + novelty
   - Prend top 10 sources
   
3. Envoie à GPT-4 Turbo :
   ```
   Create a weekly digest for topic: [topic name]
   
   New research this week:
   [List of 10 sources with titles, authors, abstracts]
   
   Generate:
   1. Subject line (email-ready)
   2. Highlight 3-5 most significant sources
   3. For each: "Why it matters"
   4. Signals section (emerging trends)
   
   Format: Email-safe HTML, <500 words
   ```

4. Sauvegarde dans `Digest` table
5. Envoie email aux `AlertSubscription` du Topic

**Exemple d'output** :
```html
<h1>Carbon Pricing — Weekly Digest</h1>
<p>3 nouveaux papers majeurs cette semaine</p>

<h2>🔥 Top Highlights</h2>
<ol>
  <li>
    <strong>New EU Carbon Border Tax Study</strong><br>
    Why it matters: First empirical evidence of effectiveness...
  </li>
</ol>

<h2>📡 Weak Signals</h2>
<p>Emerging trend: AI-driven carbon accounting...</p>
```

---

### 10. RADAR Agent 📡

**Rôle** : Détecter les signaux faibles et tendances émergentes

**Comment ça marche** :
1. Cherche sources récentes avec **noveltyScore ≥ 60**
2. Envoie à GPT-4 Turbo :
   ```
   You are a strategic foresight analyst.
   
   Analyze these high-novelty research papers:
   [List of novel sources]
   
   Identify weak signals (max 5):
   1. Signal title
   2. What we're seeing (evidence)
   3. Why it matters (implications)
   4. Supporting sources [SRC-*]
   5. Confidence (high/medium/low)
   ```

3. Temperature: 0.4 (plus créatif)
4. Parse JSON array de RadarCard

**Exemple d'output** :
```json
[
  {
    "title": "AI-Driven Carbon Accounting Emergence",
    "signal": "3 independent papers in last month propose ML models for real-time carbon tracking [SRC-2][SRC-5][SRC-8]",
    "why_it_matters": "Could enable dynamic carbon pricing and automated compliance, disrupting traditional auditing",
    "sources": ["SRC-2", "SRC-5", "SRC-8"],
    "confidence": "medium"
  }
]
```

---

## 🔄 Orchestration du Pipeline

### Mode Séquentiel (Full Pipeline)

```typescript
async function runFullPipeline(query: string) {
  // 1. SCOUT
  const { sourceIds } = await scout(query, ["openalex", "crossref"], 20);
  
  // 2. INDEX
  await index(sourceIds);
  
  // 3. DEDUPE (bonus)
  await deduplicateSources();
  
  // 4. RANK
  const topSources = await rank(query, 12, "quality");
  
  // 5. READER
  const readings = await read(topSources);
  
  // 6. ANALYST
  const analysis = await analyst(query, topSources, readings);
  
  // 7. CITATION GUARD
  const guard = citationGuard(analysis, topSources.length);
  if (!guard.ok) throw new Error("Citations invalides");
  
  // 8. EDITOR
  const html = renderBriefHTML(analysis, topSources);
  
  // 9. PUBLISHER
  const brief = await prisma.brief.create({
    data: { question: query, html, sources: topSources.map(s => s.id) }
  });
  
  return { briefId: brief.id };
}
```

### Mode Asynchrone (Job Queue)

```
User crée IngestionRun
    ↓
Job SCOUT (priority 10) → DB
    ↓
Worker poll job queue
    ↓
Traite SCOUT → Crée job INDEX
    ↓
Worker traite INDEX → Crée job RANK
    ↓
...pipeline continue automatiquement
```

**Avantages** :
- Résilient (retry automatique si échec)
- Scalable (multiple workers en parallèle)
- Traçable (tous les jobs loggés dans DB)

---

## 📊 Déterminisme des Agents

| Agent | Déterminisme | Source de Variance |
|-------|--------------|-------------------|
| SCOUT | Semi | APIs externes (nouveaux papers publiés) |
| INDEX | Semi | ROR/ORCID lookups peuvent changer |
| RANK | Full | Requête SQL déterministe |
| READER | Semi | LLM (temp=0.1, variance minimale) |
| ANALYST | Semi | LLM (temp=0.2, variance contrôlée) |
| GUARD | Full | Regex déterministe |
| EDITOR | Full | Template HTML fixe |
| PUBLISHER | Full | Upsert DB |
| DIGEST | Semi | LLM (temp=0.3) |
| RADAR | Semi | LLM (temp=0.4, plus créatif) |

---

## 🎯 Résumé : Pipeline Complet

**Input** : "Quel est l'impact des taxes carbone ?"

**SCOUT** : Collecte 35 papers depuis OpenAlex, Crossref, etc.

**INDEX** : Enrichit avec 87 auteurs, 42 institutions (ROR/ORCID)

**RANK** : Sélectionne top 12 sources (Quality Score > 75)

**READER** : Extrait claims/methods/results de chaque paper

**ANALYST** : Synthétise en analyse stratégique 2000 mots avec citations

**CITATION GUARD** : Valide 18 citations [SRC-1] à [SRC-12]

**EDITOR** : Transforme en HTML premium avec styling

**PUBLISHER** : Publie à `/s/abc123`

**Output** : Brief décisionnel prêt à lire 🎉

---

## 💡 Forces du Système

✅ **Autonome** : Pipeline complet sans intervention humaine
✅ **Traçable** : Chaque claim a sa source [SRC-N]
✅ **Robuste** : Retry logic, error handling
✅ **Scalable** : Job queue, multiple workers
✅ **Académique** : Sources vérifiées (DOI, ORCID, ROR)
✅ **Multi-sources** : 9 providers couvrant toutes les disciplines
✅ **Intelligent** : GPT-4 Turbo pour synthèse

---

## 🔧 Configuration

Tous les agents sont configurables via `lib/agent/pipeline-v2.ts` :

```typescript
const SCOUT_PER_PROVIDER = 20;  // Sources par provider
const RANK_LIMIT = 12;          // Top sources pour analyse
const READER_TEMP = 0.1;        // Température LLM (déterminisme)
const ANALYST_TEMP = 0.2;       // Température LLM
const MAX_JOB_RETRIES = 3;      // Tentatives max avant FAILED
```

---

**NomosX Agents v1.0** — Think tank autonome alimenté par l'IA 🚀
