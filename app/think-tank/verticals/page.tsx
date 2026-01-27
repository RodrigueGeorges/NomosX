"use client";

/**
 * NomosX Think Tank - Verticals Page
 * 
 * List all verticals with their status and configuration
 */

import { useEffect, useState } from "react";
import { 
  Layers,
  RefreshCw,
  Settings
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { VerticalCard } from "@/components/think-tank";
import type { VerticalSummary } from "@/lib/think-tank/ui-types";

export default function VerticalsPage() {
  const [verticals, setVerticals] = useState<VerticalSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVerticals();
  }, []);

  async function loadVerticals() {
    setLoading(true);
    try {
      const res = await fetch("/api/think-tank/verticals");
      if (res.ok) {
        const data = await res.json();
        setVerticals(data.verticals || []);
      }
    } catch (error) {
      console.error("Failed to load verticals:", error);
    } finally {
      setLoading(false);
    }
  }

  const totalSignals = verticals.reduce((sum, v) => sum + v.pendingSignals, 0);
  const totalPublications = verticals.reduce((sum, v) => sum + v.publishedCount, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Verticales</h1>
          <p className="text-sm text-white/40 mt-0.5">
            {verticals.length} domaine{verticals.length !== 1 ? "s" : ""} thématique{verticals.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={loadVerticals}
          disabled={loading}
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Layers size={18} className="text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-white/40">Verticales</p>
              <p className="text-xl font-bold text-white">{verticals.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Settings size={18} className="text-amber-400" />
            </div>
            <div>
              <p className="text-xs text-white/40">Signaux en attente</p>
              <p className="text-xl font-bold text-white">{totalSignals}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Layers size={18} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-white/40">Publications</p>
              <p className="text-xl font-bold text-white">{totalPublications}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Verticals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {verticals.map(vertical => (
          <VerticalCard key={vertical.id} vertical={vertical} />
        ))}
      </div>

      {verticals.length === 0 && !loading && (
        <Card className="p-12 text-center">
          <Layers size={32} className="text-white/20 mx-auto mb-3" />
          <p className="text-white/50">Aucune verticale configurée</p>
          <p className="text-xs text-white/30 mt-1">
            Exécutez le script de seed pour initialiser les verticales
          </p>
        </Card>
      )}
    </div>
  );
}
