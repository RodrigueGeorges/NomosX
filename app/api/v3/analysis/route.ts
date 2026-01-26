/**
 * API Route: /api/v3/analysis
 * 
 * Uses Pipeline V3 with query enhancement, relevance filtering, and reranking.
 */

import { NextRequest, NextResponse } from "next/server";
import { runPipelineV3 } from "@/lib/agent/pipeline-v3";
import type { Providers } from "@/lib/agent/scout-v2";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { question, providers, options } = body;

    if (!question || typeof question !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'question' field" },
        { status: 400 }
      );
    }

    // Default providers
    const selectedProviders: Providers = Array.isArray(providers) && providers.length > 0
      ? providers
      : ["openalex", "semanticscholar", "crossref"];

    // Default options
    const pipelineOptions = {
      perProvider: options?.perProvider || 20,
      minRelevance: options?.minRelevance || 0.4,
      topSources: options?.topSources || 12,
      useReranking: options?.useReranking !== false, // Default true
    };

    console.log(`\n[API /v3/analysis] New request`);
    console.log(`Question: ${question}`);
    console.log(`Providers: ${selectedProviders.join(", ")}`);
    console.log(`Options:`, pipelineOptions);

    // Run pipeline V3
    const result = await runPipelineV3(question, selectedProviders, pipelineOptions);

    return NextResponse.json({
      success: true,
      briefId: result.briefId,
      stats: result.stats,
    });
  } catch (error: any) {
    console.error("[API /v3/analysis] Error:", error);

    return NextResponse.json(
      {
        error: "Analysis failed",
        message: error.message,
        details: error.stack,
      },
      { status: 500 }
    );
  }
}
