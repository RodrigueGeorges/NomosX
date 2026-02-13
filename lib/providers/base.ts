/**
 * BASE (Bielefeld Academic Search Engine) Provider - Méta-moteur académique
 * API: https://www.base-search.net/about/en/about_develop.php
 */

import { fetchFromProvider } from '../http-client';

export async function searchBASE(query: string, hits = 20): Promise<any[]> {
  const url = `https://api.base-search.net/cgi-bin/BaseHttpSearchInterface.fcgi?func=PerformSearch&query=${encodeURIComponent(query)}&format=json&hits=${hits}&type=all&sortby=relevance`;
  
  try {
    const data: any = await fetchFromProvider("base", url, { timeout: 15000 });
    const docs = data?.response?.docs || [];
    
    return docs.map((doc: any) => {
      const year = doc.dcyear ? parseInt(String(doc.dcyear)) : null;
      const authors = doc.dccreator 
        ? (Array.isArray(doc.dccreator) ? doc.dccreator : [doc.dccreator])
          .map((name: string) => ({ name }))
        : [];
      
      const subjects = doc.dcsubject
        ? (Array.isArray(doc.dcsubject) ? doc.dcsubject : [doc.dcsubject])
        : [];
      
      return {
        id: `base:${doc.dcidentifier || doc.dcdoi || doc.dclink}`,
        provider: "base",
        type: doc.dctyp || "paper",
        title: doc.dctitle || "",
        abstract: doc.dcdescription || null,
        year,
        doi: doc.dcdoi || null,
        url: doc.dclink || doc.dcidentifier || "",
        pdfUrl: doc.dcformat?.includes("pdf") ? doc.dclink : null,
        oaStatus: doc.dcoa === "1" || doc.dcoa === "true" ? "oa" : null,
        authors,
        institutions: [],
        topics: subjects,
        jelCodes: [],
        citationCount: null,
        raw: doc
      };
    }).filter((s: any) => s.title);
    
  } catch (error: any) {
    console.error(`[BASE] Search failed: ${error.message}`);
    return [];
  }
}
