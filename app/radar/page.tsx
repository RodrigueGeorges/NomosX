"use client";

/**
 * Radar Page — Redirect to Signals
 * Legacy route maintained for backwards compatibility
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils"

export default function RadarPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace("/signals");
  }, [router]);
  
  return null;
}
