"use client";

const React = require('react');

const {useState,useEffect} = require('react');
const {NomosXLogo} = require('@/components/brand/NomosXLogo');
const {useRouter} = require('next/navigation');
const {Button} = require('@/components/ui/Button');
const {Card,CardContent} = require('@/components/ui/Card');
const AuthModal = require('@/components/AuthModal');
const OnboardingModal = require('@/components/OnboardingModal');
const PublicNav = require('@/components/PublicNav');
const ProviderShowcase = require('@/components/ProviderShowcase');
const {cn} = require('@/lib/utils');
const {ArrowRight,Zap,CheckCircle,Shield,TrendingUp,GitBranch,Mail,Loader2} = require('lucide-react');

export default function HomePage() {
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  // Newsletter signup state
  const [email, setEmail] = useState("");
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [newsletterError, setNewsletterError] = useState("");

  useEffect(() => {
    // Check auth status but DON'T auto-redirect
    // Home page is now for newsletter capture, not login gate
    fetch("/api/auth/me", { credentials: "include" })
      .then(res => {
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
        setIsLoading(false);
      })
      .catch(() => {
        setIsAuthenticated(false);
        setIsLoading(false);
      });
  }, []);
  
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
        setNewsletterError(data.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setNewsletterError("Network error. Please try again.");
    } finally {
      setNewsletterLoading(false);
    }
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  // Loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center relative transition-all duration-200 hover:opacity-80">
        <div className="fixed inset-0 pointer-events-none transition-all duration-200 hover:opacity-80">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-b from-cyan-500/10 via-blue-500/5 to-transparent rounded-full blur-3xl transition-all duration-200 hover:opacity-80" />
        </div>
        <div className="text-center relative z-10 transition-all duration-200 hover:opacity-80">
          <div className="mb-8 transition-all duration-200 hover:opacity-80">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#12121A] to-[#1A1A28] border border-white/10 flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-cyan-500/20 transition-all duration-200 hover:opacity-80">
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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent mb-2 transition-all duration-200 hover:opacity-80">
              NomosX
            </h1>
            <p className="text-sm text-white/50 transition-all duration-200 hover:opacity-80">The Autonomous Think Tank</p>
          </div>
          <div className="relative w-12 h-12 mx-auto transition-all duration-200 hover:opacity-80">
            <div className="absolute inset-0 border-2 border-cyan-500/20 rounded-full transition-all duration-200 hover:opacity-80"></div>
            <div className="absolute inset-0 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin transition-all duration-200 hover:opacity-80"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[#0B0B0D] text-white transition-all duration-200 hover:opacity-80">
        {/* Background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden transition-all duration-200 hover:opacity-80">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1400px] h-[900px] transition-all duration-200 hover:opacity-80">
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/8 via-blue-500/4 to-transparent blur-3xl transition-all duration-200 hover:opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/6 via-transparent to-cyan-500/6 blur-3xl transition-all duration-200 hover:opacity-80" />
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px] transition-all duration-200 hover:opacity-80" />
          {mounted && (
            <div className="absolute inset-0 transition-all duration-200 hover:opacity-80">
              {[...Array(15)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-cyan-400/20 animate-pulse transition-all duration-200 hover:opacity-80"
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

        <div className="relative z-10 transition-all duration-200 hover:opacity-80">
          {/* Nav */}
          {isAuthenticated ? (
            <nav className="border-b border-white/10 transition-all duration-200 hover:opacity-80">
              <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between transition-all duration-200 hover:opacity-80">
                <div 
                  className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => router.push("/")}
                >
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#12121A] to-[#1A1A28] border border-white/10 flex items-center justify-center transition-all duration-200 hover:opacity-80">
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
                  <span className="text-4xl font-bold tracking-tight transition-all duration-200 hover:opacity-80">
                    Nomos<span className="text-cyan-400 transition-all duration-200 hover:opacity-80">X</span>
                  </span>
                </div>
                <Button variant="ai" size="sm" onClick={() => router.push("/dashboard")}>
                  Enter Think Tank
                </Button>
              </div>
            </nav>
          ) : (
            <PublicNav currentPage="home" onSignInClick={() => setShowAuthModal(true)} />
          )}

          {/* Hero Institutionnel */}
          <section className="px-6 sm:px-8 pt-20 sm:pt-24 pb-16 sm:pb-20 md:pb-24 transition-all duration-200 hover:opacity-80">
            <div className="max-w-6xl mx-auto text-center transition-all duration-200 hover:opacity-80">
              {/* Logo */}
              <div className="flex items-center justify-center gap-4 mb-12 animate-fade-in transition-all duration-200 hover:opacity-80" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center gap-4 transition-all duration-200 hover:opacity-80">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center transition-all duration-200 hover:opacity-80">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center shadow-2xl relative transition-all duration-200 hover:opacity-80">
                      <span className="text-slate-100 font-serif text-4xl sm:text-4xl md:text-4xl font-bold tracking-tight transition-all duration-200 hover:opacity-80">N</span>
                      {/* Orbital elements */}
                      <div className="absolute inset-0 rounded-full border border-slate-600/30 transition-all duration-200 hover:opacity-80"></div>
                      <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-cyan-400 rounded-full opacity-60 transition-all duration-200 hover:opacity-80"></div>
                      <div className="absolute right-1 top-1/2 -translate-y-1/2 w-1 h-1 bg-slate-400 rounded-full opacity-40 transition-all duration-200 hover:opacity-80"></div>
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-slate-400 rounded-full opacity-40 transition-all duration-200 hover:opacity-80"></div>
                      <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-1 bg-slate-400 rounded-full opacity-40 transition-all duration-200 hover:opacity-80"></div>
                    </div>
                  </div>
                </div>
                <div>
                  <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif font-bold tracking-tight text-white/95 transition-all duration-200 hover:opacity-80">
                    Nomos<span className="text-slate-400 transition-all duration-200 hover:opacity-80">X</span>
                  </h1>
                  <div className="text-xs text-slate-500 tracking-[0.3em] uppercase mt-2 transition-all duration-200 hover:opacity-80">
                    Institutional Research Platform
                  </div>
                </div>
              </div>

              {/* Headline */}
              <h2 className="text-4xl sm:text-4xl md:text-5xl font-light leading-tight mb-8 animate-fade-in transition-all duration-200 hover:opacity-80" style={{ animationDelay: '0.2s' }}>
                <span className="bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent transition-all duration-200 hover:opacity-80">
                  An AI-governed research institution
                </span>
                <br />
                <span className="text-white/70 text-4xl sm:text-4xl md:text-4xl mt-4 block transition-all duration-200 hover:opacity-80">
                  that continuously monitors the world, detects weak signals,<br className="hidden md:block transition-all duration-200 hover:opacity-80" /> 
                  and publishes decision-ready insights — or stays silent.
                </span>
              </h2>

              {/* Spacing before Newsletter */}
              <div className="h-16 md:h-24 transition-all duration-200 hover:opacity-80"></div>

              {/* Primary CTA: Newsletter Signup */}
              <div className="max-w-xl mx-auto mb-8 animate-fade-in transition-all duration-200 hover:opacity-80" style={{ animationDelay: '0.3s' }}>
                {newsletterSuccess ? (
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/5 border border-emerald-500/20 text-center transition-all duration-200 hover:opacity-80">
                    <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4 transition-all duration-200 hover:opacity-80">
                      <CheckCircle className="w-7 h-7 text-emerald-400 transition-all duration-200 hover:opacity-80" />
                    </div>
                    <h3 className="text-4xl font-medium text-white mb-2 transition-all duration-200 hover:opacity-80">You're in!</h3>
                    <p className="text-white/60 text-sm mb-4 transition-all duration-200 hover:opacity-80">
                      Welcome to NomosX. You'll receive our Executive Briefs every week.
                    </p>
                    <button
                      onClick={() => isAuthenticated ? router.push("/dashboard") : setShowAuthModal(true)}
                      className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      Want full access? Start your 15-day trial →
                    </button>
                  </div>
                ) : (
                  <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 backdrop-blur-sm transition-all duration-200 hover:opacity-80">
                    <div className="flex items-center justify-center gap-2 mb-4 transition-all duration-200 hover:opacity-80">
                      <Mail className="w-5 h-5 text-cyan-400 transition-all duration-200 hover:opacity-80" />
                      <span className="text-sm text-cyan-400/80 font-medium transition-all duration-200 hover:opacity-80">Free Weekly Newsletter</span>
                    </div>
                    <h3 className="text-4xl sm:text-4xl font-light text-white text-center mb-2 transition-all duration-200 hover:opacity-80">
                      Get Executive Briefs delivered weekly
                    </h3>
                    <p className="text-sm text-white/50 text-center mb-6 transition-all duration-200 hover:opacity-80">
                      Decision-ready insights from an autonomous think tank. No noise, no fluff.
                    </p>
                    
                    <form onSubmit={handleNewsletterSubmit} className="space-y-3 transition-all duration-200 hover:opacity-80">
                      <div className="flex flex-col sm:flex-row gap-3 transition-all duration-200 hover:opacity-80">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                          className="flex-1 px-4 py-3.5 rounded-xl bg-background/[0.05] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all hover:opacity-80"
                          disabled={newsletterLoading}
                          required
                        />
                        <button
                          type="submit"
                          disabled={newsletterLoading || !email.trim()}
                          className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium shadow-[0_0_20px_rgba(0,212,255,0.3)] hover:shadow-[0_0_30px_rgba(0,212,255,0.5)] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 min-w-[140px]"
                        >
                          {newsletterLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin transition-all duration-200 hover:opacity-80" />
                          ) : (
                            <>
                              Subscribe
                              <ArrowRight className="w-4 h-4 transition-all duration-200 hover:opacity-80" />
                            </>
                          )}
                        </button>
                      </div>
                      
                      {newsletterError && (
                        <p className="text-sm text-red-400 text-center transition-all duration-200 hover:opacity-80">{newsletterError}</p>
                      )}
                      
                      <p className="text-xs text-white/30 text-center transition-all duration-200 hover:opacity-80">
                        Free forever. Unsubscribe anytime. No spam.
                      </p>
                    </form>
                  </div>
                )}
              </div>

              {/* Secondary CTA: Full Access */}
              <div className="text-center animate-fade-in transition-all duration-200 hover:opacity-80" style={{ animationDelay: '0.4s' }}>
                <button
                  onClick={() => isAuthenticated ? router.push("/dashboard") : setShowAuthModal(true)}
                  className="text-sm text-white/50 hover:text-white transition-colors inline-flex items-center gap-2"
                >
                  {isAuthenticated ? "Go to Command Center" : "Want full access? Start your 15-day trial"}
                  <ArrowRight className="w-4 h-4 transition-all duration-200 hover:opacity-80" />
                </button>
              </div>
            </div>
          </section>

          {/* Provider Showcase */}
          <ProviderShowcase />

          {/* What NomosX Does */}
          <section className="max-w-7xl mx-auto px-6 sm:px-8 py-16 sm:py-20 md:py-24 border-t border-white/[0.08] transition-all duration-200 hover:opacity-80">
            <div className="max-w-4xl mb-20 transition-all duration-200 hover:opacity-80">
              <div className="text-xs text-cyan-400/60 tracking-[0.25em] uppercase mb-6 flex items-center gap-3 transition-all duration-200 hover:opacity-80">
                <div className="w-8 h-px bg-gradient-to-r from-cyan-400/60 to-transparent transition-all duration-200 hover:opacity-80" />
                <span>What NomosX Does</span>
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-light leading-tight text-white/95 mb-6 transition-all duration-200 hover:opacity-80">
                Autonomous research institution
              </h2>
              <p className="text-4xl text-white/50 leading-relaxed max-w-3xl transition-all duration-200 hover:opacity-80">
                NomosX operates as an AI-governed think tank with full editorial autonomy.
                It monitors, evaluates, and publishes—or chooses strategic silence.
              </p>
            </div>

            {/* Grid 4 piliers */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 transition-all duration-200 hover:opacity-80">
              {/* Continuous Signal Detection */}
              <div className="group relative p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/[0.08] hover:border-cyan-500/30 transition-all duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                <div className="relative z-10 transition-all duration-200 hover:opacity-80">
                  <div className="w-14 h-14 rounded-xl mb-6 bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border border-cyan-500/20 flex items-center justify-center transition-all duration-200 hover:opacity-80">
                    <Zap className="w-7 h-7 text-cyan-400 transition-all duration-200 hover:opacity-80" />
                  </div>
                  <h3 className="text-4xl font-light mb-3 text-white/95 transition-all duration-200 hover:opacity-80">
                    Continuous signal detection
                  </h3>
                  <p className="text-sm text-white/50 leading-relaxed transition-all duration-200 hover:opacity-80">
                    Monitors 200,000+ sources daily to identify emerging trends and weak signals before they become mainstream.
                  </p>
                </div>
              </div>

              {/* Evidence-based Evaluation */}
              <div className="group relative p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/[0.08] hover:border-emerald-500/30 transition-all duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                <div className="relative z-10 transition-all duration-200 hover:opacity-80">
                  <div className="w-14 h-14 rounded-xl mb-6 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 flex items-center justify-center transition-all duration-200 hover:opacity-80">
                    <CheckCircle className="w-7 h-7 text-emerald-400 transition-all duration-200 hover:opacity-80" />
                  </div>
                  <h3 className="text-4xl font-light mb-3 text-white/95 transition-all duration-200 hover:opacity-80">
                    Evidence-based evaluation
                  </h3>
                  <p className="text-sm text-white/50 leading-relaxed transition-all duration-200 hover:opacity-80">
                    Agent-based validation pipeline ensures every insight is grounded in peer-reviewed research.
                  </p>
                </div>
              </div>

              {/* Editorial Decision Gate */}
              <div className="group relative p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/[0.08] hover:border-primary/30 transition-all duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                <div className="relative z-10 transition-all duration-200 hover:opacity-80">
                  <div className="w-14 h-14 rounded-xl mb-6 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-primary/20 flex items-center justify-center transition-all duration-200 hover:opacity-80">
                    <Shield className="w-7 h-7 text-primary transition-all duration-200 hover:opacity-80" />
                  </div>
                  <h3 className="text-4xl font-light mb-3 text-white/95 transition-all duration-200 hover:opacity-80">
                    Editorial decision gate
                  </h3>
                  <p className="text-sm text-white/50 leading-relaxed transition-all duration-200 hover:opacity-80">
                    Autonomous editorial system decides what merits publication—or strategic silence.
                  </p>
                </div>
              </div>

              {/* Controlled Publication Cadence */}
              <div className="group relative p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/[0.08] hover:border-secondary/30 transition-all duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                <div className="relative z-10 transition-all duration-200 hover:opacity-80">
                  <div className="w-14 h-14 rounded-xl mb-6 bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-secondary/20 flex items-center justify-center transition-all duration-200 hover:opacity-80">
                    <TrendingUp className="w-7 h-7 text-secondary transition-all duration-200 hover:opacity-80" />
                  </div>
                  <h3 className="text-4xl font-light mb-3 text-white/95 transition-all duration-200 hover:opacity-80">
                    Controlled publication cadence
                  </h3>
                  <p className="text-sm text-white/50 leading-relaxed transition-all duration-200 hover:opacity-80">
                    Disciplined output rhythm ensures quality over quantity. Silence is a success state.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section className="relative py-16 sm:py-20 md:py-24 border-t border-white/[0.08] overflow-hidden transition-all duration-200 hover:opacity-80">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent transition-all duration-200 hover:opacity-80" />
            
            <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 transition-all duration-200 hover:opacity-80">
              <div className="text-center mb-16 transition-all duration-200 hover:opacity-80">
                <div className="text-xs text-cyan-400/60 tracking-[0.25em] uppercase mb-6 flex items-center justify-center gap-3 transition-all duration-200 hover:opacity-80">
                  <div className="w-8 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent transition-all duration-200 hover:opacity-80" />
                  <span>How It Works</span>
                  <div className="w-8 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent transition-all duration-200 hover:opacity-80" />
                </div>
                <h2 className="text-4xl sm:text-5xl font-light leading-tight text-white/95 mb-4 transition-all duration-200 hover:opacity-80">
                  AI-governed research system
                </h2>
                <p className="text-4xl text-white/50 max-w-2xl mx-auto transition-all duration-200 hover:opacity-80">
                  A disciplined approach to institutional knowledge production
                </p>
              </div>

              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto transition-all duration-200 hover:opacity-80">
                {/* Autonomous Research Pipeline */}
                <div className="text-center transition-all duration-200 hover:opacity-80">
                  <div className="relative mx-auto w-20 h-20 mb-6 transition-all duration-200 hover:opacity-80">
                    <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-xl transition-all duration-200 hover:opacity-80" />
                    <div className="relative w-full h-full rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/20 flex items-center justify-center transition-all duration-200 hover:opacity-80">
                      <GitBranch className="w-9 h-9 text-cyan-400 transition-all duration-200 hover:opacity-80" />
                    </div>
                  </div>
                  <h3 className="text-4xl font-light mb-3 text-white/95 transition-all duration-200 hover:opacity-80">Autonomous research pipeline</h3>
                  <p className="text-sm text-white/50 leading-relaxed transition-all duration-200 hover:opacity-80">
                    Multi-agent system orchestrates data collection, validation, and synthesis without human intervention.
                  </p>
                </div>

                {/* Agent-based Validation */}
                <div className="text-center transition-all duration-200 hover:opacity-80">
                  <div className="relative mx-auto w-20 h-20 mb-6 transition-all duration-200 hover:opacity-80">
                    <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl transition-all duration-200 hover:opacity-80" />
                    <div className="relative w-full h-full rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/20 flex items-center justify-center transition-all duration-200 hover:opacity-80">
                      <CheckCircle className="w-9 h-9 text-emerald-400 transition-all duration-200 hover:opacity-80" />
                    </div>
                  </div>
                  <h3 className="text-4xl font-light mb-3 text-white/95 transition-all duration-200 hover:opacity-80">Agent-based validation</h3>
                  <p className="text-sm text-white/50 leading-relaxed transition-all duration-200 hover:opacity-80">
                    Every claim is verified against multiple sources. Full citation tracking ensures institutional credibility.
                  </p>
                </div>

                {/* Editorial Discipline */}
                <div className="text-center transition-all duration-200 hover:opacity-80">
                  <div className="relative mx-auto w-20 h-20 mb-6 transition-all duration-200 hover:opacity-80">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl transition-all duration-200 hover:opacity-80" />
                    <div className="relative w-full h-full rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/20 flex items-center justify-center transition-all duration-200 hover:opacity-80">
                      <Shield className="w-9 h-9 text-primary transition-all duration-200 hover:opacity-80" />
                    </div>
                  </div>
                  <h3 className="text-4xl font-light mb-3 text-white/95 transition-all duration-200 hover:opacity-80">Editorial discipline</h3>
                  <p className="text-sm text-white/50 leading-relaxed transition-all duration-200 hover:opacity-80">
                    Controlled publication cadence. Only institution-grade insights are published—or strategic silence is chosen.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* What You Get */}
          <section className="relative py-24 sm:py-32 border-t border-white/[0.08] transition-all duration-200 hover:opacity-80">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 transition-all duration-200 hover:opacity-80">
              <div className="text-center mb-16 transition-all duration-200 hover:opacity-80">
                <div className="text-xs text-cyan-400/60 tracking-[0.25em] uppercase mb-6 flex items-center justify-center gap-3 transition-all duration-200 hover:opacity-80">
                  <div className="w-8 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent transition-all duration-200 hover:opacity-80" />
                  <span>What You Get</span>
                  <div className="w-8 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent transition-all duration-200 hover:opacity-80" />
                </div>
                <h2 className="text-4xl sm:text-5xl font-light leading-tight text-white/95 mb-4 transition-all duration-200 hover:opacity-80">
                  Institution-grade publications
                </h2>
                <p className="text-4xl text-white/50 max-w-2xl mx-auto transition-all duration-200 hover:opacity-80">
                  Every output meets the standards of traditional think tanks—with AI-powered speed and scale.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-200 hover:opacity-80">
                {[
                  { title: 'Executive Briefs', desc: '2-3 page decision-ready analyses delivered weekly via newsletter', color: 'cyan' },
                  { title: 'Strategic Reports', desc: '10-15 page deep dives with scenario planning and recommendations', color: 'amber' },
                  { title: 'Signal Detection', desc: 'Continuous monitoring of 200K+ sources for weak signals', color: 'blue' },
                  { title: 'Editorial Discipline', desc: 'Quality over quantity — silence is a success state', color: 'purple' }
                ].map((item, i) => (
                  <div key={i} className="group relative p-6 rounded-xl bg-background/[0.02] border border-white/[0.08] hover:border-white/20 transition-all duration-300">
                    <div className="relative z-10 transition-all duration-200 hover:opacity-80">
                      <div className="flex items-center gap-2 mb-3 transition-all duration-200 hover:opacity-80">
                        <div className={`w-2 h-2 rounded-full bg-${item.color}-400`} />
                        <h3 className="text-4xl font-light text-white/95 transition-all duration-200 hover:opacity-80">{item.title}</h3>
                      </div>
                      <p className="text-sm text-white/50 leading-relaxed transition-all duration-200 hover:opacity-80">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="border-t border-white/10 transition-all duration-200 hover:opacity-80">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-200 hover:opacity-80">
              <div className="flex items-center gap-3 transition-all duration-200 hover:opacity-80">
                <div className="w-7 h-7 rounded-md bg-gradient-to-br from-[#12121A] to-[#1A1A28] border border-white/10 flex items-center justify-center transition-all duration-200 hover:opacity-80">
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
                <span className="text-sm font-semibold text-white/50 transition-all duration-200 hover:opacity-80">
                  Nomos<span className="text-cyan-400/60 transition-all duration-200 hover:opacity-80">X</span>
                </span>
                <span className="text-xs text-white/30 transition-all duration-200 hover:opacity-80">The Autonomous Think Tank</span>
              </div>
              <div className="flex items-center gap-6 text-sm text-white/40 transition-all duration-200 hover:opacity-80">
                <button onClick={() => router.push("/about")} className="hover:text-white transition-colors">
                  About
                </button>
                <button onClick={() => router.push("/methodology")} className="hover:text-white transition-colors">
                  Methodology
                </button>
                <span> 2026 NomosX</span>
              </div>
            </div>
          </footer>
        </div>
      </div>
      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        onSignupSuccess={() => {
          setShowAuthModal(false);
          setShowOnboardingModal(true);
        }}
      />

      {/* Onboarding Modal */}
      <OnboardingModal
        isOpen={showOnboardingModal}
        onClose={() => setShowOnboardingModal(false)}
      />
    </>
  );
}
