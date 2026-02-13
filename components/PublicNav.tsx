"use client";
import React from 'react';

/**
 * PublicNav Component
 * 
 * Reusable navigation for marketing pages (Home, About, Methodology)
 * Consistent styling and behavior across public pages
 */

import { useRouter } from 'next/navigation';

interface PublicNavProps {
  currentPage?: "home" | "about" | "methodology" | "pricing";
  onSignInClick: () => void;
  isAuthenticated?: boolean;
}

export default function PublicNav({ currentPage, onSignInClick, isAuthenticated }: PublicNavProps) {
  const router = useRouter();

  const navLinks: { label: string; page: PublicNavProps["currentPage"]; href: string }[] = [
    { label: "Home", page: "home", href: "/" },
    { label: "About", page: "about", href: "/about" },
    { label: "Methodology", page: "methodology", href: "/methodology" },
    { label: "Pricing", page: "pricing", href: "/pricing" },
  ];

  return (
    <nav className="relative z-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 h-20 flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => router.push("/")}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00D4FF]/15 to-[#7C3AED]/10 border border-white/[0.08] flex items-center justify-center group-hover:border-[#00D4FF]/20 transition-all">
            <span className="font-display text-base font-medium nx-gradient-text">N</span>
          </div>
          <span className="font-display text-lg font-medium tracking-tight">
            Nomos<span className="text-[#00D4FF]">X</span>
          </span>
        </div>
        
        <div className="flex items-center gap-6">
          {navLinks.map(link => (
            <button
              key={link.page}
              onClick={() => router.push(link.href)}
              className={`text-sm transition-colors hidden sm:block ${
                currentPage === link.page
                  ? "text-white/80"
                  : "text-white/40 hover:text-white/80"
              }`}
            >
              {link.label}
            </button>
          ))}
          {isAuthenticated ? (
            <button 
              onClick={() => router.push("/dashboard")}
              className="px-4 py-2 rounded-xl bg-white/[0.06] border border-white/[0.08] text-sm font-medium text-white hover:bg-white/[0.1] hover:border-white/[0.12] transition-all"
            >
              Open Think Tank
            </button>
          ) : (
            <button 
              onClick={onSignInClick}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00D4FF]/20 to-[#3B82F6]/20 border border-[#00D4FF]/20 text-sm font-medium text-white hover:border-[#00D4FF]/40 transition-all shadow-[0_0_20px_rgba(0,212,255,0.1)]"
            >
              Get Started
            </button>
          )}
        </div>
      </div>
      <div className="nx-divider" />
    </nav>
  );
}
