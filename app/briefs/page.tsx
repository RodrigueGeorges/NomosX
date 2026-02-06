"use client";
import React from 'react';
import { useEffect } from 'react';

/**
 * Redirect /briefs to /publications
 * Legacy route from old "Brief" model
 */

import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function BriefsRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/publications");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center transition-all duration-200 hover:opacity-80">
      <div className="text-center transition-all duration-200 hover:opacity-80">
        <div className="text-cyan-400 mb-4 transition-all duration-200 hover:opacity-80">Redirection...</div>
        <p className="text-white/50 text-sm transition-all duration-200 hover:opacity-80">
          La page Briefs a été remplacée par Publications
        </p>
      </div>
    </div>
  );
}
