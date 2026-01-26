/**
 * DIGEST Agent
 * Generates weekly/monthly summaries for topic subscriptions
 */

import OpenAI from "openai";
import { env } from "../env";
import { prisma } from "../db";

const ai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
const MODEL = env.OPENAI_MODEL;

export interface DigestOptions {
  topicId: string;
  period: string; // e.g., "2026-W03" or "2026-01"
  limit?: number;
}

/**
 * DIGEST Agent V2 - Production-grade weekly/monthly summaries
 * 
 * STRUCTURE :
 * 1. Breakthrough (novelty > 80)
 * 2. High Impact (citations > 100)
 * 3. Emerging (année courante, <5 citations)
 * 4. French Perspective (HAL/theses.fr)
 * 5. Signals (tendances émergentes)
 * 
 * Note: limit is capped at 10 to prevent LLM token overload and maintain
 * digest readability. Larger research projects should use separate ANALYST
 * agents with custom scope.
 */
export async function generateDigest(options: DigestOptions): Promise<string> {
  const { topicId, period, limit = 10 } = options;
  
  // Enforce maximum limit for safety and performance
  const safeLimit = Math.min(limit || 10, 10);
  
  // Get topic
  const topic = await prisma.topic.findUnique({ where: { id: topicId } });
  if (!topic) {
    throw new Error(`Topic ${topicId} not found`);
  }
  
  console.log(`[DIGEST V2] Generating digest for "${topic.name}" (${period}), limit: ${safeLimit}`);
  
  // Get recent sources for this period (last 7 days)
  const since = new Date();
  since.setDate(since.getDate() - 7);
  
  const allSources = await prisma.source.findMany({
    where: {
      createdAt: { gte: since },
      OR: [
        { title: { contains: topic.query, mode: "insensitive" } },
        { abstract: { contains: topic.query, mode: "insensitive" } },
        { topics: { hasSome: topic.tags } },
      ],
    },
    take: limit,
    orderBy: [{ qualityScore: "desc" }, { noveltyScore: "desc" }],
    include: {
      authors: { include: { author: true } },
    },
  });
  
  if (allSources.length === 0) {
    return `<div class="digest-empty">
      <h2>📭 Aucune nouvelle recherche</h2>
      <p>Pas de nouvelles publications pour "${topic.name}" cette semaine.</p>
      <p><small>Période : ${period}</small></p>
    </div>`;
  }
  
  console.log(`[DIGEST V2] Found ${allSources.length} sources, categorizing...`);
  
  // Catégoriser les sources
  const currentYear = new Date().getFullYear();
  const categories = {
    breakthrough: allSources.filter(s => (s.noveltyScore || 0) >= 80).slice(0, 1),
    highImpact: allSources.filter(s => s.citationCount && s.citationCount > 100).slice(0, 2),
    emerging: allSources.filter(s => 
      s.year === currentYear && 
      (!s.citationCount || s.citationCount < 5)
    ).slice(0, 2),
    french: allSources.filter(s => 
      s.provider === 'hal' || s.provider === 'thesesfr'
    ).slice(0, 1)
  };
  
  // Log catégories
  Object.entries(categories).forEach(([cat, sources]) => {
    console.log(`[DIGEST V2] ${cat}: ${sources.length} sources`);
  });
  
  // Construire contexte structuré
  const ctx = Object.entries(categories)
    .map(([cat, sources]) => {
      if (sources.length === 0) return '';
      
      return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CATEGORY: ${cat.toUpperCase()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${sources.map((s, i) => {
  const authors = s.authors?.map(sa => sa.author?.name).filter(Boolean).slice(0, 3).join(", ") || "N/A";
  
  return `[${cat.toUpperCase()}-${i+1}]
Title: ${s.title}
Authors: ${authors}
Year: ${s.year || "N/A"}
Provider: ${s.provider}
Quality: ${s.qualityScore || 0}/100 | Novelty: ${s.noveltyScore || 0}/100 | Citations: ${s.citationCount || 0}
URL: ${s.url || "N/A"}

Abstract: ${(s.abstract || "").slice(0, 400)}...`;
}).join("\n\n")}`;
    })
    .filter(Boolean)
    .join("\n");
  
  const prompt = `You are NomosX Digest Agent V2 — Professional research curator.

Create a STRUCTURED weekly digest for "${topic.name}" subscribers.

SOURCES CATEGORIZED:
${ctx}

STRUCTURE YOUR DIGEST:

1. **🔬 Breakthrough** (if any): Most novel research (noveltyScore ≥ 80)
   - What's groundbreaking?
   - Why it matters now
   - One key actionable insight
   - Source: [BREAKTHROUGH-N]

2. **📊 High Impact** (if any): Established research (citations > 100)
   - Core findings
   - Why still relevant
   - How it connects to current work
   - Source: [HIGHIMPACT-N]

3. **🌱 Emerging** (if any): Fresh research (current year, <5 citations)
   - Early signals
   - Potential implications
   - Watch this space
   - Source: [EMERGING-N]

4. **🇫🇷 French Perspective** (if any): Francophone research
   - Unique angle or context
   - French institutions/authors
   - European perspective
   - Source: [FRENCH-N]

5. **🎯 Signals**: Cross-cutting trends
   - Patterns across this week's research
   - Methodological shifts
   - Emerging themes
   - What to watch next week

STYLE:
- Professional but engaging
- Bullet points and short paragraphs
- "Why it matters" for each highlight
- Actionable insights, not just summaries
- Email-safe HTML with good typography
- Under 600 words total
- Use emojis for section headers (🔬📊🌱🇫🇷🎯)

LANGUAGE: ${topic.name.match(/[àâäéèêëïîôùûüÿæœç]/i) ? 'FRENCH' : 'ENGLISH'}

IMPORTANT:
- If a category is empty, skip it gracefully
- Focus on categories with content
- Always include the "Signals" section to synthesize trends

Return clean HTML (no markdown, no code blocks).`;
  
  try {
    const response = await ai.chat.completions.create({
      model: MODEL,
      temperature: 0.3,
      messages: [{ role: "user", content: prompt }],
    });
    
    const html = response.choices[0].message.content || "";
    console.log(`[DIGEST V2] ✅ Generated ${Math.round(html.length / 1000)}KB digest`);
    return html;
    
  } catch (error: any) {
    console.error(`[DIGEST V2] Generation failed: ${error.message}`);
    throw error;
  }
}

export async function createDigest(options: DigestOptions): Promise<string> {
  const { topicId, period } = options;
  
  // Check if digest already exists
  const existing = await prisma.digest.findUnique({
    where: { topicId_period: { topicId, period } },
  });
  
  if (existing) {
    return existing.id;
  }
  
  // Generate
  const html = await generateDigest(options);
  
  // Get sources used
  const since = new Date();
  since.setDate(since.getDate() - 7);
  
  const sources = await prisma.source.findMany({
    where: { createdAt: { gte: since } },
    select: { id: true },
    take: options.limit || 10,
  });
  
  const digest = await prisma.digest.create({
    data: {
      topicId,
      subject: `NomosX Digest: ${period}`,
      html,
      period,
      sources: sources.map((s) => s.id),
    },
  });
  
  return digest.id;
}
