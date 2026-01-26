/**
 * UN Digital Library
 * Legal: UN Open Access
 * URL: https://digitallibrary.un.org
 */

import axios from 'axios';
import * as cheerio from 'cheerio';

const BASE_URL = 'https://digitallibrary.un.org';
const USER_AGENT = 'NomosX Research Bot (+https://nomosx.com | contact@nomosx.com)';

export async function searchUN(query: string, limit = 15) {
  const sources = [];
  
  try {
    console.log(`[UN] Searching Digital Library for: "${query}"`);
    
    const searchUrl = `${BASE_URL}/search?ln=en&p=${encodeURIComponent(query)}&f=&action_search=Search`;
    
    const { data } = await axios.get(searchUrl, {
      headers: { 'User-Agent': USER_AGENT },
      timeout: 15000
    });
    
    const $ = cheerio.load(data);
    
    $('.record, .result-item, .search-result').each((i, elem) => {
      if (sources.length >= limit) return false;
      
      const $elem = $(elem);
      const title = $elem.find('h4, h3, .title a').text().trim();
      const href = $elem.find('a').first().attr('href');
      const snippet = $elem.find('.abstract, .description').text().trim();
      const dateText = $elem.find('.date, .published').text().trim();
      
      if (!title || !href) return;
      
      const url = href.startsWith('http') ? href : new URL(href, BASE_URL).href;
      
      const yearMatch = dateText.match(/\b(19\d{2}|20\d{2})\b/) || title.match(/\b(20\d{2})\b/);
      const year = yearMatch ? parseInt(yearMatch[1]) : new Date().getFullYear();
      
      sources.push({
        id: `un:${Buffer.from(url).toString('base64').slice(0, 24)}`,
        provider: 'un',
        type: 'report',
        title,
        abstract: snippet || `UN document on ${query}`,
        url,
        pdfUrl: url.toLowerCase().endsWith('.pdf') ? url : null,
        year,
        publishedDate: dateText ? new Date(dateText) : null,
        
        documentType: 'report',
        issuer: 'United Nations',
        issuerType: 'multilateral',
        classification: 'public',
        language: 'multi',
        contentFormat: url.toLowerCase().endsWith('.pdf') ? 'pdf' : 'html',
        oaStatus: 'un-open-access',
        hasFullText: true,
        
        raw: { source: 'un', searchQuery: query }
      });
    });
    
    console.log(`[UN] Found ${sources.length} documents`);
  } catch (error: any) {
    console.error(`[UN] Search failed: ${error.message}`);
  }
  
  return sources;
}
