"use client";

/**
 * Redirect /methodology to /about
 * Methodology is explained in the About page (agent pipeline section)
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MethodologyRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/about");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
      <div className="text-center">
        <div className="text-cyan-400 mb-4">Redirection...</div>
        <p className="text-white/50 text-sm">
          La méthodologie est expliquée dans la page About
        </p>
      </div>
    </div>
  );
}
