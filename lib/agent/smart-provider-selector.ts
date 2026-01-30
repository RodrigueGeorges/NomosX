/**
 * Smart Provider Selector
 * 
 * Intelligently selects the best providers and quantities
 * based on domain and question complexity
 * 
 * Best Practices 2026: Context-aware, intelligent defaults
 */

// Providers actually implemented in the pipeline
export type Provider = "openalex" | "crossref" | "semanticscholar" | "thesesfr";

export interface SmartSelection {
  providers: Provider[];
  quantity: number;
  reasoning: string;
  estimatedTime: string;
  estimatedSources: number;
}

/**
 * Domain → best IMPLEMENTED providers mapping
 * OpenAlex: Best general coverage (200M+ works)
 * Crossref: DOI metadata, good coverage
 * Semantic Scholar: AI-focused, citations
 * ThesesFr: French theses
 */
const DOMAIN_PROVIDER_MAP: Record<string, Provider[]> = {
  // Health & Medicine
  health: ["openalex", "crossref", "semanticscholar"],
  medical: ["openalex", "crossref", "semanticscholar"],
  
  // Exact sciences
  physics: ["openalex", "semanticscholar"],
  mathematics: ["openalex", "semanticscholar"],
  computer_science: ["semanticscholar", "openalex"],
  
  // Social sciences & Economics
  economics: ["openalex", "crossref"],
  finance: ["openalex", "crossref"],
  social_sciences: ["openalex", "crossref"],
  
  // Environment & Climate
  climate: ["openalex", "crossref"],
  environment: ["openalex", "crossref"],
  
  // Politics & Law
  politics: ["openalex", "crossref"],
  law: ["openalex", "crossref"],
  
  // Technology & Innovation
  technology: ["semanticscholar", "openalex"],
  ai: ["semanticscholar", "openalex"],
  
  // France specific
  france: ["openalex", "thesesfr", "crossref"],
  
  // Default (multi-disciplinary) - OpenAlex priority for best coverage
  default: ["openalex", "crossref", "semanticscholar"],
};

/**
 * Keywords by domain (French + English)
 */
const DOMAIN_KEYWORDS: Record<string, string[]> = {
  health: ["santé", "médical", "maladie", "thérapie", "patient", "health", "medical", "disease", "therapy", "clinical"],
  physics: ["physique", "quantum", "particule", "énergie", "physics", "quantum", "particle", "energy"],
  mathematics: ["mathématique", "théorème", "équation", "algorithm", "mathematics", "theorem", "equation"],
  economics: ["économie", "économique", "marché", "commerce", "economics", "market", "trade", "fiscal"],
  finance: ["finance", "financier", "investissement", "banque", "bourse", "investment", "banking", "stock"],
  climate: ["climat", "climatique", "carbone", "émission", "réchauffement", "climate", "carbon", "emission", "warming"],
  environment: ["environnement", "écologie", "pollution", "biodiversité", "environment", "ecology", "pollution", "biodiversity"],
  politics: ["politique", "gouvernement", "démocratie", "élection", "politics", "government", "democracy", "election"],
  law: ["droit", "juridique", "loi", "justice", "legal", "law", "justice", "regulation"],
  technology: ["technologie", "numérique", "digital", "innovation", "technology", "digital", "innovation"],
  ai: ["intelligence artificielle", "ia", "machine learning", "deep learning", "ai", "artificial intelligence", "neural"],
  computer_science: ["informatique", "algorithme", "programmation", "software", "computer science", "algorithm", "programming"],
  social_sciences: ["sociologie", "psychologie", "anthropologie", "sociology", "psychology", "anthropology"],
};

/**
 * Detects the main domain of the question
 */
export function detectDomain(question: string): string {
  const q = question.toLowerCase();
  
  // Score per domain
  const scores: Record<string, number> = {};
  
  for (const [domain, keywords] of Object.entries(DOMAIN_KEYWORDS)) {
    scores[domain] = 0;
    for (const keyword of keywords) {
      if (q.includes(keyword.toLowerCase())) {
        scores[domain] += 1;
      }
    }
  }
  
  // Find domain with max score
  let maxScore = 0;
  let bestDomain = "default";
  
  for (const [domain, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      bestDomain = domain;
    }
  }
  
  return maxScore > 0 ? bestDomain : "default";
}

/**
 * Estimates question complexity
 */
export function estimateComplexity(question: string): "simple" | "moderate" | "complex" {
  const length = question.length;
  const hasMultipleQuestions = (question.match(/\?/g) || []).length > 1;
  const hasComparison = /versus|vs|contre|comparaison|différence/i.test(question);
  const hasMultipleConcepts = question.split(/et|ou|,/).length > 3;
  
  if (hasMultipleQuestions || hasComparison || hasMultipleConcepts || length > 200) {
    return "complex";
  } else if (length > 100 || hasMultipleConcepts) {
    return "moderate";
  } else {
    return "simple";
  }
}

/**
 * Intelligently selects providers and quantities
 */
export function selectSmartProviders(question: string): SmartSelection {
  // 1. Detect domain
  const domain = detectDomain(question);
  
  // 2. Select providers
  const providers = DOMAIN_PROVIDER_MAP[domain] || DOMAIN_PROVIDER_MAP.default;
  
  // 3. Estimate complexity
  const complexity = estimateComplexity(question);
  
  // 4. Adjust quantity based on complexity
  const baseQuantity = {
    simple: 12,
    moderate: 18,
    complex: 25,
  }[complexity];
  
  const quantityPerProvider = Math.ceil(baseQuantity / providers.length);
  
  // 5. Estimate time and sources
  const estimatedTime = {
    simple: "30-45s",
    moderate: "45-60s",
    complex: "60-90s",
  }[complexity];
  
  const estimatedSources = baseQuantity;
  
  // 6. Generate reasoning
  const domainLabel = {
    health: "Santé & Médecine",
    medical: "Médecine",
    physics: "Physique",
    mathematics: "Mathématiques",
    economics: "Économie",
    finance: "Finance",
    climate: "Climat & Environnement",
    environment: "Environnement",
    politics: "Politique",
    law: "Droit",
    technology: "Technologie",
    ai: "Intelligence Artificielle",
    computer_science: "Informatique",
    social_sciences: "Sciences Sociales",
    default: "Multi-disciplinaire",
  }[domain] || "Multi-disciplinaire";
  
  const providerLabels: Record<Provider, string> = {
    openalex: "OpenAlex",
    crossref: "CrossRef",
    semanticscholar: "Semantic Scholar",
    thesesfr: "Thèses.fr",
  };
  
  // Use max 3 providers for better results
  const selectedProviders = providers.slice(0, 3) as Provider[];
  const providerNames = selectedProviders.map(p => providerLabels[p]).join(" + ");
  
  const reasoning = `Domaine : ${domainLabel}. Sources : ${providerNames} (~${estimatedSources} publications).`;
  
  return {
    providers: selectedProviders,
    quantity: quantityPerProvider,
    reasoning,
    estimatedTime,
    estimatedSources,
  };
}

/**
 * Export types and functions
 */
export default selectSmartProviders;
