"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import { Card, CardContent } from "@/components/ui/Card";
import AuthModal from "@/components/AuthModal";
import { 
  ArrowRight,
  Brain,
  FileText,
  MessagesSquare,
  Radar as RadarIcon,
  Library,
  Search
} from "lucide-react";

const EXAMPLE_QUESTIONS = [
  "Quels sont les impacts économiques d'une taxe carbone en Europe ?",
  "L'IA générative va-t-elle transformer la recherche académique ?",
  "Quelles preuves empiriques pour le revenu de base universel ?",
  "Comment équilibrer innovation et régulation dans la blockchain ?",
];

export default function HomePage() {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % EXAMPLE_QUESTIONS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const authToken = localStorage.getItem("auth_token");
    if (authToken) {
      setIsAuthenticated(true);
      router.replace("/dashboard");
    } else {
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  }, []);

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
                  <linearGradient id="loadingGradient" x1="30%" y1="0%" x2="70%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#00D4FF', stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: '#4A7FE0', stopOpacity: 1}} />
                  </linearGradient>
                </defs>
                <path d="M 25 30 L 25 90 L 33 90 L 33 30 Z" fill="url(#loadingGradient)"/>
                <path d="M 33 35 L 60 60 L 87 85 L 93 80 L 60 53 L 33 28 Z" fill="url(#loadingGradient)"/>
                <path d="M 87 35 L 60 60 L 33 85 L 27 80 L 60 53 L 87 28 Z" fill="url(#loadingGradient)" opacity="0.9"/>
                <path d="M 87 30 L 87 90 L 95 90 L 95 30 Z" fill="url(#loadingGradient)"/>
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

  function handleSubmit() {
    if (!question.trim()) return;
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    router.push(`/dashboard?q=${encodeURIComponent(question)}`);
  }

  return (
    <>
      <div className="min-h-screen bg-[#0B0B0D] text-white">
        {/* Background Futuriste */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
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

        <div className="relative z-10">
          {/* Nav */}
          <nav className="border-b border-white/10">
            <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
              <div 
                className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => router.push("/")}
              >
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#12121A] to-[#1A1A28] border border-white/10 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 120 120" fill="none">
                    <defs>
                      <linearGradient id="navGradient" x1="30%" y1="0%" x2="70%" y2="100%">
                        <stop offset="0%" style={{stopColor: '#00D4FF', stopOpacity: 1}} />
                        <stop offset="100%" style={{stopColor: '#4A7FE0', stopOpacity: 1}} />
                      </linearGradient>
                    </defs>
                    <path d="M 25 30 L 25 90 L 33 90 L 33 30 Z" fill="url(#navGradient)"/>
                    <path d="M 33 35 L 60 60 L 87 85 L 93 80 L 60 53 L 33 28 Z" fill="url(#navGradient)"/>
                    <path d="M 87 35 L 60 60 L 33 85 L 27 80 L 60 53 L 87 28 Z" fill="url(#navGradient)" opacity="0.9"/>
                    <path d="M 87 30 L 87 90 L 95 90 L 95 30 Z" fill="url(#navGradient)"/>
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
                  onClick={() => router.push("/about")}
                  className="text-sm text-white/60 hover:text-white transition-colors hidden sm:block"
                >
                  À propos
                </button>
                {isAuthenticated ? (
                  <Button variant="ai" size="sm" onClick={() => router.push("/dashboard")}>
                    Dashboard
                  </Button>
                ) : (
                  <Button variant="primary" size="sm" onClick={() => setShowAuthModal(true)}>
                    Connexion
                  </Button>
                )}
              </div>
            </div>
          </nav>

          {/* Hero Futuriste */}
          <section className="px-4 sm:px-6 pt-20 sm:pt-24 pb-20 sm:pb-28">
            <div className="max-w-6xl mx-auto text-center">
              
              {/* Trust Bar Subtil */}
              <div className="flex items-center justify-center gap-4 text-xs text-white/30 tracking-[0.2em] uppercase mb-12 animate-fade-in">
                <span>Fortune 500</span>
                <div className="w-1 h-1 rounded-full bg-cyan-400/40" />
                <span>Research Institutions</span>
                <div className="w-1 h-1 rounded-full bg-cyan-400/40" />
                <span>Government</span>
              </div>

              {/* Logo avec Glow Effect */}
              <div className="flex items-center justify-center gap-4 mb-12 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#12121A] to-[#1A1A28] border border-white/10 flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform duration-500">
                    <svg width="48" height="48" viewBox="0 0 120 120" fill="none" className="sm:w-14 sm:h-14">
                      <defs>
                        <linearGradient id="heroGradient" x1="30%" y1="0%" x2="70%" y2="100%">
                          <stop offset="0%" style={{stopColor: '#00D4FF', stopOpacity: 1}} />
                          <stop offset="100%" style={{stopColor: '#4A7FE0', stopOpacity: 1}} />
                        </linearGradient>
                      </defs>
                      <path d="M 25 30 L 25 90 L 33 90 L 33 30 Z" fill="url(#heroGradient)"/>
                      <path d="M 33 35 L 60 60 L 87 85 L 93 80 L 60 53 L 33 28 Z" fill="url(#heroGradient)"/>
                      <path d="M 87 35 L 60 60 L 33 85 L 27 80 L 60 53 L 87 28 Z" fill="url(#heroGradient)" opacity="0.9"/>
                      <path d="M 87 30 L 87 90 L 95 90 L 95 30 Z" fill="url(#heroGradient)"/>
                      <circle cx="60" cy="60" r="6" fill="white"/>
                      <circle cx="60" cy="60" r="3" fill="#00D4FF"/>
                      <circle cx="29" cy="30" r="1.5" fill="white" opacity="0.7"/>
                      <circle cx="91" cy="30" r="1.5" fill="white" opacity="0.7"/>
                      <circle cx="29" cy="90" r="1.5" fill="white" opacity="0.7"/>
                      <circle cx="91" cy="90" r="1.5" fill="white" opacity="0.7"/>
                    </svg>
                  </div>
                </div>
                <div>
                  <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white/95">
                    Nomos<span className="text-cyan-400">X</span>
                  </h1>
                  <div className="text-xs text-cyan-400/60 tracking-[0.3em] uppercase mt-2">
                    Agentic Intelligence
                  </div>
                </div>
              </div>

              {/* Headline Gradient Text */}
              <h2 className="text-4xl sm:text-5xl md:text-7xl font-light leading-tight mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <span className="bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent">
                  Strategic intelligence
                </span>
                <br />
                <span className="text-white/70 italic text-3xl sm:text-4xl md:text-5xl">from 200,000+ research papers</span>
              </h2>

              {/* Subheadline */}
              <p className="text-lg sm:text-xl text-white/50 leading-relaxed max-w-3xl mx-auto mb-16 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                Autonomous agent infrastructure delivering institutional-grade analysis 
                in real-time. Trusted by Fortune 500, governments, and research institutions.
              </p>

              {/* Stats Cards Inline */}
              <div className="grid grid-cols-3 gap-6 sm:gap-12 max-w-5xl mx-auto mb-16 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <div className="group relative p-4 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-cyan-500/30 transition-all duration-500 backdrop-blur-sm">
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

                <div className="group relative p-4 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-emerald-500/30 transition-all duration-500 backdrop-blur-sm">
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

                <div className="group relative p-4 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-blue-500/30 transition-all duration-500 backdrop-blur-sm">
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
            </div>

            {/* Input */}
            <div className="max-w-3xl mx-auto mb-12 sm:mb-16">
              <div className={`relative rounded-2xl transition-all duration-300 ${isFocused ? 'ring-2 ring-cyan-500/50' : ''}`}>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-blue-500/20 rounded-2xl blur-sm" />
                
                <div className="relative bg-[#111113] border border-white/10 rounded-2xl p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-3 sm:mb-4">
                    <Search size={18} className="text-cyan-400 flex-shrink-0" />
                    <span className="text-sm font-medium text-white/50">Posez votre question</span>
                  </div>
                  
                  <Textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={EXAMPLE_QUESTIONS[currentPlaceholder]}
                    rows={3}
                    className="text-base sm:text-lg bg-transparent border-none focus:ring-0 placeholder:text-white/30 resize-none mb-4"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit();
                    }}
                  />
                  
                  <div className="flex items-center justify-between gap-4">
                    <div className="hidden sm:flex items-center gap-2 text-xs text-white/40">
                      <kbd className="px-2 py-1 bg-white/5 border border-white/10 rounded font-mono">⌘</kbd>
                      <span>+</span>
                      <kbd className="px-2 py-1 bg-white/5 border border-white/10 rounded font-mono">↵</kbd>
                    </div>
                    
                    <button 
                      onClick={handleSubmit}
                      disabled={!question.trim()}
                      className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium shadow-[0_0_30px_rgba(0,212,255,0.3)] hover:shadow-[0_0_50px_rgba(0,212,255,0.5)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        Analyser
                        <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl opacity-0 group-hover:opacity-100 blur transition-opacity" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-6">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-white/50">
                  <div className="relative flex-shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                    <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 rounded-full bg-cyan-400/60 animate-pulse"></div>
                  </div>
                  <span>Sans inscription</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-white/50">
                  <div className="relative flex-shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                    <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 rounded-full bg-cyan-400/60 animate-pulse"></div>
                  </div>
                  <span>Gratuit</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-white/50">
                  <div className="relative flex-shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                    <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 rounded-full bg-cyan-400/60 animate-pulse"></div>
                  </div>
                  <span>Résultats en 60s</span>
                </div>
              </div>
            </div>
          </section>

          {/* Services Section Futuriste */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 py-24 sm:py-32 border-t border-white/[0.08]">
            {/* Header Premium */}
            <div className="max-w-4xl mb-20">
              <div className="text-xs text-cyan-400/60 tracking-[0.25em] uppercase mb-6 flex items-center gap-3">
                <div className="w-8 h-px bg-gradient-to-r from-cyan-400/60 to-transparent" />
                <span>Intelligence Infrastructure</span>
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-light leading-tight text-white/95 mb-6">
                Four autonomous intelligence services
              </h2>
              <p className="text-xl text-white/50 leading-relaxed max-w-3xl">
                Each service delivers institutional-grade analysis through 
                specialized agent pipelines. Evidence-based methodology, 
                Fortune 500-trusted infrastructure, real-time delivery.
              </p>
            </div>

            {/* Grid Services Futuriste */}
            <div className="grid lg:grid-cols-2 gap-8">
              
              {/* Brief - Cyan */}
              <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/[0.08] hover:border-cyan-500/30 transition-all duration-500 overflow-hidden">
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                
                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className="relative z-10">
                  {/* Icon avec glow */}
                  <div className="w-16 h-16 rounded-xl mb-6 bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border border-cyan-500/20 flex items-center justify-center group-hover:shadow-[0_0_30px_rgba(0,212,255,0.3)] transition-shadow duration-500">
                    <FileText className="w-8 h-8 text-cyan-400" />
                  </div>

                  {/* Title */}
                  <h3 className="text-3xl font-light mb-2 text-white/95 group-hover:text-cyan-400/90 transition-colors duration-300">
                    Brief
                  </h3>
                  
                  {/* Subtitle */}
                  <div className="text-sm text-cyan-400/60 tracking-[0.2em] uppercase mb-6">
                    Dialectical Analysis
                  </div>

                  {/* Description */}
                  <p className="text-base text-white/50 leading-relaxed mb-8">
                    Structured synthesis identifying consensus, disagreements, 
                    and strategic implications from academic research. 
                    Evidence-based methodology with full citation tracking.
                  </p>

                  {/* Features avec nœuds */}
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-3 text-sm text-white/60">
                      <div className="relative flex-shrink-0 mt-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 rounded-full bg-cyan-400/60 animate-pulse" />
                      </div>
                      <span>10 structured analytical sections</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-white/60">
                      <div className="relative flex-shrink-0 mt-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 rounded-full bg-cyan-400/60 animate-pulse" />
                      </div>
                      <span>Full source verification & citations</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-white/60">
                      <div className="relative flex-shrink-0 mt-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 rounded-full bg-cyan-400/60 animate-pulse" />
                      </div>
                      <span>Export to PDF, share with teams</span>
                    </li>
                  </ul>

                  {/* Arrow on hover */}
                  <div className="flex items-center gap-2 text-sm text-cyan-400/60 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <span>Explore Brief</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>

              {/* Council - Blue */}
              <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/[0.08] hover:border-blue-500/30 transition-all duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-xl mb-6 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 flex items-center justify-center group-hover:shadow-[0_0_30px_rgba(74,127,224,0.3)] transition-shadow duration-500">
                    <MessagesSquare className="w-8 h-8 text-blue-400" />
                  </div>

                  <h3 className="text-3xl font-light mb-2 text-white/95 group-hover:text-blue-400/90 transition-colors duration-300">
                    Council
                  </h3>
                  
                  <div className="text-sm text-blue-400/60 tracking-[0.2em] uppercase mb-6">
                    Multi-Perspective Analysis
                  </div>

                  <p className="text-base text-white/50 leading-relaxed mb-8">
                    Four expert angles—Economic, Technical, Ethical, and Political—
                    analyzing the same question. Integrated synthesis revealing 
                    tensions and convergences across perspectives.
                  </p>

                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-3 text-sm text-white/60">
                      <div className="relative flex-shrink-0 mt-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                        <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 rounded-full bg-blue-400/60 animate-pulse" />
                      </div>
                      <span>4 distinct expert perspectives</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-white/60">
                      <div className="relative flex-shrink-0 mt-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                        <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 rounded-full bg-blue-400/60 animate-pulse" />
                      </div>
                      <span>Tension mapping & conflict analysis</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-white/60">
                      <div className="relative flex-shrink-0 mt-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                        <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 rounded-full bg-blue-400/60 animate-pulse" />
                      </div>
                      <span>Integrated strategic synthesis</span>
                    </li>
                  </ul>

                  <div className="flex items-center gap-2 text-sm text-blue-400/60 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <span>Explore Council</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>

              {/* Radar - Emerald */}
              <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/[0.08] hover:border-emerald-500/30 transition-all duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-xl mb-6 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 flex items-center justify-center group-hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-shadow duration-500">
                    <RadarIcon className="w-8 h-8 text-emerald-400" />
                  </div>

                  <h3 className="text-3xl font-light mb-2 text-white/95 group-hover:text-emerald-400/90 transition-colors duration-300">
                    Radar
                  </h3>
                  
                  <div className="text-sm text-emerald-400/60 tracking-[0.2em] uppercase mb-6">
                    Weak Signal Detection
                  </div>

                  <p className="text-base text-white/50 leading-relaxed mb-8">
                    Automatic detection of emerging trends and weak signals 
                    in high-novelty research. Stay ahead with early identification 
                    of strategic opportunities before they become mainstream.
                  </p>

                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-3 text-sm text-white/60">
                      <div className="relative flex-shrink-0 mt-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 rounded-full bg-emerald-400/60 animate-pulse" />
                      </div>
                      <span>Novelty score ≥60 filtering</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-white/60">
                      <div className="relative flex-shrink-0 mt-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 rounded-full bg-emerald-400/60 animate-pulse" />
                      </div>
                      <span>Weekly strategic alerts & digests</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-white/60">
                      <div className="relative flex-shrink-0 mt-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 rounded-full bg-emerald-400/60 animate-pulse" />
                      </div>
                      <span>AI-powered trend categorization</span>
                    </li>
                  </ul>

                  <div className="flex items-center gap-2 text-sm text-emerald-400/60 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <span>Explore Radar</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>

              {/* Library - Purple */}
              <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/[0.08] hover:border-purple-500/30 transition-all duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-xl mb-6 bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 flex items-center justify-center group-hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-shadow duration-500">
                    <Library className="w-8 h-8 text-purple-400" />
                  </div>

                  <h3 className="text-3xl font-light mb-2 text-white/95 group-hover:text-purple-400/90 transition-colors duration-300">
                    Library
                  </h3>
                  
                  <div className="text-sm text-purple-400/60 tracking-[0.2em] uppercase mb-6">
                    Institutional Memory
                  </div>

                  <p className="text-base text-white/50 leading-relaxed mb-8">
                    Centralized organization of all your analyses with semantic search 
                    and advanced filtering. Build institutional knowledge, track evolution, 
                    and share insights across teams.
                  </p>

                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-3 text-sm text-white/60">
                      <div className="relative flex-shrink-0 mt-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                        <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 rounded-full bg-purple-400/60 animate-pulse" />
                      </div>
                      <span>Semantic search across all briefs</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-white/60">
                      <div className="relative flex-shrink-0 mt-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                        <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 rounded-full bg-purple-400/60 animate-pulse" />
                      </div>
                      <span>Advanced filters by date, topic, sources</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-white/60">
                      <div className="relative flex-shrink-0 mt-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                        <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 rounded-full bg-purple-400/60 animate-pulse" />
                      </div>
                      <span>Export, share & collaborate</span>
                    </li>
                  </ul>

                  <div className="flex items-center gap-2 text-sm text-purple-400/60 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <span>Explore Library</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Pipeline Section Futuriste */}
          <section className="relative py-24 sm:py-32 border-t border-white/[0.08] overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent" />
            
            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
              <div className="text-center mb-16">
                <div className="text-xs text-cyan-400/60 tracking-[0.25em] uppercase mb-6 flex items-center justify-center gap-3">
                  <div className="w-8 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
                  <span>Autonomous Pipeline</span>
                  <div className="w-8 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
                </div>
                <h2 className="text-4xl sm:text-5xl font-light leading-tight text-white/95 mb-4">
                  Real-time agent orchestration
                </h2>
                <p className="text-lg text-white/50 max-w-2xl mx-auto">
                  From data collection to strategic synthesis in under 60 seconds
                </p>
              </div>

              {/* Flow avec connexions animées */}
              <div className="relative mb-16">
                {/* Ligne de connexion */}
                <div className="absolute top-16 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent hidden md:block" />
                <div className="absolute top-16 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-pulse hidden md:block" />

                {/* Agents */}
                <div className="grid md:grid-cols-5 gap-6">
                  {[
                    { name: 'SCOUT', desc: '8 providers', icon: Search },
                    { name: 'INDEX', desc: 'Enrichment', icon: Brain },
                    { name: 'RANK', desc: 'Top sources', icon: ArrowRight },
                    { name: 'READER', desc: 'Extraction', icon: FileText },
                    { name: 'ANALYST', desc: 'Synthesis', icon: MessagesSquare }
                  ].map((agent, i) => (
                    <div key={i} className="text-center">
                      {/* Agent node */}
                      <div className="relative mx-auto w-16 h-16 sm:w-20 sm:h-20 mb-4">
                        <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-xl animate-pulse" />
                        <div className="relative w-full h-full rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/20 flex items-center justify-center hover:scale-110 transition-transform duration-300">
                          <agent.icon className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400" />
                        </div>
                      </div>

                      {/* Label */}
                      <div className="font-mono text-xs text-cyan-400 tracking-wider uppercase mb-1">
                        {agent.name}
                      </div>
                      <div className="text-xs text-white/40">
                        {agent.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Final CTA Futuriste */}
          <section className="relative max-w-5xl mx-auto px-4 sm:px-6 py-24 sm:py-32">
            <div className="relative overflow-hidden">
              {/* Background effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-purple-500/10 rounded-3xl blur-2xl" />
              
              <div className="relative text-center p-10 sm:p-16 rounded-3xl border border-white/[0.08] bg-gradient-to-br from-white/[0.02] to-white/[0.01] backdrop-blur-xl">
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-light leading-tight mb-6">
                  <span className="bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent">
                    Ready to transform
                  </span>
                  <br />
                  <span className="text-white/80">strategic intelligence?</span>
                </h2>
                
                <p className="text-lg sm:text-xl text-white/50 mb-12 max-w-2xl mx-auto leading-relaxed">
                  Join Fortune 500 companies and research institutions using NomosX 
                  for evidence-based decision-making
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                  <button
                    onClick={() => !isAuthenticated ? setShowAuthModal(true) : router.push("/dashboard")}
                    className="group relative px-10 py-5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium text-lg shadow-[0_0_40px_rgba(0,212,255,0.4)] hover:shadow-[0_0_60px_rgba(0,212,255,0.6)] transition-all duration-300"
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      Start Analysis
                      <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl opacity-0 group-hover:opacity-100 blur-sm transition-opacity" />
                  </button>
                  
                  <button
                    onClick={() => router.push("/about")}
                    className="px-10 py-5 rounded-xl bg-white/[0.03] border border-white/10 text-white/80 font-medium text-lg hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300"
                  >
                    Learn More
                  </button>
                </div>
                
                <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/40">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-cyan-400" />
                    <span>No registration required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-emerald-400" />
                    <span>Free to start</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-blue-400" />
                    <span>Results in 60 seconds</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="border-t border-white/10">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-md bg-gradient-to-br from-[#12121A] to-[#1A1A28] border border-white/10 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 120 120" fill="none">
                    <defs>
                      <linearGradient id="footerGradient" x1="30%" y1="0%" x2="70%" y2="100%">
                        <stop offset="0%" style={{stopColor: '#00D4FF', stopOpacity: 1}} />
                        <stop offset="100%" style={{stopColor: '#4A7FE0', stopOpacity: 1}} />
                      </linearGradient>
                    </defs>
                    <path d="M 25 30 L 25 90 L 33 90 L 33 30 Z" fill="url(#footerGradient)"/>
                    <path d="M 33 35 L 60 60 L 87 85 L 93 80 L 60 53 L 33 28 Z" fill="url(#footerGradient)"/>
                    <path d="M 87 35 L 60 60 L 33 85 L 27 80 L 60 53 L 87 28 Z" fill="url(#footerGradient)" opacity="0.9"/>
                    <path d="M 87 30 L 87 90 L 95 90 L 95 30 Z" fill="url(#footerGradient)"/>
                    <circle cx="60" cy="60" r="6" fill="white"/>
                    <circle cx="60" cy="60" r="3" fill="#00D4FF"/>
                  </svg>
                </div>
                <span className="text-sm font-semibold text-white/50">
                  Nomos<span className="text-cyan-400/60">X</span>
                </span>
                <span className="text-xs text-white/30">Think Tank Agentique</span>
              </div>
              <div className="flex items-center gap-6 text-sm text-white/40">
                <button onClick={() => router.push("/about")} className="hover:text-white transition-colors">
                  À propos
                </button>
                <span>© 2026 NomosX</span>
              </div>
            </div>
          </footer>
        </div>
      </div>

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialQuestion={question}
      />
    </>
  );
}
