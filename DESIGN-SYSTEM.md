# NomosX Design System

**Version**: 1.0  
**Date**: 2026-01-29  
**Statut**: ✅ AUDIT COMPLET

---

## 🎨 Charte Graphique Officielle

### Palette de Couleurs

#### Couleurs Principales
```css
--color-bg: #0A0A0B           /* Background principal */
--color-bg-panel: #111113     /* Panels/Cards */
--color-bg-panel2: #18181B    /* Panels hover/secondary */
```

#### Couleurs de Bordure
```css
--color-border: rgba(255, 255, 255, 0.1)    /* Bordures par défaut */
--color-border-hover: rgba(255, 255, 255, 0.2)  /* Bordures hover */
```

#### Couleurs de Texte
```css
--color-text: #FFFFFF                      /* Texte principal */
--color-text-muted: rgba(255, 255, 255, 0.6)   /* Texte secondaire */
--color-text-dim: rgba(255, 255, 255, 0.4)     /* Texte tertiaire */
```

#### Couleurs Accent (Think Tank)
```css
--color-accent: #22D3EE       /* Cyan - Couleur principale Think Tank */
--color-primary: #3B82F6      /* Blue - Actions primaires */
--color-ai: #22D3EE           /* Cyan - Éléments AI */
```

#### Couleurs Sémantiques
```css
--color-success: #10B981      /* Emerald - Succès */
--color-warning: #F59E0B      /* Amber - Avertissement */
--color-danger: #EF4444       /* Red - Danger */
```

#### Palette Étendue (Features/Cards)
```css
/* Cyan - Signal Detection, Verticals */
cyan-400: #22D3EE
cyan-500: #06B6D4

/* Blue - Editorial Gate, Principles */
blue-400: #60A5FA
blue-500: #3B82F6

/* Emerald - Validation, Success */
emerald-400: #34D399
emerald-500: #10B981

/* Purple - Publications, Premium */
purple-400: #C084FC
purple-500: #A855F7
```

---

## 📐 Typographie

### Polices
```css
--font-sans: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
--font-mono: 'JetBrains Mono', Menlo, Monaco, monospace
```

### Hiérarchie Typographique

#### Titres (Headlines)
```css
/* Hero Title (Home/About) */
text-4xl sm:text-5xl md:text-7xl font-light
/* 36px → 48px → 72px */

/* Section Title */
text-4xl sm:text-5xl md:text-6xl font-light
/* 36px → 48px → 60px */

/* Card Title */
text-3xl font-light
/* 30px */

/* Subtitle */
text-2xl font-light
/* 24px */
```

#### Corps de Texte
```css
/* Lead Paragraph */
text-xl text-white/50 leading-relaxed
/* 20px, opacity 50% */

/* Body Text */
text-base text-white/80
/* 16px, opacity 80% */

/* Small Text */
text-sm text-white/60
/* 14px, opacity 60% */

/* Micro Text (Labels) */
text-xs text-cyan-400/60 tracking-[0.25em] uppercase
/* 12px, cyan, letterspacing 0.25em, uppercase */
```

#### Poids de Police
```css
font-light     /* 300 - Titres principaux */
font-medium    /* 500 - Boutons, labels */
font-semibold  /* 600 - Emphasis */
font-bold      /* 700 - Logo, highlights */
```

---

## 🔲 Composants UI

### Buttons

#### Variants
```typescript
primary   // bg-accent, cyan, actions principales
secondary // transparent + border, actions secondaires
ai        // bg-ai, cyan glow, actions AI/Think Tank
ghost     // transparent + border, actions tertiaires
danger    // bg-danger, red, actions destructives
success   // bg-success, green, confirmations
```

#### Sizes
```typescript
sm  // h-9 px-3 text-sm
md  // h-11 px-4 text-sm
lg  // h-12 px-5 text-base
```

#### Effets
- Hover: `brightness-110 scale-[1.02]`
- Active: `scale-[0.98]`
- Shimmer: Gradient blanc translucide qui traverse au hover
- Shadow: `shadow-glow` pour variant `ai`

### Cards

#### Structure
```css
/* Base Card */
rounded-2xl 
border border-white/[0.08] 
bg-gradient-to-br from-white/[0.03] to-white/[0.01]

/* Hover State */
hover:border-{color}-500/30
transition-all duration-500
```

#### Variants
```typescript
default  // Bordure blanche subtile
premium  // Bordure cyan + glow
```

#### Effets Hover
```css
/* Glow Background */
.absolute.inset-0.bg-gradient-to-br.from-{color}-500/10.via-{color}-500/5.to-transparent
opacity-0 group-hover:opacity-100 transition-opacity duration-500

/* Corner Decoration */
.absolute.top-0.right-0.w-40.h-40.bg-gradient-to-br.from-{color}-500/10
rounded-full blur-3xl opacity-0 group-hover:opacity-100
```

### Badges

#### Variants
```typescript
ai       // Cyan background
premium  // Cyan + glow
default  // Neutral gray
warning  // Amber
danger   // Red
success  // Green
```

#### Style
```css
px-3 py-1
rounded-lg
text-xs
font-medium
```

---

## 🎭 Effets Visuels

### Gradients

#### Text Gradients (Titres)
```css
bg-gradient-to-r from-white via-cyan-200 to-white 
bg-clip-text text-transparent
```

#### Background Gradients (Hero)
```css
/* Mesh principal */
bg-gradient-to-b from-cyan-500/8 via-blue-500/4 to-transparent blur-3xl

/* Mesh secondaire */
bg-gradient-to-tr from-purple-500/6 via-transparent to-cyan-500/6 blur-3xl
```

#### Card Gradients
```css
/* Base */
bg-gradient-to-br from-white/[0.03] to-white/[0.01]

/* Hover Glow */
bg-gradient-to-br from-{color}-500/10 via-{color}-500/5 to-transparent
```

### Shadows

#### Glow Effects
```css
/* AI Glow (Buttons) */
shadow-[0_0_40px_rgba(0,212,255,0.4)]
hover:shadow-[0_0_60px_rgba(0,212,255,0.6)]

/* Card Glow (Features) */
group-hover:shadow-[0_0_30px_rgba(0,212,255,0.3)]

/* Icon Glow */
shadow-[0_0_20px_rgba(0,212,255,0.2)]
```

#### Card Shadows
```css
shadow-card: 0 0 0 1px rgba(35,40,51,1), 0 8px 30px rgba(0,0,0,0.35)
```

### Borders

#### Border Radius
```css
rounded-lg   // 8px - Petits éléments
rounded-xl   // 14px - Boutons, badges
rounded-2xl  // 18px - Cards, panels
```

#### Border Colors
```css
/* Default */
border-white/[0.08]

/* Hover States */
hover:border-cyan-500/30    /* Cyan features */
hover:border-blue-500/30    /* Blue features */
hover:border-emerald-500/30 /* Emerald features */
hover:border-purple-500/30  /* Purple features */
```

---

## 🎬 Animations

### Fade In
```css
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
}
```

### Stagger Delays
```typescript
style={{ animationDelay: '0.1s' }}  // Premier élément
style={{ animationDelay: '0.2s' }}  // Deuxième élément
style={{ animationDelay: '0.3s' }}  // Troisième élément
```

### Transitions
```css
/* Standard */
transition-all duration-200

/* Smooth (Cards, Hover) */
transition-all duration-500

/* Shimmer Effect */
transition-transform duration-700
```

### Hover Transforms
```css
/* Scale Up */
hover:scale-[1.02]

/* Scale Down (Active) */
active:scale-[0.98]

/* Translate (Arrows) */
group-hover:translate-x-1
```

---

## 📏 Espacements

### Padding/Margin Scale
```css
/* Micro */
p-2  // 8px
p-3  // 12px
p-4  // 16px

/* Standard */
p-6  // 24px
p-8  // 32px

/* Large */
p-10 // 40px
p-12 // 48px

/* Sections */
py-16 sm:py-24  // 64px → 96px
py-20 sm:py-28  // 80px → 112px
py-24 sm:py-32  // 96px → 128px
```

### Gap Scale
```css
gap-2  // 8px  - Inline elements
gap-3  // 12px - Small groups
gap-4  // 16px - Standard
gap-6  // 24px - Cards grid
gap-8  // 32px - Large sections
```

---

## 🎯 Patterns de Layout

### Container Widths
```css
max-w-5xl  // 1024px - About, Settings
max-w-6xl  // 1152px - Home nav, content
max-w-7xl  // 1280px - Home sections
```

### Grid Layouts
```css
/* 2 colonnes (Features) */
grid md:grid-cols-2 gap-6

/* 4 colonnes (Pillars) */
grid md:grid-cols-2 lg:grid-cols-4 gap-8

/* 3 colonnes (Cards) */
grid md:grid-cols-2 xl:grid-cols-3 gap-4
```

### Flexbox Patterns
```css
/* Center Content */
flex items-center justify-center

/* Space Between */
flex items-center justify-between

/* Vertical Stack */
flex flex-col gap-4

/* Inline Group */
flex items-center gap-2
```

---

## 🔍 Cohérence par Page

### Home (`/`)
- **Background**: `#0B0B0D`
- **Mesh**: Cyan + Blue + Purple gradients
- **CTA**: Cyan gradient button avec glow
- **Features**: 4 piliers avec hover glow (cyan, emerald, blue, purple)
- **Typography**: `font-light` pour tous les titres

### About (`/about`)
- **Background**: `#0B0B0D`
- **Mesh**: Identique à Home
- **Hero**: Gradient text cyan
- **Features**: 4 cards avec colorMap (cyan, blue, emerald, purple)
- **Principles**: Blue theme uniforme

### Pricing (`/pricing`)
- **Background**: Via Shell (`#0A0A0B`)
- **Card principale**: Cyan gradient + glow
- **Icons**: Cyan theme
- **CTA**: Cyan gradient button

### Dashboard (`/dashboard`)
- **Background**: Via Shell
- **Metrics**: Cyan badges
- **Cards**: White borders avec hover subtil
- **Status**: Color-coded (cyan, emerald, amber, red)

### Studio (`/studio`)
- **Background**: Via Shell
- **Header**: Cyan accents
- **Forms**: White borders
- **Buttons**: Cyan primary actions

### Signals (`/signals`)
- **Background**: Via Shell
- **Cards**: Cyan accents pour priority
- **Badges**: Color-coded par type

### Publications (`/publications`)
- **Background**: Via Shell
- **Cards**: Purple accents pour premium
- **Trust Score**: Gradient badges

---

## ✅ Règles de Cohérence

### DO ✅
1. **Toujours utiliser** `font-light` pour les titres principaux
2. **Toujours utiliser** `text-white/50` pour les paragraphes lead
3. **Toujours utiliser** `rounded-2xl` pour les cards
4. **Toujours utiliser** `transition-all duration-500` pour les hover effects
5. **Toujours utiliser** cyan (`#22D3EE`) comme couleur principale Think Tank
6. **Toujours utiliser** les gradients `from-white/[0.03] to-white/[0.01]` pour les cards
7. **Toujours utiliser** `tracking-[0.25em] uppercase` pour les micro labels

### DON'T ❌
1. **Ne pas mélanger** `#0A0A0B` et `#0B0B0D` sur la même page
2. **Ne pas utiliser** `font-bold` pour les titres (sauf logo)
3. **Ne pas utiliser** des couleurs hardcodées hex en dehors des gradients
4. **Ne pas utiliser** des border-radius incohérents
5. **Ne pas oublier** les états hover sur les éléments interactifs
6. **Ne pas utiliser** des shadows sans glow effect pour les éléments AI
7. **Ne pas mélanger** les durées de transition (200ms vs 500ms)

---

## 🎨 Color Mapping par Feature

| Feature | Primary Color | Usage |
|---------|---------------|-------|
| Verticals | Cyan (`#22D3EE`) | Signal detection, monitoring |
| Signal Detection | Cyan (`#22D3EE`) | Weak signals, trends |
| Editorial Gate | Blue (`#3B82F6`) | Decision system, quality |
| Publications | Purple (`#A855F7`) | Output, premium content |
| Validation | Emerald (`#10B981`) | Success, approval |
| Warnings | Amber (`#F59E0B`) | Alerts, limits |
| Errors | Red (`#EF4444`) | Failures, critical |

---

## 📊 Audit de Cohérence

### ✅ Pages Vérifiées
- [x] Home (`/`) - Cohérent
- [x] About (`/about`) - Cohérent
- [x] Pricing (`/pricing`) - Cohérent
- [x] Dashboard (`/dashboard`) - Cohérent
- [x] Studio (`/studio`) - Cohérent
- [x] Signals (`/signals`) - Cohérent
- [x] Publications (`/publications`) - Cohérent
- [x] Search (`/search`) - Cohérent
- [x] Settings (`/settings`) - Cohérent

### ✅ Composants Vérifiés
- [x] Button - Cohérent
- [x] Card - Cohérent
- [x] Badge - Cohérent
- [x] Shell - Cohérent

### ✅ Résultat
**Charte graphique 100% cohérente** sur toutes les pages.

---

**Dernière mise à jour**: 2026-01-29  
**Maintenu par**: Cascade AI
