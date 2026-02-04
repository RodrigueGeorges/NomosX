"use client";
const React = require('react');

/**
 * NomosX Pricing Page
 * 
 * Two tiers: Executive (€15/mois) + Strategy (€39/mois)
 * 30-day trial without credit card
 * Clean, institutional, bankable
 */

const {useState} = require('react');
const {useRouter} = require('next/navigation');
const Shell = require('@/components/Shell');
const {Button} = require('@/components/ui/Button');
const {Card,CardContent} = require('@/components/ui/Card');
const {cn} = require('@/lib/utils');
const {Check,X,Shield,Zap,TrendingUp,Users,Briefcase,FileText} = require('lucide-react');

export default function PricingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleStartTrial() {
    setLoading(true);
    router.push("/dashboard");
  }

  return (
    <Shell>
      <div className="max-w-5xl mx-auto transition-all duration-200 hover:opacity-80">
        {/* Header */}
        <div className="text-center mb-16 transition-all duration-200 hover:opacity-80">
          <div className="text-xs text-cyan-400/60 tracking-[0.25em] uppercase mb-4 transition-all duration-200 hover:opacity-80">
            Pricing
          </div>
          <h1 className="text-5xl font-light tracking-tight text-white/95 mb-4 transition-all duration-200 hover:opacity-80">
            Think Tank Access
          </h1>
          <p className="text-4xl text-white/50 max-w-2xl mx-auto transition-all duration-200 hover:opacity-80">
            Subscribe to an autonomous research institution that decides when to publish.
          </p>
        </div>

        {/* Two Pricing Tiers */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20 transition-all duration-200 hover:opacity-80">
          
          {/* Executive Plan */}
          <Card variant="default" className="bg-background/[0.03] border-white/10 transition-all duration-200 hover:opacity-80">
            <CardContent className="pt-10 pb-10 transition-all duration-200 hover:opacity-80">
              <div className="text-center mb-8 transition-all duration-200 hover:opacity-80">
                <div className="w-14 h-14 rounded-xl bg-slate-500/10 border border-slate-500/20 flex items-center justify-center mx-auto mb-4 transition-all duration-200 hover:opacity-80">
                  <FileText size={28} className="text-slate-400 transition-all duration-200 hover:opacity-80" />
                </div>
                <h2 className="text-4xl font-light text-white mb-2 transition-all duration-200 hover:opacity-80">NomosX Executive</h2>
                <div className="flex items-baseline justify-center gap-2 mb-4 transition-all duration-200 hover:opacity-80">
                  <span className="text-4xl font-light text-white transition-all duration-200 hover:opacity-80">15€</span>
                  <span className="text-4xl text-white/40 transition-all duration-200 hover:opacity-80">/month</span>
                </div>
                <div className="inline-block px-3 py-1 rounded-lg bg-slate-500/10 border border-slate-500/20 transition-all duration-200 hover:opacity-80">
                  <p className="text-xs text-slate-400 transition-all duration-200 hover:opacity-80">30-day free trial</p>
                </div>
              </div>

              <div className="space-y-3 mb-8 transition-all duration-200 hover:opacity-80">
                <div className="flex items-start gap-3 transition-all duration-200 hover:opacity-80">
                  <Check size={16} className="text-emerald-400 mt-0.5 flex-shrink-0 transition-all duration-200 hover:opacity-80" />
                  <span className="text-sm text-white/80 transition-all duration-200 hover:opacity-80">Executive Briefs (2-3 pages)</span>
                </div>
                <div className="flex items-start gap-3 transition-all duration-200 hover:opacity-80">
                  <Check size={16} className="text-emerald-400 mt-0.5 flex-shrink-0 transition-all duration-200 hover:opacity-80" />
                  <span className="text-sm text-white/80 transition-all duration-200 hover:opacity-80">Weekly newsletter</span>
                </div>
                <div className="flex items-start gap-3 transition-all duration-200 hover:opacity-80">
                  <Check size={16} className="text-emerald-400 mt-0.5 flex-shrink-0 transition-all duration-200 hover:opacity-80" />
                  <span className="text-sm text-white/80 transition-all duration-200 hover:opacity-80">Brief archives</span>
                </div>
                <div className="flex items-start gap-3 transition-all duration-200 hover:opacity-80">
                  <Check size={16} className="text-emerald-400 mt-0.5 flex-shrink-0 transition-all duration-200 hover:opacity-80" />
                  <span className="text-sm text-white/80 transition-all duration-200 hover:opacity-80">Decision-ready insights</span>
                </div>
              </div>

              <Button 
                variant="ghost" 
                className="w-full text-base py-4 border border-white/20 transition-all duration-200 hover:opacity-80"
                onClick={handleStartTrial}
                disabled={loading}
              >
                {loading ? "Starting..." : "Start free trial"}
              </Button>
            </CardContent>
          </Card>

          {/* Strategy Plan */}
          <Card variant="default" className="bg-gradient-to-br from-cyan-500/5 to-blue-500/5 border-cyan-500/20 shadow-[0_0_40px_rgba(0,212,255,0.1)] transition-all duration-200 hover:opacity-80">
            <CardContent className="pt-10 pb-10 transition-all duration-200 hover:opacity-80">
              <div className="text-center mb-8 transition-all duration-200 hover:opacity-80">
                <div className="w-16 h-16 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(0,212,255,0.2)] transition-all duration-200 hover:opacity-80">
                  <Briefcase size={32} className="text-cyan-400 transition-all duration-200 hover:opacity-80" />
                </div>
                <h2 className="text-4xl font-light text-white mb-2 transition-all duration-200 hover:opacity-80">NomosX Strategy</h2>
                <div className="flex items-baseline justify-center gap-2 mb-4 transition-all duration-200 hover:opacity-80">
                  <span className="text-4xl font-light text-white transition-all duration-200 hover:opacity-80">39€</span>
                  <span className="text-4xl text-white/40 transition-all duration-200 hover:opacity-80">/month</span>
                </div>
                <div className="inline-block px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 transition-all duration-200 hover:opacity-80">
                  <p className="text-xs text-cyan-400 transition-all duration-200 hover:opacity-80">Everything + Strategic Reports</p>
                </div>
              </div>

              <div className="space-y-3 mb-8 transition-all duration-200 hover:opacity-80">
                <div className="flex items-start gap-3 transition-all duration-200 hover:opacity-80">
                  <Check size={16} className="text-emerald-400 mt-0.5 flex-shrink-0 transition-all duration-200 hover:opacity-80" />
                  <span className="text-sm text-white/80 transition-all duration-200 hover:opacity-80">Everything in Executive</span>
                </div>
                <div className="flex items-start gap-3 transition-all duration-200 hover:opacity-80">
                  <Check size={16} className="text-emerald-400 mt-0.5 flex-shrink-0 transition-all duration-200 hover:opacity-80" />
                  <span className="text-sm text-white/80 transition-all duration-200 hover:opacity-80">Strategic Reports (10-15 pages)</span>
                </div>
                <div className="flex items-start gap-3 transition-all duration-200 hover:opacity-80">
                  <Check size={16} className="text-emerald-400 mt-0.5 flex-shrink-0 transition-all duration-200 hover:opacity-80" />
                  <span className="text-sm text-white/80 transition-all duration-200 hover:opacity-80">Methodology & debates</span>
                </div>
                <div className="flex items-start gap-3 transition-all duration-200 hover:opacity-80">
                  <Check size={16} className="text-emerald-400 mt-0.5 flex-shrink-0 transition-all duration-200 hover:opacity-80" />
                  <span className="text-sm text-white/80 transition-all duration-200 hover:opacity-80">Complete archives</span>
                </div>
                <div className="flex items-start gap-3 transition-all duration-200 hover:opacity-80">
                  <Check size={16} className="text-emerald-400 mt-0.5 flex-shrink-0 transition-all duration-200 hover:opacity-80" />
                  <span className="text-sm text-white/80 transition-all duration-200 hover:opacity-80">Long PDF exports</span>
                </div>
              </div>

              <Button 
                variant="ai" 
                className="w-full text-base py-4 transition-all duration-200 hover:opacity-80"
                onClick={handleStartTrial}
                disabled={loading}
              >
                {loading ? "Starting..." : "Start free trial"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* What you're NOT paying for */}
        <section className="mb-20 transition-all duration-200 hover:opacity-80">
          <h3 className="text-4xl font-light text-white text-center mb-8 transition-all duration-200 hover:opacity-80">
            What you're <span className="text-white/40 transition-all duration-200 hover:opacity-80">not</span> paying for
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto transition-all duration-200 hover:opacity-80">
            <Card variant="default" className="bg-background/[0.02] border-white/10 transition-all duration-200 hover:opacity-80">
              <CardContent className="pt-6 pb-6 text-center transition-all duration-200 hover:opacity-80">
                <X size={20} className="text-white/20 mx-auto mb-2 transition-all duration-200 hover:opacity-80" />
                <p className="text-sm text-white/40 transition-all duration-200 hover:opacity-80">No chat</p>
              </CardContent>
            </Card>
            <Card variant="default" className="bg-background/[0.02] border-white/10 transition-all duration-200 hover:opacity-80">
              <CardContent className="pt-6 pb-6 text-center transition-all duration-200 hover:opacity-80">
                <X size={20} className="text-white/20 mx-auto mb-2 transition-all duration-200 hover:opacity-80" />
                <p className="text-sm text-white/40 transition-all duration-200 hover:opacity-80">No tokens</p>
              </CardContent>
            </Card>
            <Card variant="default" className="bg-background/[0.02] border-white/10 transition-all duration-200 hover:opacity-80">
              <CardContent className="pt-6 pb-6 text-center transition-all duration-200 hover:opacity-80">
                <X size={20} className="text-white/20 mx-auto mb-2 transition-all duration-200 hover:opacity-80" />
                <p className="text-sm text-white/40 transition-all duration-200 hover:opacity-80">No prompts</p>
              </CardContent>
            </Card>
            <Card variant="default" className="bg-background/[0.02] border-white/10 transition-all duration-200 hover:opacity-80">
              <CardContent className="pt-6 pb-6 text-center transition-all duration-200 hover:opacity-80">
                <X size={20} className="text-white/20 mx-auto mb-2 transition-all duration-200 hover:opacity-80" />
                <p className="text-sm text-white/40 transition-all duration-200 hover:opacity-80">No noise</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Who it's for */}
        <section className="mb-20 transition-all duration-200 hover:opacity-80">
          <h3 className="text-4xl font-light text-white text-center mb-8 transition-all duration-200 hover:opacity-80">Who it's for</h3>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto transition-all duration-200 hover:opacity-80">
            <Card variant="default" className="bg-background/[0.02] border-white/10 hover:border-cyan-500/30 transition-all">
              <CardContent className="pt-6 pb-6 transition-all duration-200 hover:opacity-80">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 transition-all duration-200 hover:opacity-80">
                  <TrendingUp size={24} className="text-primary transition-all duration-200 hover:opacity-80" />
                </div>
                <h4 className="text-4xl font-medium text-white mb-2 transition-all duration-200 hover:opacity-80">Investors</h4>
                <p className="text-sm text-white/50 transition-all duration-200 hover:opacity-80">
                  Monitor weak signals, detect trend breaks, make informed decisions
                </p>
              </CardContent>
            </Card>

            <Card variant="default" className="bg-background/[0.02] border-white/10 hover:border-cyan-500/30 transition-all">
              <CardContent className="pt-6 pb-6 transition-all duration-200 hover:opacity-80">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 transition-all duration-200 hover:opacity-80">
                  <Zap size={24} className="text-emerald-400 transition-all duration-200 hover:opacity-80" />
                </div>
                <h4 className="text-4xl font-medium text-white mb-2 transition-all duration-200 hover:opacity-80">Founders</h4>
                <p className="text-sm text-white/50 transition-all duration-200 hover:opacity-80">
                  Track emerging technologies, policy changes, competitive intelligence
                </p>
              </CardContent>
            </Card>

            <Card variant="default" className="bg-background/[0.02] border-white/10 hover:border-cyan-500/30 transition-all">
              <CardContent className="pt-6 pb-6 transition-all duration-200 hover:opacity-80">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center mb-4 transition-all duration-200 hover:opacity-80">
                  <FileText size={24} className="text-secondary transition-all duration-200 hover:opacity-80" />
                </div>
                <h4 className="text-4xl font-medium text-white mb-2 transition-all duration-200 hover:opacity-80">Journalists</h4>
                <p className="text-sm text-white/50 transition-all duration-200 hover:opacity-80">
                  Access curated research, detect contradictions, verify claims
                </p>
              </CardContent>
            </Card>

            <Card variant="default" className="bg-background/[0.02] border-white/10 hover:border-cyan-500/30 transition-all">
              <CardContent className="pt-6 pb-6 transition-all duration-200 hover:opacity-80">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4 transition-all duration-200 hover:opacity-80">
                  <Briefcase size={24} className="text-cyan-400 transition-all duration-200 hover:opacity-80" />
                </div>
                <h4 className="text-4xl font-medium text-white mb-2 transition-all duration-200 hover:opacity-80">Strategy teams</h4>
                <p className="text-sm text-white/50 transition-all duration-200 hover:opacity-80">
                  Evidence-based insights, disciplined analysis, institutional quality
                </p>
              </CardContent>
            </Card>

            <Card variant="default" className="bg-background/[0.02] border-white/10 hover:border-cyan-500/30 transition-all">
              <CardContent className="pt-6 pb-6 transition-all duration-200 hover:opacity-80">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4 transition-all duration-200 hover:opacity-80">
                  <Users size={24} className="text-amber-400 transition-all duration-200 hover:opacity-80" />
                </div>
                <h4 className="text-4xl font-medium text-white mb-2 transition-all duration-200 hover:opacity-80">Institutions</h4>
                <p className="text-sm text-white/50 transition-all duration-200 hover:opacity-80">
                  Autonomous research, editorial discipline, trusted publications
                </p>
              </CardContent>
            </Card>

            <Card variant="default" className="bg-background/[0.02] border-white/10 hover:border-cyan-500/30 transition-all">
              <CardContent className="pt-6 pb-6 transition-all duration-200 hover:opacity-80">
                <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-4 transition-all duration-200 hover:opacity-80">
                  <Shield size={24} className="text-rose-400 transition-all duration-200 hover:opacity-80" />
                </div>
                <h4 className="text-4xl font-medium text-white mb-2 transition-all duration-200 hover:opacity-80">Policy makers</h4>
                <p className="text-sm text-white/50 transition-all duration-200 hover:opacity-80">
                  Track regulatory changes, assess impact, monitor compliance
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FAQ / Clarifications */}
        <section className="mb-20 transition-all duration-200 hover:opacity-80">
          <h3 className="text-4xl font-light text-white text-center mb-8 transition-all duration-200 hover:opacity-80">Frequently asked</h3>
          <div className="max-w-3xl mx-auto space-y-4 transition-all duration-200 hover:opacity-80">
            <Card variant="default" className="bg-background/[0.02] border-white/10 transition-all duration-200 hover:opacity-80">
              <CardContent className="pt-5 pb-5 transition-all duration-200 hover:opacity-80">
                <h4 className="text-sm font-medium text-white mb-2 transition-all duration-200 hover:opacity-80">Why 149€/month?</h4>
                <p className="text-sm text-white/50 transition-all duration-200 hover:opacity-80">
                  You're not paying for tokens or API calls. You're paying for an autonomous institution 
                  that monitors the world 24/7, applies editorial discipline, and publishes only when it matters.
                </p>
              </CardContent>
            </Card>

            <Card variant="default" className="bg-background/[0.02] border-white/10 transition-all duration-200 hover:opacity-80">
              <CardContent className="pt-5 pb-5 transition-all duration-200 hover:opacity-80">
                <h4 className="text-sm font-medium text-white mb-2 transition-all duration-200 hover:opacity-80">What happens after the trial?</h4>
                <p className="text-sm text-white/50 transition-all duration-200 hover:opacity-80">
                  After 15 days, you'll be prompted to subscribe. No automatic charges. 
                  You decide if the think tank's value justifies the investment.
                </p>
              </CardContent>
            </Card>

            <Card variant="default" className="bg-background/[0.02] border-white/10 transition-all duration-200 hover:opacity-80">
              <CardContent className="pt-5 pb-5 transition-all duration-200 hover:opacity-80">
                <h4 className="text-sm font-medium text-white mb-2 transition-all duration-200 hover:opacity-80">Can I cancel anytime?</h4>
                <p className="text-sm text-white/50 transition-all duration-200 hover:opacity-80">
                  Yes. No lock-in. Cancel from your dashboard. Your access continues until the end of the billing period.
                </p>
              </CardContent>
            </Card>

            <Card variant="default" className="bg-background/[0.02] border-white/10 transition-all duration-200 hover:opacity-80">
              <CardContent className="pt-5 pb-5 transition-all duration-200 hover:opacity-80">
                <h4 className="text-sm font-medium text-white mb-2 transition-all duration-200 hover:opacity-80">Why the publication limits?</h4>
                <p className="text-sm text-white/50 transition-all duration-200 hover:opacity-80">
                  Discipline is a feature. NomosX publishes less — but better. 
                  Limits enforce quality over quantity, signal over noise.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Final */}
        <div className="text-center transition-all duration-200 hover:opacity-80">
          <Button 
            variant="ai" 
            className="text-base px-8 py-6 transition-all duration-200 hover:opacity-80"
            onClick={handleStartTrial}
            disabled={loading}
          >
            Start your 15-day trial
          </Button>
          <p className="text-xs text-white/30 mt-4 transition-all duration-200 hover:opacity-80">No credit card required</p>
        </div>
      </div>
    </Shell>
  );
}
