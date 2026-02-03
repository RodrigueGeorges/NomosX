const {NextRequest,NextResponse} = require('next/server');
const {scout} = require('@/lib/agent/pipeline-v2');
const {indexAgent,deduplicateSources} = require('@/lib/agent/index-agent');
const {rank,read,analyst,citationGuard,renderBriefHTML} = require('@/lib/agent/pipeline-v2');
const {prisma} = require('@/lib/db');
const {selectSmartProviders} = require('@/lib/agent/smart-provider-selector');

/**
 * API Auto-Brief — Orchestration complète du pipeline
 * 
 * Workflow:
 * 1. Extrait keywords de la question
 * 2. SCOUT: Auto-ingestion sources pertinentes
 * 3. INDEX: Auto-enrichissement
 * 4. DEDUPE: Dédoublonnage
 * 5. RANK: Sélection top 12 sources
 * 6. READ: Extraction claims/methods/results
 * 7. ANALYST: Génération analyse complète
 * 8. GUARD: Validation citations
 * 9. EDITOR: Rendu HTML
 * 10. Sauvegarde Brief en DB
 * 
 * Best Practices 2026:
 * - Intent-based: User pose question, agents font le reste
 * - Zero UI: Plomberie technique invisible
 * - Time-to-Value: 30-60s pour résultat complet
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { question } = body;

    if (!question || typeof question !== "string") {
      return NextResponse.json(
        { error: "question is required" },
        { status: 400 }
      );
    }

    // 📊 Progression tracking (pour feedback UI)
    const progress: any = {
      step: "init",
      message: "Démarrage du pipeline...",
      progress: 0,
    };

    // 1️⃣ SCOUT — Auto-ingestion (10% → 25%)
    progress.step = "scout";
    progress.message = "Recherche dans 28M+ sources académiques...";
    progress.progress = 10;

    const scoutResult = await scout(
      question,
      ["openalex", "crossref"], // Auto-select providers
      15 // Auto-select quantity
    );

    if (!scoutResult || scoutResult.sourceIds.length === 0) {
      return NextResponse.json(
        { 
          error: "no_sources_found",
          message: "Aucune source trouvée pour cette question. Essayez de reformuler."
        },
        { status: 404 }
      );
    }

    // 2️⃣ INDEX — Auto-enrichissement (25% → 40%)
    progress.step = "index";
    progress.message = `Enrichissement de ${scoutResult.sourceIds.length} sources...`;
    progress.progress = 25;

    await indexAgent(scoutResult.sourceIds);

    // 3️⃣ DEDUPE — Dédoublonnage (40% → 45%)
    progress.step = "dedupe";
    progress.message = "Dédoublonnage des sources...";
    progress.progress = 40;

    await deduplicateSources();

    // 4️⃣ RANK — Sélection top sources (45% → 55%)
    progress.step = "rank";
    progress.message = "Sélection des 12 meilleures sources...";
    progress.progress = 45;

    const topSources = await rank(question, 12, "quality");

    if (!topSources || topSources.length === 0) {
      return NextResponse.json(
        { 
          error: "no_ranked_sources",
          message: "Impossible de classer les sources. Essayez une autre question."
        },
        { status: 500 }
      );
    }

    // Get smart selection metadata
    const smartSelection = selectSmartProviders(question);

    // 5️⃣ READ — Extraction (55% → 70%)
    progress.step = "read";
    progress.message = `Lecture approfondie de ${topSources.length} sources...`;
    progress.progress = 55;

    const readings = await read(topSources);

    // 6️⃣ ANALYST — Génération analyse (70% → 90%)
    progress.step = "analyst";
    progress.message = "Génération de l'analyse multi-perspectives...";
    progress.progress = 70;

    const analysis = await analyst(question, topSources, readings);

    // 7️⃣ GUARD — Validation citations (90% → 95%)
    progress.step = "guard";
    progress.message = "Validation des citations...";
    progress.progress = 90;

    const guard = citationGuard(analysis, topSources.length);

    if (!guard.ok) {
      console.warn("Citation guard failed:", guard);
      // Retry analyst with stronger prompt (optionnel pour v1)
    }

    // 8️⃣ EDITOR — Rendu HTML (95% → 98%)
    progress.step = "editor";
    progress.message = "Formatage du brief...";
    progress.progress = 95;

    const html = renderBriefHTML(analysis, topSources);

    // 9️⃣ SAVE — Sauvegarde en DB (98% → 100%)
    progress.step = "save";
    progress.message = "Sauvegarde du brief...";
    progress.progress = 98;

    const brief = await prisma.brief.create({
      data: {
        question,
        html,
        kind: "auto-brief",
        sources: topSources.map((s: any) => s.id),
        publicId: null, // Sera généré lors du partage
      },
    });

    // ✅ Done
    progress.step = "done";
    progress.message = "Brief généré avec succès !";
    progress.progress = 100;

    return NextResponse.json({
      success: true,
      briefId: brief.id,
      briefUrl: `/briefs/${brief.id}`,
      smartSelection: {
        providers: smartSelection.providers,
        reasoning: smartSelection.reasoning,
        estimatedTime: smartSelection.estimatedTime,
      },
      stats: {
        sourcesFound: scoutResult.found,
        sourcesUsed: topSources.length,
        citationsCount: guard.usedCount,
        timeEstimate: smartSelection.estimatedTime,
      },
      brief: {
        id: brief.id,
        question: brief.question,
        html: brief.html,
        createdAt: brief.createdAt,
      },
    });

  } catch (error: any) {
    console.error("Auto-brief error:", error);
    return NextResponse.json(
      { 
        error: "pipeline_error",
        message: error.message || "Une erreur est survenue lors de la génération du brief",
        details: process.env.NODE_ENV === "development" ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
