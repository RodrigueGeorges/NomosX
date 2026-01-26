# 🔍 Guide de la Recherche NomosX

**Ce que vous propose la page `/search`**

---

## 🎯 Qu'est-ce que c'est ?

La **Recherche NomosX** est un moteur de recherche hybride qui combine :
1. **Recherche lexicale** : Mots-clés exacts (comme Google)
2. **Recherche sémantique** : Similarité de sens (IA embeddings)

**Résultat** : Vous trouvez des sources pertinentes même si elles n'utilisent pas exactement vos mots.

---

## 🚀 Cas d'Usage

### 1. **Explorer votre base de connaissances**

**Scénario** : Vous avez ingéré des sources et voulez savoir ce que vous avez

**Exemple** :
```
1. Après ingestion de "carbon tax emissions trading"
2. Aller sur /search
3. Rechercher "carbon" ou "climate" ou "tax"
4. Filtrer par qualité ≥ 70
5. Trier par novelty (nouveauté)
→ Découvrir les sources les plus innovantes sur le climat
```

**Pourquoi ?** : Voir ce qui est vraiment dans votre base avant de générer un brief

---

### 2. **Trouver des sources pour un brief spécifique**

**Scénario** : Vous voulez créer un brief sur un sujet précis

**Exemple** :
```
1. Rechercher "carbon pricing effectiveness"
2. Filtrer domaine = "economics"
3. Filtrer année ≥ 2024
4. Trier par qualité
→ Identifier les 10 meilleures sources récentes
→ Utiliser ces insights pour formuler votre question de brief
```

**Pourquoi ?** : S'assurer que vous avez assez de sources de qualité sur votre sujet

---

### 3. **Vérifier la couverture d'un domaine**

**Scénario** : Est-ce que j'ai assez de sources en santé publique ?

**Exemple** :
```
1. Rechercher "public health"
2. Sélectionner domaine = "health"
3. Voir combien de résultats
→ Si < 10 résultats : Lancer une nouvelle ingestion sur "public health policy"
```

**Pourquoi ?** : Identifier les trous dans votre base de connaissances

---

### 4. **Analyser la qualité de vos ingestions**

**Scénario** : Ma dernière ingestion a-t-elle ramené de bonnes sources ?

**Exemple** :
```
1. Rechercher votre requête d'ingestion (ex: "quantum computing")
2. Regarder distribution des scores qualité
3. Filtrer provider = "openalex" vs "crossref"
→ Comparer quelle source donne les meilleurs résultats
```

**Pourquoi ?** : Optimiser vos futures ingestions

---

### 5. **Recherche par auteur ou institution**

**Scénario** : Quels travaux de MIT sont dans ma base ?

**Exemple** :
```
1. Rechercher "MIT" ou "Massachusetts Institute"
2. Voir toutes les sources affiliées
→ Découvrir les recherches d'une institution spécifique
```

**Pourquoi ?** : Suivre des institutions ou auteurs clés

---

## 🎨 Fonctionnalités de la Recherche

### **Barre de recherche**
- ✅ **Requête libre** : Tapez n'importe quoi (mots-clés, questions, concepts)
- ✅ **Recherche hybride** : Combine lexical + sémantique
- ✅ **Instant** : Résultats en < 1 seconde

### **Filtres Domaines**
- ✅ **8 domaines** : Climate, Health, Economics, Energy, AI, Materials, Policy, Defense
- ✅ **Multi-sélection** : Filtrer par plusieurs domaines simultanément
- ✅ **Visual** : Icônes et couleurs pour chaque domaine

### **Tri**
- ✅ **4 modes** :
  1. **Pertinence** : Ordre par défaut (similarité sémantique)
  2. **Qualité** : Sources les mieux notées (qualityScore)
  3. **Nouveauté** : Sources les plus innovantes (noveltyScore)
  4. **Date** : Sources les plus récentes (année de publication)

### **Filtres Avancés**
- ✅ **Par provider** : OpenAlex, CrossRef, PubMed, arXiv, Semantic Scholar
- ✅ **Par qualité** : ≥ 50, ≥ 70, ≥ 85
- ✅ **Par année** : ≥ 2024, ≥ 2023, ≥ 2020, ≥ 2015

### **Affichage des résultats**
- ✅ **Cartes** : Titre, année, auteurs, provider
- ✅ **Badges** :
  - QS (Quality Score)
  - NS (Novelty Score)
  - Domaines
- ✅ **Hover** : Animation sur survol
- ✅ **Clic** : Ouvrir la source complète

---

## 🔬 Comment ça marche techniquement ?

### **Recherche Hybride**

```typescript
// app/api/search/route.ts
import { hybridSearch } from "@/lib/embeddings";

// 1. Recherche lexicale (mots-clés)
const lexicalResults = await prisma.source.findMany({
  where: {
    OR: [
      { title: { contains: query, mode: 'insensitive' } },
      { abstract: { contains: query, mode: 'insensitive' } },
    ]
  },
  take: 100,
});

// 2. Recherche sémantique (embeddings)
const semanticResults = await hybridSearch({
  query: query,
  k: 50,
  threshold: 0.7,
});

// 3. Fusion des résultats (dédupliqués, scorés)
const results = mergeAndRank(lexicalResults, semanticResults);
```

**Avantages** :
- 🎯 **Précision** : Trouve les sources exactes (lexical)
- 🧠 **Intelligence** : Trouve les sources similaires (sémantique)
- ⚡ **Rapidité** : < 1 seconde même sur des milliers de sources

---

## 📊 Exemples de Requêtes

### **Requêtes simples (mots-clés)**
```
"carbon tax"
"quantum computing"
"AI regulation"
"climate change"
```
→ Trouve sources avec ces mots exacts dans titre/abstract

### **Requêtes conceptuelles (sémantiques)**
```
"reducing greenhouse gas emissions through economic incentives"
"potential of quantum computers in drug discovery"
"ethical implications of artificial intelligence"
```
→ Trouve sources sur ces concepts même si mots différents

### **Requêtes par auteur/institution**
```
"MIT"
"Stanford University"
"Max Planck Institute"
"Emma Chen"
```
→ Trouve sources affiliées

### **Requêtes par thème**
```
"carbon accounting" + domaine "economics"
"neural interfaces" + domaine "health"
"renewable energy" + domaine "energy"
```
→ Combine recherche textuelle + filtre domaine

---

## 🎯 Workflow Recommandé

### **Workflow 1 : Exploration libre**

```
1. /ingestion → Ingérer "carbon tax"
2. /search → Rechercher "carbon"
3. Explorer les résultats (50-100 sources)
4. Identifier les sous-thèmes intéressants
5. Raffiner : "carbon border adjustment mechanism"
6. /brief → Générer brief sur ce sous-thème
```

**Objectif** : Découvrir ce que contient votre base

---

### **Workflow 2 : Brief ciblé**

```
1. /search → Rechercher "carbon pricing effectiveness"
2. Filtrer qualité ≥ 70
3. Filtrer année ≥ 2024
4. Trier par qualité
5. Vérifier : au moins 10-15 sources ?
   - Si oui → /brief avec cette question
   - Si non → /ingestion pour collecter plus de sources
```

**Objectif** : S'assurer d'avoir assez de données de qualité avant brief

---

### **Workflow 3 : Audit de la base**

```
1. /search → Rechercher par domaine
   - "health" → X résultats
   - "economics" → Y résultats
   - "AI" → Z résultats
2. Identifier les domaines sous-représentés
3. /ingestion ciblée sur ces domaines
4. Répéter jusqu'à couverture équilibrée
```

**Objectif** : Avoir une base équilibrée sur tous les domaines stratégiques

---

### **Workflow 4 : Veille concurrentielle**

```
1. /search → "OpenAI" ou "DeepMind" ou "Anthropic"
2. Filtrer domaine = "AI"
3. Trier par date
4. Voir les dernières publications de ces acteurs
5. /council → "How should we respond to OpenAI's latest research?"
```

**Objectif** : Surveiller les acteurs clés de votre secteur

---

## ⚡ Comparaison avec d'autres outils

| Critère | NomosX Search | Google Scholar | ChatGPT |
|---------|---------------|----------------|---------|
| **Sources** | Votre base privée | 200M+ publiques | Training data (≤2023) |
| **Contrôle** | ✅ Total | ❌ Aucun | ❌ Aucun |
| **Qualité** | ✅ Scorée | ⚠️ Variable | ⚠️ Hallucinations |
| **Fraîcheur** | ✅ Vos ingestions | ✅ Temps réel | ❌ Coupure 2023 |
| **Filtres** | ✅ Avancés | ⚠️ Basiques | ❌ Aucun |
| **Citations** | ✅ Tracées | ✅ DOI | ❌ Pas de sources |
| **Vitesse** | ⚡ < 1s | ⚡ < 1s | 🐌 5-10s |
| **Coût** | 🆓 Gratuit (après ingestion) | 🆓 Gratuit | 💰 Payant |

**Conclusion** : NomosX = Votre Google Scholar privé avec IA

---

## 🎓 Bonnes Pratiques

### **1. Commencez large, raffinez ensuite**
```
❌ Mauvais : "carbon tax effectiveness in EU member states 2024"
✅ Bon : "carbon tax" → Voir résultats → Raffiner vers "EU carbon tax"
```

### **2. Utilisez les domaines pour filtrer**
```
❌ Mauvais : Rechercher "AI healthcare" et scrolls 100 résultats
✅ Bon : Rechercher "AI" + Filtrer domaine = "health"
```

### **3. Vérifiez la qualité avant brief**
```
❌ Mauvais : Générer brief sur 5 sources de qualité 40
✅ Bon : Filtrer qualité ≥ 70 → Voir 15+ sources → Brief
```

### **4. Exploitez les scores**
```
✅ Quality Score (QS) : Fiabilité de la source
✅ Novelty Score (NS) : Innovation / originalité
```

- **Brief traditionnel** : Trier par qualité (QS)
- **Radar signaux faibles** : Trier par nouveauté (NS)
- **Veille stratégique** : Trier par date

### **5. Comparez les providers**
```
OpenAlex → Couverture large, toutes disciplines
CrossRef → DOIs officiels, très fiable
PubMed → Biomédical, santé publique
arXiv → Preprints, cutting-edge (pas peer-reviewed)
Semantic Scholar → IA-enhanced, bonnes connexions
```

**Conseil** : Pour un brief sérieux, privilégier OpenAlex + CrossRef + PubMed

---

## 🔮 Ce que vous POUVEZ faire avec la recherche

### ✅ **Explorer votre base**
- Voir toutes les sources sur un sujet
- Identifier les auteurs/institutions clés
- Découvrir les connexions entre sujets

### ✅ **Préparer des briefs**
- Vérifier couverture avant génération
- Identifier les meilleures sources
- Formuler questions précises

### ✅ **Auditer vos ingestions**
- Voir qualité des sources collectées
- Comparer providers
- Identifier trous de connaissance

### ✅ **Veille stratégique**
- Suivre acteurs clés (institutions, auteurs)
- Détecter tendances émergentes
- Surveiller domaines spécifiques

---

## ❌ Ce que vous NE POUVEZ PAS faire (pour l'instant)

### ❌ **Recherche multi-langues native**
**État actuel** : Recherche principalement en anglais (sources académiques)  
**Workaround** : Traduire votre requête en anglais

### ❌ **Recherche dans le contenu complet (full-text)**
**État actuel** : Recherche dans titre + abstract uniquement  
**Roadmap** : RAG sur PDFs complets (Phase 4)

### ❌ **Graphes de citations**
**État actuel** : Pas de visualisation réseau  
**Roadmap** : d3.js citations network (Phase 4)

### ❌ **Alertes automatiques**
**État actuel** : Recherche manuelle  
**Roadmap** : Saved searches + email alerts (Phase 3)

### ❌ **Export des résultats**
**État actuel** : Consultation uniquement  
**Workaround** : Copier manuellement ou générer brief

---

## 🎯 Intégration avec le reste de NomosX

```
WORKFLOW COMPLET :

1. /ingestion
   → Collecte sources (SCOUT + INDEX + RANK)
   
2. /search
   → Explore et filtre les sources collectées
   → Identifie les meilleurs pour analyse
   
3. /brief ou /council
   → Génère analyse structurée
   → Utilise les sources trouvées via search
   
4. /radar
   → Détecte signaux faibles automatiquement
   → Basé sur noveltyScore identifié dans search
```

**La recherche est le HUB central** pour explorer votre base avant d'utiliser les agents d'analyse.

---

## 📚 Cas d'Usage Réels

### **Cas 1 : Think Tank Policy**
```
Objectif : Analyser impact des taxes carbone

1. /ingestion → "carbon tax emissions trading EU"
2. /search → "carbon pricing" + domaine "economics" + qualité ≥ 70
3. Identifier 25 sources de qualité
4. /brief → "What is the effectiveness of carbon pricing in EU?"
5. Résultat : Brief structuré avec 25 sources citées
```

**Temps** : 5 minutes  
**Output** : Analyse professionnelle prête pour décision

---

### **Cas 2 : Investisseur DeepTech**
```
Objectif : Évaluer potentiel quantum computing en santé

1. /ingestion → "quantum computing drug discovery healthcare"
2. /search → "quantum" + domaine "health" + trier par novelty
3. Identifier top 10 sources innovantes
4. /council → "Should we invest in quantum computing for pharma?"
5. Résultat : 4 perspectives (économique, technique, éthique, risque)
```

**Temps** : 4 minutes  
**Output** : Débat structuré pour comité d'investissement

---

### **Cas 3 : Journaliste Investigation**
```
Objectif : Fact-check sur IA et emploi

1. /ingestion → "AI automation employment labor market"
2. /search → "AI employment" + année ≥ 2024
3. Trier par qualité
4. Identifier consensus et désaccords
5. /brief → "Will AI reduce structural unemployment?"
6. Résultat : Consensus, désaccords, preuves, limitations
```

**Temps** : 3 minutes  
**Output** : Article fact-checké avec sources académiques

---

## 🚀 Améliorations Futures (Roadmap)

### **Phase 2 : Recherche Enhanced**
- [ ] Saved searches (sauvegarder requêtes)
- [ ] Email alerts (nouveaux résultats auto)
- [ ] Export CSV/JSON
- [ ] Recherche par citation (find similar)

### **Phase 3 : Recherche Collaborative**
- [ ] Collections partagées
- [ ] Annotations sur sources
- [ ] Tags personnalisés
- [ ] Historique de recherche

### **Phase 4 : Recherche Advanced**
- [ ] Graphes de citations (network viz)
- [ ] RAG sur PDFs complets
- [ ] Recherche multi-langues native
- [ ] Recommandations IA ("You might also like...")

---

## ✅ Résumé

### **Ce qu'offre la Recherche NomosX**

**En 1 phrase** :  
Un moteur de recherche hybride (lexical + sémantique) pour explorer vos sources académiques collectées, avec filtres avancés (domaine, qualité, année, provider) et tri intelligent (pertinence, qualité, nouveauté, date).

**En 1 mot** :  
Votre **Google Scholar privé** ✨

---

### **Quand l'utiliser ?**

1. **Après ingestion** → Explorer ce que vous avez collecté
2. **Avant brief** → Vérifier couverture sur un sujet
3. **Pour audit** → Analyser qualité de votre base
4. **Pour veille** → Suivre acteurs/institutions clés

---

### **Pourquoi c'est puissant ?**

- ✅ **Votre data** : Vous contrôlez les sources
- ✅ **Hybride** : Lexical + Sémantique = Meilleurs résultats
- ✅ **Filtres avancés** : Domaines, qualité, année, provider
- ✅ **Rapide** : < 1 seconde
- ✅ **Intégré** : S'enchaine avec Brief, Council, Radar

---

**La Recherche NomosX est votre porte d'entrée pour explorer et maîtriser votre base de connaissances stratégiques.** 🎯

---

**Version** : 1.0  
**Date** : 19 janvier 2026  
**URL** : http://localhost:3001/search
