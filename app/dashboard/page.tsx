"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Shell from "@/components/Shell";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { 
  Sparkles, 
  MessagesSquare, 
  FileText, 
  Download, 
  RefreshCw,
  Zap,
  DollarSign,
  Cpu,
  Heart,
  Users,
  AlertTriangle,
  ArrowRight,
  Clock
} from "lucide-react";
import { detectIntent, type IntentResult } from "@/lib/ai/intent-detection";
import SmartSuggestions from "@/components/SmartSuggestions";
import { useKeyboardShortcuts, Kbd } from "@/hooks/useKeyboardShortcuts";
import { useStreamingBrief } from "@/hooks/useStreamingBrief";
import { useStreamingCouncil } from "@/hooks/useStreamingCouncil";
import { useConversationHistory } from "@/hooks/useConversationHistory";
import ConversationHistory from "@/components/ConversationHistory";
import ProgressBar from "@/components/ProgressBar";
import { toast } from "@/components/ui/Toast";

type Mode = "brief" | "council";

type BriefResult = {
  title: string;
  html: string;
  sources: Array<{ id: string; title: string; year?: number; provider?: string }>;
};

type CouncilResult = {
  economic: string;
  technical: string;
  ethical: string;
  political: string;
  synthesis: string;
  uncertainty: string;
  sources: Array<{ id: string; num: number; title: string; year?: number; provider?: string }>;
};

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [question, setQuestion] = useState("");
  const [mode, setMode] = useState<Mode>("brief");
  const [detectedIntent, setDetectedIntent] = useState<IntentResult | null>(null);
  
  const [briefResult, setBriefResult] = useState<BriefResult | null>(null);
  const [councilResult, setCouncilResult] = useState<CouncilResult | null>(null);

  // Streaming Hooks
  const streamingBrief = useStreamingBrief();
  const streamingCouncil = useStreamingCouncil();
  
  // Conversation History
  const conversationHistory = useConversationHistory();

  // Keyboard Shortcuts
  useKeyboardShortcuts([
    {
      key: 'k',
      meta: true,
      action: () => document.querySelector('textarea')?.focus(),
      description: 'Focus input',
      category: 'navigation'
    },
    {
      key: 'Enter',
      meta: true,
      action: () => !streamingBrief.loading && !streamingCouncil.loading && question.trim() && handleGenerate(),
      description: 'Générer brief/council',
      category: 'action'
    },
    {
      key: '1',
      meta: true,
      action: () => !(streamingBrief.loading || streamingCouncil.loading) && setMode('brief'),
      description: 'Mode Brief',
      category: 'mode'
    },
    {
      key: '2',
      meta: true,
      action: () => !(streamingBrief.loading || streamingCouncil.loading) && setMode('council'),
      description: 'Mode Council',
      category: 'mode'
    }
  ]);

  // Auto-run si query param ?q=...
  useEffect(() => {
    const q = searchParams.get("q");
    const modeParam = searchParams.get("mode") as Mode | null;
    
    if (q) {
      setQuestion(q);
      if (modeParam === "brief" || modeParam === "council") {
        setMode(modeParam);
      }
      setTimeout(() => handleGenerate(), 800);
    }
  }, [searchParams]);

  // Détection automatique de l'intent quand question change
  useEffect(() => {
    if (question.trim().length > 10) {
      const intent = detectIntent(question);
      setDetectedIntent(intent);
      // Auto-switch mode si confidence > 0.7
      if (intent.confidence > 0.7 && !(streamingBrief.loading || streamingCouncil.loading)) {
        setMode(intent.type);
      }
    } else {
      setDetectedIntent(null);
    }
  }, [question, streamingBrief.loading, streamingCouncil.loading]);

  async function handleGenerate() {
    if (!question.trim()) return;

    setBriefResult(null);
    setCouncilResult(null);

    try {
      if (mode === "brief") {
        await streamingBrief.generateBrief(question);
      } else {
        await streamingCouncil.generateCouncil(question);
      }
    } catch (error) {
      console.error("Generation error:", error);
    }
  }

  // Sync streaming results avec state local
  useEffect(() => {
    if (streamingBrief.result) {
      setBriefResult({
        title: question,
        html: streamingBrief.result.html,
        sources: streamingBrief.result.sources,
      });
    }
  }, [streamingBrief.result, question]);

  useEffect(() => {
    if (streamingCouncil.result) {
      setCouncilResult(streamingCouncil.result);
    }
  }, [streamingCouncil.result]);

  async function handleAction(action: "export" | "deepen" | "debate") {
    if (action === "export") {
      toast({ type: "info", title: "Export en cours...", message: "Génération du PDF" });
      setTimeout(() => {
        toast({ type: "success", title: "PDF exporté", message: "Téléchargement démarré" });
      }, 1500);
    } else if (action === "deepen") {
      const newQuestion = `Approfondis: ${question}`;
      setQuestion(newQuestion);
      setMode("brief");
      toast({ type: "info", title: "Approfondissement...", message: "Nouvelle analyse en cours" });
      setTimeout(() => handleGenerate(), 500);
    } else if (action === "debate") {
      setMode("council");
      toast({ type: "info", title: "Basculement vers Conseil", message: "Analyse multi-perspectives" });
      setTimeout(() => handleGenerate(), 300);
    }
  }

  const isLoading = streamingBrief.loading || streamingCouncil.loading;

  return (
    <Shell>
      <div className="max-w-5xl mx-auto">
        
        {/* Conversation History - Collapsible */}
        {conversationHistory.history.length > 0 && (
          <div className="mb-6">
            <ConversationHistory 
              onSelectAnalysis={(analysisId) => {
                const item = conversationHistory.history.find(h => h.id === analysisId);
                if (item) {
                  setQuestion(item.question);
                  setMode(item.mode);
                  toast({ type: "info", title: "Conversation chargée" });
                }
              }}
            />
          </div>
        )}

        {/* Main Input - Hero Focus */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <div className="text-xs text-cyan-400/60 tracking-[0.25em] uppercase mb-4">
              Strategic Intelligence Platform
            </div>
            <h1 className="text-4xl sm:text-5xl font-light leading-tight mb-4 text-white/95">
              What would you like to analyze?
            </h1>
            <p className="text-base text-white/50 leading-relaxed max-w-2xl mx-auto">
              Ask your question, our agents automatically detect 
              the best analysis format.
            </p>
          </div>

          <Card variant="default" className="border-white/10 bg-white/[0.02] backdrop-blur-xl">
            <CardContent className="pt-6">
              <Textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ex: Quels sont les impacts économiques d'une taxe carbone en Europe ?"
                rows={4}
                className="mb-4 bg-white/[0.03] border-white/10 focus:border-cyan-500/50 text-base resize-none"
                disabled={isLoading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault();
                    handleGenerate();
                  }
                }}
              />

              {/* Mode Toggle - Subtle */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => setMode("brief")}
                    disabled={isLoading}
                    className={`
                      px-4 py-2 rounded-xl text-sm font-medium transition-all
                      ${mode === "brief" 
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                        : 'text-white/50 hover:text-white/70 hover:bg-white/[0.03]'
                      }
                    `}
                  >
                    <FileText size={16} className="inline mr-2" />
                    Brief
                  </button>
                  <button
                    onClick={() => setMode("council")}
                    disabled={isLoading}
                    className={`
                      px-4 py-2 rounded-xl text-sm font-medium transition-all
                      ${mode === "council" 
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                        : 'text-white/50 hover:text-white/70 hover:bg-white/[0.03]'
                      }
                    `}
                  >
                    <MessagesSquare size={16} className="inline mr-2" />
                    Council
                  </button>
                </div>

                {/* Intent Detection - Tooltip style */}
                {detectedIntent && detectedIntent.confidence > 0.6 && (
                  <div className="text-xs text-cyan-400/70 flex items-center gap-1.5">
                    <Sparkles size={12} />
                    IA recommande {detectedIntent.type === "brief" ? "Brief" : "Council"} ({Math.round(detectedIntent.confidence * 100)}%)
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-2 text-xs text-white/30">
                  <Kbd>⌘K</Kbd>
                  <span>pour focus</span>
                  <span className="text-white/10">•</span>
                  <Kbd>⌘↵</Kbd>
                  <span>pour générer</span>
                </div>
                
                <Button
                  variant="ai"
                  onClick={handleGenerate}
                  disabled={!question.trim() || isLoading}
                  className="relative overflow-hidden group"
                >
                  {isLoading ? (
                    <>
                      <Zap size={18} className="mr-2 animate-pulse" />
                      Analyse en cours...
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} className="mr-2 group-hover:rotate-12 transition-transform" />
                      Analyser
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Feedback */}
        {isLoading && (
          <div className="mb-8">
            <ProgressBar 
              progress={typeof streamingBrief.progress === 'number' ? streamingBrief.progress : (typeof streamingCouncil.progress === 'number' ? streamingCouncil.progress : 0)}
              message={streamingBrief.loading || streamingCouncil.loading ? (mode === 'brief' ? 'Génération du brief...' : 'Conseil des perspectives...') : "Initialisation..."}
            />
          </div>
        )}

        {/* Results - Brief */}
        {briefResult && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <FileText size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Brief Analytique</h2>
                  <p className="text-sm text-white/50">{briefResult.sources.length} sources académiques</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleAction("export")}>
                  <Download size={16} className="mr-2" />
                  Export
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleAction("debate")}>
                  <MessagesSquare size={16} className="mr-2" />
                  Débat
                </Button>
              </div>
            </div>

            <Card variant="default" className="border-white/10 bg-white/[0.02]">
              <CardContent className="pt-8">
                <div 
                  className="nomosx-prose"
                  dangerouslySetInnerHTML={{ __html: briefResult.html }}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Results - Council */}
        {councilResult && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <MessagesSquare size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Conseil Multi-Perspectives</h2>
                  <p className="text-sm text-white/50">4 angles d'analyse experts</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleAction("export")}>
                  <Download size={16} className="mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {/* 4 Perspectives Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Economic */}
              <Card variant="default" className="border-l-4 border-l-cyan-500/50 bg-white/[0.02]">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                      <DollarSign size={16} className="text-cyan-400" />
                    </div>
                    <h3 className="text-base font-semibold text-white">Économique</h3>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="nomosx-prose text-sm" dangerouslySetInnerHTML={{ __html: councilResult.economic }} />
                </CardContent>
              </Card>

              {/* Technical */}
              <Card variant="default" className="border-l-4 border-l-blue-500/50 bg-white/[0.02]">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <Cpu size={16} className="text-blue-400" />
                    </div>
                    <h3 className="text-base font-semibold text-white">Technique</h3>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="nomosx-prose text-sm" dangerouslySetInnerHTML={{ __html: councilResult.technical }} />
                </CardContent>
              </Card>

              {/* Ethical */}
              <Card variant="default" className="border-l-4 border-l-rose-500/50 bg-white/[0.02]">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
                      <Heart size={16} className="text-rose-400" />
                    </div>
                    <h3 className="text-base font-semibold text-white">Éthique</h3>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="nomosx-prose text-sm" dangerouslySetInnerHTML={{ __html: councilResult.ethical }} />
                </CardContent>
              </Card>

              {/* Political */}
              <Card variant="default" className="border-l-4 border-l-purple-500/50 bg-white/[0.02]">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                      <Users size={16} className="text-purple-400" />
                    </div>
                    <h3 className="text-base font-semibold text-white">Politique</h3>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="nomosx-prose text-sm" dangerouslySetInnerHTML={{ __html: councilResult.political }} />
                </CardContent>
              </Card>
            </div>

            {/* Synthesis */}
            <Card variant="default" className="bg-white/[0.02]">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sparkles size={18} className="text-cyan-400" />
                  <h3 className="text-lg font-semibold text-white">Synthèse Intégrée</h3>
                </div>
              </CardHeader>
              <CardContent>
                <div className="nomosx-prose" dangerouslySetInnerHTML={{ __html: councilResult.synthesis }} />
              </CardContent>
            </Card>

            {/* Uncertainty */}
            {councilResult.uncertainty && (
              <Card variant="default" className="bg-amber-500/5 border-amber-500/20">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle size={16} className="text-amber-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-white/70 leading-relaxed">{councilResult.uncertainty}</div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Empty State with Smart Suggestions */}
        {!isLoading && !briefResult && !councilResult && (
          <div className="space-y-8">
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-4">
                <Sparkles size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Explorez les suggestions</h3>
              <p className="text-white/50 text-sm max-w-md mx-auto">
                Questions stratégiques populaires pour démarrer votre analyse
              </p>
            </div>
            
            <SmartSuggestions
              onSelectSuggestion={(question) => {
                setQuestion(question);
                setTimeout(() => document.querySelector('textarea')?.focus(), 100);
              }}
            />
          </div>
        )}
      </div>
    </Shell>
  );
}
