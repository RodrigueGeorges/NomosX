# 🚀 Installation Sélecteur de Domaines

**Version** : v1.2 — Classification automatique par domaines

---

## ✅ Ce Qui A Été Implémenté

### Phase 1 : UI & Foundation ✅
- ✅ Système de domaines prédéfinis (8 domaines)
- ✅ Composant DomainSelector
- ✅ Intégration page Search

### Phase 2 : Backend & Classification ✅
- ✅ Modèles DB (Domain + SourceDomain)
- ✅ Agent de classification automatique
- ✅ API filtering par domaines
- ✅ Stats domaines dans dashboard

---

## 📦 Installation (5 minutes)

### Étape 1 : Migration Database

```bash
# Générer client Prisma avec nouveaux modèles
npm run prisma:gen

# Pousser le schéma vers la DB
npm run db:push
```

Cette commande va créer les nouvelles tables :
- `Domain` — Domaines prédéfinis
- `SourceDomain` — Liens sources ↔ domaines avec score

### Étape 2 : Seed Domaines

```bash
# Peupler la base avec les 8 domaines prédéfinis
npm run seed:domains
```

Résultat attendu :
```
🌱 Seeding domains...

  ✓ Created: Économie (economie)
  ✓ Created: Sciences (science)
  ✓ Created: Écologie & Climat (ecologie)
  ✓ Created: Médecine & Santé (medecine)
  ✓ Created: Technologie & IA (technologie)
  ✓ Created: Sociologie & Société (sociologie)
  ✓ Created: Politique & Droit (politique)
  ✓ Created: Énergie (energie)

🎉 Seeding complete!
   Created: 8
   Total: 8 domains
```

### Étape 3 : Classifier Sources Existantes (optionnel)

Si vous avez déjà des sources dans la base :

```bash
# Classifier toutes les sources (par batch de 100)
npm run classify

# Ou spécifier une limite
node scripts/classify-sources.mjs --limit 500
```

Résultat attendu :
```
🔍 Classifying sources...

  Total sources: 245
  Unclassified: 245
  Processing batch: 100

  Processing batch of 50...
    ✓ Classified: 50
  Processing batch of 50...
    ✓ Classified: 50

📊 Domain Distribution:

  Économie               142  ████████████████████
  Écologie & Climat       87  ████████████
  Médecine & Santé        54  ████████
  Sciences                32  █████
  Technologie & IA        28  ████
  Société                 21  ███
  Politique & Droit       18  ██
  Énergie                 12  ██

🎉 Classification complete!
   Classified: 100
```

### Étape 4 : Démarrer

```bash
npm run dev
```

Ouvrir `http://localhost:3000/search` pour voir le sélecteur de domaines !

---

## 🎯 Utilisation

### Page Search

1. **Ouvrir** `/search`
2. **Sélectionner domaines** (optionnel) :
   - Cliquer sur 💰 Économie, 🌍 Écologie, etc.
   - Multi-sélection possible
   - Badge "Sélectionnés" apparaît
3. **Taper query** : ex. "carbon tax"
4. **Rechercher**
5. **Résultats filtrés** par domaines sélectionnés
6. **Chaque source** affiche ses domaines (badges colorés)

### Dashboard

1. **Ouvrir** `/dashboard`
2. **Voir section "Répartition par domaine"**
3. **Stats visuelles** :
   - Nombre de sources par domaine
   - Barre de progression colorée
   - Pourcentage du total

---

## 🤖 Comment Ça Marche

### Classification Automatique

Chaque nouvelle source est **automatiquement classifiée** par le pipeline INDEX :

1. **SCOUT** collecte sources → DB
2. **INDEX** enrichit sources :
   - Auteurs (ORCID)
   - Institutions (ROR)
   - **Classification domaines** ← NOUVEAU
3. **Classification** analyse :
   - Mots-clés dans title + abstract + topics
   - JEL codes (pour économie)
   - Score de confiance 0-1

**Exemple** :
```
Source : "Carbon Tax Impact on EU Emissions"
Abstract : "...climate policy...carbon pricing...greenhouse gas..."

Classification automatique :
→ 🌍 Écologie (score 0.89)
→ 💰 Économie (score 0.76)
→ ⚖️ Politique (score 0.45)
```

### Filtrage Intelligent

Quand l'utilisateur sélectionne domaines dans Search :
- API filtre sources avec `SourceDomain.score ≥ 0.15`
- Seules sources classées dans au moins un domaine sélectionné
- Multi-domaines = OR logic (Économie OU Écologie)

---

## 📊 Endpoints API

### GET /api/domains

Liste tous les domaines avec stats :

```json
{
  "domains": [
    {
      "slug": "economie",
      "name": "Économie",
      "icon": "Wallet",
      "color": "#4C6EF5",
      "sourceCount": 142,
      "percentage": 58
    }
  ],
  "totalSources": 245
}
```

### GET /api/search?domains=economie,ecologie

Recherche avec filtrage domaines :

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
          "color": "#4C6EF5",
          "score": 0.89
        }
      ]
    }
  ]
}
```

---

## 🔧 Configuration Avancée

### Seuil de Confiance

Par défaut, `score ≥ 0.15` pour qu'une source soit assignée à un domaine.

Modifier dans `lib/agent/domain-classifier.ts` :

```typescript
if (normalizedScore > 0.15) {  // Modifier ce seuil
  matches.push({ ... });
}
```

### Ajouter un Domaine

Modifier `lib/domains.ts` :

```typescript
export const PREDEFINED_DOMAINS: Domain[] = [
  // ... domaines existants
  {
    slug: "nouveau-domaine",
    name: "Nouveau Domaine",
    nameEn: "New Domain",
    icon: Star, // Import from lucide-react
    color: "#FF6B6B",
    description: "Description...",
    keywords: ["keyword1", "keyword2", ...],
    jelCodes: [],
  },
];
```

Puis re-seed :
```bash
npm run seed:domains
```

---

## 🐛 Troubleshooting

### "Table 'Domain' does not exist"

**Solution** :
```bash
npm run prisma:gen
npm run db:push
npm run seed:domains
```

### "No domains in search results"

**Cause** : Sources pas encore classifiées

**Solution** :
```bash
npm run classify
```

### "Classification très lente"

**Cause** : Beaucoup de sources à classifier

**Solution** :
- Classifier par batch : `node scripts/classify-sources.mjs --limit 50`
- Ou laisser tourner (classification = opération one-time)

### "Domaines incorrects sur une source"

**Cause** : Keywords trop larges ou ambigus

**Solution** :
1. Affiner keywords dans `lib/domains.ts`
2. Re-seed domaines : `npm run seed:domains`
3. Re-classifier sources :
   ```sql
   -- Supprimer classifications existantes
   DELETE FROM "SourceDomain";
   ```
   ```bash
   npm run classify
   ```

---

## ✅ Checklist Post-Installation

- [ ] Migration DB réussie (`npm run db:push`)
- [ ] 8 domaines créés (`npm run seed:domains`)
- [ ] Sources classifiées (`npm run classify`)
- [ ] Page `/search` affiche sélecteur domaines
- [ ] Filtrage par domaine fonctionne
- [ ] Badges domaines affichés sur source cards
- [ ] Dashboard affiche stats domaines

---

## 🎉 Résultat Final

L'utilisateur peut maintenant :
- ✅ **Sélectionner visuellement** 8 domaines (Économie, Science, etc.)
- ✅ **Filtrer recherche** par un ou plusieurs domaines
- ✅ **Voir domaines** de chaque source (badges colorés)
- ✅ **Stats dashboard** avec répartition par domaine
- ✅ **Classification automatique** des nouvelles sources

**Temps total : ~5 minutes d'installation** ⏱️

---

**Questions ?** Voir `AMELIORATION_DOMAINES.md` pour détails techniques complets.
