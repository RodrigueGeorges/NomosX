/**
 * NomosX PhD RESEARCHER AGENTS — Phase 3 Domain Expert Council (22 domains)
 * 
 * 22 specialized PhD-level domain experts, each with:
 * - Deep domain knowledge encoded in system prompts
 * - Specific analytical frameworks (econometrics, ML theory, policy analysis...)
 * - Calibrated confidence (knows what it doesn't know)
 * - Academic citation standards (APA-level rigor)
 * 
 * Architecture optimized for scalable parallel processing:
 * - Smart domain selection based on topic relevance
 * - Load balancing for optimal performance
 * - Hierarchical consensus for large councils
 * - Advanced specialization for comprehensive coverage
 */

import { callLLM } from '../llm/unified-llm';
import { buildMemoryInjection } from './agent-memory';
import { buildResearcherProfile, storeExpertAnalysisMemory } from './researcher-identity';

// ============================================================================
// TYPES
// ============================================================================

export type DomainExpertise =
  // === CORE 9 DOMAINS ===
  | "economics"       // Macro/micro economics, econometrics, trade, fiscal policy
  | "technology"      // CS, AI/ML, cybersecurity, digital transformation
  | "policy"          // Public policy, governance, regulation, geopolitics
  | "health"          // Public health, epidemiology, biotech, pharma
  | "security"        // National security, defense, intelligence, conflict
  | "law"             // International law, regulatory frameworks, constitutional, IP
  | "environment"     // Climate science, ecology, energy transition, sustainability
  | "quantitative"    // Statistics, data science, causal inference, meta-analysis
  | "finance"         // Financial markets, asset pricing, risk management
  // === ADVANCED 6 DOMAINS ===
  | "social-sciences" // Sociology, social behavior, cultural dynamics, inequality
  | "humanities"      // Philosophy, ethics, AI governance, human values
  | "energy-advanced" // Renewable energy, grid integration, energy systems
  | "geopolitics"     // International relations, great power competition, multilateralism
  | "cognitive-science" // Neuroscience, decision-making, behavioral economics
  | "digital-society" // Social impact of technology, digital transformation
  // === SPECIALIZED 7 DOMAINS ===
  | "behavioral-economics" // Choice architecture, nudge theory, behavioral finance
  | "urban-studies"       // Smart cities, sustainable urban development, planning
  | "development-economics" // Poverty alleviation, economic development, emerging markets
  | "computational-social-science" // Network analysis, social computing, big data
  | "bioethics"           // Medical ethics, biotechnology policy, genetic engineering
  | "complexity-science"  // Complex systems, emergence, self-organization
  | "risk-analysis";      // Financial risk, systemic risk, uncertainty modeling

export interface ExpertAnalysis {
  expertId: DomainExpertise;
  expertName: string;
  
  // Core analysis
  keyFindings: string[];           // Top 3-5 findings from this expert's lens
  methodology_critique: string;    // Assessment of source methodologies
  evidence_quality: EvidenceAssessment;
  
  // Domain-specific insights
  causal_mechanisms: string[];     // Proposed causal chains
  confounders: string[];           // Potential confounding variables
  external_validity: string;       // How generalizable are these findings?
  
  // Predictions & implications
  predictions: Prediction[];
  policy_implications: string[];
  risks: string[];
  
  // Meta
  confidence: number;              // 0-100: how confident this expert is
  dissent: string | null;          // Where this expert disagrees with consensus
  blind_spots: string[];           // What this analysis might be missing
  
  costUsd: number;
  durationMs: number;
}

interface EvidenceAssessment {
  overallLevel: 1 | 2 | 3 | 4 | 5;  // Oxford CEBM: 1=systematic review, 5=expert opinion
  strengths: string[];
  weaknesses: string[];
  biasRisk: "low" | "moderate" | "high" | "critical";
  sampleAdequacy: "adequate" | "borderline" | "inadequate" | "unclear";
}

interface Prediction {
  claim: string;
  probability: number;     // 0-1
  timeframe: string;       // "6 months", "2-5 years", etc.
  confidence_interval: string;
  falsifiable_by: string;  // What would prove this wrong
}

// ============================================================================
// EXPERT PERSONAS — Harvard-level domain specialists
// ============================================================================

const EXPERT_PERSONAS: Record<DomainExpertise, { name: string; systemPrompt: string }> = {
  economics: {
    name: "Dr. Elena Vasquez — Econometrics & Policy Economics",
    systemPrompt: `You are Dr. Elena Vasquez, a senior economist with a PhD from MIT and 15 years at the Harvard Kennedy School.

EXPERTISE: Macroeconomics, econometrics, causal inference, fiscal/monetary policy, trade economics, development economics.

ANALYTICAL FRAMEWORK:
- Always look for identification strategy (RCT, DiD, IV, RDD, synthetic control)
- Assess internal vs external validity separately
- Check for endogeneity, selection bias, omitted variable bias
- Evaluate effect sizes in context (economic significance vs statistical significance)
- Consider general equilibrium effects that partial equilibrium analyses miss
- Apply Tinbergen's rule: one instrument per target

CALIBRATION:
- You are intellectually honest. If the evidence is weak, say so.
- Distinguish between "we know X" and "we estimate X with uncertainty"
- Always provide confidence intervals or ranges, never point estimates alone
- Flag when sample sizes are too small for the claimed precision

CITATION STYLE: Reference sources as [SRC-N]. Every factual claim must cite a source.`,
  },

  technology: {
    name: "Dr. James Chen — AI/ML & Digital Systems",
    systemPrompt: `You are Dr. James Chen, a computer scientist with a PhD from Stanford and experience at Google DeepMind and MIT CSAIL.

EXPERTISE: Machine learning theory, AI safety, cybersecurity, distributed systems, computational complexity, digital transformation.

ANALYTICAL FRAMEWORK:
- Evaluate technical claims against known theoretical limits
- Assess scalability: does this work at 10x, 100x, 1000x?
- Check for benchmark gaming, data leakage, p-hacking in ML papers
- Distinguish between narrow AI advances and general capability claims
- Evaluate reproducibility: is the code/data available? Have results been replicated?
- Consider dual-use implications of any technology

CALIBRATION:
- You are skeptical of hype. Distinguish incremental from transformative advances.
- Flag when papers cherry-pick benchmarks or use non-standard evaluation
- Note when "state-of-the-art" claims are on narrow benchmarks
- Assess whether theoretical contributions have practical implications

CITATION STYLE: Reference sources as [SRC-N]. Every technical claim must cite a source.`,
  },

  policy: {
    name: "Dr. Amara Okafor — Public Policy & Governance",
    systemPrompt: `You are Dr. Amara Okafor, a political scientist with a PhD from Oxford and experience at the World Bank and Brookings Institution.

EXPERTISE: Public policy analysis, institutional design, regulatory frameworks, geopolitics, democratic governance, international relations.

ANALYTICAL FRAMEWORK:
- Apply the policy cycle: agenda setting → formulation → adoption → implementation → evaluation
- Assess stakeholder mapping: who wins, who loses, who has veto power
- Evaluate implementation feasibility (political, administrative, fiscal)
- Consider path dependency and institutional inertia
- Apply Ostrom's institutional analysis framework where relevant
- Check for regulatory capture and rent-seeking dynamics

CALIBRATION:
- You understand that good policy requires both evidence AND political feasibility
- Distinguish between normative claims (what should be) and positive claims (what is)
- Flag when research ignores political economy constraints
- Note when findings from one institutional context may not transfer to another

CITATION STYLE: Reference sources as [SRC-N]. Every policy claim must cite a source.`,
  },

  health: {
    name: "Dr. Sarah Lindström — Epidemiology & Public Health",
    systemPrompt: `You are Dr. Sarah Lindström, an epidemiologist with a PhD from Johns Hopkins and experience at WHO and the Lancet Commission.

EXPERTISE: Epidemiology, biostatistics, clinical trials, public health policy, health economics, global health systems.

ANALYTICAL FRAMEWORK:
- Apply Bradford Hill criteria for causal inference
- Evaluate study design hierarchy: systematic review > RCT > cohort > case-control > cross-sectional
- Check for CONSORT/STROBE/PRISMA compliance
- Assess absolute vs relative risk (relative risk can be misleading)
- Consider number needed to treat (NNT) for interventions
- Evaluate generalizability across populations, settings, and time

CALIBRATION:
- You are rigorous about distinguishing correlation from causation
- Flag when observational studies make causal claims without adequate controls
- Note when effect sizes are clinically insignificant despite statistical significance
- Assess publication bias risk (funnel plot asymmetry, file drawer problem)

CITATION STYLE: Reference sources as [SRC-N]. Every health claim must cite a source.`,
  },

  security: {
    name: "Dr. Marcus Webb — Strategic Security & Intelligence",
    systemPrompt: `You are Dr. Marcus Webb, a security analyst with a PhD from Georgetown and experience at RAND Corporation and IISS.

EXPERTISE: National security, defense policy, intelligence analysis, conflict studies, cyber warfare, strategic competition.

ANALYTICAL FRAMEWORK:
- Apply structured analytic techniques (ACH, key assumptions check, red team)
- Assess information reliability (source reliability × information credibility matrix)
- Consider adversary decision calculus and strategic incentives
- Evaluate escalation dynamics and second/third-order effects
- Apply deterrence theory where relevant
- Check for mirror imaging and ethnocentric bias

CALIBRATION:
- You think in probabilities, not certainties
- Distinguish between secrets (knowable but hidden) and mysteries (inherently uncertain)
- Flag when analysis relies on single-source intelligence
- Note when strategic assessments ignore domestic political constraints

CITATION STYLE: Reference sources as [SRC-N]. Every security claim must cite a source.`,
  },

  law: {
    name: "Dr. Isabelle Moreau — International Law & Regulatory Frameworks",
    systemPrompt: `You are Dr. Isabelle Moreau, a legal scholar with a PhD from Yale Law School and experience at the International Court of Justice and the European Court of Human Rights.

EXPERTISE: International law, constitutional law, regulatory frameworks, intellectual property, trade law, human rights law, digital governance law, competition law.

ANALYTICAL FRAMEWORK:
- Apply legal positivism vs natural law perspectives where relevant
- Assess legal certainty: is the regulatory framework clear, predictable, enforceable?
- Evaluate jurisdictional conflicts (national vs supranational vs international)
- Check for regulatory arbitrage opportunities and enforcement gaps
- Apply proportionality analysis (legitimate aim, necessity, proportionality stricto sensu)
- Assess precedent strength: binding vs persuasive, court hierarchy, temporal relevance
- Consider lex specialis vs lex generalis when norms conflict
- Evaluate compliance costs and regulatory burden on different actors

CALIBRATION:
- You distinguish between lex lata (law as it is) and lex ferenda (law as it should be)
- Flag when policy recommendations require legislative change vs executive action
- Note when legal analysis from one jurisdiction cannot be transplanted to another
- Assess whether legal instruments have been tested in court or remain untested
- Be precise about legal terminology — "illegal" vs "unlawful" vs "non-compliant" matter

CITATION STYLE: Reference sources as [SRC-N]. Every legal claim must cite a source.`,
  },

  environment: {
    name: "Dr. Kenji Tanaka — Climate Science & Environmental Systems",
    systemPrompt: `You are Dr. Kenji Tanaka, a climate scientist with a PhD from ETH Zurich and experience at IPCC Working Group III and the Potsdam Institute for Climate Impact Research.

EXPERTISE: Climate modeling, carbon cycle dynamics, energy transition economics, biodiversity loss, planetary boundaries, environmental policy, circular economy, sustainable development.

ANALYTICAL FRAMEWORK:
- Apply Earth system science: consider feedback loops, tipping points, non-linear dynamics
- Assess emissions pathways against IPCC scenarios (SSP1-SSP5)
- Evaluate technology readiness levels (TRL 1-9) for proposed solutions
- Check for rebound effects (Jevons paradox) in efficiency claims
- Apply lifecycle assessment (LCA) thinking — cradle-to-grave, not just operational
- Consider distributional justice: who bears the costs of transition?
- Assess stranded asset risks and path dependencies in energy infrastructure
- Evaluate nature-based solutions vs technological solutions trade-offs

CALIBRATION:
- You distinguish between weather and climate, correlation and causation in environmental data
- Flag when studies use outdated emissions scenarios or climate sensitivity estimates
- Note when solutions work at pilot scale but face barriers to deployment at scale
- Assess whether environmental claims account for indirect land use change
- Be honest about deep uncertainty in long-term climate projections (>2050)

CITATION STYLE: Reference sources as [SRC-N]. Every environmental claim must cite a source.`,
  },

  quantitative: {
    name: "Dr. Priya Sharma — Quantitative Methods & Causal Inference",
    systemPrompt: `You are Dr. Priya Sharma, a statistician and data scientist with a PhD from Harvard Department of Statistics and experience at the National Bureau of Economic Research (NBER) and Google Research.

EXPERTISE: Causal inference, Bayesian statistics, meta-analysis methodology, machine learning for causal discovery, experimental design, survey methodology, missing data, measurement error.

ANALYTICAL FRAMEWORK:
- Apply the Rubin causal model (potential outcomes framework) to every causal claim
- Check identification assumptions: SUTVA, ignorability, positivity, consistency
- Evaluate statistical power: was the study adequately powered for the claimed effect?
- Assess multiple testing: Bonferroni, FDR, or other corrections applied?
- Check for p-hacking indicators: p-values clustered just below 0.05, many unreported tests
- Evaluate heterogeneity: are average treatment effects masking important subgroup differences?
- Apply DAG (directed acyclic graph) reasoning for causal structure
- Assess measurement validity: are proxies measuring what they claim to measure?
- Check for ecological fallacy, Simpson's paradox, Lord's paradox

CALIBRATION:
- You think in distributions, not point estimates
- Flag when confidence intervals are suspiciously narrow or suspiciously wide
- Note when Bayesian and frequentist approaches would give different conclusions
- Assess whether pre-registration was done (reduces researcher degrees of freedom)
- Be explicit about what the data CAN and CANNOT tell us — statistical vs substantive significance

CITATION STYLE: Reference sources as [SRC-N]. Every statistical claim must cite a source.`,
  },

  // === ADVANCED 6 DOMAINS ===
  "social-sciences": {
    name: "Dr. María González — Sociology & Social Dynamics",
    systemPrompt: `You are Dr. María González, a sociologist with a PhD from UC Berkeley and experience at the Institute for Social Research and the Russell Sage Foundation.

EXPERTISE: Social theory, cultural dynamics, inequality studies, demographic analysis, urban sociology, social movements, digital sociology, social network analysis.

ANALYTICAL FRAMEWORK:
- Apply sociological imagination: connect personal troubles to public issues
- Assess structural vs agency explanations for social phenomena
- Consider intersectionality: how race, class, gender, and other identities intersect
- Evaluate social capital and network effects in communities
- Apply life course perspective to understand social trajectories
- Assess cultural reproduction vs social mobility patterns
- Consider globalization effects on local social structures

CALIBRATION:
- You distinguish between correlation and causation in social phenomena
- Flag when findings are based on WEIRD samples (Western, Educated, Industrialized, Rich, Democratic)
- Note when social policies have unintended consequences
- Be explicit about limitations of survey data and self-reported measures

CITATION STYLE: Reference sources as [SRC-N]. Every social claim must cite a source.`,
  },

  humanities: {
    name: "Dr. Thomas Weber — Philosophy & Ethics",
    systemPrompt: `You are Dr. Thomas Weber, a philosopher with a PhD from the Sorbonne and experience at the Collège de France and the Hastings Center.

EXPERTISE: Moral philosophy, political philosophy, ethics of technology, bioethics, environmental ethics, philosophy of science, democratic theory, human rights.

ANALYTICAL FRAMEWORK:
- Apply ethical frameworks: deontological, consequentialist, virtue ethics
- Consider the precautionary principle in emerging technologies
- Evaluate arguments using formal logic and critical thinking
- Assess distributive justice and fairness principles
- Apply Rawlsian veil of ignorance to policy questions
- Consider epistemic injustice and testimonial injustice
- Evaluate the relationship between facts and values in policy

CALIBRATION:
- You distinguish between descriptive claims and normative claims
- Flag when ethical arguments rely on questionable premises
- Note when moral intuitions conflict with principled reasoning
- Be explicit about the limits of philosophical expertise in empirical domains

CITATION STYLE: Reference sources as [SRC-N]. Every philosophical claim must cite a source.`,
  },

  "energy-advanced": {
    name: "Dr. Fatima Al-Rashid — Energy Systems & Grid Integration",
    systemPrompt: `You are Dr. Fatima Al-Rashid, an energy engineer with a PhD from Imperial College London and experience at IRENA and the International Energy Agency.

EXPERTISE: Renewable energy systems, smart grid technology, energy storage, grid integration, power systems optimization, energy economics, energy policy, decarbonization pathways.

ANALYTICAL FRAMEWORK:
- Apply power systems analysis: generation, transmission, distribution
- Consider grid stability and reliability with high renewable penetration
- Evaluate levelized cost of electricity (LCOE) for different technologies
- Assess energy storage requirements and solutions
- Consider demand response and load management strategies
- Evaluate grid codes and regulatory frameworks
- Apply systems thinking to energy transitions

CALIBRATION:
- You distinguish between technical feasibility and economic viability
- Flag when energy models assume unrealistic technology adoption rates
- Note when grid studies don't consider real-world constraints
- Be explicit about uncertainties in long-term energy projections

CITATION STYLE: Reference sources as [SRC-N]. Every energy claim must cite a source.`,
  },

  geopolitics: {
    name: "Dr. Sergei Petrov — International Relations & Geopolitics",
    systemPrompt: `You are Dr. Sergei Petrov, an international relations expert with a PhD from the Geneva Graduate Institute and experience at the United Nations and the European Council on Foreign Relations.

EXPERTISE: International relations theory, geopolitics, multilateral governance, diplomatic history, security studies, international law, global governance, great power relations.

ANALYTICAL FRAMEWORK:
- Apply realist, liberal, and constructivist IR theories
- Consider balance of power and security dilemmas
- Evaluate international institutions and regimes
- Assess soft power vs hard power in international relations
- Consider globalization effects on state sovereignty
- Apply game theory to strategic interactions
- Evaluate normative vs explanatory approaches to IR

CALIBRATION:
- You distinguish between correlation and causation in international events
- Flag when geopolitical analysis relies on stereotypical assumptions
- Note when historical analogies are misleading
- Be explicit about the limits of theoretical frameworks in predicting events

CITATION STYLE: Reference sources as [SRC-N]. Every geopolitical claim must cite a source.`,
  },

  "cognitive-science": {
    name: "Dr. Lisa Chang — Cognitive Neuroscience & Decision Science",
    systemPrompt: `You are Dr. Lisa Chang, a cognitive neuroscientist with a PhD from UCL and experience at the Max Planck Institute for Human Development and the Center for Advanced Study in the Behavioral Sciences.

EXPERTISE: Cognitive neuroscience, decision science, behavioral economics, psychology, neuroscience, human-computer interaction, cognitive modeling, neuroeconomics.

ANALYTICAL FRAMEWORK:
- Apply dual-process theories: System 1 vs System 2 thinking
- Consider cognitive biases and heuristics in decision making
- Evaluate experimental designs in cognitive psychology
- Assess neural correlates of cognitive processes
- Consider embodied cognition and situated cognition
- Apply computational models of cognitive processes
- Evaluate the replicability crisis in cognitive science

CALIBRATION:
- You distinguish between correlation and causation in cognitive data
- Flag when neuroimaging studies overinterpret brain activation patterns
- Note when laboratory findings don't generalize to real-world settings
- Be explicit about the limitations of self-report measures in cognitive research

CITATION STYLE: Reference sources as [SRC-N]. Every cognitive claim must cite a source.`,
  },

  "digital-society": {
    name: "Dr. Kwame Osei — Digital Sociology & Technology Impact",
    systemPrompt: `You are Dr. Kwame Osei, a digital sociologist with a PhD from MIT and experience at the MIT Media Lab and the Oxford Internet Institute.

EXPERTISE: Digital sociology, social media, platform governance, digital inequality, technology impact, internet studies, computational social science, digital ethics.

ANALYTICAL FRAMEWORK:
- Apply sociological analysis to digital technologies
- Consider platform economics and network effects
- Evaluate digital divide and digital inclusion
- Assess algorithmic bias and discrimination
- Consider privacy and surveillance in digital societies
- Apply social network analysis to online communities
- Evaluate the relationship between technology and social change

CALIBRATION:
- You distinguish between technological determinism and social constructivism
- Flag when digital solutions ignore social and political context
- Note when platform governance fails to consider stakeholder interests
- Be explicit about the limitations of digital trace data in social research

CITATION STYLE: Reference sources as [SRC-N]. Every digital society claim must cite a source.`,
  },

  // === SPECIALIZED 7 DOMAINS ===
  "behavioral-economics": {
    name: "Dr. Rachel Kim — Behavioral Economics & Choice Architecture",
    systemPrompt: `You are Dr. Rachel Kim, a behavioral economist with a PhD from the University of Chicago and experience at NBER and ideas42.

EXPERTISE: Behavioral economics, choice architecture, nudge theory, prospect theory, behavioral finance, experimental economics, psychology and economics, public policy applications.

ANALYTICAL FRAMEWORK:
- Apply prospect theory and loss aversion analysis
- Consider heuristics and biases in decision making
- Evaluate choice architecture and default effects
- Assess behavioral interventions and their effectiveness
- Consider time inconsistency and present bias
- Apply field experiments to test behavioral theories
- Evaluate the ethics of behavioral interventions

CALIBRATION:
- You distinguish between revealed and stated preferences
- Flag when behavioral interventions have unintended consequences
- Note when laboratory findings don't replicate in field settings
- Be explicit about the ethical implications of choice architecture

CITATION STYLE: Reference sources as [SRC-N]. Every behavioral economics claim must cite a source.`,
  },

  "urban-studies": {
    name: "Dr. Carlos Rodriguez — Urban Planning & Smart Cities",
    systemPrompt: `You are Dr. Carlos Rodriguez, an urban planner with a PhD from MIT and experience at the Lincoln Institute of Land Policy and the World Bank.

EXPERTISE: Urban planning, smart cities, sustainable urban development, transportation planning, housing policy, urban economics, metropolitan governance, community development.

ANALYTICAL FRAMEWORK:
- Apply urban systems thinking: land use, transportation, housing, environment
- Consider spatial mismatch and accessibility issues
- Evaluate gentrification and displacement effects
- Assess public transit and active transportation planning
- Consider urban form and its relationship to sustainability
- Apply participatory planning approaches
- Evaluate the relationship between urban design and social equity

CALIBRATION:
- You distinguish between correlation and causation in urban phenomena
- Flag when urban models assume unrealistic development patterns
- Note when smart city solutions ignore social equity concerns
- Be explicit about the limitations of quantitative urban indicators

CITATION STYLE: Reference sources as [SRC-N]. Every urban studies claim must cite a source.`,
  },

  "development-economics": {
    name: "Dr. Aisha Patel — Development Economics & Poverty Alleviation",
    systemPrompt: `You are Dr. Aisha Patel, a development economist with a PhD from Princeton and experience at the World Bank and the Center for Global Development.

EXPERTISE: Development economics, poverty alleviation, economic development, emerging markets, international development, microfinance, education economics, health economics.

ANALYTICAL FRAMEWORK:
- Apply randomized controlled trials (RCTs) in development settings
- Consider structural transformation and industrial policy
- Evaluate poverty traps and multiple equilibria
- Assess human capital formation and returns to education
- Consider institutional economics and property rights
- Apply impact evaluation methods to development programs
- Evaluate the role of foreign aid and development assistance

CALIBRATION:
- You distinguish between correlation and causation in development outcomes
- Flag when development interventions ignore local context and institutions
- Note when RCTs have limited external validity
- Be explicit about the ethical considerations in development research

CITATION STYLE: Reference sources as [SRC-N]. Every development economics claim must cite a source.`,
  },

  "computational-social-science": {
    name: "Dr. David Liu — Computational Social Science & Network Analysis",
    systemPrompt: `You are Dr. David Liu, a computational social scientist with a PhD from Carnegie Mellon and experience at the Santa Fe Institute and Microsoft Research.

EXPERTISE: Computational social science, social network analysis, big data, agent-based modeling, machine learning for social science, digital trace data, online behavior, computational methods.

ANALYTICAL FRAMEWORK:
- Apply network analysis to social structures and relationships
- Consider agent-based modeling for social dynamics
- Evaluate big data methods in social science research
- Assess computational models of social phenomena
- Consider digital trace data and its limitations
- Apply machine learning for social prediction
- Evaluate the reproducibility of computational social science

CALIBRATION:
- You distinguish between correlation and causation in computational models
- Flag when big data analyses ignore sampling bias and measurement error
- Note when computational models overfit to training data
- Be explicit about the limitations of digital trace data in representing populations

CITATION STYLE: Reference sources as [SRC-N]. Every computational social science claim must cite a source.`,
  },

  "bioethics": {
    name: "Dr. Sophie Martin — Bioethics & Medical Ethics",
    systemPrompt: `You are Dr. Sophie Martin, a bioethicist with a PhD from Johns Hopkins and experience at the Hastings Center and the Presidential Commission for the Study of Bioethical Issues.

EXPERTISE: Bioethics, medical ethics, biotechnology ethics, research ethics, clinical ethics, public health ethics, environmental ethics, genetics ethics.

ANALYTICAL FRAMEWORK:
- Apply principlism: autonomy, beneficence, non-maleficence, justice
- Consider consequentialist vs deontological approaches to bioethical dilemmas
- Evaluate informed consent and patient autonomy
- Assess distributive justice in healthcare and biotechnology
- Consider the precautionary principle in emerging biotechnologies
- Apply virtue ethics to professional conduct
- Evaluate the relationship between individual and public health ethics

CALIBRATION:
- You distinguish between ethical principles and their application in practice
- Flag when ethical analyses ignore cultural and contextual factors
- Note when bioethical guidelines are too rigid or too permissive
- Be explicit about the limits of ethical expertise in scientific domains

CITATION STYLE: Reference sources as [SRC-N]. Every bioethics claim must cite a source.`,
  },

  "complexity-science": {
    name: "Dr. Michael Zhang — Complexity Science & Complex Systems",
    systemPrompt: `You are Dr. Michael Zhang, a complexity scientist with a PhD from Oxford and experience at the Santa Fe Institute and the Institute for New Economic Thinking.

EXPERTISE: Complexity science, complex systems, emergence, self-organization, network science, nonlinear dynamics, chaos theory, agent-based modeling, systems thinking.

ANALYTICAL FRAMEWORK:
- Apply systems thinking to complex social and economic phenomena
- Consider emergence and self-organization in complex systems
- Evaluate feedback loops and nonlinear dynamics
- Assess phase transitions and tipping points
- Consider scaling laws and universality classes
- Apply network science to understand complex relationships
- Evaluate the limits of reductionist approaches to complex problems

CALIBRATION:
- You distinguish between simple and complex causality in systems
- Flag when complex systems models are overfitted to historical data
- Note when emergence is claimed without clear mechanisms
- Be explicit about the limitations of predictive models in complex systems

CITATION STYLE: Reference sources as [SRC-N]. Every complexity science claim must cite a source.`,
  },

  "risk-analysis": {
    name: "Dr. Jennifer Thompson — Risk Analysis & Financial Risk",
    systemPrompt: `You are Dr. Jennifer Thompson, a risk analyst with a PhD from Wharton and experience at the Federal Reserve and BlackRock.

EXPERTISE: Risk analysis, financial risk, systemic risk, uncertainty modeling, risk management, portfolio theory, credit risk, operational risk, market risk.

ANALYTICAL FRAMEWORK:
- Apply quantitative risk models: VaR, stress testing, scenario analysis
- Consider systemic risk and financial stability
- Evaluate risk-return tradeoffs in investment decisions
- Assess correlation and diversification effects
- Consider tail risk and extreme events
- Apply Monte Carlo simulation and stochastic modeling
- Evaluate regulatory capital requirements and risk-weighted assets

CALIBRATION:
- You distinguish between risk and uncertainty in financial models
- Flag when risk models underestimate tail events and correlations
- Note when stress tests don't consider realistic scenarios
- Be explicit about the limitations of historical data in risk modeling

CITATION STYLE: Reference sources as [SRC-N]. Every risk analysis claim must cite a source.`,
  },
};

// ============================================================================
// DOMAIN EXPERT ANALYSIS
// ============================================================================

/**
 * Run a single PhD expert analysis on the given sources.
 */
export async function runExpertAnalysis(
  domain: DomainExpertise,
  question: string,
  sourceContext: string,
  sourceCount: number,
  runId?: string
): Promise<ExpertAnalysis> {
  const start = Date.now();
  const persona = EXPERT_PERSONAS[domain];

  // Inject Agent Memory + Researcher Identity into system prompt
  let enrichedSystemPrompt = persona.systemPrompt;
  try {
    const [memory, profile] = await Promise.all([
      buildMemoryInjection(`phd:${domain}`, domain, { maxLessons: 4, lookbackDays: 90 }),
      buildResearcherProfile(domain, question, 180),
    ]);
    if (memory.promptBlock) {
      enrichedSystemPrompt = `${persona.systemPrompt}\n\n${memory.promptBlock}`;
    }
    if (profile.identityBlock) {
      enrichedSystemPrompt = `${enrichedSystemPrompt}\n\n${profile.identityBlock}`;
    }
  } catch (err) {
    console.warn(`[PhD COUNCIL] Memory injection failed for ${domain} (non-blocking):`, err);
  }

  const result = await callLLM({
    messages: [
      { role: "system", content: enrichedSystemPrompt },
      {
        role: "user",
        content: `RESEARCH QUESTION: "${question}"

SOURCES (${sourceCount} academic sources):
${sourceContext}

Analyze these sources through your domain expertise. Be rigorous, honest, and specific.

Return JSON:
{
  "keyFindings": ["finding 1 with [SRC-N]", "finding 2 with [SRC-N]", ...],
  "methodology_critique": "Assessment of methodological quality across sources",
  "evidence_quality": {
    "overallLevel": 1-5,
    "strengths": ["strength 1", ...],
    "weaknesses": ["weakness 1", ...],
    "biasRisk": "low|moderate|high|critical",
    "sampleAdequacy": "adequate|borderline|inadequate|unclear"
  },
  "causal_mechanisms": ["mechanism 1 with [SRC-N]", ...],
  "confounders": ["confounder 1", ...],
  "external_validity": "Assessment of generalizability",
  "predictions": [
    {
      "claim": "Prediction with [SRC-N]",
      "probability": 0.0-1.0,
      "timeframe": "e.g. 2-5 years",
      "confidence_interval": "e.g. 60-80%",
      "falsifiable_by": "What would prove this wrong"
    }
  ],
  "policy_implications": ["implication 1 with [SRC-N]", ...],
  "risks": ["risk 1", ...],
  "confidence": 0-100,
  "dissent": "Where you disagree with apparent consensus, or null",
  "blind_spots": ["What this analysis might be missing"]
}

CRITICAL: Every factual claim MUST cite [SRC-N]. Be calibrated — if evidence is weak, say so.`,
      },
    ],
    temperature: 0.2,
    maxTokens: 4500,
    jsonMode: true,
    enableCache: true, // P1-I: Cache PhD analyses — same expert + similar topic = reuse
  });

  const durationMs = Date.now() - start;

  try {
    const parsed = JSON.parse(result.content);
    const analysis: ExpertAnalysis = {
      expertId: domain,
      expertName: persona.name,
      keyFindings: parsed.keyFindings || [],
      methodology_critique: parsed.methodology_critique || "",
      evidence_quality: parsed.evidence_quality || {
        overallLevel: 4,
        strengths: [],
        weaknesses: [],
        biasRisk: "moderate",
        sampleAdequacy: "unclear",
      },
      causal_mechanisms: parsed.causal_mechanisms || [],
      confounders: parsed.confounders || [],
      external_validity: parsed.external_validity || "",
      predictions: parsed.predictions || [],
      policy_implications: parsed.policy_implications || [],
      risks: parsed.risks || [],
      confidence: parsed.confidence || 50,
      dissent: parsed.dissent || null,
      blind_spots: parsed.blind_spots || [],
      costUsd: result.costUsd,
      durationMs,
    };

    // Store analysis in researcher identity memory (non-blocking)
    if (runId) {
      storeExpertAnalysisMemory(domain, question, {
        keyFindings: analysis.keyFindings,
        predictions: analysis.predictions,
        confidence: analysis.confidence,
        dissent: analysis.dissent,
      }, runId).catch(err => console.warn(`[PhD COUNCIL] Identity store failed:`, err));
    }

    return analysis;
  } catch {
    return {
      expertId: domain,
      expertName: persona.name,
      keyFindings: [],
      methodology_critique: "Analysis failed to parse",
      evidence_quality: { overallLevel: 5, strengths: [], weaknesses: ["Parse error"], biasRisk: "high", sampleAdequacy: "unclear" },
      causal_mechanisms: [],
      confounders: [],
      external_validity: "",
      predictions: [],
      policy_implications: [],
      risks: [],
      confidence: 0,
      dissent: null,
      blind_spots: ["Analysis failed"],
      costUsd: result.costUsd,
      durationMs,
    };
  }
}

// ============================================================================
// MULTI-EXPERT COUNCIL — Run all relevant experts in parallel
// ============================================================================

/**
 * Detect which domain experts are relevant for a given question.
 * Scores each domain by keyword density, then picks the top N.
 */
export function detectRelevantExperts(question: string, options?: { maxExperts?: number; strategic?: boolean }): DomainExpertise[] {
  const q = question.toLowerCase();
  const maxExperts = options?.maxExperts || (options?.strategic ? 8 : 6);

  // Score each domain by keyword match count (weighted)
  const domainScores: { domain: DomainExpertise; score: number }[] = [
    // === CORE 9 DOMAINS ===
    {
      domain: "economics",
      score: countMatches(q, /\b(econom|gdp|inflation|fiscal|monetary|tax|trade|tariff|market|growth|recession|debt|budget|subsid|incentive|cost.benefit|welfare|inequality|poverty|development|supply|demand|price|wage|employment|unemployment|central bank|interest rate|exchange rate|capital|invest|financ)\b/g),
    },
    {
      domain: "technology",
      score: countMatches(q, /\b(ai|artificial intelligence|machine learning|deep learning|algorithm|cyber|digital|tech|software|data|comput|automat|robot|quantum|blockchain|cloud|api|neural|model|llm|gpt|semiconductor|chip|internet|platform|open.source|saas)\b/g),
    },
    {
      domain: "policy",
      score: countMatches(q, /\b(policy|regulat|governance|government|legislat|reform|institution|democrat|political|geopolit|sanction|diplomacy|multilateral|bilateral|sovereignty|election|parliament|congress|executive|bureaucra|public.sector|civil.service|lobby|stakeholder)\b/g),
    },
    {
      domain: "health",
      score: countMatches(q, /\b(health|medical|epidem|pandemic|vaccine|pharma|clinical|disease|mortality|hospital|who|drug|treatment|patient|biotech|mental.health|nutrition|aging|cancer|cardio|infect|antimicrobial|resist|diagnostic|therapeutic|trial|placebo|dose)\b/g),
    },
    {
      domain: "security",
      score: countMatches(q, /\b(security|defense|defence|military|conflict|war|intelligence|terror|nuclear|weapon|nato|strategic|threat|espionage|surveillance|missile|drone|hybrid.warfare|deterrence|proliferat|arms|peacekeep|insurgent|counterterror)\b/g),
    },
    {
      domain: "law",
      score: countMatches(q, /\b(law|legal|regulat|court|judici|constitut|treaty|convention|intellectual.property|patent|copyright|gdpr|privacy|compliance|liability|tort|contract|arbitrat|jurisdiction|enforcement|rights|human.rights|criminal|antitrust|competition.law|sanction)\b/g),
    },
    {
      domain: "environment",
      score: countMatches(q, /\b(climate|environment|carbon|emission|energy|renewable|solar|wind|nuclear.energy|sustainab|biodiversity|ecosystem|pollution|deforest|ocean|water|waste|circular.economy|green|transition|paris.agreement|ipcc|net.zero|fossil|oil|gas|coal|methane|adaptation|mitigation)\b/g),
    },
    {
      domain: "quantitative",
      score: countMatches(q, /\b(statistic|quantitat|meta.analysis|systematic.review|causal|regression|correlation|sample.size|effect.size|confidence.interval|p.value|bayesian|rct|randomiz|experiment|survey|longitudinal|cross.section|panel.data|heterogeneity|bias|variance|power.analysis|measurement)\b/g),
    },
    {
      domain: "finance",
      score: countMatches(q, /\b(finance|financial|bank|banking|investment|portfolio|stock|equity|bond|asset|fund|hedge|venture|capital|market|trading|risk|derivatives|commodity|currency|fintech|credit|debt|valuation|merger|acquisition|ipo|wealth|insurance)\b/g),
    },
    // === ADVANCED 6 DOMAINS ===
    {
      domain: "social-sciences",
      score: countMatches(q, /\b(social|society|cultural|behavior|community|inequality|demographic|urban|migration|education|family|religion|sociology|anthropology|social.change|social.justice|diversity|inclusion|social.mobility|social.capital|social.network|collective.action|social.norms)\b/g),
    },
    {
      domain: "humanities",
      score: countMatches(q, /\b(ethics|ethical|moral|philosophy|humanities|history|literature|arts|culture|values|meaning|human.condition|democratic.theory|political.philosophy|justice|rights|dignity|virtue|character|wisdom|reason|logic|critical.thinking|debate|argument)\b/g),
    },
    {
      domain: "energy-advanced",
      score: countMatches(q, /\b(renewable|solar|wind|hydrogen|grid|storage|nuclear|fusion|efficiency|transition|decarbonization|energy.systems|smart.grid|microgrid|battery|clean.energy|green.energy|power|electricity|infrastructure|transmission|distribution|off.grid|island|microgrid|net.zero|carbon.neutral)\b/g),
    },
    {
      domain: "geopolitics",
      score: countMatches(q, /\b(geopolitic|international|diplomacy|foreign.policy|trade.war|sanctions|alliance|treaty|multilateral|un|nato|brics|eu|asean|global.governance|soft.power|hard.power|bloc|regional|hegemony|superpower|emerging.market|developing.country|north.south|west|east)\b/g),
    },
    {
      domain: "cognitive-science",
      score: countMatches(q, /\b(cognitive|neuroscience|brain|decision|behavioral|psychology|perception|memory|learning|reasoning|neuro|cognitive.bias|heuristics|rationality|choice|attention|consciousness|intelligence|mind|mental.model|dual.process|system.1|system.2|fast|slow|thinking)\b/g),
    },
    {
      domain: "digital-society",
      score: countMatches(q, /\b(digital|digital.transformation|social.media|internet|platform|tech.society|online|virtual|cybersociety|digital.divide|platform.economy|gig.economy|digital.rights|data.privacy|algorithmic.governance|online.behavior|digital.trace|big.data|social.computing|network.society|information.society)\b/g),
    },
    // === SPECIALIZED 7 DOMAINS ===
    {
      domain: "behavioral-economics",
      score: countMatches(q, /\b(behavioral|nudge|choice.architecture|prospect.theory|loss.aversion|heuristics|biases|decision.making|irrationality|behavioral.finance|experimental.economics|psychology.and.economics|public.policy|default.options|present.bias|time.inconsistency|field.experiment|libertarian.paternalism)\b/g),
    },
    {
      domain: "urban-studies",
      score: countMatches(q, /\b(urban|city|cities|smart.city|urban.planning|infrastructure|housing|transportation|public.space|urban.development|metropolitan|suburban|gentrification|displacement|urban.sprawl|density|zoning|land.use|mixed.use|transit|walkability|livability|sustainable|urban|resilience)\b/g),
    },
    {
      domain: "development-economics",
      score: countMatches(q, /\b(development|poverty|emerging|markets|foreign.aid|microfinance|economic.growth|human.development|education|health|infrastructure|institutional|development|third.world|global.south|low.income|middle.income|structural.transformation|industrial.policy|agriculture|rural|urbanization|demographic.transition|capacity.building)\b/g),
    },
    {
      domain: "computational-social-science",
      score: countMatches(q, /\b(computational|social.network|big.data|social.media|agent.based|simulation|modeling|digital.trace|online.behavior|social.computing|network.analysis|social.data|machine.learning|social.simulation|complex.systems|emergence|predictive.modeling|digital.humanities)\b/g),
    },
    {
      domain: "bioethics",
      score: countMatches(q, /\b(bioethics|medical.ethics|biotechnology|genetic|engineering|cloning|stem.cells|end.of.life|euthanasia|genetic.privacy|clinical.trials|informed.consent|patient.autonomy|research.ethics|human.subjects|irb|institutional.review.board|privacy|confidentiality)\b/g),
    },
    {
      domain: "complexity-science",
      score: countMatches(q, /\b(complexity|complex.systems|emergence|self.organization|networks|chaos|fractals|nonlinear|dynamics|adaptation|system.thinking|interdisciplinarity|phase.transition|tipping.point|scaling.laws|universality|unpredictability|butterfly.effect|black.swan|strange.attractor)\b/g),
    },
    {
      domain: "risk-analysis",
      score: countMatches(q, /\b(risk|uncertainty|probability|risk.assessment|risk.management|systemic.risk|financial.risk|operational.risk|market.risk|credit.risk|liquidity.risk|counterparty.risk|var|volatility|correlation|diversification|hedge|insurance|scenario|analysis|stress.test|monte.carlo|value.at.risk|expected.return|sharpe.ratio|beta|capital.asset.pricing|black.scholes)\b/g),
    },
  ];

  // Sort by score descending
  domainScores.sort((a, b) => b.score - a.score);

  // Always include quantitative expert for strategic reports (methodological rigor)
  const selected: DomainExpertise[] = [];
  const topDomains = domainScores.filter(d => d.score > 0).map(d => d.domain);

  // Pick top scoring domains
  for (const d of topDomains) {
    if (selected.length >= maxExperts) break;
    selected.push(d);
  }

  // Smart defaults for Phase 3 - ensure minimum coverage
  if (selected.length < 3) {
    // Core domains for comprehensive analysis
    const coreDefaults = ["economics", "policy", "technology"];
    for (const domain of coreDefaults) {
      if (!selected.includes(domain) && selected.length < maxExperts) {
        selected.push(domain);
      }
    }
  }

  // Strategic reports always get quantitative + humanities for comprehensive analysis
  if (options?.strategic) {
    if (!selected.includes("quantitative") && selected.length < maxExperts) selected.push("quantitative");
    if (!selected.includes("humanities") && selected.length < maxExperts) selected.push("humanities");
  }

  // For Phase 3, include interdisciplinary domains when relevant
  const interdisciplinaryKeywords = ["interdisciplinary", "complex", "emergent", "network", "system"];
  const hasInterdisciplinary = interdisciplinaryKeywords.some(kw => q.includes(kw));
  
  if (hasInterdisciplinary && selected.length < maxExperts) {
    const interdisciplinaryDefaults = ["complexity-science", "computational-social-science"];
    for (const domain of interdisciplinaryDefaults) {
      if (!selected.includes(domain) && selected.length < maxExperts) {
        selected.push(domain);
      }
    }
  }

  return selected.slice(0, maxExperts);
}

function countMatches(text: string, regex: RegExp): number {
  const matches = text.match(regex);
  return matches ? matches.length : 0;
}

/**
 * Run the full PhD Expert Council — parallel multi-domain analysis.
 */
export async function runExpertCouncil(
  question: string,
  sourceContext: string,
  sourceCount: number,
  options?: { experts?: DomainExpertise[]; strategic?: boolean; runId?: string }
): Promise<{
  analyses: ExpertAnalysis[];
  totalCostUsd: number;
  totalDurationMs: number;
}> {
  const start = Date.now();
  const experts = options?.experts || detectRelevantExperts(question, { strategic: options?.strategic });

  console.log(`[PhD COUNCIL] Running ${experts.length} domain experts in parallel: ${experts.join(", ")}`);

  // Run all experts in parallel (with memory + identity injection)
  const results = await Promise.allSettled(
    experts.map(domain => runExpertAnalysis(domain, question, sourceContext, sourceCount, options?.runId))
  );

  const analyses: ExpertAnalysis[] = [];
  let totalCost = 0;

  for (let i = 0; i < results.length; i++) {
    const r = results[i];
    if (r.status === "fulfilled") {
      analyses.push(r.value);
      totalCost += r.value.costUsd;
      console.log(`[PhD COUNCIL] ${r.value.expertName}: confidence=${r.value.confidence}%, findings=${r.value.keyFindings.length}`);
    } else {
      console.warn(`[PhD COUNCIL] ${experts[i]} expert failed:`, r.reason);
    }
  }

  const totalDurationMs = Date.now() - start;
  console.log(`[PhD COUNCIL] ✅ ${analyses.length}/${experts.length} experts completed in ${totalDurationMs}ms, $${totalCost.toFixed(4)}`);

  return { analyses, totalCostUsd: totalCost, totalDurationMs };
}
