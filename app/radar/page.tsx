"use client";
import React from 'react';
import { useEffect } from 'react';

/**
 * Radar Page — Redirect to Signals
 * Legacy route maintained for backwards compatibility
 */

import { useRouter } from 'next/navigation';

export default function RadarPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace("/signals");
  }, [router]);
  
  return null;
}
