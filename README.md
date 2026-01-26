# NomosX

**Le think tank agentique**  
De la recherche académique à l'intelligence stratégique, automatiquement.

---

## 🎯 Vision

NomosX est le **premier think tank personnel autonome** qui orchestre 10 agents IA spécialisés pour transformer la recherche académique (28M+ sources) en insights décisionnels exploitables.

**Pas un outil de recherche** — Un think tank automatisé.

### 🏆 Avantages Uniques

| Ce que vous obtenez | Comment | Concurrent |
|---------------------|---------|------------|
| **4 Perspectives Distinctes** | Analyse économique, technique, éthique, politique + synthèse | ❌ Aucun (STORM = questions, DeepDebater = research) |
| **Decision-Ready en 60s** | De la question au brief structuré (10 sections) | ⚠️ Semantic Scholar, Consensus = research-ready |
| **Radar Signaux Faibles** | Auto-détection tendances émergentes (novelty ≥ 60) | ❌ Aucun concurrent |
| **Intent-First UX** | 1 question → Auto-sélection → Brief | ⚠️ Perplexity (conversational mais général) |
| **Citations Vérifiées** | Citation Guard + [SRC-*] tracées | ✅ Consensus, Scite (mais pas multi-perspectives) |

**Positionnement** : Think Tank Autonome pour Décideurs Stratégiques  
**Cible** : C-level, Consultants, Innovation Directors, Policy Makers

---

## 🏗️ Architecture

### Pipeline agentic

```
SCOUT      → Collecte multi-sources (OpenAlex, CrossRef, Semantic Scholar, Theses.fr)
INDEX      → Enrichissement identités (ROR, ORCID) + déduplication
RANK       → Sélection stratégique (qualité, nouveauté)
READER     → Extraction structurée (claims, méthodes, résultats, limitations)
ANALYST    → Synthèse dialectique (consensus, débat, implications)
GUARD      → Validation citations (zéro hallucination)
EDITOR     → Rendu HTML premium
DIGEST     → Veille hebdomadaire par topic
RADAR      → Détection signaux faibles
COUNCIL    → Débat multi-angles
```

### Stack technique

- **Frontend**: Next.js 16 + React 18 + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes + Prisma ORM
- **Base de données**: PostgreSQL (28M+ sources académiques)
- **IA**: OpenAI GPT-4 Turbo (temp 0.1-0.4 selon agent)
- **Providers**: OpenAlex, CrossRef, PubMed, Semantic Scholar, arXiv, SSRN, CORE
- **Queue**: Redis (optionnel, pour jobs)
- **Email**: Resend / SendGrid / SMTP (pour digests)

---

## ✨ Features Uniques

### 🎯 Brief Multi-Perspectives (Council)

Analyse **4 perspectives distinctes** automatiquement :

```
💰 Économique : ROI, coûts, bénéfices, impacts marchés
⚙️ Technique : Faisabilité, infrastructure, compatibilité
❤️ Éthique : Consentement, biais, justice, implications sociales
🏛️ Politique : Régulation, souveraineté, géopolitique

+ Synthèse intégrée des trade-offs
```

**Unique sur le marché** — Aucun concurrent (Consensus = single view, STORM = questions, DeepDebater = research tool)

---

### 📡 Radar Signaux Faibles

Détection **automatique** des tendances émergentes :

```
✅ Novelty Score ≥ 60 auto-filtré
✅ GPT-4 identifie pertinence stratégique
✅ 3 niveaux confiance (high/medium/low)
✅ Abonnement email digest hebdo
✅ Contenu autonome (lecture directe, pas de génération)
```

**Unique sur le marché** — Aucun concurrent n'a de push proactif signaux faibles

---

### ⚡ Intent-First UX

De la question au brief en **1 clic, 60 secondes** :

```
1. User tape question
2. Smart selection auto (11 domaines détectés)
3. Providers optimaux sélectionnés (ex: Santé → PubMed + OpenAlex)
4. Quantité ajustée par complexité (12-25 sources)
5. Brief 10 sections généré avec citations [SRC-*] vérifiées

→ ZÉRO décision technique requise
```

**Meilleur UX du marché** — Niveau Lovable/Linear

---

### 📊 Decision-Ready Output

Brief structuré en **10 sections** :

```
1. Résumé Exécutif
2. Consensus Scientifique
3. Points de Débat
4. Pour & Contre (argumentaires)
5. Qualité des Preuves
6. Implications Stratégiques    ← UNIQUE
7. Risques & Limitations
8. Questions Ouvertes
9. What Changes Our Mind        ← UNIQUE
10. Sources (12+ avec métadonnées)
```

**Decision-ready** (pas research-ready comme Semantic Scholar/Consensus)

---

### 🔒 Citations Vérifiées

Citation Guard + Traçabilité totale :

```
✅ Chaque claim référence [SRC-1][SRC-3]
✅ Guard vérifie 100% citations valides
✅ Sources avec auteurs, année, provider, qualityScore
✅ Impossible de générer brief sans citations
```

**Zéro hallucination garantie**

---

## 🚀 Installation

### Prérequis

- Node.js 18+
- PostgreSQL 14+
- OpenAI API Key

### 1. Cloner et installer

```bash
git clone <repo>
cd NomosX
npm install
```

### 2. Configuration environnement

Créez un fichier `.env` à la racine :

```bash
# === REQUIRED ===
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/nomosx
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4-turbo-preview

# === ADMIN ===
ADMIN_KEY=your-secret-key

# === EMAIL (optionnel, pour digests) ===
EMAIL_PROVIDER=resend
EMAIL_FROM=nomosx@example.com
RESEND_API_KEY=re_...

# === UNPAYWALL (optionnel, pour enrichir OA) ===
UNPAYWALL_EMAIL=your-email@example.com

# === Next.js ===
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Base de données

```bash
# Générer le client Prisma
npm run prisma:gen

# Créer le schéma
npm run db:push

# (Optionnel) Seeder des données de démo
npm run seed
```

### 4. Lancer l'application

```bash
# Dev server
npm run dev

# Worker (pour jobs asynchrones)
npm run worker
```

Accédez à [http://localhost:3000](http://localhost:3000)

---

## 📁 Structure du projet

```
NomosX/
├── app/                        # Next.js App Router
│   ├── page.tsx               # Landing page
│   ├── dashboard/             # Vue d'ensemble
│   ├── radar/                 # Signaux faibles
│   ├── search/                # Recherche sources
│   ├── brief/                 # Générateur brief
│   ├── briefs/                # Bibliothèque
│   ├── council/               # Débat multi-angles
│   ├── digests/               # Veille hebdomadaire
│   ├── topics/                # Topics publics
│   ├── about/                 # Méthodologie
│   ├── settings/              # Admin (topics, ingestion, monitoring)
│   └── api/                   # API Routes
│       ├── radar/
│       ├── search/
│       ├── briefs/
│       ├── council/
│       ├── digests/
│       ├── topics/
│       ├── stats/
│       └── runs/
├── components/                # React components
│   ├── Shell.tsx              # Layout principal
│   └── ui/                    # Design system
├── lib/                       # Business logic
│   ├── agent/                 # Agents pipeline
│   │   ├── pipeline-v2.ts     # SCOUT, RANK, ANALYST, GUARD, EDITOR
│   │   ├── index-agent.ts     # INDEX (enrichissement)
│   │   ├── reader-agent.ts    # READER (extraction)
│   │   ├── analyst-agent.ts   # ANALYST (synthèse)
│   │   ├── digest-agent.ts    # DIGEST (veille)
│   │   └── radar-agent.ts     # RADAR (signaux faibles)
│   ├── db.ts                  # Prisma client
│   ├── env.ts                 # Validation env vars (Zod)
│   └── email.ts               # Service email
├── prisma/
│   └── schema.prisma          # Schéma DB
├── scripts/
│   ├── worker.mjs             # Job worker
│   └── seed.mjs               # Seeder données démo
└── public/                    # Assets statiques
```

---

## 🎨 Design System

### Palette de couleurs

```css
--bg: #0B0E12          /* Background principal */
--panel: #10151D       /* Panels */
--panel2: #1C2130      /* Panels secondaires */
--border: #232833      /* Bordures */
--text: #EDE9E2        /* Texte principal */
--muted: #8B8F98       /* Texte secondaire */
--accent: #5EEAD4      /* Accent (teal) */
--ai: #4C6EF5          /* IA features (bleu) */
--danger: #FB7185      /* Erreurs (rose) */
--success: #10B981     /* Succès (vert) */
```

### Composants UI

- `Button` : variants (primary, secondary, ghost, ai, success, danger)
- `Card` : variants (default, premium, error)
- `Badge` : variants (default, ai, success, warning, error, premium)
- `Input`, `Textarea`, `Skeleton`, `Modal`

### Animations

- `animate-fade-in` : Fade in simple
- `animate-spring-in` : Entrée avec spring
- `ai-line` : Ligne gradient animée

---

## 🧪 API Routes

### Publiques

- `GET /api/radar?limit=5` → RadarCards
- `GET /api/digests?topicId=...&limit=20` → Liste digests
- `GET /api/topics` → Liste topics
- `GET /api/briefs?limit=30` → Liste briefs
- `POST /api/briefs` → Créer brief
- `POST /api/council/ask` → Débat multi-angles
- `GET /api/search?q=...` → Recherche sources
- `GET /api/stats` → Statistiques système

### Admin (require `x-admin-key` header)

- `POST /api/topics` → Créer topic
- `PATCH /api/topics/:id` → Modifier topic
- `DELETE /api/topics/:id` → Supprimer topic
- `POST /api/runs` → Créer ingestion run
- `POST /api/digests/send` → Envoyer digest par email

---

## 🔐 Sécurité

### Authentification

Actuellement : **Accès ouvert** (pas d'auth requise pour utiliser l'app).

Pour ajouter de l'authentification :
- **Recommandé** : NextAuth.js ou Clerk
- Protéger `/settings` avec middleware
- Limiter rate-limiting sur API publiques

### Admin

Les routes admin nécessitent un header `x-admin-key` :

```bash
curl -X POST http://localhost:3000/api/topics \
  -H "x-admin-key: your-secret-key" \
  -H "Content-Type: application/json" \
  -d '{"name":"Climate Policy","query":"carbon tax","tags":["climate","policy"]}'
```

### CORS

Par défaut, les API Routes Next.js sont same-origin. Pour exposer une API publique, configurer CORS dans chaque route.

---

## 📊 Base de données

### Modèles principaux

```
Source          → Publications académiques
Author          → Chercheurs (avec ORCID)
Institution     → Institutions (avec ROR)
Topic           → Domaines de veille
Brief           → Synthèses générées
Digest          → Veille hebdomadaire
Job             → Queue jobs asynchrones
IngestionRun    → Historique ingestions
```

### Migrations

```bash
# Créer migration
npx prisma migrate dev --name description

# Appliquer en prod
npx prisma migrate deploy

# Studio (GUI)
npx prisma studio
```

---

## 🤖 Agents

### Configuration

Chaque agent a des paramètres configurables :

```typescript
// lib/agent/pipeline-v2.ts
const SCOUT_PER_PROVIDER = 20;    // Sources par provider
const RANK_LIMIT = 12;            // Top sources pour analyse
const READER_TEMP = 0.1;          // Température GPT-4
const ANALYST_TEMP = 0.2;
const DIGEST_TEMP = 0.3;
const RADAR_TEMP = 0.4;
```

### Déterminisme

| Agent    | Déterminisme | Variance                     |
|----------|--------------|------------------------------|
| SCOUT    | Semi         | APIs externes                |
| INDEX    | Semi         | Lookups ROR/ORCID            |
| RANK     | Full         | —                            |
| READER   | Semi         | LLM (temp=0.1)               |
| ANALYST  | Semi         | LLM (temp=0.2)               |
| GUARD    | Full         | —                            |
| EDITOR   | Full         | —                            |
| DIGEST   | Semi         | LLM (temp=0.3)               |
| RADAR    | Semi         | LLM (temp=0.4)               |
| COUNCIL  | Semi         | LLM                          |

### Retry & Error Handling

- **GUARD** force retry ANALYST si citations invalides (max 3 attempts)
- **Jobs** : 3 retries avec backoff exponentiel
- **Providers SCOUT** : fail-safe (continue avec autres sources)

---

## 🚨 Monitoring

### Dashboard `/settings`

- **Vue d'ensemble** : sources, briefs, topics, digests
- **Jobs** : pending, failed
- **Sources** : coverage embeddings, répartition providers

### Logs

```bash
# Logs application
npm run dev

# Logs worker
npm run worker

# Logs Prisma
DATABASE_URL=... npx prisma studio
```

### Métriques recommandées

```sql
-- Performance agents
SELECT type, AVG(EXTRACT(EPOCH FROM (finishedAt - startedAt))) as avg_seconds
FROM "Job" WHERE status='DONE'
GROUP BY type;

-- Taux d'échec
SELECT type, 
  COUNT(*) FILTER (WHERE status='FAILED') * 100.0 / COUNT(*) as failure_rate
FROM "Job" GROUP BY type;

-- Qualité citations
SELECT id, question, 
  LENGTH(html) - LENGTH(REPLACE(html, '[SRC-', '')) / 5 as citation_count
FROM "Brief"
WHERE LENGTH(html) - LENGTH(REPLACE(html, '[SRC-', '')) / 5 < 3;
```

---

## 📖 Documentation complète

### Pages clés

- `/about` → Architecture des 10 agents, sources de données, limites/biais
- `/dashboard` → Vue d'ensemble activité récente
- `/settings` → Admin (topics, ingestion, monitoring)
- `AGENTS.md` → Spécification complète du pipeline agentic

### Ressources externes

- [OpenAlex API](https://docs.openalex.org/)
- [CrossRef API](https://www.crossref.org/documentation/retrieve-metadata/rest-api/)
- [Semantic Scholar API](https://api.semanticscholar.org/)
- [ROR API](https://ror.readme.io/docs/rest-api)
- [ORCID API](https://info.orcid.org/documentation/)
- [Prisma Docs](https://www.prisma.io/docs/)

---

## 🐛 Troubleshooting

### La base de données ne se connecte pas

```bash
# Vérifier la connexion
psql $DATABASE_URL

# Réinitialiser le schéma
npm run db:push
```

### Les agents ne répondent pas

1. Vérifier `OPENAI_API_KEY` dans `.env`
2. Vérifier les quotas OpenAI
3. Regarder les logs : erreurs 429 (rate limit) ou 500

### Le worker ne traite pas les jobs

```bash
# Vérifier jobs pending
psql $DATABASE_URL -c 'SELECT * FROM "Job" WHERE status='"'"'PENDING'"'"';'

# Relancer worker
npm run worker
```

### Pas de résultats de recherche

1. Lancer une ingestion : `/settings` → Ingestion → Créer run
2. Lancer le worker : `npm run worker`
3. Attendre fin traitement (SCOUT → INDEX)

---

## 🚢 Déploiement

### Vercel (recommandé)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Variables d'environnement
vercel env add DATABASE_URL
vercel env add OPENAI_API_KEY
# ... etc
```

### Railway / Render

1. Connecter repo GitHub
2. Configurer variables d'environnement
3. Build command : `npm run build`
4. Start command : `npm start`

### Worker séparé

Le worker doit tourner en process séparé :

```bash
# Sur serveur dédié ou service worker
npm run worker

# Ou via PM2
pm2 start npm --name "nomosx-worker" -- run worker
```

---

## 🎓 Crédits

### Sources de données

- **OpenAlex** : Index ouvert 250M+ publications
- **CrossRef** : 70M+ DOIs
- **Semantic Scholar** : 200M+ papers
- **Theses.fr** : Thèses doctorales françaises
- **ROR** : Registry of Research Organizations
- **ORCID** : Open Researcher and Contributor ID

### Technologies

Built with ❤️ using:
- Next.js, React, TypeScript, Tailwind CSS
- Prisma, PostgreSQL
- OpenAI GPT-4 Turbo
- Resend (email)

---

## 📄 Licence

Propriétaire © 2026 NomosX

---

## 🤝 Contact

Questions, feedback, partenariats : **contact@nomosx.ai**

---

**NomosX v1.0 — Intelligence stratégique autonome**
