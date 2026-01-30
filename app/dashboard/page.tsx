"use client";

/**
 * USER Dashboard — Your Intelligence Desk
 * 
 * Purpose: Reading hub, publication discovery, access overview
 * Audience: Subscribers and free users
 * 
 * Answers:
 * - "What should I read?"
 * - "What is new?"
 * - "What do I have access to?"
 * 
 * Contains:
 * - Latest Executive Briefs (FREE)
 * - Latest Strategic Reports (PREMIUM - locked if not subscribed)
 * - Vertical coverage indicators
 * - Publications feed (chronological)
 * - Subscription status (calm, bottom)
 * 
 * Does NOT contain:
 * - Signals, priority scores, agent terminology
 * - Studio access, editorial controls
 * - System status, cadence limits
 */

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Shell from "@/components/Shell";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import TrustScoreBadge from "@/components/TrustScoreBadge";
import TrialBanner from "@/components/TrialBanner";
import { 
  BookOpen,
  FileText,
  Lock,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Clock,
  Shield,
  Layers
} from "lucide-react";

type Vertical = {
  id: string;
  name: string;
  slug: string;
  color?: string;
  recentPublicationCount: number;
  lastPublishedAt?: string;
};

type Publication = {
  id: string;
  title: string;
  type: string;
  vertical?: { name: string };
  trustScore: number;
  status: string;
  createdAt: string;
  isPremium: boolean;
};

type SubscriptionStatus = {
  plan: string;
  status: string;
  isTrialActive: boolean;
  trialDaysRemaining: number;
  canAccessPremium: boolean;
  activeVerticals: number;
};

export default function UserDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [verticals, setVerticals] = useState<Vertical[]>([]);
  const [latestBriefs, setLatestBriefs] = useState<Publication[]>([]);
  const [latestReports, setLatestReports] = useState<Publication[]>([]);
  const [allPublications, setAllPublications] = useState<Publication[]>([]);
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    setLoading(true);
    try {
      const [verticalsRes, publicationsRes, subRes] = await Promise.all([
        fetch("/api/think-tank/verticals"),
        fetch("/api/think-tank/publications?limit=20"),
        fetch("/api/subscription/status"),
      ]);

      if (verticalsRes.ok) {
        const data = await verticalsRes.json();
        setVerticals(data.verticals || []);
      }
      
      if (publicationsRes.ok) {
        const data = await publicationsRes.json();
        const pubs = data.publications || [];
        
        // Separate briefs and reports
        const briefs = pubs.filter((p: Publication) => p.type === "EXECUTIVE_BRIEF").slice(0, 4);
        const reports = pubs.filter((p: Publication) => p.type === "STRATEGIC_REPORT").slice(0, 4);
        
        setLatestBriefs(briefs);
        setLatestReports(reports);
        setAllPublications(pubs);
      }
      
      if (subRes.ok) {
        const data = await subRes.json();
        setSubscription(data);
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }

  // Determine vertical activity status
  const getVerticalStatus = (vertical: Vertical) => {
    if (!vertical.lastPublishedAt) return { label: "Quiet", color: "text-white/30" };
    
    const daysSincePublished = Math.floor(
      (Date.now() - new Date(vertical.lastPublishedAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysSincePublished <= 7) return { label: "New this week", color: "text-cyan-400" };
    if (daysSincePublished <= 14) return { label: "Active", color: "text-emerald-400" };
    return { label: "Quiet", color: "text-white/30" };
  };

  return (
    <Shell>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border border-cyan-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(0,212,255,0.15)]">
                <BookOpen size={32} className="text-cyan-400" />
              </div>
              <div>
                <div className="text-xs text-cyan-400/60 tracking-[0.25em] uppercase mb-1">
                  Your Intelligence Desk
                </div>
                <h1 className="text-4xl font-light tracking-tight text-white/95">Dashboard</h1>
              </div>
            </div>
          </div>
        </div>

        {/* Trial Banner */}
        {subscription?.isTrialActive && subscription.trialDaysRemaining > 0 && (
          <TrialBanner daysRemaining={subscription.trialDaysRemaining} />
        )}

        {/* Reading Overview - Latest Executive Briefs (FREE) */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-light text-white/95 flex items-center gap-2">
                <FileText size={20} className="text-cyan-400" />
                Latest Executive Briefs
              </h2>
              <p className="text-sm text-white/40 mt-1">Free • Decision-ready insights</p>
            </div>
            <Link href="/publications?type=brief" className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {latestBriefs.length === 0 ? (
            <Card variant="default" className="bg-white/[0.02] border-white/10">
              <CardContent className="pt-10 pb-10 text-center">
                <FileText size={28} className="text-white/20 mx-auto mb-3" />
                <p className="text-white/50 text-sm font-medium">No briefs published yet</p>
                <p className="text-white/30 text-xs mt-1">Check back soon for new insights</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {latestBriefs.map(brief => (
                <Card 
                  key={brief.id}
                  variant="default"
                  className="bg-white/[0.02] border-white/10 hover:border-cyan-500/30 cursor-pointer transition-all group"
                  onClick={() => router.push(`/publications/${brief.id}`)}
                >
                  <CardContent className="pt-5 pb-5">
                    <div className="flex items-start gap-3 mb-3">
                      <TrustScoreBadge score={brief.trustScore} size="sm" />
                      <div className="flex-1 min-w-0">
                        <Badge variant="success" className="text-xs mb-2">FREE</Badge>
                        <h3 className="text-base font-medium text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
                          {brief.title}
                        </h3>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-white/40">
                      <div className="flex items-center gap-2">
                        {brief.vertical && <span>{brief.vertical.name}</span>}
                        <span>•</span>
                        <span>{new Date(brief.createdAt).toLocaleDateString()}</span>
                      </div>
                      <ArrowRight size={14} className="text-white/20 group-hover:text-cyan-400 transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Latest Strategic Reports (PREMIUM) */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-light text-white/95 flex items-center gap-2">
                <Sparkles size={20} className="text-purple-400" />
                Latest Strategic Reports
              </h2>
              <p className="text-sm text-white/40 mt-1">Premium • Comprehensive analysis</p>
            </div>
            <Link href="/publications?type=report" className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {latestReports.length === 0 ? (
            <Card variant="default" className="bg-white/[0.02] border-white/10">
              <CardContent className="pt-10 pb-10 text-center">
                <Sparkles size={28} className="text-white/20 mx-auto mb-3" />
                <p className="text-white/50 text-sm font-medium">No reports published yet</p>
                <p className="text-white/30 text-xs mt-1">Strategic reports are published periodically</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {latestReports.map(report => {
                const isLocked = !subscription?.canAccessPremium;
                
                return (
                  <Card 
                    key={report.id}
                    variant="default"
                    className={`${isLocked ? 'bg-purple-500/5 border-purple-500/20' : 'bg-white/[0.02] border-white/10 hover:border-purple-500/30'} cursor-pointer transition-all group`}
                    onClick={() => {
                      if (isLocked) {
                        router.push("/pricing");
                      } else {
                        router.push(`/publications/${report.id}`);
                      }
                    }}
                  >
                    <CardContent className="pt-5 pb-5">
                      <div className="flex items-start gap-3 mb-3">
                        {isLocked ? (
                          <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
                            <Lock size={16} className="text-purple-400" />
                          </div>
                        ) : (
                          <TrustScoreBadge score={report.trustScore} size="sm" />
                        )}
                        <div className="flex-1 min-w-0">
                          <Badge variant={isLocked ? "default" : "primary"} className="text-xs mb-2">
                            {isLocked ? "PREMIUM" : "UNLOCKED"}
                          </Badge>
                          <h3 className={`text-base font-medium ${isLocked ? 'text-white/60' : 'text-white group-hover:text-purple-400'} transition-colors line-clamp-2`}>
                            {report.title}
                          </h3>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-white/40">
                        <div className="flex items-center gap-2">
                          {report.vertical && <span>{report.vertical.name}</span>}
                          <span>•</span>
                          <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                        </div>
                        {isLocked ? (
                          <span className="text-purple-400 text-xs">Upgrade to access →</span>
                        ) : (
                          <ArrowRight size={14} className="text-white/20 group-hover:text-purple-400 transition-colors" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </section>

        {/* Vertical Coverage */}
        <section className="mb-10">
          <div className="mb-4">
            <h2 className="text-2xl font-light text-white/95 flex items-center gap-2">
              <Layers size={20} className="text-blue-400" />
              Research Verticals
            </h2>
            <p className="text-sm text-white/40 mt-1">Active research focus areas</p>
          </div>

          {verticals.length === 0 ? (
            <Card variant="default" className="bg-white/[0.02] border-white/10">
              <CardContent className="pt-10 pb-10 text-center">
                <Layers size={28} className="text-white/20 mx-auto mb-3" />
                <p className="text-white/50 text-sm font-medium">No verticals configured</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {verticals.map(vertical => {
                const status = getVerticalStatus(vertical);
                
                return (
                  <Card 
                    key={vertical.id}
                    variant="default"
                    className="bg-white/[0.02] border-white/10 hover:border-blue-500/30 cursor-pointer transition-all group"
                    onClick={() => router.push(`/publications?vertical=${vertical.slug}`)}
                  >
                    <CardContent className="pt-4 pb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">
                          {vertical.name}
                        </h3>
                        <ArrowRight size={12} className="text-white/20 group-hover:text-blue-400 transition-colors" />
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className={status.color}>{status.label}</span>
                        {vertical.recentPublicationCount > 0 && (
                          <>
                            <span className="text-white/20">•</span>
                            <span className="text-white/30">{vertical.recentPublicationCount} publications</span>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </section>

        {/* Subscription Status (calm, bottom) */}
        {subscription && (
          <section className="mb-8">
            <Card variant="default" className={subscription.isTrialActive ? "bg-cyan-500/5 border-cyan-500/20" : "bg-white/[0.02] border-white/10"}>
              <CardContent className="pt-6 pb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                      <Shield size={20} className="text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {subscription.isTrialActive ? "Trial Active" : "NomosX Access"}
                      </p>
                      <p className="text-xs text-white/40 mt-0.5">
                        {subscription.isTrialActive 
                          ? `${subscription.trialDaysRemaining} days remaining`
                          : `${subscription.activeVerticals} active verticals`}
                      </p>
                    </div>
                  </div>
                  
                  {subscription.isTrialActive ? (
                    <Button 
                      variant="ai" 
                      size="sm"
                      onClick={() => router.push("/pricing")}
                    >
                      Continue with NomosX Access
                    </Button>
                  ) : !subscription.canAccessPremium ? (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-cyan-400 hover:text-cyan-300"
                      onClick={() => router.push("/pricing")}
                    >
                      Upgrade to access Strategic Reports →
                    </Button>
                  ) : (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-white/40 hover:text-white/60"
                      onClick={() => router.push("/pricing")}
                    >
                      Manage subscription
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </section>
        )}
      </div>
    </Shell>
  );
}
