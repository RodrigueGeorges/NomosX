# 🎨 AUDIT HOMEPAGE — Head of Design/UX

**Date** : 21 janvier 2026  
**Focus** : Problèmes visuels, hiérarchie, lisibilité

---

## 🚨 **PROBLÈMES IDENTIFIÉS**

### **1. Tagline Coupée / Mal Formatée** ⚠️
```jsx
// LIGNE 153-156 - PROBLÈME
<p className="text-xl md:text-2xl text-muted/90 ...">
  10 agents IA analysent 28M+ publications académiques et génèrent
  <span className="text-accent font-medium"> 4 perspectives distinctes</span> en 60 secondes
</p>

PROBLÈMES :
❌ Phrase trop longue (peut se couper bizarrement)
❌ "et génèrent" collé avec le span
❌ Manque de ponctuation claire
❌ Pas assez de contraste visuel entre les parties importantes
```

### **2. Headline Pas Assez Impactante** ⚠️
```jsx
// LIGNES 144-151
<h1 className="text-6xl md:text-7xl lg:text-8xl ...">
  <span className="block text-foreground mb-3">
    De la recherche
  </span>
  <span className="block bg-gradient-to-r ...">
    à la décision
  </span>
</h1>

PROBLÈMES :
❌ "De la recherche" / "à la décision" = trop court, manque d'impact
❌ mb-3 entre les deux = trop d'espace, casse le rythme
❌ Pas assez de "punch"
```

### **3. Features Cards Texte Trop Court** ⚠️
```jsx
// LIGNES 207-224
{
  icon: MessagesSquare,
  title: "4 Perspectives",
  desc: "Économique, Technique, Éthique, Politique",  // ❌ Trop court
  color: "accent"
}

PROBLÈMES :
❌ Descriptions trop courtes (1 ligne)
❌ Manque de détails sur la valeur
❌ Pas assez vendeuses
```

### **4. Stats Bar Pas Assez Visible** ⚠️
```jsx
// LIGNES 245-260
<div className="flex items-center justify-center gap-8 py-8 ...">
  {[
    { value: "28M+", label: "Sources académiques" },
    // ...
  ].map((stat, i) => (
    <div key={i} className="text-center">
      <div className="text-2xl ...">  // ❌ Trop petit
        {stat.value}
      </div>
      <div className="text-xs ...">   // ❌ Beaucoup trop petit
        {stat.label}
      </div>
    </div>
  ))}
</div>

PROBLÈMES :
❌ text-2xl pour les valeurs = trop petit (devrait être 3xl ou 4xl)
❌ text-xs pour les labels = illisible
❌ gap-8 = trop serré sur mobile
❌ Pas assez de contraste visuel
```

### **5. Logo Taille Pas Optimale** ⚠️
```jsx
// LIGNES 132-138
<img 
  src="/logo-final.svg" 
  alt="NomosX" 
  width={380}   // ❌ Peut-être trop grand sur mobile
  height={95}
  className="relative z-10"
/>

PROBLÈMES :
❌ 380px = peut dépasser sur mobile
❌ Pas de responsive (pas de max-w)
❌ Pas de fallback si logo manque
```

### **6. Badge "Think Tank" Pas Assez Premium** ⚠️
```jsx
// LIGNES 117-125
<div className="inline-flex items-center gap-2.5 px-4 py-2 ...">
  <Brain size={18} ... />
  <span className="text-sm ...">Le Think Tank Agentique</span>
  <div className="h-4 w-px bg-border" />
  <span className="text-xs ...">Propulsé par 10 agents IA</span>
</div>

PROBLÈMES :
❌ text-sm pour "Think Tank" = trop petit
❌ text-xs pour "10 agents" = beaucoup trop petit
❌ gap-2.5 = trop serré
❌ Manque de poids visuel
```

### **7. CTA Button Pas Assez Visible** ⚠️
```jsx
// LIGNES 187-198
<Button 
  variant="ai"
  size="default"  // ❌ Devrait être "lg"
  onClick={handleSubmit}
  disabled={!question.trim()}
  className="group"
>
  <span className="flex items-center">
    {isAuthenticated ? "Analyser" : "Commencer"}  // ❌ Trop court
    <ArrowRight size={16} ... />  // ❌ Trop petit
  </span>
</Button>

PROBLÈMES :
❌ size="default" = trop petit pour CTA principal
❌ "Commencer" = pas assez clair (commencer quoi ?)
❌ ArrowRight 16px = trop petit
❌ Manque d'urgence / incitation
```

### **8. Responsive Pas Optimal** ⚠️
```jsx
// Plusieurs endroits
text-6xl md:text-7xl lg:text-8xl  // ❌ text-8xl = trop grand même sur desktop
max-w-3xl mx-auto                 // ✅ OK
grid-cols-1 md:grid-cols-3        // ✅ OK mais gap peut être mieux

PROBLÈMES :
❌ text-8xl = 96px = énorme, peut dépasser
❌ Certains éléments pas de breakpoints mobile
❌ Stats bar peut être illisible sur mobile
```

---

## 💡 **RECOMMANDATIONS HEAD OF DESIGN**

### **✅ 1. Headline Plus Impactante**
```jsx
// AVANT
De la recherche
à la décision

// APRÈS
De la recherche académique
à la décision stratégique

OU MIEUX :
Votre Think Tank Personnel
Toujours Disponible

OU VERSION COURTE MAIS FORTE :
Recherche → Décision
En 60 Secondes
```

### **✅ 2. Tagline Reformulée**
```jsx
// AVANT (mal formaté)
10 agents IA analysent 28M+ publications académiques et génèrent
4 perspectives distinctes en 60 secondes

// APRÈS (clair, punchier)
<p>
  <strong>10 agents IA</strong> analysent <strong>28M+ publications</strong>,
  <br />
  génèrent <strong>4 perspectives distinctes</strong> en 60 secondes
</p>

OU VERSION PLUS VENDEUSE :
<p>
  Posez votre question stratégique.
  <br />
  <strong>10 agents IA autonomes</strong> vous livrent 
  <strong>4 analyses expertes</strong> en 60s.
</p>
```

### **✅ 3. Features Cards Plus Détaillées**
```jsx
// AVANT (trop court)
{
  title: "4 Perspectives",
  desc: "Économique, Technique, Éthique, Politique"
}

// APRÈS (plus vendeur)
{
  title: "4 Perspectives Expertes",
  desc: "Chaque question analysée sous 4 angles distincts par des agents spécialisés",
  details: "Économique • Technique • Éthique • Politique"
}
```

### **✅ 4. Stats Plus Visibles**
```jsx
// AVANT
text-2xl  // Valeurs
text-xs   // Labels

// APRÈS
text-4xl md:text-5xl font-bold  // Valeurs +++
text-sm                          // Labels (lisible)
gap-12 md:gap-16                 // Plus d'espace
```

### **✅ 5. Logo Responsive**
```jsx
// AVANT
width={380}

// APRÈS
width={380}
className="relative z-10 w-full max-w-[380px] h-auto"
```

### **✅ 6. Badge Think Tank Plus Premium**
```jsx
// AVANT
text-sm  // "Think Tank"
text-xs  // "10 agents"

// APRÈS
text-base font-semibold  // "Think Tank" +++
text-sm                  // "10 agents" (lisible)
gap-3 px-5 py-2.5       // Plus d'espace
```

### **✅ 7. CTA Plus Fort**
```jsx
// AVANT
size="default"
"Commencer"

// APRÈS
size="lg"
"Commencer Gratuitement"  // Plus clair + urgence
<ArrowRight size={20} />  // Plus visible
```

---

## 🎯 **HIÉRARCHIE VISUELLE OPTIMALE**

```
NIVEAU 1 (Plus Important) :
- Logo NomosX (380px responsive)
- Headline (text-6xl → text-7xl, pas 8xl)
- CTA Button (size="lg", couleur accent forte)

NIVEAU 2 (Important) :
- Badge "Think Tank Agentique" (text-base)
- Tagline (text-xl → text-2xl)
- Stats valeurs (text-4xl bold)

NIVEAU 3 (Secondaire) :
- Features titles (text-lg font-semibold)
- Stats labels (text-sm)
- Input placeholder

NIVEAU 4 (Tertiaire) :
- Features descriptions (text-sm)
- Keyboard hints (text-xs)
- Footer (text-sm)
```

---

## 📐 **TAILLES RECOMMANDÉES**

### **Typography Scale**
```css
Headline H1 : text-6xl md:text-7xl (60px → 72px)
Tagline : text-xl md:text-2xl (20px → 24px)
Badge Principal : text-base (16px)
Features Titles : text-lg font-semibold (18px)
Stats Values : text-4xl md:text-5xl (36px → 48px)
Stats Labels : text-sm (14px)
Body : text-base (16px)
Small : text-sm (14px)
Tiny : text-xs (12px)
```

### **Spacing Scale**
```css
Section : pt-20 pb-32 (80px → 128px)
Between elements : mb-12 md:mb-16 (48px → 64px)
Cards gap : gap-6 md:gap-8 (24px → 32px)
Stats gap : gap-12 md:gap-16 (48px → 64px)
```

---

## 🎨 **CONTRASTE & LISIBILITÉ**

### **Text Colors**
```css
Headline : text-foreground (100% blanc)
Gradient : from-primary via-accent to-primary
Body : text-muted/90 (90% opacity)
Secondary : text-muted/70 (70% opacity)
Tertiary : text-muted/50 (50% opacity)

❌ ÉVITER : text-muted/60 ou moins pour du texte important
✅ UTILISER : text-foreground ou text-muted/90 minimum
```

### **Contrast Ratios**
```
AAA (Optimal) : 7:1 → Headline, CTA, Stats
AA (Minimum) : 4.5:1 → Body, Features
A (Acceptable) : 3:1 → Small text, hints
```

---

## ✅ **CHECKLIST CORRECTIONS**

- [ ] Headline : reformuler + ajuster taille (text-7xl max)
- [ ] Tagline : reformater avec <br /> + strong sur chiffres
- [ ] Badge Think Tank : text-base + gap-3 + px-5
- [ ] Logo : ajouter max-w-[380px] responsive
- [ ] Features : descriptions plus longues + détails
- [ ] Stats : text-4xl values + text-sm labels + gap-12
- [ ] CTA : size="lg" + "Gratuitement" + ArrowRight 20px
- [ ] Responsive : vérifier tous les breakpoints
- [ ] Contraste : text-muted/90 minimum pour body
- [ ] Spacing : gap-12+ entre sections majeures

---

## 🎊 **VERDICT**

```
PROBLÈMES ACTUELS :
❌ Textes trop petits (stats, badge, CTA)
❌ Tagline mal formatée
❌ Headline manque de punch
❌ Features trop courtes
❌ Hiérarchie visuelle faible
❌ Responsive peut être mieux

APRÈS CORRECTIONS :
✅ Hiérarchie visuelle claire
✅ Tous les textes lisibles
✅ Éléments importants mis en valeur
✅ Premium feel maximal
✅ Responsive optimal
✅ Contraste AAA

→ HOMEPAGE GAME CHANGER
```

---

**Prêt à implémenter toutes ces corrections ? 🚀**
