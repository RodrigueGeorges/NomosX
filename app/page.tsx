"use client";

import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthModal from '@/components/AuthModal';
import OnboardingModal from '@/components/OnboardingModal';
import PublicNav from '@/components/PublicNav';
import InteractiveDemo from '@/components/InteractiveDemo';
import Testimonials from '@/components/Testimonials';
import AdvancedResearcherAvatar from '@/components/AdvancedResearcherAvatar';
import { RESEARCHERS } from '@/lib/researchers';
import { ArrowRight, Loader2, CheckCircle } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  const [email, setEmail] = useState("");
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [liveStats, setLiveStats] = useState({
  sourcesAnalyzed: "200K+",
  briefsGenerated: "1,247",
  researchersActive: "8",
  costSavings: "1%"
});

useEffect(() => {
  // Fetch live stats from API
  fetch("/api/public/stats")
    .then(res => res.json())
    .then(data => {
      setLiveStats({
        sourcesAnalyzed: data.sourcesAnalyzed || "200K+",
        briefsGenerated: data.briefsGenerated || "1,247",
        researchersActive: data.researchersActive || "8",
        costSavings: data.costSavings || "1%"
      });
    })
    .catch(() => {
      // Keep defaults if API fails
    });
}, []);

  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [newsletterError, setNewsletterError] = useState("");

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then(res => {
        setIsAuthenticated(res.ok);
        setIsLoading(false);
      })
      .catch(() => {
        setIsAuthenticated(false);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => { setMounted(true); }, []);
  
  async function handleNewsletterSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || newsletterLoading) return;
    setNewsletterLoading(true);
    setNewsletterError("");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source: "homepage" }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setNewsletterSuccess(true);
        setEmail("");
      } else {
        setNewsletterError(data.error || "Something went wrong.");
      }
    } catch {
      setNewsletterError("Network error. Please try again.");
    } finally {
      setNewsletterLoading(false);
    }
  }

  // Loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#06060A] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#00D4FF]/20 to-[#7C3AED]/10 blur-xl" />
            <div className="relative w-full h-full rounded-full bg-[#0C0C12] border border-white/10 flex items-center justify-center">
              <span className="font-display text-2xl font-light nx-gradient-text">N</span>
            </div>
          </div>
          <div className="w-8 h-8 mx-auto border-2 border-[#00D4FF]/20 border-t-[#00D4FF] rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[#06060A] text-[#F0F0F5] overflow-hidden">
        
        {/* ── Background Layers ── */}
        <div className="fixed inset-0 pointer-events-none">
          {/* Radial glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px]">
            <div className="absolute inset-0 bg-gradient-to-b from-[#00D4FF]/[0.07] via-[#3B82F6]/[0.03] to-transparent blur-[100px]" />
          </div>
          {/* Secondary glow */}
          <div className="absolute top-[40%] right-0 w-[600px] h-[600px]">
            <div className="absolute inset-0 bg-gradient-to-bl from-[#7C3AED]/[0.04] to-transparent blur-[80px]" />
          </div>
          {/* Grid */}
          <div className="absolute inset-0 nx-grid-bg opacity-40" />
          {/* Noise */}
          <div className="noise" />
        </div>

        <div className="relative z-10">

          {/* ══════════════════════════════════════════════════════════════════
              NAV — Minimal, Fundamental-style
              ══════════════════════════════════════════════════════════════════ */}
          <PublicNav 
            currentPage="home" 
            onSignInClick={() => setShowAuthModal(true)} 
            isAuthenticated={isAuthenticated} 
          />

          {/* ══════════════════════════════════════════════════════════════════
              HERO — "The Intelligence to Decide."
              Fundamental-style: one phrase, massive impact, orbital animation
              ══════════════════════════════════════════════════════════════════ */}
          <section className="relative px-6 sm:px-8 pt-24 sm:pt-32 md:pt-40 pb-20 sm:pb-28 md:pb-36">
            <div className="max-w-7xl mx-auto">
              
              {/* Central orbital visualization */}
              <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] sm:w-[600px] sm:h-[600px] pointer-events-none opacity-60">
                {/* Outer ring */}
                <div className="absolute inset-0 rounded-full border border-white/[0.04]" />
                {/* Middle ring */}
                <div className="absolute inset-[15%] rounded-full border border-white/[0.06]" />
                {/* Inner ring */}
                <div className="absolute inset-[30%] rounded-full border border-[#00D4FF]/[0.08]" />
                {/* Core glow */}
                <div className="absolute inset-[42%] rounded-full bg-gradient-to-br from-[#00D4FF]/10 to-[#7C3AED]/5 blur-xl" />
                
                {/* Orbiting researcher dots */}
                {mounted && RESEARCHERS.slice(0, 6).map((r, i) => (
                  <div 
                    key={r.id}
                    className="absolute top-1/2 left-1/2"
                    style={{
                      animation: `orbit ${18 + i * 3}s linear infinite`,
                      animationDelay: `${i * -3}s`,
                    }}
                  >
                    <div 
                      className="w-2.5 h-2.5 sm:w-2 sm:h-2 rounded-full"
                      style={{ 
                        backgroundColor: r.colorHex,
                        boxShadow: `0 0 16px ${r.colorHex}60`,
                        animation: `counter-spin ${18 + i * 3}s linear infinite`,
                        animationDelay: `${i * -3}s`,
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Hero text */}
              <div className="relative z-10 text-center max-w-5xl mx-auto">
                {/* Eyebrow */}
                <div className="animate-fade-in mb-8" style={{ animationDelay: '0.1s' }}>
                  <span className="nx-label text-[#00D4FF]/60">Agentic Think Tank</span>
                </div>

                {/* Main headline */}
                <h1 
                  className="nx-display text-[clamp(2.5rem,7vw,5.5rem)] mb-8 animate-fade-in"
                  style={{ animationDelay: '0.2s' }}
                >
                  <span className="nx-gradient-text-light">Where Research</span>
                  <br />
                  <span className="text-white/90">Becomes Strategy</span>
                </h1>

                {/* Sub-headline */}
                <p 
                  className="nx-body text-lg sm:text-xl max-w-2xl mx-auto mb-12 animate-fade-in"
                  style={{ animationDelay: '0.4s' }}
                >
                  While competitors chase yesterday's news, our AI council analyzes 
                  <span className="text-[#00D4FF] font-medium">200,000+ academic sources</span> to identify the 
                  <span className="text-[#00D4FF] font-medium">strategic shifts</span> that will shape your industry next quarter.
                </p>

                {/* CTA buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                  <button
                    onClick={() => router.push('/briefs')}
                    className="group px-8 py-4 rounded-xl border border-white/[0.1] text-white/70 hover:text-white hover:border-white/[0.2] hover:bg-white/[0.03] transition-all"
                  >
                    <span className="flex items-center justify-center gap-2">
                      Browse Strategic Briefs
                      <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </button>
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="group px-8 py-4 rounded-xl bg-gradient-to-r from-[#00D4FF]/20 to-[#3B82F6]/20 border border-[#00D4FF]/20 text-white font-medium hover:border-[#00D4FF]/40 transition-all shadow-[0_0_30px_rgba(0,212,255,0.15)]"
                  >
                    <span className="flex items-center justify-center gap-2">
                      Get Full Access
                      <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </button>
                </div>

                {/* Trust indicators */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-white/30 animate-fade-in" style={{ animationDelay: '0.6s' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400/60"></div>
                    <span>No credit card required for FREE tier</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#00D4FF]/60"></div>
                    <span>Cancel anytime</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-400/60"></div>
                    <span>Enterprise-grade security</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════════════
              METRICS BAR — Credibility through numbers
              ══════════════════════════════════════════════════════════════════ */}
          <section className="relative">
            <div className="nx-divider" />
            <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                {[
                  { value: liveStats.briefsGenerated, label: "Strategic briefs generated" },
                  { value: liveStats.researchersActive, label: "AI researchers active" },
                  { value: liveStats.sourcesAnalyzed, label: "Sources analyzed daily" },
                  { value: liveStats.costSavings, label: "Of traditional consulting costs" },
                ].map((stat, i) => (
                  <div key={i} className="text-center animate-fade-in" style={{ animationDelay: `${0.8 + i * 0.1}s` }}>
                    <div className="font-display text-3xl sm:text-4xl font-light tracking-tight text-white mb-2">
                      {stat.value}
                    </div>
                    <div className="nx-body-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="nx-divider" />
          </section>

          {/* ══════════════════════════════════════════════════════════════════
              SOCIAL PROOF — Recent activity & trust signals
              ══════════════════════════════════════════════════════════════════ */}
          <section className="relative">
            <div className="nx-divider" />
            <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16">
              <div className="text-center mb-12">
                <span className="nx-label text-[#00D4FF]/50 mb-4 block">Live Activity</span>
                <h2 className="nx-heading-2 text-white/95 mb-4">
                  Trusted by decision-makers worldwide
                </h2>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                {/* Recent Briefs */}
                <div className="nx-card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                    <span className="text-sm text-white/60">Recently Published</span>
                  </div>
                  <div className="space-y-3">
                    {[
                      "AI Regulation: Global Trends",
                      "Carbon Pricing Mechanisms",
                      "Digital Health Adoption"
                    ].map((title, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-white/40">
                        <span className="text-[#00D4FF]">•</span>
                        <span>{title}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Active Researchers */}
                <div className="nx-card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-2 h-2 rounded-full bg-[#00D4FF] animate-pulse"></div>
                    <span className="text-sm text-white/60">Research Council Active</span>
                  </div>
                  <div className="space-y-3">
                    {RESEARCHERS.slice(0, 3).map((researcher, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: researcher.colorHex }}
                        />
                        <span className="text-sm text-white/40">{researcher.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Global Reach */}
                <div className="nx-card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></div>
                    <span className="text-sm text-white/60">Global Analysis</span>
                  </div>
                  <div className="space-y-3">
                    {[
                      "North America: 42%",
                      "Europe: 38%", 
                      "Asia-Pacific: 20%"
                    ].map((stat, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="text-white/40">{stat.split(":")[0]}</span>
                        <span className="text-[#00D4FF]">{stat.split(":")[1]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="nx-divider" />
          </section>

          {/* ══════════════════════════════════════════════════════════════════
              THE COUNCIL — 8 AI Researchers (the product identity)
              ══════════════════════════════════════════════════════════════════ */}
          <section className="relative py-24 sm:py-32">
            <div className="max-w-7xl mx-auto px-6 sm:px-8">
              {/* Section header */}
              <div className="max-w-3xl mb-16 animate-fade-in-slow">
                <span className="nx-label text-[#00D4FF]/50 mb-4 block">The Council</span>
                <h2 className="nx-heading-1 text-white/95 mb-6">
                  8 domain experts.<br />
                  <span className="text-white/40">One institution.</span>
                </h2>
                <p className="nx-body text-lg">
                  Each researcher brings a distinct analytical lens — from econometrics 
                  to climate science. They evaluate, challenge, and synthesize — delivering 
                  the rigor of a top-tier research institution, autonomously.
                </p>
              </div>

              {/* Researcher grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {RESEARCHERS.map((r, i) => (
                  <div 
                    key={r.id}
                    className="nx-card p-6 group animate-fade-in hover:border-[#00D4FF]/20 transition-all duration-300"
                    style={{ animationDelay: `${0.1 + i * 0.08}s` }}
                  >
                    <div className="flex flex-col items-center text-center">
                      <AdvancedResearcherAvatar 
                        researcher={r} 
                        size="lg" 
                        interactive={true}
                        showStatus={true}
                        status={['analyzing', 'debating', 'synthesizing', 'idle'][Math.floor(Math.random() * 4)] as any}
                        className="mb-4"
                      />
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-white/90 truncate">{r.name}</div>
                        <div className="text-xs text-white/30 truncate mb-2">{r.institution}</div>
                      </div>
                      <div className="text-xs font-medium" style={{ color: `${r.colorHex}90` }}>
                        {r.domain}
                      </div>
                      <div className="text-xs text-white/20 leading-relaxed mt-2">
                        {r.specialty}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════════════
              INTERACTIVE DEMO — See AI Council in Action
              ══════════════════════════════════════════════════════════════════ */}
          <section className="relative py-24 sm:py-32">
            <div className="max-w-7xl mx-auto px-6 sm:px-8">
              <InteractiveDemo />
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════════════
              TESTIMONIALS — Social proof from industry leaders
              ══════════════════════════════════════════════════════════════════ */}
          <section className="relative py-24 sm:py-32">
            <div className="nx-divider" />
            <div className="max-w-7xl mx-auto px-6 sm:px-8">
              <Testimonials />
            </div>
            <div className="nx-divider" />
          </section>

          {/* ══════════════════════════════════════════════════════════════════
              HOW IT WORKS — Pipeline as product (Fundamental-style)
              ══════════════════════════════════════════════════════════════════ */}
          <section className="relative py-24 sm:py-32">
            <div className="nx-divider" />
            <div className="max-w-7xl mx-auto px-6 sm:px-8 pt-24">
              
              <div className="text-center mb-20">
                <span className="nx-label text-[#00D4FF]/50 mb-4 block">How It Works</span>
                <h2 className="nx-heading-1 text-white/95 mb-6">
                  From noise to intelligence.
                </h2>
                <p className="nx-body text-lg max-w-2xl mx-auto">
                  A fully autonomous pipeline that transforms raw academic data into 
                  institutional-grade publications — accessible to every decision-maker.
                </p>
              </div>

              {/* Pipeline steps */}
              <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {[
                  {
                    step: "01",
                    title: "Scout & Index",
                    desc: "Continuously ingests from 53+ academic providers. Enriches with ORCID, ROR, and Knowledge Graph. Deduplicates and scores.",
                    color: "#00D4FF",
                  },
                  {
                    step: "02",
                    title: "Analyze & Deliberate",
                    desc: "Domain experts independently evaluate sources. Adversarial review challenges assumptions. Evidence is graded on Oxford CEBM scale.",
                    color: "#3B82F6",
                  },
                  {
                    step: "03",
                    title: "Validate & Publish",
                    desc: "An editorial gate enforces institutional standards. Only rigorous, citation-backed insights are published. Quality you can trust.",
                    color: "#7C3AED",
                  },
                ].map((item, i) => (
                  <div key={i} className="relative group">
                    <div className="nx-card p-8 h-full">
                      <div 
                        className="text-5xl font-display font-light mb-6 opacity-20"
                        style={{ color: item.color }}
                      >
                        {item.step}
                      </div>
                      <h3 className="nx-heading-3 text-white/90 mb-3">{item.title}</h3>
                      <p className="nx-body-sm leading-relaxed">{item.desc}</p>
                    </div>
                    {/* Connector line */}
                    {i < 2 && (
                      <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-px bg-gradient-to-r from-white/10 to-transparent" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════════════
              PUBLICATIONS — What you get
              ══════════════════════════════════════════════════════════════════ */}
          <section className="relative py-24 sm:py-32">
            <div className="nx-divider" />
            <div className="max-w-7xl mx-auto px-6 sm:px-8 pt-24">
              
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                {/* Left: text */}
                <div>
                  <span className="nx-label text-[#00D4FF]/50 mb-4 block">Publications</span>
                  <h2 className="nx-heading-1 text-white/95 mb-6">
                    Research that<br />
                    <span className="text-white/40">powers decisions.</span>
                  </h2>
                  <p className="nx-body text-lg mb-10">
                    Every publication is authored by a domain expert, grounded in peer-reviewed 
                    research, and structured for the people who make the calls.
                  </p>

                  <div className="space-y-6">
                    {[
                      { 
                        title: "Executive Briefs", 
                        desc: "2-3 page decision-ready analyses delivered weekly. The research that used to cost $50K/year from consulting firms — now free.",
                        tag: "FREE",
                        tagColor: "#10B981",
                      },
                      { 
                        title: "Strategic Reports", 
                        desc: "10-15 page deep dives with scenario planning, stakeholder mapping, and actionable roadmaps for strategic decisions.",
                        tag: "PREMIUM",
                        tagColor: "#F59E0B",
                      },
                    ].map((pub, i) => (
                      <div key={i} className="nx-card p-6 flex gap-5">
                        <div 
                          className="w-1 rounded-full flex-shrink-0"
                          style={{ backgroundColor: `${pub.tagColor}40` }}
                        />
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-base font-medium text-white/90">{pub.title}</h3>
                            <span 
                              className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                              style={{ 
                                backgroundColor: `${pub.tagColor}15`,
                                color: pub.tagColor,
                              }}
                            >
                              {pub.tag}
                            </span>
                          </div>
                          <p className="nx-body-sm">{pub.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: mock publication card */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00D4FF]/5 to-[#7C3AED]/5 rounded-3xl blur-3xl" />
                  <div className="relative nx-card p-8 sm:p-10">
                    {/* Mock header */}
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 border border-cyan-500/20 flex items-center justify-center text-xs font-semibold text-cyan-400">
                        EV
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white/80">Dr. Elena Vasquez</div>
                        <div className="text-xs text-white/30">Economics • Harvard Kennedy School</div>
                      </div>
                    </div>
                    {/* Mock content */}
                    <div className="space-y-3 mb-6">
                      <div className="h-2 bg-white/[0.06] rounded-full w-full" />
                      <div className="h-2 bg-white/[0.06] rounded-full w-[90%]" />
                      <div className="h-2 bg-white/[0.06] rounded-full w-[75%]" />
                      <div className="h-2 bg-white/[0.04] rounded-full w-[85%] mt-6" />
                      <div className="h-2 bg-white/[0.04] rounded-full w-[95%]" />
                      <div className="h-2 bg-white/[0.04] rounded-full w-[60%]" />
                    </div>
                    {/* Mock citations */}
                    <div className="flex gap-2 flex-wrap">
                      {["SRC-1", "SRC-2", "SRC-3", "SRC-4"].map(src => (
                        <span key={src} className="text-[10px] px-2 py-1 rounded-md bg-[#00D4FF]/10 text-[#00D4FF]/60 font-mono">
                          [{src}]
                        </span>
                      ))}
                    </div>
                    {/* Trust score */}
                    <div className="mt-6 pt-6 border-t border-white/[0.06] flex items-center justify-between">
                      <span className="text-xs text-white/30">Trust Score</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                          <div className="h-full w-[87%] rounded-full bg-gradient-to-r from-[#00D4FF] to-[#3B82F6]" />
                        </div>
                        <span className="text-xs font-mono text-[#00D4FF]">87</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════════════
              NEWSLETTER CTA — Clean, premium
              ══════════════════════════════════════════════════════════════════ */}
          <section className="relative py-24 sm:py-32">
            <div className="nx-divider" />
            <div className="max-w-3xl mx-auto px-6 sm:px-8 pt-24 text-center">
              
              {newsletterSuccess ? (
                <div className="animate-fade-in">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h2 className="nx-heading-2 text-white/95 mb-3">You're in.</h2>
                  <p className="nx-body mb-6">
                    Welcome to NomosX. Executive Briefs will arrive weekly.
                  </p>
                  <button
                    onClick={() => isAuthenticated ? router.push("/dashboard") : setShowAuthModal(true)}
                    className="text-sm text-[#00D4FF] hover:text-[#00D4FF]/80 transition-colors inline-flex items-center gap-2"
                  >
                    Want full access? Start your free trial <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <>
                  <span className="nx-label text-[#00D4FF]/50 mb-4 block">Newsletter</span>
                  <h2 className="nx-heading-1 text-white/95 mb-4">
                    Intelligence, delivered.
                  </h2>
                  <p className="nx-body text-lg mb-10 max-w-xl mx-auto">
                    Institutional-grade research briefs delivered weekly to your inbox. 
                    The kind of intelligence that used to require a six-figure retainer.
                  </p>

                  <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
                    <div className="flex gap-3">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="flex-1 px-5 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-white/25 focus:outline-none focus:border-[#00D4FF]/30 focus:ring-1 focus:ring-[#00D4FF]/20 transition-all text-sm"
                        disabled={newsletterLoading}
                        required
                      />
                      <button
                        type="submit"
                        disabled={newsletterLoading || !email.trim()}
                        className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#00D4FF] to-[#3B82F6] text-white font-medium text-sm shadow-[0_0_30px_rgba(0,212,255,0.2)] hover:shadow-[0_0_40px_rgba(0,212,255,0.35)] disabled:opacity-40 transition-all flex items-center gap-2"
                      >
                        {newsletterLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            Subscribe
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                    {newsletterError && (
                      <p className="text-sm text-red-400 mt-3">{newsletterError}</p>
                    )}
                    <p className="text-xs text-white/20 mt-4">
                      Free forever. Unsubscribe anytime.
                    </p>
                  </form>
                </>
              )}
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════════════
              FOOTER — Minimal, premium
              ══════════════════════════════════════════════════════════════════ */}
          <footer className="relative py-12">
            <div className="nx-divider" />
            <div className="max-w-7xl mx-auto px-6 sm:px-8 pt-12">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#00D4FF]/10 to-[#7C3AED]/5 border border-white/[0.06] flex items-center justify-center">
                    <span className="font-display text-xs font-medium nx-gradient-text">N</span>
                  </div>
                  <span className="text-sm text-white/30">
                    Nomos<span className="text-[#00D4FF]/40">X</span>
                    <span className="text-white/15 ml-3">Institutional Intelligence, Democratized</span>
                  </span>
                </div>
                <div className="flex items-center gap-6 text-xs text-white/25">
                  <button onClick={() => router.push("/about")} className="hover:text-white/50 transition-colors">About</button>
                  <button onClick={() => router.push("/methodology")} className="hover:text-white/50 transition-colors">Methodology</button>
                  <button onClick={() => router.push("/pricing")} className="hover:text-white/50 transition-colors">Pricing</button>
                  <span>&copy; 2026 NomosX</span>
                </div>
              </div>
            </div>
          </footer>

        </div>
      </div>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        onSignupSuccess={() => {
          setShowAuthModal(false);
          setShowOnboardingModal(true);
        }}
      />
      <OnboardingModal
        isOpen={showOnboardingModal}
        onClose={() => setShowOnboardingModal(false)}
      />
    </>
  );
}
