/**
 * Database Seeding Script
 */

import { getPrismaClient } from "../src/infrastructure/persistence/prisma/client";
import { createLogger } from "../src/shared/logging/Logger";

const logger = createLogger({ service: "seed" });
const prisma = getPrismaClient();

async function seed() {
  logger.info("Starting database seed...");

  // Seed domains
  const domains = [
    {
      slug: "economics",
      name: "Économie",
      nameEn: "Economics",
      icon: "💰",
      color: "#10B981",
      description: "Économie, finance, commerce",
      keywords: ["economy", "finance", "trade", "market"],
      jelCodes: ["E", "F", "G"],
    },
    {
      slug: "environment",
      name: "Environnement",
      nameEn: "Environment",
      icon: "🌍",
      color: "#059669",
      description: "Climat, écologie, énergie",
      keywords: ["climate", "environment", "energy", "sustainability"],
      jelCodes: ["Q"],
    },
    {
      slug: "health",
      name: "Santé",
      nameEn: "Health",
      icon: "🏥",
      color: "#EF4444",
      description: "Santé publique, médecine",
      keywords: ["health", "medicine", "healthcare"],
      jelCodes: ["I1"],
    },
  ];

  for (const domain of domains) {
    await prisma.domain.upsert({
      where: { slug: domain.slug },
      update: domain,
      create: domain,
    });
  }

  logger.info("Domains seeded");

  // Seed feature flags
  const featureFlags = [
    {
      key: "claim_extraction",
      name: "Claim Extraction",
      description: "Enable claim extraction from analysis",
      isEnabled: true,
      rolloutPercentage: 100,
    },
    {
      key: "evidence_binding",
      name: "Evidence Binding",
      description: "Enable evidence binding to claims",
      isEnabled: true,
      rolloutPercentage: 100,
    },
    {
      key: "trust_scoring",
      name: "Trust Scoring",
      description: "Enable trust score computation",
      isEnabled: true,
      rolloutPercentage: 100,
    },
  ];

  for (const flag of featureFlags) {
    await prisma.featureFlag.upsert({
      where: { key: flag.key },
      update: flag,
      create: flag,
    });
  }

  logger.info("Feature flags seeded");

  logger.info("Database seeded successfully");
}

seed()
  .catch((error) => {
    logger.error("Seed failed", { error: error.message });
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
