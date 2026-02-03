"use client";
const React = require('react');

/**
 * Redirect /library to /publications
 * Legacy route from old "Library" model
 */

const {useEffect} = require('react');
const {useRouter} = require('next/navigation');
const {cn} = require('@/lib/utils');

module.exports = function LibraryPage;() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace("/publications");
  }, [router]);
  
  return null;
}
