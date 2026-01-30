"use client";

import { useEffect, useRef } from "react";

interface Provider {
  id: string;
  name: string;
  category: "academic" | "institutional" | "thinktank";
}

const PROVIDERS: Provider[] = [
  // Academic (8)
  { id: "openalex", name: "OpenAlex", category: "academic" },
  { id: "semanticscholar", name: "Semantic Scholar", category: "academic" },
  { id: "crossref", name: "Crossref", category: "academic" },
  { id: "pubmed", name: "PubMed", category: "academic" },
  { id: "arxiv", name: "arXiv", category: "academic" },
  { id: "hal", name: "HAL", category: "academic" },
  { id: "thesesfr", name: "theses.fr", category: "academic" },
  { id: "base", name: "BASE", category: "academic" },
  
  // Institutional (15)
  { id: "worldbank", name: "World Bank", category: "institutional" },
  { id: "imf", name: "IMF", category: "institutional" },
  { id: "oecd", name: "OECD", category: "institutional" },
  { id: "nato", name: "NATO", category: "institutional" },
  { id: "un", name: "United Nations", category: "institutional" },
  { id: "odni", name: "ODNI", category: "institutional" },
  { id: "nist", name: "NIST", category: "institutional" },
  { id: "cisa", name: "CISA", category: "institutional" },
  { id: "enisa", name: "ENISA", category: "institutional" },
  { id: "sgdsn", name: "SGDSN", category: "institutional" },
  { id: "eeas", name: "EEAS", category: "institutional" },
  { id: "bis", name: "BIS", category: "institutional" },
  { id: "undp", name: "UNDP", category: "institutional" },
  { id: "unctad", name: "UNCTAD", category: "institutional" },
  { id: "nsa", name: "NSA", category: "institutional" },
  
  // Think Tanks (18)
  { id: "brookings", name: "Brookings", category: "thinktank" },
  { id: "rand", name: "RAND", category: "thinktank" },
  { id: "cset", name: "CSET", category: "thinktank" },
  { id: "govai", name: "GovAI", category: "thinktank" },
  { id: "cnas", name: "CNAS", category: "thinktank" },
  { id: "newamerica", name: "New America", category: "thinktank" },
  { id: "ainow", name: "AI Now Institute", category: "thinktank" },
  { id: "datasociety", name: "Data & Society", category: "thinktank" },
  { id: "cdt", name: "CDT", category: "thinktank" },
  { id: "iaps", name: "IAPS", category: "thinktank" },
  { id: "scsp", name: "SCSP", category: "thinktank" },
  { id: "rstreet", name: "R Street", category: "thinktank" },
  { id: "lawzero", name: "LawZero", category: "thinktank" },
  { id: "caip", name: "CAIP", category: "thinktank" },
  { id: "aipi", name: "AIPI", category: "thinktank" },
  { id: "caidp", name: "CAIDP", category: "thinktank" },
  { id: "ifp", name: "IFP", category: "thinktank" },
  { id: "abundance", name: "Abundance", category: "thinktank" },
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
            Built on <span className="text-cyan-400 font-medium">institutional-grade research</span>
          </h3>
          <p className="text-sm text-white/50 max-w-2xl mx-auto">
            Academic journals • Institutional databases • Leading think tanks
          </p>
        </div>
      </div>

      {/* Infinite scrolling logos */}
      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-hidden"
        style={{ 
          scrollBehavior: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {duplicatedProviders.map((provider, index) => (
          <div
            key={`${provider.id}-${index}`}
            className="flex-shrink-0 group"
          >
            <div className="h-16 px-6 flex items-center justify-center rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-cyan-500/30 transition-all duration-300 backdrop-blur-sm group-hover:bg-white/[0.05]">
              <img 
                src={`/providers/${provider.id}.svg`} 
                alt={provider.name}
                className="h-8 w-auto opacity-80 group-hover:opacity-100 transition-opacity"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Category indicators */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex items-center justify-center gap-6 text-xs text-white/40">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-500/50"></div>
            <span>Academic</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500/50"></div>
            <span>Institutional</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-500/50"></div>
            <span>Think Tanks</span>
          </div>
        </div>
      </div>
    </div>
  );
}
