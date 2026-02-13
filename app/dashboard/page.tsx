"use client";
import React from 'react';
import { useState, useEffect } from 'react';

/**
 * USER Dashboard — Research Library
 * 
 * Purpose: Consult publications from the NomosX agentic think tank
 * Audience: Subscribers and free users
 * 
 * Shows:
 * - Latest executive briefs (free) with researcher attribution
 * - Latest strategic reports (premium) with researcher attribution
 * - Research verticals coverage
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
import { Card, CardContent } from '@/components/ui/Card';
import TrustScoreBadge from '@/components/TrustScoreBadge';
import ResearcherBadge from '@/components/ResearcherBadge';
import { getLeadResearcher } from '@/lib/researchers';
import TrialBanner from '@/components/TrialBanner';
import { cn } from '@/lib/utils';
import { BookOpen, FileText, Lock, TrendingUp, Sparkles, ArrowRight, Clock, Shield, Layers, Settings } from 'lucide-react';

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

  if (loading) {
    return (
      <Shell>
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-2 border-[#00D4FF]/20 border-t-[#00D4FF] rounded-full animate-spin" />
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="max-w-6xl mx-auto">

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-[11px] text-white/20 tracking-[0.2em] uppercase mb-2">Research Library</p>
            <h1 className="font-display text-3xl sm:text-4xl font-light tracking-tight text-white/95">
              Your Briefings
            </h1>
            <p className="text-sm text-white/35 mt-1.5">
              Publications from the NomosX research council
            </p>
          </div>
          <button
            onClick={() => router.push('/dashboard/preferences')}
            className="p-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] text-white/30 hover:text-white/60 hover:border-white/[0.1] transition-all"
          >
            <Settings size={16} />
          </button>
        </div>

        {/* Trial Banner */}
        {subscription?.isTrialActive && subscription.trialDaysRemaining > 0 && (
          <div className="mb-8">
            <TrialBanner daysRemaining={subscription.trialDaysRemaining} />
          </div>
        )}

        {/* ── Quick Stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {[
            { value: allPublications.length, label: "Publications", color: "#00D4FF" },
            { value: latestBriefs.length, label: "Executive Briefs", color: "#3B82F6" },
            { value: latestReports.length, label: "Strategic Reports", color: "#7C3AED" },
            { value: verticals.length, label: "Research Verticals", color: "#10B981" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-white/[0.06] bg-white/[0.015] p-4 text-center"
            >
              <div className="font-display text-2xl font-light" style={{ color: stat.color }}>{stat.value}</div>
              <div className="text-[11px] text-white/25 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* ── Executive Briefs ── */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-1 h-5 rounded-full bg-[#00D4FF]" />
              <div>
                <h2 className="font-display text-lg font-medium text-white/90">Executive Briefs</h2>
                <p className="text-xs text-white/25 mt-0.5">Decision-ready insights — free access</p>
              </div>
            </div>
            <Link href="/publications?type=brief" className="text-xs text-[#00D4FF]/50 hover:text-[#00D4FF] flex items-center gap-1 transition-colors">
              View all <ArrowRight size={12} />
            </Link>
          </div>

          {latestBriefs.length === 0 ? (
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] py-14 text-center">
              <FileText size={24} className="text-white/10 mx-auto mb-3" />
              <p className="text-white/30 text-sm">No briefs published yet</p>
              <p className="text-white/15 text-xs mt-1">The research council is working on new insights</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {latestBriefs.map(brief => {
                const researcher = getLeadResearcher(brief.title);
                return (
                  <div
                    key={brief.id}
                    onClick={() => router.push(`/publications/${brief.id}`)}
                    className="group rounded-xl border border-white/[0.06] bg-white/[0.015] p-5 cursor-pointer hover:border-[#00D4FF]/20 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <ResearcherBadge researcher={researcher} size="sm" />
                      <TrustScoreBadge score={brief.trustScore} size="sm" />
                    </div>
                    <h3 className="text-[15px] font-medium text-white/85 group-hover:text-white transition-colors line-clamp-2 leading-snug mb-3">
                      {brief.title}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-white/20">
                      <div className="flex items-center gap-2">
                        {brief.vertical && <span>{brief.vertical.name}</span>}
                        <span className="text-white/10">·</span>
                        <span>{new Date(brief.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                      </div>
                      <ArrowRight size={12} className="text-white/10 group-hover:text-[#00D4FF]/50 transition-colors" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ── Strategic Reports ── */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-1 h-5 rounded-full bg-[#7C3AED]" />
              <div>
                <h2 className="font-display text-lg font-medium text-white/90">Strategic Reports</h2>
                <p className="text-xs text-white/25 mt-0.5">Comprehensive analysis — premium access</p>
              </div>
            </div>
            <Link href="/publications?type=report" className="text-xs text-[#7C3AED]/50 hover:text-[#7C3AED] flex items-center gap-1 transition-colors">
              View all <ArrowRight size={12} />
            </Link>
          </div>

          {latestReports.length === 0 ? (
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] py-14 text-center">
              <Sparkles size={24} className="text-white/10 mx-auto mb-3" />
              <p className="text-white/30 text-sm">No reports published yet</p>
              <p className="text-white/15 text-xs mt-1">Strategic reports are published periodically</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {latestReports.map(report => {
                const isLocked = !subscription?.canAccessPremium;
                const researcher = getLeadResearcher(report.title);

                return (
                  <div
                    key={report.id}
                    onClick={() => router.push(isLocked ? "/pricing" : `/publications/${report.id}`)}
                    className={cn(
                      "group rounded-xl border p-5 cursor-pointer transition-all",
                      isLocked
                        ? "border-[#7C3AED]/15 bg-[#7C3AED]/[0.03]"
                        : "border-white/[0.06] bg-white/[0.015] hover:border-[#7C3AED]/20"
                    )}
                  >
                    <div className="flex items-start justify-between mb-3">
                      {isLocked ? (
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-[#7C3AED]/10 flex items-center justify-center">
                            <Lock size={12} className="text-[#7C3AED]/60" />
                          </div>
                          <span className="text-[10px] font-semibold tracking-wider uppercase text-[#7C3AED]/50">Premium</span>
                        </div>
                      ) : (
                        <ResearcherBadge researcher={researcher} size="sm" />
                      )}
                      {!isLocked && <TrustScoreBadge score={report.trustScore} size="sm" />}
                    </div>
                    <h3 className={cn(
                      "text-[15px] font-medium line-clamp-2 leading-snug mb-3 transition-colors",
                      isLocked ? "text-white/45" : "text-white/85 group-hover:text-white"
                    )}>
                      {report.title}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-white/20">
                      <div className="flex items-center gap-2">
                        {report.vertical && <span>{report.vertical.name}</span>}
                        <span className="text-white/10">·</span>
                        <span>{new Date(report.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                      </div>
                      {isLocked ? (
                        <span className="text-[#7C3AED]/40 text-[11px]">Upgrade to read</span>
                      ) : (
                        <ArrowRight size={12} className="text-white/10 group-hover:text-[#7C3AED]/50 transition-colors" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ── Research Verticals ── */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-1 h-5 rounded-full bg-[#10B981]" />
            <div>
              <h2 className="font-display text-lg font-medium text-white/90">Research Verticals</h2>
              <p className="text-xs text-white/25 mt-0.5">Active focus areas monitored by the council</p>
            </div>
          </div>

          {verticals.length === 0 ? (
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] py-14 text-center">
              <Layers size={24} className="text-white/10 mx-auto mb-3" />
              <p className="text-white/30 text-sm">No verticals configured</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {verticals.map(vertical => {
                const status = getVerticalStatus(vertical);

                return (
                  <div
                    key={vertical.id}
                    onClick={() => router.push(`/publications?vertical=${vertical.slug}`)}
                    className="group rounded-xl border border-white/[0.06] bg-white/[0.015] p-4 cursor-pointer hover:border-white/[0.1] transition-all"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <h3 className="text-sm font-medium text-white/70 group-hover:text-white/90 transition-colors">
                        {vertical.name}
                      </h3>
                      <ArrowRight size={11} className="text-white/10 group-hover:text-white/30 transition-colors" />
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className={status.color}>{status.label}</span>
                      {vertical.recentPublicationCount > 0 && (
                        <>
                          <span className="text-white/10">·</span>
                          <span className="text-white/20">{vertical.recentPublicationCount} publications</span>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ── Subscription ── */}
        {subscription && (
          <section className="mb-8">
            <div className={cn(
              "rounded-xl border p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",
              subscription.isTrialActive
                ? "border-[#00D4FF]/15 bg-[#00D4FF]/[0.03]"
                : "border-white/[0.06] bg-white/[0.015]"
            )}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#00D4FF]/10 flex items-center justify-center flex-shrink-0">
                  <Shield size={16} className="text-[#00D4FF]/60" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white/80">
                    {subscription.isTrialActive ? "Trial Active" : "NomosX Access"}
                  </p>
                  <p className="text-xs text-white/30 mt-0.5">
                    {subscription.isTrialActive
                      ? `${subscription.trialDaysRemaining} days remaining`
                      : `${subscription.activeVerticals} active verticals`}
                  </p>
                </div>
              </div>

              {subscription.isTrialActive ? (
                <button
                  onClick={() => router.push("/pricing")}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00D4FF]/20 to-[#3B82F6]/20 border border-[#00D4FF]/20 text-sm font-medium text-white hover:border-[#00D4FF]/40 transition-all"
                >
                  Continue with NomosX
                </button>
              ) : !subscription.canAccessPremium ? (
                <button
                  onClick={() => router.push("/pricing")}
                  className="text-sm text-[#7C3AED]/50 hover:text-[#7C3AED] transition-colors"
                >
                  Upgrade to Strategic Reports →
                </button>
              ) : (
                <button
                  onClick={() => router.push("/pricing")}
                  className="text-sm text-white/25 hover:text-white/50 transition-colors"
                >
                  Manage subscription
                </button>
              )}
            </div>
          </section>
        )}
      </div>
    </Shell>
  );
}
