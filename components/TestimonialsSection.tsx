"use client";

import { Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    quote:
      "NomosX replaced three hours of weekly literature review. The Council Protocol catches contradictions I would have missed entirely.",
    name: "Dr. Camille Renard",
    title: "Senior Policy Analyst",
    org: "Sciences Po Paris",
    initials: "CR",
    color: "from-indigo-500 to-indigo-700",
    glow: "rgba(99,102,241,0.35)",
  },
  {
    quote:
      "The citation precision is remarkable. Every [SRC-N] tag traces back to a real paper. I've started citing NomosX briefs in my own research.",
    name: "Prof. Alistair Drummond",
    title: "Professor of International Law",
    org: "University of Edinburgh",
    initials: "AD",
    color: "from-violet-500 to-violet-700",
    glow: "rgba(139,92,246,0.35)",
  },
  {
    quote:
      "We use the Strategic Reports for board-level briefings. The scenario planning section alone saves us two weeks of consulting fees.",
    name: "Nadia Osei-Bonsu",
    title: "Head of Research",
    org: "African Development Institute",
    initials: "NO",
    color: "from-indigo-400 to-violet-600",
    glow: "rgba(129,140,248,0.35)",
  },
  {
    quote:
      "I was skeptical about fully autonomous research. After six months, I trust the pipeline more than most junior analysts I've supervised.",
    name: "Dr. Henrik Larsson",
    title: "Chief Economist",
    org: "Nordic Policy Forum",
    initials: "HL",
    color: "from-purple-500 to-indigo-700",
    glow: "rgba(168,85,247,0.35)",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="relative px-6 sm:px-8 py-24 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(99,102,241,0.06),transparent_70%)]" />
      </div>

      <div className="max-w-6xl mx-auto relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            <span className="text-[11px] text-indigo-300 font-semibold tracking-[0.2em] uppercase">
              From the field
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
            Researchers who rely on it.
            <br />
            <span className="nx-gradient-text">Every week.</span>
          </h2>
          <p className="text-base text-white/40 max-w-xl mx-auto">
            Policy analysts, academics, and institutional researchers across 40+
            countries.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-7 hover:border-indigo-500/20 hover:bg-white/[0.035] transition-all duration-500"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                <Quote size={28} className="text-indigo-400" />
              </div>

              <p className="text-[15px] text-white/65 leading-relaxed mb-7 font-light italic">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center flex-shrink-0`}
                  style={{
                    boxShadow: `0 0 16px ${t.glow}`,
                  }}
                >
                  <span className="text-[11px] font-bold text-white">
                    {t.initials}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white/85">
                    {t.name}
                  </p>
                  <p className="text-xs text-white/35">
                    {t.title} · {t.org}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex items-center justify-center gap-3">
          <div className="h-px flex-1 max-w-[120px] bg-gradient-to-r from-transparent to-white/8" />
          <p className="text-xs text-white/20 text-center">
            Join{" "}
            <span className="text-white/35 font-semibold">2,400+</span>{" "}
            researchers already subscribed
          </p>
          <div className="h-px flex-1 max-w-[120px] bg-gradient-to-l from-transparent to-white/8" />
        </div>
      </div>
    </section>
  );
}
