const React = require('react');
"use client";

/**
 * NomosX Publication Studio
 * 
 * Human-Initiated Publication Trigger
 * User expresses: "I think this deserves analysis/publication"
 * Output is NOT the brief itself — output is a Publication (or silence)
 */

const {useState,useEffect,Suspense} = require('react');
const {Select} = require('@/components/ui/Select');
const {Input} = require('@/components/ui/Input');
const {useSearchParams,useRouter} = require('next/navigation');
const Shell = require('@/components/Shell');
const {Textarea} = require('@/components/ui/Textarea');
const {Button} = require('@/components/ui/Button');
const {Badge} = require('@/components/ui/Badge');
const {Card,CardContent,CardHeader} = require('@/components/ui/Card');
const {PenTool,Sparkles,MessagesSquare,FileText,Download,Zap,DollarSign,Cpu,Heart,Users,AlertTriangle,ArrowRight,Layers,CheckCircle,Clock} = require('lucide-react');
const {detectIntent,typeIntentResult} = require('@/lib/ai/intent-detection');
const SmartSuggestions = require('@/components/SmartSuggestions');
const {useKeyboardShortcuts,Kbd} = require('@/hooks/useKeyboardShortcuts');
const {useStreamingBrief} = require('@/hooks/useStreamingBrief');
const {useStreamingCouncil} = require('@/hooks/useStreamingCouncil');
const ProgressBar = require('@/components/ProgressBar');
const {toast} = require('@/components/ui/Toast');
const {cn} = require('@/lib/utils');

type PublicationType = "EXECUTIVE_BRIEF" | "STRATEGIC_REPORT";

const PUBLICATION_TYPES: { value: PublicationType; label: string; description: string; icon: React.ElementType; pages: string; audience: string }[] = [
  { 
    value: "EXECUTIVE_BRIEF", 
    label: "Executive Brief", 
    description: "Decision-ready synthesis with key findings", 
    icon: FileText,
    pages: "2-3 pages",
    audience: "Free newsletter"
  },
  { 
    value: "STRATEGIC_REPORT", 
    label: "Strategic Report", 
    description: "Deep analysis with scenarios and recommendations", 
    icon: Layers,
    pages: "10-15 pages",
    audience: "Paid subscribers"
  },
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
  const [publicationType, setPublicationType] = useState<PublicationType>("EXECUTIVE_BRIEF");
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
      toast({ type: "error", title: "Error", message: "Question and vertical required" });
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
      toast({ type: "success", title: "Draft created", message: "You can now submit it to the Editorial Gate" });
    } catch (error) {
      console.error("Create draft error:", error);
      toast({ type: "error", title: "Error", message: "Unable to create draft" });
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
        PUBLISH: { type: "success", title: "Publication approved", message: "The draft will be published" },
        HOLD: { type: "warning", title: "Held", message: "Human review required" },
        REJECT: { type: "error", title: "Rejected", message: data.reasons?.[0] || "Does not meet criteria" },
        SILENCE: { type: "info", title: "Silence", message: "Topic does not warrant publication" },
      };
      
      const msg = decisionMessages[data.decision] || { type: "info", title: data.decision, message: "" };
      toast(msg);
    } catch (error) {
      console.error("Submit to gate error:", error);
      toast({ type: "error", title: "Error", message: "Unable to submit to Editorial Gate" });
    } finally {
      setSubmitting(false);
    }
  }

  const isLoading = streamingBrief.loading || streamingCouncil.loading;

  return (
    <Shell>
      <div className="max-w-5xl mx-auto transition-all duration-200 hover:opacity-80">
        {/* Header */}
        <div className="mb-10 transition-all duration-200 hover:opacity-80">
          <div className="flex items-center gap-3 sm:gap-4 mb-3 transition-all duration-200 hover:opacity-80">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border border-cyan-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(0,212,255,0.2)] transition-all duration-200 hover:opacity-80">
              <PenTool size={24} className="sm:w-7 sm:h-7 text-cyan-400 transition-all duration-200 hover:opacity-80" />
            </div>
            <div>
              <div className="text-xs text-cyan-400/60 tracking-[0.25em] uppercase mb-1 transition-all duration-200 hover:opacity-80">
                Propose to Think Tank
              </div>
              <h1 className="text-4xl sm:text-4xl md:text-4xl font-light tracking-tight text-white/95 transition-all duration-200 hover:opacity-80">Publication Studio</h1>
            </div>
          </div>
          <p className="text-sm sm:text-base text-white/50 leading-relaxed max-w-3xl sm:ml-[4.5rem] transition-all duration-200 hover:opacity-80">
            Propose topics to the autonomous Think Tank. Your proposal will be evaluated by the Editorial Gate. 
            The Think Tank may publish, hold for review, or choose strategic silence.
          </p>
        </div>

        {/* Signal Context Banner */}
        {signalContext && (
          <Card variant="default" className="mb-6 bg-amber-500/5 border-amber-500/20 transition-all duration-200 hover:opacity-80">
            <CardContent className="pt-4 pb-4 transition-all duration-200 hover:opacity-80">
              <div className="flex items-center gap-3 transition-all duration-200 hover:opacity-80">
                <Zap size={18} className="text-amber-400 transition-all duration-200 hover:opacity-80" />
                <div className="flex-1 transition-all duration-200 hover:opacity-80">
                  <p className="text-sm text-white/70 transition-all duration-200 hover:opacity-80">Based on detected signal:</p>
                  <p className="text-white font-medium transition-all duration-200 hover:opacity-80">{signalContext.title}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSignalContext(null)}>
                  Detach
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Input */}
        <Card variant="default" className="border-white/10 bg-background/[0.02] backdrop-blur-xl mb-8 transition-all duration-200 hover:opacity-80">
          <CardContent className="pt-6 transition-all duration-200 hover:opacity-80">
            {/* Publication Type Selection - Simplified to 2 formats */}
            <div className="mb-6 transition-all duration-200 hover:opacity-80">
              <label className="text-xs text-white/40 uppercase tracking-wider mb-3 block transition-all duration-200 hover:opacity-80">Publication Format</label>
              <div className="grid grid-cols-2 gap-3 transition-all duration-200 hover:opacity-80">
                {PUBLICATION_TYPES.map(type => {
                  const Icon = type.icon;
                  const isSelected = publicationType === type.value;
                  return (
                    <button
                      key={type.value}
                      onClick={() => setPublicationType(type.value)}
                      disabled={isLoading}
                      className={`
                        p-4 rounded-xl text-left transition-all
                        ${isSelected 
                          ? 'bg-cyan-500/10 border-2 border-cyan-500/40 shadow-[0_0_20px_rgba(0,212,255,0.1)]' 
                          : 'bg-background/[0.02] border border-white/10 hover:border-white/20'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3 mb-2 transition-all duration-200 hover:opacity-80">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isSelected ? 'bg-cyan-500/20' : 'bg-background/5'}`}>
                          <Icon size={20} className={isSelected ? 'text-cyan-400' : 'text-white/40'} />
                        </div>
                        <div>
                          <div className={`font-medium ${isSelected ? 'text-white' : 'text-white/70'}`}>{type.label}</div>
                          <div className="text-xs text-white/40 transition-all duration-200 hover:opacity-80">{type.pages}</div>
                        </div>
                      </div>
                      <p className="text-xs text-white/50 mb-2 transition-all duration-200 hover:opacity-80">{type.description}</p>
                      <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                        type.value === "EXECUTIVE_BRIEF" 
                          ? 'bg-emerald-500/10 text-emerald-400' 
                          : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {type.audience}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Vertical Selection */}
            {verticals.length > 0 && (
              <div className="mb-6 transition-all duration-200 hover:opacity-80">
                <label className="text-xs text-white/40 uppercase tracking-wider mb-3 block transition-all duration-200 hover:opacity-80">Vertical</label>
                <div className="flex flex-wrap gap-2 transition-all duration-200 hover:opacity-80">
                  {verticals.map(v => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVertical(v.id)}
                      disabled={isLoading}
                      className={`
                        px-3 py-1.5 rounded-lg text-sm transition-all flex items-center gap-1.5
                        ${selectedVertical === v.id 
                          ? 'bg-background/10 text-white border border-white/20' 
                          : 'text-white/40 hover:text-white/60 hover:bg-background/[0.03]'
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
              placeholder="What question deserves institutional publication?"
              rows={4}
              className="mb-4 bg-background/[0.03] border-white/10 focus:border-cyan-500/50 text-base resize-none transition-all duration-200 hover:opacity-80"
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
              <div className="mb-4 text-xs text-cyan-400/70 flex items-center gap-1.5 transition-all duration-200 hover:opacity-80">
                <Sparkles size={12} />
                Suggested format: {detectedIntent.type === "brief" ? "Executive Brief" : "Strategic Report"} ({Math.round(detectedIntent.confidence * 100)}%)
              </div>
            )}

            <div className="flex items-center justify-between transition-all duration-200 hover:opacity-80">
              <div className="flex gap-2 text-xs text-white/30 transition-all duration-200 hover:opacity-80">
                <Kbd>⌘K</Kbd>
                <span>focus</span>
                <span className="text-white/10 transition-all duration-200 hover:opacity-80">•</span>
                <Kbd>⌘↵</Kbd>
                <span>generate</span>
              </div>
              
              <div className="flex gap-2 transition-all duration-200 hover:opacity-80">
                <Button
                  variant="ai"
                  onClick={handleGenerate}
                  disabled={!question.trim() || isLoading}
                  className="relative overflow-hidden group transition-all duration-200 hover:opacity-80"
                >
                  {isLoading ? (
                    <>
                      <Zap size={18} className="mr-2 animate-pulse transition-all duration-200 hover:opacity-80" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} className="mr-2 group-hover:rotate-12 transition-transform" />
                      Generate {publicationType === "EXECUTIVE_BRIEF" ? "Brief" : "Report"}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress */}
        {isLoading && (
          <div className="mb-8 transition-all duration-200 hover:opacity-80">
            <ProgressBar 
              progress={typeof streamingBrief.progress === 'number' ? streamingBrief.progress : (typeof streamingCouncil.progress === 'number' ? streamingCouncil.progress : 0)}
              message={streamingBrief.loading ? 'Génération du draft...' : 'Délibération en cours...'}
            />
          </div>
        )}

        {/* Draft Result */}
        {briefResult && (
          <div className="space-y-6 animate-fade-in transition-all duration-200 hover:opacity-80">
            <div className="flex items-center justify-between mb-4 transition-all duration-200 hover:opacity-80">
              <div className="flex items-center gap-3 transition-all duration-200 hover:opacity-80">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center transition-all duration-200 hover:opacity-80">
                  <FileText size={20} className="text-white transition-all duration-200 hover:opacity-80" />
                </div>
                <div>
                  <div className="flex items-center gap-2 transition-all duration-200 hover:opacity-80">
                    <h2 className="text-4xl font-semibold text-white transition-all duration-200 hover:opacity-80">Draft</h2>
                    <Badge variant="warning" className="text-xs transition-all duration-200 hover:opacity-80">Pending decision</Badge>
                  </div>
                  <p className="text-sm text-white/50 transition-all duration-200 hover:opacity-80">{briefResult.sources.length} sources • {PUBLICATION_TYPES.find(t => t.value === publicationType)?.label}</p>
                </div>
              </div>
              <Button variant="ai" size="sm" onClick={handleSubmitToEditorialGate}>
                <CheckCircle size={16} className="mr-2 transition-all duration-200 hover:opacity-80" />
                Submit to Editorial Gate
              </Button>
            </div>

            <Card variant="default" className="border-white/10 bg-background/[0.02] transition-all duration-200 hover:opacity-80">
              <CardContent className="pt-8 transition-all duration-200 hover:opacity-80">
                <div 
                  className="nomosx-prose transition-all duration-200 hover:opacity-80"
                  dangerouslySetInnerHTML={{ __html: briefResult.html }}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Deliberation Panel */}
        {showDeliberation && councilResult && (
          <div className="mt-8 space-y-6 animate-fade-in transition-all duration-200 hover:opacity-80">
            <div className="flex items-center gap-3 mb-4 transition-all duration-200 hover:opacity-80">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center transition-all duration-200 hover:opacity-80">
                <MessagesSquare size={20} className="text-white transition-all duration-200 hover:opacity-80" />
              </div>
              <div>
                <h2 className="text-4xl font-semibold text-white transition-all duration-200 hover:opacity-80">Deliberation</h2>
                <p className="text-sm text-white/50 transition-all duration-200 hover:opacity-80">4 perspectives to inform the decision</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 transition-all duration-200 hover:opacity-80">
              <Card variant="default" className="border-l-4 border-l-cyan-500/50 bg-background/[0.02] transition-all duration-200 hover:opacity-80">
                <CardHeader>
                  <div className="flex items-center gap-2 transition-all duration-200 hover:opacity-80">
                    <DollarSign size={16} className="text-cyan-400 transition-all duration-200 hover:opacity-80" />
                    <h3 className="text-base font-semibold text-white transition-all duration-200 hover:opacity-80">Economic</h3>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="nomosx-prose text-sm transition-all duration-200 hover:opacity-80" dangerouslySetInnerHTML={{ __html: councilResult.economic }} />
                </CardContent>
              </Card>

              <Card variant="default" className="border-l-4 border-l-blue-500/50 bg-background/[0.02] transition-all duration-200 hover:opacity-80">
                <CardHeader>
                  <div className="flex items-center gap-2 transition-all duration-200 hover:opacity-80">
                    <Cpu size={16} className="text-primary transition-all duration-200 hover:opacity-80" />
                    <h3 className="text-base font-semibold text-white transition-all duration-200 hover:opacity-80">Technical</h3>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="nomosx-prose text-sm transition-all duration-200 hover:opacity-80" dangerouslySetInnerHTML={{ __html: councilResult.technical }} />
                </CardContent>
              </Card>

              <Card variant="default" className="border-l-4 border-l-rose-500/50 bg-background/[0.02] transition-all duration-200 hover:opacity-80">
                <CardHeader>
                  <div className="flex items-center gap-2 transition-all duration-200 hover:opacity-80">
                    <Heart size={16} className="text-rose-400 transition-all duration-200 hover:opacity-80" />
                    <h3 className="text-base font-semibold text-white transition-all duration-200 hover:opacity-80">Ethical</h3>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="nomosx-prose text-sm transition-all duration-200 hover:opacity-80" dangerouslySetInnerHTML={{ __html: councilResult.ethical }} />
                </CardContent>
              </Card>

              <Card variant="default" className="border-l-4 border-l-purple-500/50 bg-background/[0.02] transition-all duration-200 hover:opacity-80">
                <CardHeader>
                  <div className="flex items-center gap-2 transition-all duration-200 hover:opacity-80">
                    <Users size={16} className="text-secondary transition-all duration-200 hover:opacity-80" />
                    <h3 className="text-base font-semibold text-white transition-all duration-200 hover:opacity-80">Political</h3>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="nomosx-prose text-sm transition-all duration-200 hover:opacity-80" dangerouslySetInnerHTML={{ __html: councilResult.political }} />
                </CardContent>
              </Card>
            </div>

            <Card variant="default" className="bg-background/[0.02] transition-all duration-200 hover:opacity-80">
              <CardHeader>
                <div className="flex items-center gap-2 transition-all duration-200 hover:opacity-80">
                  <Sparkles size={18} className="text-cyan-400 transition-all duration-200 hover:opacity-80" />
                  <h3 className="text-4xl font-semibold text-white transition-all duration-200 hover:opacity-80">Synthesis</h3>
                </div>
              </CardHeader>
              <CardContent>
                <div className="nomosx-prose transition-all duration-200 hover:opacity-80" dangerouslySetInnerHTML={{ __html: councilResult.synthesis }} />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !briefResult && !councilResult && (
          <div className="space-y-8 transition-all duration-200 hover:opacity-80">
            <div className="text-center py-8 transition-all duration-200 hover:opacity-80">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-4 transition-all duration-200 hover:opacity-80">
                <PenTool size={32} className="text-white transition-all duration-200 hover:opacity-80" />
              </div>
              <h3 className="text-4xl font-semibold text-white mb-2 transition-all duration-200 hover:opacity-80">Create a publication</h3>
              <p className="text-white/50 text-sm max-w-md mx-auto transition-all duration-200 hover:opacity-80">
                Select a format, a vertical, and ask your question. 
                The system will generate a draft submitted to the Editorial Gate.
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
        <div className="flex items-center justify-center min-h-screen transition-all duration-200 hover:opacity-80">
          <div className="text-center transition-all duration-200 hover:opacity-80">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4 transition-all duration-200 hover:opacity-80"></div>
            <p className="text-white/50 transition-all duration-200 hover:opacity-80">Chargement...</p>
          </div>
        </div>
      </Shell>
    }>
      <StudioPageContent />
    </Suspense>
  );
}
