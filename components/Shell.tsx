"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  Radar, 
  Search, 
  Library, 
  Settings, 
  LogOut,
  User as UserIcon,
  Menu,
  X
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

// Navigation principale
const mainNav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/library", label: "Bibliothèque", icon: Library },
  { href: "/radar", label: "Radar", icon: Radar },
  { href: "/search", label: "Explorer", icon: Search },
];

export default function Shell({ children }: { children: React.ReactNode }) {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(true);
  const [mounted, setMounted] = useState(false);

  const isActive = (href: string) => pathname === href;

  // Mount particles on client only to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect non-authenticated users to home
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // Éviter les boucles de redirection
      if (pathname !== "/") {
        router.push("/");
      }
    }
  }, [loading, isAuthenticated, router, pathname]);

  // Keep overlay visible for smooth fade-out
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setShowLoadingOverlay(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  return (
    <>
      {/* Loading Overlay - Crossfade smooth */}
      {showLoadingOverlay && (
        <div className={`fixed inset-0 z-50 min-h-screen bg-[#0B0B0D] flex items-center justify-center transition-opacity duration-500 ${loading ? 'opacity-100' : 'opacity-0'}`}>
        {/* Background Futuriste */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[800px]">
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/8 via-blue-500/4 to-transparent blur-3xl" />
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/6 via-transparent to-cyan-500/6 blur-3xl" />
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px]" />
        </div>
        
        <div className="text-center relative z-10">
          <div className="mb-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#12121A] to-[#1A1A28] border border-white/10 flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-cyan-500/20">
              <svg width="56" height="56" viewBox="0 0 120 120" fill="none">
                <defs>
                  <linearGradient id="shellLoadingGradient" x1="30%" y1="0%" x2="70%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#00D4FF', stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: '#4A7FE0', stopOpacity: 1}} />
                  </linearGradient>
                </defs>
                <path d="M 25 30 L 25 90 L 33 90 L 33 30 Z" fill="url(#shellLoadingGradient)"/>
                <path d="M 33 35 L 60 60 L 87 85 L 93 80 L 60 53 L 33 28 Z" fill="url(#shellLoadingGradient)"/>
                <path d="M 87 35 L 60 60 L 33 85 L 27 80 L 60 53 L 87 28 Z" fill="url(#shellLoadingGradient)" opacity="0.9"/>
                <path d="M 87 30 L 87 90 L 95 90 L 95 30 Z" fill="url(#shellLoadingGradient)"/>
                <circle cx="60" cy="60" r="6" fill="white"/>
                <circle cx="60" cy="60" r="3" fill="#00D4FF"/>
              </svg>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent mb-2">
              NomosX
            </h1>
            <p className="text-sm text-white/50">Think Tank Agentique</p>
          </div>
          <div className="relative w-12 h-12 mx-auto">
            <div className="absolute inset-0 border-2 border-cyan-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
        </div>
      )}

      {/* Main Content - Always rendered */}
      <div className="min-h-screen relative bg-[#0B0B0D]">
      {/* Background Futuriste - Identique à Home */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Mesh gradient principal */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1400px] h-[900px]">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/8 via-blue-500/4 to-transparent blur-3xl" />
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/6 via-transparent to-cyan-500/6 blur-3xl" />
        </div>
        
        {/* Grid pattern subtil */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px]" />
        
        {/* Particles réseau agentique - Client only to avoid hydration mismatch */}
        {mounted && (
          <div className="absolute inset-0">
            {[...Array(15)].map((_, i) => (
              <div 
                key={i}
                className="absolute w-1 h-1 rounded-full bg-cyan-400/20 animate-pulse"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Header Premium - Plus épuré */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-[#0B0B0D]/90 border-b border-white/[0.08]">
        <div className="px-6 lg:px-8 py-4 flex items-center justify-between max-w-[1400px] mx-auto">
          
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#12121A] to-[#1A1A28] border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform">
              <svg width="20" height="20" viewBox="0 0 120 120" fill="none">
                <defs>
                  <linearGradient id="shellGradient" x1="30%" y1="0%" x2="70%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#00D4FF', stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: '#4A7FE0', stopOpacity: 1}} />
                  </linearGradient>
                </defs>
                <path d="M 25 30 L 25 90 L 33 90 L 33 30 Z" fill="url(#shellGradient)"/>
                <path d="M 33 35 L 60 60 L 87 85 L 93 80 L 60 53 L 33 28 Z" fill="url(#shellGradient)"/>
                <path d="M 87 35 L 60 60 L 33 85 L 27 80 L 60 53 L 87 28 Z" fill="url(#shellGradient)" opacity="0.9"/>
                <path d="M 87 30 L 87 90 L 95 90 L 95 30 Z" fill="url(#shellGradient)"/>
                <circle cx="60" cy="60" r="6" fill="white"/>
                <circle cx="60" cy="60" r="3" fill="#00D4FF"/>
              </svg>
            </div>
            <span className="text-lg font-semibold tracking-tight text-white">
              Nomos<span className="text-cyan-400">X</span>
            </span>
          </Link>

          {/* Desktop Navigation - Minimaliste */}
          <nav className="hidden lg:flex items-center gap-1">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  px-3 py-2 rounded-lg text-sm font-medium
                  inline-flex items-center gap-2 whitespace-nowrap
                  transition-all duration-200
                  ${isActive(item.href)
                    ? 'text-white bg-white/[0.08]'
                    : 'text-white/50 hover:text-white/80 hover:bg-white/[0.04]'
                  }
                `}
              >
                <item.icon size={16} strokeWidth={2} />
                <span>{item.label}</span>
              </Link>
            ))}

            {/* Settings Link */}
            <Link
              href="/settings"
              className={`
                px-3 py-2 rounded-lg text-sm font-medium
                inline-flex items-center gap-2 whitespace-nowrap
                transition-all duration-200
                ${isActive("/settings")
                  ? 'text-white bg-white/[0.08]'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/[0.04]'
                }
              `}
            >
              <Settings size={16} strokeWidth={2} />
              <span>Paramètres</span>
            </Link>
          </nav>

          {/* Right Side - User & Logout */}
          <div className="flex items-center gap-3">
            {user && (
              <>
                {/* User Badge (Desktop) */}
                <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-white/[0.04] rounded-lg border border-white/[0.08]">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                    <UserIcon size={14} className="text-white" strokeWidth={2.5} />
                  </div>
                  <span className="text-sm font-medium text-white/80">{user.name || user.email?.split('@')[0]}</span>
                </div>

                {/* Logout Button (Desktop) */}
                <button
                  onClick={logout}
                  className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                  title="Se déconnecter"
                >
                  <LogOut size={16} strokeWidth={2} />
                </button>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-white/50 hover:text-white/80 hover:bg-white/[0.04] transition-all"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 top-[65px]">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => setMobileMenuOpen(false)}
          />
          <nav className="relative bg-[#111113] border-r border-white/[0.08] h-full w-64 p-4 overflow-y-auto">
            <div className="space-y-1 mb-6">
              {[...mainNav, { href: "/settings", label: "Paramètres", icon: Settings }].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                    transition-all duration-200
                    ${isActive(item.href)
                      ? 'text-white bg-white/[0.08]'
                      : 'text-white/60 hover:text-white/90 hover:bg-white/[0.04]'
                    }
                  `}
                >
                  <item.icon size={18} strokeWidth={2} />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            {/* User Menu (Mobile) */}
            {user && (
              <div className="pt-4 border-t border-white/[0.08] space-y-2">
                <div className="px-3 py-2 bg-white/[0.03] rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                      <UserIcon size={14} className="text-white" strokeWidth={2.5} />
                    </div>
                    <span className="text-sm font-medium text-white/80">{user.name || user.email}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <LogOut size={18} strokeWidth={2} />
                  <span>Déconnexion</span>
                </button>
              </div>
            )}
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="px-6 lg:px-8 py-12 max-w-[1400px] mx-auto relative z-10">{children}</main>

      {/* Footer - Minimaliste */}
      <footer className="px-6 lg:px-8 py-8 border-t border-white/[0.08] mt-16 relative z-10">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center opacity-60">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="3" fill="white"/>
                  <circle cx="12" cy="4" r="2" fill="white" opacity="0.7"/>
                  <circle cx="20" cy="12" r="2" fill="white" opacity="0.7"/>
                  <circle cx="12" cy="20" r="2" fill="white" opacity="0.7"/>
                  <circle cx="4" cy="12" r="2" fill="white" opacity="0.7"/>
                </svg>
              </div>
              <div>
                <span className="text-sm font-semibold text-white/60">
                  Nomos<span className="text-cyan-400/60">X</span>
                </span>
                <p className="text-xs text-white/30">Think Tank Agentique</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-xs text-white/30">
              <Link href="/radar" className="hover:text-white/60 transition-colors">Radar</Link>
              <Link href="/library" className="hover:text-white/60 transition-colors">Bibliothèque</Link>
              <span>© 2026 NomosX</span>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </>
  );
}
