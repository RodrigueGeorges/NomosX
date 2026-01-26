# ✅ Checklist Déploiement - Providers Institutionnels

**Date**: 2026-01-23  
**Version**: 1.0  
**Status**: Ready to Deploy

---

## 📋 PRÉ-DÉPLOIEMENT

### 1. Vérification Code

- [x] **21 providers institutionnels** créés et testables
- [x] **Rate limiter** implémenté (1 req/s max)
- [x] **Scoring adapté** avec bonus institutionnels
- [x] **Intégration SCOUT agent** complète
- [x] **Presets intelligents** pour recommandations auto
- [x] **Documentation complète** (README, LEGAL, guides)

### 2. Base de Données

```bash
# Vérifier schéma Prisma
cd c:\Users\madeleine.stephann\OneDrive\Bureau\NomosX
npx prisma format
npx prisma validate
```

- [ ] **Schéma validé** (nouveaux champs Source)
- [ ] **Migration créée** (`add_institutional_fields`)
- [ ] **Backup DB** avant migration

### 3. Tests

```bash
# Test providers
node scripts/test-institutional.mjs

# Démo complète
node scripts/demo-institutional.mjs
```

- [ ] **Au moins 3 providers** retournent des résultats
- [ ] **Rate limiting** fonctionne (vérifier logs)
- [ ] **Scoring** applique bien les bonus institutionnels

---

## 🚀 DÉPLOIEMENT

### Étape 1: Backup

```bash
# Backup production DB
pg_dump $DATABASE_URL > backup_pre_institutional_$(date +%Y%m%d).sql
```

- [ ] **Backup créé** et vérifié

### Étape 2: Migration

```bash
# En production
npx prisma migrate deploy

# Vérifier
npx prisma studio
# → Vérifier table Source a nouveaux champs
```

- [ ] **Migration appliquée** en production
- [ ] **Nouveaux champs** visibles dans Prisma Studio
- [ ] **Pas d'erreurs** dans logs migration

### Étape 3: Deploy Code

```bash
# Build
npm run build

# Deploy (selon votre setup)
vercel deploy --prod
# OU
pm2 restart nomosx
# OU
docker-compose up -d
```

- [ ] **Code déployé** en production
- [ ] **Pas d'erreurs** build/compile
- [ ] **Healthcheck** OK

### Étape 4: Test Production

```bash
# Test quick via API/CLI
curl -X POST https://api.nomosx.com/v1/briefs \
  -H "Content-Type: application/json" \
  -d '{"question": "What are cyber threats?", "providers": ["cisa", "openalex"]}'
```

- [ ] **Brief créé** avec mix sources
- [ ] **Sources institutionnelles** présentes en DB
- [ ] **Pas d'erreurs** rate limiting

---

## 📊 POST-DÉPLOIEMENT

### Monitoring (Semaine 1)

**Métriques à surveiller** :

```sql
-- Sources par provider (daily)
SELECT 
  provider,
  COUNT(*) as count,
  AVG(qualityScore) as avg_quality
FROM "Source"
WHERE createdAt >= NOW() - INTERVAL '24 hours'
GROUP BY provider
ORDER BY count DESC;

-- Ratio institutionnel vs académique
SELECT 
  CASE WHEN issuerType IS NOT NULL THEN 'institutional' ELSE 'academic' END as type,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM "Source"
WHERE createdAt >= NOW() - INTERVAL '7 days'
GROUP BY type;

-- Erreurs rate limiting (alerter si > 10/jour)
SELECT COUNT(*) as rate_limit_hits
FROM "Job"
WHERE type = 'SCOUT'
  AND status = 'FAILED'
  AND lastError LIKE '%429%'
  AND createdAt >= NOW() - INTERVAL '24 hours';
```

- [ ] **Dashboard monitoring** configuré
- [ ] **Alertes** rate limiting activées
- [ ] **Logs** centralisés

### Validation Métier (Semaine 2)

**Tests manuels** :

1. **Créer 10 briefs variés** :
   - [ ] Géopolitique (avec ODNI, NATO)
   - [ ] Cyber (avec CISA, ENISA)
   - [ ] Économie (avec IMF, OECD)
   - [ ] Historique (avec CIA FOIA, NARA)

2. **Vérifier qualité** :
   - [ ] Citations institutionnelles présentes
   - [ ] Quality score ≥ 85 pour institutionnel
   - [ ] Pas de sources vides/invalides

3. **Comparer avec concurrent** :
   - [ ] Même question sur Perplexity
   - [ ] Documenter différence (sources, profondeur)

### KPIs Attendus (Semaine 3-4)

- [ ] **Sources institutionnelles** = 25-30% du total
- [ ] **Quality score moyen** institutionnel ≥ 85
- [ ] **Briefs premium** avec ≥3 sources institutionnelles ≥ 60%
- [ ] **0 violations** rate limiting
- [ ] **Uptime providers** ≥ 95%

---

## 🎨 UI/UX (Optionnel - Sprint 2)

### Badges Sources

```tsx
// components/SourceBadge.tsx
<Badge color={getColorByIssuerType(source.issuerType)}>
  {getIconByIssuerType(source.issuerType)} {source.issuer}
</Badge>
```

- [ ] **Badges** institutionnels ajoutés
- [ ] **Couleurs** par catégorie (intelligence=red, etc.)
- [ ] **Filtres** par type source

### Page Marketing

- [ ] **Landing page** updated ("29 sources" au lieu de 8)
- [ ] **Page /about** mentionne providers institutionnels
- [ ] **Blog post** "NomosX now integrates intelligence sources"

---

## 📣 COMMUNICATION

### Interne

- [ ] **Email équipe** : "Providers institutionnels déployés"
- [ ] **Formation** dev team (1h)
- [ ] **Formation** product/business (30 min)
- [ ] **Q&A session** avec tech lead

### Externe (optionnel)

- [ ] **Blog post** technique
- [ ] **Twitter/LinkedIn** announcement
- [ ] **Newsletter** utilisateurs
- [ ] **Démos clients** mis à jour

---

## 🚨 ROLLBACK PLAN

**Si problème critique** :

1. **Rollback code** :
   ```bash
   vercel rollback  # ou équivalent
   ```

2. **Rollback DB** (si nécessaire) :
   ```sql
   -- Supprimer nouveaux champs
   ALTER TABLE "Source" DROP COLUMN "issuerType";
   ALTER TABLE "Source" DROP COLUMN "issuer";
   -- etc.
   ```

3. **Restore backup** :
   ```bash
   psql $DATABASE_URL < backup_pre_institutional_20260123.sql
   ```

**Critères rollback** :
- [ ] Taux erreur > 10%
- [ ] Indisponibilité service > 5 min
- [ ] Violation légale détectée
- [ ] Corruption données

---

## ✅ VALIDATION FINALE

**Avant de marquer "DEPLOYED"** :

- [ ] ✅ Migration DB appliquée sans erreur
- [ ] ✅ Au moins 5 providers fonctionnels
- [ ] ✅ Rate limiting actif
- [ ] ✅ Monitoring configuré
- [ ] ✅ 3 briefs test créés avec succès
- [ ] ✅ Conformité légale vérifiée
- [ ] ✅ Documentation à jour
- [ ] ✅ Équipe formée

---

## 📞 CONTACTS URGENCE

**Technique** : dev@nomosx.com  
**Produit** : product@nomosx.com  
**Légal** : legal@nomosx.com  

**On-call** : [Nom/Téléphone]

---

**Status déploiement** : 🟡 READY TO DEPLOY  
**Date prévue** : À définir  
**Durée estimée** : 2-3h (migration + tests)

---

✅ **Checklist validée par** : _________________  
📅 **Date** : _________________
