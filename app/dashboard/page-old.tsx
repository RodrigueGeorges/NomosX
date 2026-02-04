"use client";
const React = require('react');
const {useState,useEffect} = require('react');

/**
 * NomosX Think Tank Command Center
 * 
 * Institutional dashboard showing:
 * - System status
 * - Core metrics (verticals, cadence, signals, trial/plan)
 * - Signals queue
 * - Publications snapshot
 * - Cadence & limits
 */

const {useRouter} = require('next/navigation');
const Link = require('next/link');
const Shell = require('@/components/Shell');
const {Button} = require('@/components/ui/Button');
const {Badge} = require('@/components/ui/Badge');
const {Card,CardContent} = require('@/components/ui/Card');
const TrustScoreBadge = require('@/components/TrustScoreBadge');
const TrialBanner = require('@/components/TrialBanner');
const {LayoutDashboard,Zap,FileText,Archive,Layers,Clock,CheckCircle,Pause,VolumeX,ArrowRight,RefreshCw,TrendingUp,PenTool,AlertCircle,Shield,Activity} = require('lucide-react');

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
  scores: { priority: number; novelty?: number; impact?: number };
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

type CadenceData = {
  global: {
    daily: { current: number; max: number };
    weekly: { current: number; max: number };
  };
};

type SubscriptionStatus = {
  plan: string;
  status: string;
  isTrialActive: boolean;
  trialDaysRemaining: number;
  isTrialExpired: boolean;
  weeklyPublicationCount: number;
  weeklyPublicationMax: number;
  weeklyLimitReached: boolean;
  activeVerticals: number;
  activeVerticalsMax: number;
  verticalsLimitReached: boolean;
  canExportPdf: boolean;
  canAccessStudio: boolean;
};

export default function ThinkTankCommandCenter() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [verticals, setVerticals] = useState<Vertical[]>([]);
  const [pendingSignals, setPendingSignals] = useState<Signal[]>([]);
  const [recentPublications, setRecentPublications] = useState<Publication[]>([]);
  const [cadence, setCadence] = useState<CadenceData | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    setLoading(true);
    try {
      const [verticalsRes, signalsRes, publicationsRes, cadenceRes, subRes] = await Promise.all([
        fetch("/api/think-tank/verticals"),
        fetch("/api/think-tank/signals?status=NEW&limit=8"),
        fetch("/api/think-tank/publications?limit=6"),
        fetch("/api/think-tank/cadence"),
        fetch("/api/subscription/status"),
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
      if (subRes.ok) {
        const data = await subRes.json();
        setSubscription(data);
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }

  const totalPendingSignals = pendingSignals.length;
  const heldSignals = pendingSignals.filter(s => s.status === "HELD").length;

  // System status
  const systemStatus = totalPendingSignals > 0 ? "Monitoring" : "Silent";
  const statusColor = totalPendingSignals > 0 ? "text-cyan-400" : "text-white/40";

  return (
    <Shell>
      <div className="max-w-7xl mx-auto">
        {/* Header - System Status */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border border-cyan-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(0,212,255,0.15)]">
                <Activity size={32} className="text-cyan-400" />
              </div>
              <div>
                <div className="text-xs text-cyan-400/60 tracking-[0.25em] uppercase mb-1">
                  Think Tank
                </div>
                <h1 className="text-4xl font-light tracking-tight text-white/95">Command Center</h1>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-xs text-white/40 uppercase tracking-wider mb-1">System Status</div>
              <div className={`text-2xl font-light ${statusColor}`}>{systemStatus}</div>
              <div className="text-xs text-white/30 mt-1">Silence is a success state</div>
            </div>
          </div>
        </div>

        {/* Trial Banner */}
        {subscription?.isTrialActive && subscription.trialDaysRemaining > 0 && (
          <TrialBanner daysRemaining={subscription.trialDaysRemaining} />
        )}

        {/* Core Metrics - 4 Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {/* Card 1 - Verticals */}
          <Card variant="default" className="bg-white/[0.02] border-white/10 hover:border-blue-500/30 transition-all">
            <CardContent className="pt-5 pb-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <Layers size={18} className="text-blue-400" />
                </div>
                <div className="flex-1">
                  <div className="text-2xl font-light text-white">
                    {subscription?.activeVerticals || 1} / {subscription?.activeVerticalsMax || 1}
                  </div>
                  <div className="text-xs text-white/40">Verticals</div>
                </div>
              </div>
              <div className="text-xs text-white/30">Primary research focus</div>
              {subscription?.verticalsLimitReached && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full mt-3 text-xs text-cyan-400 hover:text-cyan-300"
                  onClick={() => router.push("/pricing")}
                >
                  Unlock more verticals →
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Card 2 - Editorial Cadence */}
          <Card variant="default" className="bg-white/[0.02] border-white/10">
            <CardContent className="pt-5 pb-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Clock size={18} className="text-emerald-400" />
                </div>
                <div className="flex-1">
                  <div className="text-2xl font-light text-white">
                    {subscription?.weeklyPublicationCount || 0} / {subscription?.weeklyPublicationMax || 3}
                  </div>
                  <div className="text-xs text-white/40">This week</div>
                </div>
              </div>
              <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all"
                  style={{ 
                    width: `${Math.min(100, ((subscription?.weeklyPublicationCount || 0) / (subscription?.weeklyPublicationMax || 3)) * 100)}%` 
                  }}
                />
              </div>
              <div className="text-xs text-white/30 mt-2">Editorial discipline enforced</div>
            </CardContent>
          </Card>

          {/* Card 3 - Signals */}
          <Card variant="default" className="bg-amber-500/5 border-amber-500/20">
            <CardContent className="pt-5 pb-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <Zap size={18} className="text-amber-400" />
                </div>
                <div className="flex-1">
                  <div className="text-2xl font-light text-amber-400">{totalPendingSignals}</div>
                  <div className="text-xs text-amber-400/60">Pending</div>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/30">Held: {heldSignals}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full mt-3 text-xs text-amber-400 hover:text-amber-300"
                onClick={() => router.push("/signals")}
              >
                Review signals →
              </Button>
            </CardContent>
          </Card>

          {/* Card 4 - Trial / Plan */}
          <Card variant="default" className={subscription?.isTrialActive ? "bg-cyan-500/5 border-cyan-500/20" : "bg-white/[0.02] border-white/10"}>
            <CardContent className="pt-5 pb-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <Shield size={18} className="text-cyan-400" />
                </div>
                <div className="flex-1">
                  {subscription?.isTrialActive ? (
                    <>
                      <div className="text-2xl font-light text-cyan-400">
                        Day {15 - (subscription?.trialDaysRemaining || 0)} of 15
                      </div>
                      <div className="text-xs text-cyan-400/60">Trial</div>
                    </>
                  ) : (
                    <>
                      <div className="text-lg font-light text-white">NomosX Access</div>
                      <div className="text-xs text-white/40">Active</div>
                    </>
                  )}
                </div>
              </div>
              {subscription?.isTrialActive ? (
                <Button 
                  variant="ai" 
                  size="sm" 
                  className="w-full mt-3 text-xs"
                  onClick={() => router.push("/pricing")}
                >
                  Continue with NomosX Access
                </Button>
              ) : (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full mt-3 text-xs text-white/40 hover:text-white/60"
                  onClick={() => router.push("/pricing")}
                >
                  Manage subscription
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Signals Queue */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Zap size={18} className="text-amber-400" />
                Signals Queue
              </h2>
              <Link href="/signals" className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                View all <ArrowRight size={14} />
              </Link>
            </div>
            
            {pendingSignals.length === 0 ? (
              <Card variant="default" className="bg-white/[0.02] border-white/10">
                <CardContent className="pt-10 pb-10 text-center">
                  <Zap size={28} className="text-white/20 mx-auto mb-3" />
                  <p className="text-white/50 text-sm font-medium">No pending signals</p>
                  <p className="text-white/30 text-xs mt-1">System is monitoring autonomously</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {pendingSignals.map(signal => (
                  <Card 
                    key={signal.id}
                    variant="default"
                    className="bg-white/[0.02] border-white/10 hover:border-amber-500/30 cursor-pointer transition-all group"
                    onClick={() => router.push(`/studio?signalId=${signal.id}`)}
                  >
                    <CardContent className="pt-3 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-amber-400">{signal.scores.priority}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate group-hover:text-cyan-400 transition-colors">{signal.title}</p>
                          <div className="flex items-center gap-2 text-xs text-white/40 mt-0.5">
                            {signal.vertical && <span>{signal.vertical.name}</span>}
                            <span>•</span>
                            <Badge variant={signal.status === "NEW" ? "warning" : "default"} className="text-xs px-1.5 py-0">
                              {signal.status}
                            </Badge>
                            {signal.scores.novelty && (
                              <>
                                <span>•</span>
                                <span>Novelty {signal.scores.novelty}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <ArrowRight size={14} className="text-white/20 group-hover:text-cyan-400 transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>

          {/* Publications Snapshot */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Archive size={18} className="text-emerald-400" />
                Publications Snapshot
              </h2>
              <Link href="/publications" className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                View all <ArrowRight size={14} />
              </Link>
            </div>
            
            {recentPublications.length === 0 ? (
              <Card variant="default" className="bg-white/[0.02] border-white/10">
                <CardContent className="pt-10 pb-10 text-center">
                  <Archive size={28} className="text-white/20 mx-auto mb-3" />
                  <p className="text-white/50 text-sm font-medium">No publications yet</p>
                  <p className="text-white/30 text-xs mt-1">The think tank decides when to publish</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {recentPublications.map(pub => (
                  <Card 
                    key={pub.id}
                    variant="default"
                    className="bg-white/[0.02] border-white/10 hover:border-emerald-500/30 cursor-pointer transition-all group"
                    onClick={() => router.push(`/publications/${pub.id}`)}
                  >
                    <CardContent className="pt-3 pb-3">
                      <div className="flex items-center gap-3">
                        <TrustScoreBadge score={pub.trustScore} size="sm" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate group-hover:text-cyan-400 transition-colors">{pub.title}</p>
                          <div className="flex items-center gap-2 text-xs text-white/40 mt-0.5">
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

        {/* Cadence & Limits */}
        {subscription && (
          <section className="mb-8">
            <Card variant="default" className={subscription.weeklyLimitReached ? "bg-amber-500/5 border-amber-500/20" : "bg-white/[0.02] border-white/10"}>
              <CardContent className="pt-6 pb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Clock size={20} className={subscription.weeklyLimitReached ? "text-amber-400" : "text-white/40"} />
                    <div>
                      <p className="text-sm font-medium text-white">Publication Cadence & Limits</p>
                      <p className="text-xs text-white/40 mt-0.5">NomosX publishes less — but better</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <div className="text-lg font-light text-white">
                        {subscription.weeklyPublicationCount} / {subscription.weeklyPublicationMax}
                      </div>
                      <div className="text-xs text-white/40">This week</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-light text-white">
                        {subscription.activeVerticals} / {subscription.activeVerticalsMax}
                      </div>
                      <div className="text-xs text-white/40">Verticals</div>
                    </div>
                  </div>
                </div>
                
                {subscription.weeklyLimitReached && (
                  <div className="mt-4 pt-4 border-t border-amber-500/20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertCircle size={16} className="text-amber-400" />
                      <span className="text-sm text-amber-400">Weekly publication limit reached</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-cyan-400 hover:text-cyan-300"
                      onClick={() => router.push("/pricing")}
                    >
                      Maintain discipline or upgrade →
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        )}

        {/* Quick Actions */}
        <div className="flex gap-3">
          <Button 
            variant="ai" 
            onClick={() => {
              if (subscription?.isTrialExpired || !subscription?.canAccessStudio) {
                router.push("/pricing");
              } else {
                router.push("/studio");
              }
            }}
            disabled={subscription?.isTrialExpired}
          >
            <PenTool size={18} className="mr-2" />
            Open Studio
          </Button>
          <Button variant="ghost" onClick={() => router.push("/signals")}>
            <Zap size={18} className="mr-2" />
            Signals
          </Button>
          <Button variant="ghost" onClick={() => router.push("/publications")}>
            <Archive size={18} className="mr-2" />
            Publications
          </Button>
          <div className="flex-1" />
          <Button variant="ghost" size="sm" onClick={loadDashboardData} disabled={loading}>
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </Button>
        </div>
      </div>
    </Shell>
  );
}
