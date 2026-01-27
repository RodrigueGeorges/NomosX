"use client";

/**
 * NomosX Think Tank Layout
 * 
 * Unified layout with tab navigation for clear user flow
 * Integrates with Shell - uses horizontal tabs instead of sidebar
 * Flow: Overview → Verticals → Signals → Publications
 */

import { usePathname } from "next/navigation";
import Link from "next/link";
import Shell from "@/components/Shell";
import { 
  LayoutDashboard, 
  Layers, 
  Zap, 
  FileText,
  Building2
} from "lucide-react";

const NAV_ITEMS = [
  { 
    href: "/think-tank", 
    label: "Vue d'ensemble", 
    icon: LayoutDashboard,
    exact: true
  },
  { 
    href: "/think-tank/verticals", 
    label: "Verticales", 
    icon: Layers
  },
  { 
    href: "/think-tank/signals", 
    label: "Signaux", 
    icon: Zap
  },
  { 
    href: "/think-tank/publications", 
    label: "Publications", 
    icon: FileText
  }
];

export default function ThinkTankLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <Shell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center">
              <Building2 size={20} className="text-cyan-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Think Tank</h1>
              <p className="text-xs text-white/40">Publication institutionnelle autonome</p>
            </div>
          </div>
          
          {/* Flow Indicator */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.06]">
            <span className="text-[10px] text-white/30">Flow:</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500/60" title="Verticales" />
              <span className="text-white/20">→</span>
              <span className="w-2 h-2 rounded-full bg-amber-500/60" title="Signaux" />
              <span className="text-white/20">→</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500/60" title="Publications" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex items-center gap-1 p-1 bg-white/[0.02] rounded-xl border border-white/[0.06] w-fit">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href, item.exact);
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  active 
                    ? "bg-white/[0.08] text-white" 
                    : "text-white/50 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                <Icon size={16} className={active ? "text-cyan-400" : ""} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Content */}
        <div>
          {children}
        </div>
      </div>
    </Shell>
  );
}
