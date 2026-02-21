/**
 * NomosX AI Researchers — The Council (Expanded to 15)
 * 
 * Single source of truth for all 15 PhD-level AI researchers.
 * Used across the entire app: publications (author), landing page, methodology, etc.
 * 
 * Each researcher is a specialized domain expert with:
 * - A real-sounding academic identity
 * - A specific analytical framework
 * - A signature color for UI consistency
 * - Institutional credibility
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
}

export const RESEARCHERS: Researcher[] = [
  // === EXISTING 9 PhDs ===
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
  },

  // === NEW 6 PhDs ===
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
export function getResearchersByTier(tier: 'standard' | 'premium' | 'strategic'): Researcher[] {
  switch (tier) {
    case 'standard':
      return RESEARCHERS.slice(0, 6); // Core domains
    case 'premium':
      return RESEARCHERS.slice(0, 12); // Core + advanced
    case 'strategic':
      return RESEARCHERS; // All 15
    default:
      return RESEARCHERS.slice(0, 6);
  }
}

/** Get total count of researchers */
export function getResearcherCount(): number {
  return RESEARCHERS.length;
}

/** Get researchers by domain category */
export function getResearchersByCategory(category: 'stem' | 'social' | 'humanities'): Researcher[] {
  const categoryMap = {
    stem: ['technology', 'health', 'environment', 'quantitative', 'finance', 'energy-advanced', 'cognitive-science'],
    social: ['economics', 'policy', 'security', 'social-sciences', 'geopolitics', 'digital-society'],
    humanities: ['law', 'humanities']
  };
  
  return RESEARCHERS.filter(r => categoryMap[category].includes(r.id));
}
