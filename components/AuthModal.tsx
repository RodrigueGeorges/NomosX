"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Mail, Chrome as Google, Github } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuestion?: string;
}

export default function AuthModal({ isOpen, onClose, initialQuestion }: AuthModalProps) {
  const router = useRouter();
  const [mode, setMode] = useState<"oauth" | "email">("oauth");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOAuth = async (provider: "google" | "github") => {
    setLoading(true);
    // TODO: Implémenter OAuth réel
    // Pour l'instant, simulation
    setTimeout(() => {
      // Sauvegarder le token et l'utilisateur
      const fakeUser = {
        id: "user_" + Math.random().toString(36).substr(2, 9),
        email: `user@${provider}.com`,
        name: `User ${provider}`,
      };
      localStorage.setItem("auth_token", "fake_token_" + Date.now());
      localStorage.setItem("auth_user", JSON.stringify(fakeUser));
      
      const redirectUrl = initialQuestion 
        ? `/dashboard?q=${encodeURIComponent(initialQuestion)}`
        : "/dashboard";
      router.push(redirectUrl);
      onClose();
    }, 1000);
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Implémenter signup email réel
    setTimeout(() => {
      // Sauvegarder le token et l'utilisateur
      const fakeUser = {
        id: "user_" + Math.random().toString(36).substr(2, 9),
        email: email,
        name: email.split("@")[0],
      };
      localStorage.setItem("auth_token", "fake_token_" + Date.now());
      localStorage.setItem("auth_user", JSON.stringify(fakeUser));
      
      const redirectUrl = initialQuestion 
        ? `/dashboard?q=${encodeURIComponent(initialQuestion)}`
        : "/dashboard";
      router.push(redirectUrl);
      onClose();
    }, 1000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-8 sm:p-10 max-w-lg w-full relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-transparent blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-500/8 to-transparent blur-3xl" />
        </div>

        {/* Header */}
        <div className="relative mb-10 text-center">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-3">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-[#12121A] to-[#1A1A28] border border-white/10 flex items-center justify-center shadow-2xl">
                  <svg width="36" height="36" viewBox="0 0 120 120" fill="none">
                    <defs>
                      <linearGradient id="authGradient" x1="30%" y1="0%" x2="70%" y2="100%">
                        <stop offset="0%" style={{stopColor: '#00D4FF', stopOpacity: 1}} />
                        <stop offset="100%" style={{stopColor: '#4A7FE0', stopOpacity: 1}} />
                      </linearGradient>
                    </defs>
                    <path d="M 25 30 L 25 90 L 33 90 L 33 30 Z" fill="url(#authGradient)"/>
                    <path d="M 33 35 L 60 60 L 87 85 L 93 80 L 60 53 L 33 28 Z" fill="url(#authGradient)"/>
                    <path d="M 87 35 L 60 60 L 33 85 L 27 80 L 60 53 L 87 28 Z" fill="url(#authGradient)" opacity="0.9"/>
                    <path d="M 87 30 L 87 90 L 95 90 L 95 30 Z" fill="url(#authGradient)"/>
                    <circle cx="60" cy="60" r="6" fill="white"/>
                    <circle cx="60" cy="60" r="3" fill="#00D4FF"/>
                  </svg>
                </div>
              </div>
              <span className="text-3xl font-bold tracking-tight">
                Nomos<span className="text-cyan-400">X</span>
              </span>
            </div>
          </div>

          {/* Small caps */}
          <div className="text-xs text-cyan-400/60 tracking-[0.25em] uppercase mb-4">
            Institutional Intelligence
          </div>

          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl font-light leading-tight mb-3">
            <span className="bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent">
              Start your analysis
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-base text-white/50 leading-relaxed max-w-md mx-auto mb-6">
            Join Fortune 500 companies and research institutions 
            using autonomous agent intelligence.
          </p>

          {/* Trust Bar */}
          <div className="flex items-center justify-center gap-3 text-xs text-white/30 tracking-[0.15em] uppercase">
            <span>98.7% Accuracy</span>
            <div className="w-1 h-1 rounded-full bg-cyan-400/40" />
            <span>60s Analysis</span>
            <div className="w-1 h-1 rounded-full bg-cyan-400/40" />
            <span>SOC 2 Compliant</span>
          </div>
        </div>

        {mode === "oauth" ? (
          <div className="relative space-y-3">
            {/* OAuth Buttons - Premium */}
            <button
              onClick={() => handleOAuth("google")}
              disabled={loading}
              className="group relative w-full p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center justify-center gap-3 text-white/90">
                <Google size={20} strokeWidth={1.5} />
                <span className="font-medium">Continue with Google</span>
              </div>
            </button>

            <button
              onClick={() => handleOAuth("github")}
              disabled={loading}
              className="group relative w-full p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center justify-center gap-3 text-white/90">
                <Github size={20} strokeWidth={1.5} />
                <span className="font-medium">Continue with GitHub</span>
              </div>
            </button>

            {/* Divider Premium */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/[0.08]"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-[#0A0A0B] px-4 text-xs text-white/40 tracking-[0.2em] uppercase">Or</span>
              </div>
            </div>

            {/* Email Button Premium */}
            <button
              onClick={() => setMode("email")}
              className="group relative w-full p-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium shadow-[0_0_30px_rgba(0,212,255,0.3)] hover:shadow-[0_0_50px_rgba(0,212,255,0.5)] transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 blur-sm transition-opacity" />
              <div className="relative flex items-center justify-center gap-3">
                <Mail size={20} strokeWidth={2} />
                <span>Continue with Email</span>
              </div>
            </button>
          </div>
        ) : (
          <form onSubmit={handleEmailSignup} className="relative space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-3 text-white/70">
                Email address
              </label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  autoFocus
                  className="bg-white/[0.03] border-white/10 focus:border-cyan-500/50 text-base h-12 pl-11"
                />
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400/60" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email}
              className="group relative w-full p-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium shadow-[0_0_30px_rgba(0,212,255,0.3)] hover:shadow-[0_0_50px_rgba(0,212,255,0.5)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 blur-sm transition-opacity" />
              <span className="relative">
                {loading ? "Connecting..." : "Continue"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setMode("oauth")}
              className="text-sm text-white/50 hover:text-white/80 transition-colors w-full text-center flex items-center justify-center gap-2"
            >
              <span>←</span>
              <span>Back to other options</span>
            </button>
          </form>
        )}

        {/* Footer Premium */}
        <div className="relative mt-8 pt-6 border-t border-white/[0.08]">
          {/* Trust Indicators */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="flex items-center gap-1.5 text-xs text-white/40">
              <div className="relative flex-shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 rounded-full bg-emerald-400/60 animate-pulse"></div>
              </div>
              <span>Enterprise-grade security</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-white/40">
              <div className="relative flex-shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 rounded-full bg-cyan-400/60 animate-pulse"></div>
              </div>
              <span>No credit card required</span>
            </div>
          </div>

          {/* Legal */}
          <p className="text-xs text-white/30 text-center leading-relaxed">
            By continuing, you agree to our{" "}
            <a href="/terms" className="text-cyan-400/60 hover:text-cyan-400 transition-colors">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-cyan-400/60 hover:text-cyan-400 transition-colors">
              Privacy Policy
            </a>
          </p>
        </div>

        {loading && (
          <div className="relative mt-6 text-center">
            <div className="inline-flex items-center gap-3 text-sm text-cyan-400">
              <div className="relative">
                <div className="w-4 h-4 border-2 border-cyan-400/20 rounded-full"></div>
                <div className="absolute inset-0 w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <span>Securing your connection...</span>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
