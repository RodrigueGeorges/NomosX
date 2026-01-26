# NomosX Backend - Production System

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- PostgreSQL 15+ with pgvector
- Redis 7+

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables
cp .env.example .env
# Edit .env with your configuration

# 3. Start infrastructure (Docker)
docker-compose up -d postgres redis

# 4. Generate Prisma Client
npm run prisma:generate

# 5. Run migrations
npm run prisma:migrate:deploy

# 6. Seed database
npm run db:seed

# 7. Start API server (development)
npm run dev

# 8. Start worker (separate terminal)
npm run worker
```

### Production Deployment

```bash
# Build all services
npm run docker:build

# Start all services
npm run docker:up

# View logs
npm run docker:logs

# Stop all services
npm run docker:down
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── domain/              # Business logic (pure)
│   │   ├── claim/
│   │   ├── evidence/
│   │   └── orchestration/
│   ├── application/         # Use cases
│   ├── infrastructure/      # External concerns
│   │   ├── persistence/
│   │   ├── queue/
│   │   └── ai/
│   ├── api/                 # REST API
│   ├── config/              # Configuration
│   └── shared/              # Utilities
├── tests/                   # Tests
├── scripts/                 # Scripts
├── prisma/                  # Database schema
└── docker-compose.yml       # Docker config
```

## 🧪 Testing

```bash
# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# All tests with coverage
npm test
```

## 📊 Monitoring

- Health check: `GET /health`
- Metrics: `GET /admin/metrics` (requires admin auth)
- Queue status: `npm run queue:inspect`

## 🔧 Commands

```bash
# Development
npm run dev           # Start API server (watch mode)
npm run worker        # Start background worker

# Database
npm run prisma:generate    # Generate Prisma client
npm run prisma:migrate     # Create migration
npm run prisma:studio      # Open Prisma Studio
npm run db:seed            # Seed database

# Queue
npm run queue:clean        # Clean old jobs
npm run queue:inspect      # Inspect queue status

# Testing
npm test                   # Run all tests
npm run lint               # Lint code
npm run format             # Format code

# Docker
npm run docker:build       # Build images
npm run docker:up          # Start services
npm run docker:down        # Stop services
npm run docker:logs        # View logs
```

## 🌐 API Endpoints

### Analysis
- `POST /api/v1/analysis` - Create analysis run
- `GET /api/v1/analysis/:runId` - Get run details
- `POST /api/v1/analysis/:runId/feedback` - Submit feedback

### Admin
- `GET /health` - Health check
- `GET /admin/metrics` - System metrics

## 🔐 Environment Variables

See `.env.example` for complete list. Key variables:

```bash
DATABASE_URL=postgresql://...
REDIS_HOST=localhost
REDIS_PORT=6379
OPENAI_API_KEY=sk-...
JWT_SECRET=...
```

## 📖 Documentation

- [Architecture](../ARCHITECTURE.md)
- [Runbook](../RUNBOOK.md)
- [Migration Guide](../MIGRATION-GUIDE.md)
- [API Contracts](src/api/contracts/)

## 🛠️ Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
docker-compose ps postgres

# View logs
docker-compose logs postgres

# Recreate database
docker-compose down -v
docker-compose up -d postgres
npm run prisma:migrate:deploy
```

### Redis Connection Issues
```bash
# Check Redis is running
docker-compose ps redis

# Test connection
redis-cli -h localhost -p 6379 ping
```

### Worker Not Processing Jobs
```bash
# Check worker logs
docker-compose logs worker

# Inspect queue
npm run queue:inspect

# Clean stuck jobs
npm run queue:clean
```

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Write tests
4. Run linter: `npm run lint`
5. Run tests: `npm test`
6. Create PR

## 📄 License

Proprietary - NomosX Platform

## 📧 Support

- Email: support@nomosx.ai
- Slack: #nomosx-dev
- Docs: https://docs.nomosx.ai
