# 🏷️ Système de Domaines NomosX

**Version** : 1.0  
**Date** : Janvier 2026

---

## 🎯 Vue d'ensemble

Le système de domaines permet de **classifier et filtrer les sources académiques** par domaine scientifique. Chaque source peut appartenir à plusieurs domaines avec un score de confiance (0-1).

---

## 📚 Domaines disponibles

NomosX utilise **8 domaines prédéfinis** :

### 1. 💼 Économie
- **Slug** : `economie`
- **Couleur** : Bleu `#4C6EF5`
- **Keywords** : economics, economy, fiscal, monetary, gdp, inflation, finance, trade, market, tax
- **JEL Codes** : E, F, G, H

### 2. 🔬 Sciences
- **Slug** : `science`
- **Couleur** : Violet `#A78BFA`
- **Keywords** : physics, chemistry, mathematics, astronomy, quantum, particle, theorem, experiment

### 3. 🌿 Écologie & Climat
- **Slug** : `ecologie`
- **Couleur** : Teal `#5EEAD4`
- **Keywords** : climate, environment, ecology, biodiversity, emissions, carbon, renewable, sustainability
- **JEL Codes** : Q

### 4. 🩺 Médecine & Santé
- **Slug** : `medecine`
- **Couleur** : Rose `#FB7185`
- **Keywords** : medicine, health, disease, treatment, therapy, vaccine, clinical, hospital
- **JEL Codes** : I

### 5. 💻 Technologie & IA
- **Slug** : `technologie`
- **Couleur** : Jaune `#FCD34D`
- **Keywords** : technology, ai, machine learning, algorithm, software, automation, robotics

### 6. 👥 Sociologie & Société
- **Slug** : `sociologie`
- **Couleur** : Orange `#F97316`
- **Keywords** : sociology, society, education, inequality, migration, culture, community
- **JEL Codes** : J, Z

### 7. ⚖️ Politique & Droit
- **Slug** : `politique`
- **Couleur** : Violet foncé `#8B5CF6`
- **Keywords** : politics, policy, law, government, regulation, democracy, legislation
- **JEL Codes** : K

### 8. ⚡ Énergie
- **Slug** : `energie`
- **Couleur** : Ambre `#FBBF24`
- **Keywords** : energy, power, electricity, renewable, solar, wind, nuclear, fossil
- **JEL Codes** : Q4

---

## 🛠️ Installation

### 1. Peupler la base de données

```bash
# Créer les 8 domaines
npm run seed:domains
```

### 2. Classifier les sources existantes

```bash
# Classifier automatiquement les sources
npm run classify
```

**Ce que fait le script** :
- Analyse titre + abstract de chaque source
- Calcule score de correspondance pour chaque domaine (via keywords)
- Crée liens `SourceDomain` si score ≥ 0.05
- Traite 1000 sources par batch

**Temps** : ~2-5 minutes pour 1000 sources

---

## 🔍 Utilisation

### Dashboard

La page `/dashboard` affiche automatiquement la **répartition par domaine** :

```typescript
// Visuel : 8 cards avec :
- Icône du domaine (colorée)
- Nom du domaine
- Nombre de sources
- Barre de progression (% du total)
```

### Recherche avec filtres

La page `/search` permet de **filtrer par domaines** :

```typescript
// Sélecteur compact :
- Clic sur domaine → ajouté aux filtres
- Badges visibles des domaines sélectionnés
- Bouton "Effacer" pour reset

// Résultats :
- Chaque source affiche ses 3 domaines principaux
- Badges colorés avec icône
```

**Exemple** :
1. Recherche : "carbon tax"
2. Filtres domaines : [Économie] [Écologie & Climat]
3. Résultats → Uniquement sources matchant ces 2 domaines

---

## 🧠 Algorithme de Classification

### Méthode : Keyword Matching

```javascript
// Pour chaque source :
text = title + abstract (lowercase)

// Pour chaque domaine :
matches = 0
for keyword in domain.keywords:
  if keyword in text:
    matches++

// Score = proportion de keywords trouvés
score = matches / total_keywords

// Lien créé si score ≥ 0.05 (5%)
if score >= 0.05:
  create SourceDomain(sourceId, domainId, score)
```

### Seuils

| Score      | Signification                    |
|------------|----------------------------------|
| 0.00-0.04  | Pas de lien (non pertinent)     |
| 0.05-0.14  | Lien faible (mention secondaire) |
| 0.15-0.29  | Lien moyen (sujet connexe)       |
| 0.30+      | Lien fort (sujet principal)      |

### Exemple

**Source** : "Carbon tax impacts on unemployment in Europe"

**Scores calculés** :
- Économie : **0.35** (fiscal, tax, unemployment, market, trade)
- Écologie & Climat : **0.28** (carbon, emissions, climate)
- Politique & Droit : **0.15** (policy, regulation)
- Énergie : **0.08** (energy, fossil)

**Liens créés** : Économie (0.35), Écologie (0.28), Politique (0.15), Énergie (0.08)

---

## 📊 Schéma Base de Données

### Modèles Prisma

```prisma
model Domain {
  id          String   @id @default(cuid())
  slug        String   @unique  // "economie", "science", etc.
  name        String             // "Économie"
  nameEn      String             // "Economics"
  icon        String             // "Wallet" (Lucide icon name)
  color       String             // "#4C6EF5"
  description String
  keywords    String[]           // Keywords pour matching
  jelCodes    String[]           // Codes JEL si applicable
  isActive    Boolean  @default(true)
  
  sources     SourceDomain[]
}

model SourceDomain {
  sourceId  String
  domainId  String
  score     Float    // 0-1, confiance de classification
  
  source    Source   @relation(fields: [sourceId], references: [id])
  domain    Domain   @relation(fields: [domainId], references: [id])
  
  @@id([sourceId, domainId])
}
```

### Relations

```
Source 1-N SourceDomain N-1 Domain

Exemple :
Source("carbon tax paper")
  → SourceDomain(score: 0.35) → Domain("economie")
  → SourceDomain(score: 0.28) → Domain("ecologie")
  → SourceDomain(score: 0.15) → Domain("politique")
```

---

## 🎨 Interface Utilisateur

### Composant `DomainSelector`

**Localisation** : `components/DomainSelector.tsx`

**Props** :
```typescript
{
  selected: string[],      // Slugs sélectionnés
  onChange: (slugs) => void,
  mode: "single" | "multiple",
  compact: boolean         // true pour filtres, false pour sélection détaillée
}
```

**Modes** :
1. **Compact** : Boutons horizontaux avec icônes (pour filtres)
2. **Extended** : Grid de cards avec descriptions (pour sélection initiale)

### Utils `getDomainsBySlugs`

**Localisation** : `lib/domains.ts`

```typescript
import { getDomainsBySlugs } from "@/lib/domains";

const domains = getDomainsBySlugs(["economie", "ecologie"]);
// Returns: [Domain, Domain]

// Affichage des badges :
domains.map(domain => {
  const Icon = domain.icon; // Lucide component
  return <Badge><Icon size={12} />{domain.name}</Badge>
})
```

---

## 🚀 API Endpoints

### GET `/api/domains`

**Description** : Retourne distribution des domaines

**Query params** : Aucun

**Response** :
```json
{
  "domains": [
    {
      "slug": "economie",
      "name": "Économie",
      "nameEn": "Economics",
      "icon": "Wallet",
      "color": "#4C6EF5",
      "description": "Économie, finance, politique fiscale...",
      "sourceCount": 245,
      "percentage": 35.2
    },
    ...
  ],
  "total": 695
}
```

### GET `/api/search?domains=economie,ecologie`

**Description** : Recherche avec filtre domaines

**Query params** :
- `q` : Query string (required)
- `domains` : Comma-separated slugs (optional)
- `provider` : Provider filter (optional)
- `minYear` : Year filter (optional)

**Response** :
```json
{
  "results": [
    {
      "id": "...",
      "title": "...",
      "domains": [
        {
          "slug": "economie",
          "name": "Économie",
          "icon": "Wallet",
          "color": "#4C6EF5",
          "score": 0.35
        }
      ]
    }
  ]
}
```

---

## 🔧 Maintenance

### Ajouter un nouveau domaine

1. **Modifier** `lib/domains.ts` :
```typescript
export const PREDEFINED_DOMAINS: Domain[] = [
  // ... existing domains
  {
    slug: "agriculture",
    name: "Agriculture",
    nameEn: "Agriculture",
    icon: Sprout, // Import from lucide-react
    color: "#84CC16",
    description: "Agriculture, food systems, farming",
    keywords: ["agriculture", "farming", "crop", "livestock", "food"],
    jelCodes: ["Q1"],
  },
];
```

2. **Modifier** `scripts/seed-domains.mjs` (ajouter dans DOMAINS array)

3. **Modifier** `scripts/classify-sources.mjs` (ajouter dans DOMAINS array)

4. **Réexécuter** :
```bash
npm run seed:domains
npm run classify
```

### Reclassifier toutes les sources

```bash
# Dans scripts/classify-sources.mjs, modifier la requête :
const sources = await prisma.source.findMany({
  // Supprimer le filtre where: { domains: { none: {} } }
  take: 1000,
});

# Puis lancer :
npm run classify
```

### Ajuster les seuils

```javascript
// Dans classify-sources.mjs, ligne ~180 :
if (score >= 0.05) {  // Seuil actuel : 5%
  // Changer à 0.10 pour être plus strict
  // Changer à 0.03 pour être plus permissif
}
```

---

## 📈 Métriques

### Queries utiles

```sql
-- Sources par domaine
SELECT d.name, COUNT(sd.sourceId) as count
FROM "Domain" d
LEFT JOIN "SourceDomain" sd ON d.id = sd."domainId"
GROUP BY d.id
ORDER BY count DESC;

-- Sources multi-domaines (≥2)
SELECT s.title, COUNT(sd."domainId") as domain_count
FROM "Source" s
JOIN "SourceDomain" sd ON s.id = sd."sourceId"
GROUP BY s.id
HAVING COUNT(sd."domainId") >= 2
ORDER BY domain_count DESC;

-- Score moyen par domaine
SELECT d.name, AVG(sd.score) as avg_score
FROM "Domain" d
JOIN "SourceDomain" sd ON d.id = sd."domainId"
GROUP BY d.id
ORDER BY avg_score DESC;
```

---

## 🎯 Roadmap

### Phase 1 : Actuel ✅
- [x] 8 domaines prédéfinis
- [x] Classification keyword-based
- [x] Filtres sur /search
- [x] Distribution sur /dashboard
- [x] Badges colorés sur résultats

### Phase 2 : Améliorations (Q1 2026)
- [ ] Classification GPT-4 pour cas ambigus
- [ ] Fine-tuning modèle classification (Naive Bayes ou Logistic Regression)
- [ ] Auto-suggestion domaines nouveaux (clustering)
- [ ] Hiérarchie domaines (sous-domaines)

### Phase 3 : Advanced (Q2 2026)
- [ ] Graph de co-occurrences domaines
- [ ] Trending domains (évolution temporelle)
- [ ] Domaines personnalisés par utilisateur (avec auth)
- [ ] Export domain analytics (PDF reports)

---

## 🐛 Troubleshooting

### "No domains in database"
→ Lancez `npm run seed:domains`

### "Sources not classified"
→ Lancez `npm run classify`

### "Domain icons not showing"
→ Vérifiez que Lucide icons sont importés dans `lib/domains.ts`

### "Low classification scores"
→ Ajustez keywords dans `lib/domains.ts` ou `scripts/classify-sources.mjs`

---

## 📚 Documentation API

Voir `README.md` section "API Routes" pour détails complets.

---

**NomosX v1.0** — Système de Domaines
