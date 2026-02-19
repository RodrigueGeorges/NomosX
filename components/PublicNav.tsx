"use client";
import React from 'react';

/**
 * PublicNav Component
 * 
 * Reusable navigation for marketing pages (Home, About, Methodology)
 * Consistent styling and behavior across public pages
 */

import { useRouter } from 'next/navigation';
import { NomosXLogo } from '@/components/brand/NomosXLogo';

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
    <nav className="sticky top-0 z-50 w-full">
      <div className="absolute inset-0 bg-[#09090b]/80 backdrop-blur-xl border-b border-white/[0.06]" />
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div 
          className="cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => router.push("/")}
        >
          <NomosXLogo size="sm" variant="full" />
        </div>
        
        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <button
              key={link.page}
              onClick={() => router.push(link.href)}
              className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-200 ${
                currentPage === link.page
                  ? "text-white bg-white/[0.08]"
                  : "text-white/50 hover:text-white/80 hover:bg-white/[0.04]"
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* CTA */}
        {isAuthenticated ? (
          <button 
            onClick={() => router.push("/dashboard")}
            className="px-4 py-2 rounded-lg bg-white/[0.08] border border-white/[0.08] text-[13px] font-medium text-white hover:bg-white/[0.12] transition-all duration-200"
          >
            Open Dashboard
          </button>
        ) : (
          <button 
            onClick={onSignInClick}
            className="px-4 py-2 rounded-lg bg-indigo-500 text-[13px] font-medium text-white hover:bg-indigo-400 transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
          >
            Start Free
          </button>
        )}
      </div>
    </nav>
  );
}
