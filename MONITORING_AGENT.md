# 🔍 MONITORING AGENT - Crawl Continu des Sources Institutionnelles

**Agent autonome qui surveille en permanence les nouvelles publications**

---

## 🎯 CONCEPT

Au lieu de faire des recherches manuelles, le **Monitoring Agent** :
- ✅ Crawl automatiquement les 21 providers institutionnels
- ✅ Vérifie les nouvelles publications selon un intervalle configuré
- ✅ Filtre par qualité (qualityScore minimum)
- ✅ Upsert automatiquement dans la DB
- ✅ Notifie quand nouvelles sources importantes
- ✅ Tourne en continu 24/7

---

## 🚀 UTILISATION

### Mode par défaut (6h interval)

```bash
# Compile d'abord
npm run build

# Lance monitoring
node scripts/start-monitoring.mjs
```

**Config** :
- Providers : CISA, NIST, World Bank, ODNI, NATO, UN, IMF, OECD
- Queries : cybersecurity, AI, climate, geopolitics, economy
- Interval : 6 heures
- Min quality : 70

---

### Mode temps réel (1h interval - Cyber threats)

```bash
node scripts/start-monitoring.mjs --realtime
```

**Config** :
- Providers : CISA, NIST, ENISA (cyber uniquement)
- Queries : zero-day, ransomware, critical infrastructure
- Interval : 1 heure
- Min quality : 80

**Use case** : Alertes cyber en temps quasi-réel

---

### Mode test (run once)

```bash
node scripts/start-monitoring.mjs --once
```

Exécute un seul cycle puis s'arrête (pour tester).

---

## 📊 CYCLE DE MONITORING

### Workflow

```
1. Pour chaque provider configuré:
   a. Pour chaque query configurée:
      - Appelle searchFunction(query, limit)
      - Calcule qualityScore de chaque source
      - Filtre si qualityScore < minQualityScore
      - Check si source existe déjà (via source.id)
      - Si nouvelle → Upsert dans Source table
      - Log: "NEW: [titre de la source]"
   b. Rate limit (1s entre queries)
   
2. Rate limit (2s entre providers)

3. Résumé du cycle:
   - Total nouvelles sources
   - Total erreurs
   - Providers avec mises à jour
   
4. Notification (si activé):
   - Console log
   - TODO: Email/Slack/Webhook
   
5. Log cycle dans Job table (type: MONITORING_CYCLE)

6. Wait (interval en minutes)

7. Repeat forever (sauf --once)
```

---

## 🎛️ CONFIGURATION AVANCÉE

### Créer une config custom

```typescript
// Dans votre code
import { startContinuousMonitoring } from '@/lib/agent/monitoring-agent';

const customConfig = {
  providers: [
    'cisa',      // Obligatoire pour cyber
    'odni',      // Intel
    'imf'        // Économie
  ],
  queries: [
    'quantum computing security',
    'AI regulation',
    'semiconductor supply chain'
  ],
  interval: 120,  // 2 heures
  limit: 15,      // Max sources par query
  minQualityScore: 75,
  notifyOnNew: true
};

await startContinuousMonitoring(customConfig);
```

---

## 📈 EXEMPLES D'USAGE

### 1. Veille cyber quotidienne

```bash
# Mode realtime (1h interval)
node scripts/start-monitoring.mjs --realtime
```

**Résultat** :
- Nouvelles CVEs de CISA
- Advisories NIST
- Threat landscapes ENISA
- Alertes dans l'heure

---

### 2. Veille géopolitique hebdomadaire

```typescript
const geoConfig = {
  providers: ['odni', 'nato', 'uk-jic', 'eeas'],
  queries: [
    'regional conflict',
    'arms control',
    'nuclear proliferation',
    'hybrid warfare'
  ],
  interval: 1440, // 24 heures
  limit: 10,
  minQualityScore: 80,
  notifyOnNew: true
};
```

---

### 3. Veille économique mensuelle

```typescript
const econConfig = {
  providers: ['imf', 'worldbank', 'oecd', 'bis'],
  queries: [
    'monetary policy',
    'financial stability',
    'sovereign debt',
    'inflation outlook'
  ],
  interval: 10080, // 7 jours
  limit: 20,
  minQualityScore: 70,
  notifyOnNew: true
};
```

---

## 🔔 NOTIFICATIONS

### Actuellement implémenté

```typescript
// Console log automatique
console.log('🔔 NEW SOURCES NOTIFICATION');
console.log(`  cisa: 3 new sources`);
console.log(`  nist: 1 new source`);
```

### À implémenter (TODO)

**Email** :
```typescript
await sendEmail({
  to: 'research@nomosx.com',
  subject: '🆕 4 nouvelles sources institutionnelles',
  body: `
    CISA: 3 advisories (CVE-2026-xxxx)
    NIST: 1 publication (SP 800-xxx)
  `
});
```

**Slack** :
```typescript
await sendSlackNotification({
  channel: '#research-updates',
  text: '🆕 4 nouvelles sources détectées',
  attachments: [
    { title: 'CISA', value: '3 cyber advisories' },
    { title: 'NIST', value: '1 publication' }
  ]
});
```

**Webhook** :
```typescript
await axios.post('https://nomosx.com/api/webhook/monitoring', {
  event: 'new_sources',
  sources: newSources,
  timestamp: new Date()
});
```

---

## 📊 MONITORING DES PERFORMANCES

### Query stats

```sql
-- Sources découvertes par provider (last 7 days)
SELECT 
  provider,
  COUNT(*) as new_sources,
  AVG("qualityScore") as avg_quality
FROM "Source"
WHERE "createdAt" >= NOW() - INTERVAL '7 days'
GROUP BY provider
ORDER BY new_sources DESC;
```

### Monitoring cycles

```sql
-- Historique des cycles
SELECT 
  "createdAt",
  "status",
  (result->>'newSources')::int as new_sources,
  (result->>'totalErrors')::int as errors
FROM "Job"
WHERE type = 'MONITORING_CYCLE'
ORDER BY "createdAt" DESC
LIMIT 20;
```

### Taux succès par provider

```sql
-- Fiabilité réelle vs attendue
SELECT 
  provider,
  COUNT(*) as attempts,
  SUM(CASE WHEN "qualityScore" >= 70 THEN 1 ELSE 0 END) as success,
  ROUND(SUM(CASE WHEN "qualityScore" >= 70 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as success_rate
FROM "Source"
WHERE "createdAt" >= NOW() - INTERVAL '30 days'
GROUP BY provider
ORDER BY success_rate DESC;
```

---

## 🎯 STRATÉGIES DE MONITORING

### High-frequency (1h) - Cyber threats

**Providers** : CISA, NIST, ENISA  
**Pourquoi** : CVEs et advisories sortent tous les jours  
**Use case** : SOC, incident response teams

---

### Medium-frequency (6h) - Général

**Providers** : Top 8-10 providers  
**Pourquoi** : Balance freshness / rate limits  
**Use case** : Think tank, policy analysis

---

### Low-frequency (24h) - Archival

**Providers** : NARA, UK Archives, Archives FR  
**Pourquoi** : Docs historiques peu fréquents  
**Use case** : Recherche académique

---

## 💡 TIPS & BEST PRACTICES

### 1. Rate Limiting

Le monitoring agent respecte automatiquement :
- 1s entre queries
- 2s entre providers
- Limites Google CSE (100/jour gratuit)

### 2. Quality Filtering

```typescript
minQualityScore: 70  // Good default
minQualityScore: 80  // High-priority only
minQualityScore: 60  // More permissive
```

### 3. Deduplicate

Le monitoring utilise `source.id` unique :
- Même doc crawlé plusieurs fois = 1 seule entrée
- `upsert()` met à jour si déjà existant

### 4. Persistence

En cas de crash/restart :
- Les sources déjà en DB ne sont pas re-insérées
- Le monitoring reprend où il s'est arrêté

### 5. Monitoring du monitoring

```bash
# Check si monitoring tourne
ps aux | grep start-monitoring

# Check derniers cycles
tail -f logs/monitoring.log

# Check jobs DB
psql -c "SELECT * FROM \"Job\" WHERE type='MONITORING_CYCLE' ORDER BY \"createdAt\" DESC LIMIT 5;"
```

---

## 🚨 TROUBLESHOOTING

### Provider retourne 0 résultats

```
❌ Erreur: cisa returned 0 sources
```

**Solutions** :
1. Check connexion internet
2. Check rate limits (Google CSE ?)
3. Check si provider API down
4. Check query trop spécifique

---

### Trop de nouvelles sources

```
✅ 1,234 nouvelles sources ce cycle
```

**Solutions** :
1. Augmenter `minQualityScore`
2. Restreindre queries
3. Réduire `limit` par query
4. Exclure providers trop verbeux

---

### Monitoring crash

```
Fatal error: ECONNREFUSED
```

**Solutions** :
1. Check DB connexion
2. Check variables d'environnement
3. Restart monitoring
4. Vérifier logs Job table

---

## 📦 DÉPLOIEMENT PRODUCTION

### Option 1 : PM2 (Node.js process manager)

```bash
npm install -g pm2

# Start
pm2 start scripts/start-monitoring.mjs --name nomosx-monitoring

# Auto-restart on reboot
pm2 startup
pm2 save

# Logs
pm2 logs nomosx-monitoring

# Stop
pm2 stop nomosx-monitoring
```

---

### Option 2 : Docker

```dockerfile
FROM node:20-alpine

WORKDIR /app
COPY . .
RUN npm install && npm run build

CMD ["node", "scripts/start-monitoring.mjs"]
```

```bash
docker build -t nomosx-monitoring .
docker run -d --name monitoring --restart unless-stopped nomosx-monitoring
```

---

### Option 3 : Systemd (Linux)

```ini
# /etc/systemd/system/nomosx-monitoring.service
[Unit]
Description=NomosX Institutional Monitoring Agent
After=network.target postgresql.service

[Service]
Type=simple
User=nomosx
WorkingDirectory=/opt/nomosx
ExecStart=/usr/bin/node scripts/start-monitoring.mjs
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable nomosx-monitoring
sudo systemctl start nomosx-monitoring
sudo systemctl status nomosx-monitoring
```

---

## 🎯 ROADMAP

### Phase 1 (Maintenant)
- ✅ Monitoring agent core
- ✅ 21 providers support
- ✅ Quality filtering
- ✅ Auto-upsert DB
- ✅ Console notifications

### Phase 2 (Q2 2026)
- 🔲 Email notifications
- 🔲 Slack integration
- 🔲 Webhook support
- 🔲 Dashboard monitoring (web UI)

### Phase 3 (Q3 2026)
- 🔲 ML-based query optimization
- 🔲 Auto-detect trending topics
- 🔲 Anomaly detection (provider down?)
- 🔲 Multi-region deployment

---

## ✅ RÉSUMÉ

**Le Monitoring Agent** :
- Crawl automatiquement les 21 providers
- Tourne 24/7 en background
- Filtre par qualité
- Notifie nouvelles sources importantes
- Production-ready avec PM2/Docker/Systemd

**Setup** :
```bash
npm run build
node scripts/start-monitoring.mjs
```

**C'est ton "radar permanent" sur les sources institutionnelles.** 🚀
