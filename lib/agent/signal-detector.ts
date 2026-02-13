/**
 * NomosX Signal Detector Agent
 * 
 * Detects meaningful signals from newly ingested sources
 * Part of the Institutional Think Tank pipeline
 */

import { prisma } from '@/lib/db';
import { SignalType,SignalScores,SIGNAL_THRESHOLDS } from '@/lib/think-tank/types';
import { VERTICALS } from '@/lib/think-tank/verticals';
import { callLLM } from '@/lib/llm/unified-llm';

// ============================================================================
// TYPES
// ============================================================================

interface SignalDetectorInput {
  sourceIds: string[];
  verticalSlug?: string; // Optional: filter to specific vertical
}

interface DetectedSignal {
  verticalId: string;
  signalType: SignalType;
  title: string;
  summary: string;
  scores: SignalScores;
  priorityScore: number;
  sourceIds: string[];
}

export interface SignalDetectorOutput {
  detected: number;
  byType: Partial<Record<SignalType, number>>;
  signals: DetectedSignal[];
}

// ============================================================================
// SIGNAL TYPE DETECTION
// ============================================================================

const INSTITUTIONAL_PROVIDERS = ["imf", "worldbank", "oecd", "eurostat", "bis", "ecb"];
const POLICY_PROVIDERS = ["eeas", "un", "nato", "eu_commission", "legifrance"];

/**
 * P0 FIX: LLM-based signal classification
 * More intelligent than keyword matching
 */
async function detectSignalTypeLLM(source: any): Promise<SignalType> {
  const provider = source.provider?.toLowerCase() || "";
  
  // Fast path for known institutional providers
  if (INSTITUTIONAL_PROVIDERS.includes(provider)) {
    return "DATA_RELEASE";
  }
  if (POLICY_PROVIDERS.includes(provider)) {
    return "POLICY_CHANGE";
  }
  
  // LLM classification for ambiguous cases
  const abstract = (source.abstract || "").slice(0, 1000);
  if (!abstract || abstract.length < 100) {
    return "NEW_EVIDENCE"; // Default for short abstracts
  }
  
  try {
    const response = await callLLM({
      messages: [{
        role: "user",
        content: `Classify this research into ONE signal type.

Title: ${source.title}
Abstract: ${abstract}
Year: ${source.year || "N/A"}
Novelty Score: ${source.noveltyScore || "N/A"}/100

Signal Types:
- NEW_EVIDENCE: New research findings on existing topic
- DATA_RELEASE: New dataset, statistics, or quantitative data
- POLICY_CHANGE: Regulatory, legal, or policy developments
- METHODOLOGY_SHIFT: Novel research method or paradigm change
- CONTRADICTION: Findings that contradict established consensus
- TREND_BREAK: Significant shift from historical patterns

Return JSON: {"signalType": "TYPE", "confidence": 0-100, "reason": "brief explanation"}`
      }],
      temperature: 0.1,
      jsonMode: true,
      maxTokens: 200,
      enableCache: true
    });
    
    const result = JSON.parse(response.content);
    const validTypes: SignalType[] = ["NEW_EVIDENCE", "DATA_RELEASE", "POLICY_CHANGE", "METHODOLOGY_SHIFT", "CONTRADICTION", "TREND_BREAK"];
    
    if (validTypes.includes(result.signalType) && result.confidence >= 60) {
      console.log(`[SIGNAL_DETECTOR] LLM classified as ${result.signalType} (${result.confidence}%): ${result.reason}`);
      return result.signalType;
    }
  } catch (error) {
    console.warn(`[SIGNAL_DETECTOR] LLM classification failed, using fallback:`, error);
  }
  
  // Fallback to rule-based for errors
  return detectSignalTypeFallback(source);
}

/**
 * Fallback rule-based classification (original logic)
 */
function detectSignalTypeFallback(source: any): SignalType {
  const abstract = (source.abstract || "").toLowerCase();
  const methodKeywords = ["novel method", "new approach", "innovative technique", "breakthrough", "first study"];
  
  if ((source.noveltyScore || 0) >= 80 && methodKeywords.some(k => abstract.includes(k))) {
    return "METHODOLOGY_SHIFT";
  }
  
  return "NEW_EVIDENCE";
}

// Legacy sync function for backward compatibility
function detectSignalType(source: any): SignalType {
  return detectSignalTypeFallback(source);
}

// ============================================================================
// VERTICAL CLASSIFICATION
// ============================================================================

const VERTICAL_KEYWORDS: Record<string, string[]> = {
  "eu-policy": [
    "european union", "eu regulation", "directive", "brussels", "european commission",
    "gdpr", "dsa", "dma", "european parliament", "eu policy", "cbam", "green deal"
  ],
  "climate-industry": [
    "climate change", "carbon", "emissions", "decarbonization", "renewable energy",
    "sustainability", "net zero", "green transition", "ipcc", "cop", "carbon tax"
  ],
  "ai-labor": [
    "artificial intelligence", "machine learning", "automation", "job displacement",
    "future of work", "ai ethics", "algorithmic", "workforce", "employment impact"
  ],
  "geopolitics": [
    "geopolitical", "international relations", "diplomacy", "security", "conflict",
    "sanctions", "trade war", "nato", "foreign policy", "bilateral"
  ],
  "finance-regulation": [
    "financial regulation", "banking", "monetary policy", "central bank", "fintech",
    "cryptocurrency", "basel", "mifid", "capital markets", "systemic risk"
  ]
};

function classifyVertical(source: any): string | null {
  const text = `${source.title || ""} ${source.abstract || ""}`.toLowerCase();
  
  let bestMatch: string | null = null;
  let bestScore = 0;
  
  for (const [slug, keywords] of Object.entries(VERTICAL_KEYWORDS)) {
    const score = keywords.filter(k => text.includes(k)).length;
    if (score > bestScore) {
      bestScore = score;
      bestMatch = slug;
    }
  }
  
  // Require at least 2 keyword matches
  return bestScore >= 2 ? bestMatch : null;
}

// ============================================================================
// SIGNAL SCORING
// ============================================================================

function computeSignalScores(sources: any[]): SignalScores {
  const avgNovelty = sources.reduce((sum, s) => sum + (s.noveltyScore || 0), 0) / sources.length;
  const avgQuality = sources.reduce((sum, s) => sum + (s.qualityScore || 0), 0) / sources.length;
  const avgCitations = sources.reduce((sum, s) => sum + (s.citationCount || 0), 0) / sources.length;
  
  // Novelty Score (0-100)
  const noveltyScore = Math.round(avgNovelty);
  
  // Impact Score (0-100)
  const citationWeight = Math.min(avgCitations / 100, 1) * 30;
  const institutionalWeight = sources.some(s => INSTITUTIONAL_PROVIDERS.includes(s.provider?.toLowerCase())) ? 25 : 0;
  const qualityWeight = avgQuality * 0.3;
  const impactScore = Math.round(Math.min(citationWeight + institutionalWeight + qualityWeight + 15, 100));
  
  // Confidence Score (0-100)
  const sourceCountBonus = Math.min(sources.length * 5, 25);
  const confidenceScore = Math.round(Math.min(avgQuality * 0.5 + sourceCountBonus + 25, 100));
  
  // Urgency Score (0-100)
  const now = new Date();
  const recentSources = sources.filter(s => {
    const created = new Date(s.createdAt);
    const daysDiff = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff <= 7;
  });
  const recencyRatio = recentSources.length / sources.length;
  const urgencyScore = Math.round(recencyRatio * 60 + 20);
  
  return { noveltyScore, impactScore, confidenceScore, urgencyScore };
}

function computePriorityScore(scores: SignalScores): number {
  return Math.round(
    scores.noveltyScore * 0.25 +
    scores.impactScore * 0.30 +
    scores.confidenceScore * 0.30 +
    scores.urgencyScore * 0.15
  );
}

// ============================================================================
// MAIN DETECTOR
// ============================================================================

export async function signalDetector(input: SignalDetectorInput): Promise<SignalDetectorOutput> {
  console.log(`[SIGNAL_DETECTOR] Processing ${input.sourceIds.length} sources...`);
  
  // Fetch sources with quality threshold
  const sources = await prisma.source.findMany({
    where: {
      id: { in: input.sourceIds },
      qualityScore: { gte: 70 },
      noveltyScore: { gte: 50 }
    },
    include: {
      authors: { include: { author: true } },
      institutions: { include: { institution: true } }
    }
  });
  
  if (sources.length === 0) {
    console.log(`[SIGNAL_DETECTOR] No qualifying sources (quality ≥70, novelty ≥50)`);
    return { detected: 0, byType: {}, signals: [] };
  }
  
  console.log(`[SIGNAL_DETECTOR] ${sources.length} sources qualify for signal detection`);
  
  // Get existing verticals from DB
  const verticals = await prisma.vertical.findMany({
    where: { isActive: true }
  });
  
  const verticalMap = new Map(verticals.map(v => [v.slug, v.id]));
  
  // Group sources by vertical
  const sourcesByVertical = new Map<string, any[]>();
  
  for (const source of sources) {
    const verticalSlug = classifyVertical(source);
    if (!verticalSlug) continue;
    
    // Filter by specific vertical if requested
    if (input.verticalSlug && verticalSlug !== input.verticalSlug) continue;
    
    if (!sourcesByVertical.has(verticalSlug)) {
      sourcesByVertical.set(verticalSlug, []);
    }
    sourcesByVertical.get(verticalSlug)!.push(source);
  }
  
  // Detect signals for each vertical
  const detectedSignals: DetectedSignal[] = [];
  const byType: Partial<Record<SignalType, number>> = {};
  
  for (const [verticalSlug, verticalSources] of sourcesByVertical) {
    const verticalIdFromMap = verticalMap.get(verticalSlug);
    if (!verticalIdFromMap) {
      console.log(`[SIGNAL_DETECTOR] Vertical ${verticalSlug} not found in DB, skipping`);
      continue;
    }
    const verticalId: string = verticalIdFromMap;
    
    // Group by signal type
    const sourcesByType = new Map<SignalType, any[]>();
    for (const source of verticalSources) {
      const signalType = await detectSignalTypeLLM(source);
      if (!sourcesByType.has(signalType)) {
        sourcesByType.set(signalType, []);
      }
      sourcesByType.get(signalType)!.push(source);
    }
    
    // Create signal for each type with enough sources
    for (const [signalType, typeSources] of sourcesByType) {
      // Require at least 1 source for signals
      if (typeSources.length === 0) continue;
      
      const scores = computeSignalScores(typeSources);
      const priorityScore = computePriorityScore(scores);
      
      // Skip low priority signals
      if (priorityScore < SIGNAL_THRESHOLDS.MIN_PRIORITY_FOR_CONSIDERATION) {
        console.log(`[SIGNAL_DETECTOR] Skipping ${signalType} signal (priority ${priorityScore} < ${SIGNAL_THRESHOLDS.MIN_PRIORITY_FOR_CONSIDERATION})`);
        continue;
      }
      
      // Generate title and summary from top source
      const topSource = typeSources.sort((a, b) => (b.qualityScore || 0) - (a.qualityScore || 0))[0];
      const title = generateSignalTitle(signalType, topSource, verticalSlug);
      const summary = generateSignalSummary(signalType, typeSources);
      
      detectedSignals.push({
        verticalId,
        signalType,
        title,
        summary,
        scores,
        priorityScore,
        sourceIds: typeSources.map(s => s.id)
      });
      
      byType[signalType] = (byType[signalType] || 0) + 1;
    }
  }
  
  console.log(`[SIGNAL_DETECTOR] Detected ${detectedSignals.length} signals`);
  
  // Store signals in database
  for (const signal of detectedSignals) {
    await prisma.signal.create({
      data: {
        verticalId: signal.verticalId,
        signalType: signal.signalType,
        title: signal.title,
        summary: signal.summary,
        noveltyScore: signal.scores.noveltyScore,
        impactScore: signal.scores.impactScore,
        confidenceScore: signal.scores.confidenceScore,
        urgencyScore: signal.scores.urgencyScore,
        priorityScore: signal.priorityScore,
        sourceIds: signal.sourceIds,
        status: "NEW",
        expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days
      }
    });
  }
  
  return {
    detected: detectedSignals.length,
    byType,
    signals: detectedSignals
  };
}

// ============================================================================
// HELPERS
// ============================================================================

function generateSignalTitle(signalType: SignalType, topSource: any, verticalSlug: string): string {
  const verticalName = VERTICALS.find(v => v.slug === verticalSlug)?.name || verticalSlug;
  
  switch (signalType) {
    case "NEW_EVIDENCE":
      return `New Evidence: ${truncate(topSource.title, 60)}`;
    case "DATA_RELEASE":
      return `Data Release: ${topSource.provider?.toUpperCase()} - ${truncate(topSource.title, 50)}`;
    case "POLICY_CHANGE":
      return `Policy Change: ${truncate(topSource.title, 60)}`;
    case "METHODOLOGY_SHIFT":
      return `Methodology Shift: ${truncate(topSource.title, 60)}`;
    case "CONTRADICTION":
      return `Contradiction Detected - ${verticalName}`;
    case "TREND_BREAK":
      return `Trend Break - ${verticalName}`;
    default:
      return truncate(topSource.title, 80);
  }
}

function generateSignalSummary(signalType: SignalType, sources: any[]): string {
  const sourceCount = sources.length;
  const avgQuality = Math.round(sources.reduce((sum, s) => sum + (s.qualityScore || 0), 0) / sourceCount);
  const topSource = sources[0];
  
  const abstract = topSource.abstract || "";
  const preview = truncate(abstract, 300);
  
  return `${sourceCount} source(s) detected (avg quality: ${avgQuality}/100). ${preview}`;
}

function truncate(text: string, maxLength: number): string {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}
