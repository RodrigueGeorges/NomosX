# 🔧 CONFIGURATION ENVIRONNEMENT - GUIDE COMPLET

## ⚠️ IMPORTANT

Le fichier `.env` existe dans `backend/.env` mais est **filtré par sécurité**.

**Pour configurer ton environnement :**

```bash
cd backend

# Le fichier .env existe déjà, tu dois juste éditer les clés API :
# Ouvre backend/.env dans ton éditeur et ajoute tes clés :
```

---

## 🔑 CLÉS API NÉCESSAIRES

### 1. OpenAI (OBLIGATOIRE)
```bash
OPENAI_API_KEY=sk-proj-...
```

**Comment obtenir :**
1. Va sur https://platform.openai.com/api-keys
2. Crée une nouvelle clé API
3. Copie-la dans `.env`

**Coût estimé :** $1-2 par analyse

---

### 2. Cohere (OPTIONNEL - Pour reranking)
```bash
COHERE_API_KEY=...
```

**Comment obtenir :**
1. Va sur https://dashboard.cohere.com/api-keys
2. Inscris-toi (gratuit)
3. Copie la clé dans `.env`

**Coût :** Gratuit jusqu'à 1000 reqs/mois

---

### 3. Database & Redis (LOCAL)
```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/nomosx
REDIS_URL=redis://localhost:6379
```

**Déjà configuré** si tu utilises `docker-compose up`

---

## ✅ VÉRIFICATION

```bash
# 1. Vérifier que .env existe
ls backend/.env

# 2. Vérifier les connexions
npm run verify

# 3. Tester l'API
npm run dev
```

---

## 🚀 ÉTAPES RAPIDES

### Option 1 : Développement Local (Docker)
```bash
# 1. Démarre l'infrastructure
cd backend
docker-compose up -d

# 2. Édite .env (ajoute ta clé OpenAI)
# Ouvre backend/.env dans VS Code

# 3. Applique la migration
npx prisma migrate dev --name upgrade_to_cto_grade

# 4. Génère le client Prisma
npx prisma generate

# 5. Seed initial
npm run seed

# 6. Vérifie
npm run verify

# 7. Lance l'API
npm run dev

# 8. Lance le worker (nouveau terminal)
npm run worker
```

### Option 2 : Production
```bash
# 1. Configure .env en production avec vraies clés
# 2. docker-compose -f docker-compose.prod.yml up -d
# 3. npx prisma migrate deploy
# 4. npm run start:prod
```

---

## 🔍 VARIABLES IMPORTANTES

### Performance
```bash
QUEUE_CONCURRENCY=5          # Workers parallèles
MAX_TOKENS_PER_RUN=100000    # Budget tokens
MAX_COST_PER_RUN=5.0         # Budget $ par run
```

### Qualité
```bash
MIN_TRUST_SCORE=0.0
HIGH_TRUST_THRESHOLD=0.7
DEFAULT_RETRIEVAL_K=20
```

### Rate Limiting
```bash
USER_MAX_RUNS_PER_DAY=10
USER_MAX_RUNS_PER_MONTH=100
```

---

## ❌ ERREURS COMMUNES

### Erreur: "OpenAI API key not set"
**Solution :** Ajoute `OPENAI_API_KEY=sk-...` dans `.env`

### Erreur: "Cannot connect to database"
**Solution :** Lance `docker-compose up -d` pour démarrer Postgres

### Erreur: "Prisma Client not generated"
**Solution :** Lance `npx prisma generate`

---

## 📞 AIDE

**Documentation complète :** `backend/README.md`  
**Vérification système :** `npm run verify`  
**Tests E2E :** `npm run test:e2e`

---

**Status :** ✅ Fichier `.env` existe (filtré par sécurité)  
**Action requise :** Édite `backend/.env` et ajoute ta clé OpenAI
