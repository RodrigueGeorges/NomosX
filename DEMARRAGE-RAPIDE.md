# Démarrage Rapide NomosX

**Problème** : Radar affiche "Aucun signal" → Base de données vide ❌  
**Solution** : 2 options pour peupler la DB ✅

---

## ⚡ Option 1 : Données de Démo (RAPIDE - 5 secondes)

**Idéal pour** : Tester immédiatement, développement, démo

```bash
npm run seed:demo
```

**Résultat** :
- ✅ 10 sources académiques fictives
- ✅ 5 auteurs
- ✅ 5 institutions
- ✅ 7 sources avec novelty ≥ 60 (Radar fonctionnel)

**Ensuite** :
```bash
npm run dev
# Visiter http://localhost:3000/radar
# → Devrait afficher des signaux ! 🎉
```

---

## 🌐 Option 2 : Vraies Données (LONG - 30-45s)

**Idéal pour** : Production, vraies recherches

### Étape 1 : Lancer le serveur
```bash
npm run dev
```

### Étape 2 : Créer une ingestion
Visitez : `http://localhost:3000/dashboard`

- **Requête** : `carbon tax` (ou autre sujet)
- **Providers** : OpenAlex, CrossRef (au moins 2)
- **Résultats par provider** : 20-50
- **Cliquez** : "Lancer l'Ingestion"

### Étape 3 : Attendre 30-45 secondes
Le pipeline va :
1. SCOUT : Collecter sources (10-15s)
2. INDEX : Enrichir auteurs/institutions (20-30s)
3. RANK : Scorer qualité/nouveauté (instantané)

### Étape 4 : Tester
- `/radar` → Devrait afficher 5-6 signaux
- `/search` → Recherche "carbon" → résultats
- `/brief` → Créer un brief → génération d'analyse

---

## 🔍 Diagnostic

**Vérifier si tout fonctionne** :
```bash
npm run test:system
```

**Attendu** :
```
✓ DATABASE_URL configurée
✓ OPENAI_API_KEY configurée
✓ Connexion PostgreSQL OK
✓ 10 sources dans la DB
✓ 7 sources avec novelty ≥ 60
✓ API OpenAI fonctionne
✓ Agent RADAR fonctionne ! 5 signal(aux) généré(s)

✅ SYSTÈME OPÉRATIONNEL
```

---

## 🚨 Problèmes Courants

### "Aucun signal détecté" sur `/radar`
```bash
# Vérifier la DB
npm run test:system

# Si "0 sources" → Peupler la DB
npm run seed:demo
# OU lancer une ingestion via /dashboard
```

### "Rate limit atteint (429)"
```bash
# Attendre 60 secondes
# OU upgrader votre tier OpenAI
# Voir : https://platform.openai.com/settings/organization/limits
```

### "Failed to connect to database"
```bash
# Vérifier .env
cat .env | grep DATABASE_URL

# Si vide ou incorrect → Copier depuis .env.example
# Et remplacer par vos credentials Neon/PostgreSQL
```

---

## 📊 Après Peuplement

**Ces pages devraient fonctionner** :
- ✅ `/dashboard` → Stats affichées
- ✅ `/search` → Recherche fonctionnelle
- ✅ `/radar` → 5-6 signaux faibles
- ✅ `/brief` → Génération d'analyse
- ✅ `/council` → Débat multi-angles

---

## 🎯 Commandes Utiles

```bash
# Diagnostic complet
npm run test:system

# Données de démo (rapide)
npm run seed:demo

# Tester OpenAI
npm run test:openai

# Lancer serveur
npm run dev

# Studio Prisma (voir DB)
npm run prisma:studio
```

---

## 📚 Documentation Complète

- **Setup détaillé** : `QUICKSTART.md`
- **Diagnostic système** : `DIAGNOSTIC-SYSTEME.md`
- **Architecture agents** : `AGENTS.md`
- **API OpenAI** : `VERIF-OPENAI.md`

---

## ✅ Checklist Démarrage

- [ ] `.env` configuré avec DATABASE_URL et OPENAI_API_KEY
- [ ] `npm install` exécuté
- [ ] `npm run prisma:generate` exécuté
- [ ] `npm run prisma:push` exécuté (migration DB)
- [ ] **`npm run seed:demo`** ← CRITIQUE pour tester
- [ ] `npm run dev` en cours
- [ ] Visiter `http://localhost:3000/radar` → signaux affichés ✨

---

**Besoin d'aide ?** Lancez `npm run test:system` et partagez la sortie.

**Version** : 1.0 — 19 janvier 2026
