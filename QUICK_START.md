# 🚀 Quick Start NomosX

## ✅ Étape 1 : Base de données PostgreSQL

### Option A : Installation locale PostgreSQL

**Windows** :
1. Télécharge PostgreSQL : https://www.postgresql.org/download/windows/
2. Installe avec le mot de passe `postgres`
3. Crée la base de données :
```bash
psql -U postgres
CREATE DATABASE nomosx;
\q
```

### Option B : Docker (Recommandé)

```bash
docker run -d \
  --name nomosx-db \
  -e POSTGRES_DB=nomosx \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:16-alpine
```

### Option C : Supabase (Cloud gratuit)

1. Crée un compte : https://supabase.com
2. Crée un projet
3. Récupère la DATABASE_URL dans Settings > Database

---

## ✅ Étape 2 : Variables d'environnement

Crée un fichier `.env` à la racine du projet :

```bash
# Database (OBLIGATOIRE)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/nomosx

# OpenAI (OBLIGATOIRE pour les agents)
OPENAI_API_KEY=sk-proj-...
OPENAI_MODEL=gpt-4-turbo-preview

# Admin (optionnel, pour /settings)
ADMIN_KEY=mon-secret-admin-123

# Email (optionnel, pour Unpaywall)
UNPAYWALL_EMAIL=ton.email@domain.com

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Où obtenir OPENAI_API_KEY ?**
- https://platform.openai.com/api-keys
- Clique "Create new secret key"

---

## ✅ Étape 3 : Initialiser la base de données

```bash
# Génère le client Prisma
npx prisma generate

# Applique les migrations
npx prisma migrate dev

# (Optionnel) Seed avec des données de test
npx prisma db seed
```

---

## ✅ Étape 4 : Lancer l'application

```bash
npm run dev
```

L'app est disponible sur : http://localhost:3000

---

## 🎯 Premiers pas

### 1. Configure un Topic (Settings)

- Va sur http://localhost:3000/settings
- Onglet "Topics"
- Clique "Nouveau Topic"
- Remplis :
  - Nom : "Carbon Tax Policy"
  - Query : "carbon tax emission reduction"
  - Tags : `["climate", "policy"]`
  - Active : ✅

### 2. Lance une Ingestion

- Onglet "Ingestion" dans Settings
- Sélectionne ton topic
- Choisis les providers (OpenAlex, Crossref...)
- Clique "Lancer l'ingestion"

### 3. Traite avec le Worker

```bash
npm run worker
```

Le worker va :
1. SCOUT : Chercher les sources
2. INDEX : Enrichir avec auteurs/institutions
3. RANK : Classer par qualité
4. READER : Extraire les claims/méthodes
5. ANALYST : Synthétiser
6. EDITOR : Générer le HTML
7. PUBLISHER : Sauvegarder le brief

### 4. Consulte ton Brief

- Va sur http://localhost:3000/briefs
- Clique sur ton brief
- Vois l'analyse complète avec citations

---

## 📊 Pages principales

| URL | Description |
|-----|-------------|
| `/` | Radar - Sources récentes |
| `/search` | Recherche hybride |
| `/brief` | Génération manuelle de brief |
| `/briefs` | Bibliothèque de briefs |
| `/settings` | Topics, Monitoring, Ingestion |
| `/design-showcase` | Composants UI |

---

## 🔧 Scripts disponibles

```bash
npm run dev          # Serveur de développement
npm run build        # Build production
npm run start        # Serveur production
npm run worker       # Traite les jobs
npm run lint         # Lint le code
npm run test         # Tests unitaires
```

---

## 🎓 Documentation

- **AGENTS.md** : Spécification des agents
- **ARCHITECTURE.md** : Architecture système
- **API_DOCUMENTATION.md** : Documentation API
- **ENV.md** : Variables d'environnement
- **TROUBLESHOOTING.md** : Résolution de problèmes

---

## ⚡ Raccourcis clavier (à venir)

- `Ctrl+K` : Quick search
- `Ctrl+N` : Nouveau brief
- `Ctrl+S` : Settings

---

## 🆘 Problèmes courants

### "DATABASE_URL not found"
→ Crée le fichier `.env` avec DATABASE_URL

### "OpenAI API key invalid"
→ Vérifie que OPENAI_API_KEY est valide

### "Port 3000 already in use"
→ `npx kill-port 3000` puis relance

### "Prisma Client not generated"
→ `npx prisma generate`

### "Migration failed"
→ `npx prisma migrate reset` (⚠️ efface les données)

---

## 🎉 Tu es prêt !

L'application est maintenant configurée et opérationnelle.

**Prochaines étapes** :
1. Configure Sentry (monitoring)
2. Configure Resend/SendGrid (emails)
3. Active les digests hebdomadaires
4. Explore le Radar pour détecter les signaux

**Have fun with your Agentic Think Tank!** 🚀
