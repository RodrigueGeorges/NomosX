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

  // === ADVANCED 6 DOMAINS ===
  "social-sciences": {
    id: "social-sciences",
    name: "Dr. María González",
    title: "Sociologist & Social Dynamics Expert",
    institution: "UC Berkeley / Institute for Social Research",
    domains: [
      "social", "society", "cultural", "behavior", "community", "inequality", "demographic",
      "urban", "migration", "education", "family", "religion", "sociology", "anthropology",
      "social change", "social justice", "diversity", "inclusion", "social mobility", "social capital",
      "social network", "collective action", "social norms", "social theory"
    ],
    providers: ["openalex", "crossref", "semanticscholar", "ssrn", "jstor", "sagepub", "taylor-francis"],
    publicationCadence: "biweekly",
    minQualityThreshold: 70,
    maxBriefPerRun: 2,
    preferredFormats: ["brief", "strategic"],
    focusAreas: [
      "Social inequality and wealth concentration in post-pandemic economies",
      "Cultural polarization and echo chamber effects in digital media",
      "Urban gentrification and displacement patterns in major cities",
      "Social capital erosion in remote work environments"
    ],
  },

  humanities: {
    id: "humanities",
    name: "Dr. Thomas Weber",
    title: "Philosopher & Ethics Expert",
    institution: "Sorbonne / Collège de France",
    domains: [
      "ethics", "ethical", "moral", "philosophy", "humanities", "history", "literature", "arts",
      "culture", "values", "meaning", "human condition", "democratic", "political philosophy",
      "justice", "rights", "dignity", "virtue", "character", "wisdom", "reason", "logic",
      "critical thinking", "debate", "argument", "bioethics", "environmental ethics"
    ],
    providers: ["openalex", "crossref", "philpapers", "jstor", "project_muse", "ssrn"],
    publicationCadence: "monthly",
    minQualityThreshold: 72,
    maxBriefPerRun: 1,
    preferredFormats: ["brief", "strategic"],
    focusAreas: [
      "Ethical frameworks for AI governance and autonomous systems",
      "Democratic theory in the age of digital surveillance",
      "Philosophical foundations of climate justice and intergenerational equity",
      "Human dignity and rights in the age of biotechnology"
    ],
  },

  "energy-advanced": {
    id: "energy-advanced",
    name: "Dr. Fatima Al-Rashid",
    title: "Energy Systems & Grid Integration Expert",
    institution: "Imperial College London / IRENA",
    domains: [
      "energy", "renewable", "solar", "wind", "hydrogen", "grid", "storage", "nuclear",
      "fusion", "efficiency", "transition", "decarbonization", "energy systems", "smart grid",
      "microgrid", "battery", "clean energy", "green energy", "power", "electricity",
      "infrastructure", "transmission", "distribution", "off grid", "island", "carbon neutral"
    ],
    providers: ["openalex", "crossref", "iea", "irena", "energy", "nature", "science", "arxiv"],
    publicationCadence: "biweekly",
    minQualityThreshold: 71,
    maxBriefPerRun: 2,
    preferredFormats: ["brief", "strategic"],
    focusAreas: [
      "Grid stability challenges with high renewable energy penetration",
      "Economic viability of green hydrogen production and storage",
      "Energy justice and equitable access to clean energy transitions",
      "Nuclear fusion commercialization prospects and policy frameworks"
    ],
  },

  geopolitics: {
    id: "geopolitics",
    name: "Dr. Sergei Petrov",
    title: "International Relations & Geopolitics Expert",
    institution: "Geneva Graduate Institute / United Nations",
    domains: [
      "geopolitics", "international", "diplomacy", "foreign policy", "trade war", "sanctions",
      "alliance", "treaty", "multilateral", "un", "nato", "brics", "eu", "asean", "global governance",
      "soft power", "hard power", "bloc", "regional", "hegemony", "superpower", "emerging",
      "developing", "north", "south", "west", "east", "great power", "competition"
    ],
    providers: ["openalex", "crossref", "un", "nato", "chatham-house", "carnegie", "rand", "brookings"],
    publicationCadence: "weekly",
    minQualityThreshold: 70,
    maxBriefPerRun: 2,
    preferredFormats: ["brief", "strategic"],
    focusAreas: [
      "Multipolar world order and shifting alliance structures",
      "Economic statecraft and sanctions effectiveness in the 2020s",
      "Climate geopolitics and resource competition in the Arctic",
      "Digital sovereignty and technological decoupling strategies"
    ],
  },

  "cognitive-science": {
    id: "cognitive-science",
    name: "Dr. Lisa Chang",
    title: "Cognitive Neuroscientist & Decision Science Expert",
    institution: "UCL / Max Planck Institute for Human Development",
    domains: [
      "cognitive", "neuroscience", "brain", "decision", "behavioral", "psychology", "perception",
      "memory", "learning", "reasoning", "neuro", "cognitive bias", "heuristics", "rationality",
      "choice", "attention", "consciousness", "intelligence", "mind", "mental model",
      "dual process", "system 1", "system 2", "fast", "slow", "thinking", "neuroeconomics"
    ],
    providers: ["openalex", "crossref", "pubmed", "nature", "science", "cell", "neuron", "arxiv", "ssrn"],
    publicationCadence: "monthly",
    minQualityThreshold: 73,
    maxBriefPerRun: 1,
    preferredFormats: ["brief", "strategic"],
    focusAreas: [
      "Cognitive biases in policy decision-making and behavioral public policy",
      "Neuroscience of trust and credibility in digital information environments",
      "Decision fatigue and choice architecture in complex policy systems",
      "Cognitive enhancement technologies and ethical implications for society"
    ],
  },

  "digital-society": {
    id: "digital-society",
    name: "Dr. Kwame Osei",
    title: "Digital Sociologist & Technology Impact Expert",
    institution: "MIT Media Lab / Oxford Internet Institute",
    domains: [
      "digital", "digital transformation", "social media", "internet", "platform", "tech society",
      "online", "virtual", "cybersociety", "digital divide", "platform economy", "gig economy",
      "digital rights", "data privacy", "algorithmic governance", "online behavior", "digital trace",
      "big data", "social computing", "network society", "information society", "digital anthropology"
    ],
    providers: ["openalex", "crossref", "ssrn", "joi", "plos one", "arxiv", "nature"],
    publicationCadence: "biweekly",
    minQualityThreshold: 70,
    maxBriefPerRun: 2,
    preferredFormats: ["brief", "strategic"],
    focusAreas: [
      "Platform governance and algorithmic accountability in democratic societies",
      "Digital inequality and access to essential services in the Global South",
      "Social media's impact on political polarization and civic engagement",
      "Data sovereignty and cross-border data flows in the digital economy"
    ],
  },

  // === SPECIALIZED 7 DOMAINS ===
  "behavioral-economics": {
    id: "behavioral-economics",
    name: "Dr. Rachel Kim",
    title: "Behavioral Economist & Choice Architecture Expert",
    institution: "University of Chicago / NBER",
    domains: [
      "behavioral", "nudge", "choice architecture", "prospect theory", "loss aversion", "heuristics",
      "biases", "decision making", "irrationality", "behavioral finance", "experimental economics",
      "psychology and economics", "public policy", "default options", "present bias",
      "time inconsistency", "field experiment", "libertarian paternalism", "behavioral intervention"
    ],
    providers: ["openalex", "crossref", "nber", "ssrn", "science", "nature", "pnas", "ideas42"],
    publicationCadence: "monthly",
    minQualityThreshold: 71,
    maxBriefPerRun: 1,
    preferredFormats: ["brief", "strategic"],
    focusAreas: [
      "Effectiveness of behavioral interventions in climate policy compliance",
      "Choice architecture in digital platforms and consumer protection",
      "Behavioral insights for improving tax compliance and public program uptake",
      "Ethical considerations in behavioral public policy and libertarian paternalism"
    ],
  },

  "urban-studies": {
    id: "urban-studies",
    name: "Dr. Carlos Rodriguez",
    title: "Urban Planner & Smart Cities Expert",
    institution: "MIT / Lincoln Institute of Land Policy",
    domains: [
      "urban", "city", "cities", "smart city", "urban planning", "infrastructure", "housing",
      "transportation", "public space", "urban development", "metropolitan", "suburban",
      "gentrification", "displacement", "urban sprawl", "density", "zoning", "land use", "mixed use",
      "transit", "walkability", "livability", "sustainable", "urban", "resilience"
    ],
    providers: ["openalex", "crossref", "ssrn", "urban", "worldbank", "un-habitat", "lincoln"],
    publicationCadence: "biweekly",
    minQualityThreshold: 69,
    maxBriefPerRun: 2,
    preferredFormats: ["brief", "strategic"],
    focusAreas: [
      "Smart city governance and citizen participation in urban decision-making",
      "Housing affordability and inclusive urban development strategies",
      "Sustainable transportation and multimodal integration in metropolitan areas",
      "Urban resilience and climate adaptation in coastal cities"
    ],
  },

  "development-economics": {
    id: "development-economics",
    name: "Dr. Aisha Patel",
    title: "Development Economist & Poverty Alleviation Expert",
    institution: "World Bank / Princeton",
    domains: [
      "development", "poverty", "emerging", "markets", "foreign aid", "microfinance",
      "economic growth", "human development", "education", "health", "infrastructure",
      "institutional", "development", "third world", "global south", "low income",
      "middle income", "structural transformation", "industrial policy", "agriculture",
      "rural", "urbanization", "demographic transition", "capacity building"
    ],
    providers: ["worldbank", "imf", "oecd", "openalex", "crossref", "ssrn", "nber", "ifpri"],
    publicationCadence: "monthly",
    minQualityThreshold: 68,
    maxBriefPerRun: 1,
    preferredFormats: ["brief", "strategic"],
    focusAreas: [
      "Effectiveness of conditional cash transfers in poverty reduction programs",
      "Digital financial inclusion and mobile money in developing economies",
      "Education quality and learning outcomes in low-income countries",
      "Infrastructure investment and economic growth in emerging markets"
    ],
  },

  "computational-social-science": {
    id: "computational-social-science",
    name: "Dr. David Liu",
    title: "Computational Social Scientist & Network Analysis Expert",
    institution: "Carnegie Mellon / Santa Fe Institute",
    domains: [
      "computational", "social network", "big data", "social media", "agent based", "simulation",
      "modeling", "digital trace", "online behavior", "social computing", "network analysis",
      "social data", "machine learning", "social simulation", "complex systems", "emergence",
      "predictive modeling", "digital humanities", "computational methods", "social science"
    ],
    providers: ["openalex", "arxiv", "ssrn", "plos one", "nature", "science", "joi"],
    publicationCadence: "monthly",
    minQualityThreshold: 70,
    maxBriefPerRun: 1,
    preferredFormats: ["brief", "strategic"],
    focusAreas: [
      "Network analysis of misinformation spread and social influence patterns",
      "Computational approaches to detecting and measuring social phenomena",
      "Big data methods for understanding collective behavior and social trends",
      "Agent-based modeling for policy simulation and intervention testing"
    ],
  },

  "bioethics": {
    id: "bioethics",
    name: "Dr. Sophie Martin",
    title: "Bioethicist & Medical Ethics Expert",
    institution: "Johns Hopkins / Hastings Center",
    domains: [
      "bioethics", "medical ethics", "biotechnology", "genetic", "engineering", "cloning",
      "stem cells", "end of life", "euthanasia", "genetic privacy", "clinical trials",
      "informed consent", "patient autonomy", "research ethics", "human subjects", "irb",
      "institutional review board", "privacy", "confidentiality", "healthcare ethics"
    ],
    providers: ["pubmed", "europepmc", "openalex", "crossref", "nature", "cell", "jama", "nejm"],
    publicationCadence: "monthly",
    minQualityThreshold: 74,
    maxBriefPerRun: 1,
    preferredFormats: ["brief", "strategic"],
    focusAreas: [
      "Ethical frameworks for CRISPR and gene editing technologies",
      "Privacy and consent in genomic research and biobanking",
      "Resource allocation and priority setting in pandemic response",
      "Artificial intelligence in medical diagnosis and treatment decision support"
    ],
  },

  "complexity-science": {
    id: "complexity-science",
    name: "Dr. Michael Zhang",
    title: "Complexity Scientist & Complex Systems Expert",
    institution: "Oxford / Santa Fe Institute",
    domains: [
      "complexity", "complex systems", "emergence", "self organization", "networks", "chaos",
      "fractals", "nonlinear", "dynamics", "adaptation", "system thinking", "interdisciplinarity",
      "phase transition", "tipping point", "scaling laws", "universality", "unpredictability",
      "butterfly effect", "black swan", "strange attractor", "complexity science"
    ],
    providers: ["arxiv", "nature", "science", "plos one", "santa fe", "complexity", "chaos", "nonlinearity"],
    publicationCadence: "monthly",
    minQualityThreshold: 71,
    maxBriefPerRun: 1,
    preferredFormats: ["brief", "strategic"],
    focusAreas: [
      "Complex systems approaches to climate change and ecological resilience",
      "Network effects and cascade failures in financial and technological systems",
      "Emergent phenomena in social and economic systems",
      "Predictive limitations and uncertainty in complex adaptive systems"
    ],
  },

  "risk-analysis": {
    id: "risk-analysis",
    name: "Dr. Jennifer Thompson",
    title: "Risk Analyst & Financial Risk Expert",
    institution: "Wharton / Federal Reserve",
    domains: [
      "risk", "uncertainty", "probability", "risk assessment", "risk management", "systemic risk",
      "financial risk", "operational risk", "market risk", "credit risk", "liquidity risk",
      "counterparty risk", "var", "volatility", "correlation", "diversification", "hedge",
      "insurance", "scenario", "analysis", "stress test", "monte carlo", "value at risk",
      "expected return", "sharpe ratio", "beta", "capital asset pricing", "black scholes"
    ],
    providers: ["openalex", "crossref", "ssrn", "repec", "bis", "imf", "worldbank", "nber"],
    publicationCadence: "weekly",
    minQualityThreshold: 72,
    maxBriefPerRun: 2,
    preferredFormats: ["brief", "strategic"],
    focusAreas: [
      "Systemic risk assessment in interconnected financial markets",
      "Climate risk modeling and scenario analysis for insurance sectors",
      "Cybersecurity risk quantification and enterprise risk management",
      "Emerging market volatility and currency risk in global portfolios"
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

/**
 * Determine if a topic requires multiple researchers for comprehensive coverage
 */
export function requiresMultipleResearchers(topic: string): {
  const q = topic.toLowerCase();
  
  // Multi-domain indicators
  const multiDomainIndicators = [
    " and ", " versus ", " compared ", " between ", " relationship ", " impact ", " effect ",
    " across ", " throughout ", " among ", " within "
  ];
  
  // Complex interdisciplinary topics
  const interdisciplinaryKeywords = [
    "interdisciplinary", "holistic", "systems thinking", "network", "complex", "emergent"
  ];
  
  // High-stakes topics
  const highStakesKeywords = [
    "global", "international", "systemic", "crisis", "strategic", "comprehensive"
  ];
  
  const hasMultiDomain = multiDomainIndicators.some(kw => q.includes(kw));
  const hasInterdisciplinary = interdisciplinaryKeywords.some(kw => q.includes(kw));
  const hasHighStakes = highStakesKeywords.some(kw => q.includes(kw));
  
  return hasMultiDomain || hasInterdisciplinary || hasHighStakes;
}

/**
 * Get all relevant researchers for a topic (for collaborative publications)
 */
export function getAllRelevantResearchers(topic: string): ResearcherOwner[] {
  const q = topic.toLowerCase();
  const relevant: ResearcherOwner[] = [];
  
  for (const owner of Object.values(RESEARCHER_REGISTRY)) {
    let relevanceScore = 0;
    for (const keyword of owner.domains) {
      if (q.includes(keyword)) {
        relevanceScore += keyword.split(" ").length;
      }
    }
    if (relevanceScore > 0) {
      relevant.push({ ...owner, relevanceScore });
    }
  }
  
  // Sort by relevance and return top researchers
  return relevant
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 8); // Max 8 collaborators
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
  options?: { forceStrategic?: boolean; forcePremium?: boolean; forceCollaborative?: boolean }
): PipelineTier {
  if (options?.forceStrategic || format === "strategic") return "strategic";
  if (options?.forcePremium) return "premium";
  
  // Check if topic requires collaborative treatment
  const needsCollaborative = requiresMultipleResearchers(topic);
  if (options?.forceCollaborative && needsCollaborative) return "strategic";

  const topicLower = topic.toLowerCase();

  // Topics that always warrant full strategic treatment
  const strategicTriggers = [
    "nuclear", "pacific", "systemic risk", "financial crisis", "war",
    "geopolitical", "constitutional", "climate tipping", "ai safety",
    "democratic", "sovereignty",
  ];
  if (strategicTriggers.some(t => topicLower.includes(t))) return "strategic";

  // High-rigor domains default to premium
  const premiumDomains: DomainExpertise[] = ["health", "law", "quantitative", "security", "bioethics", "complexity-science"];
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
