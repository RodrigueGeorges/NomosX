"use client";
import React from 'react';
import { useState,useEffect } from 'react';

/**
 * USER Dashboard — Think Tank Command Center
 * 
 * Purpose: Monitor autonomous research institution, not generate content
 * Audience: Subscribers and free users
 * 
 * Shows:
 * - Editorial cadence (publications per day/week)
 * - Latest publications (output of the system)
 * - Upcoming publications (signals that passed Editorial Gate)
 * - Vertical coverage status
 * - Subscription access level
 * 
 * Does NOT contain:
 * - Generation buttons, prompts, or "ask AI" features
 * - Signal detection interface (internal mechanism)
 * - Editorial controls (admin-only)
 */

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Shell from '@/components/Shell';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card,CardContent } from '@/components/ui/Card';
import TrustScoreBadge from '@/components/TrustScoreBadge';
import TrialBanner from '@/components/TrialBanner';
import { cn } from '@/lib/utils';
import { BookOpen,FileText,Lock,TrendingUp,Sparkles,ArrowRight,Clock,Shield,Layers,Settings } from 'lucide-react';

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
      <div className="max-w-7xl mx-auto transition-all duration-200 hover:opacity-80">
        {/* Header */}
        <div className="mb-10 transition-all duration-200 hover:opacity-80">
          <div className="flex items-center justify-between mb-6 transition-all duration-200 hover:opacity-80">
            <div className="flex items-center gap-4 transition-all duration-200 hover:opacity-80">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-slate-500/10 to-slate-500/5 border border-slate-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(148,163,184,0.15)] transition-all duration-200 hover:opacity-80">
                <Layers size={32} className="text-slate-400 transition-all duration-200 hover:opacity-80" />
              </div>
              <div>
                <div className="text-xs text-slate-400/60 tracking-[0.25em] uppercase mb-1 transition-all duration-200 hover:opacity-80">
                  Think Tank Command Center
                </div>
                <h1 className="text-4xl font-light tracking-tight text-white/95 transition-all duration-200 hover:opacity-80">
                  NomosX Monitor
                </h1>
                <p className="text-sm text-white/50 mt-1 transition-all duration-200 hover:opacity-80">
                  Autonomous research institution status
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => router.push('/dashboard/preferences')}
              className="flex items-center gap-2 transition-all duration-200 hover:opacity-80"
            >
              <Settings size={16} />
              Manage Preferences
            </Button>
          </div>
        </div>

        {/* Trial Banner */}
        {subscription?.isTrialActive && subscription.trialDaysRemaining > 0 && (
          <TrialBanner daysRemaining={subscription.trialDaysRemaining} />
        )}

        {/* Reading Overview - Latest Executive Briefs (FREE) */}
        <section className="mb-10 transition-all duration-200 hover:opacity-80">
          <div className="flex items-center justify-between mb-4 transition-all duration-200 hover:opacity-80">
            <div>
              <h2 className="text-4xl font-light text-white/95 flex items-center gap-2 transition-all duration-200 hover:opacity-80">
                <FileText size={20} className="text-cyan-400 transition-all duration-200 hover:opacity-80" />
                Latest Executive Briefs
              </h2>
              <p className="text-sm text-white/40 mt-1 transition-all duration-200 hover:opacity-80">Free • Decision-ready insights</p>
            </div>
            <Link href="/publications?type=brief" className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-all duration-200">
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {latestBriefs.length === 0 ? (
            <Card variant="default" className="bg-background/[0.02] border-white/10 transition-all duration-200 hover:opacity-80">
              <CardContent className="pt-10 pb-10 text-center transition-all duration-200 hover:opacity-80">
                <FileText size={28} className="text-white/20 mx-auto mb-3 transition-all duration-200 hover:opacity-80" />
                <p className="text-white/50 text-sm font-medium transition-all duration-200 hover:opacity-80">No briefs published yet</p>
                <p className="text-white/30 text-xs mt-1 transition-all duration-200 hover:opacity-80">Check back soon for new insights</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4 transition-all duration-200 hover:opacity-80">
              {latestBriefs.map(brief => (
                <Card 
                  key={brief.id}
                  variant="default"
                  className="bg-background/[0.02] border-white/10 hover:border-cyan-500/30 cursor-pointer transition-all group"
                  onClick={() => router.push(`/publications/${brief.id}`)}
                >
                  <CardContent className="pt-5 pb-5 transition-all duration-200 hover:opacity-80">
                    <div className="flex items-start gap-3 mb-3 transition-all duration-200 hover:opacity-80">
                      <TrustScoreBadge score={brief.trustScore} size="sm" />
                      <div className="flex-1 min-w-0 transition-all duration-200 hover:opacity-80">
                        <Badge variant="success" className="text-xs mb-2 transition-all duration-200 hover:opacity-80">FREE</Badge>
                        <h3 className="text-base font-medium text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
                          {brief.title}
                        </h3>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-white/40 transition-all duration-200 hover:opacity-80">
                      <div className="flex items-center gap-2 transition-all duration-200 hover:opacity-80">
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
        <section className="mb-10 transition-all duration-200 hover:opacity-80">
          <div className="flex items-center justify-between mb-4 transition-all duration-200 hover:opacity-80">
            <div>
              <h2 className="text-4xl font-light text-white/95 flex items-center gap-2 transition-all duration-200 hover:opacity-80">
                <Sparkles size={20} className="text-secondary transition-all duration-200 hover:opacity-80" />
                Latest Strategic Reports
              </h2>
              <p className="text-sm text-white/40 mt-1 transition-all duration-200 hover:opacity-80">Premium • Comprehensive analysis</p>
            </div>
            <Link href="/publications?type=report" className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-all duration-200">
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {latestReports.length === 0 ? (
            <Card variant="default" className="bg-background/[0.02] border-white/10 transition-all duration-200 hover:opacity-80">
              <CardContent className="pt-10 pb-10 text-center transition-all duration-200 hover:opacity-80">
                <Sparkles size={28} className="text-white/20 mx-auto mb-3 transition-all duration-200 hover:opacity-80" />
                <p className="text-white/50 text-sm font-medium transition-all duration-200 hover:opacity-80">No reports published yet</p>
                <p className="text-white/30 text-xs mt-1 transition-all duration-200 hover:opacity-80">Strategic reports are published periodically</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4 transition-all duration-200 hover:opacity-80">
              {latestReports.map(report => {
                const isLocked = !subscription?.canAccessPremium;
                
                return (
                  <Card 
                    key={report.id}
                    variant="default"
                    className={`${isLocked ? 'bg-secondary/5 border-secondary/20' : 'bg-background/[0.02] border-white/10 hover:border-secondary/30'} cursor-pointer transition-all group`}
                    onClick={() => {
                      if (isLocked) {
                        router.push("/pricing");
                      } else {
                        router.push(`/publications/${report.id}`);
                      }
                    }}
                  >
                    <CardContent className="pt-5 pb-5 transition-all duration-200 hover:opacity-80">
                      <div className="flex items-start gap-3 mb-3 transition-all duration-200 hover:opacity-80">
                        {isLocked ? (
                          <div className="w-10 h-10 rounded-lg bg-secondary/10 border border-secondary/20 flex items-center justify-center flex-shrink-0 transition-all duration-200 hover:opacity-80">
                            <Lock size={16} className="text-secondary transition-all duration-200 hover:opacity-80" />
                          </div>
                        ) : (
                          <TrustScoreBadge score={report.trustScore} size="sm" />
                        )}
                        <div className="flex-1 min-w-0 transition-all duration-200 hover:opacity-80">
                          <Badge variant={isLocked ? "default" : "premium"} className="text-xs mb-2 transition-all duration-200 hover:opacity-80">
                            {isLocked ? "PREMIUM" : "UNLOCKED"}
                          </Badge>
                          <h3 className={`text-base font-medium ${isLocked ? 'text-white/60' : 'text-white group-hover:text-secondary'} transition-colors line-clamp-2`}>
                            {report.title}
                          </h3>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-white/40 transition-all duration-200 hover:opacity-80">
                        <div className="flex items-center gap-2 transition-all duration-200 hover:opacity-80">
                          {report.vertical && <span>{report.vertical.name}</span>}
                          <span>•</span>
                          <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                        </div>
                        {isLocked ? (
                          <span className="text-secondary text-xs transition-all duration-200 hover:opacity-80">Upgrade to access →</span>
                        ) : (
                          <ArrowRight size={14} className="text-white/20 group-hover:text-secondary transition-colors" />
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
        <section className="mb-10 transition-all duration-200 hover:opacity-80">
          <div className="mb-4 transition-all duration-200 hover:opacity-80">
            <h2 className="text-4xl font-light text-white/95 flex items-center gap-2 transition-all duration-200 hover:opacity-80">
              <Layers size={20} className="text-primary transition-all duration-200 hover:opacity-80" />
              Research Verticals
            </h2>
            <p className="text-sm text-white/40 mt-1 transition-all duration-200 hover:opacity-80">Active research focus areas</p>
          </div>

          {verticals.length === 0 ? (
            <Card variant="default" className="bg-background/[0.02] border-white/10 transition-all duration-200 hover:opacity-80">
              <CardContent className="pt-10 pb-10 text-center transition-all duration-200 hover:opacity-80">
                <Layers size={28} className="text-white/20 mx-auto mb-3 transition-all duration-200 hover:opacity-80" />
                <p className="text-white/50 text-sm font-medium transition-all duration-200 hover:opacity-80">No verticals configured</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 transition-all duration-200 hover:opacity-80">
              {verticals.map(vertical => {
                const status = getVerticalStatus(vertical);
                
                return (
                  <Card 
                    key={vertical.id}
                    variant="default"
                    className="bg-background/[0.02] border-white/10 hover:border-primary/30 cursor-pointer transition-all group"
                    onClick={() => router.push(`/publications?vertical=${vertical.slug}`)}
                  >
                    <CardContent className="pt-4 pb-4 transition-all duration-200 hover:opacity-80">
                      <div className="flex items-center justify-between mb-2 transition-all duration-200 hover:opacity-80">
                        <h3 className="text-sm font-medium text-white group-hover:text-primary transition-colors">
                          {vertical.name}
                        </h3>
                        <ArrowRight size={12} className="text-white/20 group-hover:text-primary transition-colors" />
                      </div>
                      <div className="flex items-center gap-2 text-xs transition-all duration-200 hover:opacity-80">
                        <span className={status.color}>{status.label}</span>
                        {vertical.recentPublicationCount > 0 && (
                          <>
                            <span className="text-white/20 transition-all duration-200 hover:opacity-80">•</span>
                            <span className="text-white/30 transition-all duration-200 hover:opacity-80">{vertical.recentPublicationCount} publications</span>
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
          <section className="mb-8 transition-all duration-200 hover:opacity-80">
            <Card variant="default" className={subscription.isTrialActive ? "bg-cyan-500/5 border-cyan-500/20" : "bg-background/[0.02] border-white/10"}>
              <CardContent className="pt-6 pb-6 transition-all duration-200 hover:opacity-80">
                <div className="flex items-center justify-between transition-all duration-200 hover:opacity-80">
                  <div className="flex items-center gap-4 transition-all duration-200 hover:opacity-80">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center transition-all duration-200 hover:opacity-80">
                      <Shield size={20} className="text-cyan-400 transition-all duration-200 hover:opacity-80" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white transition-all duration-200 hover:opacity-80">
                        {subscription.isTrialActive ? "Trial Active" : "NomosX Access"}
                      </p>
                      <p className="text-xs text-white/40 mt-0.5 transition-all duration-200 hover:opacity-80">
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
                      className="text-cyan-400 hover:text-cyan-300 transition-all duration-200"
                      onClick={() => router.push("/pricing")}
                    >
                      Upgrade to access Strategic Reports →
                    </Button>
                  ) : (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-white/40 hover:text-white/60 transition-all duration-200"
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
