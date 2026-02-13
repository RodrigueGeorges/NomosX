
"use client";
/**
 * About Page — Story, Mission & Vision
 * 
 * Purpose: Who we are, why NomosX exists, our vision for autonomous research
 * UX: Storytelling, institutional credibility, convert curiosity → trust
 */

import React from 'react';
import { useState,useEffect } from 'react';

import { useRouter } from 'next/navigation';
import AuthModal from '@/components/AuthModal';
import PublicNav from '@/components/PublicNav';
import { RESEARCHERS } from '@/lib/researchers';
import { Brain,Shield,Target,ArrowRight,Globe,Users,Lightbulb } from 'lucide-react';

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
      title: "Democratize Strategic Intelligence",
      description: "World-class research shouldn't be reserved for Fortune 500 companies. We built an autonomous council of 8 PhD-level AI researchers to make institutional-grade intelligence accessible to decision-makers everywhere."
    },
    {
      icon: Brain,
      title: "AI as Institutional Partner",
      description: "Not a chatbot. Not a search engine. A fully autonomous think tank with PhD-caliber researchers, editorial judgment, and institutional-grade quality standards—operating 24/7 to keep you ahead."
    },
    {
      icon: Shield,
      title: "Trust Through Transparency",
      description: "Every claim is cited. Every source is traceable. Every decision is logged. We believe trust is earned through radical transparency, not marketing promises."
    },
    {
      icon: Lightbulb,
      title: "Signal Over Noise",
      description: "In a world drowning in information, the most valuable service is knowing what matters. Our editorial gate ensures only rigorous, actionable intelligence reaches your desk."
    }
  ];

  const timeline = [
    {
      year: "2024",
      title: "The Problem",
      description: "Traditional think tanks take months to publish. AI tools produce shallow summaries. Decision-makers need something in between: fast, rigorous, and trustworthy."
    },
    {
      year: "2025",
      title: "The Experiment",
      description: "We built the first autonomous research pipeline. Multi-agent orchestration. Editorial gates. Quality thresholds. A system that delivers institutional rigor at unprecedented speed."
    },
    {
      year: "2026",
      title: "The Institution",
      description: "NomosX operates as a fully autonomous think tank. 200K+ sources monitored daily. Institutional-grade publications delivered to decision-makers worldwide. Research intelligence, democratized."
    }
  ];

  const values = [
    {
      title: "Rigor Over Speed",
      description: "We'd rather be slow and right than fast and wrong. Every publication passes through multiple validation layers."
    },
    {
      title: "Quality Over Quantity",
      description: "Every publication meets institutional standards. Our editorial gate ensures only rigorous, decision-ready intelligence is delivered."
    },
    {
      title: "Transparency Over Trust",
      description: "We don't ask you to trust us. We show you our sources, our reasoning, and our confidence levels."
    },
    {
      title: "Autonomy Over Control",
      description: "The council operates with full editorial independence. An autonomous system that thinks, evaluates, and publishes—like a real research institution."
    }
  ];

  return (
    <>
      <div className="min-h-screen bg-[#06060A] text-white">
        {/* Background Futuriste - Identique à Home */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          {/* Mesh gradient principal */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1400px] h-[900px]">
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/8 via-blue-500/4 to-transparent blur-3xl" />
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/6 via-transparent to-cyan-500/6 blur-3xl" />
          </div>
          
          {/* Grid pattern subtil */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px]" />
          
          {/* Particles réseau agentique - Client only to avoid hydration mismatch */}
          {mounted && (
            <div className="absolute inset-0">
              {[...Array(15)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-cyan-400/20 animate-pulse"
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
        <PublicNav currentPage="about" onSignInClick={() => setShowAuthModal(true)} />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          {/* Hero */}
          <div className="text-center mb-20">
            <div className="text-xs text-cyan-400/60 tracking-[0.25em] uppercase mb-6 flex items-center justify-center gap-3">
              <div className="w-8 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
              <span>The Autonomous Think Tank</span>
              <div className="w-8 h-px bg-gradient-to-r from-cyan-400/60 via-transparent to-transparent" />
            </div>

            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-light leading-tight mb-6">
              <span className="nx-gradient-text">
                An agentic think tank
              </span>
              <br />
              <span className="text-white/50 text-3xl sm:text-4xl">built for decision-makers</span>
            </h1>

            <p className="text-base sm:text-lg text-white/40 leading-relaxed max-w-3xl mx-auto mb-8">
              NomosX is an autonomous research council of {RESEARCHERS.length} PhD-level AI researchers 
              that democratizes institutional-grade intelligence. They continuously monitor 200,000+ academic 
              sources and deliver rigorous, citation-backed insights to every decision-maker—not just those 
              with six-figure consulting budgets.
            </p>

            <div className="flex gap-4 justify-center flex-wrap">
              <button 
                onClick={() => setShowAuthModal(true)}
                className="group px-8 py-4 rounded-xl bg-gradient-to-r from-[#00D4FF] to-[#3B82F6] text-white font-medium text-base shadow-[0_0_40px_rgba(0,212,255,0.25)] hover:shadow-[0_0_60px_rgba(0,212,255,0.4)] transition-all duration-500 flex items-center gap-3"
              >
                Start for free
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Our Vision */}
          <div className="mb-20">
            <div className="max-w-4xl mb-12">
              <div className="text-xs text-cyan-400/60 tracking-[0.25em] uppercase mb-6 flex items-center gap-3">
                <div className="w-8 h-px bg-gradient-to-r from-cyan-400/60 to-transparent" />
                <span>Our Vision</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-light leading-tight text-white/95 mb-4">
                Why we built NomosX
              </h2>
              <p className="text-base text-white/40 leading-relaxed max-w-3xl">
                We believe the future of strategic intelligence is autonomous, transparent, 
                and accessible to every decision-maker—not just those who can afford traditional consulting.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {vision.map((item, i) => (
                <div key={i} className="group relative p-8 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.03] to-white/[0.01] hover:border-cyan-500/30 transition-all duration-500 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                  
                  <div className="relative z-10">
                    <div className="w-16 h-16 rounded-xl mb-6 bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center group-hover:shadow-[0_0_30px_rgba(0,212,255,0.3)] transition-shadow duration-500">
                      <item.icon size={32} className="text-cyan-400" />
                    </div>
                    
                    <h3 className="font-display text-xl font-light mb-3 text-white/95">{item.title}</h3>
                    
                    <p className="text-sm text-white/40 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Our Story - Timeline */}
          <div className="mb-20">
            <div className="max-w-4xl mb-12">
              <div className="text-xs text-primary/60 tracking-[0.25em] uppercase mb-6 flex items-center gap-3">
                <div className="w-8 h-px bg-gradient-to-r from-blue-400/60 to-transparent" />
                <span>Our Story</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-light leading-tight text-white/95 mb-4">
                From idea to institution
              </h2>
              <p className="text-base text-white/40 leading-relaxed max-w-3xl">
                The journey from recognizing a problem to building an agentic think tank.
              </p>
            </div>

            <div className="space-y-6">
              {timeline.map((item, i) => (
                <div key={i} className="group relative p-8 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.03] to-white/[0.01] hover:border-primary/30 transition-all duration-500 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                  
                  <div className="relative flex items-start gap-8">
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-primary/20 flex items-center justify-center group-hover:shadow-[0_0_30px_rgba(74,127,224,0.3)] transition-shadow duration-500">
                        <span className="font-display text-xl font-light text-primary">{item.year}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display text-xl font-light mb-2 text-white/95">{item.title}</h3>
                      <p className="text-sm text-white/40 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Our Values */}
          <div className="mb-20">
            <div className="max-w-4xl mb-12">
              <div className="text-xs text-emerald-400/60 tracking-[0.25em] uppercase mb-6 flex items-center gap-3">
                <div className="w-8 h-px bg-gradient-to-r from-emerald-400/60 to-transparent" />
                <span>Our Values</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-light leading-tight text-white/95 mb-4">
                What we stand for
              </h2>
              <p className="text-base text-white/40 leading-relaxed max-w-3xl">
                Four principles that guide every decision our council makes.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {values.map((item, i) => (
                <div key={i} className="group relative p-8 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.03] to-white/[0.01] hover:border-emerald-500/30 transition-all duration-500 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                  
                  <div className="relative z-10">
                    <h3 className="font-display text-xl font-light mb-3 text-white/95">{item.title}</h3>
                    <p className="text-sm text-white/40 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Final Premium */}
          <div className="relative overflow-hidden pb-20">
            {/* Background effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-purple-500/10 rounded-3xl blur-2xl" />
            
            <div className="relative text-center p-10 sm:p-16 rounded-3xl border border-white/[0.08] bg-gradient-to-br from-white/[0.02] to-white/[0.01] backdrop-blur-xl">
              <div className="text-xs text-cyan-400/60 tracking-[0.25em] uppercase mb-6">
                START NOW
              </div>
              
              <h2 className="font-display text-3xl sm:text-4xl font-light leading-tight mb-6">
                <span className="nx-gradient-text">
                  Ready to elevate
                </span>
                <br />
                <span className="text-white/50 text-2xl sm:text-3xl">your strategic intelligence?</span>
              </h2>
              
              <p className="text-base text-white/40 mb-10 max-w-2xl mx-auto leading-relaxed">
                Join decision-makers using NomosX for institutional-grade research intelligence.
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
              
              <div className="flex items-center justify-center gap-6 mt-8 text-xs text-white/40">
                <span>No credit card required</span>
                <div className="w-1 h-1 rounded-full bg-cyan-400/40" />
                <span>Free tier available</span>
                <div className="w-1 h-1 rounded-full bg-cyan-400/40" />
                <span>60s to first analysis</span>
              </div>
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
              <button onClick={() => router.push("/methodology")} className="hover:text-white/50 transition-colors">Methodology</button>
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
