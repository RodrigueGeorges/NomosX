/**
 * About Page — Présentation NomosX
 * 
 * Utilité : Explain value prop, how it works, why trust us
 * UX : Storytelling, visual, convert curiosity → signup
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import AuthModal from "@/components/AuthModal";
import {
  Sparkles,
  Brain,
  Shield,
  Zap,
  Target,
  ArrowRight,
  FileText,
  MessagesSquare,
  Radar as RadarIcon,
  Library
} from "lucide-react";
import AgenticNode from "@/components/AgenticNode";

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
            <p className="text-sm text-white/50">Think Tank Agentique</p>
          </div>
          <div className="relative w-12 h-12 mx-auto">
            <div className="absolute inset-0 border-2 border-cyan-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  const features = [
    {
      icon: FileText,
      color: "cyan",
      title: "Brief",
      subtitle: "Dialectical Analysis",
      description: "Structured synthesis identifying consensus, disagreements, and strategic implications from academic research. Evidence-based methodology with full citation tracking."
    },
    {
      icon: MessagesSquare,
      color: "blue",
      title: "Council",
      subtitle: "Multi-Perspective Analysis",
      description: "Four expert angles—Economic, Technical, Ethical, and Political—analyzing the same question. Integrated synthesis revealing tensions and convergences across perspectives."
    },
    {
      icon: RadarIcon,
      color: "emerald",
      title: "Radar",
      subtitle: "Emerging Signals",
      description: "Automated detection of weak signals and high-novelty research (noveltyScore ≥ 60). Pattern recognition across 200K+ publications identifying future trends."
    },
    {
      icon: Library,
      color: "purple",
      title: "Library",
      subtitle: "Knowledge Base",
      description: "Centralized repository of all your briefs and councils. Full-text search, tagging system, export capabilities, and complete analysis history."
    }
  ];

  const principles = [
    {
      icon: Shield,
      title: "Full Transparency",
      description: "Every statement is sourced with [SRC-*] citations. Real-time pipeline visibility through streaming SSE. Audit-ready traceability."
    },
    {
      icon: Brain,
      title: "Agent-First Architecture",
      description: "Autonomous agent pipelines with intent detection, smart routing, and adaptive workflows. The system optimizes itself."
    },
    {
      icon: Zap,
      title: "Sub-60s Delivery",
      description: "Optimistic UI, parallel agent execution, streaming results. Institutional-grade analysis delivered at consumer-grade speed."
    },
    {
      icon: Target,
      title: "Decision-Ready Intelligence",
      description: "Not just information, but structured analysis designed for strategic decision-making. Export to PDF, share with teams, integrate into workflows."
    }
  ];

  const howItWorks = [
    {
      step: "1",
      agent: "SCOUT",
      title: "Source Discovery",
      description: "Query 200K+ publications across OpenAlex, Crossref, Semantic Scholar, arXiv, PubMed. Parallel provider execution with quality scoring."
    },
    {
      step: "2",
      agent: "INDEX",
      title: "Identity Enrichment",
      description: "Normalize metadata, resolve author identities (ORCID), institutional affiliations (ROR). Deduplication and novelty detection."
    },
    {
      step: "3",
      agent: "RANK",
      title: "Source Selection",
      description: "Select top sources by quality score (citations, recency, open access). Diversity optimization across years, providers, and geographies."
    },
    {
      step: "4",
      agent: "READER",
      title: "Content Extraction",
      description: "Parallel PDF extraction, abstract analysis, claims/methods/results identification. Structured output for downstream synthesis."
    },
    {
      step: "5",
      agent: "ANALYST",
      title: "Synthesis & Delivery",
      description: "Generate dialectical brief or multi-perspective council. Citation verification, streaming delivery, export to PDF."
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

        {/* Nav simplifiée */}
        <nav className="border-b border-white/10 relative z-10">
          <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
            <div 
              className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => router.push("/")}
            >
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#12121A] to-[#1A1A28] border border-white/10 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 120 120" fill="none">
                  <defs>
                    <linearGradient id="aboutNavGradient" x1="30%" y1="0%" x2="70%" y2="100%">
                      <stop offset="0%" style={{stopColor: '#00D4FF', stopOpacity: 1}} />
                      <stop offset="100%" style={{stopColor: '#4A7FE0', stopOpacity: 1}} />
                    </linearGradient>
                  </defs>
                  <path d="M 25 30 L 25 90 L 33 90 L 33 30 Z" fill="url(#aboutNavGradient)"/>
                  <path d="M 33 35 L 60 60 L 87 85 L 93 80 L 60 53 L 33 28 Z" fill="url(#aboutNavGradient)"/>
                  <path d="M 87 35 L 60 60 L 33 85 L 27 80 L 60 53 L 87 28 Z" fill="url(#aboutNavGradient)" opacity="0.9"/>
                  <path d="M 87 30 L 87 90 L 95 90 L 95 30 Z" fill="url(#aboutNavGradient)"/>
                  <circle cx="60" cy="60" r="6" fill="white"/>
                  <circle cx="60" cy="60" r="3" fill="#00D4FF"/>
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight">
                Nomos<span className="text-cyan-400">X</span>
              </span>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => router.push("/")}
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                Accueil
              </button>
              <Button variant="primary" size="sm" onClick={() => setShowAuthModal(true)}>
                Connexion
              </Button>
            </div>
          </div>
        </nav>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          {/* Hero */}
          <div className="text-center mb-20">
            <div className="text-xs text-cyan-400/60 tracking-[0.25em] uppercase mb-6 flex items-center justify-center gap-3">
              <div className="w-8 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
              <span>Agentic Intelligence Platform</span>
              <div className="w-8 h-px bg-gradient-to-r from-cyan-400/60 via-transparent to-transparent" />
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-light leading-tight mb-6">
              <span className="bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent">
                From academic research
              </span>
              <br />
              <span className="text-white/70 italic text-3xl sm:text-4xl md:text-5xl">to strategic decisions</span>
            </h1>

            <p className="text-xl text-white/50 leading-relaxed max-w-3xl mx-auto mb-8">
              Autonomous agent infrastructure transforming 200,000+ academic publications 
              into institutional-grade analysis. Evidence-based methodology trusted by 
              Fortune 500, governments, and research institutions.
            </p>

            <div className="flex gap-4 justify-center flex-wrap">
              <Button variant="ai" size="lg" onClick={() => setShowAuthModal(true)}>
                Commencer gratuitement
                <ArrowRight size={18} className="ml-2" />
              </Button>
              <Button variant="ghost" size="lg" onClick={() => router.push("/")}>
                Retour à l'accueil
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="mb-20">
            <div className="max-w-4xl mb-12">
              <div className="text-xs text-cyan-400/60 tracking-[0.25em] uppercase mb-6 flex items-center gap-3">
                <div className="w-8 h-px bg-gradient-to-r from-cyan-400/60 to-transparent" />
                <span>Intelligence Infrastructure</span>
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-light leading-tight text-white/95 mb-6">
                Four autonomous intelligence services
              </h2>
              <p className="text-xl text-white/50 leading-relaxed max-w-3xl">
                Each service delivers institutional-grade analysis through 
                specialized agent pipelines. Real-time delivery, full transparency.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, i) => {
                const colorMap = {
                  cyan: { 
                    bg: "bg-cyan-500/10", 
                    border: "border-cyan-500/20", 
                    text: "text-cyan-400",
                    hover: "hover:border-cyan-500/30",
                    glow: "group-hover:shadow-[0_0_30px_rgba(0,212,255,0.3)]",
                    glowBg: "from-cyan-500/10 via-cyan-500/5"
                  },
                  blue: { 
                    bg: "bg-blue-500/10", 
                    border: "border-blue-500/20", 
                    text: "text-blue-400",
                    hover: "hover:border-blue-500/30",
                    glow: "group-hover:shadow-[0_0_30px_rgba(74,127,224,0.3)]",
                    glowBg: "from-blue-500/10 via-blue-500/5"
                  },
                  emerald: { 
                    bg: "bg-emerald-500/10", 
                    border: "border-emerald-500/20", 
                    text: "text-emerald-400",
                    hover: "hover:border-emerald-500/30",
                    glow: "group-hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]",
                    glowBg: "from-emerald-500/10 via-emerald-500/5"
                  },
                  purple: { 
                    bg: "bg-purple-500/10", 
                    border: "border-purple-500/20", 
                    text: "text-purple-400",
                    hover: "hover:border-purple-500/30",
                    glow: "group-hover:shadow-[0_0_30px_rgba(139,92,246,0.3)]",
                    glowBg: "from-purple-500/10 via-purple-500/5"
                  }
                };
                const colors = colorMap[feature.color as keyof typeof colorMap];
                
                return (
                  <div key={i} className={`group relative p-8 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.03] to-white/[0.01] ${colors.hover} transition-all duration-500 overflow-hidden`}>
                    {/* Glow effect on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${colors.glowBg} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />
                    
                    {/* Decorative corner */}
                    <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${colors.glowBg} to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                    
                    <div className="relative z-10">
                      {/* Icon */}
                      <div className={`w-16 h-16 rounded-xl mb-6 ${colors.bg} border ${colors.border} flex items-center justify-center ${colors.glow} transition-shadow duration-500`}>
                        <feature.icon size={32} className={colors.text} />
                      </div>
                      
                      {/* Title */}
                      <h3 className="text-3xl font-light mb-2 text-white/95">{feature.title}</h3>
                      
                      {/* Subtitle */}
                      <div className={`text-sm ${colors.text} tracking-[0.2em] uppercase mb-6 opacity-60`}>
                        {feature.subtitle}
                      </div>
                      
                      {/* Description */}
                      <p className="text-base text-white/50 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Principles */}
          <div className="mb-20">
            <div className="max-w-4xl mb-12">
              <div className="text-xs text-blue-400/60 tracking-[0.25em] uppercase mb-6 flex items-center gap-3">
                <div className="w-8 h-px bg-gradient-to-r from-blue-400/60 to-transparent" />
                <span>Core Principles</span>
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-light leading-tight text-white/95 mb-6">
                What makes us different
              </h2>
              <p className="text-xl text-white/50 leading-relaxed max-w-3xl">
                Built on transparency, speed, and decision-ready intelligence. 
                No black boxes, no shallow summaries.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {principles.map((principle, i) => (
                <div key={i} className="group relative p-8 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.03] to-white/[0.01] hover:border-blue-500/30 transition-all duration-500 overflow-hidden">
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                  
                  {/* Decorative corner */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="w-16 h-16 rounded-xl mb-6 bg-blue-500/10 border border-blue-500/20 flex items-center justify-center group-hover:shadow-[0_0_30px_rgba(74,127,224,0.3)] transition-shadow duration-500">
                      <principle.icon size={32} className="text-blue-400" />
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-2xl font-light mb-4 text-white/95">{principle.title}</h3>
                    
                    {/* Description */}
                    <p className="text-base text-white/50 leading-relaxed">
                      {principle.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* How It Works */}
          <div className="mb-20">
            <div className="max-w-4xl mb-12">
              <div className="text-xs text-emerald-400/60 tracking-[0.25em] uppercase mb-6 flex items-center gap-3">
                <div className="w-8 h-px bg-gradient-to-r from-emerald-400/60 to-transparent" />
                <span>Agent Pipeline</span>
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-light leading-tight text-white/95 mb-6">
                How it works
              </h2>
              <p className="text-xl text-white/50 leading-relaxed max-w-3xl">
                Five specialized agents working in sequence to deliver 
                institutional-grade analysis in under 60 seconds.
              </p>
            </div>

            <div className="space-y-4">
              {howItWorks.map((item, i) => (
                <div key={i} className="group relative p-8 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.03] to-white/[0.01] hover:border-emerald-500/30 transition-all duration-500 overflow-hidden">
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                  
                  <div className="relative flex items-start gap-8">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 flex items-center justify-center group-hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-shadow duration-500">
                        <span className="text-2xl font-light text-emerald-400">{item.step}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      {/* Agent tag */}
                      <div className="text-xs text-emerald-400/60 tracking-[0.25em] uppercase mb-2">
                        {item.agent}
                      </div>
                      
                      {/* Title */}
                      <h3 className="text-2xl font-light mb-3 text-white/95">{item.title}</h3>
                      
                      {/* Description */}
                      <p className="text-base text-white/50 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats - Identiques à Home */}
          <div className="grid md:grid-cols-3 gap-6 mb-20">
            <div className="group relative p-4 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-cyan-500/30 transition-all duration-500 backdrop-blur-sm text-center">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="text-4xl sm:text-6xl font-light bg-gradient-to-br from-white to-cyan-200 bg-clip-text text-transparent mb-2">
                  200K+
                </div>
                <div className="text-xs text-white/40 tracking-[0.15em] uppercase">
                  Publications
                </div>
                <div className="mt-3 text-xs text-cyan-400/60 flex items-center justify-center gap-1">
                  <div className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse" />
                  <span>Live updated</span>
                </div>
              </div>
            </div>

            <div className="group relative p-4 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-emerald-500/30 transition-all duration-500 backdrop-blur-sm text-center">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="text-4xl sm:text-6xl font-light bg-gradient-to-br from-white to-emerald-200 bg-clip-text text-transparent mb-2">
                  98.7%
                </div>
                <div className="text-xs text-white/40 tracking-[0.15em] uppercase">
                  Accuracy
                </div>
                <div className="mt-3 text-xs text-emerald-400/60 flex items-center justify-center gap-1">
                  <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Verified</span>
                </div>
              </div>
            </div>

            <div className="group relative p-4 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-blue-500/30 transition-all duration-500 backdrop-blur-sm text-center">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="text-4xl sm:text-6xl font-light bg-gradient-to-br from-white to-blue-200 bg-clip-text text-transparent mb-2">
                  &lt;60s
                </div>
                <div className="text-xs text-white/40 tracking-[0.15em] uppercase">
                  Analysis
                </div>
                <div className="mt-3 text-xs text-blue-400/60 flex items-center justify-center gap-1">
                  <div className="w-1 h-1 rounded-full bg-blue-400 animate-pulse" />
                  <span>Real-time</span>
                </div>
              </div>
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
              <span className="text-xs text-white/30">Think Tank Agentique</span>
            </div>
            <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm text-white/40">
              <button onClick={() => router.push("/")} className="hover:text-white transition-colors">
                Accueil
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
