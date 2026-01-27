# NomosX Deployment Guide - Dashboard + Pricing Sprint

**Date**: 2026-01-27  
**Sprint**: Dashboard Command Center + Funnel Pricing  
**Status**: Ready for deployment

---

## 📦 Changements Déployés

### 1. Base de Données (Prisma)

#### Nouveau modèle: Subscription
```bash
# Appliquer la migration manuellement
psql $DATABASE_URL < prisma/migrations/20260127_add_subscription_model/migration.sql

# Ou via Prisma CLI
npx prisma db push
```

#### Vérification
```sql
SELECT * FROM "Subscription" LIMIT 1;
```

### 2. Backend (API Routes)

#### Nouvelles routes
- `GET /api/subscription/status` - Récupère le statut subscription
- `POST /api/subscription/upgrade` - Upgrade trial → paid

#### Test
```bash
curl http://localhost:3000/api/subscription/status \
  -H "Cookie: next-auth.session-token=..."
```

### 3. Frontend (Pages)

#### Pages modifiées
- `app/page.tsx` - Home institutionnelle (déjà déployée)
- `app/dashboard/page.tsx` - **NOUVEAU** Command Center
- `app/pricing/page.tsx` - **NOUVEAU** Page pricing

#### Pages archivées
- `app/page-old.tsx` - Ancienne home (backup)
- `app/dashboard/page-old.tsx` - Ancien dashboard (backup)

### 4. Composants UI

#### Nouveaux composants
- `components/TrialBanner.tsx` - Banner trial avec urgence
- `components/UpgradeModal.tsx` - Modal upgrade contextuelle

#### Composants modifiés
- `components/Shell.tsx` - Navigation avec lien Pricing

---

## 🚀 Étapes de Déploiement

### Pré-déploiement

1. **Vérifier les variables d'environnement**
```bash
# .env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="https://nomosx.com"
```

2. **Tester localement**
```bash
npm run dev
# Vérifier:
# - /dashboard (nouveau design)
# - /pricing (page créée)
# - Navigation (lien Pricing visible)
```

### Déploiement Netlify

1. **Build**
```bash
npm run build
```

2. **Migration DB**
```bash
# Sur Neon Console ou via CLI
npx prisma db push --accept-data-loss
```

3. **Deploy**
```bash
netlify deploy --prod
```

4. **Vérification post-deploy**
- [ ] Home page charge correctement
- [ ] Dashboard affiche les 4 metrics cards
- [ ] Page /pricing accessible
- [ ] API /api/subscription/status retourne 200
- [ ] Navigation affiche "Pricing"

---

## 🧪 Tests à Effectuer

### Fonctionnels

#### Trial Flow
1. Créer un nouveau compte
2. Vérifier que subscription est créée automatiquement
3. Vérifier que `isTrialActive = true`
4. Vérifier que `trialDaysRemaining` est calculé correctement
5. Vérifier que TrialBanner s'affiche sur Dashboard

#### Limits
1. Simuler `weeklyPublicationCount = 3`
2. Vérifier soft paywall sur Dashboard
3. Vérifier CTA "Maintain discipline or upgrade"
4. Cliquer → redirection vers /pricing

#### Pricing Page
1. Accéder à /pricing
2. Vérifier affichage offre unique
3. Vérifier sections (What you're not paying for, Who it's for, FAQ)
4. Cliquer "Start your trial" → redirection Dashboard

### Techniques

#### API
```bash
# Status subscription
curl -X GET https://nomosx.com/api/subscription/status \
  -H "Cookie: ..."

# Expected: 200 + JSON avec trial info
```

#### Base de données
```sql
-- Vérifier que Subscription existe
SELECT COUNT(*) FROM "Subscription";

-- Vérifier relation User
SELECT u.email, s.plan, s.status 
FROM "User" u 
LEFT JOIN "Subscription" s ON s."userId" = u.id 
LIMIT 5;
```

---

## 🔧 Configuration Stripe (Phase 2)

### Variables d'environnement à ajouter
```bash
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRICE_ID="price_..." # NomosX Access 149€/mois
```

### Webhooks à configurer
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

### Endpoint
```
https://nomosx.com/api/webhooks/stripe
```

---

## 📊 Monitoring

### Métriques à tracker

#### Business
- Inscriptions (trial starts)
- Trial → Paid conversion rate
- Churn rate
- MRR (Monthly Recurring Revenue)

#### Technique
- API `/api/subscription/status` latency
- Erreurs création subscription
- Erreurs calcul trial days

#### UX
- Taux de clic TrialBanner
- Taux de clic CTA upgrade
- Taux de visite /pricing
- Bounce rate /pricing

### Outils
- **Posthog**: Events tracking
- **Sentry**: Error monitoring
- **Vercel Analytics**: Performance
- **Stripe Dashboard**: Billing metrics

---

## 🐛 Troubleshooting

### Subscription non créée à l'inscription
**Symptôme**: User créé mais pas de subscription  
**Solution**: Vérifier que `GET /api/subscription/status` crée automatiquement si manquant

### Trial days incorrect
**Symptôme**: `trialDaysRemaining` négatif ou > 15  
**Solution**: Vérifier calcul dans `/api/subscription/status`:
```typescript
const diffTime = subscription.trialEnd.getTime() - now.getTime();
trialDaysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
```

### TrialBanner ne s'affiche pas
**Symptôme**: Banner invisible sur Dashboard  
**Solution**: Vérifier condition:
```typescript
{subscription?.isTrialActive && subscription.trialDaysRemaining > 0 && (
  <TrialBanner daysRemaining={subscription.trialDaysRemaining} />
)}
```

### Pricing page 404
**Symptôme**: `/pricing` retourne 404  
**Solution**: Vérifier que `app/pricing/page.tsx` existe et build réussi

---

## 🔄 Rollback Plan

### Si problème critique

1. **Restaurer ancien Dashboard**
```bash
mv app/dashboard/page.tsx app/dashboard/page-new-backup.tsx
mv app/dashboard/page-old.tsx app/dashboard/page.tsx
```

2. **Supprimer lien Pricing**
```typescript
// components/Shell.tsx
// Commenter secondaryNav et lien Pricing
```

3. **Redéployer**
```bash
npm run build
netlify deploy --prod
```

### Si problème DB

1. **Rollback migration**
```sql
DROP TABLE "Subscription";
```

2. **Restaurer backup**
```bash
# Via Neon Console: Restore from backup
```

---

## ✅ Checklist Finale

### Avant déploiement
- [ ] Tests locaux passent
- [ ] Migration SQL prête
- [ ] Variables d'environnement configurées
- [ ] Backup DB effectué

### Après déploiement
- [ ] Home page accessible
- [ ] Dashboard nouveau design visible
- [ ] Page /pricing accessible
- [ ] API subscription fonctionne
- [ ] Navigation affiche Pricing
- [ ] Aucune erreur console
- [ ] Aucune erreur Sentry

### Phase 2 (Stripe)
- [ ] Stripe keys configurées
- [ ] Webhooks configurés
- [ ] Checkout flow testé
- [ ] Customer Portal accessible

---

## 📞 Support

**En cas de problème**:
1. Vérifier logs Netlify
2. Vérifier logs Sentry
3. Vérifier DB Neon Console
4. Rollback si critique

**Contacts**:
- Product: [email]
- Engineering: [email]
- DevOps: [email]

---

**Dernière mise à jour**: 2026-01-27  
**Version**: 1.0  
**Statut**: ✅ Ready for production
