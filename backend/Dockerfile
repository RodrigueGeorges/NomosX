# ============================================================================
# NomosX Backend - Production Dockerfile
# ============================================================================

FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci --only=production && \
    npm cache clean --force

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nomosx

# Copy necessary files
COPY --from=builder --chown=nomosx:nodejs /app/dist ./dist
COPY --from=builder --chown=nomosx:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nomosx:nodejs /app/package*.json ./
COPY --from=builder --chown=nomosx:nodejs /app/prisma ./prisma

USER nomosx

EXPOSE 3000

CMD ["node", "dist/api/server.js"]
