# Environment Variables

Copy these into your `.env` file:

```bash
# Database (required)
DATABASE_URL=postgresql://user:password@localhost:5432/nomosx

# OpenAI (required)
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o

# Academic APIs (optional, defaults provided)
# OPENALEX_API=https://api.openalex.org/works
# THESESFR_API=https://www.theses.fr/api/v1/theses
# CROSSREF_API=https://api.crossref.org/works
# SEMANTICSCHOLAR_API=https://api.semanticscholar.org/graph/v1/paper/search
UNPAYWALL_EMAIL=your.email@domain.com

# Identity enrichment (optional, defaults provided)
# ROR_API=https://api.ror.org/organizations
# ORCID_API=https://pub.orcid.org/v3.0

# Macro data (optional, defaults provided)
# EUROSTAT_API=https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data
# ECB_API=https://data-api.ecb.europa.eu/service/data
# INSEE_API=https://api.insee.fr/series/BDM/V1/data

# Admin (optional, for settings page)
ADMIN_KEY=your-secret-admin-key

# Redis (optional, for rate limiting/caching)
# REDIS_URL=redis://localhost:6379

# App URL (optional)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

All environment variables are validated at runtime via `lib/env.ts` using Zod.
