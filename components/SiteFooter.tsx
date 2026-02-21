"use client";

import { useRouter } from "next/navigation";
import { NomosXLogo } from "@/components/brand/NomosXLogo";
import { ArrowRight, Github, Twitter } from "lucide-react";

const LINKS = {
  Product: [
    { label: "Methodology", href: "/methodology" },
    { label: "Publications", href: "/publications" },
    { label: "Pricing", href: "/pricing" },
    { label: "API Access", href: "/pricing" },
  ],
  Research: [
    { label: "About the Think Tank", href: "/about" },
    { label: "The 8 Researchers", href: "/about" },
    { label: "Council Protocol", href: "/methodology" },
    { label: "Citation Standards", href: "/methodology" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/about" },
    { label: "Privacy Policy", href: "/about" },
    { label: "Terms of Service", href: "/about" },
  ],
};

const STATS = [
  { value: "250M+", label: "Sources indexed" },
  { value: "8", label: "PhD agents" },
  { value: "40+", label: "Countries" },
  { value: "99.2%", label: "Citation accuracy" },
];

interface SiteFooterProps {
  onSignInClick?: () => void;
}

export default function SiteFooter({ onSignInClick }: SiteFooterProps) {
  const router = useRouter();

  return (
    <footer className="relative border-t border-white/[0.06] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_100%,rgba(99,102,241,0.05),transparent_70%)]" />
      </div>

      {/* CTA strip */}
      <div className="relative border-b border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-14 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight">
              The research runs.{" "}
              <span className="nx-gradient-text">You read the findings.</span>
            </h3>
            <p className="text-sm text-white/35 max-w-md">
              Join 2,400+ researchers receiving autonomous intelligence every week.
            </p>
          </div>
          <button
            onClick={onSignInClick}
            className="group flex-shrink-0 flex items-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02]"
          >
            Start free — no card required
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="relative border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {STATS.map((s, i) => (
              <div key={i} className="text-center">
                <div className="font-display text-2xl font-bold text-white mb-0.5">{s.value}</div>
                <div className="text-xs text-white/25 tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand column */}
          <div className="md:col-span-1">
            <div
              className="cursor-pointer mb-5 inline-block"
              onClick={() => router.push("/")}
            >
              <NomosXLogo size="sm" variant="full" />
            </div>
            <p className="text-sm text-white/30 leading-relaxed mb-6 max-w-[220px]">
              An autonomous AI think tank. 22 PhD-calibrated agents. Zero human editorial intervention.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg border border-white/[0.08] bg-white/[0.03] flex items-center justify-center text-white/30 hover:text-white/60 hover:border-white/[0.15] hover:bg-white/[0.06] transition-all duration-200"
              >
                <Twitter size={13} />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg border border-white/[0.08] bg-white/[0.03] flex items-center justify-center text-white/30 hover:text-white/60 hover:border-white/[0.15] hover:bg-white/[0.06] transition-all duration-200"
              >
                <Github size={13} />
              </a>
              <div className="flex items-center gap-1.5 ml-1">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                </span>
                <span className="text-[10px] text-white/20 font-medium">Pipeline live</span>
              </div>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([category, links]) => (
            <div key={category}>
              <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-white/25 mb-5">
                {category}
              </p>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => router.push(link.href)}
                      className="text-sm text-white/35 hover:text-white/65 transition-colors duration-200 text-left"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/18">
            © 2026 NomosX · Autonomous Think Tank · All rights reserved
          </p>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/60" />
            <p className="text-xs text-white/18">
              Powered by GPT-4 · OpenAlex · 250M+ academic sources
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
