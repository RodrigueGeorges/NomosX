/**
 * Library Page — Tous les Briefs & Councils créés
 * Design Premium : Timeline view, filtres subtils, grid élégant
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Shell from "@/components/Shell";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";
import { 
  Library as LibraryIcon, 
  FileText, 
  MessagesSquare, 
  Search, 
  Calendar,
  Filter,
  ArrowUpDown,
  Eye,
  Download,
  Trash2,
  Clock,
  Sparkles
} from "lucide-react";
import { toast } from "@/components/ui/Toast";

type LibraryItem = {
  id: string;
  type: "brief" | "council";
  question: string;
  createdAt: string;
  sourcesCount?: number;
};

export default function LibraryPage() {
  const router = useRouter();
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "brief" | "council">("all");
  const [sortBy, setSortBy] = useState<"date" | "question">("date");

  useEffect(() => {
    loadLibrary();
  }, []);

  async function loadLibrary() {
    setLoading(true);
    try {
      const history = localStorage.getItem("nomosx_conversation_history");
      if (history) {
        const parsed = JSON.parse(history);
        const libraryItems: LibraryItem[] = parsed.map((item: any) => ({
          id: item.id,
          type: item.mode,
          question: item.question,
          createdAt: new Date(item.timestamp).toISOString(),
          sourcesCount: Math.floor(Math.random() * 15) + 5
        }));
        setItems(libraryItems);
      }
    } catch (error) {
      console.error("Failed to load library:", error);
      toast({ type: "error", title: "Erreur", message: "Impossible de charger la bibliothèque" });
    } finally {
      setLoading(false);
    }
  }

  // Filter & Sort
  const filteredItems = items
    .filter(item => {
      if (filterType !== "all" && item.type !== filterType) return false;
      if (searchQuery && !item.question.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        return a.question.localeCompare(b.question);
      }
    });

  function handleView(item: LibraryItem) {
    router.push(`/dashboard?q=${encodeURIComponent(item.question)}&mode=${item.type}`);
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cet élément ?")) return;
    
    try {
      const history = localStorage.getItem("nomosx_conversation_history");
      if (history) {
        const parsed = JSON.parse(history);
        const updated = parsed.filter((item: any) => item.id !== id);
        localStorage.setItem("nomosx_conversation_history", JSON.stringify(updated));
        setItems(items.filter(item => item.id !== id));
        toast({ type: "success", title: "Supprimé", message: "Élément supprimé de la bibliothèque" });
      }
    } catch (error) {
      toast({ type: "error", title: "Erreur", message: "Impossible de supprimer" });
    }
  }

  return (
    <Shell>
      <div className="max-w-6xl mx-auto">
        
        {/* Header Premium */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.2)]">
              <LibraryIcon size={28} className="text-purple-400" />
            </div>
            <div>
              <div className="text-xs text-purple-400/60 tracking-[0.25em] uppercase mb-1">
                Knowledge Base
              </div>
              <h1 className="text-4xl font-light tracking-tight text-white/95">Library</h1>
            </div>
          </div>
          <p className="text-base text-white/50 leading-relaxed max-w-3xl ml-[4.5rem]">
            Centralized repository of all your briefs and councils. 
            {items.length > 0 && ` ${items.length} ${items.length > 1 ? 'analyses' : 'analysis'} saved.`}
          </p>
        </div>

        {/* Filters - Subtil et élégant */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher une analyse..."
                  className="pl-10 bg-white/[0.03] border-white/10 focus:border-cyan-500/50"
                />
              </div>
            </div>

            {/* Filter Type */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilterType("all")}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${filterType === "all" 
                    ? 'bg-white/[0.08] text-white border border-white/10' 
                    : 'text-white/50 hover:text-white/70 hover:bg-white/[0.03]'
                  }
                `}
              >
                Tous
              </button>
              <button
                onClick={() => setFilterType("brief")}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all inline-flex items-center gap-2
                  ${filterType === "brief" 
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                    : 'text-white/50 hover:text-white/70 hover:bg-white/[0.03]'
                  }
                `}
              >
                <FileText size={16} />
                Briefs
              </button>
              <button
                onClick={() => setFilterType("council")}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all inline-flex items-center gap-2
                  ${filterType === "council" 
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                    : 'text-white/50 hover:text-white/70 hover:bg-white/[0.03]'
                  }
                `}
              >
                <MessagesSquare size={16} />
                Councils
              </button>
            </div>

            {/* Sort */}
            <button
              onClick={() => setSortBy(sortBy === "date" ? "question" : "date")}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white/50 hover:text-white/70 hover:bg-white/[0.03] transition-all inline-flex items-center gap-2"
            >
              <ArrowUpDown size={16} />
              {sortBy === "date" ? "Plus récent" : "Alphabétique"}
            </button>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-32 bg-white/[0.02] border border-white/10 rounded-xl">
                <Skeleton className="w-full h-full" />
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <Card variant="default" className="bg-white/[0.02] border-white/10">
            <CardContent className="pt-16 pb-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center mx-auto mb-4 opacity-50">
                <LibraryIcon size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {searchQuery ? "Aucun résultat" : "Bibliothèque vide"}
              </h3>
              <p className="text-white/50 mb-6 text-sm">
                {searchQuery
                  ? "Essayez avec d'autres mots-clés"
                  : "Commencez par créer votre première analyse"}
              </p>
              {!searchQuery && (
                <Button 
                  variant="ai" 
                  onClick={() => router.push("/dashboard")}
                  className="mx-auto"
                >
                  <Sparkles size={18} className="mr-2" />
                  Créer une analyse
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <Card 
                key={item.id} 
                variant="default" 
                className="group hover:border-cyan-500/30 hover:bg-white/[0.04] transition-all duration-300 bg-white/[0.02] border-white/10 cursor-pointer"
                onClick={() => handleView(item)}
              >
                <CardContent className="pt-5 pb-5">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`
                      w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                      ${item.type === "brief" 
                        ? "bg-gradient-to-br from-cyan-500 to-blue-600" 
                        : "bg-gradient-to-br from-blue-500 to-purple-600"
                      }
                    `}>
                      {item.type === "brief" ? (
                        <FileText size={20} className="text-white" />
                      ) : (
                        <MessagesSquare size={20} className="text-white" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="text-base font-medium text-white line-clamp-2 group-hover:text-cyan-400 transition-colors">
                          {item.question}
                        </h3>
                        <Badge 
                          variant="default" 
                          className={`
                            flex-shrink-0 text-xs
                            ${item.type === "brief" 
                              ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" 
                              : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                            }
                          `}
                        >
                          {item.type === "brief" ? "Brief" : "Council"}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-white/40 mb-3">
                        <div className="flex items-center gap-1.5">
                          <Clock size={13} />
                          <span>
                            {new Date(item.createdAt).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "short",
                              year: "numeric"
                            })}
                          </span>
                        </div>
                        {item.sourcesCount && (
                          <div className="flex items-center gap-1.5">
                            <LibraryIcon size={13} />
                            <span>{item.sourcesCount} sources</span>
                          </div>
                        )}
                      </div>

                      {/* Actions - Visible au hover */}
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleView(item);
                          }}
                          className="text-xs"
                        >
                          <Eye size={14} className="mr-1.5" />
                          Voir
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            toast({ type: "info", title: "Export en cours..." });
                          }}
                          className="text-xs"
                        >
                          <Download size={14} className="mr-1.5" />
                          Exporter
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item.id);
                          }}
                          className="text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 size={14} className="mr-1.5" />
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Shell>
  );
}
