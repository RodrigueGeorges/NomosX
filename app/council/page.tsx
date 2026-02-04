"use client";
const React = require('react');
const {Suspense,useEffect} = require('react');

const {useRouter,useSearchParams} = require('next/navigation');
const {cn} = require('@/lib/utils');

/**
 * Inner component that uses useSearchParams
 */
function CouncilRedirectInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const q = searchParams.get("q");
    const redirectUrl = q ? `/studio?q=${encodeURIComponent(q)}` : "/studio";
    router.replace(redirectUrl);
  }, [router, searchParams]);

  return (
    <div className="text-center transition-all duration-200 hover:opacity-80">
      <div className="text-cyan-400 mb-4 transition-all duration-200 hover:opacity-80">Redirecting...</div>
      <p className="text-white/50 text-sm transition-all duration-200 hover:opacity-80">
        The Council page has been replaced by Studio
      </p>
    </div>
  );
}

/**
 * Redirect /council to /studio
 * Legacy route from old "Council" model
 */
export default function CouncilRedirect() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center transition-all duration-200 hover:opacity-80">
      <Suspense fallback={
        <div className="text-center transition-all duration-200 hover:opacity-80">
          <div className="text-cyan-400 mb-4 transition-all duration-200 hover:opacity-80">Loading...</div>
        </div>
      }>
        <CouncilRedirectInner />
      </Suspense>
    </div>
  );
}
