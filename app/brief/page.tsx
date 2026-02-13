"use client";
import React from 'react';
import { Suspense,useEffect } from 'react';

import { useRouter,useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

/**
 * Inner component that uses useSearchParams
 */
function BriefRedirectInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const q = searchParams.get("q");
    const redirectUrl = q ? `/studio?q=${encodeURIComponent(q)}` : "/studio";
    router.replace(redirectUrl);
  }, [router, searchParams]);

  return (
    <div className="text-center">
      <div className="text-cyan-400 mb-4">Redirecting...</div>
      <p className="text-white/50 text-sm">
        The Brief page has been replaced by Studio
      </p>
    </div>
  );
}

/**
 * Redirect /brief to /studio
 * Legacy route from old "Brief" model
 */
export default function BriefRedirect() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
      <Suspense fallback={
        <div className="text-center">
          <div className="text-cyan-400 mb-4">Loading...</div>
        </div>
      }>
        <BriefRedirectInner />
      </Suspense>
    </div>
  );
}
