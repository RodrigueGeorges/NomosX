"use client";
const React = require('react');
const {useEffect} = require('react');

/**
 * Think Tank Page — Redirect to Dashboard
 * Legacy route maintained for backwards compatibility
 */

const {useRouter} = require('next/navigation');
const {cn} = require('@/lib/utils');

export default function ThinkTankPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);
  
  return null;
}
