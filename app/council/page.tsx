"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * Redirect /council to /studio
 * Legacy route from old "Council" model
 */
export default function CouncilRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const q = searchParams.get("q");
    const redirectUrl = q ? `/studio?q=${encodeURIComponent(q)}` : "/studio";
    router.replace(redirectUrl);
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
      <div className="text-center">
        <div className="text-cyan-400 mb-4">Redirection...</div>
        <p className="text-white/50 text-sm">
          La page Council a été remplacée par le Studio
        </p>
      </div>
    </div>
  );
}
