# 🧪 TEST FINAL — Traduction FR → EN

**Date** : 2026-01-23 20:25  
**Objectif** : Vérifier que la traduction fonctionne et retourne des sources pertinentes

---

## ⏳ ÉTAPE 1 : Installation (EN COURS)

```bash
Terminal #735224 : npm install
```

**Attendre** : "added X packages" dans le terminal

---

## 🚀 ÉTAPE 2 : Lancer le Serveur

Une fois `npm install` terminé :

```bash
npm run dev
```

**Attendre** :
```
✓ Compiled in XXXms
✓ Ready on http://localhost:3000
```

---

## 🧪 ÉTAPE 3 : Test de la Traduction

### A. Accéder au Dashboard
```
http://localhost:3000/dashboard
```

### B. Poser une Question en Français
```
l'impact de l'ia sur le travail
```

### C. Cliquer "Analyser"

---

## ✅ RÉSULTAT ATTENDU

### 1. Console SSE (Network tab)

Tu devrais voir ce message :

```json
event: progress
data: {
  "step": "enhance",
  "message": "🌐 Traduction FR → EN pour recherche académique...",
  "enhancement": {
    "original": "l'impact de l'ia sur le travail",
    "enhanced": "the impact of ai on work recent research 2023-2025 social impact societal effects",
    "translated": true,
    "domain": "social"
  }
}
```

**✅ SI TU VOIS `"translated": true`** → Traduction ACTIVE ! 🎉

---

### 2. Terminal Serveur

Tu devrais voir :

```
[SCOUT] Query: "the impact of ai on work recent research 2023-2025"
[OpenAlex] Found 45 papers
[Crossref] Found 32 papers
[PubMed] Found 28 papers
[RANK V2] Selected 6 diverse sources
```

**✅ Query en ANGLAIS** → Providers trouvent des résultats ! 🎯

---

### 3. Sources Retournées

Tu devrais voir des sources **PERTINENTES** :

```
✅ SRC-1 — AI and the Future of Work (2024)
✅ SRC-2 — Labor Market Automation: A Meta-Analysis (2023)
✅ SRC-3 — Employment Effects of Artificial Intelligence (2024)
✅ SRC-4 — Workforce Reskilling in the Age of AI (2023)
✅ SRC-5 — Job Displacement vs Creation: Empirical Evidence (2024)
✅ SRC-6 — Economic Impact of AI on Employment (2023)
```

**❌ FINI** : CRISPR, Quantum Computing, Green Roofs ! 🚫

---

### 4. Brief Généré

Le brief devrait contenir :

- ✅ **Titre** : "Impact of AI on Employment: ..."
- ✅ **Consensus** : Références à automation, reskilling, labor market
- ✅ **Debate** : Job creation vs displacement
- ✅ **Sources** : Toutes en rapport avec IA et emploi
- ✅ **Citations** : [SRC-1][SRC-2] pertinentes et cohérentes

---

## ❌ SI ÇA NE MARCHE PAS

### Symptôme 1 : Pas de message "Traduction FR → EN"

**Cause** : Code pas chargé

**Solution** :
```bash
# Forcer rebuild
Remove-Item -Recurse -Force .next
npm run dev
```

---

### Symptôme 2 : Sources toujours non pertinentes

**Cause** : Query pas traduite

**Debug** :
```bash
# Vérifier dans terminal serveur
# Chercher la ligne [SCOUT] Query:
# Elle doit être EN ANGLAIS
```

**Si query en français** :
1. Vérifie que `lib/ai/question-enhancer.ts` a bien les modifications
2. Redémarre le serveur
3. Vide le cache navigateur (Ctrl+Shift+R)

---

### Symptôme 3 : Erreur "next not found"

**Cause** : Installation incomplète

**Solution** :
```bash
# Vérifier que Next est installé
ls node_modules\.bin\next.cmd

# Si absent, réinstaller
npm install next@latest
```

---

## 🔍 COMMANDES DE DEBUG

### Vérifier la Traduction (Script Isolé)
```bash
node scripts/test-translation.mjs
```

**Résultat attendu** :
```
✅ "l'impact de l'ia sur le travail" → "the impact of ai on work"
✅ "taxe carbone en europe" → "carbon tax in europe"
✅ "économie de demain" → "economy of tomorrow"
```

---

### Vérifier Next.js
```bash
npx next --version
```

**Résultat attendu** : `14.x.x` ou `15.x.x`

---

### Vérifier le Pool Prisma
```bash
# Dans les logs, chercher :
grep "prisma:error" terminals/*.txt

# Résultat attendu : AUCUNE erreur
```

---

## 📊 CHECKLIST COMPLÈTE

### Installation
- [ ] `npm install` terminé sans erreurs
- [ ] `node_modules/.bin/next.cmd` existe
- [ ] Pas d'avertissement critique

### Serveur
- [ ] `npm run dev` démarre sans erreur
- [ ] "✓ Compiled" visible
- [ ] "Ready on http://localhost:3000" visible
- [ ] Aucune erreur `prisma:error` dans les logs

### Traduction
- [ ] Message "🌐 Traduction FR → EN..." dans SSE
- [ ] `enhancement.translated: true` dans payload
- [ ] Query traduite visible dans logs serveur

### Sources
- [ ] Sources pertinentes (AI employment, labor market)
- [ ] Pas de sources hors-sujet (CRISPR, Quantum, etc.)
- [ ] 6+ sources trouvées
- [ ] Providers variés (OpenAlex, Crossref, PubMed)

### Brief
- [ ] Titre cohérent avec la question
- [ ] Consensus/Debate en rapport avec IA et emploi
- [ ] Citations [SRC-*] pertinentes
- [ ] Pas d'erreur "Analysis Failed"

---

## 🎯 SUCCESS CRITERIA

**✅ TEST RÉUSSI SI** :

1. Message "Traduction FR → EN" visible dans Network tab
2. Query traduite en anglais dans logs serveur
3. Au moins 5/6 sources pertinentes sur IA et emploi
4. Brief cohérent sans sources hors-sujet

**🎉 QUAND ÇA MARCHE** :

Tu pourras poser n'importe quelle question en français et obtenir des sources académiques pertinentes en anglais !

**Exemples à tester après** :
- "taxe carbone en europe"
- "économie de demain"
- "blockchain et finance"
- "intelligence artificielle et santé"

---

**⏰ PROCHAINE ÉTAPE** : Attendre que `npm install` se termine (Terminal #735224) puis lancer `npm run dev` ! 🚀
