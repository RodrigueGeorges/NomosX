"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthModal from '@/components/AuthModal';
import OnboardingModal from '@/components/OnboardingModal';
import PublicNav from '@/components/PublicNav';
import { Brain, Shield, Zap, Globe, BarChart3, TrendingUp, ArrowRight, CheckCircle, Clock, Sparkles, Search, FileText, Users } from 'lucide-react';
import InteractiveDemo from '@/components/InteractiveDemo';

export default function HomePage() {
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setShowAuthModal(false);
    setShowOnboardingModal(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-6 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="text-lg font-bold text-white">N</span>
          </div>
          <div className="w-6 h-6 mx-auto border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const features = [
    {
      icon: Clock,
      title: "Analysis in 60 seconds",
      description: "From complex question to structured brief with verifiable citations. Faster than an analyst sprint, stricter than a consultant deck.",
      gradient: "from-indigo-500/10 to-indigo-500/5",
      iconColor: "text-indigo-400",
      borderHover: "hover:border-indigo-500/30",
    },
    {
      icon: Shield,
      title: "Zero hallucination policy",
      description: "Citation Guard validates every source. Full traceability, institutional integrity, and evidence-first reasoning by default.",
      gradient: "from-violet-500/10 to-violet-500/5",
      iconColor: "text-violet-400",
      borderHover: "hover:border-violet-500/30",
    },
    {
      icon: TrendingUp,
      title: "Weak signal detection",
      description: "Automatic detection of emerging shifts before they become consensus. Anticipate strategic moves instead of reacting late.",
      gradient: "from-emerald-500/10 to-emerald-500/5",
      iconColor: "text-emerald-400",
      borderHover: "hover:border-emerald-500/30",
    },
  ];

  const pipeline = [
    { icon: Search, label: "SCOUT", desc: "250M+ sources", color: "bg-indigo-500" },
    { icon: BarChart3, label: "RANK", desc: "Quality selection", color: "bg-violet-500" },
    { icon: FileText, label: "READER", desc: "Claim extraction", color: "bg-purple-500" },
    { icon: Brain, label: "ANALYST", desc: "Strategic synthesis", color: "bg-fuchsia-500" },
  ];

  const stats = [
    { value: "250M+", label: "Academic sources" },
    { value: "8", label: "PhD perspectives" },
    { value: "60s", label: "Analysis runtime" },
    { value: "99.2%", label: "Citation precision" },
  ];

  const institutions = [
    "MIT", "Stanford", "Oxford", "Johns Hopkins", "Georgetown", "Yale", "ETH Zürich", "Harvard"
  ];

  return (
    <>
      <div className="min-h-screen bg-[#09090b] text-white overflow-hidden">
        
        {/* Background */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.15),transparent_70%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_80%_50%,rgba(139,92,246,0.08),transparent_70%)]" />
          <div className="nx-grid-bg absolute inset-0 opacity-40" />
        </div>

        <div className="relative z-10">

          {/* Navigation */}
          <PublicNav 
            currentPage="home" 
            onSignInClick={() => setShowAuthModal(true)} 
            isAuthenticated={isAuthenticated} 
          />

          {/* Hero Section */}
          <section className="relative px-6 sm:px-8 pt-20 sm:pt-28 pb-20">
            <div className="max-w-5xl mx-auto text-center">
              
              {/* Badge */}
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/5 mb-8 ${mounted ? 'animate-fade-in' : 'opacity-0'}`}>
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse-glow" />
                <span className="text-xs text-indigo-300 font-medium tracking-wide">AUTONOMOUS THINK TANK</span>
              </div>
              
              {/* Headline */}
              <h1 className={`font-display text-5xl sm:text-6xl md:text-7xl font-semibold leading-[1.05] tracking-tight mb-6 ${mounted ? 'animate-fade-in delay-100' : 'opacity-0'}`}>
                <span className="text-white">Institutional</span>
                <br />
                <span className="nx-gradient-text">research intelligence</span>
                <br />
                <span className="text-white/50">for decisive teams</span>
              </h1>
              
              {/* Subtitle */}
              <p className={`text-lg sm:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed font-light ${mounted ? 'animate-fade-in delay-200' : 'opacity-0'}`}>
                8 AI researchers analyze 250M+ academic publications and deliver 
                source-grounded strategic analysis in 60 seconds.
              </p>
              
              {/* CTA */}
              <div className={`flex flex-col sm:flex-row gap-3 justify-center mb-6 ${mounted ? 'animate-fade-in delay-300' : 'opacity-0'}`}>
                <button 
                  onClick={() => setShowAuthModal(true)}
                  className="group px-6 py-3 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white font-medium text-sm transition-all duration-300 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 flex items-center justify-center gap-2"
                >
                  Start free
                  <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
                <button 
                  onClick={() => router.push('/methodology')}
                  className="px-6 py-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/70 hover:text-white hover:bg-white/[0.08] hover:border-white/[0.12] font-medium text-sm transition-all duration-200"
                >
                  How it works
                </button>
              </div>

              {/* Trust line */}
              <p className={`text-xs text-white/30 ${mounted ? 'animate-fade-in delay-400' : 'opacity-0'}`}>
                Free · No credit card · First analysis in 60s
              </p>
            </div>
          </section>

          {/* Stats bar */}
          <section className={`relative px-6 sm:px-8 pb-20 ${mounted ? 'animate-fade-in delay-500' : 'opacity-0'}`}>
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-2xl overflow-hidden border border-white/[0.06]">
                {stats.map((stat, i) => (
                  <div key={i} className="bg-white/[0.02] px-6 py-8 text-center">
                    <div className="text-2xl sm:text-3xl font-display font-semibold text-white mb-1">{stat.value}</div>
                    <div className="text-xs text-white/40">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Pipeline Section */}
          <section className="relative px-6 sm:px-8 py-20">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-14">
                <p className="text-xs text-indigo-400/80 font-medium tracking-[0.2em] uppercase mb-4">Agentic Pipeline</p>
                <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white mb-4">
                  From question to brief in 4 stages
                </h2>
                <p className="text-base text-white/40 max-w-2xl mx-auto">
                  Each agent has one mission. The pipeline transforms your question into decision-grade intelligence.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {pipeline.map((step, i) => (
                  <div key={i} className="group relative p-6 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-300">
                    {/* Step number */}
                    <div className="absolute top-4 right-4 text-[10px] font-mono text-white/20 font-medium">{String(i + 1).padStart(2, '0')}</div>
                    
                    <div className={`w-9 h-9 rounded-lg ${step.color} flex items-center justify-center mb-4 shadow-lg`}>
                      <step.icon size={16} className="text-white" />
                    </div>
                    <h3 className="font-display text-sm font-semibold text-white mb-1">{step.label}</h3>
                    <p className="text-xs text-white/40">{step.desc}</p>

                    {/* Connector line */}
                    {i < pipeline.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 -right-2 w-4 h-px bg-gradient-to-r from-white/10 to-transparent" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Live Demo Section */}
          <section className="relative px-6 sm:px-8 py-20">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <p className="text-xs text-indigo-400/80 font-medium tracking-[0.2em] uppercase mb-4">Live Demo</p>
                <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white mb-4">
                  Watch the pipeline run
                </h2>
                <p className="text-base text-white/40 max-w-2xl mx-auto">
                  Every 10 seconds, a new research question is processed end-to-end — automatically.
                </p>
              </div>
              <InteractiveDemo />
            </div>
          </section>

          {/* Features Section */}
          <section className="relative px-6 sm:px-8 py-20">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-14">
                <p className="text-xs text-indigo-400/80 font-medium tracking-[0.2em] uppercase mb-4">Why teams choose NomosX</p>
                <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white mb-4">
                  Built for high-stakes decisions
                </h2>
                <p className="text-base text-white/40 max-w-2xl mx-auto">
                  Strategic research should not be gated behind elite institutions.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {features.map((feature, i) => (
                  <div
                    key={i}
                    className={`group relative p-7 rounded-xl border border-white/[0.06] bg-white/[0.02] ${feature.borderHover} hover:bg-white/[0.04] transition-all duration-300`}
                  >
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${feature.gradient} border border-white/[0.08] flex items-center justify-center mb-5`}>
                      <feature.icon size={18} className={feature.iconColor} />
                    </div>
                    <h3 className="font-display text-base font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-white/40 leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Institutions Section */}
          <section className="relative px-6 sm:px-8 py-20">
            <div className="max-w-5xl mx-auto text-center">
              <p className="text-xs text-white/30 font-medium tracking-[0.2em] uppercase mb-8">Calibrated to the standards of</p>
              <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
                {institutions.map((inst, i) => (
                  <span key={i} className="text-sm font-display font-medium text-white/20 hover:text-white/40 transition-colors duration-300">{inst}</span>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="relative px-6 sm:px-8 py-24">
            <div className="max-w-3xl mx-auto text-center">
              {/* Glow */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[500px] h-[300px] bg-indigo-500/10 rounded-full blur-[120px]" />
              </div>

              <div className="relative">
                <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white mb-4">
                  Ready to upgrade your
                  <br />
                  <span className="nx-gradient-text">strategic operating system?</span>
                </h2>
                <p className="text-base text-white/40 mb-8 max-w-xl mx-auto">
                  Join decision teams using NomosX for institutional-grade strategic intelligence.
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
          </section>

          {/* Footer */}
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

      {/* Modals */}
      {showAuthModal && (
        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSignupSuccess={handleAuthSuccess}
        />
      )}
      {showOnboardingModal && (
        <OnboardingModal 
          isOpen={showOnboardingModal}
          onClose={() => setShowOnboardingModal(false)}
        />
      )}
    </>
  );
}
