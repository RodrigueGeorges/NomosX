# 🔍 Guide de Vérification Complète - NomosX Production

## ✅ Checklist Avant Déploiement

### 1. Infrastructure

```bash
# Postgres + pgvector
docker-compose ps postgres
docker-compose exec postgres psql -U nomosx -d nomosx -c "SELECT * FROM pg_extension WHERE extname='vector';"

# Redis
docker-compose ps redis
redis-cli -h localhost -p 6379 ping

# Vérifier les volumes
docker volume ls | grep nomosx
```

**Attendu:**
- ✅ Postgres running et healthy
- ✅ pgvector extension installée
- ✅ Redis responding PONG
- ✅ Volumes créés (postgres_data, redis_data)

---

### 2. Base de Données

```bash
# Exécuter le script de vérification
cd backend
npm run verify

# Ou manuellement
npm run prisma:studio

# Vérifier les tables critiques
docker-compose exec postgres psql -U nomosx -d nomosx -c "
  SELECT table_name FROM information_schema.tables 
  WHERE table_schema='public' 
  ORDER BY table_name;
"
```

**Attendu:**
- ✅ ~30 tables créées
- ✅ Tables critiques présentes: Source, Claim, EvidenceSpan, AnalysisRun, Job, CostLog
- ✅ Indexes créés correctement

---

### 3. API Backend

```bash
# Health check
curl http://localhost:3000/health

# Créer une analyse de test
curl -X POST http://localhost:3000/api/v1/analysis \
  -H "Content-Type: application/json" \
  -d '{
    "question": "Test question for verification",
    "mode": "brief",
    "providers": ["openalex"],
    "maxSources": 5
  }'
```

**Attendu:**
```json
{
  "status": "healthy",
  "timestamp": "2026-01-21T...",
  "version": "2.0.0"
}
```

---

### 4. Workers

```bash
# Vérifier les logs du worker
docker-compose logs worker

# Vérifier les queues Redis
npm run queue:inspect

# Vérifier qu'il n'y a pas de jobs bloqués
redis-cli -h localhost -p 6379 KEYS "*"
```

**Attendu:**
- ✅ Worker démarre sans erreurs
- ✅ Queues initialisées
- ✅ Pas de jobs stuck

---

### 5. Tests E2E

```bash
# Exécuter les tests E2E
npm run test:e2e

# Résultats attendus
# ✅ Health Check
# ✅ Correlation ID
# ✅ Create Analysis
# ✅ Error Handling
```

**Attendu:** Tous les tests passent (4/4)

---

### 6. Expérience Utilisateur Frontend

#### Test 1: Création d'Analyse
1. Ouvrir http://localhost:3000
2. Se connecter (mock auth)
3. Aller sur Dashboard
4. Entrer une question: "Quel est l'impact des taxes carbone ?"
5. Cliquer "Analyser"

**Attendu:**
- ✅ Loading state immédiat
- ✅ Progress bar affichée
- ✅ Messages de progression (Scout, Index, Rank...)
- ✅ Résultats affichés avec trust score
- ✅ Claims affichées avec evidence

#### Test 2: Trust Score
1. Vérifier que le trust score est visible
2. Clic sur une claim
3. Voir l'evidence associée

**Attendu:**
- ✅ Trust score badge coloré (vert/jaune/rouge)
- ✅ Niveau clair (Faible/Moyen/Élevé)
- ✅ Evidence spans affichées
- ✅ Sources citées correctement

#### Test 3: Conversation History
1. Créer plusieurs analyses
2. Vérifier l'historique

**Attendu:**
- ✅ Historique affiché
- ✅ Possibilité de réutiliser/modifier
- ✅ Persistence entre sessions

#### Test 4: Library
1. Aller sur Library
2. Vérifier que les analyses sont sauvegardées
3. Filtrer par type (Brief/Council)
4. Rechercher une analyse

**Attendu:**
- ✅ Toutes les analyses visibles
- ✅ Filtres fonctionnels
- ✅ Recherche rapide
- ✅ Actions (export, delete) disponibles

---

## 📊 Monitoring en Production

### Métriques Clés à Surveiller

#### 1. API Health
```bash
# Toutes les 30s
watch -n 30 'curl -s http://localhost:3000/health | jq'
```

**Alertes si:**
- Status != "healthy"
- Response time > 1s
- 5 échecs consécutifs

#### 2. Queue Length
```bash
# Vérifier backlog
npm run queue:inspect

# Alertes si:
# - waiting > 100 jobs
# - failed > 10 jobs
# - active jobs stuck > 5min
```

#### 3. Database Performance
```sql
-- Slow queries
SELECT * FROM pg_stat_statements 
ORDER BY mean_exec_time DESC 
LIMIT 10;

-- Connection count
SELECT count(*) FROM pg_stat_activity;

-- Cache hit ratio (doit être > 95%)
SELECT 
  sum(heap_blks_hit) / (sum(heap_blks_hit) + sum(heap_blks_read)) as cache_hit_ratio
FROM pg_statio_user_tables;
```

#### 4. Cost Tracking
```sql
-- Cost par jour
SELECT 
  DATE(createdAt) as date,
  SUM(costUsd) as daily_cost,
  COUNT(*) as operations
FROM "CostLog"
WHERE createdAt > NOW() - INTERVAL '7 days'
GROUP BY DATE(createdAt)
ORDER BY date DESC;

-- Top opérations coûteuses
SELECT 
  operation,
  AVG(costUsd) as avg_cost,
  COUNT(*) as count
FROM "CostLog"
WHERE createdAt > NOW() - INTERVAL '24 hours'
GROUP BY operation
ORDER BY avg_cost DESC;
```

**Alertes si:**
- Daily cost > $100
- Single operation cost > $5
- Anomalie détectée (>2x moyenne)

#### 5. Trust Score Distribution
```sql
-- Distribution des trust scores
SELECT 
  CASE 
    WHEN trustScore < 0.4 THEN 'Low'
    WHEN trustScore < 0.7 THEN 'Medium'
    ELSE 'High'
  END as trust_level,
  COUNT(*) as count,
  AVG(evidenceCount) as avg_evidence
FROM "Claim"
WHERE trustScore IS NOT NULL
GROUP BY trust_level;
```

**Objectifs:**
- High: > 60%
- Medium: 20-30%
- Low: < 10%

---

## 🚨 Incidents Communs & Résolutions

### 1. "High queue backlog"

**Symptôme:** Queue waiting > 100 jobs

**Résolution:**
```bash
# Scale workers
docker-compose up -d --scale worker=5

# Vérifier
docker-compose ps worker
```

### 2. "Database slow queries"

**Symptôme:** P95 latency > 5s

**Résolution:**
```sql
-- Identifier les tables sans indexes
SELECT 
  schemaname, tablename, 
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Reconstruire indexes
REINDEX DATABASE nomosx;

-- Vacuum
VACUUM ANALYZE;
```

### 3. "OpenAI rate limit"

**Symptôme:** Jobs failing avec "Rate limit exceeded"

**Résolution:**
```bash
# Réduire concurrency
# Dans docker-compose.yml, ajuster:
# environment:
#   - WORKER_CONCURRENCY=2

# Ou activer caching agressif
# Dans .env:
# ENABLE_AGGRESSIVE_CACHE=true
```

### 4. "Memory leak worker"

**Symptôme:** Worker OOM après quelques heures

**Résolution:**
```bash
# Redémarrer workers périodiquement
# Ajouter dans cron:
0 */6 * * * docker-compose restart worker

# Ou augmenter memory limit
# Dans docker-compose.yml:
# deploy:
#   resources:
#     limits:
#       memory: 8G
```

---

## 📈 Métriques de Succès UX

### Engagement
- **Rétention J1**: > 40%
- **Rétention J7**: > 20%
- **Analyses par utilisateur**: > 5/semaine

### Performance
- **Time to First Result**: < 30s
- **Feedback positif**: > 80%
- **Trust score moyen**: > 0.65

### Qualité
- **Claims avec evidence**: > 95%
- **Contradictions détectées**: 5-10%
- **Evidence strength**: > 0.7

---

## 🎯 Checklist Finale Production

Avant de déclarer le système "Production Ready", vérifier:

### Infrastructure ✅
- [ ] Postgres 15+ avec pgvector
- [ ] Redis 7+ running
- [ ] Docker images built
- [ ] Volumes configurés
- [ ] Backups automatiques

### Backend ✅
- [ ] Health check répond
- [ ] API routes fonctionnelles
- [ ] Workers processing jobs
- [ ] Queues configurées
- [ ] Logs structurés
- [ ] Correlation IDs présents

### Database ✅
- [ ] Schema appliqué (30+ tables)
- [ ] Indexes créés
- [ ] Data migrée
- [ ] Seed data présent
- [ ] Backups testés

### Tests ✅
- [ ] E2E tests pass (4/4)
- [ ] System verification pass
- [ ] Load test (optionnel)

### Frontend ✅
- [ ] API intégration fonctionnelle
- [ ] Trust scores affichés
- [ ] Claims + evidence visibles
- [ ] Conversation history works
- [ ] Library accessible

### Monitoring ✅
- [ ] Health check automated
- [ ] Queue metrics tracked
- [ ] Cost tracking enabled
- [ ] Alerts configured

### Documentation ✅
- [ ] QUICKSTART.md
- [ ] RUNBOOK.md
- [ ] ARCHITECTURE.md
- [ ] VERIFICATION-GUIDE.md (ce fichier)

---

## ✨ Expérience Utilisateur Optimale

Pour garantir une rétention maximale :

### 1. **First Impression** (< 10s)
- ✅ Homepage premium et claire
- ✅ Onboarding smooth (auth modale)
- ✅ Value proposition immédiate

### 2. **Première Analyse** (< 2min)
- ✅ Input clair et smart suggestions
- ✅ Progress visible en temps réel
- ✅ Résultats impressionnants
- ✅ Trust score mis en avant

### 3. **Découverte** (< 5min)
- ✅ Claims interactives
- ✅ Evidence spans cliquables
- ✅ Sources académiques citées
- ✅ Export facile

### 4. **Rétention** (> 1 semaine)
- ✅ Conversation history
- ✅ Library organisée
- ✅ Notifications pertinentes
- ✅ Qualité constante

---

**Version:** 2.0.0  
**Date:** 2026-01-21  
**Status:** ✅ Production-Ready
