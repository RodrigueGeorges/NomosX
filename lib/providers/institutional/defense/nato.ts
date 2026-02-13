/**
 * NATO - North Atlantic Treaty Organization
 * Legal: NATO Open Publications
 * URL: https://www.nato.int
 */

import axios from 'axios';
import * as cheerio from 'cheerio';

const BASE_URL = 'https://www.nato.int';
const USER_AGENT = 'NomosX Research Bot (+https://nomosx.com | contact@nomosx.com)';

export async function searchNATO(query: string, limit = 10) {
  const sources: any[] = [];
  
  try {
    console.log(`[NATO] Searching for: "${query}"`);
    
    // NATO library and publications
    const searchUrl = `${BASE_URL}/cps/en/natolive/search.htm?query=${encodeURIComponent(query)}`;
    
    const { data } = await axios.get(searchUrl, {
      headers: { 'User-Agent': USER_AGENT },
      timeout: 15000
    });
    
    const $ = cheerio.load(data);
    
    $('.search-result, .result-item, article').each((i, elem) => {
      if (sources.length >= limit) return false;
      
      const $elem = $(elem);
      const title = $elem.find('h3, h4, .title a').text().trim();
      const href = $elem.find('a').first().attr('href');
      const snippet = $elem.find('p, .description').first().text().trim();
      const dateText = $elem.find('.date, time').text().trim();
      
      if (!title || !href) return;
      
      const url = href.startsWith('http') ? href : new URL(href, BASE_URL).href;
      const isPDF = url.toLowerCase().endsWith('.pdf');
      
      const yearMatch = dateText.match(/\b(20\d{2})\b/) || title.match(/\b(20\d{2})\b/);
      const year = yearMatch ? parseInt(yearMatch[1]) : new Date().getFullYear();
      
      // Detect document type
      let docType = 'report';
      const lowerTitle = title.toLowerCase();
      if (lowerTitle.includes('strategic concept')) docType = 'directive';
      if (lowerTitle.includes('communiqué')) docType = 'briefing';
      if (lowerTitle.includes('statement')) docType = 'briefing';
      
      sources.push({
        id: `nato:${Buffer.from(url).toString('base64').slice(0, 24)}`,
        provider: 'nato',
        type: 'report',
        title,
        abstract: snippet || `NATO publication on ${query}`,
        url,
        pdfUrl: isPDF ? url : null,
        year,
        publishedDate: dateText ? new Date(dateText) : null,
        
        documentType: docType,
        issuer: 'NATO',
        issuerType: 'defense',
        classification: 'unclassified',
        language: 'en',
        contentFormat: isPDF ? 'pdf' : 'html',
        oaStatus: 'public',
        hasFullText: true,
        
        raw: { source: 'nato', searchQuery: query }
      });
    });
    
    console.log(`[NATO] Found ${sources.length} documents`);
  } catch (error: any) {
    console.error(`[NATO] Search failed: ${error.message}`);
  }
  
  return sources;
}
