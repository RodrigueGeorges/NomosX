"use client";
import React from 'react';
import { useState, useEffect } from 'react';

/**
 * NomosX Pricing Page — Agentic Think Tank
 * 
 * Two tiers: Executive (€15/month) + Strategy (€39/month)
 * 30-day trial without credit card
 * Public marketing page — same layout as About/Methodology
 */

import { useRouter } from 'next/navigation';
import AuthModal from '@/components/AuthModal';
import PublicNav from '@/components/PublicNav';
import { Check, Shield, Zap, Users, ArrowRight } from 'lucide-react';

export default function PricingPage() {
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const plans = [
    {
      name: "Executive",
      price: "15",
      period: "/month",
      description: "For individual decision-makers and small teams",
      features: [
        "8 PhD perspectives",
        "60-second analysis",
        "Verified citations",
        "Weak-signal radar",
        "10 analyses/month",
        "Email support"
      ],
      highlighted: false,
      cta: "Start free trial"
    },
    {
      name: "Strategy",
      price: "39",
      period: "/month",
      description: "For organizations and strategic teams",
      features: [
        "Everything in Executive +",
        "Unlimited analyses",
        "Publications Studio",
        "Council Sessions",
        "API access",
        "Priority support",
        "Custom integrations"
      ],
      highlighted: true,
      cta: "Start free trial"
    }
  ];

  const trust = [
    {
      icon: Shield,
      title: "Academic rigor",
      description: "Verified citations, cross-validation, and full traceability for every insight."
    },
    {
      icon: Zap,
      title: "60 seconds",
      description: "From complex question to structured brief. Faster than weeks of manual research."
    },
    {
      icon: Users,
      title: "8 PhD perspectives",
      description: "Calibrated to the standards of the world's most respected institutions."
    }
  ];

  const faq = [
    {
      q: "Can I change plan at any time?",
      a: "Yes. You can upgrade at any time. Changes take effect immediately and you only pay the prorated difference."
    },
    {
      q: "Is there a long-term commitment?",
      a: "No. All plans are commitment-free and can be cancelled at any time without penalties."
    },
    {
      q: "What is included in the 30-day free trial?",
      a: "The free trial gives full access to all features in your selected plan. No credit card required."
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
        <PublicNav currentPage="pricing" onSignInClick={() => setShowAuthModal(true)} />

        <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 py-20 sm:py-28">
          {/* Hero */}
          <div className={`text-center mb-16 ${mounted ? 'animate-fade-in' : 'opacity-0'}`}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/5 mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse-glow" />
              <span className="text-xs text-indigo-300 font-medium tracking-wide">PRICING</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.08] tracking-tight mb-6">
              <span className="text-white">Intelligence</span>
              <br />
              <span className="nx-gradient-text">without gatekeeping</span>
            </h1>

            <p className="text-lg text-white/50 leading-relaxed max-w-2xl mx-auto font-light">
              Access the autonomous think tank with plans designed for your operating reality. 
              30-day free trial, no commitment.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 mb-24 max-w-3xl mx-auto ${mounted ? 'animate-fade-in delay-200' : 'opacity-0'}`}>
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative p-8 rounded-xl border transition-all duration-300 ${
                  plan.highlighted 
                    ? 'border-indigo-500/30 bg-indigo-500/[0.04]' 
                    : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="px-3 py-1 bg-indigo-500 text-white text-[10px] font-semibold rounded-full tracking-wide">
                      MOST POPULAR
                    </div>
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="font-display text-lg font-semibold text-white mb-1">{plan.name}</h3>
                  <p className="text-sm text-white/40 mb-5">{plan.description}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-display font-semibold text-white">€{plan.price}</span>
                    <span className="text-sm text-white/30">{plan.period}</span>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, fi) => (
                    <div key={fi} className="flex items-center gap-3">
                      <Check size={14} className={plan.highlighted ? "text-indigo-400" : "text-white/30"} />
                      <span className="text-sm text-white/60">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setShowAuthModal(true)}
                  className={`w-full px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                    plan.highlighted
                      ? 'bg-indigo-500 hover:bg-indigo-400 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40'
                      : 'bg-white/[0.06] border border-white/[0.08] text-white/70 hover:text-white hover:bg-white/[0.1]'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>

          {/* Trust */}
          <div className="mb-24">
            <div className="text-center mb-12">
              <p className="text-xs text-indigo-400/80 font-medium tracking-[0.2em] uppercase mb-4">Trust</p>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-white">
                Why decision teams trust NomosX
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {trust.map((item, i) => (
                <div key={i} className="text-center p-7 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/15 flex items-center justify-center mx-auto mb-4">
                    <item.icon size={18} className="text-indigo-400" />
                  </div>
                  <h4 className="font-display text-sm font-semibold text-white mb-2">{item.title}</h4>
                  <p className="text-sm text-white/40 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="max-w-2xl mx-auto mb-24">
            <div className="text-center mb-12">
              <p className="text-xs text-indigo-400/80 font-medium tracking-[0.2em] uppercase mb-4">FAQ</p>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-white">
                Frequently asked questions
              </h2>
            </div>
            
            <div className="space-y-3">
              {faq.map((item, i) => (
                <div key={i} className="p-6 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                  <h4 className="font-display text-sm font-semibold text-white mb-2">{item.q}</h4>
                  <p className="text-sm text-white/40 leading-relaxed">{item.a}</p>
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
                Ready to start?
              </h2>
              <p className="text-base text-white/40 mb-8 max-w-xl mx-auto">
                30-day free trial. No credit card. No commitment.
              </p>
              <button
                onClick={() => setShowAuthModal(true)}
                className="group px-6 py-3 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white font-medium text-sm transition-all duration-300 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 inline-flex items-center gap-2"
              >
                Start free trial
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
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
              <button onClick={() => router.push("/methodology")} className="hover:text-white/40 transition-colors">Methodology</button>
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
