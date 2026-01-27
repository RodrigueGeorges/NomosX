"use client";

/**
 * NomosX Think Tank Layout
 * 
 * Unified layout with sidebar navigation for clear user flow
 * Flow: Overview → Verticals → Signals → Publications
 */

import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Layers, 
  Zap, 
  FileText,
  Settings,
  ChevronRight
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
    icon: Layers,
    description: "Domaines thématiques"
  },
  { 
    href: "/think-tank/signals", 
    label: "Signaux", 
    icon: Zap,
    description: "Pipeline de détection"
  },
  { 
    href: "/think-tank/publications", 
    label: "Publications", 
    icon: FileText,
    description: "Contenus publiés"
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
    <div className="flex h-full">
      {/* Sidebar Navigation */}
      <aside className="w-64 shrink-0 border-r border-white/[0.06] bg-[#0A0A0B]">
        <div className="p-4 border-b border-white/[0.06]">
          <h1 className="text-lg font-bold text-white flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center">
              <LayoutDashboard size={16} className="text-cyan-400" />
            </div>
            Think Tank
          </h1>
          <p className="text-xs text-white/40 mt-1">
            Publication institutionnelle
          </p>
        </div>

        <nav className="p-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href, item.exact);
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${
                  active 
                    ? "bg-white/[0.08] text-white" 
                    : "text-white/50 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                <Icon size={18} className={active ? "text-cyan-400" : "text-white/40 group-hover:text-white/60"} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{item.label}</p>
                  {item.description && (
                    <p className="text-[10px] text-white/30 truncate">{item.description}</p>
                  )}
                </div>
                {active && (
                  <ChevronRight size={14} className="text-cyan-400" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Flow Indicator */}
        <div className="absolute bottom-0 left-0 w-64 p-4 border-t border-white/[0.06]">
          <div className="flex items-center justify-between text-[10px] text-white/30">
            <span>Flow</span>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-cyan-500/50" />
              <span>→</span>
              <span className="w-2 h-2 rounded-full bg-amber-500/50" />
              <span>→</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500/50" />
            </div>
          </div>
          <p className="text-[10px] text-white/20 mt-1">
            Verticales → Signaux → Publications
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
