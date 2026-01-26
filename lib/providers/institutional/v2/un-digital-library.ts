/**
 * UN Digital Library - OFFICIAL API ✅
 * API Docs: https://digitallibrary.un.org/
 * API Solr officielle, gratuite
 */

import axios from 'axios';

const UN_API_BASE = 'https://digitallibrary.un.org/api/v1/search';
const USER_AGENT = 'NomosX Research Bot (+https://nomosx.com | contact@nomosx.com)';

/**
 * Search UN Digital Library via official API
 * Couvre toutes les agences UN (UNDP, UNCTAD, etc.)
 */
export async function searchUNDigitalLibrary(query: string, limit = 20, agency?: string) {
  const sources = [];
  
  try {
    console.log(`[UN-API] Searching for: "${query}"${agency ? ` in ${agency}` : ''}`);
    
    let fullQuery = query;
    if (agency) {
      fullQuery += ` AND corporateAuthor:"${agency}"`;
    }
    
    const params = {
      q: fullQuery,
      rows: limit,
      sort: 'score desc',
      wt: 'json'
    };
    
    const { data } = await axios.get(UN_API_BASE, {
      params,
      headers: { 'User-Agent': USER_AGENT },
      timeout: 20000
    });
    
    if (data.response?.docs) {
      for (const doc of data.response.docs) {
        const year = doc.dateIssued ? parseInt(doc.dateIssued.substring(0, 4)) : null;
        
        sources.push({
          id: `un:${doc.id}`,
          provider: agency?.toLowerCase() || 'un',
          type: 'report',
          title: doc.title || 'Untitled Document',
          abstract: doc.description || '',
          url: `https://digitallibrary.un.org/record/${doc.id}`,
          pdfUrl: doc.url || null,
          year,
          publishedDate: doc.dateIssued ? new Date(doc.dateIssued) : null,
          
          // Institutional metadata
          documentType: doc.type || 'report',
          issuer: doc.corporateAuthor || 'United Nations',
          issuerType: 'multilateral',
          classification: 'public',
          language: doc.language?.[0] || 'en',
          contentFormat: doc.format || 'pdf',
          oaStatus: 'cc-by-sa',
          hasFullText: Boolean(doc.url),
          
          // UN-specific
          symbol: doc.symbol,
          agenda: doc.agenda,
          
          raw: doc
        });
      }
    }
    
    console.log(`[UN-API] Found ${sources.length} documents`);
  } catch (error: any) {
    console.error(`[UN-API] Search failed: ${error.message}`);
  }
  
  return sources;
}

/**
 * Helper pour rechercher spécifiquement UNDP
 */
export async function searchUNDP(query: string, limit = 20) {
  return searchUNDigitalLibrary(query, limit, 'United Nations Development Programme');
}

/**
 * Helper pour rechercher spécifiquement UNCTAD
 */
export async function searchUNCTAD(query: string, limit = 20) {
  return searchUNDigitalLibrary(query, limit, 'United Nations Conference on Trade and Development');
}
