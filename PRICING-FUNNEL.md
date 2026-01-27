# NomosX Pricing Funnel - Documentation Technique

**Version**: 1.0  
**Date**: 2026-01-27  
**Objectif**: Funnel pricing intégré au produit avec offre unique et trial 15 jours

---

## 🎯 Stratégie Pricing

### Offre Unique
- **Plan**: NomosX Access
- **Prix**: 149€/mois
- **Trial**: 15 jours gratuits, sans carte bancaire
- **Pas de freemium**, pas de plans multiples

### Philosophie
> "You're not paying for tokens. You're paying for an autonomous institution."

---

## 📊 Modèle de Données

### Subscription (Prisma)

```prisma
model Subscription {
  id     String @id @default(cuid())
  userId String @unique

  // Plan
  plan String @default("TRIAL") // TRIAL, NOMOSX_ACCESS

  // Trial
  trialStart      DateTime?
  trialEnd        DateTime?
  isTrialActive   Boolean   @default(true)
  trialDaysUsed   Int       @default(0)

  // Billing (Stripe)
  stripeCustomerId       String?
  stripeSubscriptionId   String?
  stripePriceId          String?
  stripeCurrentPeriodEnd DateTime?

  // Status
  status String @default("trialing") // trialing, active, past_due, canceled, paused

  // Limits (reset weekly)
  weeklyPublicationCount Int      @default(0)
  weeklyPublicationMax   Int      @default(3)
  activeVerticals        Int      @default(1)
  activeVerticalsMax     Int      @default(1)
  lastWeeklyReset        DateTime @default(now())

  // Features
  canExportPdf       Boolean @default(false)
  canAccessStudio    Boolean @default(true)
  canCreateVerticals Boolean @default(false)

  // Relations
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

---

## 🔄 Funnel Flow

### 1. Inscription (Home → Dashboard)
- Utilisateur arrive sur `/` (Home institutionnelle)
- CTA: "Enter the Think Tank"
- Création compte → **Trial automatique 15 jours**
- Redirection vers `/dashboard`

### 2. Trial Experience (Dashboard)
- **TrialBanner** affiché si `isTrialActive && trialDaysRemaining > 0`
- Couleur selon urgence:
  - `daysRemaining <= 3`: Rose (high urgency)
  - `daysRemaining <= 7`: Amber (medium urgency)
  - `daysRemaining > 7`: Cyan (low urgency)
- CTA: "View pricing →"

### 3. Soft Paywalls (Limits)

#### Limite Cadence Atteinte
**Où**: Dashboard, carte "Cadence & Limits"  
**Condition**: `weeklyPublicationCount >= weeklyPublicationMax`  
**Message**: "Weekly publication limit reached"  
**CTA**: "Maintain discipline or upgrade →"

#### Limite Verticales Atteinte
**Où**: Dashboard, carte "Verticales"  
**Condition**: `activeVerticals >= activeVerticalsMax`  
**Message**: Soft lock visuel  
**CTA**: "Unlock more verticals →"

#### Trial Expiré
**Où**: Dashboard, Studio, toute action protégée  
**Condition**: `isTrialExpired`  
**Comportement**: 
- Bloquer accès Studio
- Bloquer exports PDF
- Afficher **UpgradeModal**

### 4. Upgrade (Pricing Page)
- Page `/pricing` sobre, institutionnelle
- Sections:
  - Offre unique (carte centrale)
  - "What you're NOT paying for"
  - "Who it's for"
  - FAQ
- CTA: "Start your trial" (si nouveau) ou "Continue with NomosX Access" (si trial actif)

---

## 🛠️ API Routes

### GET `/api/subscription/status`
**Retourne**:
```json
{
  "plan": "TRIAL",
  "status": "trialing",
  "isTrialActive": true,
  "trialDaysRemaining": 9,
  "isTrialExpired": false,
  "weeklyPublicationCount": 2,
  "weeklyPublicationMax": 3,
  "weeklyLimitReached": false,
  "activeVerticals": 1,
  "activeVerticalsMax": 1,
  "verticalsLimitReached": false,
  "canExportPdf": false,
  "canAccessStudio": true,
  "canCreateVerticals": false
}
```

### POST `/api/subscription/upgrade`
**Action**: Upgrade de TRIAL → NOMOSX_ACCESS  
**TODO**: Intégration Stripe Checkout

---

## 🎨 Composants UI

### TrialBanner
**Fichier**: `components/TrialBanner.tsx`  
**Props**:
- `daysRemaining: number`
- `onDismiss?: () => void`

**Comportement**:
- Affichage conditionnel selon urgence
- Dismissible (localStorage pour ne pas spam)
- CTA vers `/pricing`

### UpgradeModal
**Fichier**: `components/UpgradeModal.tsx`  
**Props**:
- `isOpen: boolean`
- `onClose: () => void`
- `reason?: "trial_expired" | "limit_reached" | "feature_locked"`
- `message?: string`

**Comportement**:
- Modal centrée, backdrop blur
- Affiche prix + features
- CTA "View pricing" ou "Not now"

---

## 📍 Points de Friction (Soft Paywalls)

### Dashboard
- ✅ TrialBanner (si trial actif)
- ✅ Carte Verticales (limite atteinte)
- ✅ Carte Cadence (limite atteinte)
- ✅ Carte Trial/Plan (CTA upgrade)

### Studio
- ⏳ TODO: Bloquer accès si trial expiré
- ⏳ TODO: UpgradeModal si `!canAccessStudio`

### Publications
- ⏳ TODO: Bloquer export PDF si `!canExportPdf`
- ⏳ TODO: UpgradeModal sur clic export

### Signals
- ⏳ TODO: Soft lock si limite verticales atteinte

---

## 🔐 Enforcement Rules

### Trial
- **Durée**: 15 jours à partir de `trialStart`
- **Calcul**: `trialDaysRemaining = Math.max(0, Math.ceil((trialEnd - now) / (1000*60*60*24)))`
- **Expiration**: `isTrialExpired = isTrialActive && trialDaysRemaining === 0`

### Limites Hebdomadaires
- **Reset**: Chaque lundi à 00:00 UTC
- **Enforcement**: Backend vérifie avant publication
- **Frontend**: Affichage soft lock + CTA upgrade

### Features
- **PDF Export**: `canExportPdf` (false en trial, true en paid)
- **Studio Access**: `canAccessStudio` (true en trial, false si expiré)
- **Create Verticals**: `canCreateVerticals` (false en trial, true en paid)

---

## 📈 Métriques à Tracker

### Conversion Funnel
1. **Inscriptions** (trial start)
2. **Activation** (première visite Dashboard)
3. **Engagement** (utilisation Studio, review signals)
4. **Friction** (hit limite cadence/verticales)
5. **Conversion** (trial → paid)

### KPIs
- Trial → Paid conversion rate
- Temps moyen avant hit limite
- Taux de dismiss TrialBanner
- Taux de clic CTA upgrade

---

## 🚀 Prochaines Étapes

### Phase 1 (Actuelle)
- [x] Modèle Subscription Prisma
- [x] API routes `/api/subscription/*`
- [x] Dashboard refonte (Command Center)
- [x] Page `/pricing`
- [x] Composants TrialBanner + UpgradeModal
- [x] Navigation (lien Pricing)
- [ ] Migration Prisma
- [ ] Intégration UpgradeModal dans Studio

### Phase 2 (Stripe Integration)
- [ ] Stripe Checkout Session
- [ ] Webhook handlers (payment success, subscription updated)
- [ ] Customer Portal (manage subscription)
- [ ] Invoice generation

### Phase 3 (Enforcement Backend)
- [ ] Middleware protection routes
- [ ] Weekly reset job (cadence counters)
- [ ] Trial expiration job (notifications)
- [ ] Metrics tracking (Posthog/Mixpanel)

---

## 🎯 Critères de Succès

### UX
- ✅ Utilisateur comprend en <10s qu'il est en trial
- ✅ Limites sont **ressenties**, pas expliquées
- ✅ Aucun message agressif ou marketing bullshit
- ✅ Pricing page sobre, bankable, rassurante

### Technique
- ✅ Pas de hard paywall brutal
- ✅ Soft paywalls contextuels
- ✅ Trial auto-créé à l'inscription
- ✅ Limites enforced backend + frontend

### Business
- ⏳ Trial → Paid conversion > 15%
- ⏳ Churn < 5% mensuel
- ⏳ LTV > 1000€ (7 mois rétention)

---

## 📝 Tone & Messaging

### Autorisé
- "Your trial has ended"
- "Weekly publication limit reached"
- "Maintain editorial discipline or upgrade"
- "Continue your private think tank"

### Interdit
- ❌ "Unlock unlimited publications!"
- ❌ "Upgrade now to access premium features!"
- ❌ "Don't miss out!"
- ❌ Tout marketing agressif

---

**Dernière mise à jour**: 2026-01-27  
**Responsable**: Product Team  
**Statut**: Phase 1 en cours
