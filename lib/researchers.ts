/**
 * NomosX AI Researchers — The Council
 * 
 * Single source of truth for all 8 PhD-level AI researchers.
 * Used across the entire app: publications (author), landing page, methodology, etc.
 * 
 * Each researcher is a specialized domain expert with:
 * - A real-sounding academic identity
 * - A specific analytical framework
 * - A signature color for UI consistency
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
  {
    id: "economics",
    name: "Dr. Elena Vasquez",
    title: "Senior Economist",
    institution: "Harvard Kennedy School",
    domain: "Economics",
    specialty: "Econometrics & Policy Economics",
    initials: "EV",
    color: "cyan",
    colorHex: "#00D4FF",
    gradient: "from-cyan-500/20 to-cyan-500/5",
  },
  {
    id: "technology",
    name: "Dr. James Chen",
    title: "Computer Scientist",
    institution: "Stanford / DeepMind",
    domain: "Technology",
    specialty: "AI/ML & Digital Systems",
    initials: "JC",
    color: "blue",
    colorHex: "#3B82F6",
    gradient: "from-blue-500/20 to-blue-500/5",
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
];

/** Get a researcher by domain ID */
export function getResearcher(domainId: string): Researcher | undefined {
  return RESEARCHERS.find(r => r.id === domainId);
}

/** Get the lead researcher for a topic based on keyword matching */
export function getLeadResearcher(topic: string): Researcher {
  const t = topic.toLowerCase();
  
  const domainKeywords: Record<string, string[]> = {
    economics: ["economy", "economic", "fiscal", "monetary", "trade", "gdp", "inflation", "tax", "market", "finance", "banking", "debt", "growth"],
    technology: ["ai", "artificial intelligence", "machine learning", "cyber", "digital", "software", "algorithm", "data", "tech", "computing", "quantum", "blockchain"],
    policy: ["policy", "governance", "regulation", "government", "political", "democracy", "election", "geopolit", "diplomacy", "institution"],
    health: ["health", "medical", "disease", "pandemic", "pharma", "clinical", "epidem", "vaccine", "mental health", "biotech", "hospital"],
    security: ["security", "defense", "military", "intelligence", "conflict", "war", "terrorism", "nuclear", "nato", "weapon", "surveillance"],
    law: ["law", "legal", "court", "regulation", "rights", "constitutional", "intellectual property", "patent", "compliance", "jurisdiction"],
    environment: ["climate", "environment", "carbon", "energy", "sustainability", "emission", "renewable", "biodiversity", "pollution", "green"],
    quantitative: ["statistic", "data science", "methodology", "meta-analysis", "causal", "regression", "probability", "sampling", "bias"],
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

  return RESEARCHERS.find(r => r.id === bestMatch) || RESEARCHERS[0];
}
