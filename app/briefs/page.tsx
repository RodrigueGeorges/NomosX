"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Shell from "@/components/Shell";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";
import { Library, Search, Filter, Calendar, FileText, ArrowUpDown, ExternalLink, TrendingUp, MessagesSquare, RefreshCw } from "lucide-react";

type Brief = {
  id: string;
  publicId: string | null;
  question: string;
  kind: string;
  createdAt: string;
  sources: string[];
};

export default function BriefsPage() {
  const router = useRouter();
  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [kindFilter, setKindFilter] = useState<string | null>(null);
  const [sortMode, setSortMode] = useState<"recent" | "sources">("recent");

  // Actions handlers
  function handleApprofondir(question: string) {
    // Redirige vers homepage avec question pré-remplie + mode "approfondi"
    router.push(`/?q=${encodeURIComponent(question)}&mode=deep`);
  }

  function handleDebattre(question: string) {
    // Lance Council avec la même question
    router.push(`/council?q=${encodeURIComponent(question)}`);
  }

  function handleActualiser(question: string) {
    // Re-génère Brief avec filtre sources récentes
    router.push(`/brief?q=${encodeURIComponent(question)}&filter=2024`);
  }

  function handleOuvrir(briefId: string, publicId: string | null) {
    // Ouvre le brief
    router.push(`/s/${publicId || briefId}`);
  }

  useEffect(() => {
    async function loadBriefs() {
      setLoading(true);
      try {
        const res = await fetch("/api/briefs?limit=50");
        const data = await res.json();
        setBriefs(data.briefs || []);
      } catch (error) {
        console.error("Failed to load briefs:", error);
      } finally {
        setLoading(false);
      }
    }

    loadBriefs();
  }, []);

  // Filter and sort
  const filteredAndSorted = briefs
    .filter((b) => {
      // Search filter
      if (searchQuery && !b.question.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      // Kind filter
      if (kindFilter && b.kind !== kindFilter) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortMode === "sources") {
        return b.sources.length - a.sources.length;
      }
      // recent (default)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  // Extract unique kinds
  const kinds = Array.from(new Set(briefs.map((b) => b.kind)));

  return (
    <Shell>
      {/* Hero Premium avec glow effect */}
      <div className="mb-20">
        <div className="flex items-center justify-between flex-wrap gap-6">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-accent/40 via-indigo-500/40 to-accent/40 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <div className="relative p-3 rounded-2xl bg-accent/10 border border-accent/20 transition-transform group-hover:scale-105">
                  <Library size={32} className="text-accent" strokeWidth={1.5} />
                </div>
              </div>
              <h1 className="text-7xl font-bold tracking-tight">Bibliothèque</h1>
            </div>
            <p className="text-xl text-muted leading-relaxed max-w-3xl mb-4">
              Tous vos research briefs avec recherche, filtres et tri avancés
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {briefs.length > 0 && (
              <Badge variant="ai" className="px-3 py-1">
                <FileText size={14} className="mr-1" strokeWidth={1.5} />
                {filteredAndSorted.length} brief{filteredAndSorted.length > 1 ? "s" : ""}
              </Badge>
            )}
            <Badge variant="default" className="px-3 py-1">
              <Search size={14} className="mr-1" strokeWidth={1.5} />
              Recherche
            </Badge>
            <Badge variant="default" className="px-3 py-1">
              <Filter size={14} className="mr-1" strokeWidth={1.5} />
              Filtres
            </Badge>
          </div>
        </div>
      </div>

      {/* Search bar */}
      {briefs.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Search size={16} className="text-muted" />
            <span className="text-sm text-muted">Rechercher dans les briefs</span>
          </div>
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par question ou mot-clé..."
          />
        </div>
      )}

      {/* Filters and sort */}
      {briefs.length > 0 && (
        <div className="mb-6 space-y-4">
          {/* Sort */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ArrowUpDown size={16} className="text-muted" />
              <span className="text-sm text-muted">Trier par</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSortMode("recent")}
                className={`px-4 py-2 rounded-2xl border transition-all inline-flex items-center gap-2 ${
                  sortMode === "recent"
                    ? "border-accent/40 text-accent bg-accent/10"
                    : "border-border text-muted bg-panel hover:bg-panel2"
                }`}
              >
                <Calendar size={14} />
                Plus récents
              </button>
              <button
                onClick={() => setSortMode("sources")}
                className={`px-4 py-2 rounded-2xl border transition-all inline-flex items-center gap-2 ${
                  sortMode === "sources"
                    ? "border-accent/40 text-accent bg-accent/10"
                    : "border-border text-muted bg-panel hover:bg-panel2"
                }`}
              >
                <FileText size={14} />
                Plus de sources
              </button>
            </div>
          </div>

          {/* Kind filter */}
          {kinds.length > 1 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Filter size={16} className="text-muted" />
                <span className="text-sm text-muted">Filtrer par type</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setKindFilter(null)}
                  className={`px-4 py-2 rounded-2xl border transition-all ${
                    !kindFilter
                      ? "border-accent/40 text-accent bg-accent/10"
                      : "border-border text-muted bg-panel hover:bg-panel2"
                  }`}
                >
                  Tous ({briefs.length})
                </button>
                {kinds.map((kind) => (
                  <button
                    key={kind}
                    onClick={() => setKindFilter(kind)}
                    className={`px-4 py-2 rounded-2xl border transition-all ${
                      kindFilter === kind
                        ? "border-accent/40 text-accent bg-accent/10"
                        : "border-border text-muted bg-panel hover:bg-panel2"
                    }`}
                  >
                    {kind} ({briefs.filter((b) => b.kind === kind).length})
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-center justify-between mb-3">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Briefs grid */}
      {!loading && filteredAndSorted.length > 0 && (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredAndSorted.map((b, index) => (
            <Card
              key={b.id}
              hoverable
              variant={b.kind === "FULL_PIPELINE" ? "premium" : "default"}
              className="animate-spring-in"
              style={{ animationDelay: `${index * 40}ms` }}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant={b.kind === "FULL_PIPELINE" ? "premium" : "ai"}>
                    {b.kind}
                  </Badge>
                  <Badge variant="default">
                    {new Date(b.createdAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </Badge>
                </div>
                <h3 className="mt-3 font-semibold leading-snug line-clamp-2">
                  {b.question}
                </h3>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-4">
                  <FileText size={14} className="text-muted" />
                  <p className="text-sm text-muted">
                    {b.sources.length} source{b.sources.length > 1 ? "s" : ""}
                  </p>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleOuvrir(b.id, b.publicId)}
                    className="w-full"
                  >
                    <ExternalLink size={16} />
                    Ouvrir
                  </Button>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleApprofondir(b.question)}
                      title="Générer avec plus de sources"
                    >
                      <TrendingUp size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDebattre(b.question)}
                      title="Lancer débat multi-perspectives"
                    >
                      <MessagesSquare size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleActualiser(b.question)}
                      title="Actualiser avec sources récentes"
                    >
                      <RefreshCw size={14} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty state (filtered) */}
      {!loading && filteredAndSorted.length === 0 && briefs.length > 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Search size={48} className="mx-auto mb-4 text-muted opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Aucun résultat</h3>
            <p className="text-sm text-muted">
              Aucun brief ne correspond à vos critères de recherche.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setKindFilter(null);
              }}
              className="mt-4 px-4 py-2 rounded-2xl border border-border text-sm hover:bg-panel2 transition-all"
            >
              Réinitialiser les filtres
            </button>
          </CardContent>
        </Card>
      )}

      {/* Empty state (no briefs) */}
      {!loading && briefs.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Library size={48} className="mx-auto mb-4 text-muted opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Aucun brief disponible</h3>
            <p className="text-sm text-muted">
              Créez votre premier brief pour commencer à construire votre bibliothèque.
            </p>
            <button
              onClick={() => (window.location.href = "/brief")}
              className="mt-4 px-6 py-3 rounded-2xl bg-accent text-white font-medium hover:bg-accent/90 transition-all"
            >
              Créer un brief
            </button>
          </CardContent>
        </Card>
      )}
    </Shell>
  );
}
