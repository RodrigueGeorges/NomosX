"use client";

/**
 * NomosX Think Tank Dashboard
 * 
 * Main dashboard for the Institutional Think Tank
 * Shows verticals, pending signals, recent publications, and cadence status
 */

import { useEffect, useState } from "react";
import { 
  Zap, 
  FileText, 
  TrendingUp,
  RefreshCw,
  ChevronRight,
  Layers,
  Activity
} from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { VerticalCard, SignalCard, CadenceIndicator, PublicationCard } from "@/components/think-tank";
import type { 
  VerticalSummary, 
  SignalSummary, 
  PublicationSummary, 
  CadenceData 
} from "@/lib/think-tank/ui-types";

export default function ThinkTankDashboard() {
  const [verticals, setVerticals] = useState<VerticalSummary[]>([]);
  const [signals, setSignals] = useState<SignalSummary[]>([]);
  const [publications, setPublications] = useState<PublicationSummary[]>([]);
  const [cadence, setCadence] = useState<CadenceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    setLoading(true);
    try {
      const [verticalsRes, signalsRes, publicationsRes, cadenceRes] = await Promise.all([
        fetch("/api/think-tank/verticals"),
        fetch("/api/think-tank/signals?status=NEW&limit=5"),
        fetch("/api/think-tank/publications?published=true&limit=5"),
        fetch("/api/think-tank/cadence")
      ]);

      if (verticalsRes.ok) {
        const data = await verticalsRes.json();
        setVerticals(data.verticals || []);
      }

      if (signalsRes.ok) {
        const data = await signalsRes.json();
        setSignals(data.signals || []);
      }

      if (publicationsRes.ok) {
        const data = await publicationsRes.json();
        setPublications(data.publications || []);
      }

      if (cadenceRes.ok) {
        const data = await cadenceRes.json();
        setCadence(data);
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }

  const totalPendingSignals = verticals.reduce((sum, v) => sum + v.pendingSignals, 0);
  const totalPublications = verticals.reduce((sum, v) => sum + v.publishedCount, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Vue d'ensemble</h1>
          <p className="text-sm text-white/40 mt-0.5">
            État actuel du système de publication
          </p>
        </div>
        <div className="flex items-center gap-3">
          {cadence && (
            <CadenceIndicator 
              global={cadence.global} 
              compact 
            />
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={loadDashboardData}
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </Button>
        </div>
      </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard 
            icon={<Layers size={18} />}
            label="Verticales actives"
            value={verticals.length}
            color="#3B82F6"
          />
          <StatCard 
            icon={<Zap size={18} />}
            label="Signaux en attente"
            value={totalPendingSignals}
            color="#F59E0B"
          />
          <StatCard 
            icon={<FileText size={18} />}
            label="Publications totales"
            value={totalPublications}
            color="#10B981"
          />
          <StatCard 
            icon={<TrendingUp size={18} />}
            label="Cadence jour"
            value={`${cadence?.global.daily.current || 0}/${cadence?.global.daily.max || 3}`}
            color="#22D3EE"
          />
        </div>

        {/* Verticals Grid */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Verticales</h2>
            <Link href="/think-tank/verticals" className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
              Voir tout <ChevronRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {verticals.map(vertical => (
              <VerticalCard key={vertical.id} vertical={vertical} />
            ))}
            {verticals.length === 0 && !loading && (
              <Card className="col-span-full p-8 text-center">
                <p className="text-white/50">Aucune verticale configurée</p>
                <p className="text-xs text-white/30 mt-1">
                  Exécutez la migration pour initialiser les verticales
                </p>
              </Card>
            )}
          </div>
        </section>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Signals */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Zap size={18} className="text-amber-400" />
                Signaux en attente
                {totalPendingSignals > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400">
                    {totalPendingSignals}
                  </span>
                )}
              </h2>
              <Link href="/think-tank/signals" className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                Voir tout <ChevronRight size={14} />
              </Link>
            </div>
            <div className="space-y-3">
              {signals.map(signal => (
                <SignalCard key={signal.id} signal={signal} compact />
              ))}
              {signals.length === 0 && !loading && (
                <Card className="p-6 text-center">
                  <Zap size={24} className="text-white/20 mx-auto mb-2" />
                  <p className="text-white/50">Aucun signal en attente</p>
                </Card>
              )}
            </div>
          </section>

          {/* Recent Publications */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <FileText size={18} className="text-emerald-400" />
                Publications récentes
              </h2>
              <Link href="/think-tank/publications" className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                Voir tout <ChevronRight size={14} />
              </Link>
            </div>
            <div className="space-y-3">
              {publications.map(pub => (
                <PublicationCard key={pub.id} publication={pub} compact />
              ))}
              {publications.length === 0 && !loading && (
                <Card className="p-6 text-center">
                  <FileText size={24} className="text-white/20 mx-auto mb-2" />
                  <p className="text-white/50">Aucune publication</p>
                </Card>
              )}
            </div>
          </section>
        </div>

        {/* Cadence Details */}
        {cadence && (
          <section>
            <h2 className="text-lg font-semibold text-white mb-4">Cadence de publication</h2>
            <div className="max-w-md">
              <CadenceIndicator 
                global={cadence.global}
                nextPublishWindow={cadence.nextPublishWindow}
                isQuietHours={cadence.isQuietHours}
              />
            </div>
          </section>
        )}
    </div>
  );
}

function StatCard({ 
  icon, 
  label, 
  value, 
  color 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string | number; 
  color: string;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}
        >
          <span style={{ color }}>{icon}</span>
        </div>
        <div>
          <p className="text-xs text-white/50">{label}</p>
          <p className="text-xl font-bold text-white">{value}</p>
        </div>
      </div>
    </Card>
  );
}
