# ⚡ QUICK START - 21 Providers + Monitoring

**En 5 minutes, tu as un système de veille institutionnelle autonome.**

---

## 📦 PRÉREQUIS

```bash
# 1. Packages déjà installés
npm install

# 2. Variables d'environnement (optionnel pour Google CSE)
# Créer .env si pas encore fait
echo "GOOGLE_CSE_KEY=your_key" >> .env      # Optionnel
echo "GOOGLE_CSE_CX=your_cx" >> .env        # Optionnel
```

**Sans Google CSE** : 17/21 providers fonctionnent (gratuit)  
**Avec Google CSE** : 21/21 providers fonctionnent (~$20-50/mois)

---

## 🚀 3 COMMANDES POUR DÉMARRER

### 1️⃣ Compiler TypeScript

```bash
npm run build
```

**Durée** : ~30 secondes

---

### 2️⃣ Tester les 21 providers

```bash
npm run test:institutional
```

**Output** :
```
🚀 TEST INSTITUTIONAL PROVIDERS V2 - 21 PROVIDERS

🔴 INTELLIGENCE & SÉCURITÉ

============================================================
🧪 Testing: 1. ODNI (GOOGLE CSE)
============================================================
✅ 5 résultats en 1234ms
   • Annual Threat Assessment 2026...

[... 20 autres ...]

✅ 17/21 providers fonctionnels (sans Google CSE)
⚡ Temps moyen: 1456ms
📚 Total sources: 87
```

**Durée** : ~2-3 minutes

---

### 3️⃣ Lancer le monitoring (test)

```bash
npm run monitoring:once
```

**Output** :
```
🔍 MONITORING CYCLE START
  Providers: 8
  Queries: 5
  Min Quality: 70

[Monitoring] Checking cisa for "cybersecurity"...
  ✅ NEW: CISA Alert AA26-023A: Ransomware...
  ✅ NEW: Critical Vulnerability in Apache...
[Monitoring] cisa: 3 new / 5 checked

📊 MONITORING CYCLE COMPLETE
  ✅ New sources: 12
  ❌ Errors: 0
```

**Durée** : ~1-2 minutes

---

## ✅ SI ÇA MARCHE → PRODUCTION

### Lancer monitoring continu (6h interval)

```bash
# Dans un terminal dédié
npm run monitoring
```

**OU avec PM2 (recommandé)** :

```bash
# Install PM2
npm install -g pm2

# Start
pm2 start scripts/start-monitoring.mjs --name nomosx-monitoring

# Logs
pm2 logs nomosx-monitoring

# Auto-restart on reboot
pm2 startup
pm2 save
```

---

### Dashboard temps réel

```bash
# Dans un autre terminal
npm run monitoring:dashboard
```

**Output** :
```
╔════════════════════════════════════════════════════════════════════╗
║        🔍 NOMOSX MONITORING DASHBOARD - Institutional Sources      ║
╚════════════════════════════════════════════════════════════════════╝

📊 OVERVIEW

  Total sources in DB       : 1,234
  Institutional sources     : 456
  New sources (last 24h)    : 23

📈 TOP PROVIDERS (Last 24h)

  Provider              │ Count │ Avg Quality │ Last Update
  ──────────────────────┼───────┼─────────────┼─────────────────
  cisa                  │    12 │       89.50 │ 5m ago
  worldbank             │     8 │       85.00 │ 2h ago

🔄 MONITORING STATUS

  ✅ Monitoring agent is RUNNING
     Started: 3h ago
```

---

## 🎯 MODES DE MONITORING

### Mode par défaut (6h)

```bash
npm run monitoring
```

- Providers : 8 top providers
- Queries : cyber, AI, climate, geopolitics, economy
- Interval : 6 heures
- **Recommandé pour démarrer**

---

### Mode temps réel (1h) - Cyber threats

```bash
npm run monitoring:realtime
```

- Providers : CISA, NIST, ENISA
- Queries : zero-day, ransomware, infrastructure
- Interval : 1 heure
- **Pour SOC / incident response**

---

### Mode test (run once)

```bash
npm run monitoring:once
```

- Execute un cycle puis s'arrête
- **Pour tester / débugger**

---

## 🔧 SCRIPTS NPM DISPONIBLES

```bash
# Tests
npm run test:institutional       # Test 21 providers
npm run test:rss                 # Test RSS feeds

# Monitoring
npm run monitoring               # Mode par défaut (6h)
npm run monitoring:realtime      # Mode cyber (1h)
npm run monitoring:once          # Test (1 cycle)
npm run monitoring:dashboard     # Dashboard temps réel

# Build
npm run build                    # Compile TypeScript
```

---

## ❌ TROUBLESHOOTING

### Erreur : "Cannot find module"

```bash
# Solution
npm run build
```

---

### Erreur : "Google CSE API key missing"

**C'est normal si tu n'as pas setup Google CSE.**

- Sans CSE : 17/21 providers fonctionnent
- Avec CSE : 21/21 providers fonctionnent

**Pour setup Google CSE** (5 min) :
1. https://programmablesearchengine.google.com/
2. https://console.cloud.google.com/ (get API key)
3. Add to `.env` :
   ```bash
   GOOGLE_CSE_KEY=your_key
   GOOGLE_CSE_CX=your_cx
   ```

---

### Provider retourne 0 sources

**Providers qui peuvent être lents** :
- NARA (API parfois lente)
- UK Archives (API UK Gov)
- France institutions (peu de contenu)

**Solution** :
- Normal, essayer avec d'autres queries
- Certains providers ont peu de volume

---

### "Database connection failed"

```bash
# Check DATABASE_URL dans .env
echo $DATABASE_URL

# Test connexion
npx prisma db push
```

---

## 📊 VÉRIFIER QUE ÇA MARCHE

### 1. Check sources dans DB

```bash
# Via Prisma Studio
npx prisma studio

# Ou SQL direct
psql $DATABASE_URL -c "SELECT provider, COUNT(*) FROM \"Source\" WHERE \"createdAt\" >= NOW() - INTERVAL '24 hours' GROUP BY provider;"
```

**Output attendu** :
```
 provider   | count 
------------+-------
 cisa       |    12
 worldbank  |     8
 nist       |     3
```

---

### 2. Check monitoring jobs

```bash
psql $DATABASE_URL -c "SELECT type, status, \"createdAt\" FROM \"Job\" WHERE type='MONITORING_CYCLE' ORDER BY \"createdAt\" DESC LIMIT 5;"
```

**Output attendu** :
```
      type        | status |       createdAt        
------------------+--------+------------------------
 MONITORING_CYCLE | DONE   | 2026-01-23 14:23:15
 MONITORING_CYCLE | DONE   | 2026-01-23 08:23:15
```

---

### 3. Check logs PM2 (si utilisé)

```bash
pm2 logs nomosx-monitoring --lines 50
```

---

## ✅ SUCCESS CHECKLIST

- [ ] `npm run build` → Success
- [ ] `npm run test:institutional` → 15+ providers OK
- [ ] `npm run monitoring:once` → New sources detected
- [ ] Dashboard affiche les sources
- [ ] DB contient nouvelles sources
- [ ] PM2 monitoring running (prod)

---

## 🎓 DOCUMENTATION COMPLÈTE

**Quick refs** :
- `COMPLETE_21_PROVIDERS_MONITORING.md` → Vue d'ensemble
- `MONITORING_AGENT.md` → Doc détaillée monitoring
- `STATUS_21_PROVIDERS.md` → Status providers
- `21_PROVIDERS_SOLUTIONS_FINALES.md` → Solutions techniques

---

## 🚀 RÉSUMÉ 3 ÉTAPES

```bash
# 1. Build
npm run build

# 2. Test
npm run test:institutional

# 3. Launch
pm2 start scripts/start-monitoring.mjs --name nomosx-monitoring
npm run monitoring:dashboard
```

**Durée totale : 5 minutes**  
**Résultat : Veille institutionnelle autonome 24/7** 🎯

---

**Questions ? Check docs complètes dans `COMPLETE_21_PROVIDERS_MONITORING.md`**
