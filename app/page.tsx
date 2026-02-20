"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AuthModal from '@/components/AuthModal';
import OnboardingModal from '@/components/OnboardingModal';
import PublicNav from '@/components/PublicNav';
import { Brain, Shield, BarChart3, TrendingUp, ArrowRight, Search, FileText, Microscope, Scale, Leaf, Calculator, Globe2, Rss, Clock, BookOpen, ExternalLink } from 'lucide-react';
import InteractiveDemo from '@/components/InteractiveDemo';
import { NomosXLogo } from '@/components/brand/NomosXLogo';

const RESEARCHERS = [
  { name: "Dr. Elena Vasquez",  title: "Econometrics & Policy",    institution: "MIT",          initials: "EV", color: "from-indigo-500 to-indigo-700",   border: "border-indigo-500/35",  ringColor: "rgba(99,102,241,0.6)",  glowRgb: "rgba(99,102,241,0.4)",  specialty: "Macro policy · Carbon pricing · Labor markets",    icon: BarChart3 },
  { name: "Dr. James Chen",     title: "AI & Digital Systems",     institution: "Stanford",     initials: "JC", color: "from-violet-500 to-violet-700",   border: "border-violet-500/35",  ringColor: "rgba(139,92,246,0.6)",  glowRgb: "rgba(139,92,246,0.4)",  specialty: "LLM governance · Tech regulation · Digital infra",  icon: Brain },
  { name: "Dr. Amara Okafor",   title: "Public Policy",            institution: "Oxford",       initials: "AO", color: "from-indigo-400 to-violet-600",   border: "border-indigo-400/35",  ringColor: "rgba(129,140,248,0.6)", glowRgb: "rgba(129,140,248,0.4)", specialty: "Institutional design · Democracy · Africa policy",  icon: Globe2 },
  { name: "Dr. Sarah Lindström",title: "Epidemiology & Health",    institution: "Johns Hopkins",initials: "SL", color: "from-violet-400 to-purple-600",   border: "border-violet-400/35",  ringColor: "rgba(167,139,250,0.6)", glowRgb: "rgba(167,139,250,0.4)", specialty: "Pandemic prep · Health equity · Biostatistics",     icon: Microscope },
  { name: "Dr. Marcus Webb",    title: "Strategic Security",       institution: "Georgetown",   initials: "MW", color: "from-slate-400 to-indigo-600",    border: "border-slate-400/35",   ringColor: "rgba(148,163,184,0.6)", glowRgb: "rgba(148,163,184,0.4)", specialty: "Geopolitics · Defense strategy · Intelligence",      icon: Shield },
  { name: "Dr. Isabelle Moreau",title: "International Law",        institution: "Yale Law",     initials: "IM", color: "from-indigo-600 to-violet-800",   border: "border-indigo-600/35",  ringColor: "rgba(79,70,229,0.6)",   glowRgb: "rgba(79,70,229,0.4)",   specialty: "Regulatory frameworks · Trade law · Human rights",  icon: Scale },
  { name: "Dr. Kenji Tanaka",   title: "Climate & Environment",    institution: "ETH Zürich",   initials: "KT", color: "from-violet-600 to-purple-800",   border: "border-violet-600/35",  ringColor: "rgba(124,58,237,0.6)",  glowRgb: "rgba(124,58,237,0.4)",  specialty: "Climate systems · Carbon markets · Net-zero policy", icon: Leaf },
  { name: "Dr. Priya Sharma",   title: "Quantitative Methods",     institution: "Harvard",      initials: "PS", color: "from-purple-500 to-indigo-700",   border: "border-purple-500/35",  ringColor: "rgba(168,85,247,0.6)",  glowRgb: "rgba(168,85,247,0.4)",  specialty: "Causal inference · Meta-analysis · Bayesian methods",icon: Calculator },
];

type PublicBrief = {
  id: string;
  title: string;
  summary: string;
  type: string;
  publishedAt: string;
  readTime: number;
  sources: number;
  topics: string[];
  tier: string;
};

export default function HomePage() {
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [activeR, setActiveR] = useState<number | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [latestBriefs, setLatestBriefs] = useState<PublicBrief[]>([]);
  const searchParams = useSearchParams();

  const [newsletterMessage, setNewsletterMessage] = useState("");

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterStatus("loading");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newsletterEmail }),
      });
      const data = await res.json();
      if (res.ok) {
        setNewsletterMessage(data.message || "Check your inbox to confirm.");
        setNewsletterStatus("success");
      } else {
        setNewsletterStatus("error");
      }
    } catch { setNewsletterStatus("error"); }
  };

  useEffect(() => {
    setMounted(true);
    fetch('/api/auth/me').then(r => { if (r.ok) setIsAuthenticated(true); }).catch(() => {}).finally(() => setIsLoading(false));
    fetch('/api/public/briefs?limit=3').then(r => r.ok ? r.json() : null).then(d => { if (d?.briefs) setLatestBriefs(d.briefs); }).catch(() => {});

    // Handle newsletter confirmation redirects
    const nl = searchParams.get('newsletter');
    if (nl === 'confirmed') {
      setNewsletterMessage('Subscription confirmed! Welcome to the NomosX dispatch.');
      setNewsletterStatus('success');
    } else if (nl === 'expired') {
      setNewsletterMessage('');
      setNewsletterStatus('error');
    }
  }, [searchParams]);

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
              <div className={`flex justify-center mb-8 transition-opacity duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
                <NomosXLogo size="lg" variant="full" />
              </div>

              <div className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-indigo-500/25 bg-indigo-500/8 mb-10 transition-opacity duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-400" />
                </span>
                <span className="text-xs text-indigo-300 font-semibold tracking-[0.18em] uppercase">Autonomous Think Tank · Live</span>
              </div>

              <h1 className={`font-display text-5xl sm:text-6xl md:text-[5.5rem] font-bold leading-[1.03] tracking-tight mb-7 transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                <span className="text-white">Stay ahead</span>
                <br />
                <span className="nx-gradient-text">of what matters.</span>
                <br />
                <span className="text-white/35">Strategic intelligence, every week.</span>
              </h1>
              
              <p className={`text-lg sm:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed font-light transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                NomosX is an <strong className="text-white/75 font-semibold">agentic AI think tank</strong> — 8 autonomous researchers continuously scan <strong className="text-white/75 font-semibold">250M+ academic sources</strong>, deliberate, and publish peer-reviewed strategic briefs. No editorial team. No human trigger.
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
                {[{ value: "250M+", label: "Academic sources" }, { value: "8", label: "PhD researchers" }, { value: "100%", label: "Auto-published" }, { value: "99.2%", label: "Citation precision" }].map((s, i) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl sm:text-3xl font-display font-bold text-white">{s.value}</div>
                    <div className="text-xs text-white/35 mt-0.5 tracking-wide">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* THINK TANK */}
          <section className="relative px-6 sm:px-8 py-28 overflow-hidden">
            {/* Deep ambient glow */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(99,102,241,0.10),transparent_70%)]" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-500/5 blur-[100px]" />
            </div>

            <div className="max-w-7xl mx-auto relative">
              <div className="text-center mb-20">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/5 mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                  <span className="text-[11px] text-indigo-300 font-semibold tracking-[0.2em] uppercase">The Think Tank</span>
                </div>
                <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                  8 AI researchers.<br />
                  <span className="nx-gradient-text">One unified intelligence.</span>
                </h2>
                <p className="text-base sm:text-lg text-white/40 max-w-2xl mx-auto leading-relaxed">
                  Each researcher holds a PhD-calibrated domain mandate. Together, they surpass individual experts — 8 parallel minds, infinite memory, zero cognitive bias.
                </p>
              </div>

              {/* Hologram researcher grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                {RESEARCHERS.map((r, i) => {
                  const Icon = r.icon;
                  const isActive = activeR === i;
                  return (
                    <div
                      key={i}
                      onMouseEnter={() => setActiveR(i)}
                      onMouseLeave={() => setActiveR(null)}
                      className="holo-card group relative cursor-default"
                      style={{ animationDelay: `${i * 80}ms` }}
                    >
                      {/* Glass card */}
                      <div className={`relative rounded-2xl overflow-hidden transition-all duration-500 glass-panel ${isActive ? `${r.border} shadow-2xl` : 'border-white/[0.06]'}`}
                        style={isActive ? { boxShadow: `0 0 40px ${r.glowRgb}, 0 20px 60px rgba(0,0,0,0.5)` } : {}}>

                        {/* Top accent line */}
                        <div className={`h-px w-full bg-gradient-to-r ${r.color} transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-40'}`} />

                        {/* Scanline sweep on hover */}
                        {isActive && (
                          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl z-10">
                            <div className="absolute left-0 right-0 h-8 bg-gradient-to-b from-transparent via-white/[0.04] to-transparent animate-scanline" />
                          </div>
                        )}

                        <div className="p-6">
                          {/* Avatar: domain icon as centerpiece */}
                          <div className="flex justify-center mb-5">
                            <div className="relative w-20 h-20">
                              {/* Outer ring — rotates */}
                              <div className={`absolute inset-0 rounded-full animate-ring transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-25'}`}
                                style={{ background: 'transparent', border: `1.5px dashed`, borderColor: r.ringColor, borderRadius: '50%' }} />
                              {/* Inner ring — counter-rotates */}
                              <div className={`absolute inset-[5px] rounded-full animate-ring-rev transition-opacity duration-300 ${isActive ? 'opacity-70' : 'opacity-15'}`}
                                style={{ background: 'transparent', border: `1px dotted`, borderColor: r.ringColor, borderRadius: '50%' }} />
                              {/* Avatar core — icon centered */}
                              <div className={`absolute inset-[10px] rounded-full bg-gradient-to-br ${r.color} flex items-center justify-center transition-all duration-500 animate-holo-flicker`}
                                style={isActive ? { boxShadow: `0 0 24px ${r.glowRgb}, 0 0 48px ${r.glowRgb}` } : {}}>
                                <Icon size={20} className="text-white" style={{ filter: isActive ? `drop-shadow(0 0 6px ${r.glowRgb})` : 'none' }} />
                              </div>
                              {/* Glow halo */}
                              <div className={`absolute inset-[8px] rounded-full transition-all duration-500 ${isActive ? 'animate-holo-glow' : 'opacity-0'}`}
                                style={{ background: `radial-gradient(circle, ${r.glowRgb} 0%, transparent 70%)` }} />
                              {/* Initials chip — bottom right */}
                              <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#09090b] border flex items-center justify-center transition-all duration-300 ${isActive ? r.border : 'border-white/10'}`}>
                                <span className="text-[8px] font-bold text-white/60">{r.initials}</span>
                              </div>
                            </div>
                          </div>

                          {/* Institution badge */}
                          <div className="flex justify-center mb-4">
                            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-all duration-300 ${isActive ? `${r.border} bg-white/[0.06]` : 'border-white/[0.06] bg-white/[0.02]'}`}>
                              <span className={`text-[10px] font-semibold tracking-widest uppercase transition-colors duration-300 ${isActive ? 'text-white/70' : 'text-white/25'}`}>{r.institution}</span>
                            </div>
                          </div>

                          {/* Name & title */}
                          <div className="text-center">
                            <h3 className={`text-sm font-semibold leading-tight mb-1 transition-colors duration-300 ${isActive ? 'text-white' : 'text-white/80'}`}>{r.name}</h3>
                            <p className={`text-[11px] font-medium transition-colors duration-300 ${isActive ? 'text-white/60' : 'text-white/35'}`}>{r.title}</p>
                          </div>

                          {/* Specialty — revealed on hover */}
                          <div className={`mt-4 pt-4 border-t transition-all duration-400 overflow-hidden ${isActive ? 'max-h-20 opacity-100 border-white/[0.08]' : 'max-h-0 opacity-0 border-transparent'}`}>
                            <p className="text-[10px] text-white/40 text-center leading-relaxed">{r.specialty}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Council note */}
              <div className="mt-14 flex items-center justify-center gap-4">
                <div className="h-px flex-1 max-w-[160px] bg-gradient-to-r from-transparent to-white/10" />
                <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.06] bg-white/[0.02]">
                  <Shield size={12} className="text-indigo-400" />
                  <p className="text-xs text-white/35">
                    All 8 review every brief via the <span className="text-white/55 font-semibold">NomosX Council Protocol</span>
                  </p>
                </div>
                <div className="h-px flex-1 max-w-[160px] bg-gradient-to-l from-transparent to-white/10" />
              </div>
            </div>
          </section>

          {/* PIPELINE */}
          <section className="relative px-6 sm:px-8 py-20">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-14">
                <p className="text-xs text-indigo-400 font-semibold tracking-[0.25em] uppercase mb-4">Agentic Pipeline</p>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">15 agents. One autonomous pipeline.</h2>
                <p className="text-base text-white/40 max-w-xl mx-auto">Each agent has a single mandate. Together they transform a research question into a peer-reviewed, source-grounded publication — with no human in the loop.</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { icon: Search,     label: "SCOUT",   desc: "250M+ sources",    color: "from-indigo-600 to-indigo-500",   step: "01" },
                  { icon: BarChart3,  label: "RANK",    desc: "Quality filter",   color: "from-indigo-500 to-violet-600",  step: "02" },
                  { icon: FileText,   label: "READER",  desc: "Claim extraction", color: "from-violet-600 to-violet-500",  step: "03" },
                  { icon: Brain,      label: "ANALYST", desc: "3-pass synthesis", color: "from-violet-500 to-purple-600",  step: "04" },
                  { icon: Shield,     label: "COUNCIL", desc: "8 PhD review",     color: "from-purple-600 to-indigo-700",  step: "05" },
                  { icon: TrendingUp, label: "PUBLISH", desc: "Auto-published",   color: "from-indigo-700 to-violet-800",  step: "06" },
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
                <p className="text-xs text-indigo-400 font-semibold tracking-[0.25em] uppercase mb-4">Pipeline · Live</p>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">Watch the research run</h2>
                <p className="text-base text-white/40 max-w-xl mx-auto">Every cycle, a question enters. A peer-reviewed brief exits. No human in the loop.</p>
              </div>
              <InteractiveDemo />
            </div>
          </section>

          {/* LATEST PUBLICATIONS */}
          <section className="relative px-6 sm:px-8 py-20">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_50%,rgba(99,102,241,0.05),transparent_70%)] pointer-events-none" />
            <div className="max-w-5xl mx-auto">
              <div className="flex items-end justify-between mb-10">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-400" /></span>
                    <span className="text-xs text-indigo-300 font-semibold tracking-[0.2em] uppercase">Auto-published · Live</span>
                  </div>
                  <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">Latest from the Think Tank</h2>
                  <p className="text-base text-white/40 mt-2">Published autonomously. No editorial team. No delays.</p>
                </div>
                <button onClick={() => router.push('/publications')} className="hidden sm:flex items-center gap-2 text-sm text-white/35 hover:text-white/60 transition-colors">
                  View all <ExternalLink size={13} />
                </button>
              </div>
              {latestBriefs.length > 0 ? (
                <div className="space-y-3">
                  {latestBriefs.map((brief) => (
                    <div key={brief.id} onClick={() => router.push(`/publications/${brief.id}`)} className="group relative rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-indigo-500/20 transition-all duration-300 p-5 cursor-pointer">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/15 flex items-center justify-center mt-0.5">
                          <BookOpen size={14} className="text-indigo-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-1.5">
                            <h3 className="text-sm font-semibold text-white/90 group-hover:text-white transition-colors leading-snug line-clamp-1">{brief.title}</h3>
                            <div className="flex items-center gap-3 flex-shrink-0 text-xs text-white/30">
                              <span className="flex items-center gap-1"><Clock size={11} />{brief.readTime} min</span>
                              <span>{brief.sources} sources</span>
                            </div>
                          </div>
                          <p className="text-xs text-white/40 leading-relaxed line-clamp-2 mb-2">{brief.summary}</p>
                          <div className="flex items-center gap-2">
                            {brief.topics.slice(0, 3).map((t, ti) => (
                              <span key={ti} className="text-[10px] px-2 py-0.5 rounded-full border border-white/[0.07] text-white/25">{t}</span>
                            ))}
                            <span className="text-[10px] text-white/20 ml-auto">{new Date(brief.publishedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="rounded-xl border border-white/[0.04] bg-white/[0.01] p-5">
                      <div className="flex items-center gap-4"><div className="w-8 h-8 rounded-lg bg-white/[0.03] flex-shrink-0" /><div className="flex-1 space-y-2"><div className="h-3 bg-white/[0.04] rounded w-3/4" /><div className="h-2.5 bg-white/[0.03] rounded w-full" /></div></div>
                    </div>
                  ))}
                  <p className="text-center text-xs text-white/20 pt-2">First publications appear here once the pipeline runs.</p>
                </div>
              )}
              <div className="mt-5 flex justify-center sm:hidden">
                <button onClick={() => router.push('/publications')} className="text-sm text-white/35 hover:text-white/60 transition-colors flex items-center gap-2">View all publications <ExternalLink size={13} /></button>
              </div>
            </div>
          </section>

          {/* NEWSLETTER — primary CTA */}
          <section className="relative px-6 sm:px-8 py-24">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(99,102,241,0.07),transparent_70%)] pointer-events-none" />
            <div className="max-w-3xl mx-auto">
              <div className="relative rounded-2xl border border-indigo-500/20 bg-indigo-500/[0.03] p-10 sm:p-14 overflow-hidden text-center">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_110%,rgba(99,102,241,0.10),transparent_70%)] pointer-events-none" />
                <div className="relative">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/25 bg-indigo-500/8 mb-6">
                    <Rss size={11} className="text-indigo-400" />
                    <span className="text-[11px] text-indigo-300 font-semibold tracking-[0.2em] uppercase">Weekly Intelligence Dispatch</span>
                  </div>
                  <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
                    Receive the briefs.<br />
                    <span className="nx-gradient-text">Directly in your inbox.</span>
                  </h2>
                  <p className="text-base text-white/45 mb-3 max-w-xl mx-auto leading-relaxed">
                    Every week, the Think Tank publishes its most significant findings — synthesised from hundreds of peer-reviewed sources, validated by 8 PhD-calibrated agents, delivered automatically.
                  </p>
                  <p className="text-sm text-white/25 mb-10 max-w-md mx-auto">No editorial team. No curation bias. Pure autonomous research output.</p>
                  {newsletterStatus === "success" ? (
                    <div className="flex items-center justify-center gap-2.5 text-emerald-400 font-medium text-sm">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center"><span className="text-[10px]">✓</span></div>
                      {newsletterMessage || "Check your inbox to confirm."}
                    </div>
                  ) : (
                    <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                      <input type="email" value={newsletterEmail} onChange={e => setNewsletterEmail(e.target.value)} placeholder="your@institution.edu" required className="flex-1 px-4 py-3.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-white placeholder-white/20 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors" />
                      <button type="submit" disabled={newsletterStatus === "loading"} className="px-6 py-3.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-semibold text-sm transition-all duration-200 disabled:opacity-60 whitespace-nowrap shadow-lg shadow-indigo-500/25">
                        {newsletterStatus === "loading" ? "..." : "Subscribe — free"}
                      </button>
                    </form>
                  )}
                  {newsletterStatus === "error" && (
                    <p className="mt-3 text-xs text-red-400">
                      {searchParams.get('newsletter') === 'expired'
                        ? 'Your confirmation link expired (48h). Subscribe again below.'
                        : 'Something went wrong — try again.'}
                    </p>
                  )}
                  <p className="mt-5 text-xs text-white/20">No spam. Unsubscribe anytime. Weekly cadence.</p>
                </div>
              </div>
            </div>
          </section>

          {/* PRICING — 3 tiers */}
          <section className="relative px-6 sm:px-8 py-24">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(99,102,241,0.05),transparent_70%)] pointer-events-none" />
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-14">
                <p className="text-xs text-indigo-400 font-semibold tracking-[0.25em] uppercase mb-4">Access</p>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">Research-grade access, three depths.</h2>
                <p className="text-base text-white/40 max-w-xl mx-auto">30-day free trial. No credit card. Cancel anytime.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Analyst */}
                <div className="relative rounded-2xl border border-white/[0.07] bg-white/[0.02] p-7 hover:border-white/[0.12] transition-all duration-300">
                  <p className="text-[10px] text-white/35 font-semibold tracking-[0.25em] uppercase mb-3">Analyst</p>
                  <div className="flex items-baseline gap-1 mb-2"><span className="text-3xl font-display font-bold text-white">€0</span><span className="text-sm text-white/30">/month</span></div>
                  <p className="text-xs text-white/35 leading-relaxed mb-6">Read the auto-published briefs. Subscribe to the weekly dispatch.</p>
                  <div className="space-y-2 mb-7">
                    {["Weekly intelligence dispatch","Access to published briefs","Signal radar (read-only)","Weak-signal alerts"].map((f, i) => (
                      <div key={i} className="flex items-center gap-2.5">
                        <div className="w-3.5 h-3.5 rounded-full border border-white/15 flex items-center justify-center flex-shrink-0"><div className="w-1 h-1 rounded-full bg-white/35" /></div>
                        <span className="text-xs text-white/40">{f}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setShowAuthModal(true)} className="w-full py-2.5 rounded-xl border border-white/[0.09] bg-white/[0.03] text-white/45 font-medium text-sm hover:bg-white/[0.06] hover:text-white/65 transition-all duration-200">Start free</button>
                </div>
                {/* Researcher */}
                <div className="relative rounded-2xl border border-indigo-500/30 bg-indigo-500/[0.04] p-7 shadow-xl shadow-indigo-500/10">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2"><span className="px-3 py-1 rounded-full bg-indigo-500 text-white text-[10px] font-bold tracking-widest uppercase">Most popular</span></div>
                  <p className="text-[10px] text-indigo-300 font-semibold tracking-[0.25em] uppercase mb-3">Researcher</p>
                  <div className="flex items-baseline gap-1 mb-2"><span className="text-3xl font-display font-bold text-white">€19</span><span className="text-sm text-white/30">/month</span></div>
                  <p className="text-xs text-white/45 leading-relaxed mb-6">Commission briefs and strategic reports. Full pipeline access.</p>
                  <div className="space-y-2 mb-7">
                    {["Everything in Analyst +","Commission research briefs","Strategic reports (15-page)","NomosX Council deliberations","Custom research verticals","Verified citation export"].map((f, i) => (
                      <div key={i} className="flex items-center gap-2.5">
                        <div className="w-3.5 h-3.5 rounded-full border border-indigo-400/50 flex items-center justify-center flex-shrink-0"><div className="w-1 h-1 rounded-full bg-indigo-400" /></div>
                        <span className="text-xs text-white/65">{f}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setShowAuthModal(true)} className="w-full py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-indigo-500/25">Start free trial</button>
                </div>
                {/* Studio */}
                <div className="relative rounded-2xl border border-violet-500/20 bg-violet-500/[0.02] p-7 hover:border-violet-500/30 transition-all duration-300">
                  <p className="text-[10px] text-violet-300 font-semibold tracking-[0.25em] uppercase mb-3">Studio</p>
                  <div className="flex items-baseline gap-1 mb-2"><span className="text-3xl font-display font-bold text-white">€49</span><span className="text-sm text-white/30">/month</span></div>
                  <p className="text-xs text-white/35 leading-relaxed mb-6">Full editorial control. Publish under your own brand.</p>
                  <div className="space-y-2 mb-7">
                    {["Everything in Researcher +","Publications Studio","Council Sessions (direct Q&A)","API access","White-label export","Priority pipeline queue"].map((f, i) => (
                      <div key={i} className="flex items-center gap-2.5">
                        <div className="w-3.5 h-3.5 rounded-full border border-violet-400/35 flex items-center justify-center flex-shrink-0"><div className="w-1 h-1 rounded-full bg-violet-400" /></div>
                        <span className="text-xs text-white/40">{f}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setShowAuthModal(true)} className="w-full py-2.5 rounded-xl border border-violet-500/25 bg-violet-500/[0.06] text-violet-300 font-medium text-sm hover:bg-violet-500/[0.12] transition-all duration-200">Start free trial</button>
                </div>
              </div>
              <p className="text-center text-xs text-white/20 mt-8">All plans include the weekly dispatch. <button onClick={() => router.push('/pricing')} className="text-indigo-400/60 hover:text-indigo-400 transition-colors underline underline-offset-2">Full pricing details →</button></p>
            </div>
          </section>

          {/* CTA */}
          <section className="relative px-6 sm:px-8 py-20">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[500px] h-[250px] bg-indigo-500/10 rounded-full blur-[120px]" />
            </div>
            <div className="max-w-3xl mx-auto text-center relative">
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-5">
                The research runs.<br />
                <span className="nx-gradient-text">You read the findings.</span>
              </h2>
              <p className="text-base text-white/40 mb-8 max-w-xl mx-auto">Join researchers, analysts, and policy teams who receive autonomous intelligence from the NomosX Think Tank.</p>
              <button onClick={() => setShowAuthModal(true)} className="group px-8 py-4 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] inline-flex items-center gap-2">
                Start free — no card required
                <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
              <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-xs text-white/30">
                <span>Free 30-day trial</span>
                <span className="w-1 h-1 rounded-full bg-white/10" />
                <span>No credit card</span>
                <span className="w-1 h-1 rounded-full bg-white/10" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="border-t border-white/[0.06]">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <NomosXLogo size="sm" variant="full" />
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
