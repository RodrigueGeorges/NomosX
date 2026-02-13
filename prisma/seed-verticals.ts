/**
 * NomosX Think Tank - Seed Verticals
 * 
 * Run with: npx tsx prisma/seed-verticals.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Inline verticals to avoid ESM import issues
const VERTICALS = [
  {
    slug: "climate-energy",
    name: "Climat & Énergie",
    nameEn: "Climate & Energy",
    description: "Transition énergétique, politique climatique, marchés carbone",
    icon: "🌍",
    color: "#10B981",
    config: {
      maxPublicationsPerWeek: 3,
      allowedTypes: ["RESEARCH_BRIEF", "UPDATE_NOTE", "DATA_NOTE"],
      thresholds: { minNovelty: 65, minImpact: 60, minConfidence: 70 },
      cooldownHours: 48,
      updateBurstAllowed: true
    }
  },
  {
    slug: "macro-finance",
    name: "Macro & Finance",
    nameEn: "Macro & Finance", 
    description: "Politique monétaire, marchés financiers, conjoncture",
    icon: "📊",
    color: "#3B82F6",
    config: {
      maxPublicationsPerWeek: 4,
      allowedTypes: ["RESEARCH_BRIEF", "UPDATE_NOTE", "DATA_NOTE", "POLICY_NOTE"],
      thresholds: { minNovelty: 60, minImpact: 65, minConfidence: 75 },
      cooldownHours: 24,
      updateBurstAllowed: true
    }
  },
  {
    slug: "geopolitics",
    name: "Géopolitique",
    nameEn: "Geopolitics",
    description: "Relations internationales, sécurité, commerce",
    icon: "🌐",
    color: "#8B5CF6",
    config: {
      maxPublicationsPerWeek: 2,
      allowedTypes: ["RESEARCH_BRIEF", "POLICY_NOTE", "DOSSIER"],
      thresholds: { minNovelty: 70, minImpact: 70, minConfidence: 65 },
      cooldownHours: 72,
      updateBurstAllowed: false
    }
  },
  {
    slug: "tech-innovation",
    name: "Tech & Innovation",
    nameEn: "Tech & Innovation",
    description: "IA, numérique, R&D, brevets",
    icon: "🚀",
    color: "#F59E0B",
    config: {
      maxPublicationsPerWeek: 3,
      allowedTypes: ["RESEARCH_BRIEF", "UPDATE_NOTE", "DATA_NOTE"],
      thresholds: { minNovelty: 75, minImpact: 60, minConfidence: 70 },
      cooldownHours: 48,
      updateBurstAllowed: true
    }
  },
  {
    slug: "social-policy",
    name: "Politique Sociale",
    nameEn: "Social Policy",
    description: "Emploi, santé, éducation, inégalités",
    icon: "🏛️",
    color: "#EC4899",
    config: {
      maxPublicationsPerWeek: 2,
      allowedTypes: ["RESEARCH_BRIEF", "POLICY_NOTE"],
      thresholds: { minNovelty: 60, minImpact: 70, minConfidence: 75 },
      cooldownHours: 72,
      updateBurstAllowed: false
    }
  }
];

async function main() {
  console.log("🌱 Seeding verticals...");

  for (const vertical of VERTICALS) {
    const existing = await prisma.vertical.findUnique({
      where: { slug: vertical.slug }
    });

    if (existing) {
      console.log(`  ⏭️  ${vertical.name} already exists, updating...`);
      await prisma.vertical.update({
        where: { slug: vertical.slug },
        data: {
          name: vertical.name,
          nameEn: vertical.nameEn,
          description: vertical.description,
          icon: vertical.icon,
          color: vertical.color,
          config: vertical.config as any,
          isActive: true
        }
      });
    } else {
      console.log(`  ✅ Creating ${vertical.name}...`);
      await prisma.vertical.create({
        data: {
          slug: vertical.slug,
          name: vertical.name,
          nameEn: vertical.nameEn,
          description: vertical.description,
          icon: vertical.icon,
          color: vertical.color,
          config: vertical.config as any,
          isActive: true
        }
      });
    }
  }

  console.log(`\n✅ Seeded ${VERTICALS.length} verticals`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
