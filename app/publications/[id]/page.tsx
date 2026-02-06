
"use client";
import React from 'react';
import { useEffect,useState } from 'react';

/**
 * NomosX Publication Detail Page
 * 
 * View a single publication with full content, sources, and audit trail
 */

import { useParams,useRouter } from 'next/navigation';
import Shell from '@/components/Shell';
import { Card,CardContent,CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import TrustScoreBadge from '@/components/TrustScoreBadge';
import { cn } from '@/lib/utils';
import { FileText,ArrowLeft,Clock,Eye,Download,CheckCircle,Pause,VolumeX,Layers,ExternalLink,BookOpen,Shield } from 'lucide-react';

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
  DRAFT: { label: "Draft", icon: FileText, color: "text-primary" },
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
        <div className="flex items-center justify-center py-20 transition-all duration-200 hover:opacity-80">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin transition-all duration-200 hover:opacity-80" />
        </div>
      </Shell>
    );
  }

  if (!publication) {
    return (
      <Shell>
        <Card variant="default" className="bg-background/[0.02] border-white/10 transition-all duration-200 hover:opacity-80">
          <CardContent className="pt-12 pb-12 text-center transition-all duration-200 hover:opacity-80">
            <FileText size={32} className="text-white/20 mx-auto mb-3 transition-all duration-200 hover:opacity-80" />
            <p className="text-white/50 transition-all duration-200 hover:opacity-80">Publication not found</p>
            <Button variant="ghost" className="mt-4 transition-all duration-200 hover:opacity-80" onClick={() => router.back()}>
              <ArrowLeft size={16} className="mr-2 transition-all duration-200 hover:opacity-80" /> Back
            </Button>
          </CardContent>
        </Card>
      </Shell>
    );
  }

  const statusConfig = STATUS_CONFIG[publication.status] || STATUS_CONFIG.DRAFT;
  const StatusIcon = statusConfig.icon;

  return (
    <Shell>
      <div className="max-w-5xl mx-auto transition-all duration-200 hover:opacity-80">
        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-1 text-sm text-white/50 hover:text-white/80 mb-6 transition-colors"
        >
          <ArrowLeft size={14} /> Back to publications
        </button>

        {/* Header */}
        <div className="flex items-start justify-between mb-8 transition-all duration-200 hover:opacity-80">
          <div className="flex-1 transition-all duration-200 hover:opacity-80">
            <div className="flex items-center gap-3 mb-3 transition-all duration-200 hover:opacity-80">
              {publication.vertical && (
                <Badge variant="default" className="text-xs bg-background/5 border-white/10 transition-all duration-200 hover:opacity-80">
                  <Layers size={10} className="mr-1 transition-all duration-200 hover:opacity-80" />
                  {publication.vertical.name}
                </Badge>
              )}
              <Badge variant="default" className="text-xs bg-cyan-500/10 text-cyan-400 border-cyan-500/20 transition-all duration-200 hover:opacity-80">
                {TYPE_LABELS[publication.type] || publication.type}
              </Badge>
              <span className={`flex items-center gap-1 text-xs ${statusConfig.color}`}>
                <StatusIcon size={12} />
                {statusConfig.label}
              </span>
            </div>
            <h1 className="text-4xl font-semibold text-white mb-2 transition-all duration-200 hover:opacity-80">{publication.title}</h1>
            <div className="flex items-center gap-4 text-sm text-white/40 transition-all duration-200 hover:opacity-80">
              <span>{publication.wordCount} words</span>
              <span>{publication.sourceCount} sources</span>
              <span className="flex items-center gap-1 transition-all duration-200 hover:opacity-80">
                <Eye size={14} />
                {publication.viewCount} views
              </span>
              <span className="flex items-center gap-1 transition-all duration-200 hover:opacity-80">
                <Clock size={14} />
                {new Date(publication.createdAt).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric"
                })}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 transition-all duration-200 hover:opacity-80">
            <TrustScoreBadge score={publication.trustScore} size="lg" />
            <Button variant="ghost" size="sm">
              <Download size={16} className="mr-2 transition-all duration-200 hover:opacity-80" />
              Export
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 bg-background/[0.02] rounded-xl border border-white/[0.06] w-fit mb-6 transition-all duration-200 hover:opacity-80">
          <TabButton 
            active={activeTab === "content"} 
            onClick={() => setActiveTab("content")}
            icon={<FileText size={16} />}
            label="Content"
          />
          <TabButton 
            active={activeTab === "sources"} 
            onClick={() => setActiveTab("sources")}
            icon={<BookOpen size={16} />}
            label={`Sources (${publication.sourceCount})`}
          />
          <TabButton 
            active={activeTab === "audit"} 
            onClick={() => setActiveTab("audit")}
            icon={<Shield size={16} />}
            label="Audit"
          />
        </div>

        {/* Content Tab */}
        {activeTab === "content" && (
          <Card variant="default" className="bg-background/[0.02] border-white/10 transition-all duration-200 hover:opacity-80">
            <CardContent className="pt-8 pb-8 transition-all duration-200 hover:opacity-80">
              <div 
                className="nomosx-prose transition-all duration-200 hover:opacity-80"
                dangerouslySetInnerHTML={{ __html: publication.html }}
              />
            </CardContent>
          </Card>
        )}

        {/* Sources Tab */}
        {activeTab === "sources" && (
          <Card variant="default" className="bg-background/[0.02] border-white/10 transition-all duration-200 hover:opacity-80">
            <CardContent className="pt-6 pb-6 transition-all duration-200 hover:opacity-80">
              <div className="space-y-3 transition-all duration-200 hover:opacity-80">
                {publication.sources.map((source, idx) => (
                  <div 
                    key={source.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-background/[0.02] border border-white/[0.06] transition-all duration-200 hover:opacity-80"
                  >
                    <div className="w-6 h-6 rounded bg-cyan-500/10 flex items-center justify-center flex-shrink-0 transition-all duration-200 hover:opacity-80">
                      <span className="text-xs font-medium text-cyan-400 transition-all duration-200 hover:opacity-80">{idx + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0 transition-all duration-200 hover:opacity-80">
                      <p className="text-sm text-white font-medium transition-all duration-200 hover:opacity-80">{source.title}</p>
                      <div className="flex items-center gap-2 text-xs text-white/40 mt-1 transition-all duration-200 hover:opacity-80">
                        {source.authors && source.authors.length > 0 && (
                          <span>{source.authors.slice(0, 2).join(", ")}{source.authors.length > 2 ? " et al." : ""}</span>
                        )}
                        {source.year && <span>({source.year})</span>}
                        <span className="text-white/20 transition-all duration-200 hover:opacity-80">•</span>
                        <span>{source.provider}</span>
                      </div>
                    </div>
                    {source.url && (
                      <a 
                        href={source.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-1.5 rounded hover:bg-background/[0.05] transition-colors"
                      >
                        <ExternalLink size={14} className="text-white/40 transition-all duration-200 hover:opacity-80" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Audit Tab */}
        {activeTab === "audit" && (
          <div className="space-y-4 transition-all duration-200 hover:opacity-80">
            {/* Quality Metrics */}
            <Card variant="default" className="bg-background/[0.02] border-white/10 transition-all duration-200 hover:opacity-80">
              <CardHeader>
                <h3 className="text-base font-semibold text-white transition-all duration-200 hover:opacity-80">Quality Metrics</h3>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4 transition-all duration-200 hover:opacity-80">
                  <div className="text-center p-4 rounded-lg bg-background/[0.02] transition-all duration-200 hover:opacity-80">
                    <div className="text-4xl font-light text-white transition-all duration-200 hover:opacity-80">{publication.trustScore}</div>
                    <div className="text-xs text-white/40 transition-all duration-200 hover:opacity-80">Trust Score</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-background/[0.02] transition-all duration-200 hover:opacity-80">
                    <div className="text-4xl font-light text-white transition-all duration-200 hover:opacity-80">{publication.qualityScore}</div>
                    <div className="text-xs text-white/40 transition-all duration-200 hover:opacity-80">Quality Score</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-background/[0.02] transition-all duration-200 hover:opacity-80">
                    <div className="text-4xl font-light text-white transition-all duration-200 hover:opacity-80">{Math.round(publication.citationCoverage * 100)}%</div>
                    <div className="text-xs text-white/40 transition-all duration-200 hover:opacity-80">Citation Coverage</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-background/[0.02] transition-all duration-200 hover:opacity-80">
                    <div className="text-4xl font-light text-white transition-all duration-200 hover:opacity-80">{publication.claimCount}</div>
                    <div className="text-xs text-white/40 transition-all duration-200 hover:opacity-80">Claims</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quality Checks */}
            {publication.qualityChecks.length > 0 && (
              <Card variant="default" className="bg-background/[0.02] border-white/10 transition-all duration-200 hover:opacity-80">
                <CardHeader>
                  <h3 className="text-base font-semibold text-white transition-all duration-200 hover:opacity-80">Quality Checks</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 transition-all duration-200 hover:opacity-80">
                    {publication.qualityChecks.map((check, idx) => (
                      <div 
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-lg bg-background/[0.02] transition-all duration-200 hover:opacity-80"
                      >
                        <span className="text-sm text-white/70 transition-all duration-200 hover:opacity-80">{check.checkType}</span>
                        <div className="flex items-center gap-2 transition-all duration-200 hover:opacity-80">
                          {check.score !== undefined && (
                            <span className="text-sm text-white/50 transition-all duration-200 hover:opacity-80">{check.score}</span>
                          )}
                          {check.passed ? (
                            <CheckCircle size={16} className="text-emerald-400 transition-all duration-200 hover:opacity-80" />
                          ) : (
                            <VolumeX size={16} className="text-red-400 transition-all duration-200 hover:opacity-80" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Claims */}
            {publication.claims.length > 0 && (
              <Card variant="default" className="bg-background/[0.02] border-white/10 transition-all duration-200 hover:opacity-80">
                <CardHeader>
                  <h3 className="text-base font-semibold text-white transition-all duration-200 hover:opacity-80">Extracted Claims ({publication.claims.length})</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 transition-all duration-200 hover:opacity-80">
                    {publication.claims.slice(0, 10).map((claim) => (
                      <div 
                        key={claim.id}
                        className={`p-3 rounded-lg ${claim.hasContradiction ? 'bg-red-500/5 border border-red-500/20' : 'bg-background/[0.02]'}`}
                      >
                        <p className="text-sm text-white/70 transition-all duration-200 hover:opacity-80">{claim.text}</p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-white/40 transition-all duration-200 hover:opacity-80">
                          <Badge variant="default" className="text-xs transition-all duration-200 hover:opacity-80">{claim.claimType}</Badge>
                          <span>Confidence: {Math.round(claim.confidence * 100)}%</span>
                          {claim.hasContradiction && (
                            <span className="text-red-400 transition-all duration-200 hover:opacity-80">⚠ Contradiction detected</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </Shell>
  );
}

function TabButton({ 
  active, 
  onClick, 
  icon, 
  label 
}: { 
  active: boolean; 
  onClick: () => void; 
  icon: React.ReactNode; 
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
        active 
          ? "bg-background/[0.08] text-white" 
          : "text-white/50 hover:text-white hover:bg-background/[0.04]"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
