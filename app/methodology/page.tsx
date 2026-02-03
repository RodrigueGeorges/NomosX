"use client";
const React = require('react');

/**
 * Methodology Page — Deep Technical Dive
 * 
 * Purpose: Explain the agent pipeline, data sources, scoring, and editorial process
 * UX: Technical credibility, transparency, convert skeptics → believers
 */

const {useState,useEffect} = require('react');
const {Select} = require('@/components/ui/Select');
const {Input} = require('@/components/ui/Input');
const {useRouter} = require('next/navigation');
const {Button} = require('@/components/ui/Button');
const AuthModal = require('@/components/AuthModal');
const PublicNav = require('@/components/PublicNav');
const {cn} = require('@/lib/utils');
const {Search,Database,BarChart3,FileText,Brain,Shield,ArrowRight,CheckCircle,Zap,GitBranch,Lock,Eye} = require('lucide-react');

module.exports = function MethodologyPage;() {
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const agents = [
    {
      name: "SCOUT",
      icon: Search,
      color: "cyan",
      purpose: "Source Discovery",
      description: "Queries 200K+ academic publications across multiple providers in parallel. Normalizes responses, computes quality scores, and enriches with open access data.",
      inputs: ["Search query", "Provider list", "Results per provider"],
      outputs: ["Source IDs", "Quality scores", "Raw metadata"],
      providers: ["OpenAlex", "Crossref", "Semantic Scholar", "arXiv", "PubMed", "Unpaywall"]
    },
    {
      name: "INDEX",
      icon: Database,
      color: "blue",
      purpose: "Identity Enrichment",
      description: "Normalizes sources, resolves author identities via ORCID, maps institutional affiliations via ROR, and performs deduplication with novelty detection.",
      inputs: ["Source IDs from SCOUT"],
      outputs: ["Enriched sources", "Author records", "Institution records"],
      providers: ["ORCID API", "ROR API", "Internal deduplication"]
    },
    {
      name: "RANK",
      icon: BarChart3,
      color: "emerald",
      purpose: "Source Selection",
      description: "Selects top sources using composite scoring (quality + novelty + recency). Enforces diversity constraints across years, providers, and geographies.",
      inputs: ["Query", "Limit", "Mode (quality/novelty/balanced)"],
      outputs: ["Ranked sources with composite scores"],
      providers: ["Internal scoring engine", "Diversity optimizer"]
    },
    {
      name: "READER",
      icon: FileText,
      color: "amber",
      purpose: "Content Extraction",
      description: "Extracts key claims, methods, results, and limitations from abstracts. Uses GPT-4 Turbo with structured output for downstream synthesis.",
      inputs: ["Sources from RANK"],
      outputs: ["Claims", "Methods", "Results", "Limitations", "Confidence"],
      providers: ["GPT-4 Turbo", "PDF extraction pipeline"]
    },
    {
      name: "ANALYST",
      icon: Brain,
      color: "purple",
      purpose: "Synthesis & Analysis",
      description: "Synthesizes research into decision-ready analysis with dialectical structure. Enforces [SRC-*] citation tags and produces structured JSON output.",
      inputs: ["Question", "Sources", "Reader output"],
      outputs: ["Title", "Summary", "Consensus", "Debate", "Implications"],
      providers: ["GPT-4 Turbo", "Citation verification"]
    },
    {
      name: "GUARD",
      icon: Shield,
      color: "red",
      purpose: "Editorial Gate",
      description: "Evaluates every publication proposal against quality thresholds, cadence limits, and editorial standards. Can approve, hold, reject, or enforce silence.",
      inputs: ["Draft", "Signal", "Quality metrics"],
      outputs: ["Decision (PUBLISH/HOLD/REJECT/SILENCE)", "Reasons", "Scores"],
      providers: ["Internal rules engine", "Quality scoring"]
    }
  ];

  const dataSources = [
    { name: "OpenAlex", type: "Academic", coverage: "200M+ works", update: "Daily" },
    { name: "Crossref", type: "Academic", coverage: "140M+ DOIs", update: "Real-time" },
    { name: "Semantic Scholar", type: "Academic", coverage: "200M+ papers", update: "Weekly" },
    { name: "arXiv", type: "Preprints", coverage: "2M+ papers", update: "Daily" },
    { name: "PubMed", type: "Biomedical", coverage: "35M+ citations", update: "Daily" },
    { name: "ORCID", type: "Identity", coverage: "18M+ researchers", update: "Real-time" },
    { name: "ROR", type: "Institutions", coverage: "100K+ orgs", update: "Monthly" },
    { name: "Unpaywall", type: "Open Access", coverage: "30M+ OA links", update: "Weekly" }
  ];

  const qualityMetrics = [
    { metric: "Trust Score", range: "0-100", threshold: "≥75 for publication", description: "Composite of citation quality, source diversity, and claim verification" },
    { metric: "Novelty Score", range: "0-100", threshold: "≥60 for signal", description: "Measures how new/unique the information is vs. existing corpus" },
    { metric: "Citation Coverage", range: "0-100%", threshold: "≥80% claims cited", description: "Percentage of claims backed by [SRC-*] citations" },
    { metric: "Quality Score", range: "0-100", threshold: "≥70 for ranking", description: "Source quality based on citations, recency, open access status" }
  ];

  const colorMap: Record<string, { bg: string; border: string; text: string; hover: string }> = {
    cyan: { bg: "bg-cyan-500/10", border: "border-cyan-500/20", text: "text-cyan-400", hover: "hover:border-cyan-500/30" },
    blue: { bg: "bg-primary/10", border: "border-primary/20", text: "text-primary", hover: "hover:border-primary/30" },
    emerald: { bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-400", hover: "hover:border-emerald-500/30" },
    amber: { bg: "bg-amber-500/10", border: "border-amber-500/20", text: "text-amber-400", hover: "hover:border-amber-500/30" },
    purple: { bg: "bg-secondary/10", border: "border-secondary/20", text: "text-secondary", hover: "hover:border-secondary/30" },
    red: { bg: "bg-red-500/10", border: "border-red-500/20", text: "text-red-400", hover: "hover:border-red-500/30" }
  };

  return (
    <>
      <div className="min-h-screen bg-[#0B0B0D] text-white transition-all duration-200 hover:opacity-80">
        {/* Background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 transition-all duration-200 hover:opacity-80">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1400px] h-[900px] transition-all duration-200 hover:opacity-80">
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/8 via-blue-500/4 to-transparent blur-3xl transition-all duration-200 hover:opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/6 via-transparent to-emerald-500/6 blur-3xl transition-all duration-200 hover:opacity-80" />
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px] transition-all duration-200 hover:opacity-80" />
          {mounted && (
            <div className="absolute inset-0 transition-all duration-200 hover:opacity-80">
              {[...Array(15)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-emerald-400/20 animate-pulse transition-all duration-200 hover:opacity-80"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${3 + Math.random() * 2}s`
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Nav */}
        <PublicNav currentPage="methodology" onSignInClick={() => setShowAuthModal(true)} />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 transition-all duration-200 hover:opacity-80">
          {/* Hero */}
          <div className="text-center mb-20 transition-all duration-200 hover:opacity-80">
            <div className="text-xs text-emerald-400/60 tracking-[0.25em] uppercase mb-6 flex items-center justify-center gap-3 transition-all duration-200 hover:opacity-80">
              <div className="w-8 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent transition-all duration-200 hover:opacity-80" />
              <span>Technical Deep Dive</span>
              <div className="w-8 h-px bg-gradient-to-r from-emerald-400/60 via-transparent to-transparent transition-all duration-200 hover:opacity-80" />
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-light leading-tight mb-6 transition-all duration-200 hover:opacity-80">
              <span className="bg-gradient-to-r from-white via-emerald-200 to-white bg-clip-text text-transparent transition-all duration-200 hover:opacity-80">
                How NomosX Works
              </span>
              <br />
              <span className="text-white/70 italic text-4xl sm:text-4xl md:text-5xl transition-all duration-200 hover:opacity-80">The agent pipeline explained</span>
            </h1>

            <p className="text-4xl text-white/50 leading-relaxed max-w-3xl mx-auto mb-8 transition-all duration-200 hover:opacity-80">
              Six specialized agents orchestrate the research cycle, from source discovery 
              to editorial decision. Fully autonomous, transparent, and auditable.
            </p>
          </div>

          {/* Agent Pipeline */}
          <div className="mb-20 transition-all duration-200 hover:opacity-80">
            <div className="max-w-4xl mb-12 transition-all duration-200 hover:opacity-80">
              <div className="text-xs text-emerald-400/60 tracking-[0.25em] uppercase mb-6 flex items-center gap-3 transition-all duration-200 hover:opacity-80">
                <div className="w-8 h-px bg-gradient-to-r from-emerald-400/60 to-transparent transition-all duration-200 hover:opacity-80" />
                <span>Agent Pipeline</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-light leading-tight text-white/95 mb-6 transition-all duration-200 hover:opacity-80">
                Six agents, one mission
              </h2>
              <p className="text-4xl text-white/50 leading-relaxed max-w-3xl transition-all duration-200 hover:opacity-80">
                Each agent has a single responsibility, deterministic behavior, and traceable outputs.
                They communicate via database and job queue.
              </p>
            </div>

            <div className="space-y-6 transition-all duration-200 hover:opacity-80">
              {agents.map((agent, i) => {
                const colors = colorMap[agent.color];
                return (
                  <div key={i} className={`group relative p-8 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.03] to-white/[0.01] ${colors.hover} transition-all duration-500 overflow-hidden`}>
                    <div className="relative flex flex-col lg:flex-row lg:items-start gap-6 transition-all duration-200 hover:opacity-80">
                      {/* Agent Header */}
                      <div className="flex-shrink-0 flex items-center gap-4 transition-all duration-200 hover:opacity-80">
                        <div className={`w-16 h-16 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center`}>
                          <agent.icon size={32} className={colors.text} />
                        </div>
                        <div className="lg:hidden transition-all duration-200 hover:opacity-80">
                          <div className={`text-xs ${colors.text} tracking-[0.25em] uppercase mb-1`}>{agent.name}</div>
                          <h3 className="text-4xl font-light text-white/95 transition-all duration-200 hover:opacity-80">{agent.purpose}</h3>
                        </div>
                      </div>

                      {/* Agent Content */}
                      <div className="flex-1 transition-all duration-200 hover:opacity-80">
                        <div className="hidden lg:block mb-4 transition-all duration-200 hover:opacity-80">
                          <div className={`text-xs ${colors.text} tracking-[0.25em] uppercase mb-1`}>{agent.name}</div>
                          <h3 className="text-4xl font-light text-white/95 transition-all duration-200 hover:opacity-80">{agent.purpose}</h3>
                        </div>
                        
                        <p className="text-base text-white/50 leading-relaxed mb-6 transition-all duration-200 hover:opacity-80">
                          {agent.description}
                        </p>

                        <div className="grid sm:grid-cols-3 gap-4 transition-all duration-200 hover:opacity-80">
                          <div>
                            <div className="text-xs text-white/30 uppercase tracking-wider mb-2 transition-all duration-200 hover:opacity-80">Inputs</div>
                            <ul className="space-y-1 transition-all duration-200 hover:opacity-80">
                              {agent.inputs.map((input, j) => (
                                <li key={j} className="text-sm text-white/60 flex items-center gap-2 transition-all duration-200 hover:opacity-80">
                                  <ArrowRight size={12} className={colors.text} />
                                  {input}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <div className="text-xs text-white/30 uppercase tracking-wider mb-2 transition-all duration-200 hover:opacity-80">Outputs</div>
                            <ul className="space-y-1 transition-all duration-200 hover:opacity-80">
                              {agent.outputs.map((output, j) => (
                                <li key={j} className="text-sm text-white/60 flex items-center gap-2 transition-all duration-200 hover:opacity-80">
                                  <CheckCircle size={12} className={colors.text} />
                                  {output}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <div className="text-xs text-white/30 uppercase tracking-wider mb-2 transition-all duration-200 hover:opacity-80">Providers</div>
                            <ul className="space-y-1 transition-all duration-200 hover:opacity-80">
                              {agent.providers.map((provider, j) => (
                                <li key={j} className="text-sm text-white/60 flex items-center gap-2 transition-all duration-200 hover:opacity-80">
                                  <Zap size={12} className={colors.text} />
                                  {provider}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Data Sources */}
          <div className="mb-20 transition-all duration-200 hover:opacity-80">
            <div className="max-w-4xl mb-12 transition-all duration-200 hover:opacity-80">
              <div className="text-xs text-primary/60 tracking-[0.25em] uppercase mb-6 flex items-center gap-3 transition-all duration-200 hover:opacity-80">
                <div className="w-8 h-px bg-gradient-to-r from-blue-400/60 to-transparent transition-all duration-200 hover:opacity-80" />
                <span>Data Sources</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-light leading-tight text-white/95 mb-6 transition-all duration-200 hover:opacity-80">
                Where we get our data
              </h2>
              <p className="text-4xl text-white/50 leading-relaxed max-w-3xl transition-all duration-200 hover:opacity-80">
                We aggregate from the world's leading academic databases and identity registries.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 transition-all duration-200 hover:opacity-80">
              {dataSources.map((source, i) => (
                <div key={i} className="group relative p-6 rounded-xl border border-white/[0.08] bg-gradient-to-br from-white/[0.03] to-white/[0.01] hover:border-primary/30 transition-all duration-300">
                  <div className="relative z-10 transition-all duration-200 hover:opacity-80">
                    <h3 className="text-4xl font-medium text-white/95 mb-1 transition-all duration-200 hover:opacity-80">{source.name}</h3>
                    <div className="text-xs text-primary/60 uppercase tracking-wider mb-3 transition-all duration-200 hover:opacity-80">{source.type}</div>
                    <div className="space-y-1 text-sm text-white/50 transition-all duration-200 hover:opacity-80">
                      <div>{source.coverage}</div>
                      <div className="text-white/30 transition-all duration-200 hover:opacity-80">Updated: {source.update}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quality Metrics */}
          <div className="mb-20 transition-all duration-200 hover:opacity-80">
            <div className="max-w-4xl mb-12 transition-all duration-200 hover:opacity-80">
              <div className="text-xs text-secondary/60 tracking-[0.25em] uppercase mb-6 flex items-center gap-3 transition-all duration-200 hover:opacity-80">
                <div className="w-8 h-px bg-gradient-to-r from-purple-400/60 to-transparent transition-all duration-200 hover:opacity-80" />
                <span>Quality Metrics</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-light leading-tight text-white/95 mb-6 transition-all duration-200 hover:opacity-80">
                How we measure quality
              </h2>
              <p className="text-4xl text-white/50 leading-relaxed max-w-3xl transition-all duration-200 hover:opacity-80">
                Every source and publication is scored against multiple quality dimensions.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 transition-all duration-200 hover:opacity-80">
              {qualityMetrics.map((item, i) => (
                <div key={i} className="group relative p-6 rounded-xl border border-white/[0.08] bg-gradient-to-br from-white/[0.03] to-white/[0.01] hover:border-secondary/30 transition-all duration-300">
                  <div className="relative z-10 transition-all duration-200 hover:opacity-80">
                    <div className="flex items-center justify-between mb-4 transition-all duration-200 hover:opacity-80">
                      <h3 className="text-4xl font-light text-white/95 transition-all duration-200 hover:opacity-80">{item.metric}</h3>
                      <span className="text-sm text-secondary font-mono transition-all duration-200 hover:opacity-80">{item.range}</span>
                    </div>
                    <div className="text-sm text-emerald-400/80 mb-3 transition-all duration-200 hover:opacity-80">Threshold: {item.threshold}</div>
                    <p className="text-sm text-white/50 transition-all duration-200 hover:opacity-80">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Editorial Process */}
          <div className="mb-20 transition-all duration-200 hover:opacity-80">
            <div className="max-w-4xl mb-12 transition-all duration-200 hover:opacity-80">
              <div className="text-xs text-red-400/60 tracking-[0.25em] uppercase mb-6 flex items-center gap-3 transition-all duration-200 hover:opacity-80">
                <div className="w-8 h-px bg-gradient-to-r from-red-400/60 to-transparent transition-all duration-200 hover:opacity-80" />
                <span>Editorial Process</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-light leading-tight text-white/95 mb-6 transition-all duration-200 hover:opacity-80">
                The Editorial Gate
              </h2>
              <p className="text-4xl text-white/50 leading-relaxed max-w-3xl transition-all duration-200 hover:opacity-80">
                Every publication proposal passes through our autonomous editorial gate.
                It can approve, hold, reject, or enforce strategic silence.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 transition-all duration-200 hover:opacity-80">
              {[
                { decision: "PUBLISH", color: "emerald", icon: CheckCircle, description: "Meets all quality thresholds and editorial standards" },
                { decision: "HOLD", color: "amber", icon: Eye, description: "Needs more evidence or refinement before publication" },
                { decision: "REJECT", color: "red", icon: Lock, description: "Does not meet quality standards or contains issues" },
                { decision: "SILENCE", color: "purple", icon: GitBranch, description: "Strategic silence — nothing worth saying right now" }
              ].map((item, i) => (
                <div key={i} className={`group relative p-6 rounded-xl border border-white/[0.08] bg-gradient-to-br from-white/[0.03] to-white/[0.01] hover:border-${item.color}-500/30 transition-all duration-300`}>
                  <div className="relative z-10 text-center transition-all duration-200 hover:opacity-80">
                    <div className={`w-12 h-12 rounded-xl bg-${item.color}-500/10 border border-${item.color}-500/20 flex items-center justify-center mx-auto mb-4`}>
                      <item.icon size={24} className={`text-${item.color}-400`} />
                    </div>
                    <h3 className={`text-4xl font-medium text-${item.color}-400 mb-2`}>{item.decision}</h3>
                    <p className="text-sm text-white/50 transition-all duration-200 hover:opacity-80">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="relative overflow-hidden transition-all duration-200 hover:opacity-80">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-blue-500/5 to-purple-500/10 rounded-3xl blur-2xl transition-all duration-200 hover:opacity-80" />
            
            <div className="relative text-center p-10 sm:p-16 rounded-3xl border border-white/[0.08] bg-gradient-to-br from-white/[0.02] to-white/[0.01] backdrop-blur-xl transition-all duration-200 hover:opacity-80">
              <div className="text-xs text-emerald-400/60 tracking-[0.25em] uppercase mb-6 transition-all duration-200 hover:opacity-80">
                SEE IT IN ACTION
              </div>
              
              <h2 className="text-4xl sm:text-5xl font-light leading-tight mb-6 transition-all duration-200 hover:opacity-80">
                <span className="bg-gradient-to-r from-white via-emerald-200 to-white bg-clip-text text-transparent transition-all duration-200 hover:opacity-80">
                  Ready to experience
                </span>
                <br />
                <span className="text-white/70 italic text-4xl sm:text-4xl transition-all duration-200 hover:opacity-80">autonomous research?</span>
              </h2>
              
              <p className="text-4xl text-white/50 mb-12 max-w-2xl mx-auto leading-relaxed transition-all duration-200 hover:opacity-80">
                Try NomosX free and see the agent pipeline in action.
              </p>
              
              <button
                onClick={() => setShowAuthModal(true)}
                className="group relative px-10 py-5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 text-white font-medium text-4xl shadow-[0_0_40px_rgba(16,185,129,0.4)] hover:shadow-[0_0_60px_rgba(16,185,129,0.6)] transition-all duration-300"
              >
                <span className="relative z-10 flex items-center justify-center gap-3 transition-all duration-200 hover:opacity-80">
                  Start for free
                  <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-white/10 relative z-10 transition-all duration-200 hover:opacity-80">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-200 hover:opacity-80">
            <div className="flex items-center gap-3 transition-all duration-200 hover:opacity-80">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center opacity-80 relative transition-all duration-200 hover:opacity-80">
                <span className="text-slate-100 font-serif text-xs font-bold tracking-tight transition-all duration-200 hover:opacity-80">N</span>
                {/* Orbital elements */}
                <div className="absolute inset-0 rounded-full border border-slate-600/30 transition-all duration-200 hover:opacity-80"></div>
                <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-0.5 h-0.5 bg-cyan-400 rounded-full opacity-60 transition-all duration-200 hover:opacity-80"></div>
                <div className="absolute right-0.5 top-1/2 -translate-y-1/2 w-0.5 h-0.5 bg-slate-400 rounded-full opacity-40 transition-all duration-200 hover:opacity-80"></div>
                <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-0.5 h-0.5 bg-slate-400 rounded-full opacity-40 transition-all duration-200 hover:opacity-80"></div>
                <div className="absolute left-0.5 top-1/2 -translate-y-1/2 w-0.5 h-0.5 bg-slate-400 rounded-full opacity-40 transition-all duration-200 hover:opacity-80"></div>
              </div>
              <div>
                <span className="text-sm font-serif font-bold tracking-tight text-white/60 transition-all duration-200 hover:opacity-80">
                  Nomos<span className="text-slate-400 transition-all duration-200 hover:opacity-80">X</span>
                </span>
                <p className="text-xs text-slate-500 transition-all duration-200 hover:opacity-80">Institutional Research Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-xs text-white/30 transition-all duration-200 hover:opacity-80">
              <button onClick={() => router.push("/")} className="hover:text-white transition-colors">
                Home
              </button>
              <span>© 2026 NomosX</span>
            </div>
          </div>
        </footer>
      </div>

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}
