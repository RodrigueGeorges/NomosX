import { PrismaClient } from "../generated/prisma-client";

declare global { 
  var __prisma: PrismaClient | undefined; 
}

// Optimized for Neon (serverless Postgres)
// Prevents "Error { kind: Closed }" by limiting connection pool
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

// Singleton in dev to prevent hot-reload connection leaks
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
