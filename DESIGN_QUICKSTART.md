# NomosX Design — Démarrage rapide

**Pour les développeurs**

---

## 🚀 En 3 minutes

### 1. Voir le design final

```bash
npm run dev
```

Puis ouvrir :
- `http://localhost:3000` → Page d'accueil finale
- `http://localhost:3000/design` → Catalogue de composants

---

### 2. Utiliser le logo

```tsx
// Dans n'importe quel composant
<img src="/logo-final.svg" alt="NomosX" width={280} height={72} />

// Version compacte
<img src="/logo-compact.svg" alt="NomosX" width={48} height={48} />
```

---

### 3. Utiliser les composants

```tsx
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";

// Boutons
<Button variant="primary" size="lg">Action principale</Button>
<Button variant="secondary">Action secondaire</Button>
<Button variant="ai">Intelligence artificielle</Button>
<Button loading>Chargement...</Button>

// Badges
<Badge>OpenAlex</Badge>
<Badge variant="success">QS 95</Badge>

// Cartes
<Card hoverable>
  <CardHeader>
    <h3 className="font-semibold">Titre</h3>
  </CardHeader>
  <CardContent>
    <p className="text-sm text-muted">Contenu...</p>
  </CardContent>
</Card>
```

---

## 🎨 Classes Tailwind essentielles

### Couleurs
```tsx
// Background
className="bg-[#0B0E12]"        // Background principal
className="bg-[#10151D]"        // Panel
className="bg-[#151B26]"        // Panel secondaire

// Texte
className="text-[#EDE9E2]"      // Texte principal
className="text-[#8B8F98]"      // Texte muted
className="text-[#5A5E66]"      // Texte dim

// Accents
className="text-[#5EEAD4]"      // Cyan (signal)
className="text-[#4C6EF5]"      // Blue (primary)
className="text-[#FB7185]"      // Rose (warning)
className="text-[#A78BFA]"      // Purple (insight)

// Borders
className="border-[#232833]"    // Border normal
className="border-[#2D3440]"    // Border hover
```

### Typographie
```tsx
// Titres
className="text-7xl font-semibold tracking-tight"  // Hero
className="text-4xl font-semibold tracking-tight"  // Section
className="text-2xl font-semibold"                 // Subsection
className="text-xl font-semibold"                  // Card title

// Corps
className="text-lg"             // Body large
className="text-base"           // Body normal
className="text-sm"             // Body small
className="text-xs"             // Caption

// Code
className="font-mono text-sm"   // Code, IDs, données
```

### Espacement
```tsx
className="gap-2"               // 8px
className="gap-4"               // 16px
className="gap-6"               // 24px
className="gap-8"               // 32px

className="py-24"               // Section padding vertical
className="px-6"                // Content padding horizontal
```

---

## 🎬 Animations

### Classes d'animation
```tsx
className="animate-fade-in"             // Fade + translateY
className="animate-spring-in"           // Scale + bounce
className="animate-scale-in"            // Scale simple
className="animate-glow-pulse"          // Glow pulsant

// Delay d'animation
style={{ animationDelay: `${index * 50}ms` }}
```

### Transitions hover
```tsx
className="hover:scale-[1.02] transition-transform"
className="hover:text-accent transition-colors"
className="hover:border-accent/40 transition-all"
className="hover:translate-y-[-2px] transition-transform"
```

---

## 📐 Layout patterns

### Conteneurs
```tsx
// Contenu texte
<div className="max-w-4xl mx-auto px-6">

// Hero sections
<div className="max-w-5xl mx-auto px-6">

// Grilles de cartes
<div className="max-w-6xl mx-auto px-6">

// Navigation, footers
<div className="max-w-7xl mx-auto px-6">
```

### Grilles responsive
```tsx
// 2 colonnes tablet, 3 desktop
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

// 2 colonnes tablet, 4 desktop
<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

// Auto-fit (responsive automatique)
<div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
```

---

## 🧩 Patterns UI courants

### Card avec hover
```tsx
<Card 
  hoverable
  className="animate-fade-in"
  style={{ animationDelay: `${index * 50}ms` }}
>
  <CardHeader>
    <div className="flex items-center justify-between">
      <Badge>{provider}</Badge>
      <Badge variant="success">QS {score}</Badge>
    </div>
    <h3 className="mt-3 font-semibold leading-snug">
      {title}
    </h3>
  </CardHeader>
  <CardContent>
    <p className="text-sm text-muted">{description}</p>
  </CardContent>
</Card>
```

### Section avec titre
```tsx
<section className="py-24 border-t border-[#232833]">
  <div className="max-w-6xl mx-auto px-6">
    <h2 className="text-4xl font-semibold tracking-tight mb-16 text-center">
      Titre de section
    </h2>
    {/* Contenu */}
  </div>
</section>
```

### Navigation
```tsx
<nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-[#0B0E12]/80 border-b border-[#232833]">
  <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
    <img src="/logo-final.svg" alt="NomosX" width={140} height={36} />
    <div className="flex items-center gap-8">
      <Link href="/search" className="text-sm text-muted hover:text-text transition-colors">
        Recherche
      </Link>
      <Button variant="primary" size="sm">
        Entrer
      </Button>
    </div>
  </div>
</nav>
```

---

## 🎯 Checklist nouvelle page

Avant de créer une nouvelle page :

- [ ] Utiliser le layout avec `max-w-*` approprié
- [ ] Respecter la hiérarchie typographique (text-7xl → text-xs)
- [ ] Utiliser la palette de couleurs définie (pas de couleurs custom)
- [ ] Ajouter `border-[#232833]` pour les séparations
- [ ] Espacer les sections avec `py-24`
- [ ] Animer les éléments avec `animate-fade-in` + delay
- [ ] Tester le responsive mobile → desktop
- [ ] Vérifier les états hover sur les interactifs

---

## 📚 Ressources

### Documentation
- `DESIGN_SYSTEM.md` — Spec complète (20+ pages)
- `DESIGN_README.md` — Overview et philosophie
- `DESIGN_QUICKSTART.md` — Ce fichier

### Code de référence
- `app/page.tsx` — Implémentation page d'accueil
- `app/design/page.tsx` — Catalogue de composants
- `components/ui/` — Tous les composants UI

### Assets
- `public/logo-final.svg` — Logo principal
- `public/logo-compact.svg` — Logo compact
- `public/logo-presentation.svg` — Image de présentation

---

## 🔥 Raccourcis CLI

```bash
# Lancer le dev server
npm run dev

# Build production
npm run build

# Linter
npm run lint

# Tests
npm run test
```

---

## 💡 Tips

### Performance
- Toujours utiliser `transform` et `opacity` pour les animations
- Préférer les SVG aux PNG pour les logos
- Lazy load les images below-fold

### Accessibilité
- Contraste minimum 4.5:1 (WCAG AA)
- Touch targets minimum 44×44px
- Ajouter `alt` sur toutes les images

### Responsive
- Mobile-first (base styles)
- Breakpoints : sm (640px), md (768px), lg (1024px)
- Tester sur iPhone, iPad, Desktop

---

**Bon développement !** 🚀

*Questions ? Consulter `DESIGN_SYSTEM.md` ou visiter `/design`*
