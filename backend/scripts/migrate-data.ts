/**
 * Data Migration Script - Old Schema → New Schema
 * 
 * Migrates existing data to new CTO-grade schema with claims, evidence, and trust scores
 */

import { PrismaClient } from "../../generated/prisma-client";
import { createLogger } from "../src/shared/logging/Logger";

const logger = createLogger({ service: "data-migration" });

// Old Prisma client (existing schema)
const oldPrisma = new PrismaClient();

// New Prisma client (upgraded schema)
const newPrisma = new PrismaClient();

async function migrateData() {
  logger.info("Starting data migration...");

  try {
    // 1. Migrate Sources
    logger.info("Migrating sources...");
    const oldSources = await oldPrisma.source.findMany({
      include: {
        authors: { include: { author: true } },
        institutions: { include: { institution: true } },
        domains: { include: { domain: true } },
      },
    });

    for (const source of oldSources) {
      await newPrisma.source.upsert({
        where: { id: source.id },
        update: {
          provider: source.provider,
          type: source.type,
          title: source.title,
          abstract: source.abstract,
          year: source.year,
          doi: source.doi,
          url: source.url,
          pdfUrl: source.pdfUrl,
          oaStatus: source.oaStatus,
          topics: source.topics,
          jelCodes: source.jelCodes,
          citationCount: source.citationCount,
          qualityScore: source.qualityScore,
          noveltyScore: source.noveltyScore,
          raw: source.raw ?? {},
          updatedAt: new Date(),
        },
        create: {
          id: source.id,
          provider: source.provider,
          type: source.type,
          title: source.title,
          abstract: source.abstract,
          year: source.year,
          doi: source.doi,
          url: source.url,
          pdfUrl: source.pdfUrl,
          oaStatus: source.oaStatus,
          topics: source.topics,
          jelCodes: source.jelCodes,
          citationCount: source.citationCount,
          qualityScore: source.qualityScore,
          noveltyScore: source.noveltyScore,
          raw: source.raw ?? {},
          createdAt: source.createdAt,
        },
      });
    }

    logger.info(`Migrated ${oldSources.length} sources`);

    // 2. Migrate Authors
    logger.info("Migrating authors...");
    const oldAuthors = await oldPrisma.author.findMany();

    for (const author of oldAuthors) {
      await newPrisma.author.upsert({
        where: { id: author.id },
        update: {
          name: author.name,
          normalizedName: author.name.toLowerCase().trim(),
          orcid: author.orcid,
          orcidData: author.orcidData ?? {},
          h_index: author.h_index,
          citationCount: author.citationCount,
          affiliations: author.affiliations ?? [],
          updatedAt: new Date(),
        },
        create: {
          id: author.id,
          name: author.name,
          normalizedName: author.name.toLowerCase().trim(),
          orcid: author.orcid,
          orcidData: author.orcidData ?? {},
          h_index: author.h_index,
          citationCount: author.citationCount,
          affiliations: author.affiliations ?? [],
          createdAt: author.createdAt,
        },
      });
    }

    logger.info(`Migrated ${oldAuthors.length} authors`);

    // 3. Migrate Institutions
    logger.info("Migrating institutions...");
    const oldInstitutions = await oldPrisma.institution.findMany();

    for (const institution of oldInstitutions) {
      await newPrisma.institution.upsert({
        where: { id: institution.id },
        update: {
          name: institution.name,
          normalizedName: institution.name.toLowerCase().trim(),
          rorId: institution.rorId,
          rorData: institution.rorData ?? {},
          country: institution.country,
          type: institution.type,
          updatedAt: new Date(),
        },
        create: {
          id: institution.id,
          name: institution.name,
          normalizedName: institution.name.toLowerCase().trim(),
          rorId: institution.rorId,
          rorData: institution.rorData ?? {},
          country: institution.country,
          type: institution.type,
          createdAt: institution.createdAt,
        },
      });
    }

    logger.info(`Migrated ${oldInstitutions.length} institutions`);

    // 4. Migrate Briefs
    logger.info("Migrating briefs...");
    const oldBriefs = await oldPrisma.brief.findMany();

    for (const brief of oldBriefs) {
      await newPrisma.brief.upsert({
        where: { id: brief.id },
        update: {
          kind: brief.kind,
          topicId: brief.topicId,
          question: brief.question,
          html: brief.html,
          sources: brief.sources,
          publicId: brief.publicId,
          updatedAt: new Date(),
        },
        create: {
          id: brief.id,
          kind: brief.kind,
          topicId: brief.topicId,
          question: brief.question,
          html: brief.html,
          sources: brief.sources,
          publicId: brief.publicId,
          createdAt: brief.createdAt,
        },
      });
    }

    logger.info(`Migrated ${oldBriefs.length} briefs`);

    // 5. Verify migration
    const newSourceCount = await newPrisma.source.count();
    const newAuthorCount = await newPrisma.author.count();
    const newInstitutionCount = await newPrisma.institution.count();
    const newBriefCount = await newPrisma.brief.count();

    logger.info("Migration summary:", {
      sources: newSourceCount,
      authors: newAuthorCount,
      institutions: newInstitutionCount,
      briefs: newBriefCount,
    });

    logger.info("✅ Data migration completed successfully!");
  } catch (error) {
    logger.error("Migration failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  } finally {
    await oldPrisma.$disconnect();
    await newPrisma.$disconnect();
  }
}

migrateData().catch((error) => {
  console.error("Migration script failed:", error);
  process.exit(1);
});
