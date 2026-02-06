"use client";
import React from 'react';
import { useEffect } from 'react';

/**
 * Redirect /library to /publications
 * Legacy route from old "Library" model
 */

import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function LibraryPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace("/publications");
  }, [router]);
  
  return null;
}
