/**
 * UNCTAD - United Nations Conference on Trade and Development
 * Legal: UN Open Access
 * URL: https://unctad.org
 */

import axios from 'axios';
import * as cheerio from 'cheerio';

const BASE_URL = 'https://unctad.org';
const USER_AGENT = 'NomosX Research Bot (+https://nomosx.com | contact@nomosx.com)';

export async function searchUNCTAD(query: string, limit = 15) {
  const sources = [];
  
  try {
    console.log(`[UNCTAD] Searching for: "${query}"`);
    
    const searchUrl = `${BASE_URL}/search?search=${encodeURIComponent(query)}`;
    
    const { data } = await axios.get(searchUrl, {
      headers: { 'User-Agent': USER_AGENT },
      timeout: 15000
    });
    
    const $ = cheerio.load(data);
    
    $('.search-result, .publication-item, article').each((i, elem) => {
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
        id: `unctad:${Buffer.from(url).toString('base64').slice(0, 24)}`,
        provider: 'unctad',
        type: 'report',
        title,
        abstract: snippet || `UNCTAD publication on ${query}`,
        url,
        pdfUrl: isPDF ? url : null,
        year,
        publishedDate: dateText ? new Date(dateText) : null,
        
        documentType: title.includes('Trade and Development Report') ? 'assessment' : 'report',
        issuer: 'UNCTAD',
        issuerType: 'multilateral',
        classification: 'public',
        language: 'multi',
        contentFormat: isPDF ? 'pdf' : 'html',
        oaStatus: 'un-open-access',
        hasFullText: true,
        
        raw: { source: 'unctad', searchQuery: query }
      });
    });
    
    console.log(`[UNCTAD] Found ${sources.length} publications`);
  } catch (error: any) {
    console.error(`[UNCTAD] Search failed: ${error.message}`);
  }
  
  return sources;
}
