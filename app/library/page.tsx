"use client";
const React = require('react');
const {useEffect} = require('react');

/**
 * Redirect /library to /publications
 * Legacy route from old "Library" model
 */

const {useRouter} = require('next/navigation');
const {cn} = require('@/lib/utils');

export default function LibraryPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace("/publications");
  }, [router]);
  
  return null;
}
