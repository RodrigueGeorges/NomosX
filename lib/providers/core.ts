/**
 * CORE Provider — 300M+ open access research papers
 * The world's largest aggregator of open access research.
 * Covers ALL disciplines: STEM, social sciences, humanities, law, arts.
 * API: https://core.ac.uk/documentation/api
 * 
 * KEY VALUE: Fills humanities/social science gap that PubMed/arXiv don't cover.
 */

import { fetchFromProvider } from '../http-client';
import { env } from '../env';

export async function searchCORE(query: string, limit = 30): Promise<any[]> {
  const apiKey = env.CORE_API_KEY;
  if (!apiKey) {
    console.warn("[CORE] No API key configured (CORE_API_KEY), skipping");
    return [];
  }

  const url = `https://api.core.ac.uk/v3/search/works?q=${encodeURIComponent(query)}&limit=${limit}&stats=false`;

  try {
    const data: any = await fetchFromProvider("core", url, {
      timeout: 15000,
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    const results = data?.results || [];

    console.log(`[CORE] Found ${results.length} papers`);

    const papers = results
      .filter((p: any) => p.title && p.abstract && p.abstract.length >= 150)
      .map((p: any) => {
        const abstractLen = p.abstract?.length || 0;
        return {
          id: `core:${p.id}`,
          provider: "core",
          type: "paper",
          title: p.title || "",
          abstract: p.abstract || null,
          year: p.yearPublished ?? null,
          doi: p.doi || null,
          url: p.downloadUrl || p.sourceFulltextUrls?.[0] || `https://core.ac.uk/works/${p.id}`,
          pdfUrl: p.downloadUrl || null,
          oaStatus: "oa",
          authors: (p.authors || []).map((a: any) => ({
            name: typeof a === "string" ? a : a.name || "",
          })).filter((a: any) => a.name),
          institutions: [],
          topics: p.subjects || [],
          jelCodes: [],
          citationCount: p.citationCount ?? null,
          contentLength: abstractLen,
          hasFullText: !!p.fullText || !!p.downloadUrl,
          contentQuality: abstractLen >= 1000 ? "excellent" : abstractLen >= 500 ? "good" : "acceptable",
          language: p.language?.code || null,
          raw: p,
        };
      });

    console.log(`[CORE] ${papers.length}/${results.length} with rich abstracts`);
    return papers;
  } catch (error: any) {
    console.error(`[CORE] Search failed: ${error.message}`);
    return [];
  }
}
