"use client";

/**
 * NomosX Think Tank - Publication Detail Page
 * 
 * Full publication view with audit trail
 */

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  FileText, 
  ArrowLeft,
  Clock,
  Eye,
  CheckCircle,
  AlertCircle,
  Shield,
  BookOpen,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import Shell from "@/components/Shell";
import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import TrustScoreBadge from "@/components/TrustScoreBadge";

interface Publication {
  id: string;
  vertical: { id: string; slug: string; name: string; icon?: string; color?: string };
  signal?: { id: string; title: string; signalType: string; priorityScore: number } | null;
  type: string;
  title: string;
  html: string;
  wordCount: number;
  trustScore: number;
  qualityScore: number;
  citationCoverage: number;
  claimCount: number;
  factClaimCount: number;
  citedClaimCount: number;
  criticalLoopResult?: any;
  sources: Array<{
    id: string;
    title: string;
    authors?: string[];
    year?: number;
    provider: string;
    qualityScore?: number;
    url?: string;
  }>;
  claims: Array<{
    id: string;
    text: string;
    claimType: string;
    section: string;
    confidence: number;
    citations: string[];
    hasContradiction: boolean;
  }>;
  qualityChecks: Array<{
    checkType: string;
    passed: boolean;
    score?: number;
  }>;
  publishedAt?: string | null;
  viewCount: number;
  createdAt: string;
}

const TYPE_LABELS: Record<string, string> = {
  RESEARCH_BRIEF: "Research Brief",
  UPDATE_NOTE: "Update Note",
  DATA_NOTE: "Data Note",
  POLICY_NOTE: "Policy Note",
  DOSSIER: "Dossier"
};

export default function PublicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [publication, setPublication] = useState<Publication | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"content" | "audit" | "sources">("content");

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
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </Shell>
    );
  }

  if (!publication) {
    return (
      <Shell>
        <Card className="p-12 text-center">
          <FileText size={32} className="text-white/20 mx-auto mb-3" />
          <p className="text-white/50">Publication non trouvée</p>
          <Button variant="ghost" className="mt-4" onClick={() => router.back()}>
            <ArrowLeft size={16} /> Retour
          </Button>
        </Card>
      </Shell>
    );
  }

  const isPublished = !!publication.publishedAt;

  return (
    <Shell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-1 text-sm text-white/50 hover:text-white/80 mb-3 transition-colors"
            >
              <ArrowLeft size={14} /> Retour
            </button>
            <div className="flex items-center gap-3 mb-2">
              <span 
                className="text-2xl"
                style={{ color: publication.vertical.color }}
              >
                {publication.vertical.icon}
              </span>
              <div>
                <span className="text-sm text-white/50">{publication.vertical.name}</span>
                <span className="mx-2 text-white/20">•</span>
                <span className="text-sm text-white/50">{TYPE_LABELS[publication.type]}</span>
              </div>
              <Badge variant={isPublished ? "success" : "warning"}>
                {isPublished ? "Publié" : "Brouillon"}
              </Badge>
            </div>
            <h1 className="text-2xl font-bold text-white">{publication.title}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-white/40">
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {formatDate(publication.publishedAt || publication.createdAt)}
              </span>
              <span>{publication.wordCount} mots</span>
              {isPublished && (
                <span className="flex items-center gap-1">
                  <Eye size={14} />
                  {publication.viewCount} vues
                </span>
              )}
            </div>
          </div>
          <TrustScoreBadge score={publication.trustScore / 100} size="md" />
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 bg-white/[0.02] rounded-xl border border-white/[0.06]">
          <TabButton 
            active={activeTab === "content"} 
            onClick={() => setActiveTab("content")}
            icon={<BookOpen size={16} />}
            label="Contenu"
          />
          <TabButton 
            active={activeTab === "audit"} 
            onClick={() => setActiveTab("audit")}
            icon={<Shield size={16} />}
            label="Audit"
          />
          <TabButton 
            active={activeTab === "sources"} 
            onClick={() => setActiveTab("sources")}
            icon={<FileText size={16} />}
            label={`Sources (${publication.sources.length})`}
          />
        </div>

        {/* Content Tab */}
        {activeTab === "content" && (
          <Card className="p-6 lg:p-8">
            <div 
              className="nomosx-prose"
              dangerouslySetInnerHTML={{ __html: publication.html }}
            />
          </Card>
        )}

        {/* Audit Tab */}
        {activeTab === "audit" && (
          <div className="space-y-6">
            {/* Quality Metrics */}
            <Card className="p-5">
              <h3 className="font-semibold text-white mb-4">Métriques de qualité</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricBox label="Trust Score" value={publication.trustScore} max={100} />
                <MetricBox label="Quality Score" value={publication.qualityScore} max={100} />
                <MetricBox label="Citation Coverage" value={Math.round(publication.citationCoverage * 100)} max={100} suffix="%" />
                <MetricBox label="Claims" value={publication.claimCount} suffix={` (${publication.factClaimCount} faits)`} />
              </div>
            </Card>

            {/* Quality Checks */}
            <Card className="p-5">
              <h3 className="font-semibold text-white mb-4">Contrôles qualité</h3>
              <div className="space-y-2">
                {publication.qualityChecks.map((check, i) => (
                  <div 
                    key={i}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]"
                  >
                    <div className="flex items-center gap-3">
                      {check.passed ? (
                        <CheckCircle size={18} className="text-emerald-400" />
                      ) : (
                        <AlertCircle size={18} className="text-red-400" />
                      )}
                      <span className="text-sm text-white/80">{formatCheckType(check.checkType)}</span>
                    </div>
                    {check.score !== undefined && (
                      <span className="text-sm font-medium text-white/60">{check.score}/100</span>
                    )}
                  </div>
                ))}
                {publication.qualityChecks.length === 0 && (
                  <p className="text-sm text-white/40 text-center py-4">Aucun contrôle enregistré</p>
                )}
              </div>
            </Card>

            {/* Critical Loop Results */}
            {publication.criticalLoopResult && (
              <Card className="p-5">
                <h3 className="font-semibold text-white mb-4">Critical Loop</h3>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <MetricBox 
                    label="Méthodologie" 
                    value={publication.criticalLoopResult.methodology?.overallScore || 0} 
                    max={100} 
                  />
                  <MetricBox 
                    label="Adversarial" 
                    value={publication.criticalLoopResult.adversarial?.overallScore || 0} 
                    max={100} 
                  />
                  <MetricBox 
                    label="Calibration" 
                    value={publication.criticalLoopResult.calibration?.overallScore || 0} 
                    max={100} 
                  />
                </div>
                {publication.criticalLoopResult.needsHumanReview && (
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <p className="text-sm text-amber-400 flex items-center gap-2">
                      <AlertCircle size={16} />
                      Revue humaine requise
                    </p>
                  </div>
                )}
              </Card>
            )}

            {/* Claims */}
            {publication.claims.length > 0 && (
              <Card className="p-5">
                <h3 className="font-semibold text-white mb-4">Claims ({publication.claims.length})</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {publication.claims.map((claim, i) => (
                    <div 
                      key={claim.id}
                      className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={getClaimBadgeVariant(claim.claimType)}>
                          {claim.claimType}
                        </Badge>
                        <span className="text-xs text-white/40">{claim.section}</span>
                        {claim.hasContradiction && (
                          <Badge variant="error">Contradiction</Badge>
                        )}
                      </div>
                      <p className="text-sm text-white/70">{claim.text}</p>
                      {claim.citations.length > 0 && (
                        <p className="text-xs text-cyan-400 mt-2">
                          {claim.citations.join(", ")}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Sources Tab */}
        {activeTab === "sources" && (
          <Card className="p-5">
            <h3 className="font-semibold text-white mb-4">Sources ({publication.sources.length})</h3>
            <div className="space-y-3">
              {publication.sources.map((source, i) => (
                <div 
                  key={source.id}
                  className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.04]"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white mb-1">
                        [SRC-{i + 1}] {source.title}
                      </p>
                      <p className="text-xs text-white/50">
                        {source.authors?.join(", ") || "N/A"} ({source.year || "N/A"})
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <Badge variant="default">{source.provider}</Badge>
                        {source.qualityScore && (
                          <span className="text-xs text-white/40">
                            Qualité: {source.qualityScore}/100
                          </span>
                        )}
                      </div>
                    </div>
                    {source.url && (
                      <a 
                        href={source.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg hover:bg-white/[0.05] transition-colors"
                      >
                        <ExternalLink size={16} className="text-white/40" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
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
          ? "bg-white/[0.08] text-white" 
          : "text-white/50 hover:text-white/80 hover:bg-white/[0.04]"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function MetricBox({ 
  label, 
  value, 
  max, 
  suffix = "" 
}: { 
  label: string; 
  value: number; 
  max?: number; 
  suffix?: string;
}) {
  const percentage = max ? (value / max) * 100 : 0;
  const color = percentage >= 80 ? "text-emerald-400" :
                percentage >= 60 ? "text-cyan-400" :
                percentage >= 40 ? "text-amber-400" : "text-red-400";

  return (
    <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
      <p className="text-xs text-white/40 mb-1">{label}</p>
      <p className={`text-xl font-bold ${max ? color : "text-white"}`}>
        {value}{suffix}
      </p>
    </div>
  );
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

function formatCheckType(type: string): string {
  const labels: Record<string, string> = {
    CADENCE: "Cadence",
    THRESHOLD: "Seuils",
    QUALITY: "Qualité",
    CITATION: "Citations",
    FORBIDDEN_PATTERN: "Patterns interdits",
    METHODOLOGY: "Méthodologie",
    ADVERSARIAL: "Revue adversariale",
    CALIBRATION: "Calibration"
  };
  return labels[type] || type;
}

function getClaimBadgeVariant(type: string): "default" | "success" | "warning" | "ai" {
  switch (type) {
    case "FACT": return "ai";
    case "INTERPRETATION": return "success";
    case "SCENARIO": return "warning";
    default: return "default";
  }
}
