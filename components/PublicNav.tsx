"use client";

/**
 * PublicNav Component
 * 
 * Reusable navigation for marketing pages (Home, About, Methodology)
 * Consistent styling and behavior across public pages
 */

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

interface PublicNavProps {
  currentPage?: "home" | "about" | "methodology";
  onSignInClick: () => void;
}

export default function PublicNav({ currentPage, onSignInClick }: PublicNavProps) {
  const router = useRouter();

  return (
    <nav className="border-b border-white/10 relative z-10">
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        <div 
          className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => router.push("/")}
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center relative">
            <span className="text-slate-100 font-serif text-sm font-bold tracking-tight">N</span>
            {/* Orbital elements */}
            <div className="absolute inset-0 rounded-full border border-slate-600/30"></div>
            <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-cyan-400 rounded-full opacity-60"></div>
            <div className="absolute right-0.5 top-1/2 -translate-y-1/2 w-0.5 h-0.5 bg-slate-400 rounded-full opacity-40"></div>
            <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-0.5 h-0.5 bg-slate-400 rounded-full opacity-40"></div>
            <div className="absolute left-0.5 top-1/2 -translate-y-1/2 w-0.5 h-0.5 bg-slate-400 rounded-full opacity-40"></div>
          </div>
          <span className="text-xl font-serif font-bold tracking-tight text-white">
            Nomos<span className="text-slate-400">X</span>
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push("/")}
            className={`text-sm transition-colors ${
              currentPage === "home" 
                ? "text-white" 
                : "text-white/60 hover:text-white"
            }`}
          >
            Home
          </button>
          <button 
            onClick={() => router.push("/about")}
            className={`text-sm transition-colors ${
              currentPage === "about" 
                ? "text-white" 
                : "text-white/60 hover:text-white"
            }`}
          >
            About
          </button>
          <button 
            onClick={() => router.push("/methodology")}
            className={`text-sm transition-colors ${
              currentPage === "methodology" 
                ? "text-white" 
                : "text-white/60 hover:text-white"
            }`}
          >
            Methodology
          </button>
          <Button variant="primary" size="sm" onClick={onSignInClick}>
            Sign In
          </Button>
        </div>
      </div>
    </nav>
  );
}
