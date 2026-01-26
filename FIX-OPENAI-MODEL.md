# 🔧 FIX : Modèle OpenAI déprécié

## ❌ Problème détecté

```
404 The model `gpt-4-turbo-preview` does not exist or you do not have access to it.
```

## ✅ Solution : Mettre à jour vers `gpt-4o`

OpenAI a déprécié le modèle `gpt-4-turbo-preview`. Utilisez maintenant **`gpt-4o`** (GPT-4 Optimized).

### Avantages de `gpt-4o` :
- ✅ **2x plus rapide** que gpt-4-turbo
- ✅ **50% moins cher** ($2.50/1M tokens vs $5/1M)
- ✅ **Meilleure qualité** pour les synthèses
- ✅ **Disponible pour tous** les comptes OpenAI

---

## 🚀 Étapes de correction

### 1️⃣ Mettre à jour votre fichier `.env`

Ouvrez **`.env`** à la racine du projet et changez :

```diff
OPENAI_API_KEY=sk-proj-xxxxxxxxxx
- OPENAI_MODEL=gpt-4-turbo-preview
+ OPENAI_MODEL=gpt-4o
```

### 2️⃣ Tester la connexion

```powershell
npm run test:openai
```

**Résultat attendu** :

```
🔍 Test de connexion OpenAI...

✅ OPENAI_API_KEY trouvé
✅ OPENAI_MODEL: gpt-4o

🧪 Test 1: Simple completion...
   Réponse: "OK"
   ✅ Completion fonctionne

🧪 Test 2: Embedding...
   ✅ Embeddings fonctionnent

🎉 OpenAI est correctement configuré !
```

---

## 📊 Comparaison des modèles (Janvier 2026)

| Modèle | Statut | Vitesse | Prix (input) | Prix (output) | Recommandé |
|--------|--------|---------|--------------|---------------|------------|
| **gpt-4o** | ✅ Actif | Très rapide | $2.50/1M | $10/1M | ⭐ Oui |
| gpt-4-turbo | ✅ Actif | Rapide | $5/1M | $15/1M | Alternatif |
| gpt-4 | ✅ Actif | Standard | $30/1M | $60/1M | Non (cher) |
| gpt-4-turbo-preview | ❌ Déprécié | — | — | — | ❌ Non |

---

## 🔄 Modèles alternatifs

Si vous n'avez pas accès à `gpt-4o`, essayez dans cet ordre :

### Option 1 : gpt-4-turbo
```bash
OPENAI_MODEL=gpt-4-turbo
```

### Option 2 : gpt-4
```bash
OPENAI_MODEL=gpt-4
```

### Option 3 : gpt-3.5-turbo (économique mais moins précis)
```bash
OPENAI_MODEL=gpt-3.5-turbo
```

---

## ✅ Fichiers déjà mis à jour

J'ai automatiquement mis à jour ces fichiers de configuration :

- ✅ `lib/env.ts` → Default: `gpt-4o`
- ✅ `scripts/test-openai.mjs` → Default: `gpt-4o`
- ✅ `jest.setup.js` → Test env: `gpt-4o`
- ✅ `env.example.txt` → Example: `gpt-4o`

**Il vous reste juste à mettre à jour votre `.env` local !**

---

## 🎯 Impact sur NomosX

Tous les agents NomosX sont compatibles avec `gpt-4o` :

| Agent | Utilisation | Nouveau coût estimé |
|-------|-------------|---------------------|
| READER | Extraction claims | ~$0.05 par brief (↓50%) |
| ANALYST | Synthèses | ~$0.15 par brief (↓50%) |
| DIGEST | Veille hebdo | ~$0.08 par digest (↓50%) |
| RADAR | Signaux faibles | ~$0.10 pour 5 cards (↓50%) |
| COUNCIL | Débats | ~$0.05 par débat (↓50%) |

**Budget recommandé avec gpt-4o** : **$10-15/mois** (au lieu de $20)

---

## 🔍 Vérifier les modèles disponibles

Pour voir tous les modèles disponibles sur votre compte :

```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY" | jq '.data[].id' | grep gpt-4
```

Ou visitez : https://platform.openai.com/docs/models

---

## ❓ FAQ

### Q: Pourquoi gpt-4-turbo-preview ne fonctionne plus ?
**A:** OpenAI a déprécié ce modèle de preview et l'a remplacé par les versions stables (`gpt-4o`, `gpt-4-turbo`).

### Q: Dois-je payer plus pour gpt-4o ?
**A:** Non, c'est moins cher ! `gpt-4o` coûte 50% moins cher que `gpt-4-turbo-preview`.

### Q: Mes anciens briefs vont-ils changer ?
**A:** Non, seuls les nouveaux briefs utiliseront `gpt-4o`. La qualité sera égale ou meilleure.

### Q: Puis-je utiliser gpt-3.5-turbo pour économiser ?
**A:** Oui, mais la qualité des synthèses sera inférieure. Recommandé uniquement pour les tests.

---

## 📞 Support

Si le problème persiste après mise à jour :

1. Vérifiez que votre clé API est valide
2. Vérifiez votre quota sur : https://platform.openai.com/usage
3. Essayez `gpt-4-turbo` comme alternative

---

**Mise à jour** : 19/01/2026  
**Statut** : ✅ Configuration corrigée
