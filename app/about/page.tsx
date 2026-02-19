"use client";
/**
 * About Page — Agentic Think Tank
 * 
 * Purpose: Who we are, why NomosX exists, our vision for autonomous research
 * UX: Storytelling, institutional credibility, convert curiosity → trust
 */

import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthModal from '@/components/AuthModal';
import PublicNav from '@/components/PublicNav';
import { RESEARCHERS } from '@/lib/researchers';
import { Brain, Shield, ArrowRight, Globe, Lightbulb } from 'lucide-react';

export default function AboutPage() {
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const vision = [
    {
      icon: Globe,
      title: "Democratize strategic intelligence",
      description: "Institutional-grade research should not be reserved for Fortune 500 organizations. We built an autonomous council of AI researchers to make decision intelligence accessible to every serious team."
    },
    {
      icon: Brain,
      title: "AI as an institutional partner",
      description: "Not a chatbot, not a search engine. An autonomous think tank with PhD-calibrated researchers, editorial judgment, and institutional quality standards operating 24/7."
    },
    {
      icon: Shield,
      title: "Trust through transparency",
      description: "Every claim is sourced. Every source is traceable. Every decision is logged. Trust is earned through radical transparency, not marketing language."
    },
    {
      icon: Lightbulb,
      title: "Signal over noise",
      description: "In an overloaded information ecosystem, the most valuable service is knowing what matters. Our editorial filter ensures only rigorous, actionable intelligence reaches you."
    }
  ];

  const timeline = [
    {
      year: "2024",
      title: "The diagnosis",
      description: "Traditional think tanks publish in months. Most AI tools produce shallow summaries. Decision teams need a middle path: fast, rigorous, and reliable."
    },
    {
      year: "2025",
      title: "The experimentation",
      description: "We built the first autonomous research pipeline: multi-agent orchestration, editorial filters, and hard quality thresholds. Institutional rigor delivered at unprecedented speed."
    },
    {
      year: "2026",
      title: "The institution",
      description: "NomosX now operates as a fully autonomous think tank. 250M+ sources monitored, institution-grade publications delivered to decision-makers worldwide."
    }
  ];

  const values = [
    {
      title: "Rigor before speed",
      description: "We prefer being slower and right over fast and wrong. Every publication goes through multiple validation layers."
    },
    {
      title: "Quality before quantity",
      description: "Every publication meets institutional standards. Our editorial filter ensures only rigorous intelligence is delivered."
    },
    {
      title: "Transparency before trust",
      description: "We do not ask for blind trust. We show our sources, reasoning, and confidence levels."
    },
    {
      title: "Autonomy before control",
      description: "The council operates with full editorial independence. An autonomous system that thinks, evaluates, and publishes like a real research institution."
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
        <PublicNav currentPage="about" onSignInClick={() => setShowAuthModal(true)} />

        <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 py-20 sm:py-28">
          {/* Hero */}
          <div className={`text-center mb-24 ${mounted ? 'animate-fade-in' : 'opacity-0'}`}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/5 mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse-glow" />
              <span className="text-xs text-indigo-300 font-medium tracking-wide">ABOUT</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.08] tracking-tight mb-6">
              <span className="text-white">The first</span>
              <br />
              <span className="nx-gradient-text">autonomous think tank</span>
            </h1>

            <p className="text-lg text-white/50 leading-relaxed max-w-2xl mx-auto mb-8 font-light">
              NomosX is the first agentic think tank with {RESEARCHERS.length} PhD-level perspectives 
              built to democratize institutional intelligence. Continuous monitoring of 250M+ academic 
              sources, with rigorous and verifiable insights.
            </p>

            <button 
              onClick={() => setShowAuthModal(true)}
              className="group px-6 py-3 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white font-medium text-sm transition-all duration-300 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 inline-flex items-center gap-2"
            >
              Start free
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Vision */}
          <div className="mb-24">
            <div className="mb-12">
              <p className="text-xs text-indigo-400/80 font-medium tracking-[0.2em] uppercase mb-4">Our vision</p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white mb-3">
                Why NomosX exists
              </h2>
              <p className="text-base text-white/40 max-w-2xl">
                The future of strategic intelligence is autonomous, transparent, 
                and accessible to every decisive team.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {vision.map((item, i) => (
                <div key={i} className="group p-7 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-indigo-500/20 transition-all duration-300">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/15 flex items-center justify-center mb-5 group-hover:border-indigo-500/30 transition-colors">
                    <item.icon size={18} className="text-indigo-400" />
                  </div>
                  <h3 className="font-display text-base font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="mb-24">
            <div className="mb-12">
              <p className="text-xs text-indigo-400/80 font-medium tracking-[0.2em] uppercase mb-4">Our timeline</p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white mb-3">
                From idea to institution
              </h2>
              <p className="text-base text-white/40 max-w-2xl">
                The path from diagnosis to a fully autonomous think tank.
              </p>
            </div>

            <div className="space-y-4">
              {timeline.map((item, i) => (
                <div key={i} className="group flex items-start gap-6 p-7 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-300">
                  <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500/10 to-violet-500/5 border border-indigo-500/15 flex items-center justify-center group-hover:border-indigo-500/30 transition-colors">
                    <span className="font-display text-lg font-semibold text-indigo-400">{item.year}</span>
                  </div>
                  <div>
                    <h3 className="font-display text-base font-semibold text-white mb-1.5">{item.title}</h3>
                    <p className="text-sm text-white/40 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Values */}
          <div className="mb-24">
            <div className="mb-12">
              <p className="text-xs text-indigo-400/80 font-medium tracking-[0.2em] uppercase mb-4">Our principles</p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white mb-3">
                What guides us
              </h2>
              <p className="text-base text-white/40 max-w-2xl">
                Four principles guiding every council-level decision.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {values.map((item, i) => (
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
                Ready to elevate your
                <br />
                <span className="nx-gradient-text">strategic intelligence?</span>
              </h2>
              <p className="text-base text-white/40 mb-8 max-w-xl mx-auto">
                Join decision teams using NomosX for institutional-grade intelligence.
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
              <button onClick={() => router.push("/methodology")} className="hover:text-white/40 transition-colors">Methodology</button>
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
