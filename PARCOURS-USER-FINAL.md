# 🎯 Parcours Utilisateur Final — Vision Head of Product

**Date** : 20 janvier 2026  
**Vision** : Intent-First, AI-Automated, Zero-Friction  
**Cible** : Décideurs stratégiques (C-level, consultants, analystes)

---

## 🧠 **PHILOSOPHIE PRODUIT**

### **Principe Fondamental**

```
❌ AVANT : "Voici des outils, débrouille-toi"
✅ APRÈS : "Dis-moi ce que tu veux savoir, je m'occupe de tout"
```

### **3 Piliers**

1. **Intent-First** : User exprime QUOI, pas COMMENT
2. **AI-Automated** : System déduit et exécute automatiquement
3. **Zero-Friction** : De la question au résultat en 1 clic

---

## 🚀 **PARCOURS PRINCIPAL (80% des cas)**

### **Use Case : Décideur avec une question stratégique**

**Persona** : Marie, Directrice Innovation dans une grande entreprise  
**Besoin** : Comprendre l'impact de l'IA sur son secteur pour décision board

---

## 📍 **ÉTAPE 1 : ARRIVÉE (Homepage)**

### **Ce que voit Marie**

```
┌─────────────────────────────────────────────┐
│         [Logo NomosX — Think Tank]          │
│                                             │
│  "Quelle question stratégique explorer ?"   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  [Grande Textarea]                  │   │
│  │  "Tapez votre question..."          │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  Ou choisissez un template :                │
│  [Template 1] [Template 2] [Template 3]     │
│                                             │
│  Mode :  ◉ Brief  ○ Conseil                 │
│                                             │
│  [Générer Brief]                            │
│                                             │
│  28M+ sources · 10 agents · 8 domaines      │
└─────────────────────────────────────────────┘
```

### **Ce que fait Marie**

```
Marie tape : "Quel est l'impact de l'IA générative sur 
             le secteur de la santé en Europe ?"
```

### **Ce qui se passe automatiquement** ✨

```
1. System détecte domaine : "Santé & Médecine"
2. System sélectionne providers : PubMed + OpenAlex
3. System estime complexité : Modérée
4. System calcule quantité : 18 sources
5. System estime temps : 45-60s
```

### **Ce que voit Marie (Preview Intelligent)**

```
┌─────────────────────────────────────────────┐
│  💡 Domaine détecté : Santé & Médecine      │
│     Nous allons analyser ~18 sources        │
│     de PubMed + OpenAlex.                   │
│                                             │
│  ⏱️ Temps estimé : 45-60s                   │
│  🔍 ~18 sources académiques                 │
└─────────────────────────────────────────────┘

[Générer Brief (45-60s)] ← CTA dynamique
```

### **Décision de Marie**

```
Marie voit :
- Domaine correct ✓
- Sources pertinentes ✓
- Temps acceptable ✓

→ Elle clique "Générer Brief (45-60s)"
```

**Temps écoulé** : 30 secondes  
**Clics** : 0 (juste typing)  
**Décisions techniques** : 0 (tout auto)

---

## 📍 **ÉTAPE 2 : GÉNÉRATION (Auto-Pilote)**

### **Ce qui se passe côté système** (invisible pour Marie)

```
1. SCOUT Agent
   → Recherche PubMed : 9 sources
   → Recherche OpenAlex : 9 sources
   → Total trouvé : 18 sources
   
2. INDEX Agent
   → Enrichit auteurs (ORCID)
   → Enrichit institutions (ROR)
   → Calcule novelty score
   
3. DEDUPE Agent
   → Supprime doublons (DOI)
   → Garde 16 sources uniques
   
4. RANK Agent
   → Trie par quality score
   → Sélectionne top 12
   
5. READER Agent
   → Extrait claims, methods, results
   → 3 claims par source
   → Total : 36 claims
   
6. ANALYST Agent
   → Synthèse 10 sections
   → Citations [SRC-1] à [SRC-12]
   → 2500 mots
   
7. GUARD Agent
   → Vérifie citations valides
   → 87 citations, toutes OK ✓
   
8. EDITOR Agent
   → Génère HTML premium
   → Format publication
```

### **Ce que voit Marie (Loader)**

```
┌─────────────────────────────────────────────┐
│           🤖 Génération en cours...         │
│                                             │
│     ✓ Recherche sources (PubMed + OpenAlex)│
│     ✓ Sélection des 12 meilleures sources  │
│     ⏳ Analyse multi-sections               │
│     ⏳ Génération synthèse                  │
│                                             │
│  ████████████████░░░░░░░░  75%              │
│                                             │
│  Encore ~15 secondes...                     │
└─────────────────────────────────────────────┘
```

**Temps écoulé** : 45 secondes (depuis clic)  
**Interventions de Marie** : 0 (autopilot)

---

## 📍 **ÉTAPE 3 : RÉSULTAT (Brief Complet)**

### **Ce que voit Marie**

```
┌─────────────────────────────────────────────┐
│  📄 Brief : IA Générative en Santé Europe   │
│                                             │
│  ✅ Généré en 47s · 12 sources · 87 citations│
│                                             │
│  [Télécharger PDF] [Partager] [Approfondir]│
├─────────────────────────────────────────────┤
│                                             │
│  📊 Résumé Exécutif                         │
│  L'IA générative transforme...  [SRC-1][SRC-3]│
│                                             │
│  🔍 Consensus Scientifique                  │
│  Les chercheurs s'accordent... [SRC-2][SRC-5]│
│                                             │
│  ⚔️ Points de Débat                         │
│  Divergences sur éthique... [SRC-7][SRC-9]  │
│                                             │
│  💡 Implications Stratégiques               │
│  Pour les décideurs... [SRC-1][SRC-11]     │
│                                             │
│  ⚠️ Risques & Limitations                   │
│  Biais algorithmiques... [SRC-4][SRC-8]    │
│                                             │
│  ❓ Questions Ouvertes                      │
│  Régulation européenne... [SRC-10][SRC-12] │
│                                             │
│  📚 Sources (12)                            │
│  [1] Smith et al. 2025 - Nature Medicine   │
│  [2] Dupont et al. 2024 - Lancet Digital   │
│  ...                                        │
└─────────────────────────────────────────────┘
```

### **Ce que fait Marie**

```
Option A : Lit le brief (5-10 min)
         → Prend décision éclairée
         → Présente au board
         
Option B : Télécharge PDF
         → Partage avec équipe
         
Option C : Clique "Approfondir"
         → Génère nouveau brief avec 25 sources
         
Option D : Clique "Débattre"
         → Lance Council pour perspectives multiples
```

**Temps total** : 1 minute (homepage → résultat)  
**Clics total** : 1 (générer)  
**Valeur créée** : Brief publication-ready, citations vérifiées

---

## 🔄 **PARCOURS ALTERNATIF : CONSEIL MULTI-PERSPECTIVES**

### **Use Case : Marie veut un débat contradictoire**

**Même départ** : Homepage, même question

**Différence** : Marie choisit **"Conseil"** au lieu de "Brief"

### **Étape 2 bis : Génération Council**

**Ce qui se passe** :

```
1-4. SCOUT → INDEX → DEDUPE → RANK (identique)

5. COUNCIL Agent (au lieu de READER + ANALYST)
   → Analyse économique : "Réduction coûts 15-20%..."
   → Analyse technique : "Intégration systèmes existants..."
   → Analyse éthique : "Consentement patients, biais..."
   → Analyse politique : "Régulation UE, souveraineté..."
   → Synthèse intégrée : "Trade-offs principaux..."
```

### **Résultat Council**

```
┌─────────────────────────────────────────────┐
│  💬 Conseil : IA Générative en Santé        │
│                                             │
│  4 perspectives · 10 sources · 52 citations │
├─────────────────────────────────────────────┤
│                                             │
│  💰 Perspective Économique                  │
│  ├─ Réduction coûts : 15-20% [SRC-1][SRC-3]│
│  ├─ ROI moyen : 18 mois [SRC-5]            │
│  └─ Risque : Investissement initial élevé  │
│                                             │
│  ⚙️ Perspective Technique                   │
│  ├─ Intégration : Complexe mais faisable   │
│  ├─ Infrastructure : Cloud requis [SRC-2]  │
│  └─ Risque : Dépendance fournisseurs       │
│                                             │
│  ❤️ Perspective Éthique                     │
│  ├─ Consentement : Cadre légal flou [SRC-7]│
│  ├─ Biais : Problème identifié [SRC-8]    │
│  └─ Risque : Discrimination algorithmique  │
│                                             │
│  🏛️ Perspective Politique                   │
│  ├─ Régulation UE : En cours [SRC-9]      │
│  ├─ Souveraineté : Enjeu clé [SRC-10]     │
│  └─ Risque : Fragmentation réglementaire  │
│                                             │
│  🔗 Synthèse Intégrée                       │
│  L'adoption de l'IA générative présente... │
│  Trade-offs principaux :                    │
│  - Efficacité vs Éthique                   │
│  - Innovation vs Régulation                │
│                                             │
│  ⚠️ Incertitudes                            │
│  - Évolution réglementation européenne     │
│  - Acceptabilité sociale long terme        │
└─────────────────────────────────────────────┘
```

**Valeur** : Décision nuancée, tous angles couverts

---

## 🎯 **PARCOURS SECONDAIRES (20% des cas)**

### **Parcours 2 : Power User — Recherche Avancée**

**Persona** : Thomas, Analyste recherche  
**Besoin** : Trouver sources très spécifiques

```
1. Dashboard → Clic "Recherche"
2. Tape query : "carbon tax effectiveness"
3. System auto-détecte : Domaine "Économie"
4. System auto-applique : Tri "Quality"
5. Affiche 47 sources
6. Thomas filtre : 2023-2024 only
7. 23 sources restantes
8. Thomas clique "Générer Brief avec ces sources"
9. Brief custom généré

Temps : 2 minutes
Contrôle : Maximum (si besoin)
```

---

### **Parcours 3 : Veille Continue — Radar + Abonnement**

**Persona** : Sarah, Directrice Stratégie  
**Besoin** : Surveiller signaux faibles climat

```
1. Dashboard → Clic "Radar"
2. Voit 6 signaux faibles détectés auto
3. Clique "S'abonner"
4. Entre email + choisit "Hebdomadaire"
5. Reçoit digest chaque lundi 8h
6. Digest = 3-5 signaux + pourquoi important

Setup : 20 secondes
Maintenance : 0 (auto)
Valeur : Anticipe tendances
```

---

### **Parcours 4 : Exploration — Bibliothèque**

**Persona** : Alex, Consultant  
**Besoin** : Explorer briefs existants

```
1. Dashboard → Clic "Bibliothèque"
2. Voit 127 briefs générés
3. Filtre : "climate" + 2024
4. 23 briefs trouvés
5. Ouvre brief "Carbon Markets EU"
6. Clique "Débattre"
7. Lance Council sur même sujet

Temps : 1 minute
Réutilisation : Maximum
```

---

## 📊 **COMPARAISON AVANT vs APRÈS**

### **Ancien Flow (Avant Refonte)**

```
1. Homepage → Choix mode (Brief/Council/Search)
2. Page mode → Tape question
3. Clic "Rechercher sources"
4. Page Ingestion → Choix domaine
5. Choix providers (openalex? crossref? pubmed?)
6. Choix quantité (10? 20? 50?)
7. Clic "Lancer ingestion"
8. Attente 30s
9. Retour Dashboard
10. Clic "Brief"
11. Re-tape question (!!)
12. Clic "Générer"
13. Attente 60s
14. Résultat

Total : 9 étapes, 5 minutes, 6 clics, 5 décisions techniques ❌
```

### **Nouveau Flow (Après Refonte)**

```
1. Homepage → Tape question
2. Preview intelligent (auto)
3. Clic "Générer Brief"
4. Résultat

Total : 2 étapes, 1 minute, 1 clic, 0 décisions techniques ✅
```

**Amélioration** :
- **Temps** : -80% (5 min → 1 min)
- **Clics** : -83% (6 → 1)
- **Friction** : -100% (5 décisions → 0)
- **Complexité cognitive** : -100%

---

## 🎯 **PRINCIPES DE DESIGN**

### **1. Intent-First**

```
❌ "Choisissez providers, domaine, quantité"
✅ "Quelle question voulez-vous explorer ?"
```

**Rationale** : User exprime INTENTION, system déduit EXÉCUTION

---

### **2. Progressive Disclosure**

```
Niveau 1 (Homepage) : 1 champ, 2 boutons
Niveau 2 (Brief) : Résultat structuré
Niveau 3 (Menu ...) : Features avancées (Radar, Search, Topics)
```

**Rationale** : Simplicité par défaut, puissance si besoin

---

### **3. Context-Aware Automation**

```
Question "cancer treatment" 
→ Détecte : Santé
→ Sélectionne : PubMed (medical DB)
→ Ajuste : 18 sources (modéré)

Question "carbon tax effectiveness economic impact literature review"
→ Détecte : Économie
→ Sélectionne : CrossRef + SSRN (economics DBs)
→ Ajuste : 25 sources (complexe)
```

**Rationale** : Intelligence contextuelle, pas règles fixes

---

### **4. Explainability**

```
Preview montre :
"Domaine détecté : Climat & Environnement
 Nous allons analyser ~18 sources de OpenAlex + CrossRef"
```

**Rationale** : Transparence, pas "boîte noire"

---

### **5. Zero-Friction Actions**

```
❌ Brief généré → User doit revenir homepage → Re-taper question
✅ Brief généré → [Approfondir] [Débattre] [Actualiser] inline
```

**Rationale** : Next action suggérée, pas dead-end

---

## 🎨 **ÉTATS D'ESPRIT VISÉS**

### **Arrivée (Homepage)**

```
User pense : "J'ai une question stratégique"
System dit : "Pose-la, je m'occupe de tout"
Émotion : Confiance, simplicité
```

### **Génération**

```
User pense : "Ça marche vraiment ?"
System dit : "Regarde, je cherche 18 sources dans PubMed..."
Émotion : Réassurance, transparence
```

### **Résultat**

```
User pense : "Wow, c'est exactement ce que je voulais"
System dit : "Veux-tu approfondir ? Débattre ? Partager ?"
Émotion : Satisfaction, empowerment
```

---

## 🏆 **BENCHMARK vs CONCURRENCE**

### **ChatGPT**

```
✅ Rapide (< 10s)
❌ Pas de citations académiques
❌ Pas de sources vérifiées
❌ Hallucinations possibles
❌ Pas de structure publication

→ Bon pour : Brainstorming
→ Pas pour : Décisions stratégiques
```

### **Google Scholar**

```
✅ Sources académiques
❌ Aucune analyse
❌ User doit tout lire manuellement
❌ Pas de synthèse
❌ Pas de citations croisées

→ Bon pour : Recherche manuelle
→ Pas pour : Time-to-insight rapide
```

### **NomosX (Notre Approche)**

```
✅ Sources académiques (28M+)
✅ Citations vérifiées [SRC-*]
✅ Synthèse publication-ready
✅ Multi-perspectives (Council)
✅ Signaux faibles (Radar)
✅ 1 minute time-to-insight

→ Bon pour : Décisions stratégiques éclairées
→ Unique : Intent-first + AI-orchestrated
```

---

## 📈 **MÉTRIQUES SUCCÈS**

### **Adoption**

```
- Taux complétion homepage : > 80%
- Taux génération réussie : > 95%
- Temps moyen homepage → résultat : < 60s
```

### **Satisfaction**

```
- NPS (Net Promoter Score) : > 50
- Satisfaction brief : > 4.5/5
- Taux retour 7 jours : > 60%
```

### **Engagement**

```
- Briefs générés/user/mois : > 5
- Actions post-brief (approfondir, débattre) : > 30%
- Abonnements Radar : > 20% users
```

---

## 🎯 **VISION LONG TERME**

### **Phase Actuelle (V1.0)**

```
✅ Intent-first homepage
✅ Smart provider selection
✅ Auto-run Brief/Council
✅ Radar + abonnement
✅ 1 clic, 60s max
```

### **Phase 2 (Q2 2026)**

```
- Multimodal : Voice input "Hey NomosX..."
- Collaboration : Partage + commentaires inline
- Workspace : Projets multi-briefs
- API : Intégration entreprise
```

### **Phase 3 (Q3-Q4 2026)**

```
- Proactive : "J'ai détecté un signal sur l'IA santé"
- Conversational : "Approfondis la partie éthique"
- Predictive : "Cette question va devenir tendance"
- Enterprise : SSO, permiss, audit logs
```

---

## ✅ **CONCLUSION : LE PARCOURS IDÉAL**

### **En 3 Phrases**

1. **User pose question stratégique** → System détecte domaine, sélectionne sources optimales
2. **1 clic** → Agents orchestrent recherche, analyse, synthèse (60s)
3. **Résultat publication-ready** → Décision éclairée, actions suggérées

### **Promesse Produit**

```
"De la question stratégique à la décision éclairée
 en 60 secondes, sans friction technique."
```

### **Différenciateur**

```
Pas un outil de recherche (Google Scholar)
Pas un chatbot (ChatGPT)
→ Un think tank autonome qui pense pour vous
```

---

**Version** : Parcours User v2.0  
**Statut** : ✅ **Implémenté et production-ready**  
**Next** : Multimodal, Collaboration, Proactive Intelligence
