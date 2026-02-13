/**
 * EDA - European Defence Agency
 * Legal: EU Open Data Portal
 * URL: https://eda.europa.eu
 */

import axios from 'axios';
import * as cheerio from 'cheerio';

const BASE_URL = 'https://eda.europa.eu';
const USER_AGENT = 'NomosX Research Bot (+https://nomosx.com | contact@nomosx.com)';

export async function searchEDA(query: string, limit = 10) {
  const sources: any[] = [];
  
  try {
    console.log(`[EDA] Searching for: "${query}"`);
    
    const searchUrl = `${BASE_URL}/search?q=${encodeURIComponent(query)}`;
    
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
        id: `eda:${Buffer.from(url).toString('base64').slice(0, 24)}`,
        provider: 'eda',
        type: 'report',
        title,
        abstract: snippet || `EDA publication on ${query}`,
        url,
        pdfUrl: isPDF ? url : null,
        year,
        publishedDate: dateText ? new Date(dateText) : null,
        
        documentType: 'report',
        issuer: 'EDA',
        issuerType: 'defense',
        classification: 'public',
        language: 'en',
        contentFormat: isPDF ? 'pdf' : 'html',
        oaStatus: 'eu-open-data',
        hasFullText: true,
        
        raw: { source: 'eda', searchQuery: query }
      });
    });
    
    console.log(`[EDA] Found ${sources.length} documents`);
  } catch (error: any) {
    console.error(`[EDA] Search failed: ${error.message}`);
  }
  
  return sources;
}
