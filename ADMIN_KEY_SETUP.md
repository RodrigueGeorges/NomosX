# 🔑 Admin Key — Configuration

**Date** : Janvier 2026  
**Purpose** : Protéger les actions sensibles (Topics, Ingestions)

---

## 🎯 C'est Quoi ?

L'**Admin Key** est un mot de passe simple qui protège les actions d'administration :
- ✅ Créer/modifier des Topics
- ✅ Lancer des ingestions
- ✅ Supprimer des données
- ✅ Accéder aux settings avancés

---

## ⚡ Solution Rapide (Dev Local)

Quand le popup demande l'admin key, tape :

```
admin123
```

---

## 🔧 Configuration .env (Recommandé)

### 1. Ajoute dans ton `.env`

Ouvre le fichier `.env` et ajoute :

```bash
# Admin Key (pour Settings et Ingestions)
ADMIN_KEY=admin123
```

**Production** : Utilise un mot de passe fort
```bash
ADMIN_KEY=votre-cle-secrete-ultra-forte-2026
```

### 2. Redémarre le serveur

```bash
# Arrête le serveur (Ctrl+C)
# Puis relance
npm run dev
```

### 3. Teste

Va sur http://localhost:3000/settings et crée un topic. 
L'admin key configurée dans `.env` sera utilisée automatiquement.

---

## 📋 Variables d'Environnement Complètes

Voici toutes les variables recommandées pour ton `.env` :

```bash
# ============================================
# DATABASE (Required)
# ============================================
DATABASE_URL=postgresql://user:password@host:5432/nomosx

# ============================================
# OPENAI (Required)
# ============================================
OPENAI_API_KEY=sk-proj-...
OPENAI_MODEL=gpt-4o

# ============================================
# AUTH (Required for Login/Register)
# ============================================
JWT_SECRET=nomosx-secret-key-change-in-production
PASSWORD_SALT=nomosx-salt-change-in-production

# ============================================
# ADMIN (Required for Topics/Ingestions)
# ============================================
ADMIN_KEY=admin123

# ============================================
# ACADEMIC APIs (Optional)
# ============================================
UNPAYWALL_EMAIL=your.email@domain.com

# ============================================
# APP (Optional)
# ============================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🔒 Sécurité

### Développement Local
```bash
ADMIN_KEY=admin123  # OK pour dev
```

### Production
```bash
ADMIN_KEY=cle-ultra-secrete-minimum-32-caracteres-2026
```

**Recommandations Production** :
- ✅ Minimum 32 caractères
- ✅ Lettres + chiffres + symboles
- ✅ Unique pour chaque environnement
- ✅ Ne JAMAIS commit dans git
- ✅ Stocker dans variables d'environnement sécurisées

---

## 🧪 Test

### 1. Sans ADMIN_KEY dans .env

```
1. Va sur /settings
2. Clique "Nouveau Topic"
3. Remplis le formulaire
4. Clique "Créer"
   → Popup demande Admin Key
   → Tape "admin123"
   → Topic créé ✅
```

### 2. Avec ADMIN_KEY dans .env

```
1. Ajoute ADMIN_KEY=admin123 dans .env
2. Redémarre le serveur
3. Va sur /settings
4. Clique "Nouveau Topic"
5. Remplis le formulaire
6. Clique "Créer"
   → Pas de popup (utilise .env automatiquement)
   → Topic créé ✅
```

---

## 🚨 Troubleshooting

### Erreur "Admin key required"

**Cause** : `ADMIN_KEY` pas défini dans `.env`  
**Solution** : Ajoute `ADMIN_KEY=admin123` dans `.env` et redémarre

### Erreur "Invalid admin key"

**Cause** : La clé tapée ne correspond pas à celle dans `.env`  
**Solution** : Vérifie `.env` ou tape la bonne clé

### Le popup apparaît toujours

**Cause** : Le serveur n'a pas redémarré après ajout dans `.env`  
**Solution** : Redémarre le serveur (`Ctrl+C` puis `npm run dev`)

---

## 📊 Actions Protégées par Admin Key

| Action | Route | Endpoint | Admin Key Required |
|--------|-------|----------|-------------------|
| Créer Topic | `/settings` | `POST /api/topics` | ✅ |
| Modifier Topic | `/settings` | `PUT /api/topics/:id` | ✅ |
| Supprimer Topic | `/settings` | `DELETE /api/topics/:id` | ✅ |
| Lancer Ingestion | `/settings` | `POST /api/runs` | ✅ |
| Voir Stats | `/settings` | `GET /api/stats` | ❌ |
| Créer Brief | `/brief` | `POST /api/briefs` | ❌ |
| Voir Dashboard | `/dashboard` | `GET /dashboard` | ❌ |

**Note** : Seules les actions de modification nécessitent l'admin key.

---

## 🎯 Résumé

**Pour Dev Local** :
```bash
# Dans .env
ADMIN_KEY=admin123
```

**Pour Production** :
```bash
# Dans variables d'environnement serveur
ADMIN_KEY=cle-ultra-secrete-production-2026
```

**Sans .env** :
- Tape `admin123` dans le popup quand demandé

---

**NomosX v1.3.1** — Admin Key configurée ! 🔑
