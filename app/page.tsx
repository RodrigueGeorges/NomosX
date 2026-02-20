"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthModal from '@/components/AuthModal';
import OnboardingModal from '@/components/OnboardingModal';
import PublicNav from '@/components/PublicNav';
import { Brain, Shield, BarChart3, TrendingUp, ArrowRight, Clock, Search, FileText, Microscope, Scale, Leaf, Calculator, Globe2 } from 'lucide-react';
import InteractiveDemo from '@/components/InteractiveDemo';

const RESEARCHERS = [
  { name: "Dr. Elena Vasquez",  short: "Vasquez",  title: "Econometrics & Policy",    institution: "MIT",          initials: "EV", color: "from-indigo-500 to-blue-600",   border: "border-indigo-500/40",  glow: "shadow-indigo-500/30",  specialty: "Macro policy · Carbon pricing · Labor markets",   icon: BarChart3 },
  { name: "Dr. James Chen",     short: "Chen",     title: "AI & Digital Systems",     institution: "Stanford",     initials: "JC", color: "from-violet-500 to-purple-600", border: "border-violet-500/40",  glow: "shadow-violet-500/30",  specialty: "LLM governance · Tech regulation · Digital infra", icon: Brain },
  { name: "Dr. Amara Okafor",   short: "Okafor",   title: "Public Policy",            institution: "Oxford",       initials: "AO", color: "from-emerald-500 to-teal-600",  border: "border-emerald-500/40", glow: "shadow-emerald-500/30", specialty: "Institutional design · Democracy · Africa policy",  icon: Globe2 },
  { name: "Dr. Sarah Lindström",short: "Lindström",title: "Epidemiology & Health",    institution: "Johns Hopkins",initials: "SL", color: "from-rose-500 to-pink-600",     border: "border-rose-500/40",    glow: "shadow-rose-500/30",    specialty: "Pandemic prep · Health equity · Biostatistics",    icon: Microscope },
  { name: "Dr. Marcus Webb",    short: "Webb",     title: "Strategic Security",       institution: "Georgetown",   initials: "MW", color: "from-amber-500 to-orange-600",  border: "border-amber-500/40",   glow: "shadow-amber-500/30",   specialty: "Geopolitics · Defense strategy · Intelligence",     icon: Shield },
  { name: "Dr. Isabelle Moreau",short: "Moreau",   title: "International Law",        institution: "Yale Law",     initials: "IM", color: "from-cyan-500 to-sky-600",      border: "border-cyan-500/40",    glow: "shadow-cyan-500/30",    specialty: "Regulatory frameworks · Trade law · Human rights",  icon: Scale },
  { name: "Dr. Kenji Tanaka",   short: "Tanaka",   title: "Climate & Environment",    institution: "ETH Zürich",   initials: "KT", color: "from-green-500 to-lime-600",    border: "border-green-500/40",   glow: "shadow-green-500/30",   specialty: "Climate systems · Carbon markets · Net-zero policy",icon: Leaf },
  { name: "Dr. Priya Sharma",   short: "Sharma",   title: "Quantitative Methods",     institution: "Harvard",      initials: "PS", color: "from-fuchsia-500 to-violet-600",border: "border-fuchsia-500/40", glow: "shadow-fuchsia-500/30", specialty: "Causal inference · Meta-analysis · Bayesian methods",icon: Calculator },
];

export default function HomePage() {
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [activeR, setActiveR] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
    fetch('/api/auth/me').then(r => { if (r.ok) setIsAuthenticated(true); }).catch(() => {}).finally(() => setIsLoading(false));
  }, []);

  const handleAuthSuccess = () => { setIsAuthenticated(true); setShowAuthModal(false); setShowOnboardingModal(true); };

  if (isLoading) return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <>
      <div className="min-h-screen bg-[#09090b] text-white overflow-x-hidden">

        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_55%_at_50%_-10%,rgba(99,102,241,0.20),transparent_65%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_85%_60%,rgba(139,92,246,0.10),transparent_70%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_30%_30%_at_10%_80%,rgba(16,185,129,0.07),transparent_70%)]" />
          <div className="nx-grid-bg absolute inset-0 opacity-30" />
        </div>

        <div className="relative z-10">
          <PublicNav currentPage="home" onSignInClick={() => setShowAuthModal(true)} isAuthenticated={isAuthenticated} />

          {/* HERO */}
          <section className="relative px-6 sm:px-8 pt-24 sm:pt-32 pb-16">
            <div className="max-w-5xl mx-auto text-center">
              <div className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-indigo-500/25 bg-indigo-500/8 mb-10 transition-opacity duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-400" />
                </span>
                <span className="text-xs text-indigo-300 font-semibold tracking-[0.18em] uppercase">Autonomous Think Tank · Live</span>
              </div>

              <h1 className={`font-display text-5xl sm:text-6xl md:text-[5.5rem] font-bold leading-[1.03] tracking-tight mb-7 transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                <span className="text-white">Institutional</span>
                <br />
                <span className="nx-gradient-text">research intelligence</span>
                <br />
                <span className="text-white/35">for decisive teams</span>
              </h1>
              
              <p className={`text-lg sm:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed font-light transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                Eight PhD-calibrated AI researchers analyze <strong className="text-white/75 font-semibold">250M+ academic publications</strong> and deliver source-grounded strategic briefs in 60 seconds.
              </p>

              <div className={`flex flex-col sm:flex-row gap-3 justify-center mb-12 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                <button onClick={() => setShowAuthModal(true)} className="group px-7 py-3.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] flex items-center justify-center gap-2">
                  Start free — no card required
                  <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
                <button onClick={() => router.push('/methodology')} className="px-7 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.07] hover:border-white/[0.15] font-medium text-sm transition-all duration-200">
                  How it works
                </button>
              </div>

              <div className={`flex flex-wrap items-center justify-center gap-10 transition-all duration-700 delay-400 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
                {[{ value: "250M+", label: "Academic sources" }, { value: "8", label: "PhD researchers" }, { value: "60s", label: "Analysis runtime" }, { value: "99.2%", label: "Citation precision" }].map((s, i) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl sm:text-3xl font-display font-bold text-white">{s.value}</div>
                    <div className="text-xs text-white/35 mt-0.5 tracking-wide">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* THINK TANK */}
          <section className="relative px-6 sm:px-8 py-24 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(99,102,241,0.07),transparent_70%)] pointer-events-none" />
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <p className="text-xs text-indigo-400 font-semibold tracking-[0.25em] uppercase mb-4">The Think Tank</p>
                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-5">
                  Meet your 8 AI researchers
                </h2>
                <p className="text-base sm:text-lg text-white/45 max-w-2xl mx-auto leading-relaxed">
                  Each researcher holds a PhD-calibrated domain mandate. Every analysis is reviewed by the full council before publication.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {RESEARCHERS.map((r, i) => {
                  const Icon = r.icon;
                  const isActive = activeR === i;
                  return (
                    <div
                      key={i}
                      onMouseEnter={() => setActiveR(i)}
                      onMouseLeave={() => setActiveR(null)}
                      className={`group relative rounded-2xl border bg-white/[0.02] cursor-default transition-all duration-300 overflow-hidden ${isActive ? `${r.border} bg-white/[0.05] scale-[1.02] shadow-xl ${r.glow}` : 'border-white/[0.07] hover:border-white/[0.12]'}`}
                    >
                      <div className={`h-0.5 w-full bg-gradient-to-r ${r.color} opacity-70`} />
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-4">
                          <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${r.color} flex items-center justify-center shadow-lg transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}>
                            <span className="text-sm font-bold text-white">{r.initials}</span>
                          </div>
                          <div className={`w-7 h-7 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center transition-all duration-300 ${isActive ? 'border-white/20 bg-white/[0.08]' : ''}`}>
                            <Icon size={13} className="text-white/50" />
                          </div>
                        </div>
                        <div className="mb-3">
                          <h3 className="text-sm font-semibold text-white leading-tight mb-0.5">{r.name}</h3>
                          <p className="text-xs text-white/45 font-medium">{r.title}</p>
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/[0.05] border border-white/[0.08] mb-3">
                          <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-br ${r.color}`} />
                          <span className="text-[10px] font-semibold text-white/50 tracking-wide">{r.institution}</span>
                        </div>
                        <p className={`text-[10px] text-white/35 leading-relaxed transition-all duration-300 ${isActive ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                          {r.specialty}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-10 flex items-center justify-center gap-3">
                <div className="h-px flex-1 max-w-[120px] bg-gradient-to-r from-transparent to-white/10" />
                <p className="text-xs text-white/30 text-center">
                  All 8 researchers review every brief via the <span className="text-white/50 font-medium">Harvard Council Protocol</span> before publication
                </p>
                <div className="h-px flex-1 max-w-[120px] bg-gradient-to-l from-transparent to-white/10" />
              </div>
            </div>
          </section>

          {/* PIPELINE */}
          <section className="relative px-6 sm:px-8 py-20">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-14">
                <p className="text-xs text-indigo-400 font-semibold tracking-[0.25em] uppercase mb-4">Agentic Pipeline</p>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">From question to brief in 6 stages</h2>
                <p className="text-base text-white/40 max-w-xl mx-auto">Each agent has one mission. The pipeline transforms your question into decision-grade intelligence.</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { icon: Search,     label: "SCOUT",   desc: "250M+ sources",    color: "from-indigo-500 to-blue-600",    step: "01" },
                  { icon: BarChart3,  label: "RANK",    desc: "Quality filter",   color: "from-violet-500 to-purple-600",  step: "02" },
                  { icon: FileText,   label: "READER",  desc: "Claim extraction", color: "from-purple-500 to-fuchsia-600", step: "03" },
                  { icon: Brain,      label: "ANALYST", desc: "3-pass synthesis", color: "from-fuchsia-500 to-pink-600",   step: "04" },
                  { icon: Shield,     label: "COUNCIL", desc: "8 PhD review",     color: "from-rose-500 to-red-600",       step: "05" },
                  { icon: TrendingUp, label: "PUBLISH", desc: "Grounded brief",   color: "from-emerald-500 to-teal-600",   step: "06" },
                ].map((step, i) => {
                  const Icon = step.icon;
                  return (
                    <div key={i} className="group relative p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.14] transition-all duration-300 text-center">
                      <div className="text-[9px] font-mono text-white/20 mb-3 tracking-widest">{step.step}</div>
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <Icon size={15} className="text-white" />
                      </div>
                      <div className="text-xs font-bold text-white mb-1 tracking-wide">{step.label}</div>
                      <div className="text-[10px] text-white/35 leading-tight">{step.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* LIVE DEMO */}
          <section className="relative px-6 sm:px-8 py-20">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <p className="text-xs text-indigo-400 font-semibold tracking-[0.25em] uppercase mb-4">Live Demo</p>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">Watch the pipeline run</h2>
                <p className="text-base text-white/40 max-w-xl mx-auto">A new research question is processed end-to-end — automatically, every cycle.</p>
              </div>
              <InteractiveDemo />
            </div>
          </section>

          {/* FEATURES */}
          <section className="relative px-6 sm:px-8 py-20">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-14">
                <p className="text-xs text-indigo-400 font-semibold tracking-[0.25em] uppercase mb-4">Why teams choose NomosX</p>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">Built for high-stakes decisions</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { icon: Clock,      title: "Analysis in 60 seconds",    desc: "From complex question to structured brief with verifiable citations. Faster than an analyst sprint, stricter than a consultant deck.", grad: "from-indigo-500/15 to-indigo-500/5", ic: "text-indigo-400", hb: "hover:border-indigo-500/30" },
                  { icon: Shield,     title: "Zero hallucination policy",  desc: "Citation Guard validates every source. Full traceability, institutional integrity, and evidence-first reasoning by default.",        grad: "from-violet-500/15 to-violet-500/5", ic: "text-violet-400", hb: "hover:border-violet-500/30" },
                  { icon: TrendingUp, title: "Weak signal detection",      desc: "Automatic detection of emerging shifts before they become consensus. Anticipate strategic moves instead of reacting late.",           grad: "from-emerald-500/15 to-emerald-500/5", ic: "text-emerald-400", hb: "hover:border-emerald-500/30" },
                ].map((f, i) => {
                  const Icon = f.icon;
                  return (
                    <div key={i} className={`group relative p-7 rounded-xl border border-white/[0.06] bg-white/[0.02] ${f.hb} hover:bg-white/[0.04] transition-all duration-300`}>
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${f.grad} border border-white/[0.08] flex items-center justify-center mb-5`}>
                        <Icon size={18} className={f.ic} />
                      </div>
                      <h3 className="font-display text-base font-semibold text-white mb-2">{f.title}</h3>
                      <p className="text-sm text-white/40 leading-relaxed">{f.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="relative px-6 sm:px-8 py-24">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[600px] h-[300px] bg-indigo-500/10 rounded-full blur-[120px]" />
            </div>
            <div className="max-w-3xl mx-auto text-center relative">
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-5">
                Ready to upgrade your<br />
                <span className="nx-gradient-text">strategic operating system?</span>
              </h2>
              <p className="text-base text-white/40 mb-8 max-w-xl mx-auto">Join decision teams using NomosX for institutional-grade strategic intelligence.</p>
              <button onClick={() => setShowAuthModal(true)} className="group px-8 py-4 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] inline-flex items-center gap-2">
                Start free — no card required
                <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
              <div className="flex items-center justify-center gap-5 mt-6 text-xs text-white/30">
                <span>Free</span>
                <span className="w-1 h-1 rounded-full bg-white/10" />
                <span>No credit card</span>
                <span className="w-1 h-1 rounded-full bg-white/10" />
                <span>First analysis in 60s</span>
              </div>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="border-t border-white/[0.06]">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-white">N</span>
                </div>
                <span className="text-sm text-white/40 font-medium">NomosX</span>
                <span className="text-xs text-white/20">· Autonomous Think Tank</span>
              </div>
              <div className="flex items-center gap-6 text-xs text-white/20">
                <button onClick={() => router.push("/about")} className="hover:text-white/40 transition-colors">About</button>
                <button onClick={() => router.push("/methodology")} className="hover:text-white/40 transition-colors">Methodology</button>
                <button onClick={() => router.push("/pricing")} className="hover:text-white/40 transition-colors">Pricing</button>
                <span>© 2026 NomosX</span>
              </div>
            </div>
          </footer>

        </div>
      </div>

      {showAuthModal && <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onSignupSuccess={handleAuthSuccess} />}
      {showOnboardingModal && <OnboardingModal isOpen={showOnboardingModal} onClose={() => setShowOnboardingModal(false)} />}
    </>
  );
}
