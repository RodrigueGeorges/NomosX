"use client";

/**
 * Think Tank Page — Redirect to Dashboard
 * Legacy route maintained for backwards compatibility
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils"

export default function ThinkTankPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);
  
  return null;
}
