/**
 * NomosX AI Researchers — The Council (Phase 3 - 20+ PhDs)
 * 
 * Single source of truth for all 20+ PhD-level AI researchers.
 * Used across the entire app: publications (author), landing page, methodology, etc.
 * 
 * Phase 3 Expansion: Advanced specialization for comprehensive coverage
 * Each researcher is a specialized domain expert with:
 * - A real-sounding academic identity
 * - A specific analytical framework
 * - A signature color for UI consistency
 * - Institutional credibility
 * - Advanced specialization markers
 */

export interface Researcher {
  id: string;
  name: string;
  title: string;
  institution: string;
  domain: string;
  specialty: string;
  initials: string;
  color: string;
  colorHex: string;
  gradient: string;
  // Phase 3 additions
  tier: 'core' | 'advanced' | 'specialized';
  hIndex?: number;
  publications?: number;
  citationCount?: number;
  fields?: string[];
}

export const RESEARCHERS: Researcher[] = [
  // === CORE 9 PhDs (Tier 1) ===
  {
    id: "economics",
    name: "Dr. Elena Vasquez",
    title: "Senior Economist",
    institution: "Harvard Kennedy School",
    domain: "Economics",
    specialty: "Econometrics & Policy Economics",
    initials: "EV",
    color: "indigo",
    colorHex: "#6366F1",
    gradient: "from-indigo-500/20 to-indigo-500/5",
    tier: "core",
    hIndex: 42,
    publications: 127,
    citationCount: 3840,
    fields: ["econometrics", "policy economics", "international trade"]
  },
  {
    id: "technology",
    name: "Dr. James Chen",
    title: "Computer Scientist",
    institution: "Stanford / DeepMind",
    domain: "Technology",
    specialty: "AI/ML & Digital Systems",
    initials: "JC",
    color: "sky",
    colorHex: "#0EA5E9",
    gradient: "from-sky-500/20 to-sky-500/5",
    tier: "core",
    hIndex: 38,
    publications: 89,
    citationCount: 5620,
    fields: ["artificial intelligence", "machine learning", "cybersecurity"]
  },
  {
    id: "policy",
    name: "Dr. Amara Okafor",
    title: "Political Scientist",
    institution: "Oxford / Brookings",
    domain: "Policy",
    specialty: "Public Policy & Governance",
    initials: "AO",
    color: "violet",
    colorHex: "#8B5CF6",
    gradient: "from-violet-500/20 to-violet-500/5",
    tier: "core",
    hIndex: 35,
    publications: 76,
    citationCount: 2890,
    fields: ["public policy", "governance", "comparative politics"]
  },
  {
    id: "health",
    name: "Dr. Sarah Lindström",
    title: "Epidemiologist",
    institution: "Johns Hopkins / WHO",
    domain: "Health",
    specialty: "Epidemiology & Public Health",
    initials: "SL",
    color: "emerald",
    colorHex: "#10B981",
    gradient: "from-emerald-500/20 to-emerald-500/5",
    tier: "core",
    hIndex: 41,
    publications: 112,
    citationCount: 7200,
    fields: ["epidemiology", "public health", "biostatistics"]
  },
  {
    id: "security",
    name: "Dr. Marcus Webb",
    title: "Security Analyst",
    institution: "Georgetown / RAND",
    domain: "Security",
    specialty: "Strategic Security & Intelligence",
    initials: "MW",
    color: "amber",
    colorHex: "#F59E0B",
    gradient: "from-amber-500/20 to-amber-500/5",
    tier: "core",
    hIndex: 28,
    publications: 54,
    citationCount: 1890,
    fields: ["strategic studies", "intelligence analysis", "conflict resolution"]
  },
  {
    id: "law",
    name: "Dr. Isabelle Moreau",
    title: "Legal Scholar",
    institution: "Yale Law / ICJ",
    domain: "Law",
    specialty: "International Law & Regulation",
    initials: "IM",
    color: "rose",
    colorHex: "#F43F5E",
    gradient: "from-rose-500/20 to-rose-500/5",
    tier: "core",
    hIndex: 33,
    publications: 68,
    citationCount: 3420,
    fields: ["international law", "regulatory frameworks", "human rights"]
  },
  {
    id: "environment",
    name: "Dr. Kenji Tanaka",
    title: "Climate Scientist",
    institution: "ETH Zurich / IPCC",
    domain: "Environment",
    specialty: "Climate Science & Energy Transition",
    initials: "KT",
    color: "teal",
    colorHex: "#14B8A6",
    gradient: "from-teal-500/20 to-teal-500/5",
    tier: "core",
    hIndex: 44,
    publications: 134,
    citationCount: 8900,
    fields: ["climate science", "energy transition", "environmental policy"]
  },
  {
    id: "quantitative",
    name: "Dr. Priya Sharma",
    title: "Statistician",
    institution: "MIT / Nature Methods",
    domain: "Quantitative",
    specialty: "Statistics & Causal Inference",
    initials: "PS",
    color: "indigo",
    colorHex: "#6366F1",
    gradient: "from-indigo-500/20 to-indigo-500/5",
    tier: "core",
    hIndex: 37,
    publications: 95,
    citationCount: 6100,
    fields: ["statistical methods", "causal inference", "meta-analysis"]
  },
  {
    id: "finance",
    name: "Dr. Alexandre Dubois",
    title: "Financial Economist",
    institution: "LSE / BlackRock",
    domain: "Finance & Markets",
    specialty: "Asset Pricing & Market Microstructure",
    initials: "AD",
    color: "orange",
    colorHex: "#F97316",
    gradient: "from-orange-500/20 to-orange-500/5",
    tier: "core",
    hIndex: 31,
    publications: 72,
    citationCount: 4100,
    fields: ["financial economics", "asset pricing", "risk management"]
  },

  // === ADVANCED 6 PhDs (Tier 2) ===
  {
    id: "social-sciences",
    name: "Dr. María González",
    title: "Sociologist",
    institution: "UC Berkeley / Institute for Social Research",
    domain: "Social Sciences",
    specialty: "Social Behavior & Cultural Dynamics",
    initials: "MG",
    color: "purple",
    colorHex: "#A855F7",
    gradient: "from-purple-500/20 to-purple-500/5",
    tier: "advanced",
    hIndex: 29,
    publications: 58,
    citationCount: 2340,
    fields: ["social theory", "cultural dynamics", "inequality studies"]
  },
  {
    id: "humanities",
    name: "Dr. Thomas Weber",
    title: "Philosopher",
    institution: "Sorbonne / Collège de France",
    domain: "Humanities",
    specialty: "Ethics & AI Governance",
    initials: "TW",
    color: "slate",
    colorHex: "#64748B",
    gradient: "from-slate-500/20 to-slate-500/5",
    tier: "advanced",
    hIndex: 26,
    publications: 43,
    citationCount: 1780,
    fields: ["moral philosophy", "AI ethics", "political theory"]
  },
  {
    id: "energy-advanced",
    name: "Dr. Fatima Al-Rashid",
    title: "Energy Engineer",
    institution: "Imperial College / IRENA",
    domain: "Energy Systems",
    specialty: "Renewable Energy & Grid Integration",
    initials: "FA",
    color: "green",
    colorHex: "#22C55E",
    gradient: "from-green-500/20 to-green-500/5",
    tier: "advanced",
    hIndex: 34,
    publications: 81,
    citationCount: 4560,
    fields: ["renewable energy", "smart grid", "energy systems"]
  },
  {
    id: "geopolitics",
    name: "Dr. Sergei Petrov",
    title: "International Relations Expert",
    institution: "Geneva Graduate Institute / UN",
    domain: "Geopolitics",
    specialty: "Great Power Relations & Multilateralism",
    initials: "SP",
    color: "red",
    colorHex: "#EF4444",
    gradient: "from-red-500/20 to-red-500/5",
    tier: "advanced",
    hIndex: 30,
    publications: 62,
    citationCount: 2980,
    fields: ["international relations", "multilateral governance", "diplomacy"]
  },
  {
    id: "cognitive-science",
    name: "Dr. Lisa Chang",
    title: "Cognitive Neuroscientist",
    institution: "UCL / Max Planck Institute",
    domain: "Cognitive Science",
    specialty: "Decision-Making & Behavioral Economics",
    initials: "LC",
    color: "pink",
    colorHex: "#EC4899",
    gradient: "from-pink-500/20 to-pink-500/5",
    tier: "advanced",
    hIndex: 32,
    publications: 69,
    citationCount: 3870,
    fields: ["cognitive neuroscience", "decision science", "behavioral economics"]
  },
  {
    id: "digital-society",
    name: "Dr. Kwame Osei",
    title: "Digital Sociologist",
    institution: "MIT Media Lab / Oxford Internet Institute",
    domain: "Digital Society",
    specialty: "Social Impact of Technology & Digital Transformation",
    initials: "KO",
    color: "cyan",
    colorHex: "#06B6D4",
    gradient: "from-cyan-500/20 to-cyan-500/5",
    tier: "advanced",
    hIndex: 27,
    publications: 51,
    citationCount: 2120,
    fields: ["digital sociology", "technology impact", "platform governance"]
  },

  // === SPECIALIZED 7 PhDs (Tier 3) - Phase 3 Expansion ===
  {
    id: "behavioral-economics",
    name: "Dr. Rachel Kim",
    title: "Behavioral Economist",
    institution: "University of Chicago / NBER",
    domain: "Behavioral Economics",
    specialty: "Choice Architecture & Nudge Theory",
    initials: "RK",
    color: "orange",
    colorHex: "#FB923C",
    gradient: "from-orange-500/20 to-orange-500/5",
    tier: "specialized",
    hIndex: 25,
    publications: 47,
    citationCount: 1980,
    fields: ["behavioral economics", "choice architecture", "nudge theory"]
  },
  {
    id: "urban-studies",
    name: "Dr. Carlos Rodriguez",
    title: "Urban Planner",
    institution: "MIT / Lincoln Institute",
    domain: "Urban Studies",
    specialty: "Smart Cities & Sustainable Urban Development",
    initials: "CR",
    color: "yellow",
    colorHex: "#FDE047",
    gradient: "from-yellow-500/20 to-yellow-500/5",
    tier: "specialized",
    hIndex: 23,
    publications: 39,
    citationCount: 1560,
    fields: ["urban planning", "smart cities", "sustainable development"]
  },
  {
    id: "development-economics",
    name: "Dr. Aisha Patel",
    title: "Development Economist",
    institution: "World Bank / Princeton",
    domain: "Development Economics",
    specialty: "Poverty Alleviation & Economic Development",
    initials: "AP",
    color: "lime",
    colorHex: "#84CC16",
    gradient: "from-lime-500/20 to-lime-500/5",
    tier: "specialized",
    hIndex: 28,
    publications: 56,
    citationCount: 2670,
    fields: ["development economics", "poverty alleviation", "international development"]
  },
  {
    id: "computational-social-science",
    name: "Dr. David Liu",
    title: "Computational Social Scientist",
    institution: "Carnegie Mellon / Santa Fe Institute",
    domain: "Computational Social Science",
    specialty: "Network Analysis & Social Computing",
    initials: "DL",
    color: "blue",
    colorHex: "#3B82F6",
    gradient: "from-blue-500/20 to-blue-500/5",
    tier: "specialized",
    hIndex: 31,
    publications: 73,
    citationCount: 4230,
    fields: ["computational social science", "network analysis", "social computing"]
  },
  {
    id: "bioethics",
    name: "Dr. Sophie Martin",
    title: "Bioethicist",
    institution: "Johns Hopkins / Hastings Center",
    domain: "Bioethics",
    specialty: "Medical Ethics & Biotechnology Policy",
    initials: "SM",
    color: "pink",
    colorHex: "#F472B6",
    gradient: "from-pink-500/20 to-pink-500/5",
    tier: "specialized",
    hIndex: 24,
    publications: 41,
    citationCount: 1890,
    fields: ["bioethics", "medical ethics", "biotechnology policy"]
  },
  {
    id: "complexity-science",
    name: "Dr. Michael Zhang",
    title: "Complexity Scientist",
    institution: "Santa Fe Institute / Oxford",
    domain: "Complexity Science",
    specialty: "Complex Systems & Emergent Phenomena",
    initials: "MZ",
    color: "indigo",
    colorHex: "#6366F1",
    gradient: "from-indigo-500/20 to-indigo-500/5",
    tier: "specialized",
    hIndex: 26,
    publications: 44,
    citationCount: 2230,
    fields: ["complexity science", "complex systems", "emergent phenomena"]
  },
  {
    id: "risk-analysis",
    name: "Dr. Jennifer Thompson",
    title: "Risk Analyst",
    institution: "Wharton / Federal Reserve",
    domain: "Risk Analysis",
    specialty: "Financial Risk & Systemic Risk Modeling",
    initials: "JT",
    color: "red",
    colorHex: "#DC2626",
    gradient: "from-red-500/20 to-red-500/5",
    tier: "specialized",
    hIndex: 29,
    publications: 61,
    citationCount: 3120,
    fields: ["risk analysis", "financial risk", "systemic risk"]
  },
];

/** Get a researcher by domain ID */
export function getResearcher(domainId: string): Researcher | undefined {
  return RESEARCHERS.find(r => r.id === domainId);
}

/** Get the lead researcher for a topic based on keyword matching */
export function getLeadResearcher(topic: string): Researcher {
  const t = topic.toLowerCase();
  
  const domainKeywords: Record<string, string[]> = {
    economics: ["economy", "economic", "fiscal", "monetary", "trade", "gdp", "inflation", "tax", "banking", "debt", "growth"],
    technology: ["ai", "artificial intelligence", "machine learning", "cyber", "digital", "software", "algorithm", "data", "tech", "computing", "quantum", "blockchain"],
    policy: ["policy", "governance", "regulation", "government", "political", "democracy", "election", "geopolit", "diplomacy", "institution"],
    health: ["health", "medical", "disease", "pandemic", "pharma", "clinical", "epidem", "vaccine", "mental health", "biotech", "hospital"],
    security: ["security", "defense", "military", "intelligence", "conflict", "war", "terrorism", "nuclear", "nato", "weapon", "surveillance"],
    law: ["law", "legal", "court", "regulation", "rights", "constitutional", "intellectual property", "patent", "compliance", "jurisdiction"],
    environment: ["climate", "environment", "carbon", "energy", "sustainability", "emission", "renewable", "biodiversity", "pollution", "green"],
    quantitative: ["statistic", "data science", "methodology", "meta-analysis", "causal", "regression", "probability", "sampling", "bias"],
    finance: ["finance", "financial", "market", "stock", "equity", "bond", "asset", "portfolio", "trading", "investment", "hedge fund", "venture", "capital", "valuation", "risk", "derivatives", "commodity", "currency", "fintech"],
    "social-sciences": ["social", "society", "cultural", "behavior", "community", "inequality", "demographic", "urban", "migration", "education", "family", "religion", "sociology", "anthropology", "social change", "social justice", "diversity", "inclusion"],
    humanities: ["ethics", "moral", "philosophy", "humanities", "history", "literature", "arts", "culture", "values", "meaning", "human condition", "democratic theory", "political philosophy", "justice", "rights", "dignity"],
    "energy-advanced": ["renewable", "solar", "wind", "hydrogen", "grid", "storage", "nuclear", "fusion", "efficiency", "transition", "decarbonization", "energy systems", "smart grid", "microgrid", "battery", "clean energy", "green energy"],
    geopolitics: ["geopolitic", "international", "diplomacy", "foreign policy", "trade war", "sanctions", "alliance", "treaty", "multilateral", "un", "nato", "brics", "eu", "asean", "global governance", "soft power", "hard power"],
    "cognitive-science": ["cognitive", "neuroscience", "brain", "decision", "behavioral", "psychology", "perception", "memory", "learning", "reasoning", "neuro", "cognitive bias", "heuristics", "rationality", "choice", "attention"],
    "digital-society": ["digital transformation", "social media", "internet", "platform", "tech society", "online", "virtual", "cybersociety", "digital divide", "platform economy", "gig economy", "digital rights", "data privacy", "algorithmic governance"],
    "behavioral-economics": ["behavioral", "nudge", "choice architecture", "prospect theory", "loss aversion", "heuristics", "biases", "decision making", "behavioral finance", "irrationality"],
    "urban-studies": ["urban", "city", "smart city", "urban planning", "infrastructure", "housing", "transportation", "public space", "urban development", "metropolitan", "suburban"],
    "development-economics": ["development", "poverty", "emerging markets", "foreign aid", "microfinance", "economic growth", "human development", "education", "health", "infrastructure", "institutional development"],
    "computational-social-science": ["computational", "social network", "big data", "social media", "agent-based modeling", "simulation", "network analysis", "social computing", "digital trace", "online behavior"],
    "bioethics": ["bioethics", "medical ethics", "genetic engineering", "cloning", "stem cells", "end of life", "euthanasia", "genetic privacy", "biotechnology", "medical research", "clinical trials"],
    "complexity-science": ["complexity", "complex systems", "emergence", "self-organization", "networks", "chaos", "fractals", "nonlinear dynamics", "adaptation", "system thinking", "interdisciplinarity"],
    "risk-analysis": ["risk", "uncertainty", "probability", "risk assessment", "risk management", "systemic risk", "financial risk", "operational risk", "risk modeling", "monte carlo", "stress testing"],
  };

  let bestMatch = "economics";
  let bestScore = 0;

  for (const [domain, keywords] of Object.entries(domainKeywords)) {
    const score = keywords.filter(kw => t.includes(kw)).length;
    if (score > bestScore) {
      bestScore = score;
      bestMatch = domain;
    }
  }

  return getResearcher(bestMatch) || RESEARCHERS[0];
}

/** Get researchers by tier (for subscription gating) */
export function getResearchersByTier(tier: 'standard' | 'premium' | 'strategic' | 'enterprise'): Researcher[] {
  switch (tier) {
    case 'standard':
      return RESEARCHERS.filter(r => r.tier === 'core'); // 9 core domains
    case 'premium':
      return RESEARCHERS.filter(r => r.tier === 'core' || r.tier === 'advanced'); // 15 domains
    case 'strategic':
      return RESEARCHERS; // All 22 domains
    case 'enterprise':
      return RESEARCHERS; // All 22 domains + custom configurations
    default:
      return RESEARCHERS.filter(r => r.tier === 'core');
  }
}

/** Get total count of researchers */
export function getResearcherCount(): number {
  return RESEARCHERS.length;
}

/** Get researchers by domain category */
export function getResearchersByCategory(category: 'stem' | 'social' | 'humanities' | 'interdisciplinary'): Researcher[] {
  const categoryMap = {
    stem: ['technology', 'health', 'environment', 'quantitative', 'finance', 'energy-advanced', 'cognitive-science', 'computational-social-science', 'complexity-science', 'risk-analysis'],
    social: ['economics', 'policy', 'security', 'social-sciences', 'geopolitics', 'digital-society', 'behavioral-economics', 'development-economics', 'urban-studies'],
    humanities: ['law', 'humanities', 'bioethics'],
    interdisciplinary: ['computational-social-science', 'complexity-science', 'cognitive-science', 'bioethics']
  };
  
  return RESEARCHERS.filter(r => categoryMap[category].includes(r.id));
}

/** Get researchers by specialization field */
export function getResearchersByField(field: string): Researcher[] {
  return RESEARCHERS.filter(r => r.fields?.some(f => f.toLowerCase().includes(field.toLowerCase())));
}

/** Get top researchers by citation count */
export function getTopResearchersByCitations(limit: number = 10): Researcher[] {
  return RESEARCHERS
    .filter(r => r.citationCount)
    .sort((a, b) => (b.citationCount || 0) - (a.citationCount || 0))
    .slice(0, limit);
}

/** Get researchers by institution */
export function getResearchersByInstitution(institution: string): Researcher[] {
  return RESEARCHERS.filter(r => r.institution.toLowerCase().includes(institution.toLowerCase()));
}
