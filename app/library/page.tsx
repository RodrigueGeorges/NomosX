"use client";

/**
 * Redirect /library to /publications
 * Legacy route from old "Library" model
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LibraryPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace("/publications");
  }, [router]);
  
  return null;
}
