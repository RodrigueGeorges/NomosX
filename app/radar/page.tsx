"use client";
const React = require('react');

/**
 * Radar Page — Redirect to Signals
 * Legacy route maintained for backwards compatibility
 */

const {useEffect} = require('react');
const {useRouter} = require('next/navigation');
const {cn} = require('@/lib/utils');

export default function RadarPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace("/signals");
  }, [router]);
  
  return null;
}
