# 🚀 Démarrage NomosX v1.2

**Sélecteur de domaines opérationnel en 5 minutes**

---

## ⚡ Installation Express

```bash
npm run prisma:gen && npm run db:push && npm run seed:domains && npm run dev
```

**C'est tout !** ✅

Ouvrir `http://localhost:3000/search` → Sélecteur de domaines visible

---

## 📋 Étape par Étape (si erreur)

### 1. Générer Prisma Client

```bash
npm run prisma:gen
```

→ Génère types TypeScript pour `Domain` et `SourceDomain`

### 2. Migrer Base de Données

```bash
npm run db:push
```

→ Crée tables `Domain` et `SourceDomain`

### 3. Peupler Domaines

```bash
npm run seed:domains
```

→ Insère 8 domaines prédéfinis (Économie, Science, Écologie, etc.)

**Output attendu** :
```
🌱 Seeding domains...
  ✓ Created: Économie (economie)
  ✓ Created: Sciences (science)
  ...
🎉 Seeding complete! Total: 8 domains
```

### 4. (Optionnel) Classifier Sources Existantes

**Si vous avez déjà des sources dans la base** :

```bash
npm run classify
```

→ Classifie automatiquement toutes les sources dans les domaines appropriés

**Sinon** : Skip cette étape, les nouvelles sources seront classifiées automatiquement

### 5. Démarrer

```bash
npm run dev
```

→ App running sur `http://localhost:3000`

---

## ✅ Vérifier Que Ça Marche

### Test 1 : Sélecteur Visible

1. Ouvrir `http://localhost:3000/search`
2. **Vérifier** : Section "Filtrer par domaine" visible
3. **Vérifier** : 8 boutons domaines visibles

✅ Si oui → Installation réussie !

### Test 2 : Sélection Fonctionne

1. Cliquer sur "💰 Économie"
2. **Vérifier** : Bouton devient cyan avec border accent
3. **Vérifier** : Badge "Sélectionnés" apparaît
4. Cliquer "Effacer"
5. **Vérifier** : Sélection reset

✅ Si oui → UI fonctionnelle !

### Test 3 : Filtrage Backend

**Si vous avez des sources classifiées** :

1. Sélectionner un domaine
2. Taper une query
3. Rechercher
4. **Vérifier** : Résultats affichent badges domaines

✅ Si oui → Backend opérationnel !

### Test 4 : Dashboard Stats

1. Ouvrir `http://localhost:3000/dashboard`
2. Scroll vers "Répartition par domaine"
3. **Vérifier** : Cards domaines avec comptes

✅ Si oui → Tout fonctionne !

---

## 🐛 Problème ?

### "Prisma Client did not initialize yet"

```bash
rm -rf node_modules/.prisma
rm -rf generated
npm run prisma:gen
npm run dev
```

### "Table 'Domain' does not exist"

```bash
npm run db:push
npm run seed:domains
```

### "Sélecteur domaines pas visible"

1. Vérifier console browser pour erreurs
2. Hard refresh : Ctrl+Shift+R
3. Vérifier `components/DomainSelector.tsx` existe

### "Filtrage ne marche pas"

1. Vérifier domaines seedés : `npx prisma studio`
2. Classifier sources : `npm run classify`
3. Check API : `http://localhost:3000/api/domains`

---

## 📚 Documentation Complète

**Quick Start** :
- START_V1.2.md — Ce fichier (5 min)

**Installation** :
- INSTALLATION_DOMAINES.md — Guide express
- DEPLOY_DOMAINES.md — Guide détaillé

**Technique** :
- FONCTIONNEMENT_AGENTS.md — Comment marchent les agents
- AMELIORATION_DOMAINES.md — Architecture domaines

**Production** :
- PRODUCTION_READINESS.md — Audit complet
- CHANGELOG_V1.2.md — Nouveautés v1.2

---

## 🎯 Workflow Typique

### Première Utilisation

```bash
# 1. Installer domaines (une seule fois)
npm run prisma:gen
npm run db:push
npm run seed:domains

# 2. Démarrer
npm run dev

# 3. Tester
→ http://localhost:3000/search
→ Sélectionner domaines
→ Rechercher
```

### Utilisation Quotidienne

```bash
# Juste démarrer
npm run dev

# Le sélecteur de domaines est toujours là !
```

### Ajouter Nouvelles Sources

```bash
# 1. Créer ingestion run (via /settings)
# 2. Lancer worker
npm run worker

# Les sources seront automatiquement classifiées ! ✅
```

---

## 🎉 C'est Tout !

**En 5 minutes, tu as** :
- ✅ Sélecteur de domaines opérationnel
- ✅ 8 domaines prédéfinis
- ✅ Classification automatique
- ✅ Filtrage intelligent

**NomosX v1.2 est prêt !** 🚀

---

**Questions ?** Consulte `INSTALLATION_DOMAINES.md` ou `DEPLOY_DOMAINES.md`
