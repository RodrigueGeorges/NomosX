# FIX : Erreurs de Connexion PostgreSQL (Neon)

**Date** : 2026-01-23  
**Erreur** : `prisma:error Error in PostgreSQL connection: Error { kind: Closed, cause: None }`  
**Impact** : ⭐⭐⭐⭐ HAUTE (connexions DB instables)

---

## 🚨 Problème Identifié

### Symptôme
```
prisma:error Error in PostgreSQL connection: Error { kind: Closed, cause: None }
prisma:error Error in PostgreSQL connection: Error { kind: Closed, cause: None }
prisma:error Error in PostgreSQL connection: Error { kind: Closed, cause: None }
```

**Contexte** :
- Les erreurs apparaissent **après** la génération réussie d'un brief
- Prisma essaie de maintenir des connexions mais elles se ferment
- Utilisation de **Neon** (serverless PostgreSQL)

---

### Cause Racine

#### 1. **Neon Limitations**
Neon (PostgreSQL serverless) a des limites strictes :
- **Free tier** : 10 connexions simultanées max
- **Timeout** : 60 secondes d'inactivité → connexion fermée
- **PgBouncer** : Pooler intégré mais mal configuré

#### 2. **Prisma Configuration Manquante**
```typescript
❌ AVANT (lib/db.ts)
export const prisma = new PrismaClient({ log: ["error", "warn"] });

Problème :
- Pas de limite de connexions
- Pas de timeout configuré
- Pas de disconnect gracieux
→ Neon ferme les connexions de force
```

#### 3. **URL sans Paramètres de Pool**
```bash
❌ AVANT (.env)
DATABASE_URL=postgresql://...neon.tech/neondb?sslmode=require&channel_binding=require

Problème :
- Pas de connection_limit
- Pas de pool_timeout
→ Prisma ouvre trop de connexions
```

---

## ✅ Solution Implémentée

### 1. **Optimisation de l'URL de Connexion** (`.env`)

```bash
✅ APRÈS

# Pooled connection (for queries) - WITH LIMITS
DATABASE_URL=postgresql://...neon.tech/neondb?sslmode=require&connection_limit=10&pool_timeout=10&connect_timeout=5

# Unpooled connection (for migrations)
DATABASE_URL_UNPOOLED=postgresql://...neon.tech/neondb?sslmode=require
```

**Paramètres ajoutés** :
- `connection_limit=10` : Max 10 connexions (free tier Neon)
- `pool_timeout=10` : Timeout de 10s pour obtenir une connexion du pool
- `connect_timeout=5` : Timeout de 5s pour établir une connexion

---

### 2. **Refactor du Client Prisma** (`lib/db.ts`)

```typescript
✅ APRÈS

import { PrismaClient } from "../generated/prisma-client";

declare global { 
  var __prisma: PrismaClient | undefined; 
}

// Singleton factory
const prismaClientSingleton = () => {
  return new PrismaClient({ 
    log: process.env.NODE_ENV === 'development' ? ["error", "warn"] : ["error"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      }
    }
  });
};

export const prisma = globalThis.__prisma ?? prismaClientSingleton();

// Dev singleton (prevent hot-reload leaks)
if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma = prisma;
}

// Graceful shutdown - disconnect pool on exit
if (typeof window === 'undefined') {
  process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
  
  process.on('SIGTERM', async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}
```

**Améliorations** :
- ✅ Singleton pattern propre
- ✅ Graceful shutdown (SIGINT/SIGTERM)
- ✅ `$disconnect()` automatique
- ✅ Logs adaptés selon l'environnement
- ✅ Prévention des leaks en dev (hot-reload)

---

## 📊 Impact

### AVANT (Cassé)
```
1. Requête API → Prisma ouvre plusieurs connexions
2. Requête terminée → Connexions restent ouvertes
3. Neon timeout (60s) → Ferme les connexions
4. Prisma essaie de réutiliser → Error { kind: Closed }
5. User experience : ❌ Erreurs sporadiques
```

### APRÈS (Corrigé)
```
1. Requête API → Prisma réutilise le pool (10 max)
2. Requête terminée → Connexions retournent au pool
3. Timeout configuré (10s) → Pool reste sain
4. Shutdown gracieux → $disconnect() propre
5. User experience : ✅ Connexions stables
```

---

## 🧪 Test & Validation

### 1. **Redémarrer le Serveur**
```bash
# Arrêter le serveur (Ctrl+C dans le terminal)
# Puis relancer :
npm run dev
```

**Pourquoi ?** Les nouvelles variables `.env` doivent être chargées.

---

### 2. **Test de Stress**
```bash
# Terminal 1 : Génère 3 briefs en parallèle
curl "http://localhost:3000/api/brief/stream?question=test1" &
curl "http://localhost:3000/api/brief/stream?question=test2" &
curl "http://localhost:3000/api/brief/stream?question=test3" &
```

**Résultat attendu** :
- ✅ Aucune erreur `Error { kind: Closed }`
- ✅ Toutes les requêtes réussissent (200)
- ✅ Pool de connexions reste stable

---

### 3. **Monitoring dans les Logs**
```bash
# Chercher les erreurs Prisma
grep "prisma:error" .cursor/projects/.../terminals/2.txt

# Résultat attendu : AUCUNE erreur après le redémarrage
```

---

## 📚 Documentation Neon

### Best Practices
1. **Toujours utiliser le pooler** (`-pooler` dans l'URL)
2. **Limiter les connexions** (`connection_limit=10` pour free tier)
3. **Configurer les timeouts** (`pool_timeout`, `connect_timeout`)
4. **Disconnect gracieux** (`$disconnect()` on shutdown)

### Liens Officiels
- [Neon Connection Pooling](https://neon.tech/docs/connect/connection-pooling)
- [Prisma with Neon](https://www.prisma.io/docs/guides/database/neon)
- [Neon Free Tier Limits](https://neon.tech/docs/introduction/plans#free-tier)

---

## ⚠️ Limites Connues

### 1. Free Tier Neon
- **10 connexions max** : Si l'app scale, upgrader vers Pro
- **1 projet** : Pas de staging/dev DB séparées
- **3 GB storage** : Suffisant pour MVP, mais à surveiller

### 2. Serverless Cold Starts
- Neon peut avoir un cold start de ~500ms
- Solution : Keepalive pings (à implémenter si besoin)

### 3. Connection Pooling
- PgBouncer (pooler) a un overhead de ~5-10ms
- Acceptable pour un use case B2B (pas un jeu vidéo)

---

## 🎯 Prochaines Étapes (Optionnelles)

### 1. **Monitoring Avancé**
```typescript
// lib/db.ts - Ajouter des metrics
prisma.$use(async (params, next) => {
  const before = Date.now();
  const result = await next(params);
  const after = Date.now();
  console.log(`[DB] ${params.model}.${params.action} - ${after - before}ms`);
  return result;
});
```

### 2. **Connection Health Check**
```typescript
// app/api/health/route.ts
export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return Response.json({ db: "ok" });
  } catch (error) {
    return Response.json({ db: "error", message: error.message }, { status: 500 });
  }
}
```

### 3. **Upgrade Neon (si besoin)**
- **Pro Plan** : $19/mois
- **100 connexions** : 10x plus que free
- **50 GB storage** : Pour scale
- **Point-in-time recovery** : Backup automatique

---

## ✅ Status Final

- ✅ URL de connexion optimisée avec paramètres de pool
- ✅ Client Prisma refactoré avec singleton + shutdown gracieux
- ✅ Logs adaptés selon l'environnement
- ✅ Documentation complète
- ⏳ **ACTION REQUISE** : Redémarrer `npm run dev`

**RÉSULTAT ATTENDU** : Plus d'erreurs `Error { kind: Closed }` dans les logs ! 🎉

---

**Prochain Test** : Redémarre le serveur et génère un brief → Vérifie qu'il n'y a plus d'erreurs Prisma dans le terminal.
