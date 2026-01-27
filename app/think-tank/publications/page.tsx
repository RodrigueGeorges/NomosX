"use client";

/**
 * NomosX Think Tank - Publications Page
 * 
 * List and filter publications by vertical, type, status
 */

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { 
  FileText, 
  Filter,
  RefreshCw,
  ChevronDown
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { PublicationCard } from "@/components/think-tank";
import type { PublicationSummary, VerticalRef } from "@/lib/think-tank/ui-types";

const PUBLICATION_TYPES = [
  { value: "", label: "Tous les types" },
  { value: "RESEARCH_BRIEF", label: "Research Brief" },
  { value: "UPDATE_NOTE", label: "Update Note" },
  { value: "DATA_NOTE", label: "Data Note" },
  { value: "POLICY_NOTE", label: "Policy Note" },
  { value: "DOSSIER", label: "Dossier" }
];

const PUBLICATION_STATUS = [
  { value: "", label: "Tous" },
  { value: "true", label: "Publiés" },
  { value: "false", label: "Brouillons" }
];

export default function PublicationsPage() {
  const searchParams = useSearchParams();
  const [publications, setPublications] = useState<PublicationSummary[]>([]);
  const [verticals, setVerticals] = useState<VerticalRef[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const [filters, setFilters] = useState({
    verticalId: searchParams.get("verticalId") || "",
    type: searchParams.get("type") || "",
    published: searchParams.get("published") || ""
  });

  useEffect(() => {
    loadVerticals();
  }, []);

  useEffect(() => {
    loadPublications();
  }, [filters]);

  async function loadVerticals() {
    try {
      const res = await fetch("/api/think-tank/verticals");
      if (res.ok) {
        const data = await res.json();
        setVerticals(data.verticals || []);
      }
    } catch (error) {
      console.error("Failed to load verticals:", error);
    }
  }

  async function loadPublications() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.verticalId) params.set("verticalId", filters.verticalId);
      if (filters.type) params.set("type", filters.type);
      if (filters.published) params.set("published", filters.published);
      params.set("limit", "50");

      const res = await fetch(`/api/think-tank/publications?${params}`);
      if (res.ok) {
        const data = await res.json();
        setPublications(data.publications || []);
        setTotal(data.total || 0);
      }
    } catch (error) {
      console.error("Failed to load publications:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Publications</h1>
          <p className="text-sm text-white/40 mt-0.5">
            {total} publication{total !== 1 ? "s" : ""}
          </p>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={loadPublications}
          disabled={loading}
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </Button>
      </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Filter size={16} className="text-white/40" />
            <span className="text-sm font-medium text-white/60">Filtres</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <FilterSelect
              value={filters.verticalId}
              onChange={(v) => setFilters(f => ({ ...f, verticalId: v }))}
              options={[
                { value: "", label: "Toutes les verticales" },
                ...verticals.map(v => ({ value: v.id, label: `${v.icon || ""} ${v.name}` }))
              ]}
            />
            <FilterSelect
              value={filters.type}
              onChange={(v) => setFilters(f => ({ ...f, type: v }))}
              options={PUBLICATION_TYPES}
            />
            <FilterSelect
              value={filters.published}
              onChange={(v) => setFilters(f => ({ ...f, published: v }))}
              options={PUBLICATION_STATUS}
            />
          </div>
        </Card>

        {/* Publications Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {publications.map(pub => (
            <PublicationCard key={pub.id} publication={pub} />
          ))}
        </div>

        {publications.length === 0 && !loading && (
          <Card className="p-12 text-center">
            <FileText size={32} className="text-white/20 mx-auto mb-3" />
            <p className="text-white/50">Aucune publication trouvée</p>
            <p className="text-xs text-white/30 mt-1">
              Modifiez les filtres ou générez une nouvelle publication
            </p>
          </Card>
        )}
    </div>
  );
}

function FilterSelect({ 
  value, 
  onChange, 
  options 
}: { 
  value: string; 
  onChange: (v: string) => void; 
  options: { value: string; label: string }[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2 pr-8 text-sm text-white/80 focus:outline-none focus:border-cyan-500/50 transition-colors"
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value} className="bg-[#111113]">
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
    </div>
  );
}
