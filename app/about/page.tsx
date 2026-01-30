/**
 * About Page — Story, Mission & Vision
 * 
 * Purpose: Who we are, why NomosX exists, our vision for autonomous research
 * UX: Storytelling, institutional credibility, convert curiosity → trust
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import AuthModal from "@/components/AuthModal";
import PublicNav from "@/components/PublicNav";
import {
  Sparkles,
  Brain,
  Shield,
  Target,
  ArrowRight,
  Globe,
  Users,
  Lightbulb,
  BookOpen
} from "lucide-react";

export default function AboutPage() {
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const authToken = localStorage.getItem("auth_token");
    if (authToken) {
      router.push("/dashboard");
      return;
    }
    setIsLoading(false);
  }, [router]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center relative">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-b from-cyan-500/10 via-blue-500/5 to-transparent rounded-full blur-3xl" />
        </div>
        <div className="text-center relative z-10">
          <div className="mb-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#12121A] to-[#1A1A28] border border-white/10 flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-cyan-500/20">
              <svg width="56" height="56" viewBox="0 0 120 120" fill="none">
                <defs>
                  <linearGradient id="aboutLoadingGradient" x1="30%" y1="0%" x2="70%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#00D4FF', stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: '#4A7FE0', stopOpacity: 1}} />
                  </linearGradient>
                </defs>
                <path d="M 25 30 L 25 90 L 33 90 L 33 30 Z" fill="url(#aboutLoadingGradient)"/>
                <path d="M 33 35 L 60 60 L 87 85 L 93 80 L 60 53 L 33 28 Z" fill="url(#aboutLoadingGradient)"/>
                <path d="M 87 35 L 60 60 L 33 85 L 27 80 L 60 53 L 87 28 Z" fill="url(#aboutLoadingGradient)" opacity="0.9"/>
                <path d="M 87 30 L 87 90 L 95 90 L 95 30 Z" fill="url(#aboutLoadingGradient)"/>
                <circle cx="60" cy="60" r="6" fill="white"/>
                <circle cx="60" cy="60" r="3" fill="#00D4FF"/>
              </svg>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent mb-2">
              NomosX
            </h1>
            <p className="text-sm text-white/50">The Autonomous Think Tank</p>
          </div>
          <div className="relative w-12 h-12 mx-auto">
            <div className="absolute inset-0 border-2 border-cyan-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  const vision = [
    {
      icon: Globe,
      title: "Democratize Strategic Intelligence",
      description: "World-class research analysis shouldn't be reserved for Fortune 500 companies and governments. We're building the infrastructure to make institutional-grade intelligence accessible to everyone."
    },
    {
      icon: Brain,
      title: "AI as Institutional Partner",
      description: "Not a chatbot. Not a search engine. An autonomous research institution with editorial judgment, quality standards, and the discipline to stay silent when there's nothing worth saying."
    },
    {
      icon: Shield,
      title: "Trust Through Transparency",
      description: "Every claim is cited. Every source is traceable. Every decision is logged. We believe trust is earned through radical transparency, not marketing promises."
    },
    {
      icon: Lightbulb,
      title: "Signal Over Noise",
      description: "In a world drowning in information, the most valuable service is knowing what matters. Our editorial gate exists to protect your attention, not capture it."
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
      description: "We built the first autonomous research pipeline. Multi-agent orchestration. Editorial gates. Quality thresholds. The system that publishes—or stays silent."
    },
    {
      year: "2026",
      title: "The Institution",
      description: "NomosX operates as a fully autonomous think tank. 200K+ sources monitored. Institutional-grade publications. Strategic silence as a feature, not a bug."
    }
  ];

  const values = [
    {
      title: "Rigor Over Speed",
      description: "We'd rather be slow and right than fast and wrong. Every publication passes through multiple validation layers."
    },
    {
      title: "Silence Over Noise",
      description: "Publishing nothing is better than publishing something mediocre. Our editorial gate enforces this discipline."
    },
    {
      title: "Transparency Over Trust",
      description: "We don't ask you to trust us. We show you our sources, our reasoning, and our confidence levels."
    },
    {
      title: "Autonomy Over Control",
      description: "The system decides what to publish. Humans can propose, but the editorial gate has final say."
    }
  ];

  return (
    <>
      <div className="min-h-screen bg-[#0B0B0D] text-white">
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

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-light leading-tight mb-6">
              <span className="bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent">
                An AI-governed research institution
              </span>
              <br />
              <span className="text-white/70 italic text-3xl sm:text-4xl md:text-5xl">that publishes—or stays silent</span>
            </h1>

            <p className="text-xl text-white/50 leading-relaxed max-w-3xl mx-auto mb-8">
              NomosX operates as an autonomous think tank with full editorial independence. 
              It continuously monitors 200,000+ academic publications, detects weak signals, 
              and publishes decision-ready insights—or chooses strategic silence.
            </p>

            <div className="flex gap-4 justify-center flex-wrap">
              <Button variant="ai" size="lg" onClick={() => setShowAuthModal(true)}>
                Start for free
                <ArrowRight size={18} className="ml-2" />
              </Button>
              <Button variant="ghost" size="lg" onClick={() => router.push("/methodology")}>
                View Methodology
              </Button>
            </div>
          </div>

          {/* Our Vision */}
          <div className="mb-20">
            <div className="max-w-4xl mb-12">
              <div className="text-xs text-cyan-400/60 tracking-[0.25em] uppercase mb-6 flex items-center gap-3">
                <div className="w-8 h-px bg-gradient-to-r from-cyan-400/60 to-transparent" />
                <span>Our Vision</span>
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-light leading-tight text-white/95 mb-6">
                Why we built NomosX
              </h2>
              <p className="text-xl text-white/50 leading-relaxed max-w-3xl">
                We believe the future of strategic intelligence is autonomous, transparent, 
                and accessible to everyone—not just those who can afford traditional consulting.
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
                    
                    <h3 className="text-2xl font-light mb-4 text-white/95">{item.title}</h3>
                    
                    <p className="text-base text-white/50 leading-relaxed">
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
              <div className="text-xs text-blue-400/60 tracking-[0.25em] uppercase mb-6 flex items-center gap-3">
                <div className="w-8 h-px bg-gradient-to-r from-blue-400/60 to-transparent" />
                <span>Our Story</span>
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-light leading-tight text-white/95 mb-6">
                From idea to institution
              </h2>
              <p className="text-xl text-white/50 leading-relaxed max-w-3xl">
                The journey from recognizing a problem to building an autonomous research institution.
              </p>
            </div>

            <div className="space-y-6">
              {timeline.map((item, i) => (
                <div key={i} className="group relative p-8 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.03] to-white/[0.01] hover:border-blue-500/30 transition-all duration-500 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                  
                  <div className="relative flex items-start gap-8">
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 flex items-center justify-center group-hover:shadow-[0_0_30px_rgba(74,127,224,0.3)] transition-shadow duration-500">
                        <span className="text-2xl font-light text-blue-400">{item.year}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-light mb-3 text-white/95">{item.title}</h3>
                      <p className="text-base text-white/50 leading-relaxed">{item.description}</p>
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
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-light leading-tight text-white/95 mb-6">
                What we stand for
              </h2>
              <p className="text-xl text-white/50 leading-relaxed max-w-3xl">
                Four principles that guide every decision we make.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {values.map((item, i) => (
                <div key={i} className="group relative p-8 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.03] to-white/[0.01] hover:border-emerald-500/30 transition-all duration-500 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                  
                  <div className="relative z-10">
                    <h3 className="text-2xl font-light mb-4 text-white/95">{item.title}</h3>
                    <p className="text-base text-white/50 leading-relaxed">{item.description}</p>
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
              
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-light leading-tight mb-6">
                <span className="bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent">
                  Ready to elevate
                </span>
                <br />
                <span className="text-white/70 italic text-3xl sm:text-4xl">your strategic intelligence?</span>
              </h2>
              
              <p className="text-xl text-white/50 mb-12 max-w-3xl mx-auto leading-relaxed">
                Join Fortune 500 companies, governments, and research institutions 
                using NomosX for decision-critical intelligence.
              </p>
              
              <button
                onClick={() => setShowAuthModal(true)}
                className="group relative px-10 py-5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium text-lg shadow-[0_0_40px_rgba(0,212,255,0.4)] hover:shadow-[0_0_60px_rgba(0,212,255,0.6)] transition-all duration-300"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  Start for free
                  <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl opacity-0 group-hover:opacity-100 blur-sm transition-opacity" />
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
        <footer className="border-t border-white/10 relative z-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-md bg-gradient-to-br from-[#12121A] to-[#1A1A28] border border-white/10 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 120 120" fill="none">
                  <defs>
                    <linearGradient id="aboutFooterGradient" x1="30%" y1="0%" x2="70%" y2="100%">
                      <stop offset="0%" style={{stopColor: '#00D4FF', stopOpacity: 1}} />
                      <stop offset="100%" style={{stopColor: '#4A7FE0', stopOpacity: 1}} />
                    </linearGradient>
                  </defs>
                  <path d="M 25 30 L 25 90 L 33 90 L 33 30 Z" fill="url(#aboutFooterGradient)"/>
                  <path d="M 33 35 L 60 60 L 87 85 L 93 80 L 60 53 L 33 28 Z" fill="url(#aboutFooterGradient)"/>
                  <path d="M 87 35 L 60 60 L 33 85 L 27 80 L 60 53 L 87 28 Z" fill="url(#aboutFooterGradient)" opacity="0.9"/>
                  <path d="M 87 30 L 87 90 L 95 90 L 95 30 Z" fill="url(#aboutFooterGradient)"/>
                  <circle cx="60" cy="60" r="6" fill="white"/>
                  <circle cx="60" cy="60" r="3" fill="#00D4FF"/>
                </svg>
              </div>
              <span className="text-sm font-semibold text-white/50">
                Nomos<span className="text-cyan-400/60">X</span>
              </span>
              <span className="text-xs text-white/30">The Autonomous Think Tank</span>
            </div>
            <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm text-white/40">
              <button onClick={() => router.push("/")} className="hover:text-white transition-colors">
                Home
              </button>
              <button onClick={() => router.push("/methodology")} className="hover:text-white transition-colors">
                Methodology
              </button>
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
