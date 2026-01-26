# 🔍 Audit Final UX — Checklist Complète

**Date** : 20 janvier 2026  
**Objectif** : Identifier TOUS les points d'amélioration pour flow user-friendly et pro

---

## ✅ **CE QUI EST EXCELLENT**

### **1. Homepage** ⭐⭐⭐⭐⭐
- ✅ **1 champ question** ultra-clair
- ✅ **Preview intelligent** (providers + temps estimé)
- ✅ **4 templates** cliquables par catégorie
- ✅ **Toggle Brief/Council** avec descriptions
- ✅ **Design glassmorphism** premium
- ✅ **Stats rapides** en bas

### **2. Sélection Intelligente** ⭐⭐⭐⭐⭐
- ✅ **Détection automatique domaine** (11 domaines)
- ✅ **Mapping domain → providers optimaux**
- ✅ **Ajustement quantité** selon complexité
- ✅ **Preview temps réel** sur homepage
- ✅ **Transparent** : explique pourquoi ces choix

### **3. Navigation** ⭐⭐⭐⭐⭐
- ✅ **MainNav simplifié** : Dashboard, Recherche, Brief, Council
- ✅ **Ingestion cachée** dans menu avancé
- ✅ **Progressive disclosure** : simple par défaut, avancé si besoin

---

## ⚠️ **POINTS À AMÉLIORER**

### **🔴 CRITIQUE — Manque gestion query params**

**Problème** :
```
Homepage redirige vers : /brief?q=...
MAIS /brief ne détecte PAS le paramètre ?q=... 
→ User doit RE-taper la question manuellement !
```

**Impact** : ❌ **ÉNORME friction** — annule le bénéfice de la homepage simplifiée

**Solution** : Modifier `/brief` et `/council` pour :
1. Détecter param `?q=...`
2. Auto-remplir le champ question
3. Auto-lancer la génération (optionnel mais recommandé)

**Priorité** : 🔴 **CRITIQUE — À FIXER IMMÉDIATEMENT**

---

### **🟡 IMPORTANT — Pas de feedback visuel pendant génération**

**Problème** :
```
User clique "Générer" → Redirige vers /brief
→ Écran brief vide, pas de feedback
→ User ne sait pas si ça marche
```

**Impact** : ⚠️ Confusion, incertitude

**Solution** : Afficher loader avec étapes :
```
🤖 Génération en cours...
✓ Recherche sources (PubMed + OpenAlex)
⏳ Sélection des 18 meilleures sources
⏳ Analyse multi-perspectives
```

**Priorité** : 🟡 **IMPORTANT — Phase 1.5**

---

### **🟡 IMPORTANT — Pas de gestion erreurs**

**Problème** :
```
Si aucune source trouvée → ?
Si API timeout → ?
Si question vide → ?
```

**Impact** : ⚠️ User bloqué sans explication

**Solution** : Messages d'erreur clairs :
```
❌ Aucune source trouvée pour cette question
💡 Suggestions :
   - Reformuler avec termes plus généraux
   - Essayer en anglais
   - Choisir un template
```

**Priorité** : 🟡 **IMPORTANT — Phase 1.5**

---

### **🟢 NICE TO HAVE — Homepage trop longue**

**Problème** :
```
Homepage = 311 lignes
Scroll nécessaire pour voir templates + stats
```

**Impact** : 🟢 Mineur, mais peut désorienter

**Solution** : Réorganiser :
```
1. Logo + Question (above the fold)
2. Mode Brief/Council
3. CTA "Générer"
4. Templates (pliable si > 4)
5. Stats (footer minimal)
```

**Priorité** : 🟢 **NICE TO HAVE — Phase 2**

---

### **🟢 NICE TO HAVE — Manque exemple visuel**

**Problème** :
```
User ne sait pas à quoi ressemble le résultat
Pas de "avant/après" ou screenshot
```

**Impact** : 🟢 Mineur, mais aide à convaincre

**Solution** : Ajouter :
```
[Voir un exemple de brief] (modal ou /demo)
```

**Priorité** : 🟢 **NICE TO HAVE — Phase 2**

---

### **🟢 NICE TO HAVE — Pas de sauvegarde brouillon**

**Problème** :
```
Si user tape question, rafraîchit page → perdu
```

**Impact** : 🟢 Mineur (rare)

**Solution** : LocalStorage auto-save
```typescript
useEffect(() => {
  localStorage.setItem('draft-question', question);
}, [question]);
```

**Priorité** : 🟢 **NICE TO HAVE — Phase 3**

---

## 🚨 **BUGS POTENTIELS**

### **1. Redirection Brief/Council sans param**

**Test** :
```
1. Homepage → Tape question
2. Clic "Générer Brief"
3. /brief s'ouvre → Question VIDE ?
```

**Fix** : Assurer que `/brief?q=...` auto-remplit champ

---

### **2. Templates trop longs**

**Test** :
```
Template 1 : 85 caractères
Template 2 : 72 caractères
→ Peut déborder sur mobile ?
```

**Fix** : Tester responsive, tronquer si > 80 chars

---

### **3. Smart Preview peut lag**

**Test** :
```
User tape vite → selectSmartProviders() appelé à chaque touche
→ Possible lag ?
```

**Fix** : Debounce 300ms
```typescript
const debouncedPreview = useMemo(
  () => debounce((q) => setSmartPreview(selectSmartProviders(q)), 300),
  []
);
```

---

## 📋 **CHECKLIST FINALE**

### **Phase 1.5 — Fixes Critiques** (2h)
- [ ] **Détecter `?q=...` dans /brief et /council**
- [ ] **Auto-remplir question** si param présent
- [ ] **Auto-lancer génération** (optionnel mais recommandé)
- [ ] **Afficher loader** avec progression
- [ ] **Gestion erreurs** (no sources, timeout, empty)
- [ ] **Debounce smart preview** (300ms)

### **Phase 2 — UX Polish** (1 jour)
- [ ] Réorganiser homepage (above the fold)
- [ ] Modal "Voir exemple" avec screenshot
- [ ] LocalStorage auto-save brouillon
- [ ] Responsive mobile tests
- [ ] Templates truncate si trop longs

### **Phase 3 — Features Avancées** (1 semaine)
- [ ] SSE pour progression temps réel
- [ ] Historique questions (5 dernières)
- [ ] Suggestions basées sur historique
- [ ] A/B testing templates
- [ ] Analytics : temps moyen, taux succès

---

## 🎯 **PRIORITÉS IMMÉDIATES**

### **1. FIX CRITIQUE : Query Params** 🔴

**Code à ajouter dans `/brief/page.tsx`** :

```typescript
// app/brief/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function BriefPage() {
  const searchParams = useSearchParams();
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const queryParam = searchParams.get("q");
    if (queryParam) {
      setQ(queryParam);
      // Auto-lancer génération (optionnel)
      // run();
    }
  }, [searchParams]);

  // ... rest of component
}
```

**Idem pour `/council/page.tsx`**

---

### **2. Loader avec Progression** 🟡

**Composant à créer : `components/GenerationProgress.tsx`** :

```typescript
export default function GenerationProgress({ step, message, progress }: Props) {
  return (
    <div className="py-12 text-center">
      <div className="relative w-16 h-16 mx-auto mb-6">
        <div className="absolute inset-0 rounded-full border-4 border-accent/20"></div>
        <div 
          className="absolute inset-0 rounded-full border-4 border-accent border-t-transparent animate-spin"
        ></div>
      </div>
      
      <h3 className="text-lg font-semibold mb-2">
        {step === "scout" && "🔍 Recherche de sources..."}
        {step === "index" && "📊 Enrichissement..."}
        {step === "rank" && "⭐ Sélection meilleures sources..."}
        {step === "analyst" && "🧠 Génération analyse..."}
        {step === "done" && "✅ Terminé !"}
      </h3>
      
      <p className="text-sm text-muted mb-4">{message}</p>
      
      <div className="max-w-md mx-auto">
        <div className="h-2 bg-panel rounded-full overflow-hidden">
          <div 
            className="h-full bg-accent transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-xs text-muted mt-2">{progress}%</p>
      </div>
    </div>
  );
}
```

---

### **3. Gestion Erreurs** 🟡

**Messages clairs par type d'erreur** :

```typescript
const ERROR_MESSAGES = {
  no_sources_found: {
    title: "Aucune source trouvée",
    message: "Nous n'avons pas trouvé de sources académiques pour cette question.",
    suggestions: [
      "Reformulez avec des termes plus généraux",
      "Essayez en anglais",
      "Choisissez un template d'exemple",
    ],
  },
  timeout: {
    title: "Temps d'attente dépassé",
    message: "La génération prend plus de temps que prévu.",
    suggestions: [
      "Réessayez dans quelques instants",
      "Simplifiez votre question",
      "Contactez le support si le problème persiste",
    ],
  },
  empty_question: {
    title: "Question vide",
    message: "Veuillez entrer une question pour générer un brief.",
    suggestions: [
      "Tapez votre question dans le champ ci-dessus",
      "Ou cliquez sur un template d'exemple",
    ],
  },
};
```

---

## 🎨 **DESIGN IMPROVEMENTS**

### **Above the Fold Optimization**

**Réorganiser homepage pour que l'essentiel soit visible sans scroll** :

```
Viewport (1080p) :
┌─────────────────────────────────────┐
│ [Logo NomosX]      [Dashboard] [...]│ ← Nav
├─────────────────────────────────────┤
│                                     │
│         [Logo central animé]        │ ← Hero
│                                     │
│  "Quelle question explorer ?"       │ ← Titre
│  "Posez votre question..."          │ ← Tagline
│                                     │
│  ┌──────────────────────────────┐  │
│  │ [Textarea grande]            │  │ ← Question
│  │                              │  │
│  └──────────────────────────────┘  │
│                                     │
│  💡 Domaine : Climat               │ ← Smart Preview
│     ~18 sources · 45-60s            │
│                                     │
│  [○ Brief] [○ Council]              │ ← Mode
│                                     │
│  [Générer Brief (45-60s)] ←──────┐ │ ← CTA
│                                     │
└─────────────────────────────────────┘

[Templates en dessous, accessible par scroll]
[Stats en footer]
```

---

## ✅ **SCORE FINAL**

### **Clarté** : ⭐⭐⭐⭐ (4/5)
- ✅ Question claire
- ✅ Preview intelligent
- ⚠️ Manque feedback génération

### **Flow User-Friendly** : ⭐⭐⭐ (3/5)
- ✅ 1 champ → 1 clic
- ❌ Manque query params
- ⚠️ Pas de gestion erreurs

### **Professionnalisme** : ⭐⭐⭐⭐⭐ (5/5)
- ✅ Design glassmorphism premium
- ✅ Sélection intelligente
- ✅ Explications transparentes

### **Sélection Intelligente** : ⭐⭐⭐⭐⭐ (5/5)
- ✅ 11 domaines détectés
- ✅ Providers optimaux par domaine
- ✅ Quantité ajustée par complexité
- ✅ Preview temps réel

---

## 🚀 **RECOMMANDATION FINALE**

### **À FAIRE MAINTENANT** (30 min)
1. ✅ **Sélection intelligente** : FAIT ✨
2. 🔴 **Fix query params** : /brief et /council détectent `?q=...`
3. 🟡 **Loader basique** : Spinner + "Génération en cours..."

### **À FAIRE PHASE 1.5** (2h)
4. 🟡 **Loader avancé** : Progression + étapes
5. 🟡 **Gestion erreurs** : Messages clairs
6. 🟡 **Debounce preview** : Éviter lag

### **À FAIRE PHASE 2** (1 jour)
7. 🟢 **Above the fold** : Réorganiser homepage
8. 🟢 **Modal exemple** : Screenshot brief
9. 🟢 **Auto-save** : LocalStorage brouillon

---

**Version** : Audit Final v1.0  
**Statut** : ✅ **Sélection intelligente implémentée**  
**Prochaine étape** : 🔴 **Fix query params (/brief + /council)**
