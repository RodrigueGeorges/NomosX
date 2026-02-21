/**
 * SCALABLE HARVARD COUNCIL - Optimized for 15 PhD Researchers
 * 
 * Enhanced architecture for larger expert councils with:
 * - Hierarchical consensus (domain leads + general council)
 * - Load balancing and parallel processing
 * - Smart timeout management
 * - Performance optimization for 15 experts
 */

import { callLLM } from '../llm/unified-llm';
import type { ExpertAnalysis, DomainExpertise } from './phd-researcher-expanded';
import { runExpertCouncil, detectRelevantExperts } from './phd-researcher-expanded';
import { gradeEvidence } from './evidence-grader';
import { runAdversarialReview } from './adversarial-review';
import { synthesizeCouncil } from './synthesis-director';

// ============================================================================
// ENHANCED TYPES FOR 15 EXPERT COUNCIL
// ============================================================================

export interface EnhancedSynthesisReport {
  // Core synthesis
  consensus: string;
  disagreements: string;
  confidence: number;
  
  // Hierarchical structure
  domainLeads: {
    domain: DomainExpertise;
    leadExpert: ExpertAnalysis;
    consensusLevel: number; // 0-100 agreement within domain
  }[];
  
  // Cross-domain insights
  interdisciplinary: {
    connections: string[];
    conflicts: string[];
    synergies: string[];
  };
  
  // Quality metrics
  evidenceQuality: {
    overallLevel: number;
    domainBreakdown: Record<DomainExpertise, number>;
    confidence: number;
  };
  
  // Recommendations
  recommendations: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
    research: string[];
  };
  
  // Performance
  totalCostUsd: number;
  totalDurationMs: number;
  expertCount: number;
}

export interface CouncilConfig {
  maxExperts?: number;
  timeoutMs?: number;
  enableHierarchical?: boolean;
  enableInterdisciplinary?: boolean;
  strategic?: boolean;
  runId?: string;
}

// ============================================================================
// HIERARCHICAL COUNCIL ARCHITECTURE
// ============================================================================

/**
 * Domain Lead Selection - For 15 experts, organize into domain clusters
 */
export function selectDomainLeads(experts: DomainExpertise[]): DomainExpertise[] {
  // Define domain clusters for hierarchical organization
  const domainClusters = {
    stem: ['technology', 'health', 'environment', 'quantitative', 'finance', 'energy-advanced', 'cognitive-science'],
    social: ['economics', 'policy', 'security', 'social-sciences', 'geopolitics', 'digital-society'],
    humanities: ['law', 'humanities']
  };
  
  const leads: DomainExpertise[] = [];
  
  // Select lead from each cluster based on relevance score
  for (const [cluster, domains] of Object.entries(domainClusters)) {
    const clusterExperts = experts.filter(e => domains.includes(e));
    if (clusterExperts.length > 0) {
      // Simple selection: first expert in cluster (could be enhanced with scoring)
      leads.push(clusterExperts[0]);
    }
  }
  
  return leads;
}

/**
 * Load-Balanced Parallel Processing
 */
export async function runLoadBalancedCouncil(
  question: string,
  sourceContext: string,
  sourceCount: number,
  config: CouncilConfig
): Promise<{
  domainLeads: ExpertAnalysis[];
  supportingExperts: ExpertAnalysis[];
  totalCost: number;
  totalDuration: number;
}> {
  const start = Date.now();
  const maxExperts = config.maxExperts || (config.strategic ? 12 : 8);
  
  // Smart expert selection
  const selectedExperts = detectRelevantExperts(question, {
    maxExperts,
    strategic: config.strategic
  });
  
  // Organize into leads and supporting experts
  const leadDomains = selectDomainLeads(selectedExperts);
  const supportingDomains = selectedExperts.filter(e => !leadDomains.includes(e));
  
  console.log(`[HIERARCHICAL] Domain leads: ${leadDomains.join(", ")}`);
  console.log(`[HIERARCHICAL] Supporting experts: ${supportingDomains.join(", ")}`);
  
  // Parallel execution with different priorities
  const [leadsResult, supportingResult] = await Promise.allSettled([
    // Domain leads get higher priority and longer timeout
    runExpertCouncil(question, sourceContext, sourceCount, {
      experts: leadDomains,
      strategic: config.strategic,
      runId: config.runId,
      memory: true
    }),
    // Supporting experts get standard processing
    runExpertCouncil(question, sourceContext, sourceCount, {
      experts: supportingDomains,
      strategic: false, // Standard processing for supporting
      runId: config.runId,
      memory: true
    })
  ]);
  
  const domainLeads = leadsResult.status === 'fulfilled' ? leadsResult.value.analyses : [];
  const supportingExperts = supportingResult.status === 'fulfilled' ? supportingResult.value.analyses : [];
  
  const totalCost = (leadsResult.status === 'fulfilled' ? leadsResult.value.totalCostUsd : 0) +
                    (supportingResult.status === 'fulfilled' ? supportingResult.value.totalCostUsd : 0);
  const totalDuration = Date.now() - start;
  
  return {
    domainLeads,
    supportingExperts,
    totalCost,
    totalDuration
  };
}

/**
 * Interdisciplinary Analysis - Cross-domain insights
 */
export async function analyzeInterdisciplinary(
  domainLeads: ExpertAnalysis[],
  supportingExperts: ExpertAnalysis[]
): Promise<{
  connections: string[];
  conflicts: string[];
  synergies: string[];
}> {
  const allExperts = [...domainLeads, ...supportingExperts];
  
  if (allExperts.length < 2) {
    return { connections: [], conflicts: [], synergies: [] };
  }
  
  // Build interdisciplinary context
  const expertSummaries = allExperts.map(expert => 
    `### ${expert.expertName} (${expert.expertId})
Key Findings: ${expert.keyFindings.join("; ")}
Confidence: ${expert.confidence}%
Methodology: ${expert.methodology_critique.slice(0, 200)}...
`
  ).join("\n\n");
  
  const prompt = `Analyze the interdisciplinary relationships between these expert analyses:

${expertSummaries}

Identify and categorize:
1. CONNECTIONS: Where do different domains reinforce each other?
2. CONFLICTS: Where do different domains disagree or contradict?
3. SYNERGIES: What novel insights emerge from combining domains?

Format as JSON with connections, conflicts, synergies arrays.`;

  try {
    const response = await callLLM({
      messages: [
        {
          role: "system",
          content: "You are an expert in interdisciplinary research synthesis. Identify cross-domain connections, conflicts, and synergies."
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.3,
      maxTokens: 1000,
      model: "gpt-4-turbo-preview",
      enableCache: true,
    });
    
    const result = JSON.parse(response.content);
    return {
      connections: result.connections || [],
      conflicts: result.conflicts || [],
      synergies: result.synergies || []
    };
    
  } catch (error) {
    console.error("Interdisciplinary analysis failed:", error);
    return {
      connections: ["Interdisciplinary analysis failed"],
      conflicts: [],
      synergies: []
    };
  }
}

// ============================================================================
// ENHANCED SYNTHESIS DIRECTOR
// ============================================================================

export async function runEnhancedSynthesis(
  question: string,
  domainLeads: ExpertAnalysis[],
  supportingExperts: ExpertAnalysis[],
  interdisciplinary: { connections: string[]; conflicts: string[]; synergies: string[] },
  evidenceGrade: any,
  config: CouncilConfig
): Promise<EnhancedSynthesisReport> {
  const start = Date.now();
  
  // Build comprehensive synthesis context
  const leadsContext = domainLeads.map(lead => 
    `### ${lead.expertName} (Domain Lead: ${lead.expertId})
Confidence: ${lead.confidence}%
Findings: ${lead.keyFindings.join("; ")}
Implications: ${lead.implications.join("; ")}
Blind spots: ${lead.blind_spots.join("; ")}`
  ).join("\n\n");
  
  const supportingContext = supportingExperts.length > 0 ? 
    supportingExperts.map(expert => 
      `### ${expert.expertName} (${expert.expertId})
Confidence: ${expert.confidence}%
Key insights: ${expert.keyFindings.slice(0, 2).join("; ")}`
    ).join("\n\n") : "No supporting experts";
  
  const interdisciplinaryContext = `
### Interdisciplinary Analysis
Connections: ${interdisciplinary.connections.join("; ")}
Conflicts: ${interdisciplinary.conflicts.join("; ")}
Synergies: ${interdisciplinary.synergies.join("; ")}
`;
  
  const prompt = `Synthesize this comprehensive expert analysis into a unified report:

QUESTION: ${question}

=== DOMAIN LEADS ===
${leadsContext}

=== SUPPORTING EXPERTS ===
${supportingContext}

=== INTERDISCIPLINARY INSIGHTS ===
${interdisciplinaryContext}

=== EVIDENCE QUALITY ===
Overall Level: ${evidenceGrade.overallLevel}/5
Confidence: ${evidenceGrade.confidence}%

Provide enhanced synthesis including:
1. Overall consensus and key disagreements
2. Domain-specific consensus levels
3. Interdisciplinary connections and conflicts
4. Evidence quality assessment by domain
5. Tiered recommendations (immediate/short-term/long-term/research)
6. Overall confidence assessment

Format as JSON matching EnhancedSynthesisReport interface.`;

  try {
    const response = await callLLM({
      messages: [
        {
          role: "system",
          content: "You are a synthesis director specializing in integrating multi-domain expert analysis. Provide structured, actionable synthesis with clear confidence levels."
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.2,
      maxTokens: 3000,
      model: "gpt-4-turbo-preview",
      enableCache: true,
    });
    
    const synthesisData = JSON.parse(response.content);
    const duration = Date.now() - start;
    
    // Ensure required structure
    return {
      consensus: synthesisData.consensus || "Consensus synthesis unavailable",
      disagreements: synthesisData.disagreements || "Disagreements analysis unavailable",
      confidence: synthesisData.confidence || 50,
      domainLeads: domainLeads.map(lead => ({
        domain: lead.expertId,
        leadExpert: lead,
        consensusLevel: synthesisData.domainConsensus?.[lead.expertId] || lead.confidence
      })),
      interdisciplinary,
      evidenceQuality: {
        overallLevel: evidenceGrade.overallLevel,
        domainBreakdown: synthesisData.evidenceQuality?.domainBreakdown || {},
        confidence: evidenceGrade.confidence
      },
      recommendations: {
        immediate: synthesisData.recommendations?.immediate || [],
        shortTerm: synthesisData.recommendations?.shortTerm || [],
        longTerm: synthesisData.recommendations?.longTerm || [],
        research: synthesisData.recommendations?.research || []
      },
      totalCostUsd: 0, // Calculated at higher level
      totalDurationMs: duration,
      expertCount: domainLeads.length + supportingExperts.length
    };
    
  } catch (error) {
    console.error("Enhanced synthesis failed:", error);
    
    // Fallback synthesis
    return {
      consensus: "Enhanced synthesis failed - manual review required",
      disagreements: "Unable to analyze disagreements",
      confidence: 30,
      domainLeads: domainLeads.map(lead => ({
        domain: lead.expertId,
        leadExpert: lead,
        consensusLevel: lead.confidence
      })),
      interdisciplinary,
      evidenceQuality: {
        overallLevel: evidenceGrade.overallLevel,
        domainBreakdown: {},
        confidence: evidenceGrade.confidence
      },
      recommendations: {
        immediate: ["Manual review required"],
        shortTerm: [],
        longTerm: [],
        research: []
      },
      totalCostUsd: 0,
      totalDurationMs: Date.now() - start,
      expertCount: domainLeads.length + supportingExperts.length
    };
  }
}

// ============================================================================
// MAIN ENHANCED HARVARD COUNCIL FUNCTION
// ============================================================================

export async function runEnhancedHarvardCouncil(
  question: string,
  sourceContext: string,
  sourceCount: number,
  options?: CouncilConfig
): Promise<EnhancedSynthesisReport> {
  const start = Date.now();
  // More conservative defaults - only use more experts for complex topics
  const config = {
    maxExperts: options?.strategic ? 6 : 4, // Reduced from 12 to 6/4
    timeoutMs: options?.strategic ? 240000 : 120000, // 4min/2min
    enableHierarchical: true,
    enableInterdisciplinary: options?.strategic, // Only for strategic
    strategic: true,
    ...options
  };
  
  console.log(`\n${"━".repeat(80)}`);
  console.log(`  🎓 ENHANCED HARVARD COUNCIL — ${config.maxExperts} PhD Expert Analysis`);
  console.log(`  Question: "${question.slice(0, 80)}..."`);
  console.log(`  Mode: ${config.strategic ? 'Strategic' : 'Standard'} | Hierarchical: ${config.enableHierarchical}`);
  console.log(`${"━".repeat(80)}\n`);
  
  let totalCost = 0;
  
  try {
    // Phase 1: Load-balanced expert analysis
    const { domainLeads, supportingExperts, totalCost: analysisCost, totalDuration: analysisDuration } = 
      await runLoadBalancedCouncil(question, sourceContext, sourceCount, config);
    
    totalCost += analysisCost;
    
    // Phase 2: Evidence grading (parallel with interdisciplinary)
    const [evidenceGrade, interdisciplinary] = await Promise.allSettled([
      gradeEvidence(question, sourceContext, sourceCount),
      config.enableInterdisciplinary ? 
        analyzeInterdisciplinary(domainLeads, supportingExperts) : 
        Promise.resolve({ connections: [], conflicts: [], synergies: [] })
    ]);
    
    const evidenceResult = evidenceGrade.status === 'fulfilled' ? evidenceGrade.value : null;
    const interdisciplinaryResult = interdisciplinary.status === 'fulfilled' ? interdisciplinary.value : { connections: [], conflicts: [], synergies: [] };
    
    // Phase 3: Enhanced synthesis
    const synthesis = await runEnhancedSynthesis(
      question,
      domainLeads,
      supportingExperts,
      interdisciplinaryResult,
      evidenceResult || { overallLevel: 3, confidence: 50 },
      config
    );
    
    // Phase 4: Adversarial review (optional, for high-stakes analysis)
    let reviewResults = null;
    if (config.strategic && domainLeads.length + supportingExperts.length >= 6) {
      try {
        reviewResults = await runAdversarialReview(question, synthesis, {
          reviewers: 3,
          strictness: 'high'
        });
      } catch (reviewError) {
        console.warn("Adversarial review failed:", reviewError);
      }
    }
    
    const totalDuration = Date.now() - start;
    synthesis.totalCostUsd = totalCost;
    synthesis.totalDurationMs = totalDuration;
    
    console.log(`[ENHANCED COUNCIL] Completed in ${totalDuration}ms | Cost: $${totalCost.toFixed(4)}`);
    console.log(`[ENHANCED COUNCIL] Domain leads: ${domainLeads.length} | Supporting: ${supportingExperts.length}`);
    
    return synthesis;
    
  } catch (error) {
    console.error("Enhanced Harvard Council failed:", error);
    throw new Error(`Enhanced council execution failed: ${error.message}`);
  }
}

// ============================================================================
// PERFORMANCE MONITORING
// ============================================================================

export interface CouncilMetrics {
  totalExperts: number;
  domainLeads: number;
  supportingExperts: number;
  totalDurationMs: number;
  totalCostUsd: number;
  averageConfidence: number;
  interdisciplinaryConnections: number;
  conflicts: number;
  synergies: number;
}

export function calculateCouncilMetrics(synthesis: EnhancedSynthesisReport): CouncilMetrics {
  const allAnalyses = [
    ...synthesis.domainLeads.map(lead => lead.leadExpert),
  ];
  
  const averageConfidence = allAnalyses.length > 0 
    ? allAnalyses.reduce((sum, analysis) => sum + analysis.confidence, 0) / allAnalyses.length
    : 0;
  
  return {
    totalExperts: synthesis.expertCount,
    domainLeads: synthesis.domainLeads.length,
    supportingExperts: synthesis.expertCount - synthesis.domainLeads.length,
    totalDurationMs: synthesis.totalDurationMs,
    totalCostUsd: synthesis.totalCostUsd,
    averageConfidence,
    interdisciplinaryConnections: synthesis.interdisciplinary.connections.length,
    conflicts: synthesis.interdisciplinary.conflicts.length,
    synergies: synthesis.interdisciplinary.synergies.length,
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export type { 
  EnhancedSynthesisReport, 
  CouncilConfig, 
  CouncilMetrics 
};
