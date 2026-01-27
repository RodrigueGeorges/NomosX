"use client";

/**
 * NomosX Think Tank - Signals Page
 * 
 * List and filter signals by vertical, status, type
 */

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { 
  Zap, 
  Filter,
  RefreshCw,
  ChevronDown
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { SignalCard } from "@/components/think-tank";
import type { SignalSummary, VerticalRef } from "@/lib/think-tank/ui-types";

const SIGNAL_STATUSES = [
  { value: "", label: "Tous les statuts" },
  { value: "NEW", label: "Nouveau" },
  { value: "HELD", label: "En attente" },
  { value: "PUBLISHED", label: "Publié" },
  { value: "REJECTED", label: "Rejeté" }
];

const SIGNAL_TYPES = [
  { value: "", label: "Tous les types" },
  { value: "NEW_EVIDENCE", label: "Nouvelle évidence" },
  { value: "CONTRADICTION", label: "Contradiction" },
  { value: "TREND_BREAK", label: "Rupture" },
  { value: "DATA_RELEASE", label: "Données" },
  { value: "POLICY_CHANGE", label: "Politique" }
];

export default function SignalsPage() {
  const searchParams = useSearchParams();
  const [signals, setSignals] = useState<SignalSummary[]>([]);
  const [verticals, setVerticals] = useState<VerticalRef[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const [filters, setFilters] = useState({
    verticalId: searchParams.get("verticalId") || "",
    status: searchParams.get("status") || "",
    signalType: searchParams.get("signalType") || ""
  });

  useEffect(() => {
    loadVerticals();
  }, []);

  useEffect(() => {
    loadSignals();
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

  async function loadSignals() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.verticalId) params.set("verticalId", filters.verticalId);
      if (filters.status) params.set("status", filters.status);
      if (filters.signalType) params.set("signalType", filters.signalType);
      params.set("limit", "50");

      const res = await fetch(`/api/think-tank/signals?${params}`);
      if (res.ok) {
        const data = await res.json();
        setSignals(data.signals || []);
        setTotal(data.total || 0);
      }
    } catch (error) {
      console.error("Failed to load signals:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Signaux</h1>
          <p className="text-sm text-white/40 mt-0.5">
            {total} signal{total !== 1 ? "s" : ""} détecté{total !== 1 ? "s" : ""}
          </p>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={loadSignals}
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
              value={filters.status}
              onChange={(v) => setFilters(f => ({ ...f, status: v }))}
              options={SIGNAL_STATUSES}
            />
            <FilterSelect
              value={filters.signalType}
              onChange={(v) => setFilters(f => ({ ...f, signalType: v }))}
              options={SIGNAL_TYPES}
            />
          </div>
        </Card>

        {/* Signals Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {signals.map(signal => (
            <SignalCard key={signal.id} signal={signal} />
          ))}
        </div>

        {signals.length === 0 && !loading && (
          <Card className="p-12 text-center">
            <Zap size={32} className="text-white/20 mx-auto mb-3" />
            <p className="text-white/50">Aucun signal trouvé</p>
            <p className="text-xs text-white/30 mt-1">
              Modifiez les filtres ou attendez la prochaine détection
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
