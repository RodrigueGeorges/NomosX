"use client";

import { useEffect, useRef } from "react";

interface Provider {
  name: string;
  displayName: string;
  category: "academic" | "institutional" | "thinktank";
}

const PROVIDERS: Provider[] = [
  // Academic (8)
  { name: "openalex", displayName: "OpenAlex", category: "academic" },
  { name: "semanticscholar", displayName: "Semantic Scholar", category: "academic" },
  { name: "crossref", displayName: "Crossref", category: "academic" },
  { name: "pubmed", displayName: "PubMed", category: "academic" },
  { name: "arxiv", displayName: "arXiv", category: "academic" },
  { name: "hal", displayName: "HAL", category: "academic" },
  { name: "thesesfr", displayName: "theses.fr", category: "academic" },
  { name: "base", displayName: "BASE", category: "academic" },
  
  // Institutional (15)
  { name: "worldbank", displayName: "World Bank", category: "institutional" },
  { name: "imf", displayName: "IMF", category: "institutional" },
  { name: "oecd", displayName: "OECD", category: "institutional" },
  { name: "nato", displayName: "NATO", category: "institutional" },
  { name: "un", displayName: "United Nations", category: "institutional" },
  { name: "odni", displayName: "ODNI", category: "institutional" },
  { name: "nist", displayName: "NIST", category: "institutional" },
  { name: "cisa", displayName: "CISA", category: "institutional" },
  { name: "enisa", displayName: "ENISA", category: "institutional" },
  { name: "sgdsn", displayName: "SGDSN", category: "institutional" },
  { name: "eeas", displayName: "EEAS", category: "institutional" },
  { name: "bis", displayName: "BIS", category: "institutional" },
  { name: "undp", displayName: "UNDP", category: "institutional" },
  { name: "oecd", displayName: "OECD", category: "institutional" },
  { name: "nsa", displayName: "NSA", category: "institutional" },
  
  // Think Tanks (12)
  { name: "brookings", displayName: "Brookings", category: "thinktank" },
  { name: "rand", displayName: "RAND", category: "thinktank" },
  { name: "cset", displayName: "CSET", category: "thinktank" },
  { name: "govai", displayName: "GovAI", category: "thinktank" },
  { name: "cnas", displayName: "CNAS", category: "thinktank" },
  { name: "newamerica", displayName: "New America", category: "thinktank" },
  { name: "ainow", displayName: "AI Now Institute", category: "thinktank" },
  { name: "datasociety", displayName: "Data & Society", category: "thinktank" },
  { name: "cdt", displayName: "CDT", category: "thinktank" },
  { name: "iaps", displayName: "IAPS", category: "thinktank" },
  { name: "scsp", displayName: "SCSP", category: "thinktank" },
  { name: "rstreet", displayName: "R Street", category: "thinktank" },
];

export default function ProviderShowcase() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationFrameId: number;
    let scrollPosition = 0;
    const scrollSpeed = 0.5;

    const animate = () => {
      scrollPosition += scrollSpeed;
      
      const maxScroll = scrollContainer.scrollWidth / 2;
      if (scrollPosition >= maxScroll) {
        scrollPosition = 0;
      }
      
      scrollContainer.scrollLeft = scrollPosition;
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  const duplicatedProviders = [...PROVIDERS, ...PROVIDERS];

  return (
    <div className="w-full py-16 overflow-hidden bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="text-center">
          <p className="text-xs text-cyan-400/60 tracking-[0.25em] uppercase mb-3 font-medium">
            Trusted Sources
          </p>
          <h3 className="text-2xl sm:text-3xl font-light text-white/90 mb-2">
            Research powered by <span className="text-cyan-400 font-medium">54 providers</span>
          </h3>
          <p className="text-sm text-white/50 max-w-2xl mx-auto">
            Academic journals • Institutional databases • Leading think tanks
          </p>
        </div>
      </div>

      {/* Infinite scrolling logos */}
      <div 
        ref={scrollRef}
        className="flex gap-8 overflow-x-hidden"
        style={{ 
          scrollBehavior: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {duplicatedProviders.map((provider, index) => (
          <div
            key={`${provider.name}-${index}`}
            className="flex-shrink-0 group"
          >
            <div className="h-16 px-8 flex items-center justify-center rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-cyan-500/30 transition-all duration-300 backdrop-blur-sm group-hover:bg-white/[0.05]">
              <span className="text-white/70 font-medium text-sm whitespace-nowrap group-hover:text-white/90 transition-colors">
                {provider.displayName}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Category indicators */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex items-center justify-center gap-6 text-xs text-white/40">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-500/50"></div>
            <span>8 Academic</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500/50"></div>
            <span>19 Institutional</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-500/50"></div>
            <span>27 Think Tanks</span>
          </div>
        </div>
      </div>
    </div>
  );
}
