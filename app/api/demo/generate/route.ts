import { NextRequest, NextResponse } from 'next/server';
import { runFullPipeline } from '@/lib/agent/pipeline-v2';
import type { Providers } from '@/lib/agent/pipeline-v2';

/**
 * POST /api/demo/generate
 * 
 * Interactive demo endpoint that shows AI Council in action
 * Uses simplified pipeline for demo purposes (limited sources, faster execution)
 */
export async function POST(req: NextRequest) {
  try {
    const { topic, mode = 'quick' } = await req.json();
    
    if (!topic || topic.length < 3) {
      return NextResponse.json(
        { error: 'Topic must be at least 3 characters long' },
        { status: 400 }
      );
    }

    // Demo mode: limited providers for speed
    const demoProviders: Providers = ['openalex', 'arxiv', 'pubmed', 'nature', 'science'];
    
    console.log(`[Demo] Starting pipeline for topic: "${topic}"`);
    
    // Run simplified pipeline
    const startTime = Date.now();
    const result = await runFullPipeline(topic, demoProviders, {
      mode: 'brief', // Quick demo mode
      maxSources: 25, // Limited sources for speed
      timeout: 60000, // 1 minute timeout
      enableCaching: true
    });
    
    const duration = Date.now() - startTime;
    
    // Format demo response
    const demoResult = {
      topic,
      duration: `${Math.round(duration / 1000)}s`,
      sourcesFound: result.stats?.scout?.found || 0,
      sourcesUsed: result.brief?.sources?.length || 0,
      trustScore: result.brief?.trustScore || 0,
      qualityScore: result.brief?.qualityScore || 0,
      briefId: result.briefId,
      summary: result.brief?.summary?.substring(0, 200) + '...',
      keyFindings: result.brief?.keyFindings?.slice(0, 3) || [],
      researcherInsights: result.brief?.researcherInsights?.slice(0, 2) || [],
      councilDecision: result.brief?.councilDecision || 'APPROVED',
      status: 'completed'
    };

    console.log(`[Demo] Completed in ${duration}ms, ${demoResult.sourcesFound} sources found`);

    return NextResponse.json(demoResult);

  } catch (error) {
    console.error('[Demo] Error:', error);
    
    return NextResponse.json({
      error: 'Demo generation failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      status: 'failed'
    }, { status: 500 });
  }
}
