# Variables d'Environnement — Authentification

**Fichier** : `.env`

---

## 🔒 Variables Authentification

### JWT_SECRET

**Description** : Secret pour signer les JWT tokens  
**Requis** : Oui  
**Default** : "nomosx-secret-key-change-in-production"  

**⚠️ PRODUCTION** : Générer une valeur aléatoire sécurisée

```bash
# Générer un secret aléatoire
openssl rand -hex 32

# Exemple
JWT_SECRET="a3f8d9e2b1c4567890abcdef1234567890abcdef1234567890abcdef12345678"
```

### PASSWORD_SALT

**Description** : Salt pour hasher les mots de passe  
**Requis** : Oui  
**Default** : "nomosx-salt-change-in-production"  

**⚠️ PRODUCTION** : Générer une valeur aléatoire sécurisée

```bash
# Générer un salt aléatoire
openssl rand -hex 16

# Exemple
PASSWORD_SALT="a3f8d9e2b1c4567890abcdef12345678"
```

---

## 📝 Exemple Complet `.env`

```bash
# ================================
# DATABASE
# ================================
DATABASE_URL="postgresql://user:password@localhost:5432/nomosx"

# ================================
# AUTHENTICATION (REQUIRED)
# ================================
JWT_SECRET="a3f8d9e2b1c4567890abcdef1234567890abcdef1234567890abcdef12345678"
PASSWORD_SALT="a3f8d9e2b1c4567890abcdef12345678"

# ================================
# OPENAI API
# ================================
OPENAI_API_KEY="sk-..."
OPENAI_MODEL="gpt-4o"

# ================================
# ADMIN ACCESS
# ================================
ADMIN_KEY="your-admin-secret-key"

# ================================
# ENVIRONMENT
# ================================
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 🚀 Quick Setup

```bash
# 1. Copier template
cat > .env << 'EOF'
DATABASE_URL="postgresql://user:password@localhost:5432/nomosx"
JWT_SECRET="$(openssl rand -hex 32)"
PASSWORD_SALT="$(openssl rand -hex 16)"
OPENAI_API_KEY="sk-..."
OPENAI_MODEL="gpt-4o"
ADMIN_KEY="admin-secret"
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
EOF

# 2. Générer secrets
echo "JWT_SECRET=\"$(openssl rand -hex 32)\"" >> .env
echo "PASSWORD_SALT=\"$(openssl rand -hex 16)\"" >> .env

# 3. Vérifier
cat .env
```

---

## ⚠️ Sécurité

### Development

```bash
JWT_SECRET="dev-secret-key-not-for-production"
PASSWORD_SALT="dev-salt"
```

**OK** pour développement local ✅

### Production

```bash
JWT_SECRET="$(openssl rand -hex 32)"  # 64 caractères hex
PASSWORD_SALT="$(openssl rand -hex 16)"  # 32 caractères hex
```

**OBLIGATOIRE** pour production ⚠️

### Vérification

```bash
# JWT_SECRET doit avoir 64+ caractères
echo $JWT_SECRET | wc -c
# Output: 65 (64 + newline) ✅

# PASSWORD_SALT doit avoir 32+ caractères
echo $PASSWORD_SALT | wc -c
# Output: 33 (32 + newline) ✅
```

---

## 🐛 Troubleshooting

### "JWT_SECRET is not defined"

```bash
# Vérifier .env
cat .env | grep JWT_SECRET

# Ajouter si manquant
echo 'JWT_SECRET="$(openssl rand -hex 32)"' >> .env
```

### "Invalid token"

**Cause** : JWT_SECRET a changé  
**Solution** : Clear cookies navigateur et re-login

### "Password verification failed"

**Cause** : PASSWORD_SALT a changé  
**Solution** : Re-créer comptes utilisateurs

---

## 📚 Références

- **JWT** : JSON Web Token (RFC 7519)
- **bcrypt** : Password hashing (Blowfish cipher)
- **jose** : JavaScript Object Signing and Encryption

---

**Variables configurées** ✅
