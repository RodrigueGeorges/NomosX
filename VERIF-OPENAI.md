# ✅ Vérification Configuration OpenAI

## 🔍 Est-ce qu'OpenAI est bien branché ?

### 1️⃣ Vérifier votre fichier `.env`

Votre fichier `.env` (à la racine du projet) doit contenir :

```bash
# OpenAI (OBLIGATOIRE)
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
OPENAI_MODEL=gpt-4o

# Base de données (OBLIGATOIRE)
DATABASE_URL=postgresql://user:password@localhost:5432/nomosx
```

### 2️⃣ Obtenir votre clé API OpenAI

Si vous n'avez pas encore de clé :

1. Allez sur : https://platform.openai.com/api-keys
2. Connectez-vous ou créez un compte
3. Cliquez sur **"Create new secret key"**
4. Copiez la clé (commence par `sk-proj-...` ou `sk-...`)
5. Collez-la dans votre `.env`

### 3️⃣ Tester la connexion

```powershell
# Dans le terminal du projet
npm run test:openai
```

**Résultat attendu** :

```
🔍 Test de connexion OpenAI...

✅ OPENAI_API_KEY trouvé
✅ OPENAI_MODEL: gpt-4-turbo-preview
   Clé API: sk-proj-XX...XX

🧪 Test 1: Simple completion...
   Réponse: "OK"
   ✅ Completion fonctionne

🧪 Test 2: Embedding (pour recherche sémantique)...
   Dimension: 1536
   ✅ Embeddings fonctionnent

🎉 OpenAI est correctement configuré !

📊 Vous pouvez utiliser :
   - READER Agent (extraction de claims)
   - ANALYST Agent (synthèses stratégiques)
   - DIGEST Agent (veille hebdomadaire)
   - RADAR Agent (signaux faibles)
   - COUNCIL Agent (débats multi-angles)
   - Recherche sémantique (embeddings)
```

---

## 🚨 Erreurs Courantes

### ❌ Erreur : "OPENAI_API_KEY manquant dans .env"

**Cause** : Le fichier `.env` n'existe pas ou ne contient pas la clé

**Solution** :
```powershell
# Créer le fichier .env à la racine
New-Item -Path .env -ItemType File

# Ouvrir et ajouter :
# OPENAI_API_KEY=sk-...
# OPENAI_MODEL=gpt-4-turbo-preview
```

---

### ❌ Erreur : "401 Unauthorized" ou "Clé API invalide"

**Cause** : La clé est incorrecte, expirée ou mal copiée

**Solution** :
1. Vérifiez qu'il n'y a pas d'espaces avant/après la clé dans `.env`
2. Régénérez une nouvelle clé sur https://platform.openai.com/api-keys
3. Vérifiez que la clé commence bien par `sk-` ou `sk-proj-`

---

### ❌ Erreur : "insufficient_quota" ou "Quota insuffisant"

**Cause** : Pas de crédit sur votre compte OpenAI

**Solution** :
1. Allez sur : https://platform.openai.com/account/billing
2. Ajoutez un moyen de paiement
3. Ajoutez des crédits (minimum $5)

💡 **Note** : Nouveau compte = $5 gratuits pendant 3 mois

---

### ❌ Erreur : "429 Rate limit"

**Cause** : Trop de requêtes en peu de temps

**Solution** :
- Attendez 60 secondes
- Vérifiez vos limites sur https://platform.openai.com/account/limits

---

## 📊 Où OpenAI est utilisé dans NomosX

| Agent | Modèle | Usage |
|-------|--------|-------|
| **READER** | gpt-4-turbo-preview | Extraction de claims/méthodes/résultats depuis abstracts |
| **ANALYST** | gpt-4-turbo-preview | Génération de synthèses stratégiques |
| **DIGEST** | gpt-4-turbo-preview | Création de digests hebdomadaires |
| **RADAR** | gpt-4-turbo-preview | Détection de signaux faibles |
| **COUNCIL** | gpt-4-turbo-preview | Débats multi-perspectives |
| **Embeddings** | text-embedding-3-small | Recherche sémantique hybride |

---

## 🧪 Test Manuel Rapide

Si `npm run test:openai` ne fonctionne pas, testez directement dans le code :

```typescript
// test-quick.ts
import OpenAI from 'openai';
import 'dotenv/config';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const test = await openai.chat.completions.create({
  model: 'gpt-4-turbo-preview',
  messages: [{ role: 'user', content: 'Dis OK' }],
  max_tokens: 5,
});

console.log(test.choices[0].message.content); // Doit afficher "OK"
```

Exécuter :
```powershell
node test-quick.ts
```

---

## ✅ Checklist de vérification

- [ ] Fichier `.env` existe à la racine du projet
- [ ] `OPENAI_API_KEY=sk-...` présent dans `.env`
- [ ] `OPENAI_MODEL=gpt-4-turbo-preview` présent dans `.env`
- [ ] Clé API valide (sans espaces, pas expirée)
- [ ] Compte OpenAI a des crédits disponibles
- [ ] `npm run test:openai` retourne ✅ succès

---

## 🔐 Sécurité

⚠️ **Important** :
- Ne commitez JAMAIS votre `.env` sur Git (déjà dans `.gitignore`)
- Ne partagez JAMAIS votre `OPENAI_API_KEY`
- Régénérez la clé si elle est exposée

---

## 💰 Coût estimé

Pour une utilisation normale de NomosX :

| Opération | Coût estimé |
|-----------|-------------|
| 1 Brief (READER + ANALYST) | ~$0.10 - $0.30 |
| 1 Digest hebdomadaire | ~$0.05 - $0.15 |
| 1 Radar (5 signaux) | ~$0.08 - $0.20 |
| 1 Council (débat) | ~$0.05 - $0.10 |
| 1000 embeddings | ~$0.001 |

**Budget recommandé** : $20/mois pour usage régulier

---

## 📞 Support

Si le problème persiste :

1. Vérifiez les logs dans le terminal
2. Consultez https://status.openai.com/ (statut du service)
3. Vérifiez votre dashboard OpenAI : https://platform.openai.com/usage

---

**Dernière mise à jour** : 19/01/2026
