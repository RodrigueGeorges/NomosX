"use client";
import React from 'react';
import { useEffect } from 'react';

/**
 * Think Tank Page — Redirect to Dashboard
 * Legacy route maintained for backwards compatibility
 */

import { useRouter } from 'next/navigation';

export default function ThinkTankPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);
  
  return null;
}
