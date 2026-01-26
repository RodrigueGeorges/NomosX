# NomosX — Design Final

**Version 1.0 — Janvier 2026**

---

## 📦 Livrables

### 1. Logo final

**Fichiers** :
- `public/logo-final.svg` — Logo principal (280×72px)
- `public/logo-compact.svg` — Version compacte/icon (48×48px)

**Caractéristiques** :
- ✅ Wordmark "NomosX" avec symbole constellation
- ✅ Typographie Space Grotesk 600
- ✅ Couleur cyan (#5EEAD4) pour le "X" et le symbole
- ✅ Minimal, intellectuel, intemporel
- ✅ Fond sombre uniquement

**Usage** :
```tsx
// Navigation
<img src="/logo-final.svg" alt="NomosX" width={280} height={72} />

// Favicon
<link rel="icon" href="/logo-compact.svg" type="image/svg+xml" />
```

---

### 2. Page d'accueil finale

**Fichier** :
- `app/page.tsx` — Landing page premium (desktop)

**Sections** :
1. **Hero** — Titre + sous-titre + CTA + canvas animé
2. **Problème** — "La connaissance est lente, les décisions sont rapides"
3. **Solution** — Pipeline agentique (Scout → Index → Analyze → Synthesize → Publish)
4. **Ce que vous obtenez** — 4 cartes produit
5. **Pour qui** — 4 audiences cibles
6. **Confiance** — Métriques de transparence
7. **CTA final** — "Construisez votre think tank privé"
8. **Footer** — Navigation secondaire

**Caractéristiques** :
- ✅ Système de particules animées (canvas)
- ✅ Design sombre, sobre, premium
- ✅ Typographie hiérarchisée (Space Grotesk)
- ✅ Palette cohérente (cyan, blue, rose, purple)
- ✅ Animations subtiles (fade-in, hover effects)
- ✅ Responsive mobile → desktop

---

### 3. Système de design complet

**Fichier** :
- `DESIGN_SYSTEM.md` — Documentation complète

**Contenu** :
- Philosophie de design
- Logos (usage, variantes)
- Palette de couleurs (base, texte, accents)
- Typographie (hiérarchie, règles)
- Composants (boutons, cartes, badges)
- Grille & espacement
- Animations
- Effets visuels
- Responsive
- Accessibilité
- Performance
- Checklist qualité

---

### 4. Page de showcase design

**Fichier** :
- `app/design/page.tsx` — Catalogue visuel interactif

**Contenu** :
- Logos (principal + compact)
- Palette de couleurs complète
- Échelle typographique
- Tous les variants de boutons
- Tous les badges
- Exemples de cartes
- Démonstration d'espacement

**Accès** :
```bash
npm run dev
# Ouvrir http://localhost:3000/design
```

---

## 🚀 Démarrage rapide

### Installer les dépendances

```bash
npm install
```

### Lancer le serveur de développement

```bash
npm run dev
```

### Visualiser les pages

```
http://localhost:3000          → Page d'accueil finale
http://localhost:3000/design   → Showcase design system
```

---

## 🎨 Philosophie de design

### Émotions cibles
- **Trust** — Citations visibles, sources traçables
- **Intelligence** — Typographie précise, espacement maîtrisé
- **Calm power** — Pas de flashiness, force tranquille
- **Depth** — Profondeur par la sobriété
- **Precision** — Attention au détail
- **Future-readiness** — Moderne mais intemporel

### Principes
1. **Clarity over cleverness** — Lisibilité avant tout
2. **Depth through restraint** — La sobriété crée la profondeur
3. **Intelligence signals** — Chaque élément respire l'intelligence
4. **Trust by design** — Transparence totale
5. **Timeless, not trendy** — Viser 5+ ans de pertinence

---

## 🎯 Références visuelles

Le design s'inspire de :
- **Vercel** — Sobriété, précision, élégance
- **Linear** — Interface intelligente, animations subtiles
- **Notion** — Clarté, hiérarchie, lisibilité
- **Arc Browser** — Futurisme tempéré, design soigné
- **OpenAI** — Sérieux, confiance, innovation
- **Bloomberg** — Version épurée, command center

---

## 📐 Palette de couleurs

### Base
```
#0B0E12    Background (near-black)
#10151D    Panel (dark slate)
#151B26    Panel Secondary (graphite)
#232833    Border (subtle)
#2D3440    Border Hover
```

### Texte
```
#EDE9E2    Primary (warm off-white)
#8B8F98    Muted (secondary info)
#5A5E66    Dim (tertiary)
```

### Accents
```
#5EEAD4    Cyan → Signal, AI, accent principal
#4C6EF5    Blue → Actions, liens
#FB7185    Rose → Contre-arguments, risques
#A78BFA    Purple → Conseil, perspectives multiples
```

---

## ✍️ Typographie

### Fontes
```
Space Grotesk    Headlines, UI (Google Fonts)
Inter            Body (fallback système)
JetBrains Mono   Code, données, IDs (Google Fonts)
```

### Hiérarchie
```
Hero         text-7xl (72px)    font-semibold
Section      text-4xl (36px)    font-semibold
Subsection   text-2xl (24px)    font-semibold
Card         text-xl (20px)     font-semibold
Body Large   text-lg (18px)     font-normal
Body         text-base (16px)   font-normal
Small        text-sm (14px)     font-normal
Caption      text-xs (12px)     font-normal
```

---

## 🧩 Composants clés

### Boutons
```tsx
<Button variant="primary" size="lg">Action principale</Button>
<Button variant="secondary">Action secondaire</Button>
<Button variant="ghost">Action tertiaire</Button>
<Button variant="ai">Action AI</Button>
<Button loading>Chargement...</Button>
```

### Badges
```tsx
<Badge>Provider</Badge>
<Badge variant="success">QS 95</Badge>
<Badge variant="warning">QS 45</Badge>
```

### Cartes
```tsx
<Card hoverable>
  <CardHeader>
    <h3>Titre</h3>
  </CardHeader>
  <CardContent>
    <p>Contenu...</p>
  </CardContent>
</Card>
```

---

## 🎬 Animations

### Principes
- **Subtiles** — Pas de mouvements agressifs
- **Organiques** — Easing naturels
- **Performantes** — GPU-accelerated (transform + opacity)
- **Significantes** — Renforcer la hiérarchie

### Catalogue
```css
animate-fade-in          /* opacity + translateY */
animate-spring-in        /* scale + bounce */
animate-scale-in         /* scale simple */
animate-slide-in-right   /* translateX */
animate-glow-pulse       /* box-shadow */
```

---

## 📱 Responsive

### Breakpoints
```
sm     640px     Mobile
md     768px     Tablet
lg     1024px    Desktop
xl     1280px    Large desktop
```

### Stratégie
- Mobile-first (base styles)
- Progressive enhancement
- Touch-friendly (min 44×44px)
- Readable (max-w pour prose)

---

## ♿ Accessibilité

### Implémenté
- ✅ Contraste WCAG AA minimum (4.5:1)
- ✅ Focus visible (2px outline accent)
- ✅ Semantic HTML (`<nav>`, `<main>`, `<section>`)
- ✅ Font-size minimum 14px
- ✅ Touch targets ≥ 44×44px

### À implémenter
- [ ] ARIA labels sur éléments interactifs
- [ ] Skip links pour navigation rapide
- [ ] Support `prefers-reduced-motion`

---

## 🔧 Configuration technique

### Tailwind Config
Le design utilise Tailwind CSS avec une config custom :

```js
// tailwind.config.js
{
  colors: {
    bg: '#0B0E12',
    panel: '#10151D',
    text: '#EDE9E2',
    muted: '#8B8F98',
    accent: '#5EEAD4',
    // ... (voir tailwind.config.js)
  },
  fontFamily: {
    sans: ['Space Grotesk', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'monospace'],
  }
}
```

### CSS Variables
```css
/* app/globals.css */
:root {
  --color-bg: #0B0E12;
  --color-text: #EDE9E2;
  --color-accent: #5EEAD4;
  --font-sans: 'Space Grotesk', sans-serif;
}
```

---

## 📊 Performance

### Optimisations
- ✅ SVG pour logos (vectoriel, léger)
- ✅ Canvas animation avec RequestAnimationFrame
- ✅ Animations GPU-accelerated (transform + opacity)
- ✅ Font preload (Space Grotesk, JetBrains Mono)
- ✅ Lazy loading (composants below-fold)

### Métriques cibles
```
First Contentful Paint    < 1.5s
Time to Interactive       < 3.5s
Cumulative Layout Shift   < 0.1
Largest Contentful Paint  < 2.5s
```

---

## ✅ Checklist qualité

Avant de livrer une interface :

- [x] Logo correct, non déformé
- [x] Palette respectée
- [x] Typographie cohérente
- [x] Contraste WCAG AA
- [x] Animations subtiles
- [x] Responsive mobile → desktop
- [ ] Focus visible sur tous les interactifs
- [x] Loading states définis
- [ ] Error states définis
- [ ] Empty states définis

---

## 📂 Structure des fichiers

```
/
├── app/
│   ├── page.tsx              → Page d'accueil finale ✅
│   ├── design/page.tsx       → Showcase design system ✅
│   ├── layout.tsx            → Layout principal
│   └── globals.css           → Styles globaux
├── components/
│   └── ui/
│       ├── Button.tsx        → Composant bouton ✅
│       ├── Badge.tsx         → Composant badge
│       ├── Card.tsx          → Composant carte
│       └── ...
├── public/
│   ├── logo-final.svg        → Logo principal ✅
│   └── logo-compact.svg      → Logo compact ✅
├── DESIGN_SYSTEM.md          → Documentation complète ✅
├── DESIGN_README.md          → Ce fichier ✅
└── tailwind.config.js        → Config Tailwind
```

---

## 🎓 Pour aller plus loin

### Documentation complète
Lire `DESIGN_SYSTEM.md` pour :
- Spécifications détaillées
- Principes de design
- Guidelines d'utilisation
- Patterns UI avancés

### Page de showcase
Visiter `/design` pour :
- Voir tous les composants
- Tester les interactions
- Copier des exemples de code

### Itérations futures
- [ ] Mode clair (optionnel, si demandé)
- [ ] Thème custom par utilisateur
- [ ] Composants additionnels (tabs, modals, etc.)
- [ ] Storybook pour composants isolés

---

## 📞 Support

Pour toute question sur le design :
1. Consulter `DESIGN_SYSTEM.md` (spec complète)
2. Visiter `/design` (showcase interactif)
3. Vérifier `app/page.tsx` (implémentation de référence)

---

**Design final v1.0** — Prêt pour la production.

*"Intelligence, confiance, pouvoir calme."*
