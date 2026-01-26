# Design System Agentique - NomosX

**Date**: 2026-01-23  
**Version**: Unique & Cohérente avec l'ADN Think Tank Agentique

---

## 🎯 Concept : Nœuds Agentiques

Au lieu d'utiliser des checkmarks génériques, nous utilisons **des nœuds pulsant** qui rappellent :

1. **L'architecture agentique** : réseau distribué d'agents IA
2. **Le logo NomosX** : système de nœuds interconnectés
3. **L'intelligence active** : pulse subtil = agents en activité

---

## 💎 Anatomie d'un Nœud

```tsx
<div className="relative flex-shrink-0 mt-1.5">
  {/* Nœud principal */}
  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
  
  {/* Core pulsant (agent actif) */}
  <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 rounded-full bg-cyan-400/60 animate-pulse"></div>
</div>
```

### Structure

| Élément | Taille | Opacité | Animation |
|---------|--------|---------|-----------|
| **Nœud principal** | 1.5px × 1.5px | 100% | Statique |
| **Core interne** | 0.5px × 0.5px | 60% | Pulse |

### Positionnement

```css
mt-1.5       /* Alignement vertical avec le texte */
flex-shrink-0 /* Ne se compresse pas */
relative     /* Pour le core absolu */
```

---

## 🎨 Couleurs par Service

Chaque service a sa couleur, qui se décline sur :
- Icon background
- Icon border
- Card hover
- **Nœuds des bullet points**

| Service | Couleur | Usage Nœud |
|---------|---------|------------|
| **Brief** | `bg-cyan-400` | Analyse dialectique |
| **Council** | `bg-blue-400` | Multi-perspectives |
| **Radar** | `bg-emerald-400` | Signaux faibles |
| **Library** | `bg-purple-400` | Mémoire institutionnelle |

---

## 🔄 Animation Pulse

```css
animate-pulse  /* Tailwind native: fade in/out 2s infinite */
```

### Pourquoi Pulse ?

✅ **Vivant** : Suggère une activité continue (agents qui tournent)  
✅ **Subtil** : Pas distrayant, juste présent  
✅ **Premium** : Plus sophistiqué qu'un checkmark statique  
✅ **Cohérent** : Rappelle le concept "agentique"  

---

## 📍 Où Sont Utilisés les Nœuds ?

### 1. Trust Indicators (Hero)

```tsx
<div className="flex items-center gap-2">
  <div className="relative">
    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
    <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 rounded-full bg-cyan-400/60 animate-pulse"></div>
  </div>
  <span>Sans inscription</span>
</div>
```

**Couleur** : Cyan (couleur principale NomosX)

---

### 2. Features Lists (Services)

Chaque service utilise **sa couleur** :

#### Brief (Cyan)
```tsx
<ul className="space-y-2">
  <li className="flex items-start gap-2">
    <div className="relative flex-shrink-0 mt-1.5">
      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
      <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 rounded-full bg-cyan-400/60 animate-pulse"></div>
    </div>
    <span>10 sections analytiques</span>
  </li>
</ul>
```

#### Council (Blue)
```tsx
bg-blue-400 / bg-blue-400/60
```

#### Radar (Emerald)
```tsx
bg-emerald-400 / bg-emerald-400/60
```

#### Library (Purple)
```tsx
bg-purple-400 / bg-purple-400/60
```

---

## ✅ Avantages de Ce Design

### 1. Unique
❌ Pas de checkmarks génériques (vu partout)  
✅ Système custom qui rappelle l'ADN agentique

### 2. Cohérent
- Reprend le pattern du logo (nœuds)
- Décliné par couleur de service
- Présent dans toute la home

### 3. Premium
- Subtil et sophistiqué
- Animation douce (pas aggressive)
- Détail soigné (double cercle)

### 4. Sémantique
- Nœud = Agent
- Pulse = Activité
- Réseau = Intelligence collective

---

## 🎨 Comparaison Visuelle

### Avant (Générique)

```
✓ 10 sections analytiques    ← CheckCircle2 (vu partout)
✓ Sources vérifiables
✓ Export PDF
```

### Après (Unique)

```
● 10 sections analytiques     ← Nœud agentique pulsant
● Sources vérifiables         (couleur = service)
● Export PDF
```

**Résultat** :  
- Plus subtil  
- Plus cohérent avec l'ADN  
- Plus premium  
- Unique à NomosX  

---

## 🔧 Guidelines d'Usage

### Quand Utiliser les Nœuds ?

✅ **Lists de features** : Caractéristiques des services  
✅ **Trust indicators** : Badges de confiance  
✅ **Benefits** : Avantages clés  

### Quand NE PAS Utiliser ?

❌ **Listes longues** (>6 items) → Utiliser tirets simples  
❌ **Contenus narratifs** → Utiliser prose normale  
❌ **Navigation** → Utiliser icônes appropriées  

---

## 🎯 Variations Possibles (Futur)

Si besoin d'enrichir le système :

### Nœud Connecté
```tsx
<div className="flex items-start gap-2">
  <div className="relative flex-shrink-0 mt-1.5">
    {/* Nœud principal */}
    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
    
    {/* Core pulsant */}
    <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 rounded-full bg-cyan-400/60 animate-pulse"></div>
    
    {/* Ligne de connexion (optionnel) */}
    <div className="absolute top-2 left-0.5 w-px h-4 bg-cyan-400/20"></div>
  </div>
  <span>Feature connectée</span>
</div>
```

### Nœud Prioritaire
```tsx
{/* Nœud plus gros pour élément important */}
<div className="w-2 h-2 rounded-full bg-cyan-400"></div>
<div className="absolute top-0.5 left-0.5 w-1 h-1 rounded-full bg-cyan-400/60 animate-pulse"></div>
```

### Nœud Inactif
```tsx
{/* Pas d'animation pulse = agent dormant */}
<div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
```

---

## 📊 Spécifications Techniques

### Tailles

| Variant | Outer | Inner | Usage |
|---------|-------|-------|-------|
| **Default** | 1.5px | 0.5px | Standard lists |
| **Large** | 2px | 1px | Hero/Priority |
| **Small** | 1px | 0.3px | Dense lists |

### Couleurs

| State | Opacity | Usage |
|-------|---------|-------|
| **Active** | 100% | Outer node |
| **Pulse** | 60% | Inner core |
| **Inactive** | 20% | Disabled |

### Animation

```css
/* Tailwind animate-pulse */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Duration: 2s */
/* Easing: ease-in-out */
/* Loop: infinite */
```

---

## 🎓 Philosophie Design

### Think Tank Agentique

```
Think Tank → Réseau d'experts → Nœuds interconnectés
    +
Agentique → Agents IA distribués → Activité pulsante
    =
Nœuds Agentiques Pulsants
```

### Métaphore Visuelle

| Concept | Représentation | Implémentation |
|---------|----------------|----------------|
| **Agent** | Nœud (cercle) | `w-1.5 h-1.5 rounded-full` |
| **Activité** | Pulse (fade) | `animate-pulse` |
| **Réseau** | Couleur cohérente | `bg-cyan-400` etc. |
| **Spécialisation** | Couleur par service | Brief=cyan, Council=blue... |

---

## ✅ Checklist Cohérence

- [x] Tous les CheckCircle2 remplacés
- [x] Couleurs par service respectées
- [x] Animation pulse présente partout
- [x] Tailles cohérentes (1.5px/0.5px)
- [x] Positionnement aligné (mt-1.5)
- [x] Import CheckCircle2 supprimé

---

## 🚀 Impact

### Avant

```tsx
import { CheckCircle2 } from "lucide-react";

<CheckCircle2 size={14} className="text-cyan-400" />
```

**Poids** : 1 composant React importé  
**Unicité** : 0/10 (vu partout)  
**Cohérence** : 5/10 (pas lié à l'ADN)

### Après

```tsx
<div className="relative flex-shrink-0 mt-1.5">
  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
  <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 rounded-full bg-cyan-400/60 animate-pulse"></div>
</div>
```

**Poids** : Pure CSS (plus léger)  
**Unicité** : 10/10 (design custom NomosX)  
**Cohérence** : 10/10 (100% aligné avec ADN agentique)

---

## 📐 Exemples Complets

### Hero Trust Indicators

```tsx
<div className="flex items-center gap-2 text-xs text-white/50">
  <div className="relative flex-shrink-0">
    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
    <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 rounded-full bg-cyan-400/60 animate-pulse"></div>
  </div>
  <span>Sans inscription</span>
</div>
```

### Brief Features (Cyan)

```tsx
<li className="flex items-start gap-2">
  <div className="relative flex-shrink-0 mt-1.5">
    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
    <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 rounded-full bg-cyan-400/60 animate-pulse"></div>
  </div>
  <span>10 sections analytiques</span>
</li>
```

### Council Features (Blue)

```tsx
<li className="flex items-start gap-2">
  <div className="relative flex-shrink-0 mt-1.5">
    <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
    <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 rounded-full bg-blue-400/60 animate-pulse"></div>
  </div>
  <span>4 perspectives distinctes</span>
</li>
```

### Radar Features (Emerald)

```tsx
<li className="flex items-start gap-2">
  <div className="relative flex-shrink-0 mt-1.5">
    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
    <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 rounded-full bg-emerald-400/60 animate-pulse"></div>
  </div>
  <span>Novelty score ≥60</span>
</li>
```

### Library Features (Purple)

```tsx
<li className="flex items-start gap-2">
  <div className="relative flex-shrink-0 mt-1.5">
    <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
    <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 rounded-full bg-purple-400/60 animate-pulse"></div>
  </div>
  <span>Recherche sémantique</span>
</li>
```

---

## 🎯 Résultat Final

### Cohérence Totale

```
Logo NomosX (réseau de nœuds)
    ↓
Nœuds agentiques dans features
    ↓
Couleurs par service
    ↓
Animation pulse (agents actifs)
    =
Design System 100% cohérent avec l'ADN
```

### Unique à NomosX

❌ Personne d'autre n'utilise ce pattern  
✅ Immédiatement reconnaissable  
✅ Renforce l'identité "Think Tank Agentique"  
✅ Premium et subtil  

---

**Status** : ✅ Unique & Cohérent  
**Déploiement** : Lance `npm run dev` pour voir  
**Identité** : 100% alignée avec Think Tank Agentique

---

**Ce système visuel est désormais la signature de NomosX.** 💎
