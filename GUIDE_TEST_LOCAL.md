# Guide de Test Local — NomosX V1.1

**Serveur lancé** : http://localhost:3000

---

## 🎯 Fonctionnalités à Tester

### 1. **Settings Page** ⭐️⭐️ (NOUVEAU)
**URL** : http://localhost:3000/settings

**À tester** :

#### Onglet Topics
✅ Cliquer sur "Nouveau Topic"
✅ Remplir le formulaire :
   - Nom : "Test Carbon Pricing"
   - Query : "carbon tax emissions"
   - Tags : "climate, policy"
   - Description : "Test topic"
✅ Cliquer "Créer" (entrer admin key quand demandé)
✅ Voir le topic apparaître dans la liste
✅ Cliquer sur l'icône Edit (crayon)
✅ Modifier le nom
✅ Cliquer sur l'icône Delete (poubelle)

#### Onglet Monitoring
✅ Voir les statistiques :
   - Sources, Authors, Institutions
   - Topics, Briefs, Digests
   - Pending/Failed Jobs
   - Embeddings Coverage
   - Sources par provider

#### Onglet Ingestion
✅ Entrer une query : "artificial intelligence"
✅ Sélectionner providers (OpenAlex, Crossref)
✅ Cliquer "Créer l'ingestion run"
✅ Entrer admin key
✅ Voir le message de confirmation

### 2. **Page Radar** (Améliorée)
**URL** : http://localhost:3000

**À tester** :
✅ Voir les cards avec animations staggered
✅ Hover sur une card → effet glow
✅ Badge coloré selon qualityScore (> 70 = vert)
✅ Chart des sources par année

### 3. **Page Search** (Améliorée)
**URL** : http://localhost:3000/search

**À tester** :
✅ Entrer "carbon" dans la recherche
✅ Voir les résultats avec animation spring-in
✅ Skeleton shimmer pendant le loading
✅ Cards interactives avec hover

### 4. **Page Brief** (Améliorée)
**URL** : http://localhost:3000/brief

**À tester** :
✅ Entrer une question : "What is the impact of AI on employment?"
✅ Cliquer "Générer le brief"
✅ Voir le bouton en loading state (spinner)
✅ Attendre le brief généré
✅ Boutons "Exporter PDF" et "Partage public"

### 5. **Page Library** (Améliorée)
**URL** : http://localhost:3000/briefs

**À tester** :
✅ Voir la liste des briefs
✅ Cards avec variante "premium" pour FULL_PIPELINE
✅ Hover effects
✅ Animations fade-in

### 6. **Design Showcase** ⭐️ (NOUVEAU)
**URL** : http://localhost:3000/design-showcase

**À tester tous les composants** :
✅ Boutons (toutes variantes + loading)
✅ Badges (6 variantes)
✅ Cards (hoverable, premium, ai)
✅ Tooltips (4 positions)
✅ Modal (ouvrir/fermer)
✅ Skeletons (shimmer/pulse)
✅ Formulaires (Input, Textarea)
✅ Animations (fade, spring, slide)
✅ Système de couleurs

---

## 🎨 Design Améliorations à Observer

### Animations
- ✅ **Staggered animations** : Cards apparaissent une par une
- ✅ **Spring physics** : Animations naturelles (bounce)
- ✅ **Shimmer effects** : Loading states sophistiqués
- ✅ **Glow effects** : Hover states premium
- ✅ **Slide animations** : Transitions fluides

### Composants Premium
- ✅ **Badge** : 6 variantes colorées (success, warning, error, premium, ai)
- ✅ **Button** : Loading states, shimmer au hover, scale animations
- ✅ **Card** : Hoverable avec translate-y, 3 variantes
- ✅ **Modal** : Spring animation, backdrop blur
- ✅ **Toast** : Progress bar, 5 types
- ✅ **Tooltip** : 4 positions avec arrows

### Micro-interactions
- ✅ Hover sur buttons → shimmer effect
- ✅ Hover sur cards → lift + glow
- ✅ Active states → scale down
- ✅ Focus states → ring accent

---

## 🔧 API à Tester (via cURL ou Postman)

### Topics API (NOUVEAU)
```bash
# Liste topics
curl http://localhost:3000/api/topics

# Stats système
curl http://localhost:3000/api/stats

# Créer topic (nécessite admin key)
curl -X POST http://localhost:3000/api/topics \
  -H "x-admin-key: YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Topic",
    "query": "test query",
    "tags": ["test"]
  }'
```

### Search
```bash
curl "http://localhost:3000/api/search?q=carbon&limit=10"
```

### Brief
```bash
curl -X POST http://localhost:3000/api/briefs \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What is the impact of carbon taxes?"
  }'
```

---

## 📱 Responsive à Tester

### Desktop (> 1024px)
- ✅ Settings : 3 colonnes de cards
- ✅ Radar : 3 colonnes de cards
- ✅ Navigation complète visible

### Tablet (768px - 1024px)
- ✅ Settings : 2 colonnes de cards
- ✅ Navigation avec icônes + labels

### Mobile (< 768px)
- ✅ Settings : 1 colonne
- ✅ Navigation icônes seulement
- ✅ Onglets responsive

---

## 🎯 Scénario Test Complet

### 1. Premier lancement
1. Visiter http://localhost:3000
2. Voir la page Radar (peut être vide)
3. Aller dans Settings
4. Créer un premier topic
5. Lancer une ingestion depuis l'onglet Ingestion

### 2. Explorer le design
1. Aller sur /design-showcase
2. Tester tous les boutons
3. Ouvrir le modal
4. Tester les tooltips
5. Observer les animations

### 3. Tester les nouvelles features
1. Revenir sur Settings
2. Voir les stats dans Monitoring
3. Éditer le topic créé
4. Vérifier les counts (briefs, digests)

### 4. Test workflow complet
1. Brief → Générer un brief
2. Observer le loading state
3. Attendre le résultat
4. Exporter en PDF
5. Générer lien de partage

---

## ⚡️ Performance à Observer

### Temps de chargement
- ✅ Radar : < 1s
- ✅ Settings : < 1s
- ✅ Search : < 500ms
- ✅ Brief generation : ~10-30s (normal, appels OpenAI)

### Animations
- ✅ 60 FPS constant
- ✅ Pas de jank
- ✅ Transitions fluides
- ✅ Stagger naturel

---

## 🐛 Points d'Attention

### Peut nécessiter config
- ⚠️ Admin key pour créer/éditer/supprimer topics
- ⚠️ Database doit être configurée (voir .env)
- ⚠️ OpenAI API key pour générer briefs

### Fonctionnalités partielles (attendent config)
- ⚠️ Email : nécessite RESEND_API_KEY
- ⚠️ Sentry : nécessite SENTRY_DSN (optionnel)

---

## 🎉 Checklist Test Réussi

- [ ] Settings page fonctionne
- [ ] 3 onglets accessibles
- [ ] Topics CRUD opérationnel
- [ ] Monitoring affiche stats
- [ ] Design showcase complet
- [ ] Animations fluides
- [ ] Hover effects premium
- [ ] Modal/Tooltip fonctionnent
- [ ] Responsive OK (mobile/tablet/desktop)
- [ ] Pas d'erreurs console

---

**Guide Test Local V1.1** — Tester toutes les nouvelles fonctionnalités premium ⚡️
