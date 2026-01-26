# 🚀 INSTRUCTIONS DE REDÉMARRAGE

## Corrections Appliquées

✅ **Traduction FR → EN** : Corrigée avec ordre de remplacement optimisé  
✅ **Détection français** : Seuil réduit à 1 indicateur (plus sensible)  
✅ **Pool Prisma** : Optimisé pour Neon (connection limits)

---

## ⚡ ACTION REQUISE : Redémarrer le Serveur

### Option 1 : Dans le Terminal Cursor

1. **Trouve le terminal où `npm run dev` tourne** (Terminal #2)
2. **Appuie sur `Ctrl+C`** pour arrêter le serveur
3. **Relance** :
   ```bash
   npm run dev
   ```

---

### Option 2 : Nouveau Terminal

1. **Ouvre un nouveau terminal** dans Cursor
2. **Lance** :
   ```bash
   cd c:\Users\madeleine.stephann\OneDrive\Bureau\NomosX
   npm run dev
   ```

---

## 🧪 Test Après Redémarrage

1. **Va sur** : http://localhost:3000/dashboard
2. **Pose la question** : `l'impact de l'ia sur le travail`
3. **Clique "Analyser"**

### 🎯 Résultat Attendu

#### Console (SSE Progress)
```
🌐 Traduction FR → EN pour recherche académique...
🔍 Domaine détecté : social/technology
✓ Query traduite : "the impact of ai on work recent research 2023-2025"
```

#### Sources Retournées
```
✅ AI and Employment
✅ Labor Market Automation
✅ Future of Work
✅ Job Displacement Studies
✅ Workforce Reskilling

❌ FINI : CRISPR, Quantum Computing, Green Roofs !
```

#### Brief
```
✅ Cohérent et pertinent sur IA et emploi
✅ Citations [SRC-1][SRC-2] en rapport avec le sujet
✅ Analyse exploitable pour décideurs
```

---

## 🐛 Si Ça Ne Marche Toujours Pas

### 1. Vérifier la Compilation
```bash
# Le terminal devrait montrer :
✓ Compiled /api/brief/stream in XXXms
```

### 2. Forcer Rebuild Complet
```bash
# Supprimer cache Next.js
Remove-Item -Recurse -Force .next
npm run dev
```

### 3. Vérifier les Logs
```bash
# Chercher "Traduction" dans les logs
# Tu devrais voir :
🌐 Traduction FR → EN pour recherche académique...
```

---

## 📊 Changements Techniques

### `lib/ai/question-enhancer.ts`

#### 1. Détection FR Plus Sensible
```typescript
// AVANT : score >= 2
return frenchScore >= 2;

// APRÈS : score >= 1
return frenchScore >= 1;
```

#### 2. Traduction en 3 Étapes
```typescript
// ÉTAPE 1 : Phrases composées (priorité haute)
"l'impact de l'ia sur le travail" → "the impact of ai on work"

// ÉTAPE 2 : Mots individuels
"économie" → "economy"

// ÉTAPE 3 : Prépositions (priorité basse)
" sur " → " on "
```

### `lib/db.ts`
```typescript
// Singleton pattern + graceful shutdown
// SIGINT/SIGTERM → $disconnect()
```

### `.env`
```bash
# Ajout paramètres pool Neon
?connection_limit=10&pool_timeout=10&connect_timeout=5
```

---

## ✅ Checklist Finale

- [ ] Serveur redémarré (`npm run dev`)
- [ ] Console montre "✓ Compiled" sans erreurs
- [ ] Test avec "l'impact de l'ia sur le travail"
- [ ] Message "🌐 Traduction FR → EN" visible
- [ ] Sources pertinentes retournées (AI employment, etc.)
- [ ] Aucune erreur `prisma:error` dans les logs

---

**🎉 QUAND TOUT MARCHE** : Tu verras des sources **pertinentes** sur IA et emploi, pas des CRISPR ou Green Roofs ! 🚀
