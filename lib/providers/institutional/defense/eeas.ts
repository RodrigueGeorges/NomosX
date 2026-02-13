/**
 * EEAS - European External Action Service
 * Legal: EU Open Data Portal
 * URL: https://www.eeas.europa.eu
 */

import axios from 'axios';
import * as cheerio from 'cheerio';

const BASE_URL = 'https://www.eeas.europa.eu';
const USER_AGENT = 'NomosX Research Bot (+https://nomosx.com | contact@nomosx.com)';

export async function searchEEAS(query: string, limit = 10) {
  const sources: any[] = [];
  
  try {
    console.log(`[EEAS] Searching for: "${query}"`);
    
    const searchUrl = `${BASE_URL}/eeas/search_en?search_api_fulltext=${encodeURIComponent(query)}`;
    
    const { data } = await axios.get(searchUrl, {
      headers: { 'User-Agent': USER_AGENT },
      timeout: 15000
    });
    
    const $ = cheerio.load(data);
    
    $('.search-result, .view-content .views-row, article').each((i, elem) => {
      if (sources.length >= limit) return false;
      
      const $elem = $(elem);
      const title = $elem.find('h3, h4, .title a').text().trim();
      const href = $elem.find('a').first().attr('href');
      const snippet = $elem.find('p, .body, .description').first().text().trim();
      const dateText = $elem.find('.date, time').text().trim();
      
      if (!title || !href) return;
      
      const url = href.startsWith('http') ? href : new URL(href, BASE_URL).href;
      
      const yearMatch = dateText.match(/\b(20\d{2})\b/);
      const year = yearMatch ? parseInt(yearMatch[1]) : new Date().getFullYear();
      
      sources.push({
        id: `eeas:${Buffer.from(url).toString('base64').slice(0, 24)}`,
        provider: 'eeas',
        type: 'report',
        title,
        abstract: snippet || `EEAS publication on ${query}`,
        url,
        pdfUrl: url.toLowerCase().endsWith('.pdf') ? url : null,
        year,
        publishedDate: dateText ? new Date(dateText) : null,
        
        documentType: 'report',
        issuer: 'EEAS',
        issuerType: 'defense',
        classification: 'public',
        language: 'multi',
        contentFormat: url.toLowerCase().endsWith('.pdf') ? 'pdf' : 'html',
        oaStatus: 'eu-open-data',
        hasFullText: true,
        
        raw: { source: 'eeas', searchQuery: query }
      });
    });
    
    console.log(`[EEAS] Found ${sources.length} documents`);
  } catch (error: any) {
    console.error(`[EEAS] Search failed: ${error.message}`);
  }
  
  return sources;
}
