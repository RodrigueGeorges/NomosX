/**
 * ANALYST Agent
 * Synthesizes research into decision-ready analysis with:
 * - Consensus and disagreements
 * - Debate (pro/con)
 * - What would change our mind
 * - Implications and risks
 */

import { callLLM } from '../llm/unified-llm';
import Sentry from '@sentry/nextjs';
import { AgentRole,assertPermission } from '../governance/index';

export interface AnalysisOutput {
  title: string;
  summary: string;
  consensus: string;
  disagreements: string;
  debate: {
    pro: string;
    con: string;
    synthesis: string;
  };
  evidence: string;
  implications: string;
  risks: string;
  open_questions: string;
  what_changes_mind: string;
}

export async function analystAgent(
  question: string,
  sources: any[],
  readings?: any[]
): Promise<AnalysisOutput> {
  // Governance: Assert ANALYST permissions
  assertPermission(AgentRole.ANALYST, "write:analysis");
  
  // Build ULTRA-STRUCTURED context from sources + readings
  const avgQuality = Math.round(sources.reduce((sum, s) => sum + (s.qualityScore || 0), 0) / sources.length);
  
  const ctx = sources
    .map((s: any, i: number) => {
      const reading = readings?.[i];
      const authors = (s.authors || [])
        .slice(0, 3)
        .map((a: any) => {
          if (!a || typeof a !== 'object') return null;
          const name = a.author?.name || a.name;
          return name ? String(name).trim() : null;
        })
        .filter((n: any): n is string => n !== null && n.length > 0) || [];
      
      return `[SRC-${i + 1}] ${s.provider.toUpperCase()} | Quality: ${s.qualityScore || 0}/100 | Citations: ${s.citationCount || 0}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Title: ${s.title}
Authors: ${authors.join(", ") || "N/A"}
Year: ${s.year || "N/A"}
Provider: ${s.provider}

${reading && reading.confidence !== 'low' ? `KEY CLAIMS:
${reading.claims?.map((c: string, i: number) => `  ${i+1}. ${c}`).join("\n") || "  • None extracted"}

METHODS:
${reading.methods?.map((m: string, i: number) => `  ${i+1}. ${m}`).join("\n") || "  • None extracted"}

RESULTS:
${reading.results?.map((r: string, i: number) => `  ${i+1}. ${r}`).join("\n") || "  • None extracted"}

LIMITATIONS:
${reading.limitations?.map((l: string, i: number) => `  ${i+1}. ${l}`).join("\n") || "  • None stated"}

CONFIDENCE: ${reading.confidence}` : `ABSTRACT PREVIEW:
${(s.abstract || "").slice(0, 800)}...

[No detailed extraction available for this source]`}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
    })
    .join("\n\n");

  const prompt = `You are NomosX Analyst V2 — Elite strategic intelligence analyst.

CONTEXT: You have access to ${sources.length} HIGH-QUALITY sources (avg quality: ${avgQuality}/100), pre-analyzed by READER agent.

QUESTION TO ANALYZE:
"${question}"

ANALYZED SOURCES (with extracted claims/methods/results):
${ctx}

YOUR MISSION:
Transform this pre-analyzed research into decision-ready strategic intelligence.

CRITICAL RULES:
1. LEVERAGE the extracted claims/methods/results (don't just summarize abstracts)
2. EVERY claim MUST cite [SRC-N] where N = source number above
3. SYNTHESIZE across sources (don't just list)
4. Be SPECIFIC about methodology quality (note confidence levels)
5. HIGHLIGHT contradictions between sources explicitly
6. If sources disagree on methods/results, explore WHY
7. Assess STRENGTH of evidence (sample sizes, methods, limitations)
8. Provide ACTIONABLE implications, not generic advice
9. Use SPECIFIC numbers and data points from sources
10. Compare QUALITY scores when assessing reliability

ENHANCED FORMAT:
Return JSON with these sections:

{
  "title": "Precise, specific title (not generic)",
  
  "summary": "3-4 sentences answering the core question. Include:
    - Direct answer with confidence level
    - Number of sources analyzed
    - Key evidence strength indicator
    - Main actionable insight
    All with [SRC-*] citations.",
  
  "consensus": "What do sources AGREE on?
    - List specific claims with [SRC-*] citations
    - Note strength of consensus (all sources? majority?)
    - Indicate quality of evidence (methods, sample sizes)
    - Cite specific data points and findings",
  
  "disagreements": "Where do sources CONFLICT?
    - Specific contradictions with [SRC-*] citations
    - Analyze WHY they disagree (methods? populations? timing?)
    - Which evidence is stronger and why?
    - Compare quality scores when relevant",
  
  "debate": {
    "pro": "Evidence SUPPORTING position X:
      - Specific claims with [SRC-*]
      - Methods used and their quality
      - Strength of results (effect sizes, significance)
      - Cite specific numbers and findings",
    
    "con": "Evidence AGAINST or for alternative view:
      - Counter-claims with [SRC-*]
      - Methodological differences
      - Limitations that weaken pro arguments
      - Cite specific contradicting data",
    
    "synthesis": "How to reconcile:
      - Conditions under which each view holds
      - Meta-insights from comparing methodologies
      - Practical recommendations balancing both
      - Nuanced position based on evidence quality"
  },
  
  "evidence": "CRITICAL ASSESSMENT:
    - Overall quality score (1-10) with justification
    - Breakdown by methodology (RCT? observational? theoretical?)
    - Sample size adequacy (cite specific numbers)
    - Replication status
    - Known limitations across sources
    - Publication bias concerns
    - Confidence levels from READER agent
    All with [SRC-*] citations.",
  
  "implications": "ACTIONABLE for decision-makers:
    - Immediate actions supported by evidence
    - Medium-term considerations
    - Long-term strategic positioning
    - Risk mitigation strategies
    - Specific recommendations with confidence levels
    All with [SRC-*] citations.",
  
  "risks": "WHAT COULD GO WRONG:
    - Methodological limitations across sources
    - Generalizability concerns
    - Gaps in current evidence
    - Potential negative outcomes
    - Uncertainty quantification
    - Known biases or conflicts
    With [SRC-*] citations.",
  
  "open_questions": "RESEARCH GAPS:
    - Critical unanswered questions
    - Methodological improvements needed
    - Populations/contexts not studied
    - Contradictions needing resolution
    - Future research directions",
  
  "what_changes_mind": "FALSIFIABILITY:
    - Specific findings that would overturn this analysis
    - Studies that would resolve key uncertainties
    - Evidence thresholds for changing recommendations
    - What would constitute 'strong' counter-evidence"
}

LANGUAGE: Write in ${question.match(/[àâäéèêëïîôùûüÿæœç]/i) ? 'FRENCH' : 'ENGLISH'}.

Be intellectually rigorous. Decision-makers depend on this analysis.`;

  try {
    // Call unified LLM service with automatic caching and fallback
    const response = await callLLM({
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
      jsonMode: true,
      maxTokens: 4000,
      enableCache: true, // Enable Redis cache
    });

    console.log(
      `✅ [Analyst] Success | ${response.provider} | $${response.costUsd.toFixed(4)} | Cached: ${response.cached}`
    );

    const analysis = JSON.parse(response.content) as AnalysisOutput;
    
    // Validate required fields exist and are non-empty
    const required: (keyof AnalysisOutput)[] = ['title', 'summary', 'consensus', 'debate'];
    const missing = required.filter((k: keyof AnalysisOutput) => {
      const val = analysis[k];
      if (k === 'debate') return !val || typeof val !== 'object' || !val.pro || !val.con;
      return !val || (typeof val === 'string' && !val.trim());
    });
    
    if (missing.length > 0) {
      console.warn(`[Analyst] Missing required fields: ${missing.join(', ')}. Retrying with stricter prompt.`);
      throw new Error(`Analysis validation failed: missing fields ${missing.join(', ')}`);
    }
    
    return analysis;
  } catch (error: any) {
    console.error(`[Analyst] Failed: ${error.message}`);
    
    // Log to Sentry
    Sentry.captureException(error, {
      tags: {
        agent: "analyst",
        question,
        sourceCount: sources.length,
      },
      contexts: {
        analyst: {
          question,
          sourceCount: sources.length,
          avgQuality,
        },
      },
    });
    
    return {
      title: "Analysis Failed",
      summary: `Error: ${error.message}`,
      consensus: "",
      disagreements: "",
      debate: { pro: "", con: "", synthesis: "" },
      evidence: "",
      implications: "",
      risks: "",
      open_questions: "",
      what_changes_mind: "",
    };
  }
}
