# NomosX API Documentation

**Version**: 1.0  
**Base URL**: `https://your-domain.netlify.app/api` (production) ou `http://localhost:3000/api` (dev)

---

## 🔐 Authentication

Certains endpoints requièrent l'authentification admin via le header:

```
x-admin-key: YOUR_ADMIN_KEY
```

Configure `ADMIN_KEY` dans tes variables d'environnement.

---

## 📚 Endpoints

### Topics

#### GET /api/topics
Liste tous les topics avec leurs statistiques.

**Auth**: Non  
**Response**: 200 OK
```json
{
  "topics": [
    {
      "id": "cuid123",
      "name": "Carbon Pricing",
      "query": "carbon tax emissions trading",
      "tags": ["climate", "policy"],
      "description": "Research on carbon pricing mechanisms",
      "isActive": true,
      "createdAt": "2026-01-18T10:00:00Z",
      "updatedAt": "2026-01-18T10:00:00Z",
      "_count": {
        "briefs": 5,
        "subscriptions": 12,
        "digests": 3
      }
    }
  ]
}
```

#### POST /api/topics
Crée un nouveau topic.

**Auth**: Requiert `x-admin-key`  
**Body**:
```json
{
  "name": "AI and Labor Markets",
  "query": "artificial intelligence employment automation",
  "tags": ["ai", "labor", "economics"],
  "description": "Impact of AI on employment",
  "isActive": true
}
```

**Response**: 201 Created
```json
{
  "topic": {
    "id": "cuid456",
    "name": "AI and Labor Markets",
    "query": "artificial intelligence employment automation",
    "tags": ["ai", "labor", "economics"],
    "description": "Impact of AI on employment",
    "isActive": true,
    "createdAt": "2026-01-18T11:00:00Z",
    "updatedAt": "2026-01-18T11:00:00Z"
  }
}
```

**Errors**:
- 400: Missing required fields
- 401: Unauthorized
- 409: Topic name already exists

#### GET /api/topics/[id]
Récupère un topic spécifique.

**Auth**: Non  
**Response**: 200 OK
```json
{
  "topic": {
    "id": "cuid123",
    "name": "Carbon Pricing",
    // ... same as above
  }
}
```

**Errors**:
- 404: Topic not found

#### PATCH /api/topics/[id]
Met à jour un topic.

**Auth**: Requiert `x-admin-key`  
**Body** (tous les champs optionnels):
```json
{
  "name": "Updated Name",
  "query": "updated query",
  "tags": ["new", "tags"],
  "description": "Updated description",
  "isActive": false
}
```

**Response**: 200 OK
```json
{
  "topic": { /* updated topic */ }
}
```

**Errors**:
- 401: Unauthorized
- 404: Topic not found
- 409: Name conflict

#### DELETE /api/topics/[id]
Supprime un topic (et ses subscriptions).

**Auth**: Requiert `x-admin-key`  
**Response**: 200 OK
```json
{
  "success": true
}
```

**Errors**:
- 401: Unauthorized
- 404: Topic not found

---

### Ingestion

#### POST /api/runs
Crée un ingestion run et enqueue les jobs.

**Auth**: Requiert `x-admin-key`  
**Body**:
```json
{
  "query": "carbon tax",
  "providers": ["openalex", "crossref"],
  "perProvider": 20
}
```

**Response**: 200 OK
```json
{
  "runId": "cuid789"
}
```

**Notes**:
- Providers disponibles: `openalex`, `thesesfr`, `crossref`, `semanticscholar`
- `perProvider`: nombre de résultats par provider (default: 20)
- Crée un job SCOUT automatiquement

---

### Briefs

#### POST /api/briefs
Génère un brief complet.

**Auth**: Non  
**Body**:
```json
{
  "question": "What is the economic impact of carbon taxes?"
}
```

**Response**: 200 OK
```json
{
  "id": "brief123",
  "html": "<article>...</article>"
}
```

**Errors**:
- 400: Question required
- 422: Citation guard failed

**Processing**:
1. Hybrid search pour trouver sources pertinentes
2. Rank top 10 sources
3. ANALYST synthesis
4. Citation validation
5. HTML rendering

#### POST /api/briefs/[id]/export
Exporte un brief en PDF.

**Auth**: Non  
**Response**: 200 OK (application/pdf)

**Usage**:
```javascript
const response = await fetch('/api/briefs/brief123/export', { method: 'POST' });
const blob = await response.blob();
const url = URL.createObjectURL(blob);
window.open(url);
```

#### POST /api/briefs/[id]/share
Génère un lien de partage public.

**Auth**: Non  
**Response**: 200 OK
```json
{
  "token": "public-token-123",
  "url": "/s/public-token-123"
}
```

**Notes**:
- Le brief devient accessible publiquement via `/s/[token]`
- Lecture seule

---

### Search

#### GET /api/search
Recherche hybride (lexical + semantic).

**Auth**: Non  
**Query Params**:
- `q` (required): search query
- `limit` (optional): max results (default: 20)

**Response**: 200 OK
```json
{
  "results": [
    {
      "id": "openalex:W123",
      "title": "Carbon Tax Impact on Emissions",
      "year": 2025,
      "qualityScore": 87,
      "authors": ["John Doe", "Jane Smith"],
      "provider": "openalex"
    }
  ]
}
```

**Processing**:
1. Lexical prefilter (Postgres full-text)
2. Semantic rerank (cosine similarity on embeddings)
3. Return top N

---

### Statistics

#### GET /api/stats
Récupère les statistiques du système.

**Auth**: Non  
**Response**: 200 OK
```json
{
  "overview": {
    "sources": 15234,
    "authors": 8945,
    "institutions": 2341,
    "topics": 12,
    "briefs": 45,
    "digests": 18
  },
  "jobs": {
    "pending": 3,
    "failed": 1,
    "byType": {
      "SCOUT": { "DONE": 120, "PENDING": 2 },
      "INDEX": { "DONE": 115, "PENDING": 1 }
    }
  },
  "sources": {
    "total": 15234,
    "byProvider": [
      { "provider": "openalex", "count": 8234 },
      { "provider": "crossref", "count": 5000 }
    ],
    "embeddingsCoverage": 87,
    "recent": [ /* 10 most recent sources */ ],
    "topQuality": [ /* 10 highest quality sources */ ]
  },
  "ingestion": {
    "recentRuns": [ /* 5 most recent runs */ ]
  }
}
```

**Usage**: Monitoring dashboard, health checks

---

### Digests

#### POST /api/digests/send
Envoie un digest par email aux abonnés.

**Auth**: Requiert `x-admin-key`  
**Body**:
```json
{
  "digestId": "digest123"
}
```

**Response**: 200 OK
```json
{
  "success": true,
  "sent": 12,
  "failed": 0,
  "recipients": 12
}
```

**Errors**:
- 400: digestId required
- 401: Unauthorized
- 404: Digest not found
- 409: Digest already sent

**Notes**:
- Requiert configuration email (RESEND_API_KEY ou SENDGRID_API_KEY)
- Met à jour `Digest.sentAt`

---

### Council (Q&A)

#### POST /api/council/ask
Pose une question au système (sans créer de brief).

**Auth**: Non  
**Body**:
```json
{
  "question": "How do carbon taxes affect GDP?"
}
```

**Response**: 200 OK
```json
{
  "answer": "Based on recent research [SRC-1][SRC-2]...",
  "sources": [
    {
      "id": "openalex:W123",
      "title": "Carbon Tax Economic Impact",
      "year": 2025
    }
  ]
}
```

**Notes**:
- Plus rapide qu'un brief complet
- Utilise un prompt simplifié
- Citations incluses

---

## 🔄 Workflows

### Workflow 1: Ingestion Complète

```mermaid
POST /api/runs
  → Creates SCOUT job
  → Worker processes: SCOUT → INDEX → RANK
  → Sources available in DB
  → GET /api/search to find them
```

### Workflow 2: Brief Generation

```mermaid
POST /api/briefs
  → Hybrid search
  → ANALYST synthesis
  → Citation validation
  → HTML rendering
  → Brief created
  
POST /api/briefs/[id]/share
  → Public URL generated
```

### Workflow 3: Weekly Digest

```mermaid
Cron: weekly-digest.mjs (Mondays 10 AM)
  → Generates digest HTML
  → Saves to Digest table
  
POST /api/digests/send
  → Emails subscribers
  → Updates sentAt
```

---

## 🧪 Testing

### cURL Examples

**Create ingestion run:**
```bash
curl -X POST http://localhost:3000/api/runs \
  -H "x-admin-key: YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "carbon tax",
    "providers": ["openalex"]
  }'
```

**Generate brief:**
```bash
curl -X POST http://localhost:3000/api/briefs \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What is the impact of carbon taxes on emissions?"
  }'
```

**Search:**
```bash
curl "http://localhost:3000/api/search?q=carbon+emissions&limit=10"
```

**Get stats:**
```bash
curl http://localhost:3000/api/stats
```

---

## 📦 Rate Limits

**Current**: None (configure via middleware si besoin)

**Recommended for production**:
- Search: 100 req/min per IP
- Briefs: 10 req/hour per IP
- Topics CRUD: Admin only (no limit)

---

## 🚨 Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Missing/invalid parameters |
| 401 | Unauthorized - Invalid admin key |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Duplicate resource |
| 422 | Unprocessable - Validation failed |
| 500 | Internal Error - Server-side issue |

**Error Response Format**:
```json
{
  "error": "Description of the error"
}
```

---

## 🔐 Security Best Practices

1. **Admin Key**: Génère un token fort (32+ caractères)
2. **HTTPS**: Toujours en production
3. **Rate Limiting**: À implémenter via middleware
4. **Input Validation**: Tous les endpoints validés
5. **CORS**: Configure selon tes besoins

---

## 📚 OpenAPI 3.0 Spec

Pour intégration avec Swagger/Postman, voir `openapi.yaml` (à générer).

---

**Documentation générée le 2026-01-18** — NomosX API v1.0
