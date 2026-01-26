# 🏗️ Architecture Produit Complète — Écosystème NomosX

**Date** : 20 janvier 2026  
**Vision** : Flow principal + Features complémentaires intégrées

---

## 🎯 **ARCHITECTURE GLOBALE**

### **3 Niveaux**

```
┌─────────────────────────────────────────────────────┐
│  NIVEAU 1 : FLOW PRINCIPAL (80% usage)              │
│  Homepage → Brief/Council → Résultat                │
│  "Question → Réponse en 60s"                        │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│  NIVEAU 2 : FEATURES COMPLÉMENTAIRES (15% usage)    │
│  Radar, Recherche, Bibliothèque                     │
│  "Explorer, surveiller, approfondir"                │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│  NIVEAU 3 : FEATURES ADMIN/POWER (5% usage)         │
│  Topics, Digests, Ingestion                         │
│  "Configuration, archives, bulk operations"         │
└─────────────────────────────────────────────────────┘
```

---

## 🚀 **NIVEAU 1 : FLOW PRINCIPAL**

### **Homepage → Brief/Council**

**Qui** : 80% des utilisateurs, 95% du temps  
**Quand** : Besoin ponctuel d'analyse sur une question  
**Valeur** : Time-to-insight immédiat (60s)

**Flow** :
```
Homepage → Question → Brief/Council → Résultat → Actions
```

**Actions post-résultat** :
```
[Télécharger PDF]   → Export
[Partager]          → Collaboration
[Approfondir]       → Nouveau Brief (25 sources)
[Débattre]          → Lance Council
[Sources similaires] → Recherche avancée
```

---

## 🔍 **NIVEAU 2 : FEATURES COMPLÉMENTAIRES**

### **1. Dashboard — Hub Central**

**Qui** : Tous les utilisateurs  
**Quand** : Point d'entrée quotidien  
**Valeur** : Vue d'ensemble + accès rapide

#### **Intégration au Flow Principal**

```
User arrive sur NomosX
↓
Dashboard affiche :
┌─────────────────────────────────────────┐
│  📊 VUE D'ENSEMBLE                      │
│  ├─ 28M+ sources                        │
│  ├─ 127 briefs générés                  │
│  ├─ 6 signaux radar cette semaine       │
│  └─ 3 digests reçus                     │
│                                         │
│  ⚡ QUICK ACTIONS                        │
│  ├─ [Nouvelle question]   → Homepage    │
│  ├─ [Consulter radar]     → Radar       │
│  └─ [Mes briefs]          → Bibliothèque│
│                                         │
│  📈 ACTIVITÉ RÉCENTE                    │
│  ├─ Brief "IA santé" (il y a 2h)        │
│  ├─ Council "Taxe carbone" (hier)       │
│  └─ Radar signal détecté (aujourd'hui)  │
└─────────────────────────────────────────┘
```

**Parcours types** :

```
A. User régulier
   Dashboard → Voit activité récente → Continue brief en cours
   
B. User nouveau
   Dashboard → Quick action "Nouvelle question" → Homepage
   
C. User veille
   Dashboard → Voit "6 signaux radar" → Clic → Radar
```

---

### **2. Radar — Veille Automatique**

**Qui** : Décideurs stratégiques, directeurs innovation  
**Quand** : Veille continue sur signaux faibles  
**Valeur** : Anticipation tendances émergentes

#### **Intégration au Flow Principal**

```
OPTION A : Découverte depuis Dashboard
Dashboard → Badge "6 nouveaux signaux" → Radar

OPTION B : Abonnement proactif
User s'abonne → Reçoit email hebdo → Clic lien → Radar

OPTION C : Exploration thématique
Brief "Climate" généré → Suggestion "Surveiller signaux climat ?" → Radar
```

#### **Flow Radar Détaillé**

```
1. User arrive sur /radar
   
2. Voit 6 cartes signaux faibles détectés auto :
   ┌─────────────────────────────────────┐
   │ 🎯 Signal 1 : Haute confiance       │
   │ "Percée batteries sodium-ion"       │
   │                                     │
   │ CE QU'ON OBSERVE :                  │
   │ 3 publications majeures Nature...   │
   │                                     │
   │ POURQUOI IMPORTANT :                │
   │ Alternative lithium, coût -40%...   │
   │                                     │
   │ Sources : [SRC-1][SRC-2][SRC-3]    │
   └─────────────────────────────────────┘

3. User a 3 options :
   A. [S'abonner] → Reçoit signaux chaque semaine
   B. [Générer Brief] → Approfondit ce signal
   C. Scroll → Découvre autres signaux
```

#### **Connexion au Flow Principal**

```
Radar Signal → [Générer Brief sur ce signal]
             ↓
Homepage (pré-remplie avec le signal)
             ↓
Brief complet généré en 60s
```

**Exemple concret** :

```
User voit signal : "Percée batteries sodium-ion"
↓
Clique "Générer Brief"
↓
Homepage s'ouvre avec question :
"Quelles sont les avancées récentes sur les batteries sodium-ion
 et leurs implications pour l'industrie automobile ?"
↓
Smart selection : Technologie → Semantic Scholar + arXiv
↓
Brief généré avec 18 sources spécialisées
```

---

### **3. Recherche Avancée — Contrôle Granulaire**

**Qui** : Analystes recherche, power users (15%)  
**Quand** : Besoin de filtrage précis des sources  
**Valeur** : Contrôle total sur sélection sources

#### **Intégration au Flow Principal**

```
OPTION A : Depuis Homepage
Homepage → Lien discret "Recherche avancée" → /search

OPTION B : Depuis Brief
Brief généré → "Sources non pertinentes ?" → Recherche custom

OPTION C : Depuis Menu secondaire
Menu ... → "Recherche" → /search
```

#### **Flow Recherche**

```
1. User arrive sur /search
   
2. Interface hybride (simplifié mais puissant) :
   ┌─────────────────────────────────────┐
   │ 🔍 RECHERCHE AVANCÉE                │
   │                                     │
   │ [Tapez votre requête...]            │
   │                                     │
   │ 💡 Domaine auto-détecté : Santé     │
   │ 💡 Tri optimal : Quality            │
   │                                     │
   │ Filtres (optionnels) :              │
   │ └─ Année : [2020-2024]              │
   │ └─ Provider : [Tous] ▼              │
   │ └─ Novelty : [≥ 50]                 │
   │                                     │
   │ 47 sources trouvées                 │
   └─────────────────────────────────────┘

3. Résultats affichés avec preview

4. User sélectionne sources pertinentes (optionnel)

5. [Générer Brief avec ces sources]
   ↓
   Brief custom avec EXACTEMENT ces sources
```

#### **Connexion au Flow Principal**

```
A. Recherche → Sélection → Brief custom
   "Je veux EXACTEMENT ces 8 sources dans mon brief"
   
B. Recherche → Découverte → Question affinée
   "Tiens, cette source parle de X, je vais creuser"
   → Homepage avec question affinée
```

**Exemple concret** :

```
User cherche : "carbon tax effectiveness"
↓
System auto-détecte : Économie → CrossRef + SSRN
↓
47 sources trouvées
↓
User filtre : 2023-2024 only, Novelty ≥ 70
↓
12 sources très récentes, haute nouveauté
↓
[Générer Brief avec ces 12 sources]
↓
Brief ultra-ciblé sur innovations récentes taxe carbone
```

---

### **4. Bibliothèque — Historique & Réutilisation**

**Qui** : Tous les utilisateurs  
**Quand** : Consultation briefs passés, réutilisation  
**Valeur** : Capitalisation connaissance, actions secondaires

#### **Intégration au Flow Principal**

```
OPTION A : Depuis Dashboard
Dashboard → "Mes 127 briefs" → /briefs

OPTION B : Post-génération
Brief généré → Sauvegardé auto → Accessible via bibliothèque

OPTION C : Recherche historique
"J'avais fait un brief sur le climat..."
→ /briefs → Recherche "climat" → Retrouvé
```

#### **Flow Bibliothèque**

```
1. User arrive sur /briefs
   
2. Voit liste de TOUS les briefs générés :
   ┌─────────────────────────────────────┐
   │ 📚 BIBLIOTHÈQUE (127 briefs)        │
   │                                     │
   │ [Rechercher...] [Filtres ▼]         │
   │                                     │
   │ ┌─────────────────────────────────┐ │
   │ │ Brief #127 · Il y a 2h          │ │
   │ │ "IA générative en santé Europe" │ │
   │ │ 12 sources · 87 citations       │ │
   │ │                                 │ │
   │ │ [Ouvrir] [PDF] [Approfondir]    │ │
   │ │         [Débattre] [Actualiser] │ │
   │ └─────────────────────────────────┘ │
   │                                     │
   │ ┌─────────────────────────────────┐ │
   │ │ Brief #126 · Hier               │ │
   │ │ "Taxe carbone efficacité"       │ │
   │ │ ...                             │ │
   │ └─────────────────────────────────┘ │
   └─────────────────────────────────────┘

3. User a 5 actions par brief :
   
   [Ouvrir]       → Consulte brief complet
   [PDF]          → Télécharge
   [Approfondir]  → Génère nouveau brief 25 sources
   [Débattre]     → Lance Council même sujet
   [Actualiser]   → Re-génère avec sources 2024
```

#### **Connexions au Flow Principal**

```
A. Bibliothèque → [Approfondir]
   Brief "IA santé" (12 sources)
   ↓
   [Approfondir]
   ↓
   Homepage pré-remplie : "Impact IA santé (approfondi)"
   ↓
   Smart selection : 25 sources au lieu de 12
   ↓
   Brief enrichi généré

B. Bibliothèque → [Débattre]
   Brief "Taxe carbone"
   ↓
   [Débattre]
   ↓
   /council avec même question
   ↓
   Council 4 perspectives généré

C. Bibliothèque → [Actualiser]
   Brief "Blockchain" (sources 2022)
   ↓
   [Actualiser]
   ↓
   Re-génère avec filtre 2024
   ↓
   Brief actualisé avec dernières recherches
```

**Exemple concret** :

```
Marie consulte brief "IA santé" créé hier
↓
Veut perspective contradictoire
↓
Clique [Débattre]
↓
Council lancé automatiquement avec :
- Perspective économique : ROI, coûts
- Perspective technique : Faisabilité
- Perspective éthique : Consentement, biais
- Perspective politique : Régulation
↓
Vue complète des trade-offs
```

---

## 🔧 **NIVEAU 3 : FEATURES ADMIN/POWER**

### **5. Topics (Admin) — Configuration Veilles**

**Qui** : Admins, power users (5%)  
**Quand** : Configuration veilles personnalisées  
**Valeur** : Automatisation surveillance thématique

#### **Intégration au Flow Principal**

```
OPTION A : Depuis Radar
Radar → "Créer veille sur ce thème ?" → Topics

OPTION B : Depuis Bibliothèque
Bibliothèque → 10 briefs "climat" → "Créer topic Climat ?" → Topics

OPTION C : Depuis Menu admin
Menu ... → "Topics (Admin)" → /topics
```

#### **Flow Topics**

```
1. User arrive sur /topics
   
2. Voit liste topics existants :
   ┌─────────────────────────────────────┐
   │ 📋 TOPICS (Veilles)                 │
   │                                     │
   │ Topic : Climat & Environnement      │
   │ Query : climate OR environment      │
   │ Tags : [climat] [carbone] [énergie] │
   │ 23 briefs · 156 sources · 12 abonnés│
   │ [Voir briefs] [Créer digest] [Edit] │
   │                                     │
   │ Topic : IA & Santé                  │
   │ ...                                 │
   └─────────────────────────────────────┘

3. User crée nouveau topic :
   "Innovation Batteries"
   → Auto-génère query, tags
   → Configure abonnement digest hebdo
```

#### **Connexion au Flow Principal**

```
Topic "Climat" configuré
↓
Chaque semaine :
- DIGEST Agent génère résumé des 5 meilleures sources
- Email envoyé aux 12 abonnés
- Lien vers /digests/[id]
↓
User clique lien dans email
↓
Voit digest HTML
↓
[Générer Brief sur source X]
↓
Brief complet généré
```

---

### **6. Digests (Archive) — Résumés Périodiques**

**Qui** : Abonnés topics (10%)  
**Quand** : Réception email digest  
**Valeur** : Synthèse régulière sans effort

#### **Intégration au Flow Principal**

```
OPTION A : Email hebdo
Email "Digest Climat semaine 3" → Clic → /digests/[id]

OPTION B : Depuis Topics
/topics/climat → "Voir historique digests" → /digests?topicId=climat

OPTION C : Depuis Menu
Menu ... → "Digests (Archive)" → /digests
```

#### **Flow Digests**

```
1. User reçoit email hebdo :
   ┌─────────────────────────────────────┐
   │ 📧 Digest Climat — Semaine 3        │
   │                                     │
   │ 5 nouvelles sources cette semaine   │
   │                                     │
   │ 🔥 HIGHLIGHT                        │
   │ "Percée batteries sodium-ion"       │
   │ Nature Energy, 2024                 │
   │ Pourquoi important : Alternative... │
   │                                     │
   │ + 4 autres sources                  │
   │                                     │
   │ [Voir digest complet]               │
   └─────────────────────────────────────┘

2. Clique lien → /digests/[id]

3. Voit digest HTML complet

4. Pour chaque source :
   [Générer Brief] → Brief détaillé
   [Ajouter à Radar] → Surveille ce signal
```

#### **Connexion au Flow Principal**

```
Digest → Source intéressante
↓
[Générer Brief]
↓
Homepage pré-remplie avec source
↓
Brief complet généré
```

---

### **7. Ingestion (Admin) — Bulk Operations**

**Qui** : Admins uniquement (< 1%)  
**Quand** : Alimentation massive base de données  
**Valeur** : Population initiale, tests

#### **Intégration au Flow Principal**

```
USAGE : Admin veut peupler DB avec 1000 sources climat
↓
/ingestion
↓
Configure : Domaine "Climate", Providers "All", Quantité 1000
↓
Lance ingestion
↓
Sources ajoutées à DB
↓
Disponibles pour tous les Briefs/Council/Radar/Recherche
```

**Note** : Pas utilisé par users finaux (caché dans menu admin)

---

## 🔄 **SCÉNARIOS D'USAGE COMPLETS**

### **Scénario 1 : Décision Ponctuelle**

**Marie, Directrice Innovation**

```
Lundi 9h : Besoin brief pour board vendredi

1. Homepage → "Impact IA santé Europe ?"
2. Brief généré (60s)
3. [Télécharger PDF]
4. Présente au board vendredi

Features utilisées : Homepage + Brief
Temps total : 5 min (60s génération + 4min lecture)
```

---

### **Scénario 2 : Veille Continue**

**Sarah, Directrice Stratégie**

```
Setup (une fois) :
1. Dashboard → Radar
2. [S'abonner] → Email hebdo

Chaque semaine :
1. Reçoit email "6 signaux Climat semaine X"
2. Lit dans email
3. 1 signal intéressant → Clic
4. Brief généré sur ce signal

Features utilisées : Radar + Abonnement + Brief
Temps/semaine : 10 min (5min lecture email + 5min brief)
```

---

### **Scénario 3 : Recherche Approfondie**

**Thomas, Analyste Recherche**

```
Mission : Rapport complet carbon pricing

1. Recherche → "carbon pricing effectiveness"
   → 47 sources trouvées
   
2. Filtre 2023-2024, Quality ≥ 80
   → 15 sources top
   
3. [Générer Brief avec ces sources]
   → Brief custom
   
4. Lit, pas assez approfondi
   
5. Bibliothèque → Brief créé
   → [Approfondir]
   → Nouveau brief 25 sources
   
6. Toujours besoin perspectives
   
7. [Débattre]
   → Council 4 perspectives
   
8. Combine les 2 pour rapport final

Features utilisées : Recherche + Brief + Bibliothèque + Council
Temps total : 30 min (vs 4-5h manuellement)
```

---

### **Scénario 4 : Capitalisation Connaissance**

**Alex, Consultant**

```
Client demande : "Brief sur blockchain healthcare"

1. Bibliothèque → Recherche "blockchain health"
   → Trouve brief créé il y a 6 mois
   
2. Sources 2023 → Obsolète
   
3. [Actualiser]
   → Re-génère avec sources 2024
   
4. Brief actualisé en 60s
   
5. [Télécharger PDF]
   → Envoie au client

Features utilisées : Bibliothèque + Brief
Temps total : 2 min (vs 1h refaire from scratch)
```

---

## 🎯 **MATRICE USAGE PAR PERSONA**

| Feature | Décideur | Analyste | Consultant | Admin |
|---------|----------|----------|------------|-------|
| **Homepage → Brief** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Council** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| **Radar** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| **Dashboard** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Recherche** | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Bibliothèque** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Topics** | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Digests** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **Ingestion** | ⭐ | ⭐ | ⭐ | ⭐⭐⭐⭐⭐ |

---

## 🔗 **CARTE DES CONNEXIONS**

```
                    ┌─────────────┐
                    │  HOMEPAGE   │ ← Point d'entrée
                    │  (Question) │
                    └──────┬──────┘
                           │
            ┌──────────────┼──────────────┐
            ↓              ↓              ↓
      ┌─────────┐    ┌─────────┐    ┌──────────┐
      │  BRIEF  │    │ COUNCIL │    │ RECHERCHE│
      └────┬────┘    └────┬────┘    └────┬─────┘
           │              │              │
           │    ┌─────────┴─────────┐    │
           │    │                   │    │
           ↓    ↓                   ↓    ↓
      ┌──────────────────────────────────────┐
      │         BIBLIOTHÈQUE                 │
      │  [Approfondir] [Débattre] [Actualiser]│
      └────────────┬─────────────────────────┘
                   │
            ┌──────┴──────┐
            ↓             ↓
      ┌─────────┐   ┌─────────┐
      │  RADAR  │   │ TOPICS  │
      │(Signaux)│   │(Veilles)│
      └────┬────┘   └────┬────┘
           │             │
           │       ┌─────┴─────┐
           │       │           │
           ↓       ↓           ↓
      ┌─────────────────┐  ┌─────────┐
      │   DASHBOARD     │  │ DIGESTS │
      │  (Hub central)  │  │(Archive)│
      └─────────────────┘  └─────────┘
```

**Légende** :
- ↓ : Flux principal
- ↔ : Interconnexions

---

## ✅ **PRINCIPES D'INTÉGRATION**

### **1. Tout Converge vers Brief/Council**

```
Toutes les features mènent à la création d'un Brief/Council :

Radar signal → [Générer Brief]
Recherche sources → [Générer Brief avec ces sources]
Bibliothèque → [Approfondir] → Brief enrichi
Topics digest → [Générer Brief sur source]
```

**Rationale** : Brief/Council = output de valeur final

---

### **2. Dashboard = Hub Central**

```
Dashboard relie toutes les features :

- Quick action "Nouvelle question" → Homepage
- Badge "6 signaux" → Radar
- "127 briefs" → Bibliothèque
- "3 veilles actives" → Topics
```

**Rationale** : Point d'entrée unique, découvrabilité

---

### **3. Progressive Disclosure**

```
Niveau 1 (Homepage) : Simplicité radicale
Niveau 2 (Radar, Recherche) : Features visible si besoin
Niveau 3 (Topics, Ingestion) : Admin caché menu ...
```

**Rationale** : Pas overwhelm nouveau user

---

### **4. Actions Contextuelles**

```
Brief généré → [Approfondir] [Débattre] [Sources similaires]
Radar signal → [Générer Brief] [S'abonner]
Bibliothèque → [Actualiser] [Débattre] [Approfondir]
```

**Rationale** : Suggérer next action pertinente

---

## 🎊 **CONCLUSION**

### **Architecture en 3 Niveaux**

```
NIVEAU 1 (80% usage) :
Homepage → Brief/Council → Résultat
→ Simplicité radicale, 1 clic, 60s

NIVEAU 2 (15% usage) :
Radar, Recherche, Bibliothèque
→ Features complémentaires, toujours reliées au flow principal

NIVEAU 3 (5% usage) :
Topics, Digests, Ingestion
→ Admin/Power, configuration avancée
```

### **Tout Connecté**

```
Chaque feature :
1. A une valeur standalone
2. S'intègre au flow principal
3. Mène vers création Brief/Council
```

### **Vision Produit**

```
"Un écosystème cohérent où toutes les features
 travaillent ensemble pour un seul objectif :
 De la question à la décision éclairée, sans friction."
```

---

**Version** : Architecture Produit v1.0  
**Statut** : ✅ Implémenté et cohérent  
**Next** : Multimodal, Collaboration, Proactive Intelligence
