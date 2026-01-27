/**
 * NomosX Publication Generator Agent
 * 
 * Generates publication content from signals and sources
 * Uses templates to enforce structure and constraints
 */

import OpenAI from "openai";
import { prisma } from "@/lib/db";
import { 
  PublicationType,
  PublicationTemplate,
  CriticalLoopResult
} from "@/lib/think-tank/types";
import { getTemplate, PUBLICATION_TEMPLATES } from "@/lib/think-tank/templates";
import { runCriticalLoop } from "./critical-loop";
import { recordPublication } from "./cadence-enforcer";

const ai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const MODEL = "gpt-4o";

// ============================================================================
// TYPES
// ============================================================================

interface PublicationGeneratorInput {
  signalId: string;
  publicationType?: PublicationType;
}

interface PublicationGeneratorOutput {
  publicationId: string;
  title: string;
  html: string;
  wordCount: number;
  trustScore: number;
  criticalLoopResult: CriticalLoopResult;
  success: boolean;
  error?: string;
}

// ============================================================================
// TEMPLATE SELECTION
// ============================================================================

function selectPublicationType(signalType: string): PublicationType {
  switch (signalType) {
    case "DATA_RELEASE":
      return "DATA_NOTE";
    case "POLICY_CHANGE":
      return "POLICY_NOTE";
    case "CONTRADICTION":
    case "TREND_BREAK":
    case "METHODOLOGY_SHIFT":
      return "RESEARCH_BRIEF";
    case "NEW_EVIDENCE":
    default:
      return "RESEARCH_BRIEF";
  }
}

// ============================================================================
// CONTENT GENERATION
// ============================================================================

async function generateContent(
  signal: any,
  sources: any[],
  template: PublicationTemplate,
  vertical: any
): Promise<{ title: string; html: string; wordCount: number }> {
  console.log(`[PUBLICATION_GENERATOR] Generating ${template.type} content...`);
  
  // Build source context
  const sourceContext = sources.map((s, i) => {
    const authors = s.authors?.map((sa: any) => sa.author?.name).filter(Boolean).slice(0, 3).join(", ") || "N/A";
    return `[SRC-${i + 1}] ${s.title}
Authors: ${authors}
Year: ${s.year || "N/A"}
Provider: ${s.provider}
Quality: ${s.qualityScore || 0}/100
Abstract: ${(s.abstract || "").slice(0, 500)}...`;
  }).join("\n\n");
  
  // Build section instructions
  const sectionInstructions = template.sections.map(section => {
    return `## ${section.title} (${section.id})
- Required: ${section.required ? "Yes" : "No"}
- Word limit: ${section.minWords || 0}-${section.maxWords || 500} words
- Claim types allowed: ${section.claimTypes.join(", ")}`;
  }).join("\n\n");
  
  const prompt = `You are NomosX Publication Generator — Elite think tank analyst.

SIGNAL: ${signal.title}
VERTICAL: ${vertical.name}
PUBLICATION TYPE: ${template.type}

SOURCES (${sources.length}):
${sourceContext}

TEMPLATE STRUCTURE:
${sectionInstructions}

TOTAL WORD LIMIT: ${template.totalMinWords}-${template.totalMaxWords} words
MINIMUM SOURCES TO CITE: ${template.minSources}

FORBIDDEN PHRASES (never use):
${template.forbiddenPhrases.slice(0, 10).join(", ")}

CRITICAL RULES:
1. EVERY factual claim MUST cite [SRC-N] where N = source number
2. Use hedged language for interpretations ("suggests", "indicates", "may")
3. Never claim certainty without strong evidence
4. Include limitations and uncertainty
5. Be specific with numbers and data
6. Write in ${signal.summary?.match(/[àâäéèêëïîôùûüÿæœç]/i) ? 'FRENCH' : 'ENGLISH'}

OUTPUT FORMAT:
Return JSON with:
{
  "title": "Specific, descriptive title",
  "sections": {
    "section_id": "HTML content for this section"
  }
}

Generate premium, institutional-grade content.`;

  try {
    const response = await ai.chat.completions.create({
      model: MODEL,
      temperature: 0.3,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    // Build HTML from sections
    const html = buildHtml(result, template, sources, vertical, signal);
    const wordCount = countWords(html);
    
    console.log(`[PUBLICATION_GENERATOR] Generated ${wordCount} words`);
    
    return {
      title: result.title || signal.title,
      html,
      wordCount
    };
  } catch (error: any) {
    console.error(`[PUBLICATION_GENERATOR] Generation failed: ${error.message}`);
    throw error;
  }
}

// ============================================================================
// HTML BUILDER
// ============================================================================

function buildHtml(
  content: any,
  template: PublicationTemplate,
  sources: any[],
  vertical: any,
  signal: any
): string {
  const sections = content.sections || {};
  const title = content.title || signal.title;
  
  let html = `<article class="nomosx-publication ${template.type.toLowerCase().replace(/_/g, '-')}">
  <header>
    <div class="meta">
      <span class="vertical" style="color: ${vertical.color || '#22D3EE'}">${vertical.icon || '📊'} ${vertical.name}</span>
      <span class="type">${formatPublicationType(template.type)}</span>
      <span class="date">${new Date().toISOString().split('T')[0]}</span>
    </div>
    <h1>${escapeHtml(title)}</h1>
  </header>
`;

  // Add each section
  for (const section of template.sections) {
    const sectionContent = sections[section.id];
    if (!sectionContent && !section.required) continue;
    
    html += `
  <section class="${section.id.replace(/_/g, '-')}">
    <h2>${section.title}</h2>
    ${sectionContent || '<p><em>Section non générée</em></p>'}
  </section>
`;
  }

  // Add bibliography
  html += `
  <footer class="bibliography">
    <h2>Sources</h2>
    <ol>
${sources.map((s, i) => {
  const authors = s.authors?.map((sa: any) => sa.author?.name).filter(Boolean).slice(0, 3).join(", ") || "N/A";
  return `      <li>[SRC-${i + 1}] ${escapeHtml(authors)} (${s.year || "N/A"}). ${escapeHtml(s.title)}. <em>${s.provider}</em>.</li>`;
}).join("\n")}
    </ol>
  </footer>
</article>`;

  return html;
}

function formatPublicationType(type: string): string {
  const formats: Record<string, string> = {
    RESEARCH_BRIEF: "Research Brief",
    UPDATE_NOTE: "Update Note",
    DATA_NOTE: "Data Note",
    POLICY_NOTE: "Policy Note",
    DOSSIER: "Dossier"
  };
  return formats[type] || type;
}

function escapeHtml(text: string): string {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function countWords(html: string): number {
  const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return text.split(" ").filter(w => w.length > 0).length;
}

// ============================================================================
// MAIN GENERATOR
// ============================================================================

export async function generatePublication(
  input: PublicationGeneratorInput
): Promise<PublicationGeneratorOutput> {
  console.log(`[PUBLICATION_GENERATOR] Starting for signal ${input.signalId}...`);
  
  // Fetch signal with vertical
  const signal = await prisma.signal.findUnique({
    where: { id: input.signalId },
    include: { vertical: true }
  });
  
  if (!signal) {
    return {
      publicationId: "",
      title: "",
      html: "",
      wordCount: 0,
      trustScore: 0,
      criticalLoopResult: {} as CriticalLoopResult,
      success: false,
      error: "Signal not found"
    };
  }
  
  // Fetch sources
  const sources = await prisma.source.findMany({
    where: { id: { in: signal.sourceIds } },
    include: {
      authors: { include: { author: true } },
      institutions: { include: { institution: true } }
    }
  });
  
  if (sources.length === 0) {
    return {
      publicationId: "",
      title: "",
      html: "",
      wordCount: 0,
      trustScore: 0,
      criticalLoopResult: {} as CriticalLoopResult,
      success: false,
      error: "No sources found"
    };
  }
  
  // Select publication type and template
  const pubType = input.publicationType || selectPublicationType(signal.signalType);
  const template = getTemplate(pubType);
  
  if (!template) {
    return {
      publicationId: "",
      title: "",
      html: "",
      wordCount: 0,
      trustScore: 0,
      criticalLoopResult: {} as CriticalLoopResult,
      success: false,
      error: `Template not found for ${pubType}`
    };
  }
  
  try {
    // Generate content
    const { title, html, wordCount } = await generateContent(
      signal,
      sources,
      template,
      signal.vertical
    );
    
    // Run critical loop
    const criticalLoopResult = await runCriticalLoop({
      draftHtml: html,
      sources
    });
    
    // Calculate trust score
    const trustScore = Math.round(
      criticalLoopResult.compositeScore * 0.6 +
      (sources.reduce((sum, s) => sum + (s.qualityScore || 0), 0) / sources.length) * 0.4
    );
    
    // Create publication
    const publication = await prisma.thinkTankPublication.create({
      data: {
        verticalId: signal.verticalId,
        signalId: signal.id,
        type: pubType,
        title,
        html,
        wordCount,
        trustScore,
        qualityScore: Math.round(sources.reduce((sum, s) => sum + (s.qualityScore || 0), 0) / sources.length),
        citationCoverage: 1.0, // TODO: Calculate actual coverage
        sourceIds: signal.sourceIds,
        criticalLoopResult: criticalLoopResult as any,
        publishedAt: criticalLoopResult.needsHumanReview ? null : new Date()
      }
    });
    
    // Record publication for cadence if published
    if (!criticalLoopResult.needsHumanReview) {
      await recordPublication(signal.verticalId);
      
      // Update signal status
      await prisma.signal.update({
        where: { id: signal.id },
        data: { status: "PUBLISHED" }
      });
    }
    
    console.log(`[PUBLICATION_GENERATOR] ✅ Created publication ${publication.id} (trust: ${trustScore}/100)`);
    
    return {
      publicationId: publication.id,
      title,
      html,
      wordCount,
      trustScore,
      criticalLoopResult,
      success: true
    };
    
  } catch (error: any) {
    console.error(`[PUBLICATION_GENERATOR] Failed: ${error.message}`);
    return {
      publicationId: "",
      title: "",
      html: "",
      wordCount: 0,
      trustScore: 0,
      criticalLoopResult: {} as CriticalLoopResult,
      success: false,
      error: error.message
    };
  }
}
