/**
 * SGDSN - Secrétariat général de la défense et de la sécurité nationale (France)
 * Legal: French Open Data
 * URL: https://www.sgdsn.gouv.fr
 */

import axios from 'axios';
import * as cheerio from 'cheerio';

const BASE_URL = 'https://www.sgdsn.gouv.fr';
const USER_AGENT = 'NomosX Research Bot (+https://nomosx.com | contact@nomosx.com)';

export async function searchSGDSN(query: string, limit = 10) {
  const sources: any[] = [];
  
  try {
    console.log(`[SGDSN] Searching for: "${query}"`);
    
    const searchUrl = `${BASE_URL}/recherche?query=${encodeURIComponent(query)}`;
    
    const { data } = await axios.get(searchUrl, {
      headers: { 'User-Agent': USER_AGENT },
      timeout: 15000
    });
    
    const $ = cheerio.load(data);
    
    $('.search-result, article, .publication-item').each((i, elem) => {
      if (sources.length >= limit) return false;
      
      const $elem = $(elem);
      const title = $elem.find('h3, h4, .title').text().trim();
      const href = $elem.find('a').first().attr('href');
      const snippet = $elem.find('p, .description').first().text().trim();
      const dateText = $elem.find('.date, time').text().trim();
      
      if (!title || !href) return;
      
      const url = href.startsWith('http') ? href : new URL(href, BASE_URL).href;
      const isPDF = url.toLowerCase().endsWith('.pdf');
      
      const yearMatch = dateText.match(/\b(20\d{2})\b/);
      const year = yearMatch ? parseInt(yearMatch[1]) : new Date().getFullYear();
      
      sources.push({
        id: `sgdsn:${Buffer.from(url).toString('base64').slice(0, 24)}`,
        provider: 'sgdsn',
        type: 'report',
        title,
        abstract: snippet || `Publication SGDSN sur ${query}`,
        url,
        pdfUrl: isPDF ? url : null,
        year,
        publishedDate: dateText ? new Date(dateText) : null,
        
        documentType: title.toLowerCase().includes('directive') ? 'directive' : 'report',
        issuer: 'SGDSN',
        issuerType: 'defense',
        classification: 'public',
        language: 'fr',
        contentFormat: isPDF ? 'pdf' : 'html',
        oaStatus: 'french-open-data',
        hasFullText: true,
        
        raw: { source: 'sgdsn', searchQuery: query }
      });
    });
    
    console.log(`[SGDSN] Found ${sources.length} documents`);
  } catch (error: any) {
    console.error(`[SGDSN] Search failed: ${error.message}`);
  }
  
  return sources;
}
