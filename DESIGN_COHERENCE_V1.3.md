# 🎨 Cohérence Design — NomosX v1.3

**Date** : Janvier 2026  
**Status** : Guide de référence complet

---

## 🎯 Standards de Design

### Principe Core
**NomosX = Dark, sober, research-grade, premium**

- Pas de gradients flashy
- Pas de look "gaming"
- Pas de clichés startup
- Design intemporel et professionnel

---

## 🎨 Charte Graphique

### Palette Couleurs

```css
/* Backgrounds */
--bg: #0B0E12          /* Background principal */
--panel: #10151D       /* Panels et cards */
--panel2: #1C2130      /* Hover states */

/* Borders */
--border: #232833      /* Borders standards */

/* Text */
--text: #EDE9E2        /* Texte principal */
--muted: #8B8F98       /* Texte secondaire */

/* Accents */
--accent: #5EEAD4      /* Cyan principal (CTA, highlights) */
--accent-blue: #4C6EF5 /* Blue (actions) */
--accent-purple: #A78BFA /* Purple (insights) */
--accent-rose: #FB7185 /* Rose (warnings, problèmes) */
--accent-green: #10B981 /* Green (succès) */
```

### Typographie

```typescript
// Titres
font-family: "Space Grotesk", system-ui, sans-serif
font-weight: 600 (semibold)
letter-spacing: -0.02em

// Corps de texte
font-family: Inter, system-ui, sans-serif
font-weight: 400 (regular)

// Code/Data
font-family: "JetBrains Mono", monospace
```

### Tailles Texte

```css
/* Titres */
text-5xl: 3rem     /* 48px - Hero, grandes sections */
text-4xl: 2.25rem  /* 36px - Titres pages */
text-3xl: 1.875rem /* 30px - Titres sections */
text-2xl: 1.5rem   /* 24px - Sous-titres */
text-xl: 1.25rem   /* 20px - Texte mis en avant */
text-lg: 1.125rem  /* 18px - Texte large */

/* Corps */
text-base: 1rem    /* 16px - Texte standard */
text-sm: 0.875rem  /* 14px - Labels, metadata */
text-xs: 0.75rem   /* 12px - Petits labels */
```

---

## 🧩 Composants UI

### Buttons

```tsx
// Primary (Accent cyan)
<Button variant="primary" size="lg">
  Action Principale
</Button>

// Secondary (Transparent avec border)
<Button variant="secondary" size="md">
  Action Secondaire
</Button>

// Ghost (Transparent, hover panel)
<Button variant="ghost" size="sm">
  Action Tertiaire
</Button>

// AI (Gradient cyan → blue)
<Button variant="ai" loading={true}>
  Générer avec IA
</Button>
```

**Classes** :
- `rounded-2xl` (18px radius)
- `px-4 py-2` (padding standard)
- `transition-all` (animations fluides)
- `hover:border-accent/40` (hover subtil)

### Cards

```tsx
<Card variant="premium">
  <CardHeader>
    <h3>Titre Card</h3>
  </CardHeader>
  <CardContent>
    Contenu
  </CardContent>
</Card>
```

**Styles** :
- `bg-[#10151D]` (background panel)
- `border border-[#232833]` (border subtile)
- `rounded-xl` (12px radius)
- `hover:border-accent/40` (hover glow)

### Badges

```tsx
<Badge variant="accent">Nouveau</Badge>
<Badge variant="warning">Beta</Badge>
<Badge variant="success">Actif</Badge>
```

**Couleurs** :
- `accent` : cyan
- `warning` : rose
- `success` : green
- `default` : gray

### Icons

**Source** : Lucide-React uniquement

```tsx
import { FileText, Search, Radar } from "lucide-react";

<FileText size={24} className="text-accent" strokeWidth={1.5} />
```

**Standards** :
- `size={16-32}` selon contexte
- `strokeWidth={1.5}` (fin et élégant)
- Couleurs sémantiques

---

## 📐 Spacing & Layout

### Grid

```tsx
// 2 colonnes
<div className="grid md:grid-cols-2 gap-6">

// 3 colonnes
<div className="grid md:grid-cols-3 gap-6">

// 4 colonnes
<div className="grid md:grid-cols-4 gap-4">
```

### Spacing Vertical

```css
/* Sections */
py-28: 7rem (112px)   /* Grandes sections */
py-24: 6rem (96px)    /* Sections standard */
py-16: 4rem (64px)    /* Petites sections */

/* Entre éléments */
mb-16: 4rem (64px)    /* Entre grandes sections */
mb-12: 3rem (48px)    /* Entre sections */
mb-8: 2rem (32px)     /* Entre groupes */
mb-6: 1.5rem (24px)   /* Entre éléments */
mb-4: 1rem (16px)     /* Entre petits éléments */
```

### Container

```tsx
<div className="max-w-7xl mx-auto px-6">
  {/* Content */}
</div>
```

**Standards** :
- `max-w-7xl` (1280px) — Layout général
- `max-w-6xl` (1152px) — Sections contenu
- `max-w-4xl` (896px) — Texte long
- `px-6` (24px) — Padding horizontal

---

## 🎭 Effets Visuels

### Noise Background

```tsx
<div className="noise absolute inset-0" />
```

**CSS** :
```css
.noise {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='4' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E");
  pointer-events: none;
}
```

### AI Line (Subtle gradient animation)

```tsx
<div className="ai-line" />
```

**CSS** :
```css
.ai-line {
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(94, 234, 212, 0.3),
    transparent
  );
  animation: ai-scan 3s ease-in-out infinite;
}
```

### Hover Effects

```css
/* Cards */
hover:translate-y-[-4px]
hover:border-accent/40

/* Buttons */
hover:bg-panel
hover:border-border

/* Links */
hover:text-accent
```

### Animations

```css
/* Fade in */
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out;
}

/* Avec delay */
style={{ animationDelay: `${i * 100}ms` }}
```

---

## 🖼️ Logo

### Versions

1. **Logo Final** (`/logo-final.svg`) — 280×72
   - Hero page accueil
   - Footer
   - Présentation

2. **Logo Compact** (`/logo.svg`) — 180×48
   - Shell navigation
   - Pages app

3. **Logo Icon** (`/logo-compact.svg`) — 48×48
   - Favicon
   - App icons

### Composition

```
[Constellation]  NomosX
     ◉ ─────     (Space Grotesk, cyan X)
    / \
   ◉   ◉
```

**Couleurs** :
- Constellation : `#5EEAD4` (cyan)
- "Nomos" : `#EDE9E2` (text)
- "X" : `#5EEAD4` (cyan accent)

---

## 📱 Responsive

### Breakpoints

```css
sm: 640px   /* Petits tablets */
md: 768px   /* Tablets */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
```

### Patterns

```tsx
// Grid responsive
<div className="grid md:grid-cols-2 lg:grid-cols-3">

// Flex responsive
<div className="flex flex-col md:flex-row">

// Text responsive
<h1 className="text-3xl md:text-4xl lg:text-5xl">

// Hide/Show responsive
<span className="hidden sm:block">Desktop</span>
<span className="sm:hidden">Mobile</span>
```

---

## 🎯 Pages Standards

### Structure Shell

```tsx
<Shell>
  {/* Header */}
  <div className="flex items-end justify-between gap-4 flex-wrap mb-8">
    <div>
      <div className="flex items-center gap-3 mb-2">
        <Icon size={32} className="text-accent" />
        <h1 className="text-4xl font-semibold tracking-tight">
          Page Title
        </h1>
      </div>
      <p className="text-muted">
        Description brève de la page
      </p>
    </div>
    <div className="flex gap-2">
      <Badge>Feature 1</Badge>
      <Badge>Feature 2</Badge>
    </div>
  </div>

  {/* Content */}
  <div className="space-y-8">
    {/* Sections */}
  </div>
</Shell>
```

### Structure Card

```tsx
<Card variant="premium">
  <CardHeader>
    <div className="flex items-center gap-3 mb-2">
      <Icon size={24} className="text-accent" />
      <h2 className="text-xl font-semibold">Section Title</h2>
    </div>
    <p className="text-sm text-muted">Description</p>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

---

## ✅ Checklist Cohérence

### Pour Chaque Page

- [ ] Utilise `<Shell>` comme layout
- [ ] Header avec icon + titre + description
- [ ] Icons Lucide-React uniquement
- [ ] Couleurs de la palette
- [ ] Buttons avec variants corrects
- [ ] Cards avec `variant="premium"`
- [ ] Spacing cohérent (py-28, mb-16, etc.)
- [ ] Border radius `rounded-xl` ou `rounded-2xl`
- [ ] Hover effects subtils
- [ ] Animations `animate-fade-in`
- [ ] Responsive (`md:`, `lg:`)

### Pour Chaque Composant

- [ ] TypeScript strict
- [ ] Props typées
- [ ] Classes Tailwind cohérentes
- [ ] Pas de styles inline (sauf couleurs dynamiques)
- [ ] StrokeWidth 1.5 pour icons
- [ ] Transitions fluides
- [ ] Dark theme colors
- [ ] Accessible (labels, aria)

---

## 🚫 À Éviter

### Styles

❌ Gradients flashy  
❌ Emojis (sauf documentation)  
❌ Couleurs vives non-palette  
❌ Border radius > 24px  
❌ Animations trop rapides  
❌ Fonts autres que Space Grotesk/Inter  
❌ Icons autres que Lucide-React  

### Code

❌ Styles inline CSS  
❌ `style={}` sans raison  
❌ Classes dupliquées  
❌ Composants non-réutilisables  
❌ Magic numbers  
❌ Hardcoded colors  

---

## 🎨 Exemples Code

### Button Primary

```tsx
<Link href="/auth/register">
  <Button variant="primary" size="lg">
    Commencer gratuitement
  </Button>
</Link>
```

### Card Premium

```tsx
<Card variant="premium" className="hover:border-accent/40 transition-all">
  <CardHeader>
    <div className="flex items-center gap-3">
      <FileText size={24} style={{ color: "#5EEAD4" }} strokeWidth={1.5} />
      <h3 className="text-xl font-semibold">Research Briefs</h3>
    </div>
  </CardHeader>
  <CardContent>
    <p className="text-muted leading-relaxed">
      Synthèses structurées avec consensus et débats.
    </p>
  </CardContent>
</Card>
```

### Grid Responsive

```tsx
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map((item, i) => (
    <div
      key={i}
      className="animate-fade-in"
      style={{ animationDelay: `${i * 100}ms` }}
    >
      <Card variant="premium">
        {/* Content */}
      </Card>
    </div>
  ))}
</div>
```

---

## 📊 Score Cohérence

### Critères

```
Logo Usage              ☑  Cohérent partout
Couleurs Palette        ☑  Palette respectée
Typographie             ☑  Space Grotesk + Inter
Icons                   ☑  Lucide-React uniquement
Spacing                 ☑  Standards appliqués
Border Radius           ☑  rounded-xl/2xl
Hover Effects           ☑  Subtils et fluides
Animations              ☑  Fade-in avec delay
Responsive              ☑  md: lg: utilisés
Dark Theme              ☑  Partout
```

**Score Actuel : 10/10** ⭐⭐⭐

---

## 🔧 Maintenance

### Vérification Régulière

```bash
# 1. Vérifier imports icons
rg "from.*lucide-react" --stats

# 2. Vérifier couleurs hardcoded
rg "#[0-9A-Fa-f]{6}" --type tsx

# 3. Vérifier styles inline
rg "style=\\{\\{" --type tsx

# 4. Vérifier emojis (sauf docs)
rg "[😀-🙏]" app/
```

### Update Design System

Lorsque des changements sont apportés :

1. ✅ Mettre à jour `DESIGN_SYSTEM.md`
2. ✅ Mettre à jour ce fichier
3. ✅ Mettre à jour composants UI
4. ✅ Vérifier toutes les pages
5. ✅ Tester responsive

---

## 📚 Ressources

### Fichiers Référence

- `DESIGN_SYSTEM.md` — Spec complète
- `DESIGN_QUICKSTART.md` — Guide dev
- `DESIGN_COHERENCE_V1.3.md` — Ce fichier
- `components/ui/` — Composants UI

### Outils

- **Tailwind CSS** — Framework CSS
- **Lucide-React** — Icons
- **Space Grotesk** — Font titres (Google Fonts)
- **Inter** — Font corps (Tailwind default)

---

**NomosX v1.3** — Design cohérent et premium 🎨
