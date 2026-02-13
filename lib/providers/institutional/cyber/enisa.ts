/**
 * ENISA - European Union Agency for Cybersecurity
 * Legal: EU Open Data Portal
 * URL: https://www.enisa.europa.eu
 */

import axios from 'axios';
import * as cheerio from 'cheerio';

const BASE_URL = 'https://www.enisa.europa.eu';
const USER_AGENT = 'NomosX Research Bot (+https://nomosx.com | contact@nomosx.com)';

export async function searchENISA(query: string, limit = 10) {
  const sources: any[] = [];
  
  try {
    console.log(`[ENISA] Searching publications for: "${query}"`);
    
    const searchUrl = `${BASE_URL}/publications?search_api_fulltext=${encodeURIComponent(query)}`;
    
    const { data } = await axios.get(searchUrl, {
      headers: { 'User-Agent': USER_AGENT },
      timeout: 15000
    });
    
    const $ = cheerio.load(data);
    
    $('.view-content .views-row, .publication-item, article').each((i, elem) => {
      if (sources.length >= limit) return false;
      
      const $elem = $(elem);
      const title = $elem.find('h3, h4, .title a').text().trim();
      const href = $elem.find('a').first().attr('href');
      const snippet = $elem.find('.body, .description, p').first().text().trim();
      const dateText = $elem.find('.date, time').text().trim();
      
      if (!title || !href) return;
      
      const url = href.startsWith('http') ? href : new URL(href, BASE_URL).href;
      const isPDF = url.toLowerCase().endsWith('.pdf');
      
      const yearMatch = dateText.match(/\b(20\d{2})\b/) || title.match(/\b(20\d{2})\b/);
      const year = yearMatch ? parseInt(yearMatch[1]) : new Date().getFullYear();
      
      sources.push({
        id: `enisa:${Buffer.from(url).toString('base64').slice(0, 24)}`,
        provider: 'enisa',
        type: 'report',
        title,
        abstract: snippet || `ENISA publication on ${query}`,
        url,
        pdfUrl: isPDF ? url : null,
        year,
        publishedDate: dateText ? new Date(dateText) : null,
        
        documentType: title.toLowerCase().includes('threat landscape') ? 'assessment' : 'report',
        issuer: 'ENISA',
        issuerType: 'cyber',
        classification: 'public',
        language: 'en',
        contentFormat: isPDF ? 'pdf' : 'html',
        oaStatus: 'eu-open-data',
        hasFullText: true,
        
        raw: { source: 'enisa', searchQuery: query }
      });
    });
    
    console.log(`[ENISA] Found ${sources.length} publications`);
  } catch (error: any) {
    console.error(`[ENISA] Search failed: ${error.message}`);
  }
  
  return sources;
}
