"use client";

/**
 * NomosX Publications Archive
 * 
 * The ONLY durable artifact of the Think Tank
 * All paths lead here: Signals, Briefs, Council deliberations
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Shell from "@/components/Shell";
import { Card, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";
import TrustScoreBadge from "@/components/TrustScoreBadge";
import { 
  Archive, 
  FileText,
  Search,
  Filter,
  ArrowUpDown,
  Eye,
  Download,
  Clock,
  Layers,
  CheckCircle,
  Pause,
  VolumeX
} from "lucide-react";

type EditorialStatus = "PUBLISHED" | "HELD" | "SILENT";

type Publication = {
  id: string;
  type: string;
  title: string;
  vertical?: { id: string; name: string; slug: string; color?: string };
  wordCount: number;
  trustScore: number;
  qualityScore: number;
  sourceCount: number;
  status: EditorialStatus;
  publishedAt?: string | null;
  createdAt: string;
  viewCount: number;
};

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  RESEARCH_BRIEF: { label: "Research Brief", color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" },
  UPDATE_NOTE: { label: "Update Note", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  DATA_NOTE: { label: "Data Note", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  POLICY_NOTE: { label: "Policy Note", color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  DOSSIER: { label: "Dossier", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
};

const STATUS_CONFIG: Record<EditorialStatus, { label: string; icon: React.ElementType; color: string }> = {
  PUBLISHED: { label: "Publié", icon: CheckCircle, color: "text-emerald-400" },
  HELD: { label: "Retenu", icon: Pause, color: "text-amber-400" },
  SILENT: { label: "Silence", icon: VolumeX, color: "text-white/40" },
};

export default function PublicationsPage() {
  const router = useRouter();
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<EditorialStatus | "ALL">("ALL");
  const [sortBy, setSortBy] = useState<"date" | "trust" | "views">("date");

  useEffect(() => {
    loadPublications();
  }, []);

  async function loadPublications() {
    setLoading(true);
    try {
      const res = await fetch("/api/think-tank/publications?limit=100");
      if (res.ok) {
        const data = await res.json();
        setPublications(data.publications || []);
      }
    } catch (error) {
      console.error("Failed to load publications:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredPublications = publications
    .filter(pub => {
      if (typeFilter !== "ALL" && pub.type !== typeFilter) return false;
      if (statusFilter !== "ALL" && pub.status !== statusFilter) return false;
      if (searchQuery && !pub.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === "trust") {
        return b.trustScore - a.trustScore;
      } else {
        return b.viewCount - a.viewCount;
      }
    });

  const publishedCount = publications.filter(p => p.status === "PUBLISHED").length;
  const heldCount = publications.filter(p => p.status === "HELD").length;
  const silentCount = publications.filter(p => p.status === "SILENT").length;

  return (
    <Shell>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/5 border border-emerald-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <Archive size={28} className="text-emerald-400" />
            </div>
            <div>
              <div className="text-xs text-emerald-400/60 tracking-[0.25em] uppercase mb-1">
                Institutional Archive
              </div>
              <h1 className="text-4xl font-light tracking-tight text-white/95">Publications</h1>
            </div>
          </div>
          <p className="text-base text-white/50 leading-relaxed max-w-3xl ml-[4.5rem]">
            The only durable output of NomosX. Every signal, every deliberation leads here — or to intentional silence.
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card variant="default" className="bg-white/[0.02] border-white/10">
            <CardContent className="pt-4 pb-4">
              <div className="text-2xl font-light text-white">{publications.length}</div>
              <div className="text-xs text-white/40">Total</div>
            </CardContent>
          </Card>
          <Card variant="default" className="bg-emerald-500/5 border-emerald-500/20">
            <CardContent className="pt-4 pb-4">
              <div className="text-2xl font-light text-emerald-400">{publishedCount}</div>
              <div className="text-xs text-emerald-400/60">Publiés</div>
            </CardContent>
          </Card>
          <Card variant="default" className="bg-amber-500/5 border-amber-500/20">
            <CardContent className="pt-4 pb-4">
              <div className="text-2xl font-light text-amber-400">{heldCount}</div>
              <div className="text-xs text-amber-400/60">Retenus</div>
            </CardContent>
          </Card>
          <Card variant="default" className="bg-white/[0.02] border-white/10">
            <CardContent className="pt-4 pb-4">
              <div className="text-2xl font-light text-white/40">{silentCount}</div>
              <div className="text-xs text-white/30">Silences</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher une publication..."
                className="pl-10 bg-white/[0.03] border-white/10 focus:border-cyan-500/50"
              />
            </div>
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 rounded-lg bg-white/[0.03] border border-white/10 text-sm text-white/80 focus:outline-none focus:border-cyan-500/50"
          >
            <option value="ALL" className="bg-[#111113]">Tous les types</option>
            {Object.entries(TYPE_LABELS).map(([key, { label }]) => (
              <option key={key} value={key} className="bg-[#111113]">{label}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as EditorialStatus | "ALL")}
            className="px-4 py-2 rounded-lg bg-white/[0.03] border border-white/10 text-sm text-white/80 focus:outline-none focus:border-cyan-500/50"
          >
            <option value="ALL" className="bg-[#111113]">Tous les statuts</option>
            <option value="PUBLISHED" className="bg-[#111113]">Publiés</option>
            <option value="HELD" className="bg-[#111113]">Retenus</option>
            <option value="SILENT" className="bg-[#111113]">Silences</option>
          </select>

          {/* Sort */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSortBy(sortBy === "date" ? "trust" : sortBy === "trust" ? "views" : "date")}
            className="text-white/50"
          >
            <ArrowUpDown size={14} className="mr-2" />
            {sortBy === "date" ? "Date" : sortBy === "trust" ? "Trust" : "Vues"}
          </Button>
        </div>

        {/* Publications List */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-28 bg-white/[0.02] border border-white/10 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filteredPublications.length === 0 ? (
          <Card variant="default" className="bg-white/[0.02] border-white/10">
            <CardContent className="pt-16 pb-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center mx-auto mb-4">
                <Archive size={32} className="text-emerald-400/50" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Aucune publication</h3>
              <p className="text-white/50 text-sm">
                Les publications sont créées via le Publication Studio.
              </p>
              <Button variant="ai" className="mt-6" onClick={() => router.push("/studio")}>
                Ouvrir le Studio
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredPublications.map(pub => {
              const typeConfig = TYPE_LABELS[pub.type] || { label: pub.type, color: "bg-white/5 text-white/60 border-white/10" };
              const statusConfig = STATUS_CONFIG[pub.status];
              const StatusIcon = statusConfig.icon;

              return (
                <Card 
                  key={pub.id}
                  variant="default"
                  className="group hover:border-cyan-500/30 hover:bg-white/[0.04] transition-all duration-300 bg-white/[0.02] border-white/10 cursor-pointer"
                  onClick={() => router.push(`/publications/${pub.id}`)}
                >
                  <CardContent className="pt-5 pb-5">
                    <div className="flex items-start gap-4">
                      {/* Trust Score */}
                      <div className="flex-shrink-0">
                        <TrustScoreBadge score={pub.trustScore} size="md" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <h3 className="text-base font-medium text-white line-clamp-1 group-hover:text-cyan-400 transition-colors">
                            {pub.title}
                          </h3>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {pub.vertical && (
                              <Badge variant="default" className="text-xs bg-white/5 border-white/10">
                                <Layers size={10} className="mr-1" />
                                {pub.vertical.name}
                              </Badge>
                            )}
                            <Badge variant="default" className={`text-xs ${typeConfig.color}`}>
                              {typeConfig.label}
                            </Badge>
                            <span className={`flex items-center gap-1 text-xs ${statusConfig.color}`}>
                              <StatusIcon size={12} />
                              {statusConfig.label}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-white/40">
                          <span>{pub.wordCount} mots</span>
                          <span>{pub.sourceCount} sources</span>
                          <span className="flex items-center gap-1">
                            <Eye size={12} />
                            {pub.viewCount}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {new Date(pub.createdAt).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "short",
                              year: "numeric"
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Shell>
  );
}
