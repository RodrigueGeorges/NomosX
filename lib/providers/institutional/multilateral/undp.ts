/**
 * UNDP - United Nations Development Programme
 * Legal: UNDP Open Data
 * URL: https://www.undp.org
 */

import axios from 'axios';
import * as cheerio from 'cheerio';

const BASE_URL = 'https://www.undp.org';
const USER_AGENT = 'NomosX Research Bot (+https://nomosx.com | contact@nomosx.com)';

export async function searchUNDP(query: string, limit = 15) {
  const sources = [];
  
  try {
    console.log(`[UNDP] Searching for: "${query}"`);
    
    const searchUrl = `${BASE_URL}/search?q=${encodeURIComponent(query)}`;
    
    const { data } = await axios.get(searchUrl, {
      headers: { 'User-Agent': USER_AGENT },
      timeout: 15000
    });
    
    const $ = cheerio.load(data);
    
    $('.search-result, .publication, article').each((i, elem) => {
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
      
      sources.push({
        id: `undp:${Buffer.from(url).toString('base64').slice(0, 24)}`,
        provider: 'undp',
        type: 'report',
        title,
        abstract: snippet || `UNDP publication on ${query}`,
        url,
        pdfUrl: isPDF ? url : null,
        year,
        publishedDate: dateText ? new Date(dateText) : null,
        
        documentType: 'report',
        issuer: 'UNDP',
        issuerType: 'multilateral',
        classification: 'public',
        language: 'multi',
        contentFormat: isPDF ? 'pdf' : 'html',
        oaStatus: 'un-open-access',
        hasFullText: true,
        
        raw: { source: 'undp', searchQuery: query }
      });
    });
    
    console.log(`[UNDP] Found ${sources.length} publications`);
  } catch (error: any) {
    console.error(`[UNDP] Search failed: ${error.message}`);
  }
  
  return sources;
}
