"use client";
import React from 'react';
import { useState, useEffect } from 'react';

/**
 * NomosX Pricing Page
 * 
 * Two tiers: Executive (€15/mois) + Strategy (€39/mois)
 * 30-day trial without credit card
 * Public marketing page — same layout as About/Methodology
 */

import { useRouter } from 'next/navigation';
import AuthModal from '@/components/AuthModal';
import PublicNav from '@/components/PublicNav';
import { Check, Shield, Zap, TrendingUp, Users, Briefcase, FileText, ArrowRight } from 'lucide-react';

export default function PricingPage() {
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  return (
    <>
      <div className="min-h-screen bg-[#06060A] text-white">
        {/* Background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1400px] h-[900px]">
            <div className="absolute inset-0 bg-gradient-to-b from-[#00D4FF]/[0.06] via-[#3B82F6]/[0.03] to-transparent blur-3xl" />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#7C3AED]/[0.04] via-transparent to-[#00D4FF]/[0.04] blur-3xl" />
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px]" />
          {mounted && (
            <div className="absolute inset-0">
              {[...Array(12)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-[#00D4FF]/20 animate-pulse"
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
        <PublicNav currentPage="pricing" onSignInClick={() => setShowAuthModal(true)} />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          {/* Hero */}
          <div className="text-center mb-20">
            <div className="text-xs text-[#00D4FF]/50 tracking-[0.25em] uppercase mb-6 flex items-center justify-center gap-3">
              <div className="w-8 h-px bg-gradient-to-r from-transparent via-[#00D4FF]/40 to-transparent" />
              <span>Pricing</span>
              <div className="w-8 h-px bg-gradient-to-r from-[#00D4FF]/40 via-transparent to-transparent" />
            </div>

            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-light leading-tight mb-6">
              <span className="nx-gradient-text">Think Tank Access</span>
              <br />
              <span className="text-white/50 text-3xl sm:text-4xl">Intelligence on your terms</span>
            </h1>

            <p className="text-base sm:text-lg text-white/40 leading-relaxed max-w-2xl mx-auto">
              Institutional-grade research intelligence that used to require a six-figure retainer — now accessible to every decision-maker.
            </p>
          </div>

          {/* Three Pricing Tiers */}
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6 max-w-6xl mx-auto mb-24">
            
            {/* FREE Plan */}
            <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.03] to-white/[0.01] p-8 sm:p-10">
              <div className="text-center mb-8">
                <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto mb-4">
                  <FileText size={24} className="text-white/50" />
                </div>
                <h2 className="font-display text-xl font-light text-white/90 mb-3">Free</h2>
                <div className="flex items-baseline justify-center gap-1.5 mb-3">
                  <span className="font-display text-4xl font-light text-white">0€</span>
                  <span className="text-sm text-white/30">/month</span>
                </div>
                <span className="text-[10px] tracking-wider uppercase text-white/25 px-3 py-1 rounded-full border border-white/[0.06]">
                  Forever free
                </span>
              </div>

              <div className="space-y-3 mb-8">
                {["Weekly brief summaries", "Radar signals", "Public brief previews", "Newsletter access"].map(f => (
                  <div key={f} className="flex items-center gap-3">
                    <Check size={14} className="text-emerald-400/80 flex-shrink-0" />
                    <span className="text-sm text-white/60">{f}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => router.push('/briefs')}
                className="w-full py-3.5 rounded-xl border border-white/[0.1] text-sm font-medium text-white/70 hover:text-white hover:border-white/[0.2] hover:bg-white/[0.03] transition-all"
              >
                Browse briefs
              </button>
            </div>

            {/* Executive Plan */}
            <div className="rounded-2xl border border-[#00D4FF]/20 bg-gradient-to-br from-[#00D4FF]/[0.04] to-[#3B82F6]/[0.02] p-8 sm:p-10 shadow-[0_0_40px_rgba(0,212,255,0.08)]">
              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-xl bg-[#00D4FF]/10 border border-[#00D4FF]/20 flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(0,212,255,0.15)]">
                  <FileText size={28} className="text-[#00D4FF]" />
                </div>
                <h2 className="font-display text-xl font-light text-white mb-3">Executive</h2>
                <div className="flex items-baseline justify-center gap-1.5 mb-3">
                  <span className="font-display text-4xl font-light text-white">15€</span>
                  <span className="text-sm text-white/30">/month</span>
                </div>
                <span className="text-[10px] tracking-wider uppercase text-[#00D4FF]/50 px-3 py-1 rounded-full border border-[#00D4FF]/15">
                  Most popular
                </span>
              </div>

              <div className="space-y-3 mb-8">
                {["Everything in Free", "Full briefs (2-3 pages)", "Complete archives", "Weekly newsletter", "Decision-ready insights", "Source citations"].map(f => (
                  <div key={f} className="flex items-center gap-3">
                    <Check size={14} className="text-emerald-400/80 flex-shrink-0" />
                    <span className="text-sm text-white/60">{f}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowAuthModal(true)}
                className="group w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00D4FF]/20 to-[#3B82F6]/20 border border-[#00D4FF]/20 text-sm font-medium text-white hover:border-[#00D4FF]/40 transition-all shadow-[0_0_20px_rgba(0,212,255,0.1)]"
              >
                <span className="flex items-center justify-center gap-2">
                  Start free trial
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </button>
            </div>

            {/* Strategy Plan */}
            <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.03] to-white/[0.01] p-8 sm:p-10">
              <div className="text-center mb-8">
                <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto mb-4">
                  <Briefcase size={24} className="text-white/50" />
                </div>
                <h2 className="font-display text-xl font-light text-white/90 mb-3">Strategy</h2>
                <div className="flex items-baseline justify-center gap-1.5 mb-3">
                  <span className="font-display text-4xl font-light text-white">39€</span>
                  <span className="text-sm text-white/30">/month</span>
                </div>
                <span className="text-[10px] tracking-wider uppercase text-white/25 px-3 py-1 rounded-full border border-white/[0.06]">
                  For teams
                </span>
              </div>

              <div className="space-y-3 mb-8">
                {["Everything in Executive", "Strategic reports (10-15 pages)", "Studio research tool", "Harvard Council insights", "Custom verticals", "Priority support"].map(f => (
                  <div key={f} className="flex items-center gap-3">
                    <Check size={14} className="text-emerald-400/80 flex-shrink-0" />
                    <span className="text-sm text-white/60">{f}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowAuthModal(true)}
                className="w-full py-3.5 rounded-xl border border-white/[0.1] text-sm font-medium text-white/70 hover:text-white hover:border-white/[0.2] hover:bg-white/[0.03] transition-all"
              >
                Start free trial
              </button>
            </div>
          </div>

          {/* What makes us different */}
          <div className="mb-20">
            <div className="max-w-4xl mx-auto mb-10">
              <div className="text-xs text-[#00D4FF]/40 tracking-[0.25em] uppercase mb-6 flex items-center gap-3">
                <div className="w-8 h-px bg-gradient-to-r from-[#00D4FF]/40 to-transparent" />
                <span>Why NomosX</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-light leading-tight text-white/95 mb-4">
                What makes us <span className="nx-gradient-text">different</span>
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                { title: "Autonomous", desc: "8 AI researchers working 24/7" },
                { title: "Institutional", desc: "PhD-level rigor on every publication" },
                { title: "Transparent", desc: "Every claim cited, every source traceable" },
                { title: "Accessible", desc: "Research that was $50K/yr, now from 15€" },
              ].map(item => (
                <div key={item.title} className="rounded-xl border border-white/[0.06] bg-white/[0.015] p-6 text-center">
                  <Check size={18} className="text-[#00D4FF]/50 mx-auto mb-2" />
                  <p className="text-sm font-medium text-white/70 mb-1">{item.title}</p>
                  <p className="text-xs text-white/30">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Who it's for */}
          <div className="mb-20">
            <div className="max-w-4xl mx-auto mb-10">
              <div className="text-xs text-[#00D4FF]/40 tracking-[0.25em] uppercase mb-6 flex items-center gap-3">
                <div className="w-8 h-px bg-gradient-to-r from-[#00D4FF]/40 to-transparent" />
                <span>Audience</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-light leading-tight text-white/95 mb-4">
                Who it's for
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                { icon: TrendingUp, title: "Investors", desc: "Spot emerging trends before the market. Evidence-backed intelligence for smarter allocations.", color: "#3B82F6" },
                { icon: Zap, title: "Founders", desc: "Track technology shifts and policy changes. Stay ahead with research-grade competitive intelligence.", color: "#10B981" },
                { icon: FileText, title: "Journalists", desc: "Access curated academic research. Verify claims with traceable, citation-backed analysis.", color: "#A78BFA" },
                { icon: Briefcase, title: "Strategy teams", desc: "Institutional-quality analysis delivered to your desk. The research department you always needed.", color: "#00D4FF" },
                { icon: Users, title: "Institutions", desc: "Augment your research capacity with an autonomous council that scales with your needs.", color: "#F59E0B" },
                { icon: Shield, title: "Policy makers", desc: "Monitor regulatory landscapes, assess cross-domain impact, ground decisions in evidence.", color: "#F43F5E" },
              ].map(a => (
                <div key={a.title} className="group rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.03] to-white/[0.01] p-6 hover:border-[#00D4FF]/20 transition-all duration-300">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${a.color}15`, border: `1px solid ${a.color}25` }}
                  >
                    <a.icon size={24} style={{ color: a.color }} />
                  </div>
                  <h4 className="font-display text-base font-medium text-white/90 mb-2">{a.title}</h4>
                  <p className="text-sm text-white/40">{a.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="mb-20">
            <div className="max-w-4xl mx-auto mb-10">
              <div className="text-xs text-white/20 tracking-[0.25em] uppercase mb-6 flex items-center gap-3">
                <div className="w-8 h-px bg-gradient-to-r from-white/20 to-transparent" />
                <span>FAQ</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-light leading-tight text-white/95">
                Frequently asked
              </h2>
            </div>
            <div className="max-w-3xl mx-auto space-y-4">
              {[
                { q: "Why a subscription instead of per-query pricing?", a: "You're subscribing to an autonomous research council that monitors 200,000+ sources daily and delivers institutional-grade publications. It's a research department, not a chatbot." },
                { q: "What happens after the trial?", a: "After 30 days, you choose whether to continue. No automatic charges. You decide if the value justifies the investment." },
                { q: "Can I cancel anytime?", a: "Yes. No lock-in. Cancel from your dashboard. Your access continues until the end of the billing period." },
                { q: "How is this different from AI tools like ChatGPT?", a: "NomosX is an autonomous institution, not a tool. It has researchers, editorial standards, and quality gates. Every claim is cited, every source traceable. Think of it as your personal Brookings or McKinsey Global Institute." },
              ].map(faq => (
                <div key={faq.q} className="rounded-xl border border-white/[0.06] bg-white/[0.015] p-5">
                  <h4 className="text-sm font-medium text-white/80 mb-2">{faq.q}</h4>
                  <p className="text-sm text-white/40 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Final */}
          <div className="relative overflow-hidden pb-10">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00D4FF]/10 via-[#3B82F6]/5 to-[#7C3AED]/10 rounded-3xl blur-2xl" />
            
            <div className="relative text-center p-10 sm:p-16 rounded-3xl border border-white/[0.08] bg-gradient-to-br from-white/[0.02] to-white/[0.01] backdrop-blur-xl">
              <div className="text-xs text-[#00D4FF]/50 tracking-[0.25em] uppercase mb-6">
                START NOW
              </div>
              
              <h2 className="font-display text-3xl sm:text-4xl font-light leading-tight mb-6">
                <span className="nx-gradient-text">Ready to elevate</span>
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
                  Start your 30-day trial
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </span>
              </button>
              
              <div className="flex items-center justify-center gap-6 mt-8 text-xs text-white/40">
                <span>No credit card required</span>
                <div className="w-1 h-1 rounded-full bg-[#00D4FF]/40" />
                <span>Cancel anytime</span>
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
              <button onClick={() => router.push("/about")} className="hover:text-white/50 transition-colors">About</button>
              <button onClick={() => router.push("/methodology")} className="hover:text-white/50 transition-colors">Methodology</button>
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
