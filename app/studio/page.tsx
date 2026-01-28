"use client";

/**
 * NomosX Publication Studio
 * 
 * Human-Initiated Publication Trigger
 * User expresses: "I think this deserves analysis/publication"
 * Output is NOT the brief itself — output is a Publication (or silence)
 */

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Shell from "@/components/Shell";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { 
  PenTool,
  Sparkles, 
  MessagesSquare, 
  FileText, 
  Download, 
  Zap,
  DollarSign,
  Cpu,
  Heart,
  Users,
  AlertTriangle,
  ArrowRight,
  Layers,
  CheckCircle,
  Clock
} from "lucide-react";
import { detectIntent, type IntentResult } from "@/lib/ai/intent-detection";
import SmartSuggestions from "@/components/SmartSuggestions";
import { useKeyboardShortcuts, Kbd } from "@/hooks/useKeyboardShortcuts";
import { useStreamingBrief } from "@/hooks/useStreamingBrief";
import { useStreamingCouncil } from "@/hooks/useStreamingCouncil";
import ProgressBar from "@/components/ProgressBar";
import { toast } from "@/components/ui/Toast";

type PublicationType = "RESEARCH_BRIEF" | "UPDATE_NOTE" | "DATA_NOTE" | "POLICY_NOTE" | "DOSSIER";

const PUBLICATION_TYPES: { value: PublicationType; label: string; description: string; icon: React.ElementType }[] = [
  { value: "RESEARCH_BRIEF", label: "Research Brief", description: "Analyse structurée avec consensus et débat", icon: FileText },
  { value: "UPDATE_NOTE", label: "Update Note", description: "Mise à jour sur un sujet existant", icon: Zap },
  { value: "DATA_NOTE", label: "Data Note", description: "Focus sur nouvelles données", icon: Cpu },
  { value: "POLICY_NOTE", label: "Policy Note", description: "Implications politiques", icon: Users },
  { value: "DOSSIER", label: "Dossier", description: "Analyse approfondie multi-sections", icon: MessagesSquare },
];

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

function StudioPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [question, setQuestion] = useState("");
  const [publicationType, setPublicationType] = useState<PublicationType>("RESEARCH_BRIEF");
  const [selectedVertical, setSelectedVertical] = useState<string>("");
  const [verticals, setVerticals] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [detectedIntent, setDetectedIntent] = useState<IntentResult | null>(null);
  const [signalContext, setSignalContext] = useState<{ id: string; title: string } | null>(null);
  
  const [briefResult, setBriefResult] = useState<BriefResult | null>(null);
  const [councilResult, setCouncilResult] = useState<CouncilResult | null>(null);
  const [showDeliberation, setShowDeliberation] = useState(false);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [draftStatus, setDraftStatus] = useState<string>("DRAFT");
  const [gateDecision, setGateDecision] = useState<{ decision: string; reasons: string[] } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const streamingBrief = useStreamingBrief();
  const streamingCouncil = useStreamingCouncil();

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
      description: 'Générer',
      category: 'action'
    }
  ]);

  // Load verticals
  useEffect(() => {
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
    loadVerticals();
  }, []);

  // Handle signal context from URL
  useEffect(() => {
    const signalId = searchParams.get("signalId");
    if (signalId) {
      // Load signal details
      fetch(`/api/think-tank/signals/${signalId}`)
        .then(res => res.json())
        .then(data => {
          if (data.signal) {
            setSignalContext({ id: data.signal.id, title: data.signal.title });
            setQuestion(data.signal.title);
            if (data.signal.verticalId) {
              setSelectedVertical(data.signal.verticalId);
            }
          }
        })
        .catch(console.error);
    }
  }, [searchParams]);

  // Intent detection
  useEffect(() => {
    if (question.trim().length > 10) {
      const intent = detectIntent(question);
      setDetectedIntent(intent);
    } else {
      setDetectedIntent(null);
    }
  }, [question]);

  async function handleGenerate() {
    if (!question.trim()) return;

    setBriefResult(null);
    setCouncilResult(null);

    try {
      // For now, use existing brief generation
      // In production, this would create a draft publication
      await streamingBrief.generateBrief(question);
    } catch (error) {
      console.error("Generation error:", error);
    }
  }

  async function handleDeliberate() {
    if (!question.trim()) return;
    
    setShowDeliberation(true);
    try {
      await streamingCouncil.generateCouncil(question);
    } catch (error) {
      console.error("Deliberation error:", error);
    }
  }

  // Sync results
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

  async function handleCreateDraft() {
    if (!question.trim() || !selectedVertical) {
      toast({ type: "error", title: "Erreur", message: "Question et verticale requises" });
      return;
    }

    try {
      const res = await fetch("/api/drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          verticalId: selectedVertical,
          signalId: signalContext?.id || null,
          type: publicationType,
          question: question.trim(),
          title: briefResult?.title || question.trim().slice(0, 100),
        }),
      });

      if (!res.ok) throw new Error("Failed to create draft");
      
      const data = await res.json();
      setDraftId(data.draft.id);
      setDraftStatus("DRAFT");
      toast({ type: "success", title: "Draft créé", message: "Vous pouvez maintenant le soumettre à l'Editorial Gate" });
    } catch (error) {
      console.error("Create draft error:", error);
      toast({ type: "error", title: "Erreur", message: "Impossible de créer le draft" });
    }
  }

  async function handleSubmitToEditorialGate() {
    if (!draftId) {
      // Create draft first if not exists
      await handleCreateDraft();
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/drafts/${draftId}/submit`, {
        method: "POST",
      });

      if (!res.ok) throw new Error("Failed to submit to gate");
      
      const data = await res.json();
      setGateDecision({ decision: data.decision, reasons: data.reasons });
      setDraftStatus(data.decision === "PUBLISH" ? "APPROVED" : data.decision === "HOLD" ? "UNDER_REVIEW" : "REJECTED");
      
      const decisionMessages: Record<string, { type: "success" | "info" | "warning" | "error"; title: string; message: string }> = {
        PUBLISH: { type: "success", title: "Publication approuvée", message: "Le draft sera publié" },
        HOLD: { type: "warning", title: "En attente", message: "Revue humaine requise" },
        REJECT: { type: "error", title: "Rejeté", message: data.reasons?.[0] || "Ne répond pas aux critères" },
        SILENCE: { type: "info", title: "Silence", message: "Le sujet ne justifie pas de publication" },
      };
      
      const msg = decisionMessages[data.decision] || { type: "info", title: data.decision, message: "" };
      toast(msg);
    } catch (error) {
      console.error("Submit to gate error:", error);
      toast({ type: "error", title: "Erreur", message: "Impossible de soumettre à l'Editorial Gate" });
    } finally {
      setSubmitting(false);
    }
  }

  const isLoading = streamingBrief.loading || streamingCouncil.loading;

  return (
    <Shell>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border border-cyan-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(0,212,255,0.2)]">
              <PenTool size={28} className="text-cyan-400" />
            </div>
            <div>
              <div className="text-xs text-cyan-400/60 tracking-[0.25em] uppercase mb-1">
                Propose to Think Tank
              </div>
              <h1 className="text-4xl font-light tracking-tight text-white/95">Publication Studio</h1>
            </div>
          </div>
          <p className="text-base text-white/50 leading-relaxed max-w-3xl ml-[4.5rem]">
            Propose topics to the autonomous Think Tank. Your proposal will be evaluated by the Editorial Gate. 
            The Think Tank may publish, hold for review, or choose strategic silence.
          </p>
        </div>

        {/* Signal Context Banner */}
        {signalContext && (
          <Card variant="default" className="mb-6 bg-amber-500/5 border-amber-500/20">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <Zap size={18} className="text-amber-400" />
                <div className="flex-1">
                  <p className="text-sm text-white/70">Basé sur le signal détecté:</p>
                  <p className="text-white font-medium">{signalContext.title}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSignalContext(null)}>
                  Détacher
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Input */}
        <Card variant="default" className="border-white/10 bg-white/[0.02] backdrop-blur-xl mb-8">
          <CardContent className="pt-6">
            {/* Publication Type Selection */}
            <div className="mb-6">
              <label className="text-xs text-white/40 uppercase tracking-wider mb-3 block">Type de publication</label>
              <div className="flex flex-wrap gap-2">
                {PUBLICATION_TYPES.map(type => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.value}
                      onClick={() => setPublicationType(type.value)}
                      disabled={isLoading}
                      className={`
                        px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2
                        ${publicationType === type.value 
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                          : 'text-white/50 hover:text-white/70 hover:bg-white/[0.03] border border-transparent'
                        }
                      `}
                      title={type.description}
                    >
                      <Icon size={16} />
                      {type.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Vertical Selection */}
            {verticals.length > 0 && (
              <div className="mb-6">
                <label className="text-xs text-white/40 uppercase tracking-wider mb-3 block">Verticale</label>
                <div className="flex flex-wrap gap-2">
                  {verticals.map(v => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVertical(v.id)}
                      disabled={isLoading}
                      className={`
                        px-3 py-1.5 rounded-lg text-sm transition-all flex items-center gap-1.5
                        ${selectedVertical === v.id 
                          ? 'bg-white/10 text-white border border-white/20' 
                          : 'text-white/40 hover:text-white/60 hover:bg-white/[0.03]'
                        }
                      `}
                    >
                      <Layers size={14} />
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Question Input */}
            <Textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Quelle question mérite une publication institutionnelle ?"
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

            {/* Intent Detection */}
            {detectedIntent && detectedIntent.confidence > 0.6 && (
              <div className="mb-4 text-xs text-cyan-400/70 flex items-center gap-1.5">
                <Sparkles size={12} />
                Format suggéré: {detectedIntent.type === "brief" ? "Research Brief" : "Council Deliberation"} ({Math.round(detectedIntent.confidence * 100)}%)
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex gap-2 text-xs text-white/30">
                <Kbd>⌘K</Kbd>
                <span>focus</span>
                <span className="text-white/10">•</span>
                <Kbd>⌘↵</Kbd>
                <span>générer</span>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  onClick={handleDeliberate}
                  disabled={!question.trim() || isLoading}
                >
                  <MessagesSquare size={18} className="mr-2" />
                  Délibérer
                </Button>
                <Button
                  variant="ai"
                  onClick={handleGenerate}
                  disabled={!question.trim() || isLoading}
                  className="relative overflow-hidden group"
                >
                  {isLoading ? (
                    <>
                      <Zap size={18} className="mr-2 animate-pulse" />
                      Génération...
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} className="mr-2 group-hover:rotate-12 transition-transform" />
                      Générer Draft
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress */}
        {isLoading && (
          <div className="mb-8">
            <ProgressBar 
              progress={typeof streamingBrief.progress === 'number' ? streamingBrief.progress : (typeof streamingCouncil.progress === 'number' ? streamingCouncil.progress : 0)}
              message={streamingBrief.loading ? 'Génération du draft...' : 'Délibération en cours...'}
            />
          </div>
        )}

        {/* Draft Result */}
        {briefResult && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <FileText size={20} className="text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold text-white">Draft</h2>
                    <Badge variant="warning" className="text-xs">En attente de décision</Badge>
                  </div>
                  <p className="text-sm text-white/50">{briefResult.sources.length} sources • {PUBLICATION_TYPES.find(t => t.value === publicationType)?.label}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={handleDeliberate}>
                  <MessagesSquare size={16} className="mr-2" />
                  Délibérer
                </Button>
                <Button variant="ai" size="sm" onClick={handleSubmitToEditorialGate}>
                  <CheckCircle size={16} className="mr-2" />
                  Soumettre à l'Editorial Gate
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

        {/* Deliberation Panel */}
        {showDeliberation && councilResult && (
          <div className="mt-8 space-y-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <MessagesSquare size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Délibération</h2>
                <p className="text-sm text-white/50">4 perspectives pour éclairer la décision</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Card variant="default" className="border-l-4 border-l-cyan-500/50 bg-white/[0.02]">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} className="text-cyan-400" />
                    <h3 className="text-base font-semibold text-white">Économique</h3>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="nomosx-prose text-sm" dangerouslySetInnerHTML={{ __html: councilResult.economic }} />
                </CardContent>
              </Card>

              <Card variant="default" className="border-l-4 border-l-blue-500/50 bg-white/[0.02]">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Cpu size={16} className="text-blue-400" />
                    <h3 className="text-base font-semibold text-white">Technique</h3>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="nomosx-prose text-sm" dangerouslySetInnerHTML={{ __html: councilResult.technical }} />
                </CardContent>
              </Card>

              <Card variant="default" className="border-l-4 border-l-rose-500/50 bg-white/[0.02]">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Heart size={16} className="text-rose-400" />
                    <h3 className="text-base font-semibold text-white">Éthique</h3>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="nomosx-prose text-sm" dangerouslySetInnerHTML={{ __html: councilResult.ethical }} />
                </CardContent>
              </Card>

              <Card variant="default" className="border-l-4 border-l-purple-500/50 bg-white/[0.02]">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-purple-400" />
                    <h3 className="text-base font-semibold text-white">Politique</h3>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="nomosx-prose text-sm" dangerouslySetInnerHTML={{ __html: councilResult.political }} />
                </CardContent>
              </Card>
            </div>

            <Card variant="default" className="bg-white/[0.02]">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sparkles size={18} className="text-cyan-400" />
                  <h3 className="text-lg font-semibold text-white">Synthèse</h3>
                </div>
              </CardHeader>
              <CardContent>
                <div className="nomosx-prose" dangerouslySetInnerHTML={{ __html: councilResult.synthesis }} />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !briefResult && !councilResult && (
          <div className="space-y-8">
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-4">
                <PenTool size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Créez une publication</h3>
              <p className="text-white/50 text-sm max-w-md mx-auto">
                Sélectionnez un type, une verticale, et posez votre question. 
                Le système générera un draft soumis à l'Editorial Gate.
              </p>
            </div>
            
            <SmartSuggestions
              onSelectSuggestion={(q) => {
                setQuestion(q);
                setTimeout(() => document.querySelector('textarea')?.focus(), 100);
              }}
            />
          </div>
        )}
      </div>
    </Shell>
  );
}

export default function StudioPage() {
  return (
    <Suspense fallback={
      <Shell>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
            <p className="text-white/50">Chargement...</p>
          </div>
        </div>
      </Shell>
    }>
      <StudioPageContent />
    </Suspense>
  );
}
