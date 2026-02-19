/**
 * Smart Provider Selector
 * 
 * Intelligently selects the best providers and quantities
 * based on domain and question complexity
 * 
 * Best Practices 2026: Context-aware, intelligent defaults
 */

import { prisma } from '../db';

// All providers available in the pipeline (54 total)
export type Provider = 
  // TIER 1: Academic Core (always active)
  | "openalex" | "crossref" | "semanticscholar" | "thesesfr" | "hal" | "pubmed" | "arxiv" | "base"
  // TIER 2: Institutional - Intelligence
  | "odni" | "cia-foia" | "nsa" | "uk-jic"
  // TIER 2: Institutional - Defense
  | "nato" | "eeas" | "sgdsn" | "eda"
  // TIER 2: Institutional - Economic
  | "imf" | "worldbank" | "oecd" | "bis"
  // TIER 2: Institutional - Cyber
  | "nist" | "cisa" | "enisa"
  // TIER 2: Institutional - Multilateral
  | "un" | "undp" | "unctad"
  // TIER 3: Think Tanks & Policy Labs
  | "lawzero" | "govai" | "iaps" | "caip" | "aipi" | "cset" | "ainow" | "datasociety"
  | "abundance" | "caidp" | "scsp" | "ifp" | "cdt" | "brookings" | "fai" | "cnas"
  | "rand" | "newamerica" | "aspen-digital" | "rstreet"
  // TIER 4: Archives
  | "nara" | "uk-archives" | "archives-fr";

export interface SmartSelection {
  providers: Provider[];
  quantity: number;
  reasoning: string;
  estimatedTime: string;
  estimatedSources: number;
}

/**
 * Domain → Multi-Provider Strategy (Tiered)
 * 
 * TIER 1 (Core Academic): Always included for baseline
 * TIER 2 (Institutional): Domain-specific official sources
 * TIER 3 (Think Tanks): Cutting-edge policy & innovation
 * TIER 4 (Archives): Historical & declassified docs
 * 
 * Strategy: 8-12 providers per domain for editorial robustness
 */
const DOMAIN_PROVIDER_MAP: Record<string, Provider[]> = {
  // Health & Medicine (10 providers)
  health: ["openalex", "pubmed", "semanticscholar", "crossref", "hal", "base", "worldbank", "un", "brookings", "rand"],
  medical: ["pubmed", "openalex", "semanticscholar", "crossref", "base", "worldbank", "un", "cset", "brookings", "rand"],
  
  // Exact sciences (8 providers)
  physics: ["openalex", "arxiv", "semanticscholar", "crossref", "hal", "base", "cset", "ifp"],
  mathematics: ["openalex", "arxiv", "semanticscholar", "crossref", "hal", "base", "cset", "abundance"],
  computer_science: ["semanticscholar", "arxiv", "openalex", "crossref", "hal", "cset", "ainow", "datasociety"],
  
  // Social sciences & Economics (12 providers)
  economics: ["openalex", "crossref", "worldbank", "imf", "oecd", "bis", "hal", "brookings", "rand", "newamerica", "cnas", "ifp"],
  finance: ["openalex", "crossref", "worldbank", "imf", "bis", "oecd", "hal", "brookings", "rand", "rstreet", "cnas", "newamerica"],
  social_sciences: ["openalex", "crossref", "hal", "semanticscholar", "un", "undp", "brookings", "rand", "newamerica", "datasociety", "ainow", "cset"],
  
  // Environment & Climate (10 providers)
  climate: ["openalex", "crossref", "worldbank", "un", "oecd", "hal", "brookings", "rand", "newamerica", "rstreet"],
  environment: ["openalex", "crossref", "worldbank", "un", "undp", "oecd", "hal", "brookings", "rand", "newamerica"],
  
  // Politics & Law (12 providers)
  politics: ["openalex", "crossref", "hal", "odni", "un", "brookings", "rand", "cnas", "newamerica", "aspen-digital", "rstreet", "cdt"],
  law: ["openalex", "crossref", "hal", "lawzero", "un", "brookings", "rand", "cdt", "rstreet", "newamerica", "caidp", "aspen-digital"],
  
  // Technology & Innovation (12 providers)
  technology: ["semanticscholar", "openalex", "arxiv", "crossref", "hal", "cset", "ainow", "datasociety", "ifp", "abundance", "cdt", "aspen-digital"],
  ai: ["semanticscholar", "openalex", "arxiv", "crossref", "govai", "iaps", "caip", "aipi", "cset", "ainow", "datasociety", "caidp"],
  
  // Defense & Security (12 providers)
  defense: ["openalex", "crossref", "nato", "sgdsn", "eeas", "eda", "odni", "rand", "cnas", "scsp", "brookings", "newamerica"],
  security: ["openalex", "crossref", "nato", "odni", "nsa", "uk-jic", "sgdsn", "rand", "cnas", "scsp", "brookings", "cset"],
  
  // Cybersecurity (10 providers)
  cyber: ["openalex", "semanticscholar", "nist", "cisa", "enisa", "crossref", "cset", "rand", "cnas", "cdt"],
  
  // Intelligence & Geopolitics (12 providers)
  intelligence: ["openalex", "crossref", "odni", "cia-foia", "nsa", "uk-jic", "nato", "rand", "cnas", "scsp", "brookings", "nara"],
  geopolitics: ["openalex", "crossref", "odni", "nato", "eeas", "un", "unctad", "rand", "cnas", "brookings", "newamerica", "scsp"],
  
  // France specific (10 providers)
  france: ["openalex", "thesesfr", "hal", "crossref", "sgdsn", "archives-fr", "semanticscholar", "oecd", "worldbank", "un"],
  
  // Default (multi-disciplinary) - 10 providers for maximum coverage
  default: ["openalex", "semanticscholar", "crossref", "hal", "thesesfr", "worldbank", "un", "brookings", "rand", "cset"],
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
  // New domains for institutional providers
  defense: ["défense", "militaire", "armée", "stratégie militaire", "defense", "military", "army", "warfare", "strategic"],
  security: ["sécurité", "renseignement", "espionnage", "surveillance", "security", "intelligence", "espionage", "surveillance"],
  cyber: ["cybersécurité", "cyber", "piratage", "malware", "ransomware", "cybersecurity", "hacking", "breach", "vulnerability"],
  intelligence: ["renseignement", "espionnage", "cia", "nsa", "services secrets", "intelligence", "espionage", "classified", "secret"],
  geopolitics: ["géopolitique", "relations internationales", "diplomatie", "conflit", "geopolitics", "international relations", "diplomacy", "conflict"],
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
 * P2-L: Load historically best-performing providers for a domain from AgentAuditLog.
 * Returns a map of provider → avg quality score from past runs.
 */
async function loadProviderPerformance(domain: string): Promise<Map<string, number>> {
  const perfMap = new Map<string, number>();
  try {
    const logs = await prisma.agentAuditLog.findMany({
      where: {
        agent: { in: ["analyst", "strategic-analyst", "publication-generator"] },
        timestamp: { gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) },
      },
      select: { metadata: true },
      take: 50,
    });

    for (const log of logs) {
      const meta = log.metadata as any;
      if (meta?.providerScores && typeof meta.providerScores === "object") {
        for (const [provider, score] of Object.entries(meta.providerScores)) {
          const current = perfMap.get(provider) || 0;
          const count = perfMap.get(`${provider}__count`) || 0;
          perfMap.set(provider, (current * count + Number(score)) / (count + 1));
          perfMap.set(`${provider}__count`, count + 1);
        }
      }
    }
  } catch { /* non-fatal */ }
  return perfMap;
}

/**
 * Intelligently selects providers and quantities.
 * P2-L: Now async — boosts providers with strong historical performance.
 */
export async function selectSmartProviders(question: string): Promise<SmartSelection> {
  const domain = detectDomain(question);
  const baseProviders = DOMAIN_PROVIDER_MAP[domain] || DOMAIN_PROVIDER_MAP.default;

  // P2-L: Load historical performance and reorder providers
  const perfMap = await loadProviderPerformance(domain);
  const providers = [...baseProviders].sort((a, b) => {
    const scoreA = perfMap.get(a) || 50;
    const scoreB = perfMap.get(b) || 50;
    return scoreB - scoreA;
  });

  const complexity = estimateComplexity(question);
  const baseQuantity = { simple: 20, moderate: 30, complex: 40 }[complexity];
  const quantityPerProvider = Math.ceil(baseQuantity / providers.length);
  const estimatedTime = { simple: "45-60s", moderate: "60-90s", complex: "90-120s" }[complexity];
  const estimatedSources = baseQuantity;

  const topPerformers = providers.filter(p => (perfMap.get(p) || 0) > 60).slice(0, 3);
  const perfNote = topPerformers.length > 0 ? ` (boosted: ${topPerformers.join(", ")} from history)` : "";

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
    defense: "Défense & Stratégie",
    security: "Sécurité & Renseignement",
    cyber: "Cybersécurité",
    intelligence: "Intelligence & Espionnage",
    geopolitics: "Géopolitique",
    france: "France (Multi-sources)",
    default: "Multi-disciplinaire",
  }[domain] || "Multi-disciplinaire";
  
  const providerLabels: Partial<Record<Provider, string>> = {
    // Academic
    openalex: "OpenAlex", crossref: "CrossRef", semanticscholar: "Semantic Scholar",
    thesesfr: "Thèses.fr", hal: "HAL", pubmed: "PubMed", arxiv: "arXiv", base: "BASE",
    // Institutional - Intelligence
    odni: "ODNI", "cia-foia": "CIA FOIA", nsa: "NSA", "uk-jic": "UK JIC",
    // Institutional - Defense
    nato: "NATO", eeas: "EEAS", sgdsn: "SGDSN", eda: "EDA",
    // Institutional - Economic
    imf: "IMF", worldbank: "World Bank", oecd: "OECD", bis: "BIS",
    // Institutional - Cyber
    nist: "NIST", cisa: "CISA", enisa: "ENISA",
    // Institutional - Multilateral
    un: "UN", undp: "UNDP", unctad: "UNCTAD",
    // Think Tanks
    lawzero: "LawZero", govai: "GovAI", iaps: "IAPS", caip: "CAIP", aipi: "AIPI",
    cset: "CSET", ainow: "AI Now", datasociety: "Data & Society", abundance: "Abundance",
    caidp: "CAIDP", scsp: "SCSP", ifp: "IFP", cdt: "CDT", brookings: "Brookings",
    fai: "FAI", cnas: "CNAS", rand: "RAND", newamerica: "New America",
    "aspen-digital": "Aspen Digital", rstreet: "R Street",
    // Archives
    nara: "NARA", "uk-archives": "UK Archives", "archives-fr": "Archives FR",
  };
  
  // Use 8-10 providers for editorial robustness (was 3, now expanded)
  const selectedProviders = providers.slice(0, 10) as Provider[];
  const providerNames = selectedProviders.map(p => providerLabels[p] || p).join(" + ");
  
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
