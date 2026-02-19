"use client";

import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, Search, Brain, Shield, FileText, ChevronRight } from 'lucide-react';

const DEMO_TOPICS = [
  "Impact of AI regulation on innovation",
  "Carbon pricing mechanisms in emerging markets",
  "Digital health adoption post-pandemic",
  "Supply chain resilience strategies",
];

const PIPELINE_STEPS = [
  { id: 1, icon: Search,      label: "SCOUT",    detail: "Scanning 250M+ academic sources",          duration: 1800 },
  { id: 2, icon: Brain,       label: "INDEX",    detail: "Enriching authors & institutions via ROR",  duration: 1400 },
  { id: 3, icon: Brain,       label: "RANK",     detail: "Scoring relevance & quality",              duration: 1000 },
  { id: 4, icon: Brain,       label: "READER",   detail: "Extracting claims, methods & results",     duration: 1600 },
  { id: 5, icon: Brain,       label: "ANALYST",  detail: "Synthesising strategic insights",          duration: 2200 },
  { id: 6, icon: Shield,      label: "GUARD",    detail: "Validating citations & evidence",          duration: 900  },
  { id: 7, icon: FileText,    label: "EDITOR",   detail: "Rendering executive brief",                duration: 800  },
];

const DEMO_RESULT = {
  sources: 34,
  used: 12,
  quality: 91,
  findings: [
    "Regulatory clarity accelerates private R&D investment by 18–24%",
    "Jurisdictions with sandbox frameworks attract 3× more AI startups",
    "Compliance costs disproportionately burden SMEs vs. incumbents",
  ],
  summary:
    "Evidence converges on a nuanced picture: stringent ex-ante rules dampen short-term innovation velocity, while principles-based frameworks with regulatory sandboxes produce superior long-run outcomes. The EU AI Act's risk-tiered approach is emerging as the de-facto global benchmark.",
};

type Phase = "typewriter" | "pipeline" | "result" | "idle";

export default function InteractiveDemo() {
  const [topicIndex, setTopicIndex]     = useState(0);
  const [displayed, setDisplayed]       = useState("");
  const [phase, setPhase]               = useState<Phase>("typewriter");
  const [activeStep, setActiveStep]     = useState(0);
  const [completedSteps, setCompleted]  = useState<number[]>([]);
  const cycleRef                        = useRef<ReturnType<typeof setTimeout> | null>(null);

  const topic = DEMO_TOPICS[topicIndex];

  const clearCycle = () => {
    if (cycleRef.current) clearTimeout(cycleRef.current);
  };

  const startCycle = () => {
    clearCycle();
    setDisplayed("");
    setPhase("typewriter");
    setActiveStep(0);
    setCompleted([]);
  };

  useEffect(() => {
    startCycle();
    return clearCycle;
  }, [topicIndex]);

  useEffect(() => {
    if (phase !== "typewriter") return;

    if (displayed.length < topic.length) {
      cycleRef.current = setTimeout(() => {
        setDisplayed(topic.slice(0, displayed.length + 1));
      }, 38);
    } else {
      cycleRef.current = setTimeout(() => setPhase("pipeline"), 600);
    }

    return clearCycle;
  }, [phase, displayed, topic]);

  useEffect(() => {
    if (phase !== "pipeline") return;

    if (activeStep >= PIPELINE_STEPS.length) {
      cycleRef.current = setTimeout(() => setPhase("result"), 400);
      return;
    }

    const step = PIPELINE_STEPS[activeStep];
    cycleRef.current = setTimeout(() => {
      setCompleted((prev) => [...prev, step.id]);
      setActiveStep((s) => s + 1);
    }, step.duration);

    return clearCycle;
  }, [phase, activeStep]);

  useEffect(() => {
    if (phase !== "result") return;
    cycleRef.current = setTimeout(() => {
      setTopicIndex((i) => (i + 1) % DEMO_TOPICS.length);
    }, 6000);
    return clearCycle;
  }, [phase]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.03] to-white/[0.01] overflow-hidden">

        {/* Terminal header bar */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
          <span className="ml-3 text-xs text-white/30 font-mono tracking-wider">NomosX — Autonomous Research Pipeline</span>
        </div>

        <div className="p-6 sm:p-8 space-y-6">

          {/* Query line */}
          <div className="flex items-start gap-3">
            <span className="text-indigo-400/60 font-mono text-sm mt-0.5 shrink-0">$</span>
            <div className="flex-1">
              <p className="text-xs text-white/30 font-mono mb-1 uppercase tracking-widest">Research Query</p>
              <p className="text-white/90 font-light text-base sm:text-lg leading-snug min-h-[1.75rem]">
                {displayed}
                {phase === "typewriter" && (
                  <span className="inline-block w-0.5 h-4 bg-indigo-400 ml-0.5 animate-pulse align-middle" />
                )}
              </p>
            </div>
          </div>

          {/* Pipeline steps */}
          {(phase === "pipeline" || phase === "result") && (
            <div className="space-y-2">
              {PIPELINE_STEPS.map((step, i) => {
                const done    = completedSteps.includes(step.id);
                const running = phase === "pipeline" && activeStep === i && !done;
                const Icon    = step.icon;
                return (
                  <div
                    key={step.id}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-300 ${
                      done    ? "bg-indigo-500/5 border border-indigo-500/10" :
                      running ? "bg-white/[0.04] border border-white/[0.08]" :
                                "opacity-30"
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                      done    ? "bg-indigo-500/20" :
                      running ? "bg-white/[0.08]" : "bg-white/[0.04]"
                    }`}>
                      {done ? (
                        <CheckCircle size={12} className="text-indigo-400" />
                      ) : (
                        <Icon size={12} className={running ? "text-white/60 animate-pulse" : "text-white/20"} />
                      )}
                    </div>
                    <span className={`text-xs font-mono tracking-widest w-16 shrink-0 ${done ? "text-indigo-400" : running ? "text-white/60" : "text-white/20"}`}>
                      {step.label}
                    </span>
                    <span className={`text-xs ${done ? "text-white/50" : running ? "text-white/40" : "text-white/20"}`}>
                      {step.detail}
                    </span>
                    {running && (
                      <div className="ml-auto flex gap-0.5">
                        {[0,1,2].map(d => (
                          <div key={d} className="w-1 h-1 rounded-full bg-indigo-400/60 animate-bounce" style={{ animationDelay: `${d * 150}ms` }} />
                        ))}
                      </div>
                    )}
                    {done && (
                      <span className="ml-auto text-xs text-indigo-400/40 font-mono">✓</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Result card */}
          {phase === "result" && (
            <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/[0.04] p-5 space-y-4 animate-in fade-in duration-500">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-green-400" />
                  <span className="text-xs font-medium text-green-400 uppercase tracking-wider">Brief Generated</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-white/40">
                  <span>{DEMO_RESULT.sources} sources scanned</span>
                  <span>{DEMO_RESULT.used} used</span>
                  <span className="text-indigo-300">{DEMO_RESULT.quality}% quality</span>
                </div>
              </div>

              <div className="space-y-2">
                {DEMO_RESULT.findings.map((f, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <ChevronRight size={12} className="text-indigo-400/60 mt-0.5 shrink-0" />
                    <span className="text-sm text-white/60">{f}</span>
                  </div>
                ))}
              </div>

              <p className="text-xs text-white/40 leading-relaxed border-t border-white/[0.06] pt-3">
                {DEMO_RESULT.summary}
              </p>
            </div>
          )}

          {/* Topic selector dots */}
          <div className="flex items-center justify-center gap-2 pt-2">
            {DEMO_TOPICS.map((_, i) => (
              <button
                key={i}
                onClick={() => setTopicIndex(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  i === topicIndex ? "bg-indigo-400 w-4" : "bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
