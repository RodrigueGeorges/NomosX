/**
 * World Bank API - STABLE & PRODUCTION-READY
 * API Docs: https://datahelpdesk.worldbank.org/knowledgebase/articles/889392
 */

import axios from 'axios';

const WB_API_BASE = 'https://search.worldbank.org/api/v2/wds';
const USER_AGENT = 'NomosX Research Bot (+https://nomosx.com | contact@nomosx.com)';

/**
 * Search World Bank documents via official API
 * 100% fiable, maintenu par World Bank
 */
export async function searchWorldBankAPI(query: string, limit = 15) {
  const sources = [];
  
  try {
    console.log(`[WorldBank-API] Searching for: "${query}"`);
    
    const params = {
      format: 'json',
      qterm: query,
      rows: limit,
      fl: 'id,docty,display_title,abstracts,docdt,pdfurl,url'
    };
    
    const { data } = await axios.get(WB_API_BASE, {
      params,
      headers: { 'User-Agent': USER_AGENT },
      timeout: 15000
    });
    
    if (data.documents) {
      for (const doc of data.documents) {
        const year = doc.docdt ? parseInt(doc.docdt.substring(0, 4)) : new Date().getFullYear();
        
        sources.push({
          id: `worldbank:${doc.id}`,
          provider: 'worldbank',
          type: 'report',
          title: doc.display_title || 'Untitled',
          abstract: doc.abstracts || '',
          url: doc.url || `https://documents.worldbank.org/en/publication/documents-reports/documentdetail/${doc.id}`,
          pdfUrl: doc.pdfurl || null,
          year,
          publishedDate: doc.docdt ? new Date(doc.docdt) : null,
          
          // Institutional metadata
          documentType: doc.docty === 'Working Paper' ? 'working-paper' : 'report',
          issuer: 'World Bank',
          issuerType: 'economic',
          classification: 'public',
          language: 'en',
          contentFormat: doc.pdfurl ? 'pdf' : 'html',
          oaStatus: 'cc-by',
          hasFullText: Boolean(doc.pdfurl),
          
          raw: doc
        });
      }
    }
    
    console.log(`[WorldBank-API] Found ${sources.length} documents`);
  } catch (error: any) {
    console.error(`[WorldBank-API] Search failed: ${error.message}`);
  }
  
  return sources;
}
