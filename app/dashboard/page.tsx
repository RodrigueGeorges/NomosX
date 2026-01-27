"use client";

/**
 * NomosX Control Center
 * 
 * Think Tank Command Dashboard
 * Shows: active verticals, pending signals, recent publications, held/silent decisions
 */

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Shell from "@/components/Shell";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import TrustScoreBadge from "@/components/TrustScoreBadge";
import { 
  LayoutDashboard,
  Zap,
  FileText,
  Archive,
  Layers,
  Clock,
  CheckCircle,
  Pause,
  VolumeX,
  ArrowRight,
  RefreshCw,
  TrendingUp,
  PenTool,
  AlertCircle
} from "lucide-react";

type Vertical = {
  id: string;
  name: string;
  slug: string;
  color?: string;
  pendingSignals: number;
  publishedCount: number;
};

type Signal = {
  id: string;
  title: string;
  signalType: string;
  vertical?: { name: string };
  scores: { priority: number };
  status: string;
  detectedAt: string;
};

type Publication = {
  id: string;
  title: string;
  type: string;
  vertical?: { name: string };
  trustScore: number;
  status: string;
  createdAt: string;
};

type EditorialDecision = {
  id: string;
  decision: string;
  reason?: string;
  signal?: { title: string };
  publication?: { title: string };
  decidedAt: string;
};

type CadenceData = {
  global: {
    daily: { current: number; max: number };
    weekly: { current: number; max: number };
  };
};

export default function ControlCenterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [verticals, setVerticals] = useState<Vertical[]>([]);
  const [pendingSignals, setPendingSignals] = useState<Signal[]>([]);
  const [recentPublications, setRecentPublications] = useState<Publication[]>([]);
  const [recentDecisions, setRecentDecisions] = useState<EditorialDecision[]>([]);
  const [cadence, setCadence] = useState<CadenceData | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    setLoading(true);
    try {
      const [verticalsRes, signalsRes, publicationsRes, cadenceRes] = await Promise.all([
        fetch("/api/think-tank/verticals"),
        fetch("/api/think-tank/signals?status=NEW&limit=5"),
        fetch("/api/think-tank/publications?limit=5"),
        fetch("/api/think-tank/cadence"),
      ]);

      if (verticalsRes.ok) {
        const data = await verticalsRes.json();
        setVerticals(data.verticals || []);
      }
      if (signalsRes.ok) {
        const data = await signalsRes.json();
        setPendingSignals(data.signals || []);
      }
      if (publicationsRes.ok) {
        const data = await publicationsRes.json();
        setRecentPublications(data.publications || []);
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
    <Shell>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border border-cyan-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(0,212,255,0.2)]">
              <LayoutDashboard size={28} className="text-cyan-400" />
            </div>
            <div>
              <div className="text-xs text-cyan-400/60 tracking-[0.25em] uppercase mb-1">
                Think Tank
              </div>
              <h1 className="text-4xl font-light tracking-tight text-white/95">Control Center</h1>
            </div>
          </div>
          <p className="text-base text-white/50 leading-relaxed max-w-3xl ml-[4.5rem]">
            NomosX is an institution that decides when to speak. Monitor signals, publications, and editorial decisions.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3 mb-8">
          <Button variant="ai" onClick={() => router.push("/studio")}>
            <PenTool size={18} className="mr-2" />
            Publication Studio
          </Button>
          <Button variant="ghost" onClick={() => router.push("/signals")}>
            <Zap size={18} className="mr-2" />
            Signals ({totalPendingSignals})
          </Button>
          <Button variant="ghost" onClick={() => router.push("/publications")}>
            <Archive size={18} className="mr-2" />
            Publications ({totalPublications})
          </Button>
          <div className="flex-1" />
          <Button variant="ghost" size="sm" onClick={loadDashboardData} disabled={loading}>
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card variant="default" className="bg-white/[0.02] border-white/10">
            <CardContent className="pt-5 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <Layers size={18} className="text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-light text-white">{verticals.length}</div>
                  <div className="text-xs text-white/40">Verticales</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="default" className="bg-amber-500/5 border-amber-500/20">
            <CardContent className="pt-5 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <Zap size={18} className="text-amber-400" />
                </div>
                <div>
                  <div className="text-2xl font-light text-amber-400">{totalPendingSignals}</div>
                  <div className="text-xs text-amber-400/60">Signaux en attente</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="default" className="bg-emerald-500/5 border-emerald-500/20">
            <CardContent className="pt-5 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <CheckCircle size={18} className="text-emerald-400" />
                </div>
                <div>
                  <div className="text-2xl font-light text-emerald-400">{totalPublications}</div>
                  <div className="text-xs text-emerald-400/60">Publications</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="default" className="bg-white/[0.02] border-white/10">
            <CardContent className="pt-5 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <TrendingUp size={18} className="text-cyan-400" />
                </div>
                <div>
                  <div className="text-2xl font-light text-white">
                    {cadence?.global.daily.current || 0}/{cadence?.global.daily.max || 3}
                  </div>
                  <div className="text-xs text-white/40">Cadence jour</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Pending Signals */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Zap size={18} className="text-amber-400" />
                Signaux en attente
              </h2>
              <Link href="/signals" className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                Voir tout <ArrowRight size={14} />
              </Link>
            </div>
            
            {pendingSignals.length === 0 ? (
              <Card variant="default" className="bg-white/[0.02] border-white/10">
                <CardContent className="pt-8 pb-8 text-center">
                  <Zap size={24} className="text-white/20 mx-auto mb-2" />
                  <p className="text-white/50 text-sm">Aucun signal en attente</p>
                  <p className="text-white/30 text-xs mt-1">Le système surveille automatiquement</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {pendingSignals.map(signal => (
                  <Card 
                    key={signal.id}
                    variant="default"
                    className="bg-white/[0.02] border-white/10 hover:border-amber-500/30 cursor-pointer transition-all"
                    onClick={() => router.push(`/studio?signalId=${signal.id}`)}
                  >
                    <CardContent className="pt-4 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                          <span className="text-sm font-bold text-amber-400">{signal.scores.priority}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">{signal.title}</p>
                          <div className="flex items-center gap-2 text-xs text-white/40">
                            {signal.vertical && <span>{signal.vertical.name}</span>}
                            <span>•</span>
                            <span>{new Date(signal.detectedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}</span>
                          </div>
                        </div>
                        <ArrowRight size={14} className="text-white/20" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>

          {/* Recent Publications */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Archive size={18} className="text-emerald-400" />
                Publications récentes
              </h2>
              <Link href="/publications" className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                Voir tout <ArrowRight size={14} />
              </Link>
            </div>
            
            {recentPublications.length === 0 ? (
              <Card variant="default" className="bg-white/[0.02] border-white/10">
                <CardContent className="pt-8 pb-8 text-center">
                  <Archive size={24} className="text-white/20 mx-auto mb-2" />
                  <p className="text-white/50 text-sm">Aucune publication</p>
                  <Button variant="ghost" size="sm" className="mt-3" onClick={() => router.push("/studio")}>
                    Créer une publication
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {recentPublications.map(pub => (
                  <Card 
                    key={pub.id}
                    variant="default"
                    className="bg-white/[0.02] border-white/10 hover:border-emerald-500/30 cursor-pointer transition-all"
                    onClick={() => router.push(`/publications/${pub.id}`)}
                  >
                    <CardContent className="pt-4 pb-4">
                      <div className="flex items-center gap-3">
                        <TrustScoreBadge score={pub.trustScore} size="sm" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">{pub.title}</p>
                          <div className="flex items-center gap-2 text-xs text-white/40">
                            {pub.vertical && <span>{pub.vertical.name}</span>}
                            <span>•</span>
                            <span>{pub.type.replace("_", " ")}</span>
                          </div>
                        </div>
                        {pub.status === "PUBLISHED" && <CheckCircle size={14} className="text-emerald-400" />}
                        {pub.status === "HELD" && <Pause size={14} className="text-amber-400" />}
                        {pub.status === "SILENT" && <VolumeX size={14} className="text-white/30" />}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Verticals Overview */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Layers size={18} className="text-blue-400" />
              Verticales actives
            </h2>
          </div>
          
          {verticals.length === 0 ? (
            <Card variant="default" className="bg-white/[0.02] border-white/10">
              <CardContent className="pt-8 pb-8 text-center">
                <Layers size={24} className="text-white/20 mx-auto mb-2" />
                <p className="text-white/50 text-sm">Aucune verticale configurée</p>
                <p className="text-white/30 text-xs mt-1">Exécutez le seed pour initialiser</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {verticals.map(vertical => (
                <Card 
                  key={vertical.id}
                  variant="default"
                  className="bg-white/[0.02] border-white/10 hover:border-blue-500/30 cursor-pointer transition-all"
                >
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-white">{vertical.name}</span>
                      {vertical.pendingSignals > 0 && (
                        <Badge variant="warning" className="text-xs">
                          {vertical.pendingSignals}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-white/40">
                      <span>{vertical.publishedCount} pub.</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Cadence Status */}
        {cadence && (
          <section className="mt-8">
            <Card variant="default" className="bg-white/[0.02] border-white/10">
              <CardContent className="pt-5 pb-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Clock size={18} className="text-white/40" />
                    <div>
                      <p className="text-sm text-white">Cadence de publication</p>
                      <p className="text-xs text-white/40">Silence is a success state</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-lg font-light text-white">
                        {cadence.global.daily.current}/{cadence.global.daily.max}
                      </div>
                      <div className="text-xs text-white/40">Aujourd'hui</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-light text-white">
                        {cadence.global.weekly.current}/{cadence.global.weekly.max}
                      </div>
                      <div className="text-xs text-white/40">Cette semaine</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        )}
      </div>
    </Shell>
  );
}
