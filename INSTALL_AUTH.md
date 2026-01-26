# 🚀 Installation Authentification — Quick Start

**Temps** : 5 minutes  
**Prérequis** : Database PostgreSQL configurée

---

## ⚡ Installation Rapide

### 1. Variables d'Environnement

Ajouter dans `.env` :

```bash
# JWT Secret (CHANGE IN PRODUCTION)
JWT_SECRET="nomosx-production-secret-key-$(openssl rand -hex 32)"

# Password Salt (CHANGE IN PRODUCTION)
PASSWORD_SALT="nomosx-production-salt-$(openssl rand -hex 16)"
```

**⚠️ Générer des valeurs aléatoires pour production !**

### 2. Migration Database

```bash
npm run prisma:gen && npm run db:push
```

### 3. Démarrer

```bash
npm run dev
```

### 4. Tester

```bash
# Ouvrir navigateur
http://localhost:3000/auth/register

# Créer un compte
Email: test@example.com
Password: password123

# → Redirect automatique vers /dashboard
```

---

## ✅ Vérification

### Test Inscription

1. Aller sur `http://localhost:3000`
2. Cliquer **"S'inscrire"**
3. Remplir le formulaire
4. Submit → Redirect `/dashboard`

### Test Connexion

1. Se déconnecter (bouton Shell)
2. Aller sur `http://localhost:3000/auth/login`
3. Se connecter avec credentials
4. Submit → Redirect `/dashboard`

### Test Protection Routes

1. Se déconnecter
2. Tenter d'accéder `http://localhost:3000/dashboard`
3. → Redirect automatique vers `/auth/login?redirect=/dashboard`
4. Se connecter → Redirect `/dashboard`

---

## 🐛 Si Problème

### Erreur "Unauthorized"

```bash
# Clear cookies navigateur
# Restart dev server
npm run dev
```

### Erreur Database

```bash
# Re-sync database
npm run prisma:gen
npm run db:push

# Vérifier DATABASE_URL dans .env
```

### Redirect Loop

```bash
# Vérifier middleware.ts
# Vérifier JWT_SECRET défini
```

---

## 📊 Structure Database

Une nouvelle table **User** sera créée :

```sql
CREATE TABLE "User" (
  "id" TEXT PRIMARY KEY,
  "email" TEXT UNIQUE NOT NULL,
  "password" TEXT NOT NULL,
  "name" TEXT,
  "role" TEXT DEFAULT 'user',
  "emailVerified" BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP,
  "lastLoginAt" TIMESTAMP
);
```

---

## 🎯 Prochaines Étapes

Après installation :

1. ✅ Créer votre compte admin
2. ✅ Tester toutes les pages app
3. ✅ Configurer password reset (optionnel)
4. ✅ Ajouter email verification (optionnel)
5. ✅ Déployer en production

---

**Installation terminée** ! L'authentification est maintenant active. 🎉
