/**
 * Prisma Client Singleton
 */

import { PrismaClient } from '../../../../generated/prisma-client';
import { createLogger } from '../../../shared/logging/Logger';

const logger = createLogger({ service: "prisma-client" });

let prisma: PrismaClient;

export function getPrismaClient(): PrismaClient {
  if (!prisma) {
    prisma = new PrismaClient({
      log: [
        { level: "query", emit: "event" },
        { level: "error", emit: "event" },
        { level: "warn", emit: "event" },
      ],
    });

    // Log queries in development
    if (process.env.NODE_ENV === "development") {
      prisma.$on("query" as any, (e: any) => {
        logger.debug("Prisma query", {
          query: e.query,
          duration: e.duration,
        });
      });
    }

    prisma.$on("error" as any, (e: any) => {
      logger.error("Prisma error", { error: e.message });
    });

    prisma.$on("warn" as any, (e: any) => {
      logger.warn("Prisma warning", { warning: e.message });
    });
  }

  return prisma;
}

export async function disconnectPrisma(): Promise<void> {
  if (prisma) {
    await prisma.$disconnect();
    logger.info("Prisma disconnected");
  }
}
