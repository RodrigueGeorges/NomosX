# 🔍 Audit Cohérence Complète — Intent-First Alignment

**Date** : 20 janvier 2026  
**Objectif** : Vérifier l'alignement de TOUTES les pages avec l'approche "intent-first, AI-automated"

---

## 📊 **RÉSUMÉ EXÉCUTIF**

| Page | Intent-First | AI-Automated | Premium Design | Cohérence | Score |
|------|--------------|--------------|----------------|-----------|-------|
| **Homepage** | ✅ Excellent | ✅ Smart selection | ✅ Glassmorphism | ✅ Parfait | ⭐⭐⭐⭐⭐ 5/5 |
| **Brief** | ⚠️ Moyen | ✅ Auto-pipeline | ✅ Premium | ⚠️ Manque auto-run | ⭐⭐⭐⭐ 4/5 |
| **Council** | ⚠️ Moyen | ✅ Multi-perspectives | ✅ Premium | ⚠️ Manque auto-run | ⭐⭐⭐⭐ 4/5 |
| **Radar** | ✅ Bon | ✅ Auto-détection | ✅ Premium | ✅ + Abonnement | ⭐⭐⭐⭐⭐ 5/5 |
| **Recherche** | ⚠️ Manuel | ⚠️ Semi-auto | ✅ Premium | ⚠️ Pas intent-first | ⭐⭐⭐ 3/5 |
| **Dashboard** | ✅ Bon | ✅ Live data | ✅ Premium | ✅ Central hub | ⭐⭐⭐⭐⭐ 5/5 |
| **Briefs (Biblio)** | ⚠️ Manuel | ❌ Aucun | ✅ Premium | ⚠️ Lecture seule | ⭐⭐⭐ 3/5 |
| **Topics** | ❌ Admin | ❌ Aucun | ⚠️ Basique | ❌ Technique | ⭐⭐ 2/5 |
| **Digests** | ❌ Admin | ❌ Aucun | ⚠️ Basique | ❌ Technique | ⭐⭐ 2/5 |
| **Ingestion** | ❌ Admin | ⚠️ Manuel | ⚠️ Basique | ❌ Pas user-facing | ⭐⭐ 2/5 |

**Score Moyen Global** : ⭐⭐⭐⭐ **3.6/5**

---

## ✅ **PAGES EXCELLENTES** (5/5)

### **1. Homepage** ⭐⭐⭐⭐⭐

**Intent-First** : ✅ Parfait
```
1 champ question → Preview intelligent → 1 clic
Zero décision technique requise
```

**AI-Automated** : ✅ Parfait
```
- Détection domaine automatique (11 domaines)
- Sélection providers optimaux
- Ajustement quantité par complexité
- Temps estimé dynamique
```

**Design** : ✅ Glassmorphism premium
**Cohérence** : ✅ Aligné 100% avec vision

**Verdict** : **PARFAIT** — Modèle à suivre

---

### **2. Radar** ⭐⭐⭐⭐⭐

**Intent-First** : ✅ Bon
```
User visite → Signaux faibles auto-détectés
Pas de config nécessaire
+ Abonnement (nouvelle feature !)
```

**AI-Automated** : ✅ Parfait
```
- Radar Agent détecte novelty ≥ 60
- GPT-4 identifie tendances
- 3 niveaux confiance
- Auto-refresh
```

**Design** : ✅ Premium (glow effects, badges)
**Cohérence** : ✅ Valeur stratégique claire

**Verdict** : **EXCELLENT** — Fonction premium

---

### **3. Dashboard** ⭐⭐⭐⭐⭐

**Intent-First** : ✅ Bon
```
Hub central → Stats visuelles
Quick actions vers Brief/Council
```

**AI-Automated** : ✅ Live data temps réel
**Design** : ✅ Cards premium avec gradients
**Cohérence** : ✅ Central hub fonctionnel

**Verdict** : **EXCELLENT** — Bon point d'entrée

---

## ⚠️ **PAGES À AMÉLIORER** (3-4/5)

### **4. Brief** ⭐⭐⭐⭐ (4/5)

**✅ Points Forts** :
- Auto-pipeline complet (SCOUT → EDITOR)
- Query params détectés (?q=...)
- Design premium
- API /api/brief/auto orchestratrice

**❌ Problèmes** :
1. **Pas de auto-run** : User doit cliquer "Générer" manuellement
2. **Pas de loader progression** : Pas de feedback pendant génération
3. **API non connectée** : Utilise /api/briefs au lieu de /api/brief/auto

**Impact** : User arrive depuis homepage mais doit RE-cliquer → Friction

**Fix Recommandé** :
```typescript
// app/brief/page.tsx
useEffect(() => {
  const queryParam = searchParams.get("q");
  if (queryParam) {
    setQ(queryParam);
    // AUTO-RUN (actuellement commenté)
    setTimeout(() => run(), 500); // ← Activer ça !
  }
}, [searchParams]);
```

**Priorité** : 🔴 **HAUTE — Fix rapide (5 min)**

---

### **5. Council** ⭐⭐⭐⭐ (4/5)

**✅ Points Forts** :
- 4 perspectives distinctes (économique, technique, éthique, politique)
- Synthèse intégrée
- Query params détectés
- Design premium

**❌ Problèmes** :
1. **Pas de auto-run** (même problème que Brief)
2. **Pas de loader progression**
3. **API déjà bonne** (/api/council/ask)

**Impact** : Idem Brief — User doit RE-cliquer

**Fix Recommandé** :
```typescript
// app/council/page.tsx
useEffect(() => {
  const queryParam = searchParams.get("q");
  if (queryParam) {
    setQ(queryParam);
    setTimeout(() => ask(), 500); // ← Activer auto-run
  }
}, [searchParams]);
```

**Priorité** : 🔴 **HAUTE — Fix rapide (5 min)**

---

### **6. Recherche** ⭐⭐⭐ (3/5)

**✅ Points Forts** :
- Hybride (lexical + semantic)
- 8 domaines
- 4 tris
- Design premium

**❌ Problèmes** :
1. **Pas intent-first** : User doit choisir domaine, tri, filtres → Trop de décisions
2. **Pas d'auto-suggestion** : Champ vide, pas de guidance
3. **Pas d'intégration homepage** : Aucun lien depuis la homepage simplifiée
4. **Pas d'action directe** : User trouve sources, mais après ?

**Impact** : Feature puissante mais sous-utilisée, pas alignée avec flow simplifié

**Fix Recommandé** :
```typescript
// Option A : Intent-First Search
"Rechercher des sources sur [sujet]"
→ Auto-détecte domaine
→ Auto-applique tri optimal (quality si academic, novelty si emerging)
→ Affiche résultats + CTA : "Générer Brief avec ces sources"

// Option B : Cacher en Advanced
Mettre Recherche dans menu secondaire (...)
Promouvoir Brief/Council (déjà fait ✓)
```

**Priorité** : 🟡 **MOYENNE — Refonte stratégique (2h)**

---

### **7. Briefs (Bibliothèque)** ⭐⭐⭐ (3/5)

**✅ Points Forts** :
- Liste tous les briefs générés
- Recherche + filtres
- Design premium

**❌ Problèmes** :
1. **Lecture seule** : Aucune action possible depuis cette page
2. **Pas d'intent** : User arrive, voit liste, mais pourquoi ?
3. **Pas de suggestions** : "Briefs similaires", "Créer nouveau brief sur même sujet"
4. **Pas de social proof** : Pas de stats (vues, partages)

**Impact** : Archive morte, pas de valeur ajoutée

**Fix Recommandé** :
```typescript
// Intent-Based Actions
Pour chaque brief :
- [Approfondir] → Génère nouveau brief avec plus de sources
- [Débattre] → Lance Council sur même sujet
- [Actualiser] → Re-génère avec sources récentes
- [Partager] → Copy link public

// Smart Suggestions
"Vous avez consulté 3 briefs sur le climat. 
Voulez-vous créer un Radar Climate ?"
```

**Priorité** : 🟢 **BASSE — Enhancement (1 jour)**

---

## ❌ **PAGES INCOHÉRENTES** (2/5)

### **8. Topics** ⭐⭐ (2/5)

**Type** : Page Admin/Technique

**Fonctionnalité** :
```
- Liste des Topics créés
- Affiche query, tags, stats
- Lien "Créer Digest"
- Toggle active/inactive
```

**❌ Problèmes** :
1. **Pas user-facing** : Concepts techniques (query, tags)
2. **Pas d'intent** : User lambda ne sait pas ce qu'est un "Topic"
3. **Pas d'action claire** : "Créer Digest" → Pourquoi ? Quand ?
4. **Design basique** : Pas de glow, pas de premium feel

**Impact** : Confuse users, casse flow simplifié

**Fix Recommandé** :
```typescript
// Option A : Cacher dans Admin
Mettre dans menu ... (comme Ingestion)
Label : "Topics (Admin)"

// Option B : Transformer en "Veilles"
User-friendly naming :
"Topics" → "Mes Veilles"
"Query" → "Sujets suivis"
"Digest" → "Résumé hebdo"

UI Intent-First :
[+ Créer une veille] "Ex: Intelligence artificielle en santé"
→ Auto-crée Topic + Abonnement
```

**Priorité** : 🟡 **MOYENNE — Refonte ou Hide (1-2h)**

---

### **9. Digests** ⭐⭐ (2/5)

**Type** : Page Admin/Archive

**Fonctionnalité** :
```
- Liste des digests générés
- Filtre par topic
- Affiche HTML digest
```

**❌ Problèmes** :
1. **Pas user-facing** : Archive technique
2. **Pas d'intent** : User ne sait pas quand/pourquoi consulter
3. **Pas d'action** : Lecture seule, pas de CTA
4. **Design basique** : Liste plate

**Impact** : Dead feature, confusion

**Fix Recommandé** :
```typescript
// Option A : Cacher dans Admin
Menu ... → "Digests (Archive)"

// Option B : Intégrer dans Topics/Veilles
/topics/[id]/digests
"Historique de vos résumés hebdo"

// Option C : Fusionner avec Radar
Radar → Onglet "Historique"
"Signaux détectés par semaine"
```

**Priorité** : 🟡 **MOYENNE — Refonte ou Hide (1h)**

---

### **10. Ingestion** ⭐⭐ (2/5)

**Type** : Page Admin (déjà cachée dans menu ✓)

**Fonctionnalité** :
```
- Run ingestion manuelle
- Choisir providers, domaine, quantité
- Affiche résultats
```

**✅ Déjà dans menu secondaire** (bien !)

**❌ Problèmes** :
1. **Pas nécessaire pour users** : Homepage auto-ingère
2. **Design basique** : Pas premium
3. **Pas de cas d'usage clair** : Admin only

**Impact** : OK si caché, mais pourrait être mieux

**Fix Recommandé** :
```typescript
// Option A : Garder tel quel (hidden)
C'est un outil admin, OK

// Option B : Améliorer pour power users
Label : "Ingestion Avancée (Power Users)"
Use case : "Alimenter base avec sources spécifiques"
Design : Premium avec preview résultats
```

**Priorité** : 🟢 **BASSE — Enhancement optionnel**

---

## 🎯 **ANALYSE DE COHÉRENCE**

### **Philosophie "Intent-First, AI-Automated"**

**Définition** :
```
User exprime INTENTION (question, sujet)
→ System DÉDUIT tout (providers, quantité, actions)
→ System EXÉCUTE automatiquement
→ User reçoit RÉSULTAT (brief, débat, signaux)
```

### **Pages Alignées** ✅

| Page | Comment elle est alignée |
|------|--------------------------|
| **Homepage** | ✅ User tape question → Auto-détecte domaine → Auto-sélectionne providers |
| **Radar** | ✅ User visite → Auto-détecte signaux → Auto-génère cards |
| **Dashboard** | ✅ User visite → Auto-affiche stats → Quick actions claires |

**Total** : **3/10 pages** sont parfaitement alignées

---

### **Pages Partiellement Alignées** ⚠️

| Page | Ce qui manque |
|------|---------------|
| **Brief** | ⚠️ Auto-run désactivé → User doit cliquer manuellement |
| **Council** | ⚠️ Auto-run désactivé → User doit cliquer manuellement |
| **Recherche** | ⚠️ Trop de choix manuels (domaine, tri, filtres) |
| **Briefs (Biblio)** | ⚠️ Aucune action suggérée, lecture seule |

**Total** : **4/10 pages** sont à 50-80% alignées

---

### **Pages Non-Alignées** ❌

| Page | Pourquoi non-aligné |
|------|---------------------|
| **Topics** | ❌ Concepts techniques, pas intent-based |
| **Digests** | ❌ Archive morte, pas d'action |
| **Ingestion** | ❌ Admin tool (OK si caché) |

**Total** : **3/10 pages** ne sont pas alignées (mais 1 déjà cachée ✓)

---

## 📋 **PLAN D'ACTION PRIORITAIRE**

### **🔴 CRITIQUE — Fixes Immédiats** (30 min)

#### **1. Activer Auto-Run Brief + Council**

**Problème** : User arrive depuis homepage, doit RE-cliquer "Générer"

**Fix** :
```typescript
// app/brief/page.tsx
useEffect(() => {
  const queryParam = searchParams.get("q");
  if (queryParam) {
    setQ(queryParam);
    setTimeout(() => run(), 500); // ← ACTIVER
  }
}, [searchParams]);

// app/council/page.tsx
useEffect(() => {
  const queryParam = searchParams.get("q");
  if (queryParam) {
    setQ(queryParam);
    setTimeout(() => ask(), 500); // ← ACTIVER
  }
}, [searchParams]);
```

**Impact** : Flow devient **vraiment** fluide (homepage → résultat en 1 clic)

**Temps** : 5 min

---

#### **2. Connecter Brief à API Auto**

**Problème** : Brief utilise `/api/briefs` (ancien) au lieu de `/api/brief/auto` (nouveau avec smart selection)

**Fix** :
```typescript
// app/brief/page.tsx
async function run() {
  setLoading(true);
  const r = await fetch("/api/brief/auto", { // ← Changer ici
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question: q })
  });
  const d = await r.json();
  setBriefId(d.briefId); // ← Adapter à nouvelle response
  setHtml(d.brief.html);
  setLoading(false);
}
```

**Impact** : Brief utilise maintenant la sélection intelligente !

**Temps** : 10 min

---

### **🟡 IMPORTANT — Améliorations UX** (2-3h)

#### **3. Loader Progression Brief + Council**

**Problème** : Aucun feedback pendant 30-60s de génération

**Fix** : Créer `components/GenerationProgress.tsx` (déjà spec dans AUDIT-FINAL-UX.md)

**Impact** : User voit progression (Recherche → Analyse → Génération)

**Temps** : 1h

---

#### **4. Cacher Topics + Digests dans Admin**

**Problème** : Pages techniques confusent users

**Fix** :
```typescript
// components/Shell.tsx
const moreNav = [
  { href: "/radar", label: "Radar", icon: Radar },
  { href: "/briefs", label: "Bibliothèque", icon: Library },
  { href: "/digests", label: "Digests (Archive)", icon: Mail }, // ← Renommer
  { href: "/topics", label: "Topics (Admin)", icon: Layers }, // ← Renommer
  { href: "/about", label: "À propos", icon: Info },
  { href: "/ingestion", label: "Ingestion (Admin)", icon: Database },
  { href: "/settings", label: "Paramètres", icon: Settings }
];
```

**Impact** : Clarté, user sait que c'est admin

**Temps** : 5 min

---

#### **5. Intent-First Search**

**Problème** : Recherche trop complexe, pas alignée

**Fix Option A** : Simplifier
```typescript
// app/search/page.tsx
// Auto-détecte domaine (comme homepage)
// Auto-applique tri optimal
// Ajoute CTA : "Générer Brief avec ces N sources"
```

**Fix Option B** : Cacher dans Advanced (menu ...)

**Impact** : Cohérence avec approche simplifiée

**Temps** : 2h (Option A) ou 5 min (Option B)

---

### **🟢 NICE TO HAVE — Enhancements** (1-2 jours)

#### **6. Actions Intent-Based dans Bibliothèque**

```typescript
// app/briefs/page.tsx
Pour chaque brief :
- [Approfondir] → Plus de sources
- [Débattre] → Lance Council
- [Actualiser] → Sources récentes
- [Partager] → Public link
```

**Temps** : 1 jour

---

#### **7. Transformer Topics en "Veilles"**

```typescript
// app/topics → app/veilles
"Créer une veille" → User-friendly
Auto-crée Topic + Abonnement
Design premium
```

**Temps** : 1 jour

---

## 📊 **SCORE FINAL PROJETÉ**

### **Après Fixes Critiques** (30 min)

| Page | Avant | Après | Amélioration |
|------|-------|-------|--------------|
| Brief | 4/5 | 5/5 | +25% |
| Council | 4/5 | 5/5 | +25% |

**Score Moyen** : 3.6/5 → **4.0/5** (+11%)

---

### **Après Fixes Importants** (3h)

| Page | Avant | Après | Amélioration |
|------|-------|-------|--------------|
| Brief | 4/5 | 5/5 | +25% |
| Council | 4/5 | 5/5 | +25% |
| Recherche | 3/5 | 4/5 | +33% |
| Topics | 2/5 | 3/5 | +50% |
| Digests | 2/5 | 3/5 | +50% |

**Score Moyen** : 3.6/5 → **4.3/5** (+19%)

---

### **Après Tous Enhancements** (2 jours)

| Page | Score Final |
|------|-------------|
| Homepage | ⭐⭐⭐⭐⭐ 5/5 |
| Dashboard | ⭐⭐⭐⭐⭐ 5/5 |
| Radar | ⭐⭐⭐⭐⭐ 5/5 |
| Brief | ⭐⭐⭐⭐⭐ 5/5 |
| Council | ⭐⭐⭐⭐⭐ 5/5 |
| Recherche | ⭐⭐⭐⭐ 4/5 |
| Briefs (Biblio) | ⭐⭐⭐⭐ 4/5 |
| Veilles (ex-Topics) | ⭐⭐⭐⭐ 4/5 |
| Digests (Archive) | ⭐⭐⭐ 3/5 |
| Ingestion (Admin) | ⭐⭐⭐ 3/5 |

**Score Moyen Final** : **4.4/5** ✨

---

## 🎯 **RECOMMANDATION**

### **À FAIRE MAINTENANT** (30 min) 🔴

1. ✅ Activer auto-run Brief
2. ✅ Activer auto-run Council
3. ✅ Connecter Brief à /api/brief/auto
4. ✅ Renommer Topics/Digests "(Admin)" dans nav

**Impact** : Flow devient **100% fluide** Homepage → Résultat

---

### **À FAIRE PHASE 2** (3h) 🟡

5. Loader progression
6. Intent-First Search (ou cacher)

**Impact** : UX professionnelle, cohérence totale

---

### **À FAIRE PHASE 3** (2 jours) 🟢

7. Actions Bibliothèque
8. Topics → Veilles

**Impact** : App "best-in-class"

---

**Version** : Audit Cohérence v1.0  
**Statut** : ⚠️ **Partiellement aligné** (3.6/5)  
**Objectif** : ✅ **Fully aligned** (4.4/5) après fixes
