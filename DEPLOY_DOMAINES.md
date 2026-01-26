# 🚀 Déploiement Sélecteur de Domaines — Guide Complet

**Suivez ces étapes dans l'ordre pour activer les domaines**

---

## ⚡ Installation Express (5 minutes)

### Commandes à Exécuter

```bash
# 1. Générer le client Prisma avec nouveaux modèles
npm run prisma:gen

# 2. Pousser le schéma vers la base de données
npm run db:push

# 3. Peupler avec les 8 domaines prédéfinis
npm run seed:domains

# 4. (Optionnel) Classifier les sources existantes
npm run classify

# 5. Démarrer l'application
npm run dev
```

### Résultat Attendu

```
✅ Prisma client generated
✅ Database schema updated
✅ 8 domains seeded
✅ Sources classified (if you had existing sources)
✅ App running on http://localhost:3000
```

---

## 📋 Étape par Étape (Détaillé)

### Étape 1 : Génération Prisma Client

```bash
npm run prisma:gen
```

**Ce que ça fait** :
- Lit `prisma/schema.prisma`
- Génère le client TypeScript dans `generated/prisma-client`
- Ajoute types pour `Domain` et `SourceDomain`

**Vérification** :
```bash
# Vérifier que les types existent
node -e "const { PrismaClient } = require('@prisma/client'); const p = new PrismaClient(); console.log(typeof p.domain)"
# Devrait afficher : object
```

---

### Étape 2 : Migration Database

```bash
npm run db:push
```

**Ce que ça fait** :
- Crée table `Domain` avec colonnes :
  - id, slug, name, nameEn, icon, color
  - description, keywords[], jelCodes[]
  - isActive, createdAt, updatedAt
- Crée table `SourceDomain` avec colonnes :
  - sourceId, domainId, score
  - createdAt
- Crée indexes pour performance

**Output attendu** :
```
Environment variables loaded from .env
Prisma schema loaded from prisma\schema.prisma
Datasource "db": PostgreSQL database

The following migration(s) have been created and applied from new schema changes:

migrations/
  └─ 20260119_add_domains/
      └─ migration.sql

✔ Generated Prisma Client (5.8.0)

Your database is now in sync with your schema.
```

**Vérification** :
```sql
-- Dans Prisma Studio ou psql
SELECT * FROM "Domain";
-- Devrait être vide (pas encore seedé)
```

---

### Étape 3 : Seed Domaines

```bash
npm run seed:domains
```

**Ce que ça fait** :
- Insère 8 domaines prédéfinis dans la table `Domain`
- Chaque domaine avec :
  - Nom français + anglais
  - Icon (Lucide-React name)
  - Couleur hex
  - Liste de keywords (15-20 par domaine)
  - JEL codes (pour économie)

**Output attendu** :
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

**Vérification** :
```bash
# Ouvrir Prisma Studio
npx prisma studio

# → Onglet "Domain"
# → Devrait voir 8 lignes
```

---

### Étape 4 : Classification Sources (Optionnel)

**Si vous avez déjà des sources dans la base**, classifiez-les :

```bash
# Classifier toutes les sources (batch 100)
npm run classify

# Ou limiter à 50 sources
node scripts/classify-sources.mjs --limit 50
```

**Ce que ça fait** :
- Trouve toutes les sources sans domaines assignés
- Pour chaque source :
  - Analyse title + abstract + topics + jelCodes
  - Calcule score pour chaque domaine
  - Crée liens `SourceDomain` si score > 0.15
- Affiche distribution finale

**Output attendu** :
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
  Sociologie              21  ███
  Politique & Droit       18  ██
  Énergie                 12  ██

🎉 Classification complete!
   Classified: 100
```

**Vérification** :
```sql
-- Compter les liens créés
SELECT COUNT(*) FROM "SourceDomain";
-- Devrait être > 0

-- Voir distribution
SELECT d.name, COUNT(*) as count
FROM "SourceDomain" sd
JOIN "Domain" d ON d.id = sd."domainId"
GROUP BY d.name
ORDER BY count DESC;
```

---

### Étape 5 : Démarrer l'App

```bash
npm run dev
```

**Tester** :

1. **Page Search** (`http://localhost:3000/search`)
   - ✅ Voir section "Filtrer par domaine"
   - ✅ Cliquer sur domaines (multi-sélection)
   - ✅ Badges "Sélectionnés" apparaît
   - ✅ Rechercher avec/sans domaines
   - ✅ Résultats affichent badges domaines

2. **Dashboard** (`http://localhost:3000/dashboard`)
   - ✅ Voir section "Répartition par domaine"
   - ✅ Cards colorées par domaine
   - ✅ Barre de progression
   - ✅ Comptes précis

---

## 🔄 Workflow Post-Installation

### Pour Nouvelles Sources

**Automatique** : Les nouvelles sources sont classifiées automatiquement par INDEX agent.

```bash
# Lancer une ingestion (Settings → Ingestion)
# Puis worker
npm run worker

# Les sources seront automatiquement :
# 1. Collectées (SCOUT)
# 2. Enrichies (INDEX)
# 3. Classifiées par domaines (INDEX → domain-classifier)
```

### Pour Re-Classifier des Sources

Si vous modifiez les keywords ou voulez re-classifier :

```sql
-- Supprimer classifications existantes
DELETE FROM "SourceDomain";
```

```bash
# Re-classifier toutes les sources
npm run classify
```

---

## 📊 Vérifications de Santé

### Check 1 : Domaines Créés

```sql
SELECT slug, name, "isActive" FROM "Domain";
```

Devrait retourner 8 lignes.

### Check 2 : Sources Classifiées

```sql
SELECT COUNT(*) as total_sources,
       COUNT(CASE WHEN EXISTS (
         SELECT 1 FROM "SourceDomain" sd WHERE sd."sourceId" = s.id
       ) THEN 1 END) as classified_sources
FROM "Source" s;
```

Si `classified_sources` = 0 et vous avez des sources, run `npm run classify`.

### Check 3 : Distribution Équilibrée

```sql
SELECT d.name, COUNT(*) as count
FROM "SourceDomain" sd
JOIN "Domain" d ON d.id = sd."domainId"
GROUP BY d.name
ORDER BY count DESC;
```

Vérifier que la distribution a du sens (pas 100% dans un seul domaine).

### Check 4 : Scores de Confiance

```sql
SELECT d.name, 
       ROUND(AVG(sd.score)::numeric, 2) as avg_score,
       MIN(sd.score) as min_score,
       MAX(sd.score) as max_score
FROM "SourceDomain" sd
JOIN "Domain" d ON d.id = sd."domainId"
GROUP BY d.name;
```

Scores moyens devraient être entre 0.3 et 0.7.

---

## 🎯 Tests Fonctionnels

### Test 1 : Filtrage Simple

1. `/search`
2. Sélectionner "💰 Économie"
3. Taper "inflation"
4. Rechercher
5. **Vérifier** : Tous résultats ont badge Économie

### Test 2 : Multi-Domaines

1. `/search`
2. Sélectionner "💰 Économie" + "🌍 Écologie"
3. Taper "carbon tax"
4. Rechercher
5. **Vérifier** : Résultats ont badge Économie OU Écologie (ou les deux)

### Test 3 : Sans Filtrage

1. `/search`
2. Ne sélectionner aucun domaine
3. Taper "research"
4. Rechercher
5. **Vérifier** : Tous domaines possibles dans résultats

### Test 4 : Dashboard Stats

1. `/dashboard`
2. Scroll vers "Répartition par domaine"
3. **Vérifier** : 
   - Domaines triés par count DESC
   - Barres de progression colorées
   - Pourcentages corrects

---

## 💡 Tips

### Performance

Si vous avez beaucoup de sources (10k+) :
- Classifier par batches de 100
- Ajouter index sur `SourceDomain.score` (déjà fait)
- Monitorer temps de réponse API

### Keywords

Si certaines sources sont mal classifiées :
- Affiner keywords dans `lib/domains.ts`
- Re-seed + re-classify

### Nouveaux Domaines

Facile d'ajouter de nouveaux domaines :
1. Ajouter dans `lib/domains.ts`
2. `npm run seed:domains` (upsert automatique)
3. `npm run classify` pour classifier sources existantes

---

## 📚 Documentation Complète

- **`AMELIORATION_DOMAINES.md`** — Architecture technique complète
- **`FONCTIONNEMENT_AGENTS.md`** — Comment fonctionnent les agents
- **`INSTALLATION_DOMAINES.md`** — Ce guide
- **`lib/domains.ts`** — Code source domaines
- **`lib/agent/domain-classifier.ts`** — Code classification

---

## ✅ Succès !

Si vous voyez :
- ✅ Sélecteur de domaines dans `/search`
- ✅ Filtrage fonctionnel
- ✅ Badges domaines sur sources
- ✅ Stats dashboard

**Alors le déploiement est réussi !** 🎉

---

**NomosX v1.2** — Classification par domaines opérationnelle 🚀
