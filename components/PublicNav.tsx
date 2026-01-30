"use client";

/**
 * PublicNav Component
 * 
 * Reusable navigation for marketing pages (Home, About, Methodology)
 * Consistent styling and behavior across public pages
 */

import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

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
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#12121A] to-[#1A1A28] border border-white/10 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 120 120" fill="none">
              <defs>
                <linearGradient id="publicNavGradient" x1="30%" y1="0%" x2="70%" y2="100%">
                  <stop offset="0%" style={{stopColor: '#00D4FF', stopOpacity: 1}} />
                  <stop offset="100%" style={{stopColor: '#4A7FE0', stopOpacity: 1}} />
                </linearGradient>
              </defs>
              <path d="M 25 30 L 25 90 L 33 90 L 33 30 Z" fill="url(#publicNavGradient)"/>
              <path d="M 33 35 L 60 60 L 87 85 L 93 80 L 60 53 L 33 28 Z" fill="url(#publicNavGradient)"/>
              <path d="M 87 35 L 60 60 L 33 85 L 27 80 L 60 53 L 87 28 Z" fill="url(#publicNavGradient)" opacity="0.9"/>
              <path d="M 87 30 L 87 90 L 95 90 L 95 30 Z" fill="url(#publicNavGradient)"/>
              <circle cx="60" cy="60" r="6" fill="white"/>
              <circle cx="60" cy="60" r="3" fill="#00D4FF"/>
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight">
            Nomos<span className="text-cyan-400">X</span>
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
