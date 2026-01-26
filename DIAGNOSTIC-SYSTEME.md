# Diagnostic Système NomosX

**Date** : 19 janvier 2026  
**Objectif** : Diagnostiquer et résoudre les problèmes de fonctionnement des agents

---

## 🚨 Problème Rapporté

**Symptômes** :
- Page `/radar` affiche "Lancez une ingestion"
- Redirige vers `/topics` mais rien ne se passe
- Incertitude si les agents fonctionnent réellement avec la data

**Cause racine probable** : **Base de données vide** ❌

---

## 🔍 Diagnostic Complet

### Commande de diagnostic

```bash
npm run test:system
```

**Ce script vérifie** :
1. ✅ Variables d'environnement (DATABASE_URL, OPENAI_API_KEY, OPENAI_MODEL)
2. ✅ Connexion PostgreSQL
3. ✅ Contenu de la base de données (sources, briefs, auteurs, etc.)
4. ✅ API OpenAI (completion + embedding)
5. ✅ Agent RADAR (génération de signaux)

---

## 📊 États Possibles du Système

### État 1 : ✅ **Système Opérationnel**
```
✓ DATABASE_URL configurée
✓ OPENAI_API_KEY configurée
✓ Connexion PostgreSQL OK
✓ 1234 sources dans la DB
✓ 45 sources avec novelty ≥ 60 (suffisant pour Radar)
✓ API OpenAI fonctionne (completion)
✓ API OpenAI fonctionne (embedding)
✓ Agent RADAR fonctionne ! 5 signal(aux) généré(s)

✅ SYSTÈME OPÉRATIONNEL
✓ Tous les agents peuvent fonctionner
```

**Actions** : Aucune, tout fonctionne ! 🎉

---

### État 2 : ⚠️ **Système Configuré mais Sans Data** (VOTRE CAS)
```
✓ DATABASE_URL configurée
✓ OPENAI_API_KEY configurée
✓ Connexion PostgreSQL OK
⚠ Aucune source dans la DB — lancez une ingestion !
ℹ 0 briefs
ℹ 0 auteurs
ℹ 0 institutions
ℹ 8 domaines
⚠ Aucune source avec novelty ≥ 60 — Radar ne pourra pas générer de signaux
✓ API OpenAI fonctionne (completion)
✓ API OpenAI fonctionne (embedding)
⚠ Skipped — Pas assez de données

⚠ SYSTÈME CONFIGURÉ MAIS SANS DATA
⚠ Base de données vide — lancez une ingestion
```

**Actions** : Lancer une ingestion (voir section "Solution" ci-dessous)

---

### État 3 : ❌ **Problèmes de Configuration**
```
✗ DATABASE_URL manquante
✗ OPENAI_API_KEY manquante
✗ Connexion échouée: connection refused

❌ PROBLÈMES DÉTECTÉS
✗ Corrigez les erreurs ci-dessus avant d'utiliser les agents
```

**Actions** : Vérifier `.env`, voir `QUICKSTART.md`

---

### État 4 : ❌ **Rate Limit OpenAI**
```
✓ DATABASE_URL configurée
✓ OPENAI_API_KEY configurée
✓ Connexion PostgreSQL OK
✓ 1234 sources dans la DB
✓ 45 sources avec novelty ≥ 60
✗ Rate limit atteint (429) — Attendez 60 secondes ou upgradez votre tier OpenAI
⚠ Voir : https://platform.openai.com/settings/organization/limits

❌ PROBLÈMES DÉTECTÉS
```

**Actions** : Attendre ou upgrader OpenAI tier

---

## 🛠️ Solution : Lancer une Ingestion

### Option 1 : Via l'Interface Web (Recommandé)

1. **Lancer le serveur** :
   ```bash
   npm run dev
   ```

2. **Visiter le Dashboard** :
   ```
   http://localhost:3000/dashboard
   ```

3. **Créer une ingestion** :
   - Cliquez sur "Nouvelle Ingestion" ou "Quick Actions"
   - Entrez une requête : `"carbon tax"`, `"ai regulation"`, `"quantum computing"`
   - Sélectionnez les providers : OpenAlex, CrossRef, PubMed
   - Nombre de résultats par provider : 20-50
   - Cliquez sur "Lancer l'Ingestion"

4. **Attendre le pipeline** :
   - SCOUT : ~10-15s (collecte sources)
   - INDEX : ~20-30s (enrichissement auteurs/institutions)
   - RANK : instantané
   - Total : ~30-45 secondes

5. **Vérifier** :
   - Revenez au Dashboard
   - Vous devriez voir `X sources` dans les stats
   - Visitez `/radar` → devrait afficher des signaux
   - Visitez `/search` → recherche fonctionnelle

---

### Option 2 : Via l'API

```bash
curl -X POST http://localhost:3000/api/ingestion/run \
  -H "Content-Type: application/json" \
  -d '{
    "query": "carbon tax",
    "providers": ["openalex", "crossref"],
    "perProvider": 20
  }'
```

**Réponse** :
```json
{
  "runId": "run_abc123",
  "status": "running",
  "query": "carbon tax"
}
```

---

### Option 3 : Via Script (Développeurs)

```bash
# Si worker job queue est configuré
npm run worker

# Dans un autre terminal
node scripts/manual-ingestion.mjs
```

---

## 📈 Après l'Ingestion

### Vérifier le contenu

```bash
npm run test:system
```

**Attendu** :
```
✓ 45 sources dans la DB
✓ 12 sources avec novelty ≥ 60
✓ Agent RADAR fonctionne ! 5 signal(aux) généré(s)
```

### Tester les pages

1. **`/radar`** : Devrait afficher 5-6 signaux faibles
2. **`/search`** : Recherche "carbon" → devrait retourner des résultats
3. **`/brief`** : Créer un brief → devrait générer une analyse
4. **`/council`** : Poser une question → devrait générer des débats

---

## 🔧 Pourquoi le Radar Ne Fonctionnait Pas ?

### Architecture du Radar Agent

```typescript
// lib/agent/radar-agent.ts
export async function generateRadarCards(limit = 5): Promise<RadarCard[]> {
  // 1. Récupère sources avec noveltyScore ≥ 60
  const sources = await prisma.source.findMany({
    where: {
      noveltyScore: { gte: 60 },  // ❌ Si DB vide → 0 sources
    },
    take: 20,
  });
  
  if (sources.length === 0) {
    return [];  // ❌ Retourne tableau vide
  }
  
  // 2. Génère des signaux avec GPT-4
  // ...
}
```

**Si DB vide** :
- `sources.length === 0`
- Retourne `[]`
- Page affiche "Aucun signal détecté"
- Message "Lancez une ingestion" s'affiche

**Solution** : Ingestion pour peupler la DB

---

## 🎯 Agents et Dépendances Data

| Agent | Requiert | Minimum |
|-------|----------|---------|
| **SCOUT** | Rien | - |
| **INDEX** | Sources | 1+ source |
| **READER** | Sources | 1+ source |
| **ANALYST** | Sources | 3+ sources |
| **RADAR** | Sources (novelty ≥ 60) | 5+ sources |
| **DIGEST** | Sources (récentes) | 10+ sources |
| **COUNCIL** | Sources | 5+ sources |

**Conclusion** : Tous les agents (sauf SCOUT) ont besoin de **données dans la DB** pour fonctionner.

---

## 🐛 Problèmes Courants

### 1. "Aucun signal détecté" sur `/radar`

**Causes** :
- ❌ Base de données vide
- ❌ Aucune source avec `noveltyScore ≥ 60`
- ❌ OpenAI rate limit atteint

**Solutions** :
1. Lancer une ingestion
2. Vérifier `npm run test:system`
3. Attendre 60s si rate limit

---

### 2. "Failed to load radar cards" (erreur)

**Causes** :
- ❌ OpenAI API down
- ❌ Rate limit 429
- ❌ Modèle incorrect dans `.env`

**Solutions** :
1. Vérifier `OPENAI_API_KEY` dans `.env`
2. Vérifier `OPENAI_MODEL=gpt-4o` (pas `gpt-4-turbo-preview`)
3. Attendre si rate limit

---

### 3. Recherche retourne 0 résultats

**Causes** :
- ❌ Base de données vide
- ❌ Recherche trop spécifique

**Solutions** :
1. Lancer une ingestion
2. Essayer requête plus large : `"carbon"` au lieu de `"carbon tax policy in Europe 2024"`

---

### 4. Brief génération échoue

**Causes** :
- ❌ Pas assez de sources (< 3)
- ❌ OpenAI rate limit
- ❌ Citation guard échoue

**Solutions** :
1. Ingérer plus de sources (20-50)
2. Attendre si rate limit
3. Vérifier logs : `console.log` dans `/api/briefs`

---

## 📋 Checklist de Vérification

### Avant de signaler un bug

- [ ] `npm run test:system` exécuté
- [ ] Base de données contient des sources (> 0)
- [ ] API OpenAI fonctionne (pas de rate limit)
- [ ] `.env` correctement configuré
- [ ] Serveur `npm run dev` en cours d'exécution
- [ ] Navigateur console ouvert (F12) pour voir erreurs JS

### Si tout est ✅ mais ça ne marche toujours pas

1. **Vérifier les logs serveur** :
   ```bash
   # Terminal où tourne npm run dev
   # Chercher "Error" ou "Failed"
   ```

2. **Vérifier la console navigateur** (F12) :
   - Onglet "Console" → erreurs JS
   - Onglet "Network" → requêtes API échouées

3. **Tester l'API directement** :
   ```bash
   curl http://localhost:3000/api/radar?limit=5
   ```

4. **Vérifier la DB manuellement** :
   ```bash
   npm run prisma:studio
   # Ouvrir http://localhost:5555
   # Vérifier table Source → count > 0
   ```

---

## 🚀 Résumé Rapide

### Diagnostic
```bash
npm run test:system
```

### Solution (DB vide)
1. `npm run dev`
2. Visiter `http://localhost:3000/dashboard`
3. Créer une ingestion : `"carbon tax"`, providers OpenAlex + CrossRef, 20 résultats
4. Attendre 30-45 secondes
5. Visiter `/radar` → devrait afficher des signaux !

### Vérification
```bash
npm run test:system
# Devrait afficher "SYSTÈME OPÉRATIONNEL"
```

---

## 📚 Ressources

- **Setup initial** : `QUICKSTART.md`
- **Architecture agents** : `AGENTS.md`
- **API OpenAI** : `VERIF-OPENAI.md`
- **Fix modèle** : `FIX-OPENAI-MODEL.md`
- **Schema DB** : `prisma/schema.prisma`

---

## ✅ Validation Post-Ingestion

Après avoir lancé une ingestion, toutes ces pages devraient fonctionner :

| Page | Statut | Test |
|------|--------|------|
| `/dashboard` | ✅ | Affiche stats (sources > 0) |
| `/search` | ✅ | Recherche retourne résultats |
| `/radar` | ✅ | Affiche 5-6 signaux faibles |
| `/brief` | ✅ | Génère une analyse structurée |
| `/briefs` | ✅ | Liste les briefs créés |
| `/council` | ✅ | Génère débat multi-angles |
| `/topics` | ⚠️ | Vide jusqu'à création manuelle de topics |
| `/digests` | ⚠️ | Vide jusqu'à création de digest |

**Note** : `/topics` et `/digests` nécessitent configuration manuelle (création de Topic via UI ou API).

---

**Version** : 1.0  
**Dernière mise à jour** : 19 janvier 2026  
**Statut** : Production-ready

**Besoin d'aide ?** Lancez `npm run test:system` et partagez la sortie complète.
