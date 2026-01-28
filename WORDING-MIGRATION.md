# NomosX - Migration du Wording vers Think Tank Autonome

**Date**: 2026-01-28  
**Objectif**: Aligner toutes les pages avec le nouvel angle "Think Tank Autonome Agentique"

---

## 🔄 Mapping Ancien → Nouveau Modèle

### Ancien Modèle (Intelligence Services)
- **Brief** → Analyse dialectique sur demande
- **Council** → Multi-perspective analysis
- **Radar** → Détection de signaux faibles
- **Library** → Archive des analyses

### Nouveau Modèle (Think Tank Autonome)
- **Think Tank** → Institution autonome avec éditorial
- **Verticals** → Domaines de recherche actifs
- **Signals** → Détection automatique de sujets
- **Publications** → Output institutionnel (après gate)
- **Studio** → Interface de proposition humaine
- **Dashboard** → Command Center du Think Tank

---

## 📋 Pages à Mettre à Jour

### ✅ Pages Déjà Alignées
- `/dashboard` - Command Center (✅ Bon wording)
- `/signals` - Signal Detection Layer (✅ Bon wording)
- `/publications` - Publications Archive (✅ Bon wording)
- `/pricing` - NomosX Access (✅ Bon wording)

### ❌ Pages à Corriger

#### 1. `/about` (PRIORITÉ HAUTE)
**Problèmes identifiés**:
- Titre: "Agentic Intelligence Platform" → Devrait être "Autonomous Think Tank"
- Features section: Liste "Brief, Council, Radar, Library" → Devrait être "Think Tank Model"
- Description: "Four autonomous intelligence services" → Devrait être "Autonomous research institution"
- Wording général: Trop orienté "services à la demande" vs "institution autonome"

**Corrections requises**:
- Hero: "An AI-governed research institution" (déjà bon sur Home)
- Features: Remplacer par modèle Think Tank (Verticals, Signals, Publications, Editorial Gate)
- Principles: Ajouter "Editorial Autonomy" et "Silence is a success state"
- How it works: Garder pipeline agents mais contextualiser dans Think Tank

#### 2. `/search` (PRIORITÉ MOYENNE)
**Problèmes identifiés**:
- Bouton "Generate Brief" → Devrait être "Propose to Think Tank" ou "Submit to Studio"
- Wording: Trop orienté "recherche à la demande"

**Corrections requises**:
- Renommer action: "Propose Analysis" au lieu de "Generate Brief"
- Redirection vers `/studio` au lieu de `/brief`
- Contexte: "Propose this topic to the Think Tank editorial board"

#### 3. `/studio` (PRIORITÉ MOYENNE)
**Problèmes identifiés**:
- Titre: "Publication Studio" (OK)
- Description: Manque contexte Think Tank
- Publication types: OK mais manque explication editorial gate

**Corrections requises**:
- Ajouter header: "Human-initiated proposals to the Think Tank"
- Clarifier: "Your proposal will be evaluated by the Editorial Gate"
- Ajouter warning: "The Think Tank may choose silence over publication"

#### 4. `/briefs` (PRIORITÉ BASSE - À SUPPRIMER?)
**Problèmes identifiés**:
- Page entière basée sur ancien modèle "Brief"
- Devrait rediriger vers `/publications` ou être supprimée

**Corrections requises**:
- Option 1: Supprimer et rediriger vers `/publications`
- Option 2: Renommer en "Analysis Archive" et aligner avec Think Tank

#### 5. `/library` (PRIORITÉ BASSE - À SUPPRIMER?)
**Problèmes identifiés**:
- Concept "Library" n'existe plus dans nouveau modèle
- Devrait être fusionné avec `/publications`

**Corrections requises**:
- Rediriger vers `/publications`
- Supprimer de la navigation

#### 6. `/radar` (PRIORITÉ BASSE - À RENOMMER?)
**Problèmes identifiés**:
- "Radar" est l'ancien nom pour "Signals"
- Devrait rediriger vers `/signals`

**Corrections requises**:
- Rediriger vers `/signals`
- Ou renommer en "Radar View" comme vue alternative de Signals

---

## 📝 Nouveau Wording Standard

### Taglines
- ❌ "Agentic Intelligence Platform"
- ✅ "The Autonomous Think Tank"
- ✅ "AI-governed research institution"

### Value Prop
- ❌ "Transform research into analysis on demand"
- ✅ "Autonomous research institution that monitors, evaluates, and publishes—or chooses strategic silence"

### Features
- ❌ "Four intelligence services: Brief, Council, Radar, Library"
- ✅ "Autonomous Think Tank with editorial independence: Verticals, Signals, Publications, Editorial Gate"

### User Actions
- ❌ "Generate a brief"
- ✅ "Propose to Think Tank" / "Submit to Editorial Board"

### Outputs
- ❌ "Brief" / "Council session"
- ✅ "Publication" / "Think Tank publication"

### Silence
- ✅ "Silence is a success state"
- ✅ "The Think Tank may choose not to publish"
- ✅ "Strategic silence over noise"

---

## 🎯 Principes du Nouveau Wording

### 1. Autonomie Éditoriale
- Le Think Tank **décide** de publier ou non
- L'utilisateur **propose**, ne **commande** pas
- Le silence est une option légitime

### 2. Institution vs Service
- ❌ "Service à la demande"
- ✅ "Institution de recherche"
- ❌ "Generate analysis"
- ✅ "The Think Tank publishes"

### 3. Discipline Éditoriale
- Cadence limits (3 publications/semaine)
- Editorial Gate (quality threshold)
- Quiet hours (22h-6h UTC)
- Publish windows (9h, 14h, 18h)

### 4. Transparence Totale
- Toutes les décisions éditoriales visibles
- Raisons du silence expliquées
- Métriques de qualité affichées

---

## 🔧 Actions Techniques

### Navigation (Shell.tsx)
```typescript
// ❌ Ancien
const mainNav = [
  { name: "Brief", href: "/brief" },
  { name: "Council", href: "/council" },
  { name: "Radar", href: "/radar" },
  { name: "Library", href: "/library" }
];

// ✅ Nouveau
const mainNav = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Studio", href: "/studio" },
  { name: "Signals", href: "/signals" },
  { name: "Publications", href: "/publications" }
];
```

### Redirections
```typescript
// app/brief/page.tsx → Redirect to /studio
// app/council/page.tsx → Redirect to /studio
// app/radar/page.tsx → Redirect to /signals
// app/library/page.tsx → Redirect to /publications
```

### Metadata
```typescript
// app/layout.tsx
export const metadata = {
  title: "NomosX - The Autonomous Think Tank",
  description: "AI-governed research institution that monitors, evaluates, and publishes—or chooses strategic silence."
};
```

---

## 📊 Checklist de Migration

### Pages Principales
- [ ] `/` (Home) - Vérifier wording
- [ ] `/about` - **Refonte complète requise**
- [ ] `/pricing` - ✅ Déjà bon
- [ ] `/dashboard` - ✅ Déjà bon

### Pages Protégées
- [ ] `/studio` - Ajouter contexte Think Tank
- [ ] `/signals` - ✅ Déjà bon
- [ ] `/publications` - ✅ Déjà bon
- [ ] `/search` - Changer "Generate Brief" → "Propose"

### Pages à Supprimer/Rediriger
- [ ] `/brief` → Redirect to `/studio`
- [ ] `/briefs` → Redirect to `/publications`
- [ ] `/council` → Redirect to `/studio`
- [ ] `/radar` → Redirect to `/signals`
- [ ] `/library` → Redirect to `/publications`

### Composants
- [ ] `Shell.tsx` - Navigation déjà mise à jour
- [ ] `AuthModal.tsx` - Vérifier wording
- [ ] `TrialBanner.tsx` - ✅ Déjà bon

### Documentation
- [ ] README.md - Mettre à jour description
- [ ] AGENTS.md - ✅ Déjà aligné
- [ ] PRICING-FUNNEL.md - ✅ Déjà aligné

---

## 🎨 Exemples de Bon Wording

### Home Page (Référence)
```
"An AI-governed research institution that continuously monitors 
the world, detects weak signals, and publishes decision-ready 
insights — or stays silent."
```

### Dashboard (Référence)
```
"Think Tank Command Center"
"System Status: Monitoring / Silent"
"Silence is a success state"
```

### Pricing (Référence)
```
"NomosX Access - 149€/month"
"Access the autonomous Think Tank"
"15-day free trial, no credit card"
```

---

## 🚀 Plan d'Exécution

### Phase 1 (Immédiat)
1. Mettre à jour `/about` avec nouveau modèle
2. Corriger `/search` (bouton + wording)
3. Améliorer `/studio` (contexte Think Tank)

### Phase 2 (Cette semaine)
4. Créer redirections pour anciennes pages
5. Nettoyer navigation (supprimer liens obsolètes)
6. Mettre à jour metadata

### Phase 3 (Prochaine itération)
7. Audit complet de tous les textes
8. Uniformiser le tone of voice
9. Créer style guide du wording

---

**Dernière mise à jour**: 2026-01-28  
**Responsable**: Product & Engineering Team  
**Statut**: En cours de migration
