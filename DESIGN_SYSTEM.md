# NomosX — Système de Design

**Version finale — Janvier 2026**

---

## 🎨 Philosophie

NomosX n'est pas un SaaS. C'est un think tank agentique.

Le design reflète :
- **Intelligence** : sobre, structuré, précis
- **Confiance** : profondeur, clarté, traçabilité
- **Futur** : moderne mais intemporel
- **Pouvoir calme** : pas de flashiness, force tranquille

---

## 🎯 Logo

### Logo principal (`logo-final.svg`)

**Composition** :
- **Symbole** : Constellation de signaux (nœuds + connexions)
  - Représente le flux de connaissance vers la décision
  - Géométrie simple, élégante
  - Couleur cyan (#5EEAD4) — le signal
- **Wordmark** : "NomosX"
  - Typographie : Space Grotesk 600
  - Couleur texte : #EDE9E2 (warm off-white)
  - "X" en accent cyan (#5EEAD4)
  - Tracking : -0.02em

**Usage** :
- Navigation principale
- Documents officiels
- Signatures email
- Réseaux sociaux (fond sombre)

### Logo compact (`logo-compact.svg`)

**Composition** :
- Symbole seul, 48×48px
- Utilisé comme favicon, app icon, avatar

**Règle d'or** :
- Toujours sur fond sombre (#0B0E12 ou équivalent)
- Ne jamais déformer
- Espace de respiration minimum : 16px autour

---

## 🎨 Palette de couleurs

### Base
```
Background         #0B0E12    Near-black, blue undertone
Panel              #10151D    Dark slate
Panel Secondary    #151B26    Graphite
Border             #232833    Subtle separation
Border Hover       #2D3440    Interactive state
```

### Texte
```
Primary            #EDE9E2    Warm off-white
Muted              #8B8F98    Secondary information
Dim                #5A5E66    Tertiary, disabled
```

### Accents
```
Cyan (Signal)      #5EEAD4    Primary accent, AI, signals
Blue (Primary)     #4C6EF5    Actions, links
Rose (Warning)     #FB7185    Contre-arguments, risks
Purple (Insight)   #A78BFA    Council, multi-perspectives
```

### Utilisation
- **Cyan** : Signaux, détection, AI, éléments clés
- **Blue** : Actions principales, navigation active
- **Rose** : Oppositions, limites, contre-arguments
- **Purple** : Conseil, perspectives multiples, synthèse

---

## ✍️ Typographie

### Fontes
```
Headline    Space Grotesk      400, 500, 600, 700
Body        Inter (fallback)   400, 500, 600
Mono        JetBrains Mono     400, 500, 600
```

### Hiérarchie
```
Hero Title          text-7xl (72px)      font-semibold    tracking-tight
Section Title       text-4xl (36px)      font-semibold    tracking-tight
Subsection          text-2xl (24px)      font-semibold
Card Title          text-xl (20px)       font-semibold
Body Large          text-lg (18px)       font-normal
Body                text-base (16px)     font-normal
Body Small          text-sm (14px)       font-normal
Caption             text-xs (12px)       font-normal
Code/Mono           text-sm (14px)       font-mono
```

### Règles
- **Titres** : Space Grotesk, tracking tight (-0.02em à -0.04em)
- **Corps** : Inter ou système, line-height 1.6-1.7
- **Code** : JetBrains Mono, pour IDs, sources, données
- **Contraste** : Toujours ≥ 4.5:1 (WCAG AA)

---

## 🧩 Composants

### Boutons

**Variants** :
```
primary      bg-accent (#5EEAD4)    Actions principales
secondary    border + hover         Actions secondaires
ghost        transparent + border   Actions tertiaires
ai           bg-accent + glow       Actions AI spécifiques
danger       bg-rose (#FB7185)      Actions destructives
```

**Tailles** :
```
sm     h-9   px-3   text-sm
md     h-11  px-4   text-sm
lg     h-12  px-5   text-base
```

**États** :
- Hover : scale(1.02) + brightness(110%)
- Active : scale(0.98)
- Disabled : opacity 50%
- Loading : spinner + opacity 0 sur texte

### Cartes

**Structure** :
```
Card
  CardHeader    (titre + metadata)
  CardContent   (contenu principal)
```

**Styles** :
- Background : #10151D
- Border : #232833
- Border Radius : 12px
- Hover : border-accent/40 + translateY(-2px)
- Shadow : subtile, organique

### Badges

**Usage** :
- Provider tags (OpenAlex, Crossref...)
- Quality scores
- Status indicators
- Topic tags

**Style** :
- px-2 py-1
- text-xs
- rounded-full
- border + bg subtle

---

## 📐 Grille & Espacement

### Conteneurs
```
max-w-4xl    Contenu texte (prose)
max-w-5xl    Hero sections
max-w-6xl    Grilles de cartes
max-w-7xl    Navigation, footers
```

### Espacement
```
Section padding    py-24 (96px vertical)
Card gap           gap-6 (24px)
Element gap        gap-4 (16px)
Inline gap         gap-2 (8px)
```

### Responsive
```
Mobile         < 768px    Single column
Tablet         768-1024   2 columns
Desktop        > 1024     3-4 columns
```

---

## 🎬 Animations

### Principes
- **Subtiles** : pas de mouvements agressifs
- **Organiques** : easing naturels (cubic-bezier)
- **Performantes** : transform + opacity uniquement
- **Significatives** : renforcer la hiérarchie

### Catalogue
```
fade-in           opacity + translateY(8px)    300ms ease-out
spring-in         scale + bounce               500ms cubic-bezier
scale-in          opacity + scale(0.9)         200ms ease-out
slide-in-right    translateX(20px)             300ms ease-out
glow-pulse        box-shadow pulse             2s infinite
```

### Hover
- Buttons : scale(1.02) + brightness
- Cards : translateY(-2px) + border glow
- Links : color transition 200ms

---

## 🌊 Effets visuels

### Canvas Hero
- Système de particules (80 nodes)
- Connexions dynamiques (< 120px)
- Couleur : cyan (#5EEAD4)
- Opacité : 0.2-0.6
- Vitesse : lente (0.3px/frame)
- Blend mode : screen

### Gradients
- **Barres de données** : from-rose to-rose/40
- **Glow effects** : radial-gradient cyan
- **Shimmer** : via-white/10 on hover

### Ombres
```
shadow-card     0 2px 8px rgba(0,0,0,0.1)
shadow-glow     0 0 20px rgba(76,110,245,0.2)
```

---

## 📱 Responsive

### Breakpoints
```
sm     640px
md     768px
lg     1024px
xl     1280px
2xl    1536px
```

### Stratégie
- **Mobile-first** : base styles pour mobile
- **Progressive enhancement** : ajouter complexité au-dessus
- **Touch-friendly** : min 44×44px pour targets
- **Readable** : max-w pour prose, jamais pleine largeur

---

## ♿ Accessibilité

### Contraste
- Texte principal : ≥ 7:1 (AAA)
- Texte secondaire : ≥ 4.5:1 (AA)
- Borders : ≥ 3:1

### Navigation
- Focus visible : 2px outline accent
- Skip links : pour navigation rapide
- ARIA labels : sur éléments interactifs
- Semantic HTML : `<nav>`, `<main>`, `<section>`

### Motion
- Respecter `prefers-reduced-motion`
- Désactiver animations si nécessaire

---

## 🚀 Performance

### Images
- SVG pour logos (vectoriel)
- WebP pour photos (compression)
- Lazy loading pour below-fold

### Animations
- GPU-accelerated (transform, opacity)
- Pas de layout shift
- RequestAnimationFrame pour canvas

### Fonts
- Preload critical fonts
- Font-display: swap
- Subset si possible (Latin uniquement)

---

## 📦 Assets

### Logo
```
/public/logo-final.svg       Logo principal (280×72)
/public/logo-compact.svg     Icon compact (48×48)
```

### Utilisation
```tsx
import Image from 'next/image';

// Logo principal
<img src="/logo-final.svg" alt="NomosX" width={280} height={72} />

// Favicon
<link rel="icon" href="/logo-compact.svg" type="image/svg+xml" />
```

---

## 🎓 Principes de design

1. **Clarity over cleverness**
   - Toujours privilégier la lisibilité
   - Pas de jeux typographiques complexes

2. **Depth through restraint**
   - La profondeur vient de la sobriété
   - Pas de gradients flashy, pas de néon

3. **Intelligence signals**
   - Chaque élément doit respirer l'intelligence
   - Typographie, espacement, précision

4. **Trust by design**
   - Citations toujours visibles
   - Sources toujours accessibles
   - Pas de boîte noire

5. **Timeless, not trendy**
   - Éviter les modes passagères
   - Viser l'intemporel (5+ ans)

---

## 🛠️ Implémentation

### Tailwind Config
```js
// tailwind.config.js
{
  colors: {
    bg: '#0B0E12',
    panel: '#10151D',
    panel2: '#151B26',
    border: '#232833',
    text: '#EDE9E2',
    muted: '#8B8F98',
    accent: '#5EEAD4',
    primary: '#4C6EF5',
    danger: '#FB7185',
    success: '#A78BFA',
  },
  fontFamily: {
    sans: ['Space Grotesk', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'Menlo', 'monospace'],
  }
}
```

### CSS Variables
```css
:root {
  --color-bg: #0B0E12;
  --color-text: #EDE9E2;
  --color-accent: #5EEAD4;
  --font-sans: 'Space Grotesk', sans-serif;
}
```

---

## ✅ Checklist qualité

Avant de livrer une interface :

- [ ] Logo correct, non déformé
- [ ] Palette respectée (pas de couleurs hors spec)
- [ ] Typographie cohérente (Space Grotesk + JetBrains Mono)
- [ ] Contraste WCAG AA minimum
- [ ] Animations subtiles, performantes
- [ ] Responsive mobile → desktop
- [ ] Focus visible sur tous les interactifs
- [ ] Loading states définis
- [ ] Error states définis
- [ ] Empty states définis

---

**Design System v1.0** — Production-ready.

*"Intelligence, trust, calm power."*
