/**
 * QUERY ENHANCER
 * 
 * Transforms user queries into optimized search queries for academic APIs.
 * 
 * Features:
 * - Multi-language support (auto-detect, translate to English)
 * - Query expansion (synonyms, related terms)
 * - Multi-query generation (different perspectives)
 * - Domain-specific optimization
 * 
 * @example
 * input: "quels sont les impacts de l'IA sur le travail dans les 30 prochaines années ?"
 * output: {
 *   original: "quels sont...",
 *   language: "fr",
 *   translated: "what are the impacts of AI on work in the next 30 years?",
 *   enhanced: "artificial intelligence employment impact future labor market automation",
 *   variations: [
 *     "AI job displacement automation workforce",
 *     "artificial intelligence future of work employment trends",
 *     "automation labor market AI impact jobs"
 *   ],
 *   keywords: ["AI", "employment", "automation", "labor market", "future of work"]
 * }
 */

import OpenAI from "openai";
import { env } from "../env";

const ai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

export interface EnhancedQuery {
  original: string;
  language: string;
  translated: string; // Always English for academic APIs
  enhanced: string; // Optimized single query
  variations: string[]; // Alternative formulations
  keywords: string[]; // Core topic keywords
  topics: string[]; // Academic domains/fields
}

/**
 * Detect language of query
 */
function detectLanguage(text: string): string {
  // Simple heuristic (can be improved with proper language detection library)
  const frenchWords = ["quels", "sont", "les", "de", "dans", "sur", "pour", "avec", "comment", "pourquoi", "quelle"];
  const words = text.toLowerCase().split(/\s+/);
  const frenchCount = words.filter(w => frenchWords.includes(w)).length;
  
  return frenchCount >= 2 ? "fr" : "en";
}

/**
 * Enhance query using GPT-4 for academic search optimization
 */
export async function enhanceQuery(query: string): Promise<EnhancedQuery> {
  const language = detectLanguage(query);
  
  const prompt = `You are an expert at optimizing search queries for academic research databases (OpenAlex, Semantic Scholar, Crossref).

USER QUERY:
"${query}"

LANGUAGE DETECTED: ${language}

YOUR TASK:
Transform this query into optimized search queries for academic APIs.

RETURN THIS EXACT JSON STRUCTURE:
{
  "translated": "English translation of the query (if not already English)",
  "enhanced": "Single optimized query with key academic terms (concise, keyword-rich)",
  "variations": [
    "Alternative query formulation 1",
    "Alternative query formulation 2",
    "Alternative query formulation 3"
  ],
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "topics": ["academic_field1", "academic_field2", "academic_field3"]
}

RULES:
1. If query is in French, translate to English for academic APIs
2. Enhanced query should be concise, keyword-rich (not a full sentence)
3. Include synonyms and related terms in variations
4. Keywords should be core concepts (5-10 terms)
5. Topics should be broad academic fields (economics, computer science, sociology, etc.)
6. Focus on terms that would appear in academic paper titles/abstracts

EXAMPLES:

Input: "quels sont les impacts de l'IA sur le travail dans les 30 prochaines années ?"
Output:
{
  "translated": "what are the impacts of AI on work in the next 30 years?",
  "enhanced": "artificial intelligence employment impact future labor market automation workforce transformation",
  "variations": [
    "AI job displacement automation technological unemployment",
    "artificial intelligence future of work employment trends job creation",
    "machine learning labor market impact workforce automation skills"
  ],
  "keywords": ["artificial intelligence", "employment", "automation", "labor market", "future of work", "job displacement", "technological unemployment"],
  "topics": ["economics", "labor economics", "computer science", "sociology", "public policy"]
}

Input: "carbon tax effectiveness climate change"
Output:
{
  "translated": "carbon tax effectiveness climate change",
  "enhanced": "carbon pricing policy climate mitigation emissions reduction tax effectiveness",
  "variations": [
    "carbon tax environmental policy greenhouse gas emissions",
    "carbon pricing mechanism climate policy effectiveness economic impact",
    "emission trading carbon levy climate change mitigation"
  ],
  "keywords": ["carbon tax", "carbon pricing", "climate policy", "emissions reduction", "environmental economics"],
  "topics": ["environmental economics", "climate science", "public policy", "energy economics"]
}

Now process the user query.`;

  try {
    const response = await ai.chat.completions.create({
      model: env.OPENAI_MODEL,
      temperature: 0.1, // Low temp for consistency
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const parsed = JSON.parse(response.choices[0].message.content || "{}");

    return {
      original: query,
      language,
      translated: parsed.translated || query,
      enhanced: parsed.enhanced || query,
      variations: parsed.variations || [],
      keywords: parsed.keywords || [],
      topics: parsed.topics || [],
    };
  } catch (error: any) {
    console.error(`[QueryEnhancer] Failed: ${error.message}`);
    
    // Fallback: return original query
    return {
      original: query,
      language,
      translated: query,
      enhanced: query,
      variations: [],
      keywords: [],
      topics: [],
    };
  }
}

/**
 * Generate search queries from enhanced query
 * Returns: primary query + variations for multi-query search
 */
export function generateSearchQueries(enhanced: EnhancedQuery): string[] {
  return [
    enhanced.enhanced, // Primary optimized query
    ...enhanced.variations.slice(0, 2), // Top 2 variations
  ];
}

/**
 * Quick enhance (synchronous, rule-based fallback)
 * Used when LLM call fails or for fast preprocessing
 */
export function quickEnhance(query: string): { enhanced: string; keywords: string[] } {
  // Remove question words and punctuation
  const cleaned = query
    .toLowerCase()
    .replace(/\b(what|how|why|when|where|qui|quoi|comment|pourquoi|quand|où|quels|sont|les|de|la|le|des|dans|sur|pour|avec|est|ce|que)\b/gi, "")
    .replace(/[?!.,;:]/g, "")
    .trim();
  
  // Extract keywords (words > 3 chars)
  const keywords = cleaned
    .split(/\s+/)
    .filter(w => w.length > 3)
    .slice(0, 10);
  
  return {
    enhanced: cleaned,
    keywords,
  };
}
