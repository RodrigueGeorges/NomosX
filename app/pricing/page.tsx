"use client";

/**
 * NomosX Pricing Page
 * 
 * Offre unique: NomosX Access - 149€/mois
 * Trial 15 jours sans CB
 * Sobre, institutionnel, bankable
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import Shell from "@/components/Shell";
import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { 
  Check,
  X,
  Shield,
  Zap,
  TrendingUp,
  Users,
  Briefcase,
  FileText
} from "lucide-react";

export default function PricingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleStartTrial() {
    setLoading(true);
    router.push("/dashboard");
  }

  return (
    <Shell>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="text-xs text-cyan-400/60 tracking-[0.25em] uppercase mb-4">
            Pricing
          </div>
          <h1 className="text-5xl font-light tracking-tight text-white/95 mb-4">
            One access. One institution.
          </h1>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            NomosX is not a tool. It's an autonomous think tank that decides when to publish.
          </p>
        </div>

        {/* Offre Unique - Carte Centrale */}
        <div className="max-w-xl mx-auto mb-20">
          <Card variant="default" className="bg-gradient-to-br from-cyan-500/5 to-blue-500/5 border-cyan-500/20 shadow-[0_0_40px_rgba(0,212,255,0.1)]">
            <CardContent className="pt-10 pb-10">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(0,212,255,0.2)]">
                  <Shield size={32} className="text-cyan-400" />
                </div>
                <h2 className="text-3xl font-light text-white mb-2">NomosX Access</h2>
                <div className="flex items-baseline justify-center gap-2 mb-4">
                  <span className="text-5xl font-light text-white">149€</span>
                  <span className="text-lg text-white/40">/month</span>
                </div>
                <div className="inline-block px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                  <p className="text-sm text-cyan-400">15-day free trial · No credit card required</p>
                </div>
              </div>

              {/* Inclus */}
              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3">
                  <Check size={18} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-white/80">Autonomous signal detection</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check size={18} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-white/80">Editorial gate & quality control</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check size={18} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-white/80">Institutional publications</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check size={18} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-white/80">Think Tank Command Center</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check size={18} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-white/80">Studio access (editorial backstage)</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check size={18} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-white/80">PDF exports</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check size={18} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-white/80">Disciplined cadence (quality over quantity)</span>
                </div>
              </div>

              <Button 
                variant="ai" 
                className="w-full text-base py-6"
                onClick={handleStartTrial}
                disabled={loading}
              >
                {loading ? "Starting..." : "Start your trial"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* What you're NOT paying for */}
        <section className="mb-20">
          <h3 className="text-2xl font-light text-white text-center mb-8">
            What you're <span className="text-white/40">not</span> paying for
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <Card variant="default" className="bg-white/[0.02] border-white/10">
              <CardContent className="pt-6 pb-6 text-center">
                <X size={20} className="text-white/20 mx-auto mb-2" />
                <p className="text-sm text-white/40">No chat</p>
              </CardContent>
            </Card>
            <Card variant="default" className="bg-white/[0.02] border-white/10">
              <CardContent className="pt-6 pb-6 text-center">
                <X size={20} className="text-white/20 mx-auto mb-2" />
                <p className="text-sm text-white/40">No tokens</p>
              </CardContent>
            </Card>
            <Card variant="default" className="bg-white/[0.02] border-white/10">
              <CardContent className="pt-6 pb-6 text-center">
                <X size={20} className="text-white/20 mx-auto mb-2" />
                <p className="text-sm text-white/40">No prompts</p>
              </CardContent>
            </Card>
            <Card variant="default" className="bg-white/[0.02] border-white/10">
              <CardContent className="pt-6 pb-6 text-center">
                <X size={20} className="text-white/20 mx-auto mb-2" />
                <p className="text-sm text-white/40">No noise</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Who it's for */}
        <section className="mb-20">
          <h3 className="text-2xl font-light text-white text-center mb-8">Who it's for</h3>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card variant="default" className="bg-white/[0.02] border-white/10 hover:border-cyan-500/30 transition-all">
              <CardContent className="pt-6 pb-6">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
                  <TrendingUp size={24} className="text-blue-400" />
                </div>
                <h4 className="text-lg font-medium text-white mb-2">Investors</h4>
                <p className="text-sm text-white/50">
                  Monitor weak signals, detect trend breaks, make informed decisions
                </p>
              </CardContent>
            </Card>

            <Card variant="default" className="bg-white/[0.02] border-white/10 hover:border-cyan-500/30 transition-all">
              <CardContent className="pt-6 pb-6">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                  <Zap size={24} className="text-emerald-400" />
                </div>
                <h4 className="text-lg font-medium text-white mb-2">Founders</h4>
                <p className="text-sm text-white/50">
                  Track emerging technologies, policy changes, competitive intelligence
                </p>
              </CardContent>
            </Card>

            <Card variant="default" className="bg-white/[0.02] border-white/10 hover:border-cyan-500/30 transition-all">
              <CardContent className="pt-6 pb-6">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4">
                  <FileText size={24} className="text-purple-400" />
                </div>
                <h4 className="text-lg font-medium text-white mb-2">Journalists</h4>
                <p className="text-sm text-white/50">
                  Access curated research, detect contradictions, verify claims
                </p>
              </CardContent>
            </Card>

            <Card variant="default" className="bg-white/[0.02] border-white/10 hover:border-cyan-500/30 transition-all">
              <CardContent className="pt-6 pb-6">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4">
                  <Briefcase size={24} className="text-cyan-400" />
                </div>
                <h4 className="text-lg font-medium text-white mb-2">Strategy teams</h4>
                <p className="text-sm text-white/50">
                  Evidence-based insights, disciplined analysis, institutional quality
                </p>
              </CardContent>
            </Card>

            <Card variant="default" className="bg-white/[0.02] border-white/10 hover:border-cyan-500/30 transition-all">
              <CardContent className="pt-6 pb-6">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4">
                  <Users size={24} className="text-amber-400" />
                </div>
                <h4 className="text-lg font-medium text-white mb-2">Institutions</h4>
                <p className="text-sm text-white/50">
                  Autonomous research, editorial discipline, trusted publications
                </p>
              </CardContent>
            </Card>

            <Card variant="default" className="bg-white/[0.02] border-white/10 hover:border-cyan-500/30 transition-all">
              <CardContent className="pt-6 pb-6">
                <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-4">
                  <Shield size={24} className="text-rose-400" />
                </div>
                <h4 className="text-lg font-medium text-white mb-2">Policy makers</h4>
                <p className="text-sm text-white/50">
                  Track regulatory changes, assess impact, monitor compliance
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FAQ / Clarifications */}
        <section className="mb-20">
          <h3 className="text-2xl font-light text-white text-center mb-8">Frequently asked</h3>
          <div className="max-w-3xl mx-auto space-y-4">
            <Card variant="default" className="bg-white/[0.02] border-white/10">
              <CardContent className="pt-5 pb-5">
                <h4 className="text-sm font-medium text-white mb-2">Why 149€/month?</h4>
                <p className="text-sm text-white/50">
                  You're not paying for tokens or API calls. You're paying for an autonomous institution 
                  that monitors the world 24/7, applies editorial discipline, and publishes only when it matters.
                </p>
              </CardContent>
            </Card>

            <Card variant="default" className="bg-white/[0.02] border-white/10">
              <CardContent className="pt-5 pb-5">
                <h4 className="text-sm font-medium text-white mb-2">What happens after the trial?</h4>
                <p className="text-sm text-white/50">
                  After 15 days, you'll be prompted to subscribe. No automatic charges. 
                  You decide if the think tank's value justifies the investment.
                </p>
              </CardContent>
            </Card>

            <Card variant="default" className="bg-white/[0.02] border-white/10">
              <CardContent className="pt-5 pb-5">
                <h4 className="text-sm font-medium text-white mb-2">Can I cancel anytime?</h4>
                <p className="text-sm text-white/50">
                  Yes. No lock-in. Cancel from your dashboard. Your access continues until the end of the billing period.
                </p>
              </CardContent>
            </Card>

            <Card variant="default" className="bg-white/[0.02] border-white/10">
              <CardContent className="pt-5 pb-5">
                <h4 className="text-sm font-medium text-white mb-2">Why the publication limits?</h4>
                <p className="text-sm text-white/50">
                  Discipline is a feature. NomosX publishes less — but better. 
                  Limits enforce quality over quantity, signal over noise.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Final */}
        <div className="text-center">
          <Button 
            variant="ai" 
            className="text-base px-8 py-6"
            onClick={handleStartTrial}
            disabled={loading}
          >
            Start your 15-day trial
          </Button>
          <p className="text-xs text-white/30 mt-4">No credit card required</p>
        </div>
      </div>
    </Shell>
  );
}
