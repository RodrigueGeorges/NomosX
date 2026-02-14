"use client";
import React from 'react';
import { useState,useEffect } from 'react';

/**
 * Methodology Page — Deep Technical Dive
 * 
 * Purpose: Explain the agent pipeline, data sources, scoring, and editorial process
 * UX: Technical credibility, transparency, convert skeptics → believers
 */

import { useRouter } from 'next/navigation';
import AuthModal from '@/components/AuthModal';
import PublicNav from '@/components/PublicNav';
import { Search,Database,BarChart3,FileText,Brain,Shield,ArrowRight,CheckCircle,Zap,GitBranch,Lock,Eye } from 'lucide-react';

export default function MethodologyPage() {
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
      description: "Evaluates every publication proposal against quality thresholds, cadence limits, and editorial standards. Ensures only institutional-grade insights reach decision-makers.",
      inputs: ["Draft", "Signal", "Quality metrics"],
      outputs: ["Decision (PUBLISH/HOLD/REJECT/DEFER)", "Reasons", "Scores"],
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
      <div className="min-h-screen bg-[#06060A] text-white">
        {/* Background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1400px] h-[900px]">
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/8 via-blue-500/4 to-transparent blur-3xl" />
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/6 via-transparent to-emerald-500/6 blur-3xl" />
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px]" />
          {mounted && (
            <div className="absolute inset-0">
              {[...Array(15)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-emerald-400/20 animate-pulse"
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

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          {/* Hero */}
          <div className="text-center mb-20">
            <div className="text-xs text-emerald-400/60 tracking-[0.25em] uppercase mb-6 flex items-center justify-center gap-3">
              <div className="w-8 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />
              <span>Technical Deep Dive</span>
              <div className="w-8 h-px bg-gradient-to-r from-emerald-400/60 via-transparent to-transparent" />
            </div>

            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-light leading-tight mb-6">
              <span className="nx-gradient-text">
                How NomosX Works
              </span>
              <br />
              <span className="text-white/50 text-3xl sm:text-4xl">The research pipeline explained</span>
            </h1>

            <p className="text-base sm:text-lg text-white/40 leading-relaxed max-w-3xl mx-auto mb-8">
              Six specialized agents orchestrate the research cycle, from source discovery 
              to editorial decision. Fully autonomous, transparent, and auditable.
            </p>
          </div>

          {/* Agent Pipeline */}
          <div className="mb-20">
            <div className="max-w-4xl mb-12">
              <div className="text-xs text-emerald-400/60 tracking-[0.25em] uppercase mb-6 flex items-center gap-3">
                <div className="w-8 h-px bg-gradient-to-r from-emerald-400/60 to-transparent" />
                <span>Agent Pipeline</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-light leading-tight text-white/95 mb-4">
                Six agents, one mission
              </h2>
              <p className="text-base text-white/40 leading-relaxed max-w-3xl">
                Each agent has a single responsibility, deterministic behavior, and traceable outputs.
                They communicate via database and job queue.
              </p>
            </div>

            <div className="space-y-6">
              {agents.map((agent, i) => {
                const colors = colorMap[agent.color];
                return (
                  <div key={i} className={`group relative p-8 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.03] to-white/[0.01] ${colors.hover} transition-all duration-500 overflow-hidden`}>
                    <div className="relative flex flex-col lg:flex-row lg:items-start gap-6">
                      {/* Agent Header */}
                      <div className="flex-shrink-0 flex items-center gap-4">
                        <div className={`w-16 h-16 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center`}>
                          <agent.icon size={32} className={colors.text} />
                        </div>
                        <div className="lg:hidden">
                          <div className={`text-xs ${colors.text} tracking-[0.25em] uppercase mb-1`}>{agent.name}</div>
                          <h3 className="font-display text-xl font-light text-white/95">{agent.purpose}</h3>
                        </div>
                      </div>

                      {/* Agent Content */}
                      <div className="flex-1">
                        <div className="hidden lg:block mb-4">
                          <div className={`text-xs ${colors.text} tracking-[0.25em] uppercase mb-1`}>{agent.name}</div>
                          <h3 className="font-display text-xl font-light text-white/95">{agent.purpose}</h3>
                        </div>
                        
                        <p className="text-sm text-white/40 leading-relaxed mb-6">
                          {agent.description}
                        </p>

                        <div className="grid sm:grid-cols-3 gap-4">
                          <div>
                            <div className="text-xs text-white/30 uppercase tracking-wider mb-2">Inputs</div>
                            <ul className="space-y-1">
                              {agent.inputs.map((input, j) => (
                                <li key={j} className="text-sm text-white/60 flex items-center gap-2">
                                  <ArrowRight size={12} className={colors.text} />
                                  {input}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <div className="text-xs text-white/30 uppercase tracking-wider mb-2">Outputs</div>
                            <ul className="space-y-1">
                              {agent.outputs.map((output, j) => (
                                <li key={j} className="text-sm text-white/60 flex items-center gap-2">
                                  <CheckCircle size={12} className={colors.text} />
                                  {output}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <div className="text-xs text-white/30 uppercase tracking-wider mb-2">Providers</div>
                            <ul className="space-y-1">
                              {agent.providers.map((provider, j) => (
                                <li key={j} className="text-sm text-white/60 flex items-center gap-2">
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
          <div className="mb-20">
            <div className="max-w-4xl mb-12">
              <div className="text-xs text-primary/60 tracking-[0.25em] uppercase mb-6 flex items-center gap-3">
                <div className="w-8 h-px bg-gradient-to-r from-blue-400/60 to-transparent" />
                <span>Data Sources</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-light leading-tight text-white/95 mb-4">
                Where we get our data
              </h2>
              <p className="text-base text-white/40 leading-relaxed max-w-3xl">
                We aggregate from the world's leading academic databases and identity registries.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {dataSources.map((source, i) => (
                <div key={i} className="group relative p-6 rounded-xl border border-white/[0.08] bg-gradient-to-br from-white/[0.03] to-white/[0.01] hover:border-primary/30 transition-all duration-300">
                  <div className="relative z-10">
                    <h3 className="font-display text-base font-medium text-white/95 mb-1">{source.name}</h3>
                    <div className="text-xs text-primary/60 uppercase tracking-wider mb-3">{source.type}</div>
                    <div className="space-y-1 text-sm text-white/50">
                      <div>{source.coverage}</div>
                      <div className="text-white/30">Updated: {source.update}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quality Metrics */}
          <div className="mb-20">
            <div className="max-w-4xl mb-12">
              <div className="text-xs text-secondary/60 tracking-[0.25em] uppercase mb-6 flex items-center gap-3">
                <div className="w-8 h-px bg-gradient-to-r from-purple-400/60 to-transparent" />
                <span>Quality Metrics</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-light leading-tight text-white/95 mb-4">
                How we measure quality
              </h2>
              <p className="text-base text-white/40 leading-relaxed max-w-3xl">
                Every source and publication is scored against multiple quality dimensions.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {qualityMetrics.map((item, i) => (
                <div key={i} className="group relative p-6 rounded-xl border border-white/[0.08] bg-gradient-to-br from-white/[0.03] to-white/[0.01] hover:border-secondary/30 transition-all duration-300">
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-display text-lg font-light text-white/95">{item.metric}</h3>
                      <span className="text-sm text-secondary font-mono">{item.range}</span>
                    </div>
                    <div className="text-sm text-emerald-400/80 mb-3">Threshold: {item.threshold}</div>
                    <p className="text-sm text-white/50">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Editorial Process */}
          <div className="mb-20">
            <div className="max-w-4xl mb-12">
              <div className="text-xs text-red-400/60 tracking-[0.25em] uppercase mb-6 flex items-center gap-3">
                <div className="w-8 h-px bg-gradient-to-r from-red-400/60 to-transparent" />
                <span>Editorial Process</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-light leading-tight text-white/95 mb-4">
                The Editorial Gate
              </h2>
              <p className="text-base text-white/40 leading-relaxed max-w-3xl">
                Every publication proposal passes through our autonomous editorial gate.
                Only research that meets institutional standards reaches your desk.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { decision: "PUBLISH", color: "emerald", icon: CheckCircle, description: "Meets all quality thresholds and editorial standards" },
                { decision: "HOLD", color: "amber", icon: Eye, description: "Needs more evidence or refinement before publication" },
                { decision: "REJECT", color: "red", icon: Lock, description: "Does not meet quality standards or contains issues" },
                { decision: "DEFER", color: "purple", icon: GitBranch, description: "Deferred — monitoring continues until evidence is conclusive" }
              ].map((item, i) => (
                <div key={i} className={`group relative p-6 rounded-xl border border-white/[0.08] bg-gradient-to-br from-white/[0.03] to-white/[0.01] hover:border-${item.color}-500/30 transition-all duration-300`}>
                  <div className="relative z-10 text-center">
                    <div className={`w-12 h-12 rounded-xl bg-${item.color}-500/10 border border-${item.color}-500/20 flex items-center justify-center mx-auto mb-4`}>
                      <item.icon size={24} className={`text-${item.color}-400`} />
                    </div>
                    <h3 className={`font-display text-base font-medium text-${item.color}-400 mb-2`}>{item.decision}</h3>
                    <p className="text-sm text-white/50">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-blue-500/5 to-purple-500/10 rounded-3xl blur-2xl" />
            
            <div className="relative text-center p-10 sm:p-16 rounded-3xl border border-white/[0.08] bg-gradient-to-br from-white/[0.02] to-white/[0.01] backdrop-blur-xl">
              <div className="text-xs text-emerald-400/60 tracking-[0.25em] uppercase mb-6">
                SEE IT IN ACTION
              </div>
              
              <h2 className="font-display text-3xl sm:text-4xl font-light leading-tight mb-6">
                <span className="nx-gradient-text">
                  Ready to experience
                </span>
                <br />
                <span className="text-white/50 text-2xl sm:text-3xl">autonomous research?</span>
              </h2>
              
              <p className="text-base text-white/40 mb-10 max-w-2xl mx-auto leading-relaxed">
                Try NomosX free and see the research pipeline in action.
              </p>
              
              <button
                onClick={() => setShowAuthModal(true)}
                className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-[#00D4FF]/20 to-[#3B82F6]/20 border border-[#00D4FF]/20 text-white font-medium text-sm hover:border-[#00D4FF]/40 transition-all shadow-[0_0_30px_rgba(0,212,255,0.15)]"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Get started free
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-white/[0.06] relative z-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#00D4FF]/10 to-[#7C3AED]/5 border border-white/[0.06] flex items-center justify-center">
                <span className="font-display text-xs font-medium nx-gradient-text">N</span>
              </div>
              <div>
                <span className="font-display text-sm font-medium tracking-tight text-white/50">
                  Nomos<span className="text-[#00D4FF]/60">X</span>
                </span>
                <p className="text-[10px] text-white/20">Institutional Intelligence, Democratized</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-xs text-white/20">
              <button onClick={() => router.push("/")} className="hover:text-white/50 transition-colors">Home</button>
              <button onClick={() => router.push("/about")} className="hover:text-white/50 transition-colors">About</button>
              <button onClick={() => router.push("/pricing")} className="hover:text-white/50 transition-colors">Pricing</button>
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
