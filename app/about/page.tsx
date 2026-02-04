
"use client";
/**
 * About Page — Story, Mission & Vision
 * 
 * Purpose: Who we are, why NomosX exists, our vision for autonomous research
 * UX: Storytelling, institutional credibility, convert curiosity → trust
 */

const React = require('react');

const {useState,useEffect} = require('react');
const {useRouter} = require('next/navigation');
const {Button} = require('@/components/ui/Button');
const AuthModal = require('@/components/AuthModal');
const PublicNav = require('@/components/PublicNav');
const {cn} = require('@/lib/utils');
const {Sparkles,Brain,Shield,Target,ArrowRight,Globe,Users,Lightbulb,BookOpen} = require('lucide-react');

export default function AboutPage() {
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
      <div className="min-h-screen bg-[#0B0B0D] text-white transition-all duration-200 hover:opacity-80">
        {/* Background Futuriste - Identique à Home */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 transition-all duration-200 hover:opacity-80">
          {/* Mesh gradient principal */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1400px] h-[900px] transition-all duration-200 hover:opacity-80">
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/8 via-blue-500/4 to-transparent blur-3xl transition-all duration-200 hover:opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/6 via-transparent to-cyan-500/6 blur-3xl transition-all duration-200 hover:opacity-80" />
          </div>
          
          {/* Grid pattern subtil */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px] transition-all duration-200 hover:opacity-80" />
          
          {/* Particles réseau agentique - Client only to avoid hydration mismatch */}
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

        {/* Nav */}
        <PublicNav currentPage="about" onSignInClick={() => setShowAuthModal(true)} />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24 transition-all duration-200 hover:opacity-80">
          {/* Hero */}
          <div className="text-center mb-20 transition-all duration-200 hover:opacity-80">
            <div className="text-xs text-cyan-400/60 tracking-[0.25em] uppercase mb-6 flex items-center justify-center gap-3 transition-all duration-200 hover:opacity-80">
              <div className="w-8 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent transition-all duration-200 hover:opacity-80" />
              <span>The Autonomous Think Tank</span>
              <div className="w-8 h-px bg-gradient-to-r from-cyan-400/60 via-transparent to-transparent transition-all duration-200 hover:opacity-80" />
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-light leading-tight mb-6 transition-all duration-200 hover:opacity-80">
              <span className="bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent transition-all duration-200 hover:opacity-80">
                An AI-governed research institution
              </span>
              <br />
              <span className="text-white/70 italic text-4xl sm:text-4xl md:text-5xl transition-all duration-200 hover:opacity-80">that publishes—or stays silent</span>
            </h1>

            <p className="text-4xl text-white/50 leading-relaxed max-w-3xl mx-auto mb-8 transition-all duration-200 hover:opacity-80">
              NomosX operates as an autonomous think tank with full editorial independence. 
              It continuously monitors 200,000+ academic publications, detects weak signals, 
              and publishes decision-ready insights—or chooses strategic silence.
            </p>

            <div className="flex gap-4 justify-center flex-wrap transition-all duration-200 hover:opacity-80">
              <Button variant="ai" size="lg" onClick={() => setShowAuthModal(true)}>
                Start for free
                <ArrowRight size={18} className="ml-2 transition-all duration-200 hover:opacity-80" />
              </Button>
            </div>
          </div>

          {/* Our Vision */}
          <div className="mb-20 transition-all duration-200 hover:opacity-80">
            <div className="max-w-4xl mb-12 transition-all duration-200 hover:opacity-80">
              <div className="text-xs text-cyan-400/60 tracking-[0.25em] uppercase mb-6 flex items-center gap-3 transition-all duration-200 hover:opacity-80">
                <div className="w-8 h-px bg-gradient-to-r from-cyan-400/60 to-transparent transition-all duration-200 hover:opacity-80" />
                <span>Our Vision</span>
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-light leading-tight text-white/95 mb-6 transition-all duration-200 hover:opacity-80">
                Why we built NomosX
              </h2>
              <p className="text-4xl text-white/50 leading-relaxed max-w-3xl transition-all duration-200 hover:opacity-80">
                We believe the future of strategic intelligence is autonomous, transparent, 
                and accessible to everyone—not just those who can afford traditional consulting.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 transition-all duration-200 hover:opacity-80">
              {vision.map((item, i) => (
                <div key={i} className="group relative p-8 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.03] to-white/[0.01] hover:border-cyan-500/30 transition-all duration-500 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                  
                  <div className="relative z-10 transition-all duration-200 hover:opacity-80">
                    <div className="w-16 h-16 rounded-xl mb-6 bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center group-hover:shadow-[0_0_30px_rgba(0,212,255,0.3)] transition-shadow duration-500">
                      <item.icon size={32} className="text-cyan-400 transition-all duration-200 hover:opacity-80" />
                    </div>
                    
                    <h3 className="text-4xl font-light mb-4 text-white/95 transition-all duration-200 hover:opacity-80">{item.title}</h3>
                    
                    <p className="text-base text-white/50 leading-relaxed transition-all duration-200 hover:opacity-80">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Our Story - Timeline */}
          <div className="mb-20 transition-all duration-200 hover:opacity-80">
            <div className="max-w-4xl mb-12 transition-all duration-200 hover:opacity-80">
              <div className="text-xs text-primary/60 tracking-[0.25em] uppercase mb-6 flex items-center gap-3 transition-all duration-200 hover:opacity-80">
                <div className="w-8 h-px bg-gradient-to-r from-blue-400/60 to-transparent transition-all duration-200 hover:opacity-80" />
                <span>Our Story</span>
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-light leading-tight text-white/95 mb-6 transition-all duration-200 hover:opacity-80">
                From idea to institution
              </h2>
              <p className="text-4xl text-white/50 leading-relaxed max-w-3xl transition-all duration-200 hover:opacity-80">
                The journey from recognizing a problem to building an autonomous research institution.
              </p>
            </div>

            <div className="space-y-6 transition-all duration-200 hover:opacity-80">
              {timeline.map((item, i) => (
                <div key={i} className="group relative p-8 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.03] to-white/[0.01] hover:border-primary/30 transition-all duration-500 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                  
                  <div className="relative flex items-start gap-8 transition-all duration-200 hover:opacity-80">
                    <div className="flex-shrink-0 transition-all duration-200 hover:opacity-80">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-primary/20 flex items-center justify-center group-hover:shadow-[0_0_30px_rgba(74,127,224,0.3)] transition-shadow duration-500">
                        <span className="text-4xl font-light text-primary transition-all duration-200 hover:opacity-80">{item.year}</span>
                      </div>
                    </div>
                    <div className="flex-1 transition-all duration-200 hover:opacity-80">
                      <h3 className="text-4xl font-light mb-3 text-white/95 transition-all duration-200 hover:opacity-80">{item.title}</h3>
                      <p className="text-base text-white/50 leading-relaxed transition-all duration-200 hover:opacity-80">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Our Values */}
          <div className="mb-20 transition-all duration-200 hover:opacity-80">
            <div className="max-w-4xl mb-12 transition-all duration-200 hover:opacity-80">
              <div className="text-xs text-emerald-400/60 tracking-[0.25em] uppercase mb-6 flex items-center gap-3 transition-all duration-200 hover:opacity-80">
                <div className="w-8 h-px bg-gradient-to-r from-emerald-400/60 to-transparent transition-all duration-200 hover:opacity-80" />
                <span>Our Values</span>
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-light leading-tight text-white/95 mb-6 transition-all duration-200 hover:opacity-80">
                What we stand for
              </h2>
              <p className="text-4xl text-white/50 leading-relaxed max-w-3xl transition-all duration-200 hover:opacity-80">
                Four principles that guide every decision we make.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 transition-all duration-200 hover:opacity-80">
              {values.map((item, i) => (
                <div key={i} className="group relative p-8 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.03] to-white/[0.01] hover:border-emerald-500/30 transition-all duration-500 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                  
                  <div className="relative z-10 transition-all duration-200 hover:opacity-80">
                    <h3 className="text-4xl font-light mb-4 text-white/95 transition-all duration-200 hover:opacity-80">{item.title}</h3>
                    <p className="text-base text-white/50 leading-relaxed transition-all duration-200 hover:opacity-80">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Final Premium */}
          <div className="relative overflow-hidden pb-20 transition-all duration-200 hover:opacity-80">
            {/* Background effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-purple-500/10 rounded-3xl blur-2xl transition-all duration-200 hover:opacity-80" />
            
            <div className="relative text-center p-10 sm:p-16 rounded-3xl border border-white/[0.08] bg-gradient-to-br from-white/[0.02] to-white/[0.01] backdrop-blur-xl transition-all duration-200 hover:opacity-80">
              <div className="text-xs text-cyan-400/60 tracking-[0.25em] uppercase mb-6 transition-all duration-200 hover:opacity-80">
                START NOW
              </div>
              
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-light leading-tight mb-6 transition-all duration-200 hover:opacity-80">
                <span className="bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent transition-all duration-200 hover:opacity-80">
                  Ready to elevate
                </span>
                <br />
                <span className="text-white/70 italic text-4xl sm:text-4xl transition-all duration-200 hover:opacity-80">your strategic intelligence?</span>
              </h2>
              
              <p className="text-4xl text-white/50 mb-12 max-w-3xl mx-auto leading-relaxed transition-all duration-200 hover:opacity-80">
                Join Fortune 500 companies, governments, and research institutions 
                using NomosX for decision-critical intelligence.
              </p>
              
              <button
                onClick={() => setShowAuthModal(true)}
                className="group relative px-10 py-5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium text-4xl shadow-[0_0_40px_rgba(0,212,255,0.4)] hover:shadow-[0_0_60px_rgba(0,212,255,0.6)] transition-all duration-300"
              >
                <span className="relative z-10 flex items-center justify-center gap-3 transition-all duration-200 hover:opacity-80">
                  Start for free
                  <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl opacity-0 group-hover:opacity-100 blur-sm transition-opacity" />
              </button>
              
              <div className="flex items-center justify-center gap-6 mt-8 text-xs text-white/40 transition-all duration-200 hover:opacity-80">
                <span>No credit card required</span>
                <div className="w-1 h-1 rounded-full bg-cyan-400/40 transition-all duration-200 hover:opacity-80" />
                <span>Free tier available</span>
                <div className="w-1 h-1 rounded-full bg-cyan-400/40 transition-all duration-200 hover:opacity-80" />
                <span>60s to first analysis</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-white/10 relative z-10 transition-all duration-200 hover:opacity-80">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-200 hover:opacity-80">
            <div className="flex items-center gap-3 transition-all duration-200 hover:opacity-80">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center opacity-80 relative transition-all duration-200 hover:opacity-80">
                <span className="text-slate-100 font-serif text-xs font-bold tracking-tight transition-all duration-200 hover:opacity-80">N</span>
                {/* Orbital elements */}
                <div className="absolute inset-0 rounded-full border border-slate-600/30 transition-all duration-200 hover:opacity-80"></div>
                <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-0.5 h-0.5 bg-cyan-400 rounded-full opacity-60 transition-all duration-200 hover:opacity-80"></div>
                <div className="absolute right-0.5 top-1/2 -translate-y-1/2 w-0.5 h-0.5 bg-slate-400 rounded-full opacity-40 transition-all duration-200 hover:opacity-80"></div>
                <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-0.5 h-0.5 bg-slate-400 rounded-full opacity-40 transition-all duration-200 hover:opacity-80"></div>
                <div className="absolute left-0.5 top-1/2 -translate-y-1/2 w-0.5 h-0.5 bg-slate-400 rounded-full opacity-40 transition-all duration-200 hover:opacity-80"></div>
              </div>
              <div>
                <span className="text-sm font-serif font-bold tracking-tight text-white/60 transition-all duration-200 hover:opacity-80">
                  Nomos<span className="text-slate-400 transition-all duration-200 hover:opacity-80">X</span>
                </span>
                <p className="text-xs text-slate-500 transition-all duration-200 hover:opacity-80">Institutional Research Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-xs text-white/30 transition-all duration-200 hover:opacity-80">
              <button onClick={() => router.push("/")} className="hover:text-white transition-colors">
                Home
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
