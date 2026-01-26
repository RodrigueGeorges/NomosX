# 🎯 Analyse Parcours Utilisateur — Vision Product

**Date** : 20 janvier 2026  
**Analyste** : Head of Product perspective  
**Problème** : Parcours trop complexe, non fluide, expose la plomberie technique

---

## ❌ PARCOURS ACTUEL (Problématique)

### **Workflow Utilisateur**
```
1. User visite /ingestion
2. User choisit providers (OpenAlex, CrossRef, etc.)
3. User lance ingestion manuellement
4. User attend résultats (30-60s)
5. User va sur /search
6. User cherche dans les sources ingérées
7. User va sur /brief OU /council OU /radar
8. User pose sa question
9. System génère analyse
```

**Nombre d'étapes** : **9 étapes**  
**Temps total** : **3-5 minutes**  
**Friction** : **ÉLEVÉE** 🔴

---

## 🚨 PROBLÈMES IDENTIFIÉS

### **1. Complexité Cognitive** 🧠
- User doit **comprendre** : providers, ingestion, sources, agents
- User doit **décider** : quels providers ? combien de résultats ?
- User doit **orchestrer** : ingestion → recherche → analyse

**Impact** : Barrière à l'entrée élevée, courbe d'apprentissage

---

### **2. Exposition de la Plomberie Technique** ⚙️
- Ingestion = concept technique interne
- Providers = détail d'implémentation
- Sources = abstraction backend

**Impact** : User ne devrait PAS voir ça

---

### **3. Workflow Non-Linéaire** 🔀
- User saute entre pages : /ingestion → /search → /brief
- Pas de fil conducteur clair
- Navigation confuse

**Impact** : Désorientation, abandon

---

### **4. Pas de "Magic Moment"** ✨
- Trop d'attente avant valeur
- Pas de gratification immédiate
- Process technique visible

**Impact** : Faible engagement initial

---

### **5. Duplication de l'Effort** 🔄
```
User ingère "carbon tax" → /ingestion
User cherche "carbon tax" → /search  
User demande brief "carbon tax" → /brief
```

**Même intention, 3 fois répétée**

**Impact** : Frustration, perte de temps

---

## ✅ PARCOURS IDÉAL (Recommandation)

### **Vision Product : "Intent-First, Agent-Automated"**

**Principe** : User exprime son intention, agents font le reste.

### **Nouveau Workflow**
```
1. User arrive sur page d'accueil
2. User tape sa question/topic dans 1 champ
   "Quels sont les impacts d'une taxe carbone en Europe ?"
3. System détecte automatiquement :
   - Topic : Carbon tax, Europe
   - Providers pertinents (auto-select)
   - Type d'analyse souhaité (Brief vs Council vs Radar)
4. Agents orchestrent en arrière-plan :
   → SCOUT : ingestion auto des sources pertinentes
   → INDEX : enrichissement auto
   → RANK : sélection top sources
   → ANALYST : génération analyse
5. User reçoit résultat en 30-60s
   Avec option "Voir sources" si intéressé
```

**Nombre d'étapes** : **2 étapes** (question → résultat)  
**Temps total** : **30-60 secondes**  
**Friction** : **MINIMALE** 🟢

---

## 🎨 NOUVELLE INTERFACE PROPOSÉE

### **Page d'Accueil Refonte**

```
┌─────────────────────────────────────────────────┐
│  🧠 NomosX — Agentic Think Tank                 │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │ Quelle question souhaitez-vous explorer ?  │ │
│  │                                             │ │
│  │ Ex: Impact de l'IA sur le marché du        │ │
│  │     travail européen d'ici 2030             │ │
│  │                                             │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  [Générer Brief]  [Débat Multi-Angles]          │
│                                                  │
│  OU choisissez un topic pré-configuré :         │
│                                                  │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐       │
│  │ IA & │  │ Climat│  │Finance│  │ Santé│       │
│  │Emploi│  │       │  │       │  │      │       │
│  └──────┘  └──────┘  └──────┘  └──────┘       │
└─────────────────────────────────────────────────┘
```

**Simplicité maximale** : 1 champ, 2 CTAs principaux

---

### **Pendant Génération (30-60s)**

```
┌─────────────────────────────────────────────────┐
│  🤖 Agents au travail...                         │
│                                                  │
│  ✓ Recherche dans 28M+ sources (3s)             │
│  ✓ Sélection top 12 sources pertinentes (2s)    │
│  ⏳ Analyse multi-perspectives (25s)             │
│                                                  │
│  ████████████████░░░░░░░░ 75%                   │
│                                                  │
│  Sources trouvées : 847                          │
│  Sources sélectionnées : 12                      │
│  Confiance : Haute                               │
└─────────────────────────────────────────────────┘
```

**Feedback visuel** : Progression, transparence, confiance

---

### **Résultat Final**

```
┌─────────────────────────────────────────────────┐
│  📋 Brief : Impact IA sur marché travail UE      │
│                                                  │
│  [Synthèse] [4 Perspectives] [Sources] [Export] │
│                                                  │
│  📊 SYNTHÈSE EXÉCUTIVE                           │
│  L'IA devrait créer 20M emplois en Europe...   │
│                                                  │
│  🟢 PERSPECTIVE ÉCONOMIQUE                       │
│  Le PIB européen pourrait croître de 2.3%...   │
│                                                  │
│  [Voir 12 sources utilisées ▼]                  │
│  [Relancer avec nouvelles sources]              │
│  [Créer veille automatique sur ce topic]        │
└─────────────────────────────────────────────────┘
```

**Actions post-résultat** : Export, veille auto, re-génération

---

## 🚀 FEATURES CLÉS DU NOUVEAU PARCOURS

### **1. Auto-Ingestion Intelligente** 🤖
- System détecte topic de la question
- Appelle SCOUT automatiquement en arrière-plan
- User ne voit jamais "/ingestion"

**Implémentation** :
```typescript
// app/api/brief/auto/route.ts
async function autoBrief(question: string) {
  // 1. Extract topic/keywords
  const keywords = await extractKeywords(question);
  
  // 2. Auto-scout
  await scout(keywords.join(" "), ["openalex", "crossref"], 20);
  
  // 3. Index
  await indexAgent(sourceIds);
  
  // 4. Rank
  const topSources = await rank(question, 12);
  
  // 5. Analyst
  const brief = await analyst(question, topSources);
  
  return brief;
}
```

---

### **2. Smart Routing** 🎯
- Question = Brief (analyse structurée)
- Question avec "débat" = Council (multi-perspectives)
- Topic de veille = Auto-création Topic + Digest

**Exemples** :
```
"Impact taxe carbone ?" → Brief
"Débat : IA va-t-elle réduire chômage ?" → Council
"Veille : nouvelles recherches climat" → Topic + Digest auto
```

---

### **3. Progressive Disclosure** 📊
- User voit d'abord résultat
- Détails sources accessibles (mais cachés par défaut)
- Options avancées en "Mode Expert" (toggle)

**Principe** : Simple par défaut, puissant si besoin

---

### **4. Veille Automatique** 🔔
```
Après génération Brief :

┌─────────────────────────────────────────────────┐
│  💡 Souhaitez-vous suivre ce sujet ?             │
│                                                  │
│  [Créer veille hebdomadaire]                    │
│  → Vous recevrez un digest chaque lundi         │
│     avec nouvelles recherches sur "taxe carbone"│
└─────────────────────────────────────────────────┘
```

**1 clic** → Topic créé + Digest auto + Email notif

---

### **5. Templates de Questions** 📝
```
Home page :

Explorations populaires :
- 💼 "Impact IA sur emploi en France d'ici 2030"
- 🌍 "Efficacité des politiques climatiques UE"
- 💰 "Crypto-monnaies : régulation vs innovation"
- 🏥 "Télémédecine : preuves d'efficacité"
```

**Aide au démarrage** : User clique, adapte, lance

---

## 📊 COMPARAISON AVANT/APRÈS

| Métrique | Avant | Après | Amélioration |
|----------|-------|-------|--------------|
| **Étapes** | 9 | 2 | **-78%** |
| **Temps** | 3-5 min | 30-60s | **-80%** |
| **Clics** | 15+ | 2 | **-87%** |
| **Friction cognitive** | Élevée | Minimale | **-90%** |
| **Time to value** | 5 min | 30s | **-90%** |
| **Taux abandon estimé** | 60% | 15% | **-75%** |
| **Compréhension concept** | Nécessaire | Optionnelle | ✅ |

---

## 🎯 RECOMMANDATIONS PRIORITAIRES

### **Phase 1 : Quick Wins (1-2 jours)** 🟢

#### **1.1 Refonte Homepage**
- Remplacer hero actuel par **1 grand champ de question**
- 2 CTAs : "Générer Brief" / "Débat Multi-Angles"
- 4 templates de questions cliquables
- Supprimer liens vers /ingestion du nav principal

**Fichiers** :
- `app/page.tsx` — Nouveau design simplifié
- `components/Shell.tsx` — Cacher "Ingestion" du mainNav

---

#### **1.2 API Auto-Brief**
- Créer `/api/brief/auto` qui orchestre tout
- Input : question
- Output : brief complet
- En arrière-plan : scout → index → rank → analyst

**Fichier** :
- `app/api/brief/auto/route.ts` — Nouvelle API orchestratrice

---

#### **1.3 Feedback Visuel**
- Pendant génération (30-60s), afficher :
  - Étape en cours
  - Progression (%)
  - Sources trouvées
  - Confiance estimée

**Fichier** :
- `app/brief/page.tsx` — Ajouter composant ProgressSteps

---

### **Phase 2 : Améliorations UX (3-5 jours)** 🟡

#### **2.1 Smart Routing**
- Détection intention : brief vs council vs radar
- Auto-suggestion : "Cette question semble être un débat → Council ?"

#### **2.2 Progressive Disclosure**
- Sources cachées par défaut
- Toggle "Mode Expert" (affiche providers, scores, etc.)

#### **2.3 Veille Auto (1-Click)**
- CTA post-brief : "Créer veille automatique"
- Crée Topic + active Digest + configure email

---

### **Phase 3 : Intelligence Avancée (1-2 semaines)** 🔴

#### **3.1 Topic Extraction Auto (NLP)**
```typescript
async function extractTopics(question: string) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{
      role: "user",
      content: `Extract main topics and keywords from: "${question}"`
    }]
  });
  return topics;
}
```

#### **3.2 Provider Selection Auto**
- Selon topic, choisir meilleurs providers
- Exemple : "climat" → OpenAlex + Semantic Scholar
- "santé" → PubMed + OpenAlex

#### **3.3 Caching Intelligent**
- Si question similaire récente (< 24h), réutiliser sources
- Éviter ingestion inutile

---

## 🎨 MOCKUPS NOUVELLE UX

### **Homepage Simplifiée**

```tsx
// app/page.tsx — Nouveau design

export default function HomePage() {
  const [question, setQuestion] = useState("");
  const [mode, setMode] = useState<"brief" | "council">("brief");

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-4xl w-full px-6">
        {/* Logo */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4">NomosX</h1>
          <p className="text-xl text-muted">
            Think tank agentique pour décisions stratégiques éclairées
          </p>
        </div>

        {/* Question Input */}
        <Card variant="premium" className="mb-6">
          <CardContent className="py-8">
            <label className="text-sm text-muted mb-3 block">
              Quelle question souhaitez-vous explorer ?
            </label>
            <Textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ex: Quels sont les impacts économiques d'une taxe carbone selon la littérature récente ?"
              rows={4}
              className="text-lg mb-4"
            />
            
            <div className="flex gap-3">
              <Button 
                variant="ai" 
                size="lg"
                onClick={() => generateBrief(question)}
                disabled={!question}
              >
                <Sparkles size={20} />
                Générer Brief (30s)
              </Button>
              <Button 
                variant="accent" 
                size="lg"
                onClick={() => generateCouncil(question)}
                disabled={!question}
              >
                <MessagesSquare size={20} />
                Débat Multi-Angles (45s)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Templates */}
        <div className="grid md:grid-cols-2 gap-4">
          {TEMPLATES.map((template) => (
            <Card 
              key={template.id}
              hoverable
              onClick={() => setQuestion(template.question)}
            >
              <CardContent className="py-4">
                <div className="flex items-center gap-3">
                  <template.Icon size={20} className="text-accent" />
                  <p className="text-sm">{template.question}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

## ✅ DÉCISION PRODUCT

### **Recommandation Finale**

**OUI, le parcours doit être simplifié radicalement.**

**Nouveau paradigme** :
```
AVANT : User = opérateur technique (gère ingestion, sources, agents)
APRÈS : User = stratège (pose questions, reçoit analyses)
```

**Principe de design** :
> "L'utilisateur ne devrait jamais voir ou comprendre les agents.  
> Il pose une question, magie opère, il obtient une réponse."

---

## 🚀 ROADMAP IMPLÉMENTATION

### **Sprint 1 (2 jours)** — Quick Wins
- [ ] Refonte homepage (1 champ question)
- [ ] API `/api/brief/auto` (orchestration auto)
- [ ] Feedback visuel progression
- [ ] Cacher "Ingestion" du nav principal

### **Sprint 2 (3 jours)** — UX Polish
- [ ] Smart routing (brief vs council)
- [ ] Progressive disclosure (sources cachées)
- [ ] Templates de questions
- [ ] 1-click veille auto

### **Sprint 3 (1 semaine)** — Intelligence
- [ ] Topic extraction NLP
- [ ] Provider selection auto
- [ ] Caching intelligent
- [ ] Suggestions contextuelles

---

## 📈 MÉTRIQUES DE SUCCÈS

### **KPIs à mesurer**

1. **Time to First Value** : < 60 secondes
2. **Taux d'abandon** : < 20% (vs 60% estimé actuel)
3. **Questions posées / user** : > 3 (vs 1 estimé actuel)
4. **NPS** : > 50 (satisfaction)
5. **% users créant veille** : > 30%

---

## 💡 CONCLUSION

**Le diagnostic est clair** : Le parcours actuel expose trop la complexité technique et crée trop de friction.

**La solution** : Intent-first design où l'utilisateur exprime simplement ce qu'il veut savoir, et les agents orchestrent tout en arrière-plan.

**Impact estimé** :
- **-80% temps** (5min → 30s)
- **-78% étapes** (9 → 2)
- **+300% engagement** (1 → 3+ questions/user)

**Prochaine étape** : Implémenter Sprint 1 (2 jours) pour valider l'hypothèse avec users réels.

---

**Version** : 1.0  
**Auteur** : Head of Product Analysis  
**Statut** : **RECOMMANDATION FORTE — À IMPLÉMENTER RAPIDEMENT**
