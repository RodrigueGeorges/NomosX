# 🔧 NomosX — Troubleshooting Guide

## Problèmes Courants et Solutions

### 🚨 Erreur : "module is not defined in ES module scope"

**Cause** : Fichiers de config en CommonJS au lieu d'ES modules

**Solution** :
```javascript
// ❌ MAUVAIS (CommonJS)
module.exports = { ... }

// ✅ BON (ES Module)
export default { ... }
```

**Fichiers corrigés** :
- `postcss.config.js`
- `tailwind.config.js`

---

### 🚨 Erreur : "@import rules must precede all rules"

**Cause** : Imports CSS mal placés

**Solution** : Les `@import` doivent être **EN PREMIER** dans le fichier CSS

```css
/* ✅ BON ORDRE */
@import url('...');
@tailwind base;
/* ... */
```

**Fichier corrigé** : `app/globals.css`

---

### 🚨 Erreur : "createContext only works in Client Components"

**Cause** : Utilisation de recharts (qui utilise Context) dans un Server Component

**Solution** : Ajouter `"use client"` en haut du fichier

```tsx
"use client";  // ← Ajouter ceci

import { AreaChart } from "recharts";
// ...
```

**Fichier corrigé** : `app/page.tsx`

---

### 🚨 Erreur : "recharts is not defined"

**Cause** : Package non installé

**Solution** :
```bash
npm install recharts
# ou si ça ne marche pas
npm install recharts --force
```

---

### 🚨 Erreur : Build prend trop de temps / timeout

**Cause** : First build compile tout

**Solution** : Patience ! Le premier build prend 2-5 minutes

```bash
# Attendre de voir :
✓ Ready in X.Xs
```

---

### 🚨 Erreur : Page blanche / 500 Error

**Causes possibles** :
1. Serveur pas encore prêt
2. Cache corrompu
3. Prisma client pas généré

**Solutions** :
```bash
# 1. Attendre "Ready" dans le terminal
# 2. Nettoyer le cache
rm -rf .next
npm run dev

# 3. Régénérer Prisma
npx prisma generate
npm run dev
```

---

### 🚨 Erreur : "DATABASE_URL not found"

**Cause** : Fichier `.env` manquant ou incomplet

**Solution** :
```bash
# Créer .env à la racine du projet
DATABASE_URL="postgresql://..."
OPENAI_API_KEY="sk-..."
ADMIN_KEY="votre-clé-secrète"
```

Voir `ENV.md` pour la liste complète

---

### 🚨 Erreur : TypeScript errors pendant dev

**Cause** : Types React incompatibles

**Solution** :
```bash
# Réinstaller les types
rm -rf node_modules/@types
npm install

# ou
npm install @types/react@latest --force
```

---

### 🚨 Erreur : "Cannot find module '@/...'�"

**Cause** : Path alias non configuré

**Solution** : Vérifier `tsconfig.json`

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

---

### 🚨 Erreur : Port 3000 déjà utilisé

**Cause** : Ancien serveur encore actif

**Solution** :
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# ou changer de port
PORT=3001 npm run dev
```

---

### 🚨 Erreur : CORS / API endpoint 404

**Cause** : Route API mal nommée ou serveur pas redémarré

**Solution** :
1. Vérifier que le fichier est dans `app/api/*/route.ts`
2. Redémarrer le serveur (Ctrl+C puis `npm run dev`)
3. Vérifier l'URL : `/api/topics` (pas `/api/topics/`)

---

### 🚨 Erreur : Prisma "Table does not exist"

**Cause** : Base de données pas initialisée

**Solution** :
```bash
# Push le schema vers la DB
npx prisma db push

# ou si vous voulez des migrations
npx prisma migrate dev
```

---

### 🚨 Erreur : OpenAI API timeout

**Cause** : Clé API invalide ou rate limit

**Solution** :
1. Vérifier `OPENAI_API_KEY` dans `.env`
2. Vérifier les quotas sur platform.openai.com
3. Augmenter le timeout dans le code si nécessaire

---

### 🚨 Erreur : Admin key rejected

**Cause** : Mauvaise clé admin fournie

**Solution** :
1. Vérifier `ADMIN_KEY` dans `.env`
2. Utiliser exactement la même valeur dans l'UI
3. Pas d'espaces avant/après

---

## 🔍 Debugging Tips

### Logs Serveur
```bash
# Voir tous les logs
npm run dev

# Logs détaillés
DEBUG=* npm run dev
```

### Logs API
Ouvrir la console du navigateur (F12) → Network tab

### Database Debug
```bash
# Ouvrir Prisma Studio
npx prisma studio
# Puis : http://localhost:5555
```

### Check Versions
```bash
node --version    # Should be >= 18
npm --version     # Should be >= 9
npx next --version
```

---

## 🆘 Last Resort

Si rien ne marche :

```bash
# 1. Supprimer TOUT
rm -rf node_modules .next package-lock.json

# 2. Réinstaller
npm install

# 3. Générer Prisma
npx prisma generate

# 4. Redémarrer
npm run dev
```

---

## 📞 Checklist Before Asking for Help

- [ ] Terminal montre "✓ Ready"
- [ ] `.env` existe et est correct
- [ ] Database est accessible
- [ ] `node_modules` existe
- [ ] Cache `.next` supprimé et régénéré
- [ ] Console navigateur ouverte (F12)
- [ ] Testé en navigation privée
- [ ] Dernière version du code

---

**Troubleshooting Guide V1.1** — Solutions aux problèmes courants
