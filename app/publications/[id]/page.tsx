
"use client";
import React from 'react';
import { useEffect, useState } from 'react';

/**
 * NomosX Publication Detail Page
 * 
 * Premium editorial layout with researcher author attribution.
 * Think tank publication — not an "AI output".
 */

import { useParams, useRouter } from 'next/navigation';
import Shell from '@/components/Shell';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import TrustScoreBadge from '@/components/TrustScoreBadge';
import ResearcherBadge from '@/components/ResearcherBadge';
import { getLeadResearcher } from '@/lib/researchers';
import { FileText, ArrowLeft, Clock, Eye, Download, CheckCircle, Pause, VolumeX, Layers, ExternalLink, BookOpen, Shield } from 'lucide-react';

type Publication = {
  id: string;
  type: string;
  title: string;
  html: string;
  vertical?: { id: string; name: string; slug: string };
  signal?: { id: string; title: string };
  wordCount: number;
  trustScore: number;
  qualityScore: number;
  citationCoverage: number;
  sourceCount: number;
  claimCount: number;
  status: string;
  publishedAt?: string | null;
  createdAt: string;
  viewCount: number;
  sources: Array<{
    id: string;
    title: string;
    authors?: string[];
    year?: number;
    provider: string;
    url?: string;
  }>;
  claims: Array<{
    id: string;
    text: string;
    claimType: string;
    confidence: number;
    hasContradiction: boolean;
  }>;
  qualityChecks: Array<{
    checkType: string;
    passed: boolean;
    score?: number;
  }>;
};

const TYPE_LABELS: Record<string, string> = {
  EXECUTIVE_BRIEF: "Executive Brief",
  STRATEGIC_REPORT: "Strategic Report",
  RESEARCH_BRIEF: "Executive Brief",
  UPDATE_NOTE: "Update Note",
  DATA_NOTE: "Data Note",
  POLICY_NOTE: "Policy Note",
  DOSSIER: "Strategic Report",
};

const STATUS_CONFIG: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  PUBLISHED: { label: "Published", icon: CheckCircle, color: "text-emerald-400" },
  HELD: { label: "Held", icon: Pause, color: "text-amber-400" },
  SILENT: { label: "Silent", icon: VolumeX, color: "text-white/40" },
  DRAFT: { label: "Draft", icon: FileText, color: "text-[#3B82F6]" },
};

export default function PublicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [publication, setPublication] = useState<Publication | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"content" | "sources" | "audit">("content");

  useEffect(() => {
    if (params.id) {
      loadPublication(params.id as string);
    }
  }, [params.id]);

  async function loadPublication(id: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/think-tank/publications/${id}`);
      if (res.ok) {
        const data = await res.json();
        setPublication(data.publication);
      }
    } catch (error) {
      console.error("Failed to load publication:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <Shell>
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        </div>
      </Shell>
    );
  }

  if (!publication) {
    return (
      <Shell>
        <div className="max-w-3xl mx-auto text-center py-24">
          <FileText size={32} className="text-white/10 mx-auto mb-4" />
          <p className="text-white/40 text-sm mb-6">Publication not found</p>
          <button
            onClick={() => router.back()}
            className="text-sm text-indigo-400/60 hover:text-indigo-400 transition-colors inline-flex items-center gap-1.5"
          >
            <ArrowLeft size={14} /> Back
          </button>
        </div>
      </Shell>
    );
  }

  const statusConfig = STATUS_CONFIG[publication.status] || STATUS_CONFIG.DRAFT;
  const StatusIcon = statusConfig.icon;
  const researcher = getLeadResearcher(publication.title);
  const isStrategic = publication.type === "STRATEGIC_REPORT" || publication.type === "DOSSIER";

  return (
    <Shell>
      <div className="max-w-4xl mx-auto">

        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-white/30 hover:text-white/60 mb-8 transition-colors"
        >
          <ArrowLeft size={14} /> Back to publications
        </button>

        {/* ── Publication Header ── */}
        <header className="mb-10">
          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span
              className="text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full border"
              style={{
                backgroundColor: isStrategic ? 'rgba(124,58,237,0.1)' : 'rgba(99,102,241,0.1)',
                color: isStrategic ? '#A78BFA' : '#818CF8',
                borderColor: isStrategic ? 'rgba(124,58,237,0.2)' : 'rgba(99,102,241,0.2)',
              }}
            >
              {TYPE_LABELS[publication.type] || publication.type}
            </span>
            {publication.vertical && (
              <span className="text-xs text-white/25">{publication.vertical.name}</span>
            )}
            <span className={`flex items-center gap-1 text-xs ${statusConfig.color}`}>
              <StatusIcon size={11} />
              {statusConfig.label}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-display text-3xl sm:text-4xl font-light tracking-tight leading-tight text-white/95 mb-6">
            {publication.title}
          </h1>

          {/* Author + Trust */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <ResearcherBadge researcher={researcher} size="lg" showInstitution />
            <div className="flex items-center gap-3">
              <TrustScoreBadge score={publication.trustScore} size="lg" />
              <button className="text-white/25 hover:text-white/50 transition-colors p-2 rounded-lg hover:bg-white/[0.03]">
                <Download size={16} />
              </button>
            </div>
          </div>

          {/* Stats bar */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mt-6 pt-6 border-t border-white/[0.06] text-xs text-white/25">
            <span>{publication.wordCount.toLocaleString()} words</span>
            <span className="text-white/10">|</span>
            <span>{publication.sourceCount} sources cited</span>
            <span className="text-white/10">|</span>
            <span className="inline-flex items-center gap-1"><Eye size={11} /> {publication.viewCount}</span>
            <span className="text-white/10">|</span>
            <span className="inline-flex items-center gap-1">
              <Clock size={11} />
              {new Date(publication.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}
            </span>
          </div>
        </header>

        {/* ── Tabs ── */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.02] border border-white/[0.06] w-fit mb-8">
          <TabButton active={activeTab === "content"} onClick={() => setActiveTab("content")} icon={<FileText size={14} />} label="Content" />
          <TabButton active={activeTab === "sources"} onClick={() => setActiveTab("sources")} icon={<BookOpen size={14} />} label={`Sources (${publication.sourceCount})`} />
          <TabButton active={activeTab === "audit"} onClick={() => setActiveTab("audit")} icon={<Shield size={14} />} label="Audit Trail" />
        </div>

        {/* ── Content Tab ── */}
        {activeTab === "content" && (
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-6 sm:p-10">
            <div
              className="nomosx-prose"
              dangerouslySetInnerHTML={{ __html: publication.html }}
            />
            {/* Author sign-off */}
            <div className="mt-10 pt-8 border-t border-white/[0.06]">
              <p className="text-xs text-white/20 mb-3 tracking-wide uppercase">Lead Researcher</p>
              <ResearcherBadge researcher={researcher} size="md" showInstitution />
            </div>
          </div>
        )}

        {/* ── Sources Tab ── */}
        {activeTab === "sources" && (
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-6">
            <div className="space-y-2">
              {publication.sources.map((source, idx) => (
                <div
                  key={source.id}
                  className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-colors"
                >
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-medium"
                    style={{ backgroundColor: `${researcher.colorHex}15`, color: researcher.colorHex }}
                  >
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/80 font-medium leading-snug">{source.title}</p>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-white/30 mt-1.5">
                      {source.authors && source.authors.length > 0 && (
                        <span>{source.authors.slice(0, 2).join(", ")}{source.authors.length > 2 ? " et al." : ""}</span>
                      )}
                      {source.year && <span>({source.year})</span>}
                      <span className="text-white/10">·</span>
                      <span className="text-white/20">{source.provider}</span>
                    </div>
                  </div>
                  {source.url && (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg hover:bg-white/[0.04] transition-colors flex-shrink-0"
                    >
                      <ExternalLink size={13} className="text-white/25" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Audit Tab ── */}
        {activeTab === "audit" && (
          <div className="space-y-5">
            {/* Quality Metrics */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-6">
              <h3 className="text-sm font-medium text-white/60 mb-5">Quality Metrics</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { value: publication.trustScore, label: "Trust Score" },
                  { value: publication.qualityScore, label: "Quality Score" },
                  { value: `${Math.round(publication.citationCoverage * 100)}%`, label: "Citation Coverage" },
                  { value: publication.claimCount, label: "Claims Extracted" },
                ].map((metric) => (
                  <div key={metric.label} className="text-center p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <div className="font-display text-3xl font-light text-white/90">{metric.value}</div>
                    <div className="text-[11px] text-white/30 mt-1">{metric.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quality Checks */}
            {publication.qualityChecks.length > 0 && (
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-6">
                <h3 className="text-sm font-medium text-white/60 mb-4">Quality Checks</h3>
                <div className="space-y-2">
                  {publication.qualityChecks.map((check, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02]"
                    >
                      <span className="text-sm text-white/50">{check.checkType}</span>
                      <div className="flex items-center gap-2">
                        {check.score !== undefined && (
                          <span className="text-xs text-white/30 font-mono">{check.score}</span>
                        )}
                        {check.passed ? (
                          <CheckCircle size={15} className="text-emerald-400/80" />
                        ) : (
                          <VolumeX size={15} className="text-red-400/80" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Claims */}
            {publication.claims.length > 0 && (
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-6">
                <h3 className="text-sm font-medium text-white/60 mb-4">
                  Extracted Claims ({publication.claims.length})
                </h3>
                <div className="space-y-2">
                  {publication.claims.slice(0, 10).map((claim) => (
                    <div
                      key={claim.id}
                      className={`p-3.5 rounded-xl ${
                        claim.hasContradiction
                          ? 'bg-red-500/[0.04] border border-red-500/15'
                          : 'bg-white/[0.02] border border-white/[0.04]'
                      }`}
                    >
                      <p className="text-sm text-white/60 leading-relaxed">{claim.text}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-2.5 text-xs text-white/30">
                        <span className="px-2 py-0.5 rounded-full bg-white/[0.04] text-white/40">{claim.claimType}</span>
                        <span>Confidence: {Math.round(claim.confidence * 100)}%</span>
                        {claim.hasContradiction && (
                          <span className="text-red-400/80">Contradiction detected</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Shell>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
        active
          ? "bg-white/[0.06] text-white"
          : "text-white/35 hover:text-white/60 hover:bg-white/[0.03]"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
