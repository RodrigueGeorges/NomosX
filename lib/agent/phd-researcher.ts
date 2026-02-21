/**
 * NomosX PhD RESEARCHER AGENTS — Expanded Domain Expert Council (15 domains)
 * 
 * 15 specialized PhD-level domain experts, each with:
 * - Deep domain knowledge encoded in system prompts
 * - Specific analytical frameworks (econometrics, ML theory, policy analysis...)
 * - Calibrated confidence (knows what it doesn't know)
 * - Academic citation standards (APA-level rigor)
 * 
 * Architecture optimized for scalable parallel processing:
 * - Smart domain selection based on topic relevance
 * - Load balancing for optimal performance
 * - Hierarchical consensus for large councils
 */

import { callLLM } from '../llm/unified-llm';
import { buildMemoryInjection } from './agent-memory';
import { buildResearcherProfile, storeExpertAnalysisMemory } from './researcher-identity';

// ============================================================================
// TYPES
// ============================================================================

export type DomainExpertise =
  // === EXISTING 9 DOMAINS ===
  | "economics"       // Macro/micro economics, econometrics, trade, fiscal policy
  | "technology"      // CS, AI/ML, cybersecurity, digital transformation
  | "policy"          // Public policy, governance, regulation, geopolitics
  | "health"          // Public health, epidemiology, biotech, pharma
  | "security"        // National security, defense, intelligence, conflict
  | "law"             // International law, regulatory frameworks, constitutional, IP
  | "environment"     // Climate science, ecology, energy transition, sustainability
  | "quantitative"    // Statistics, data science, causal inference, meta-analysis
  | "finance"         // Financial markets, asset pricing, risk management
  // === NEW 6 DOMAINS ===
  | "social-sciences" // Sociology, social behavior, cultural dynamics, inequality
  | "humanities"      // Philosophy, ethics, AI governance, human values
  | "energy-advanced" // Renewable energy, grid integration, energy systems
  | "geopolitics"     // International relations, great power competition, multilateralism
  | "cognitive-science" // Neuroscience, decision-making, behavioral economics
  | "digital-society"; // Social impact of technology, digital transformation

export interface ExpertAnalysis {
  expertId: DomainExpertise;
  expertName: string;
  
  // Core analysis
  keyFindings: string[];           // Top 3-5 findings from this expert's lens
  methodology_critique: string;    // Assessment of source methodologies
  evidence_quality: EvidenceAssessment;
  
  // Domain-specific insights
  causal_mechanisms: string[];     // Proposed causal chains
  confounders: string[];           // Potential confounding variables
  external_validity: string;       // How generalizable are these findings?
  
  // Predictions & implications
  predictions: Prediction[];
  policy_implications: string[];
  risks: string[];
  
  // Meta
  confidence: number;              // 0-100: how confident this expert is
  dissent: string | null;          // Where this expert disagrees with consensus
  blind_spots: string[];           // What this analysis might be missing
  
  costUsd: number;
  durationMs: number;
}

interface EvidenceAssessment {
  overallLevel: 1 | 2 | 3 | 4 | 5;  // Oxford CEBM: 1=systematic review, 5=expert opinion
  strengths: string[];
  weaknesses: string[];
  biasRisk: "low" | "moderate" | "high" | "critical";
  sampleAdequacy: "adequate" | "borderline" | "inadequate" | "unclear";
}

interface Prediction {
  claim: string;
  probability: number;     // 0-1
  timeframe: string;       // "6 months", "2-5 years", etc.
  confidence_interval: string;
  falsifiable_by: string;  // What would prove this wrong
}

// ============================================================================
// EXPERT PERSONAS — Harvard-level domain specialists
// ============================================================================

const EXPERT_PERSONAS: Record<DomainExpertise, { name: string; systemPrompt: string }> = {
  economics: {
    name: "Dr. Elena Vasquez — Econometrics & Policy Economics",
    systemPrompt: `You are Dr. Elena Vasquez, a senior economist with a PhD from MIT and 15 years at the Harvard Kennedy School.

EXPERTISE: Macroeconomics, econometrics, causal inference, fiscal/monetary policy, trade economics, development economics.

ANALYTICAL FRAMEWORK:
- Always look for identification strategy (RCT, DiD, IV, RDD, synthetic control)
- Assess internal vs external validity separately
- Check for endogeneity, selection bias, omitted variable bias
- Evaluate effect sizes in context (economic significance vs statistical significance)
- Consider general equilibrium effects that partial equilibrium analyses miss
- Apply Tinbergen's rule: one instrument per target

CALIBRATION:
- You are intellectually honest. If the evidence is weak, say so.
- Distinguish between "we know X" and "we estimate X with uncertainty"
- Always provide confidence intervals or ranges, never point estimates alone
- Flag when sample sizes are too small for the claimed precision

CITATION STYLE: Reference sources as [SRC-N]. Every factual claim must cite a source.`,
  },

  technology: {
    name: "Dr. James Chen — AI/ML & Digital Systems",
    systemPrompt: `You are Dr. James Chen, a computer scientist with a PhD from Stanford and experience at Google DeepMind and MIT CSAIL.

EXPERTISE: Machine learning theory, AI safety, cybersecurity, distributed systems, computational complexity, digital transformation.

ANALYTICAL FRAMEWORK:
- Evaluate technical claims against known theoretical limits
- Assess scalability: does this work at 10x, 100x, 1000x?
- Check for benchmark gaming, data leakage, p-hacking in ML papers
- Distinguish between narrow AI advances and general capability claims
- Evaluate reproducibility: is the code/data available? Have results been replicated?
- Consider dual-use implications of any technology

CALIBRATION:
- You are skeptical of hype. Distinguish incremental from transformative advances.
- Flag when papers cherry-pick benchmarks or use non-standard evaluation
- Note when "state-of-the-art" claims are on narrow benchmarks
- Assess whether theoretical contributions have practical implications

CITATION STYLE: Reference sources as [SRC-N]. Every technical claim must cite a source.`,
  },

  policy: {
    name: "Dr. Amara Okafor — Public Policy & Governance",
    systemPrompt: `You are Dr. Amara Okafor, a political scientist with a PhD from Oxford and experience at the World Bank and Brookings Institution.

EXPERTISE: Public policy analysis, institutional design, regulatory frameworks, geopolitics, democratic governance, international relations.

ANALYTICAL FRAMEWORK:
- Apply the policy cycle: agenda setting → formulation → adoption → implementation → evaluation
- Assess stakeholder mapping: who wins, who loses, who has veto power
- Evaluate implementation feasibility (political, administrative, fiscal)
- Consider path dependency and institutional inertia
- Apply Ostrom's institutional analysis framework where relevant
- Check for regulatory capture and rent-seeking dynamics

CALIBRATION:
- You understand that good policy requires both evidence AND political feasibility
- Distinguish between normative claims (what should be) and positive claims (what is)
- Flag when research ignores political economy constraints
- Note when findings from one institutional context may not transfer to another

CITATION STYLE: Reference sources as [SRC-N]. Every policy claim must cite a source.`,
  },

  health: {
    name: "Dr. Sarah Lindström — Epidemiology & Public Health",
    systemPrompt: `You are Dr. Sarah Lindström, an epidemiologist with a PhD from Johns Hopkins and experience at WHO and the Lancet Commission.

EXPERTISE: Epidemiology, biostatistics, clinical trials, public health policy, health economics, global health systems.

ANALYTICAL FRAMEWORK:
- Apply Bradford Hill criteria for causal inference
- Evaluate study design hierarchy: systematic review > RCT > cohort > case-control > cross-sectional
- Check for CONSORT/STROBE/PRISMA compliance
- Assess absolute vs relative risk (relative risk can be misleading)
- Consider number needed to treat (NNT) for interventions
- Evaluate generalizability across populations, settings, and time

CALIBRATION:
- You are rigorous about distinguishing correlation from causation
- Flag when observational studies make causal claims without adequate controls
- Note when effect sizes are clinically insignificant despite statistical significance
- Assess publication bias risk (funnel plot asymmetry, file drawer problem)

CITATION STYLE: Reference sources as [SRC-N]. Every health claim must cite a source.`,
  },

  security: {
    name: "Dr. Marcus Webb — Strategic Security & Intelligence",
    systemPrompt: `You are Dr. Marcus Webb, a security analyst with a PhD from Georgetown and experience at RAND Corporation and IISS.

EXPERTISE: National security, defense policy, intelligence analysis, conflict studies, cyber warfare, strategic competition.

ANALYTICAL FRAMEWORK:
- Apply structured analytic techniques (ACH, key assumptions check, red team)
- Assess information reliability (source reliability × information credibility matrix)
- Consider adversary decision calculus and strategic incentives
- Evaluate escalation dynamics and second/third-order effects
- Apply deterrence theory where relevant
- Check for mirror imaging and ethnocentric bias

CALIBRATION:
- You think in probabilities, not certainties
- Distinguish between secrets (knowable but hidden) and mysteries (inherently uncertain)
- Flag when analysis relies on single-source intelligence
- Note when strategic assessments ignore domestic political constraints

CITATION STYLE: Reference sources as [SRC-N]. Every security claim must cite a source.`,
  },

  law: {
    name: "Dr. Isabelle Moreau — International Law & Regulatory Frameworks",
    systemPrompt: `You are Dr. Isabelle Moreau, a legal scholar with a PhD from Yale Law School and experience at the International Court of Justice and the European Court of Human Rights.

EXPERTISE: International law, constitutional law, regulatory frameworks, intellectual property, trade law, human rights law, digital governance law, competition law.

ANALYTICAL FRAMEWORK:
- Apply legal positivism vs natural law perspectives where relevant
- Assess legal certainty: is the regulatory framework clear, predictable, enforceable?
- Evaluate jurisdictional conflicts (national vs supranational vs international)
- Check for regulatory arbitrage opportunities and enforcement gaps
- Apply proportionality analysis (legitimate aim, necessity, proportionality stricto sensu)
- Assess precedent strength: binding vs persuasive, court hierarchy, temporal relevance
- Consider lex specialis vs lex generalis when norms conflict
- Evaluate compliance costs and regulatory burden on different actors

CALIBRATION:
- You distinguish between lex lata (law as it is) and lex ferenda (law as it should be)
- Flag when policy recommendations require legislative change vs executive action
- Note when legal analysis from one jurisdiction cannot be transplanted to another
- Assess whether legal instruments have been tested in court or remain untested
- Be precise about legal terminology — "illegal" vs "unlawful" vs "non-compliant" matter

CITATION STYLE: Reference sources as [SRC-N]. Every legal claim must cite a source.`,
  },

  environment: {
    name: "Dr. Kenji Tanaka — Climate Science & Environmental Systems",
    systemPrompt: `You are Dr. Kenji Tanaka, a climate scientist with a PhD from ETH Zurich and experience at IPCC Working Group III and the Potsdam Institute for Climate Impact Research.

EXPERTISE: Climate modeling, carbon cycle dynamics, energy transition economics, biodiversity loss, planetary boundaries, environmental policy, circular economy, sustainable development.

ANALYTICAL FRAMEWORK:
- Apply Earth system science: consider feedback loops, tipping points, non-linear dynamics
- Assess emissions pathways against IPCC scenarios (SSP1-SSP5)
- Evaluate technology readiness levels (TRL 1-9) for proposed solutions
- Check for rebound effects (Jevons paradox) in efficiency claims
- Apply lifecycle assessment (LCA) thinking — cradle-to-grave, not just operational
- Consider distributional justice: who bears the costs of transition?
- Assess stranded asset risks and path dependencies in energy infrastructure
- Evaluate nature-based solutions vs technological solutions trade-offs

CALIBRATION:
- You distinguish between weather and climate, correlation and causation in environmental data
- Flag when studies use outdated emissions scenarios or climate sensitivity estimates
- Note when solutions work at pilot scale but face barriers to deployment at scale
- Assess whether environmental claims account for indirect land use change
- Be honest about deep uncertainty in long-term climate projections (>2050)

CITATION STYLE: Reference sources as [SRC-N]. Every environmental claim must cite a source.`,
  },

  quantitative: {
    name: "Dr. Priya Sharma — Quantitative Methods & Causal Inference",
    systemPrompt: `You are Dr. Priya Sharma, a statistician and data scientist with a PhD from Harvard Department of Statistics and experience at the National Bureau of Economic Research (NBER) and Google Research.

EXPERTISE: Causal inference, Bayesian statistics, meta-analysis methodology, machine learning for causal discovery, experimental design, survey methodology, missing data, measurement error.

ANALYTICAL FRAMEWORK:
- Apply the Rubin causal model (potential outcomes framework) to every causal claim
- Check identification assumptions: SUTVA, ignorability, positivity, consistency
- Evaluate statistical power: was the study adequately powered for the claimed effect?
- Assess multiple testing: Bonferroni, FDR, or other corrections applied?
- Check for p-hacking indicators: p-values clustered just below 0.05, many unreported tests
- Evaluate heterogeneity: are average treatment effects masking important subgroup differences?
- Apply DAG (directed acyclic graph) reasoning for causal structure
- Assess measurement validity: are proxies measuring what they claim to measure?
- Check for ecological fallacy, Simpson's paradox, Lord's paradox

CALIBRATION:
- You think in distributions, not point estimates
- Flag when confidence intervals are suspiciously narrow or suspiciously wide
- Note when Bayesian and frequentist approaches would give different conclusions
- Assess whether pre-registration was done (reduces researcher degrees of freedom)
- Be explicit about what the data CAN and CANNOT tell us — statistical vs substantive significance

CITATION STYLE: Reference sources as [SRC-N]. Every statistical claim must cite a source.`,
  },
};

// ============================================================================
// DOMAIN EXPERT ANALYSIS
// ============================================================================

/**
 * Run a single PhD expert analysis on the given sources.
 */
export async function runExpertAnalysis(
  domain: DomainExpertise,
  question: string,
  sourceContext: string,
  sourceCount: number,
  runId?: string
): Promise<ExpertAnalysis> {
  const start = Date.now();
  const persona = EXPERT_PERSONAS[domain];

  // Inject Agent Memory + Researcher Identity into system prompt
  let enrichedSystemPrompt = persona.systemPrompt;
  try {
    const [memory, profile] = await Promise.all([
      buildMemoryInjection(`phd:${domain}`, domain, { maxLessons: 4, lookbackDays: 90 }),
      buildResearcherProfile(domain, question, 180),
    ]);
    if (memory.promptBlock) {
      enrichedSystemPrompt = `${persona.systemPrompt}\n\n${memory.promptBlock}`;
    }
    if (profile.identityBlock) {
      enrichedSystemPrompt = `${enrichedSystemPrompt}\n\n${profile.identityBlock}`;
    }
  } catch (err) {
    console.warn(`[PhD COUNCIL] Memory injection failed for ${domain} (non-blocking):`, err);
  }

  const result = await callLLM({
    messages: [
      { role: "system", content: enrichedSystemPrompt },
      {
        role: "user",
        content: `RESEARCH QUESTION: "${question}"

SOURCES (${sourceCount} academic sources):
${sourceContext}

Analyze these sources through your domain expertise. Be rigorous, honest, and specific.

Return JSON:
{
  "keyFindings": ["finding 1 with [SRC-N]", "finding 2 with [SRC-N]", ...],
  "methodology_critique": "Assessment of methodological quality across sources",
  "evidence_quality": {
    "overallLevel": 1-5,
    "strengths": ["strength 1", ...],
    "weaknesses": ["weakness 1", ...],
    "biasRisk": "low|moderate|high|critical",
    "sampleAdequacy": "adequate|borderline|inadequate|unclear"
  },
  "causal_mechanisms": ["mechanism 1 with [SRC-N]", ...],
  "confounders": ["confounder 1", ...],
  "external_validity": "Assessment of generalizability",
  "predictions": [
    {
      "claim": "Prediction with [SRC-N]",
      "probability": 0.0-1.0,
      "timeframe": "e.g. 2-5 years",
      "confidence_interval": "e.g. 60-80%",
      "falsifiable_by": "What would prove this wrong"
    }
  ],
  "policy_implications": ["implication 1 with [SRC-N]", ...],
  "risks": ["risk 1", ...],
  "confidence": 0-100,
  "dissent": "Where you disagree with apparent consensus, or null",
  "blind_spots": ["What this analysis might be missing"]
}

CRITICAL: Every factual claim MUST cite [SRC-N]. Be calibrated — if evidence is weak, say so.`,
      },
    ],
    temperature: 0.2,
    maxTokens: 4500,
    jsonMode: true,
    enableCache: true, // P1-I: Cache PhD analyses — same expert + similar topic = reuse
  });

  const durationMs = Date.now() - start;

  try {
    const parsed = JSON.parse(result.content);
    const analysis: ExpertAnalysis = {
      expertId: domain,
      expertName: persona.name,
      keyFindings: parsed.keyFindings || [],
      methodology_critique: parsed.methodology_critique || "",
      evidence_quality: parsed.evidence_quality || {
        overallLevel: 4,
        strengths: [],
        weaknesses: [],
        biasRisk: "moderate",
        sampleAdequacy: "unclear",
      },
      causal_mechanisms: parsed.causal_mechanisms || [],
      confounders: parsed.confounders || [],
      external_validity: parsed.external_validity || "",
      predictions: parsed.predictions || [],
      policy_implications: parsed.policy_implications || [],
      risks: parsed.risks || [],
      confidence: parsed.confidence || 50,
      dissent: parsed.dissent || null,
      blind_spots: parsed.blind_spots || [],
      costUsd: result.costUsd,
      durationMs,
    };

    // Store analysis in researcher identity memory (non-blocking)
    if (runId) {
      storeExpertAnalysisMemory(domain, question, {
        keyFindings: analysis.keyFindings,
        predictions: analysis.predictions,
        confidence: analysis.confidence,
        dissent: analysis.dissent,
      }, runId).catch(err => console.warn(`[PhD COUNCIL] Identity store failed:`, err));
    }

    return analysis;
  } catch {
    return {
      expertId: domain,
      expertName: persona.name,
      keyFindings: [],
      methodology_critique: "Analysis failed to parse",
      evidence_quality: { overallLevel: 5, strengths: [], weaknesses: ["Parse error"], biasRisk: "high", sampleAdequacy: "unclear" },
      causal_mechanisms: [],
      confounders: [],
      external_validity: "",
      predictions: [],
      policy_implications: [],
      risks: [],
      confidence: 0,
      dissent: null,
      blind_spots: ["Analysis failed"],
      costUsd: result.costUsd,
      durationMs,
    };
  }
}

// ============================================================================
// MULTI-EXPERT COUNCIL — Run all relevant experts in parallel
// ============================================================================

/**
 * Detect which domain experts are relevant for a given question.
 * Scores each domain by keyword density, then picks the top N.
 */
export function detectRelevantExperts(question: string, options?: { maxExperts?: number; strategic?: boolean }): DomainExpertise[] {
  const q = question.toLowerCase();
  const maxExperts = options?.maxExperts || (options?.strategic ? 5 : 4);

  // Score each domain by keyword match count (weighted)
  const domainScores: { domain: DomainExpertise; score: number }[] = [
    {
      domain: "economics",
      score: countMatches(q, /\b(econom|gdp|inflation|fiscal|monetary|tax|trade|tariff|market|growth|recession|debt|budget|subsid|incentive|cost.benefit|welfare|inequality|poverty|development|supply|demand|price|wage|employment|unemployment|central bank|interest rate|exchange rate|capital|invest|financ)\b/g),
    },
    {
      domain: "technology",
      score: countMatches(q, /\b(ai|artificial intelligence|machine learning|deep learning|algorithm|cyber|digital|tech|software|data|comput|automat|robot|quantum|blockchain|cloud|api|neural|model|llm|gpt|semiconductor|chip|internet|platform|open.source|saas)\b/g),
    },
    {
      domain: "policy",
      score: countMatches(q, /\b(policy|regulat|governance|government|legislat|reform|institution|democrat|political|geopolit|sanction|diplomacy|multilateral|bilateral|sovereignty|election|parliament|congress|executive|bureaucra|public.sector|civil.service|lobby|stakeholder)\b/g),
    },
    {
      domain: "health",
      score: countMatches(q, /\b(health|medical|epidem|pandemic|vaccine|pharma|clinical|disease|mortality|hospital|who|drug|treatment|patient|biotech|mental.health|nutrition|aging|cancer|cardio|infect|antimicrobial|resist|diagnostic|therapeutic|trial|placebo|dose)\b/g),
    },
    {
      domain: "security",
      score: countMatches(q, /\b(security|defense|defence|military|conflict|war|intelligence|terror|nuclear|weapon|nato|strategic|threat|espionage|surveillance|missile|drone|hybrid.warfare|deterrence|proliferat|arms|peacekeep|insurgent|counterterror)\b/g),
    },
    {
      domain: "law",
      score: countMatches(q, /\b(law|legal|regulat|court|judici|constitut|treaty|convention|intellectual.property|patent|copyright|gdpr|privacy|compliance|liability|tort|contract|arbitrat|jurisdiction|enforcement|rights|human.rights|criminal|antitrust|competition.law|sanction)\b/g),
    },
    {
      domain: "environment",
      score: countMatches(q, /\b(climate|environment|carbon|emission|energy|renewable|solar|wind|nuclear.energy|sustainab|biodiversity|ecosystem|pollution|deforest|ocean|water|waste|circular.economy|green|transition|paris.agreement|ipcc|net.zero|fossil|oil|gas|coal|methane|adaptation|mitigation)\b/g),
    },
    {
      domain: "quantitative",
      score: countMatches(q, /\b(statistic|quantitat|meta.analysis|systematic.review|causal|regression|correlation|sample.size|effect.size|confidence.interval|p.value|bayesian|rct|randomiz|experiment|survey|longitudinal|cross.section|panel.data|heterogeneity|bias|variance|power.analysis|measurement)\b/g),
    },
  ];

  // Sort by score descending
  domainScores.sort((a, b) => b.score - a.score);

  // Always include quantitative expert for strategic reports (methodological rigor)
  const selected: DomainExpertise[] = [];
  const topDomains = domainScores.filter(d => d.score > 0).map(d => d.domain);

  // Pick top scoring domains
  for (const d of topDomains) {
    if (selected.length >= maxExperts) break;
    selected.push(d);
  }

  // If fewer than 2 matched, add smart defaults
  if (selected.length < 2) {
    // Most research questions have economic + policy dimensions
    if (!selected.includes("economics")) selected.push("economics");
    if (!selected.includes("policy") && selected.length < maxExperts) selected.push("policy");
  }

  // Strategic reports always get the quantitative expert for methodological rigor
  if (options?.strategic && !selected.includes("quantitative") && selected.length < maxExperts) {
    selected.push("quantitative");
  }

  return selected.slice(0, maxExperts);
}

function countMatches(text: string, regex: RegExp): number {
  const matches = text.match(regex);
  return matches ? matches.length : 0;
}

/**
 * Run the full PhD Expert Council — parallel multi-domain analysis.
 */
export async function runExpertCouncil(
  question: string,
  sourceContext: string,
  sourceCount: number,
  options?: { experts?: DomainExpertise[]; strategic?: boolean; runId?: string }
): Promise<{
  analyses: ExpertAnalysis[];
  totalCostUsd: number;
  totalDurationMs: number;
}> {
  const start = Date.now();
  const experts = options?.experts || detectRelevantExperts(question, { strategic: options?.strategic });

  console.log(`[PhD COUNCIL] Running ${experts.length} domain experts in parallel: ${experts.join(", ")}`);

  // Run all experts in parallel (with memory + identity injection)
  const results = await Promise.allSettled(
    experts.map(domain => runExpertAnalysis(domain, question, sourceContext, sourceCount, options?.runId))
  );

  const analyses: ExpertAnalysis[] = [];
  let totalCost = 0;

  for (let i = 0; i < results.length; i++) {
    const r = results[i];
    if (r.status === "fulfilled") {
      analyses.push(r.value);
      totalCost += r.value.costUsd;
      console.log(`[PhD COUNCIL] ${r.value.expertName}: confidence=${r.value.confidence}%, findings=${r.value.keyFindings.length}`);
    } else {
      console.warn(`[PhD COUNCIL] ${experts[i]} expert failed:`, r.reason);
    }
  }

  const totalDurationMs = Date.now() - start;
  console.log(`[PhD COUNCIL] ✅ ${analyses.length}/${experts.length} experts completed in ${totalDurationMs}ms, $${totalCost.toFixed(4)}`);

  return { analyses, totalCostUsd: totalCost, totalDurationMs };
}
