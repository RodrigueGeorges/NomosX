/**
 * NomosX RESEARCHER OWNERSHIP SYSTEM
 *
 * Each PhD researcher is not just an analyst — they are the editorial owner
 * of their domain within the NomosX Think Tank.
 *
 * Ownership means:
 * 1. TOPIC AUTHORITY     — the researcher proposes topics in their domain
 * 2. PUBLICATION SIGN-OFF — their verdict gates publication in their sector
 * 3. STANDING AGENDA     — they maintain a live list of what needs to be covered
 * 4. INTELLECTUAL CONTINUITY — they track their own prior positions and evolve them
 * 5. QUALITY STANDARD    — their domain-specific threshold applies (law != economics)
 *
 * This is what makes NomosX publications feel authored, not generated.
 * Dr. Vasquez owns economics. Dr. Chen owns technology. Each publication
 * in their domain bears their intellectual fingerprint.
 */

import { prisma } from '../db';
import { callLLM } from '../llm/unified-llm';
import { buildResearcherProfile } from './researcher-identity';
import type { DomainExpertise } from './phd-researcher';

// ============================================================================
// RESEARCHER REGISTRY — one owner per domain
// ============================================================================

export interface ResearcherOwner {
  id: DomainExpertise;
  name: string;
  title: string;
  institution: string;
  domains: string[];            // Keywords that map to this researcher's ownership
  providers: string[];          // Preferred academic sources for their domain
  publicationCadence: "weekly" | "biweekly" | "monthly";
  minQualityThreshold: number;  // Domain-specific publish gate (0-100)
  maxBriefPerRun: number;       // Max briefs they commission per auto-publisher run
  preferredFormats: Array<"brief" | "strategic">;
  focusAreas: string[];         // Standing research agenda (updated quarterly)
}

export const RESEARCHER_REGISTRY: Record<DomainExpertise, ResearcherOwner> = {
  economics: {
    id: "economics",
    name: "Dr. Elena Vasquez",
    title: "Senior Economist — Macroeconomics & Policy",
    institution: "Harvard Kennedy School",
    domains: [
      "economics", "finance", "fiscal policy", "monetary policy", "trade",
      "development", "inequality", "growth", "inflation", "debt", "budget",
      "tax", "gdp", "recession", "central bank", "interest rate", "currency",
      "imf", "world bank", "oecd", "nber",
    ],
    providers: ["openalex", "crossref", "repec", "worldbank", "imf", "oecd", "bis", "brookings"],
    publicationCadence: "weekly",
    minQualityThreshold: 72,
    maxBriefPerRun: 2,
    preferredFormats: ["brief", "strategic"],
    focusAreas: [
      "Impact of AI on labor markets and wage inequality",
      "Central bank digital currencies and monetary sovereignty",
      "Fiscal sustainability in post-pandemic economies",
      "Trade fragmentation and geopolitical decoupling costs",
    ],
  },

  technology: {
    id: "technology",
    name: "Dr. James Chen",
    title: "AI/ML Research Director",
    institution: "Stanford HAI / MIT CSAIL",
    domains: [
      "technology", "ai", "artificial intelligence", "machine learning", "cybersecurity",
      "digital", "software", "hardware", "semiconductor", "robotics", "automation",
      "data", "algorithm", "computing", "llm", "foundation model", "open source",
      "deepmind", "openai", "anthropic", "nvidia",
    ],
    providers: ["semanticscholar", "arxiv", "openalex", "crossref", "cset", "ainow", "govai"],
    publicationCadence: "weekly",
    minQualityThreshold: 70,
    maxBriefPerRun: 2,
    preferredFormats: ["brief", "strategic"],
    focusAreas: [
      "Large language model capabilities and safety benchmarks",
      "EU AI Act implementation: compliance gaps and industry response",
      "Semiconductor supply chain resilience and US-China tech decoupling",
      "Autonomous systems in defense: dual-use implications",
    ],
  },

  policy: {
    id: "policy",
    name: "Dr. Amara Okafor",
    title: "Director of Policy Research",
    institution: "Oxford Blavatnik School / Brookings Institution",
    domains: [
      "policy", "governance", "politics", "geopolitics", "regulation", "government",
      "democracy", "institution", "reform", "public administration", "diplomacy",
      "multilateral", "election", "parliament", "congress", "senate", "eu", "un",
      "g7", "g20", "nato", "wto",
    ],
    providers: ["openalex", "crossref", "hal", "brookings", "rand", "chatham-house", "carnegie", "un"],
    publicationCadence: "weekly",
    minQualityThreshold: 70,
    maxBriefPerRun: 2,
    preferredFormats: ["brief", "strategic"],
    focusAreas: [
      "Democratic backsliding and institutional resilience",
      "Multilateral governance reform (UN, WTO, IMF)",
      "Regulatory frameworks for emerging technologies",
      "Geopolitical realignment and alliance dynamics post-2024",
    ],
  },

  health: {
    id: "health",
    name: "Dr. Sarah Lindström",
    title: "Epidemiologist & Global Health Policy Lead",
    institution: "Johns Hopkins Bloomberg School / WHO",
    domains: [
      "health", "medicine", "epidemiology", "public health", "pandemic", "vaccine",
      "drug", "clinical", "hospital", "mental health", "nutrition", "aging",
      "biotech", "pharma", "who", "cdc", "ema", "fda", "cancer", "diabetes",
      "obesity", "antibiotic", "antimicrobial",
    ],
    providers: ["pubmed", "europepmc", "openalex", "crossref", "semanticscholar", "worldbank"],
    publicationCadence: "biweekly",
    minQualityThreshold: 75,
    maxBriefPerRun: 1,
    preferredFormats: ["brief", "strategic"],
    focusAreas: [
      "Pandemic preparedness and global health security architecture",
      "Antimicrobial resistance: policy responses and innovation incentives",
      "Mental health crisis in OECD countries: evidence and interventions",
      "AI-assisted diagnostics: efficacy, equity, and regulatory gaps",
    ],
  },

  security: {
    id: "security",
    name: "Dr. Marcus Webb",
    title: "Strategic Security & Intelligence Analyst",
    institution: "Georgetown SFS / RAND Corporation",
    domains: [
      "security", "defense", "military", "intelligence", "conflict", "war",
      "terrorism", "cyber attack", "nato", "nuclear", "deterrence", "hybrid warfare",
      "espionage", "sanctions", "arms", "missile", "drone", "iiss", "sipri",
      "pentagon", "kremlin", "pla",
    ],
    providers: ["openalex", "crossref", "rand", "cnas", "nato", "chatham-house", "brookings"],
    publicationCadence: "biweekly",
    minQualityThreshold: 73,
    maxBriefPerRun: 1,
    preferredFormats: ["brief", "strategic"],
    focusAreas: [
      "NATO cohesion and burden-sharing under geopolitical pressure",
      "Cyber warfare escalation dynamics and attribution challenges",
      "Nuclear deterrence stability in a multipolar world",
      "Hybrid warfare: information operations and democratic resilience",
    ],
  },

  law: {
    id: "law",
    name: "Dr. Isabelle Moreau",
    title: "International Law & Regulatory Frameworks Scholar",
    institution: "Yale Law School / ICJ",
    domains: [
      "law", "legal", "regulation", "compliance", "court", "treaty", "rights",
      "constitution", "jurisdiction", "litigation", "antitrust", "competition",
      "intellectual property", "data protection", "gdpr", "dma", "dsa",
      "international law", "human rights", "echr", "icj", "wto dispute",
    ],
    providers: ["openalex", "crossref", "hal", "un", "brookings", "rand", "ssrn"],
    publicationCadence: "biweekly",
    minQualityThreshold: 74,
    maxBriefPerRun: 1,
    preferredFormats: ["brief", "strategic"],
    focusAreas: [
      "Digital sovereignty and cross-border data governance",
      "AI liability frameworks: who is responsible when AI causes harm?",
      "International sanctions law: effectiveness and unintended consequences",
      "Platform regulation: DMA/DSA implementation and global spillovers",
    ],
  },

  environment: {
    id: "environment",
    name: "Dr. Kenji Tanaka",
    title: "Climate Science & Environmental Systems Lead",
    institution: "ETH Zurich / IPCC Working Group III",
    domains: [
      "climate", "environment", "energy", "carbon", "emissions", "sustainability",
      "biodiversity", "ocean", "deforestation", "renewable", "fossil fuel",
      "net zero", "transition", "ecology", "ipcc", "cop", "methane",
      "solar", "wind", "hydrogen", "battery", "ev", "electric vehicle",
    ],
    providers: ["openalex", "crossref", "worldbank", "un", "oecd", "iea", "wri", "climate-analytics"],
    publicationCadence: "weekly",
    minQualityThreshold: 71,
    maxBriefPerRun: 2,
    preferredFormats: ["brief", "strategic"],
    focusAreas: [
      "Carbon pricing mechanisms: effectiveness and political economy",
      "Critical minerals supply chains for the energy transition",
      "Climate finance flows: gaps between pledges and disbursements",
      "Nature-based solutions: co-benefits, permanence, and measurement",
    ],
  },

  quantitative: {
    id: "quantitative",
    name: "Dr. Priya Sharma",
    title: "Quantitative Methods & Causal Inference Lead",
    institution: "Harvard Statistics / NBER",
    domains: [
      "statistics", "methodology", "causal inference", "meta-analysis",
      "econometrics", "measurement", "survey", "experiment", "randomized",
      "bayesian", "replication", "p-value", "effect size", "rct",
      "quasi-experimental", "difference-in-differences", "regression discontinuity",
    ],
    providers: ["semanticscholar", "arxiv", "openalex", "crossref", "repec", "ssrn"],
    publicationCadence: "monthly",
    minQualityThreshold: 76,
    maxBriefPerRun: 1,
    preferredFormats: ["strategic"],
    focusAreas: [
      "Replication crisis in social sciences: scope and remedies",
      "Causal AI: from correlation to intervention in ML systems",
      "Pre-registration and open science: adoption and impact on research quality",
    ],
  },
};

// ============================================================================
// DOMAIN DETECTION — which researcher owns this topic?
// ============================================================================

/**
 * Detect which researcher(s) should own a given topic.
 * Returns ordered list — primary owner first.
 */
export function detectOwners(topic: string): ResearcherOwner[] {
  const topicLower = topic.toLowerCase();
  const scores: Array<{ owner: ResearcherOwner; score: number }> = [];

  for (const owner of Object.values(RESEARCHER_REGISTRY)) {
    let score = 0;
    for (const keyword of owner.domains) {
      if (topicLower.includes(keyword)) {
        score += keyword.split(" ").length; // multi-word keywords score higher
      }
    }
    if (score > 0) scores.push({ owner, score });
  }

  scores.sort((a, b) => b.score - a.score);

  if (scores.length === 0) {
    return [RESEARCHER_REGISTRY.policy]; // fallback: policy researcher
  }

  return scores.map(s => s.owner);
}

/**
 * Get the primary owner for a topic.
 */
export function getPrimaryOwner(topic: string): ResearcherOwner {
  return detectOwners(topic)[0];
}

// ============================================================================
// PIPELINE TIER SELECTION
// ============================================================================

export type PipelineTier = "standard" | "premium" | "strategic";

/**
 * Determine the appropriate pipeline tier for a topic + format.
 *
 * standard  — ANALYST V3 + Guard + Editor (no Council, no Debate)
 *             Cost: ~$0.80-1.50 | Use: routine briefs, signal-driven
 *
 * premium   — + Harvard Council (3 experts max) + Critical Loop V2
 *             Cost: ~$2.50-4.00 | Use: editorial-commissioned briefs
 *
 * strategic — Full pipeline: Council (8 experts) + Debate + Meta-Analysis + DA
 *             Cost: ~$8-15    | Use: strategic reports, critical topics
 */
export function selectPipelineTier(
  topic: string,
  format: "brief" | "strategic",
  owner: ResearcherOwner,
  options?: { forceStrategic?: boolean; forcePremium?: boolean }
): PipelineTier {
  if (options?.forceStrategic || format === "strategic") return "strategic";
  if (options?.forcePremium) return "premium";

  const topicLower = topic.toLowerCase();

  // Topics that always warrant full strategic treatment
  const strategicTriggers = [
    "nuclear", "pandemic", "systemic risk", "financial crisis", "war",
    "geopolitical", "constitutional", "climate tipping", "ai safety",
    "democratic", "sovereignty",
  ];
  if (strategicTriggers.some(t => topicLower.includes(t))) return "strategic";

  // High-rigor domains default to premium
  const premiumDomains: DomainExpertise[] = ["health", "law", "quantitative", "security"];
  if (premiumDomains.includes(owner.id)) return "premium";

  return "standard";
}

// ============================================================================
// RESEARCHER STANDING AGENDA
// ============================================================================

export interface AgendaItem {
  researcherId: DomainExpertise;
  researcherName: string;
  topic: string;
  rationale: string;
  priority: "critical" | "high" | "medium";
  suggestedFormat: "brief" | "strategic";
  suggestedProviders: string[];
  tier: PipelineTier;
  linkedFocusArea: string;
}

/**
 * Generate the standing editorial agenda for a specific researcher.
 * Combines their focus areas with recent DB signals and coverage gaps.
 */
export async function getResearcherAgenda(
  researcherId: DomainExpertise,
  options?: { maxItems?: number; includeSignals?: boolean }
): Promise<AgendaItem[]> {
  const owner = RESEARCHER_REGISTRY[researcherId];
  const maxItems = options?.maxItems ?? 4;
  const items: AgendaItem[] = [];

  // 1. Standing focus areas always generate agenda items
  for (const focusArea of owner.focusAreas.slice(0, maxItems)) {
    items.push({
      researcherId: owner.id,
      researcherName: owner.name,
      topic: focusArea,
      rationale: `Standing research agenda item for ${owner.name}`,
      priority: "high",
      suggestedFormat: owner.preferredFormats.includes("strategic") && focusArea.length > 60
        ? "strategic"
        : "brief",
      suggestedProviders: owner.providers,
      tier: selectPipelineTier(focusArea, "brief", owner),
      linkedFocusArea: focusArea,
    });
  }

  // 2. Optionally enrich with recent high-priority signals in this domain
  if (options?.includeSignals) {
    try {
      const signals = await prisma.signal.findMany({
        where: {
          status: "NEW",
          priorityScore: { gte: 75 },
          detectedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
        orderBy: { priorityScore: "desc" },
        take: 10,
        select: { id: true, title: true, priorityScore: true },
      });

      for (const signal of signals) {
        const owners = detectOwners(signal.title);
        if (owners[0]?.id === researcherId && items.length < maxItems + 2) {
          items.push({
            researcherId: owner.id,
            researcherName: owner.name,
            topic: signal.title,
            rationale: `High-priority signal (score: ${signal.priorityScore}) in ${owner.name}'s domain`,
            priority: signal.priorityScore >= 90 ? "critical" : "high",
            suggestedFormat: "brief",
            suggestedProviders: owner.providers,
            tier: "premium",
            linkedFocusArea: owner.focusAreas[0],
          });
        }
      }
    } catch {
      // Non-blocking — signals are optional enrichment
    }
  }

  return items.slice(0, maxItems);
}

/**
 * Generate the full think tank editorial agenda across all researchers.
 * Each researcher contributes their top items, respecting cadence and slot limits.
 */
export async function getThinkTankAgenda(options?: {
  maxTotalItems?: number;
  includeSignals?: boolean;
}): Promise<AgendaItem[]> {
  const maxTotal = options?.maxTotalItems ?? 8;
  const allItems: AgendaItem[] = [];

  // Run all researcher agendas in parallel
  const agendas = await Promise.allSettled(
    (Object.keys(RESEARCHER_REGISTRY) as DomainExpertise[]).map(id =>
      getResearcherAgenda(id, {
        maxItems: RESEARCHER_REGISTRY[id].maxBriefPerRun,
        includeSignals: options?.includeSignals,
      })
    )
  );

  for (const result of agendas) {
    if (result.status === "fulfilled") {
      allItems.push(...result.value);
    }
  }

  // Sort by priority then by researcher cadence (weekly > biweekly > monthly)
  const cadenceWeight: Record<string, number> = { weekly: 3, biweekly: 2, monthly: 1 };
  const priorityWeight: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1 };

  allItems.sort((a, b) => {
    const pa = priorityWeight[a.priority] ?? 1;
    const pb = priorityWeight[b.priority] ?? 1;
    if (pa !== pb) return pb - pa;
    const ca = cadenceWeight[RESEARCHER_REGISTRY[a.researcherId].publicationCadence] ?? 1;
    const cb = cadenceWeight[RESEARCHER_REGISTRY[b.researcherId].publicationCadence] ?? 1;
    return cb - ca;
  });

  return allItems.slice(0, maxTotal);
}

// ============================================================================
// RESEARCHER SIGN-OFF — domain expert approves publication
// ============================================================================

export interface ResearcherSignOff {
  researcherId: DomainExpertise;
  researcherName: string;
  decision: "approve" | "revise" | "reject";
  verdict: string;           // 1-2 sentence rationale
  concerns: string[];        // Specific issues if revise/reject
  suggestedImprovements: string[];
  confidenceInDecision: number; // 0-100
  costUsd: number;
  durationMs: number;
}

/**
 * Ask the domain researcher to sign off on a publication before it goes live.
 * This is the final editorial gate — the researcher reads the HTML brief
 * and decides: approve / revise / reject.
 *
 * Called by auto-publisher after DA quality gate, before PUBLISHED status.
 */
export async function requestResearcherSignOff(
  topic: string,
  briefHtml: string,
  trustScore: number,
  options?: { timeoutMs?: number }
): Promise<ResearcherSignOff> {
  const start = Date.now();
  const owner = getPrimaryOwner(topic);

  // Build researcher identity context
  let identityBlock = "";
  try {
    const profile = await buildResearcherProfile(owner.id, topic, 120);
    identityBlock = profile.identityBlock ?? "";
  } catch {
    // Non-blocking
  }

  // Strip HTML to plain text for the researcher
  const plainText = briefHtml
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 6000);

  const systemPrompt = `You are ${owner.name}, ${owner.title} at ${owner.institution}.
You are the editorial owner of the ${owner.id} domain at NomosX Think Tank.
Your role: review publications in your domain before they go live.
${identityBlock}

QUALITY STANDARD: You only approve publications that meet the standard of ${owner.institution}.
Minimum quality threshold for your domain: ${owner.minQualityThreshold}/100.
Current trust score: ${trustScore}/100.

Be rigorous but fair. A publication that is good but not perfect should be approved with minor notes.
A publication with factual errors, weak evidence, or misleading framing should be revised or rejected.`;

  const result = await callLLM({
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `Please review this publication draft for the NomosX Think Tank.

TOPIC: "${topic}"

PUBLICATION CONTENT:
${plainText}

Provide your editorial decision as JSON:
{
  "decision": "approve" | "revise" | "reject",
  "verdict": "1-2 sentence summary of your decision",
  "concerns": ["specific concern 1", "specific concern 2"],
  "suggestedImprovements": ["improvement 1", "improvement 2"],
  "confidenceInDecision": 0-100
}

CRITERIA:
- approve: meets ${owner.institution} standards, evidence is solid, framing is fair
- revise: good foundation but needs specific improvements before publication
- reject: fundamental flaws in evidence, methodology, or framing that cannot be patched`,
      },
    ],
    temperature: 0.1,
    maxTokens: 1200,
    jsonMode: true,
    enableCache: false,
  });

  const durationMs = Date.now() - start;
  const costUsd = result.costUsd;

  try {
    const parsed = JSON.parse(result.content);
    return {
      researcherId: owner.id,
      researcherName: owner.name,
      decision: parsed.decision ?? "approve",
      verdict: parsed.verdict ?? "",
      concerns: parsed.concerns ?? [],
      suggestedImprovements: parsed.suggestedImprovements ?? [],
      confidenceInDecision: parsed.confidenceInDecision ?? 70,
      costUsd,
      durationMs,
    };
  } catch {
    return {
      researcherId: owner.id,
      researcherName: owner.name,
      decision: "approve",
      verdict: "Sign-off parse error — defaulting to approve",
      concerns: [],
      suggestedImprovements: [],
      confidenceInDecision: 50,
      costUsd,
      durationMs,
    };
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export type { DomainExpertise };
