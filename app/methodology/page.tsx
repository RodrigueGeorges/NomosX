"use client";
import React from 'react';
import { useState, useEffect } from 'react';

/**
 * Methodology Page — Agentic Think Tank
 * 
 * Purpose: Explain the agent pipeline, data sources, scoring, and editorial process
 * UX: Technical credibility, transparency, convert skeptics → believers
 */

import { useRouter } from 'next/navigation';
import AuthModal from '@/components/AuthModal';
import PublicNav from '@/components/PublicNav';
import { Search, Database, BarChart3, FileText, Brain, Shield, ArrowRight, Globe, Zap, CheckCircle, Eye } from 'lucide-react';

export default function MethodologyPage() {
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const pillars = [
    {
      icon: Globe,
      title: "Global coverage",
      description: "Continuous monitoring of 250M+ academic sources for complete, up-to-date intelligence."
    },
    {
      icon: Brain,
      title: "Collective expertise",
      description: "8 PhD perspectives from leading institutions for multidimensional analysis."
    },
    {
      icon: Shield,
      title: "Academic rigor",
      description: "Verified citations, cross-validation, and full traceability for every insight."
    }
  ];

  const agents = [
    {
      name: "SCOUT",
      icon: Search,
      purpose: "Source discovery",
      description: "Queries 250M+ academic publications in parallel across multiple providers.",
      inputs: ["Research query", "Provider list"],
      outputs: ["Source IDs", "Quality scores", "Raw metadata"],
      providers: ["OpenAlex", "Crossref", "Semantic Scholar", "arXiv", "PubMed"],
      color: "bg-indigo-500"
    },
    {
      name: "INDEX",
      icon: Database,
      purpose: "Identity enrichment",
      description: "Normalizes sources, resolves author identities via ORCID, and maps affiliations via ROR.",
      inputs: ["SCOUT source IDs"],
      outputs: ["Enriched sources", "Author profiles", "Institution profiles"],
      providers: ["ORCID API", "ROR API", "Internal deduplication"],
      color: "bg-violet-500"
    },
    {
      name: "RANK",
      icon: BarChart3,
      purpose: "Strategic selection",
      description: "Selects the best sources with quality, novelty, and diversity controls.",
      inputs: ["Enriched sources", "Query context"],
      outputs: ["Ranked sources", "Composite scores"],
      providers: ["Internal scoring algorithm"],
      color: "bg-purple-500"
    },
    {
      name: "READER",
      icon: FileText,
      purpose: "Content analysis",
      description: "Extracts key claims, methods, results, and limitations from full-text content.",
      inputs: ["Ranked sources", "Analysis depth"],
      outputs: ["Structured readings", "Key insights", "Confidence scores"],
      providers: ["PDF parsing", "LLM analysis"],
      color: "bg-fuchsia-500"
    },
    {
      name: "ANALYST",
      icon: Brain,
      purpose: "Strategic synthesis",
      description: "Synthesizes multiple sources into coherent, decision-grade intelligence.",
      inputs: ["Readings", "Research question", "Context"],
      outputs: ["Structured analysis", "Key findings", "Strategic implications"],
      providers: ["Multi-pass LLM synthesis"],
      color: "bg-pink-500"
    },
    {
      name: "CITATION GUARD",
      icon: CheckCircle,
      purpose: "Citation validation",
      description: "Validates that every [SRC-N] maps to a real, accessible source.",
      inputs: ["Full analysis", "Source list"],
      outputs: ["Validity score", "Invalid citations detected"],
      providers: ["Semantic validation", "LLM matching"],
      color: "bg-emerald-500"
    }
  ];

  const guarantees = [
    {
      title: "Rigor before speed",
      description: "Every publication goes through multiple validation layers. We prefer slower and correct over fast and wrong."
    },
    {
      title: "Quality before quantity",
      description: "Our editorial filter ensures that only rigorous, decision-grade intelligence is delivered."
    },
    {
      title: "Transparency before trust",
      description: "We show sources, reasoning, and confidence levels. No black box."
    },
    {
      title: "Autonomy before control",
      description: "The council operates with full editorial independence, like a real research institution."
    }
  ];

  return (
    <>
      <div className="min-h-screen bg-[#09090b] text-white overflow-hidden">
        {/* Background */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.12),transparent_70%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_80%_80%,rgba(139,92,246,0.06),transparent_70%)]" />
        </div>

        {/* Nav */}
        <PublicNav currentPage="methodology" onSignInClick={() => setShowAuthModal(true)} />

        <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 py-20 sm:py-28">
          {/* Hero */}
          <div className={`text-center mb-24 ${mounted ? 'animate-fade-in' : 'opacity-0'}`}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/5 mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse-glow" />
              <span className="text-xs text-indigo-300 font-medium tracking-wide">METHODOLOGY</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.08] tracking-tight mb-6">
              <span className="text-white">Pipeline</span>
              <br />
              <span className="nx-gradient-text">architecture</span>
            </h1>

            <p className="text-lg text-white/50 leading-relaxed max-w-2xl mx-auto mb-8 font-light">
              Our multi-agent architecture guarantees academic rigor at unmatched speed. 
              See how 250M+ sources become decision-grade intelligence.
            </p>

            <button 
              onClick={() => setShowAuthModal(true)}
              className="group px-6 py-3 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white font-medium text-sm transition-all duration-300 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 inline-flex items-center gap-2"
            >
              Test the pipeline
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Pillars */}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 mb-24 ${mounted ? 'animate-fade-in delay-200' : 'opacity-0'}`}>
            {pillars.map((item, i) => (
              <div key={i} className="p-7 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-indigo-500/20 transition-all duration-300">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/15 flex items-center justify-center mb-5">
                  <item.icon size={18} className="text-indigo-400" />
                </div>
                <h3 className="font-display text-base font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>

          {/* Agent Pipeline */}
          <div className="mb-24">
            <div className="mb-12">
              <p className="text-xs text-indigo-400/80 font-medium tracking-[0.2em] uppercase mb-4">Architecture</p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white mb-3">
                Multi-agent pipeline
              </h2>
              <p className="text-base text-white/40 max-w-2xl">
                Each agent has a single responsibility. The pipeline orchestrates 15+ specialized agents 
                to transform your question into decision-grade intelligence.
              </p>
            </div>

            <div className="space-y-3">
              {agents.map((agent, i) => (
                <div key={i} className="group p-6 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-300">
                  <div className="flex items-start gap-5">
                    {/* Step indicator */}
                    <div className="flex-shrink-0 flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-lg ${agent.color} flex items-center justify-center shadow-lg`}>
                        <agent.icon size={16} className="text-white" />
                      </div>
                      {i < agents.length - 1 && (
                        <div className="w-px h-full min-h-[20px] bg-white/[0.06] mt-2" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-display text-sm font-semibold text-white">{agent.name}</h3>
                        <span className="text-[10px] font-mono text-white/20 bg-white/[0.04] px-2 py-0.5 rounded">{String(i + 1).padStart(2, '0')}</span>
                        <span className="text-xs text-white/30">{agent.purpose}</span>
                      </div>
                      <p className="text-sm text-white/40 mb-3">{agent.description}</p>

                      {/* IO chips */}
                      <div className="flex flex-wrap gap-4 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-white/20">In:</span>
                          <div className="flex flex-wrap gap-1">
                            {agent.inputs.map((inp, j) => (
                              <span key={j} className="px-2 py-0.5 bg-white/[0.04] border border-white/[0.06] rounded text-white/40">{inp}</span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-white/20">Out:</span>
                          <div className="flex flex-wrap gap-1">
                            {agent.outputs.map((out, j) => (
                              <span key={j} className="px-2 py-0.5 bg-indigo-500/[0.06] border border-indigo-500/10 rounded text-indigo-300/60">{out}</span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Providers */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {agent.providers.map((p, j) => (
                          <span key={j} className="text-[10px] text-white/20">{p}{j < agent.providers.length - 1 ? " ·" : ""}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Guarantees */}
          <div className="mb-24">
            <div className="mb-12">
              <p className="text-xs text-indigo-400/80 font-medium tracking-[0.2em] uppercase mb-4">Guarantees</p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white mb-3">
                Foundational principles
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {guarantees.map((item, i) => (
                <div key={i} className="group p-7 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-6 h-6 rounded-md bg-white/[0.06] flex items-center justify-center text-xs font-mono text-white/30 font-medium">
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <h3 className="font-display text-base font-semibold text-white">{item.title}</h3>
                  </div>
                  <p className="text-sm text-white/40 leading-relaxed pl-9">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="relative text-center py-16">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[400px] h-[250px] bg-indigo-500/[0.08] rounded-full blur-[100px]" />
            </div>
            <div className="relative">
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white mb-4">
                Test the pipeline
                <br />
                <span className="nx-gradient-text">yourself</span>
              </h2>
              <p className="text-base text-white/40 mb-8 max-w-xl mx-auto">
                Ask your first question and watch the multi-agent pipeline in action.
              </p>
              <button
                onClick={() => setShowAuthModal(true)}
                className="group px-6 py-3 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white font-medium text-sm transition-all duration-300 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 inline-flex items-center gap-2"
              >
                Start free
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
              <div className="flex items-center justify-center gap-5 mt-6 text-xs text-white/30">
                <span>Free</span>
                <span className="w-1 h-1 rounded-full bg-white/10" />
                <span>No credit card</span>
                <span className="w-1 h-1 rounded-full bg-white/10" />
                <span>First analysis in 60s</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-white/[0.06] relative z-10">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                <span className="text-[10px] font-bold text-white">N</span>
              </div>
              <span className="text-sm text-white/40 font-medium">NomosX</span>
              <span className="text-xs text-white/20">· Autonomous Think Tank</span>
            </div>
            <div className="flex items-center gap-6 text-xs text-white/20">
              <button onClick={() => router.push("/")} className="hover:text-white/40 transition-colors">Home</button>
              <button onClick={() => router.push("/about")} className="hover:text-white/40 transition-colors">About</button>
              <button onClick={() => router.push("/pricing")} className="hover:text-white/40 transition-colors">Pricing</button>
              <span>© 2026 NomosX</span>
            </div>
          </div>
        </footer>
      </div>

      {showAuthModal && (
        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSignupSuccess={() => setShowAuthModal(false)}
        />
      )}
    </>
  );
}
