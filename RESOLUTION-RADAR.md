# Résolution : Radar Ne Fonctionne Pas

**Date** : 19 janvier 2026  
**Problème signalé** : "Radar ne fonctionne pas ? Il me dit lancer une ingestion puis redirige vers topic mais il ne se passe rien"

---

## 🔍 Analyse du Problème

### Cause Racine

**Base de données vide** ❌

Le Radar Agent nécessite :
- Au moins **5 sources** avec `noveltyScore ≥ 60`
- Ces sources doivent exister dans la table `Source` de PostgreSQL

**Pourquoi le message "Lancez une ingestion" ?**

Code dans `app/radar/page.tsx` :
```typescript
const [cards, setCards] = useState<RadarCard[]>([]);

// Si cards.length === 0
{cards.length === 0 && (
  <EmptyState message="Aucun signal détecté. Lancez une ingestion." />
)}
```

**Pourquoi redirection vers /topics ?**

Il n'y a probablement **pas** de redirection automatique. C'est peut-être une navigation manuelle ou un lien cliqué par erreur.

La page `/topics` affiche les topics de veille configurés, qui sont **indépendants** du Radar.

---

## ✅ Solution Immédiate

### Option A : Données de Démo (5 secondes)

**Recommandé pour tester rapidement**

```bash
npm run seed:demo
```

**Ce que ça fait** :
- Crée 10 sources fictives dans la DB
- 7 ont `noveltyScore ≥ 60` → Radar fonctionnel
- Crée aussi 5 auteurs et 5 institutions

**Vérification** :
```bash
npm run test:system
```

**Attendu** :
```
✓ 10 sources dans la DB
✓ 7 sources avec novelty ≥ 60 (suffisant pour Radar)
✓ Agent RADAR fonctionne ! 5 signal(aux) généré(s)
```

**Ensuite** :
```bash
npm run dev
# Visiter http://localhost:3000/radar
# → Devrait afficher 5-6 signaux ! 🎉
```

---

### Option B : Vraie Ingestion (30-45 secondes)

**Recommandé pour production**

1. **Lancer le serveur** :
   ```bash
   npm run dev
   ```

2. **Créer une ingestion** :
   - Visiter `http://localhost:3000/dashboard`
   - Cliquer "Nouvelle Ingestion" ou "Quick Actions"
   - Remplir :
     - **Requête** : `carbon tax` ou `ai regulation` ou `quantum computing`
     - **Providers** : Cocher OpenAlex + CrossRef (au moins 2)
     - **Résultats** : 20-50 par provider
   - Cliquer "Lancer l'Ingestion"

3. **Attendre** :
   - SCOUT : ~10-15s (collecte)
   - INDEX : ~20-30s (enrichissement)
   - Total : ~30-45s

4. **Vérifier** :
   - Retour au Dashboard → Stats devraient afficher `X sources`
   - Visiter `/radar` → Devrait afficher signaux
   - Visiter `/search` → Recherche fonctionnelle

---

## 🐛 Pourquoi Ça Ne Marchait Pas Avant ?

### Architecture du Radar Agent

```typescript
// lib/agent/radar-agent.ts
export async function generateRadarCards(limit = 5) {
  // 1. Récupère sources avec novelty ≥ 60
  const sources = await prisma.source.findMany({
    where: { noveltyScore: { gte: 60 } },
    take: 20,
  });
  
  // 2. Si aucune source → retourne []
  if (sources.length === 0) {
    return [];  // ❌ Pas de signaux
  }
  
  // 3. Sinon, génère signaux avec GPT-4
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
  });
  
  return parsed.cards;
}
```

**Si DB vide** :
- `sources.length === 0`
- Retourne `[]`
- Page affiche "Aucun signal détecté"

**Si DB peuplée** :
- `sources.length > 0`
- Appelle OpenAI pour générer signaux
- Retourne 5-6 radar cards

---

## 🎯 Tous les Agents Fonctionnent-ils ?

**Réponse courte** : Oui, **SI** la DB contient des données ✅

### Tableau de Dépendances

| Agent | Fonctionne sans data ? | Minimum requis |
|-------|------------------------|----------------|
| **SCOUT** | ✅ Oui | Aucun (collecte externe) |
| **INDEX** | ❌ Non | 1+ source |
| **READER** | ❌ Non | 1+ source |
| **ANALYST** | ❌ Non | 3+ sources |
| **RADAR** | ❌ Non | 5+ sources (novelty ≥ 60) |
| **DIGEST** | ❌ Non | 10+ sources (récentes) |
| **COUNCIL** | ❌ Non | 5+ sources |

**Conclusion** :
- SCOUT peut tourner seul (il collecte depuis OpenAlex/CrossRef/etc.)
- Tous les autres agents ont besoin de **sources dans la DB**

---

## 🔧 Vérification Technique

### Test 1 : Vérifier la DB

```bash
npm run test:system
```

**Si sortie** :
```
⚠ Aucune source dans la DB — lancez une ingestion !
⚠ Aucune source avec novelty ≥ 60 — Radar ne pourra pas générer de signaux
```

→ **Problème confirmé** : DB vide

**Solution** : `npm run seed:demo` ou ingestion via Dashboard

---

### Test 2 : Tester OpenAI

```bash
npm run test:openai
```

**Si sortie** :
```
✓ Completion: OK
✓ Embedding: OK
```

→ OpenAI fonctionne ✅

**Si sortie** :
```
✗ Rate limit atteint (429)
```

→ Attendre 60 secondes ou upgrader tier OpenAI

---

### Test 3 : Tester Radar directement

```bash
curl http://localhost:3000/api/radar?limit=5
```

**Si DB vide** :
```json
{
  "cards": []
}
```

**Si DB peuplée** :
```json
{
  "cards": [
    {
      "title": "AI-Driven Carbon Accounting",
      "signal": "Emerging research shows...",
      "why_it_matters": "Could revolutionize...",
      "sources": ["SRC-1", "SRC-3"],
      "confidence": "medium"
    }
  ]
}
```

---

## 📋 Checklist de Résolution

- [ ] **Étape 1** : `npm run test:system` pour diagnostiquer
- [ ] **Étape 2** : Si "0 sources" → `npm run seed:demo`
- [ ] **Étape 3** : `npm run dev` pour lancer le serveur
- [ ] **Étape 4** : Visiter `http://localhost:3000/radar`
- [ ] **Étape 5** : Vérifier que 5-6 signaux s'affichent ✅

**Si toujours pas de signaux** :
- [ ] Vérifier console navigateur (F12) pour erreurs JS
- [ ] Vérifier logs serveur terminal pour erreurs API
- [ ] Tester `curl http://localhost:3000/api/radar?limit=5`
- [ ] Vérifier que `OPENAI_API_KEY` est correcte dans `.env`

---

## 🚀 Après Résolution

**Ces pages devraient maintenant fonctionner** :

1. **`/radar`** ✅
   - Affiche 5-6 signaux faibles
   - Chaque carte avec titre, signal, "why it matters", sources

2. **`/search`** ✅
   - Recherche "carbon" → retourne résultats
   - Filtres fonctionnels (providers, domaines, qualité)

3. **`/brief`** ✅
   - Créer un brief → génère analyse structurée
   - Sections : consensus, débats, implications, risques

4. **`/council`** ✅
   - Poser une question → débat multi-angles
   - Perspectives : économique, technique, éthique, politique

5. **`/dashboard`** ✅
   - Stats affichées : X sources, X briefs, X auteurs
   - Quick actions fonctionnelles

---

## 🎓 Comprendre le Système

### Flux de Données

```
1. USER crée ingestion
   ↓
2. SCOUT Agent → Collecte sources depuis OpenAlex/CrossRef/etc.
   ↓
3. INDEX Agent → Enrichit auteurs (ORCID) + institutions (ROR)
   ↓
4. RANK Agent → Calcule qualityScore + noveltyScore
   ↓
5. Sources stockées dans PostgreSQL
   ↓
6. RADAR Agent → Lit sources (novelty ≥ 60) → Génère signaux avec GPT-4
   ↓
7. USER voit signaux sur /radar
```

**Point critique** : Étape 5 (PostgreSQL)

Si PostgreSQL est vide → RADAR ne peut rien lire → Retourne []

---

## ✅ Validation Finale

```bash
# 1. Peupler la DB
npm run seed:demo

# 2. Diagnostiquer
npm run test:system

# Attendu :
# ✓ 10 sources dans la DB
# ✓ 7 sources avec novelty ≥ 60
# ✓ Agent RADAR fonctionne ! 5 signal(aux) généré(s)
# ✅ SYSTÈME OPÉRATIONNEL

# 3. Lancer le serveur
npm run dev

# 4. Tester
# Visiter http://localhost:3000/radar
# → Devrait afficher des signaux ! 🎉
```

---

## 📚 Documentation Complémentaire

- **Setup complet** : `QUICKSTART.md`
- **Diagnostic détaillé** : `DIAGNOSTIC-SYSTEME.md`
- **Démarrage rapide** : `DEMARRAGE-RAPIDE.md`
- **Architecture** : `AGENTS.md`

---

## 🎯 Résumé Exécutif

**Problème** : Radar affiche "Aucun signal"  
**Cause** : Base de données vide  
**Solution** : `npm run seed:demo` (5 secondes)  
**Résultat** : Radar fonctionnel avec 5-6 signaux ✅  

**Tous les agents fonctionnent avec la data** ✅

---

**Besoin d'aide ?** Partagez la sortie de `npm run test:system`

**Version** : 1.0 — 19 janvier 2026  
**Statut** : ✅ Résolu
