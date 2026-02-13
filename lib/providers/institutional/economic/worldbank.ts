/**
 * World Bank Open Knowledge Repository
 * Legal: Creative Commons - Open Access
 * URL: https://openknowledge.worldbank.org
 * API: https://data.worldbank.org
 */

import axios from 'axios';
import * as cheerio from 'cheerio';

const BASE_URL = 'https://openknowledge.worldbank.org';
const USER_AGENT = 'NomosX Research Bot (+https://nomosx.com | contact@nomosx.com)';

export async function searchWorldBank(query: string, limit = 15) {
  const sources: any[] = [];
  
  try {
    console.log(`[WorldBank] Searching Open Knowledge for: "${query}"`);
    
    const searchUrl = `${BASE_URL}/discover?query=${encodeURIComponent(query)}&scope=%2F&rpp=20`;
    
    const { data } = await axios.get(searchUrl, {
      headers: { 'User-Agent': USER_AGENT },
      timeout: 15000
    });
    
    const $ = cheerio.load(data);
    
    $('.artifact-description, .ds-artifact-item, .discovery-result').each((i, elem) => {
      if (sources.length >= limit) return false;
      
      const $elem = $(elem);
      const title = $elem.find('h4, .artifact-title a').text().trim();
      const href = $elem.find('a').first().attr('href');
      const snippet = $elem.find('.artifact-abstract, .description').text().trim();
      const dateText = $elem.find('.date-issued, .date').text().trim();
      const authors = $elem.find('.author').map((_, el) => $(el).text().trim()).get().join(', ');
      
      if (!title || !href) return;
      
      const url = href.startsWith('http') ? href : new URL(href, BASE_URL).href;
      
      const yearMatch = dateText.match(/\b(20\d{2})\b/);
      const year = yearMatch ? parseInt(yearMatch[1]) : new Date().getFullYear();
      
      // Detect document type
      let docType = 'report';
      if (title.toLowerCase().includes('policy research working paper')) docType = 'working-paper';
      if (title.toLowerCase().includes('data')) docType = 'dataset';
      
      sources.push({
        id: `worldbank:${Buffer.from(url).toString('base64').slice(0, 24)}`,
        provider: 'worldbank',
        type: 'report',
        title,
        abstract: snippet || `World Bank publication on ${query}`,
        url,
        pdfUrl: null, // Usually extracted from detail page
        year,
        publishedDate: dateText ? new Date(dateText) : null,
        
        documentType: docType,
        issuer: 'World Bank',
        issuerType: 'economic',
        classification: 'public',
        language: 'en',
        contentFormat: 'html',
        oaStatus: 'cc-by',
        hasFullText: true,
        
        institutions: authors ? [{ name: authors }] : undefined,
        
        raw: { source: 'worldbank', searchQuery: query, authors }
      });
    });
    
    console.log(`[WorldBank] Found ${sources.length} publications`);
  } catch (error: any) {
    console.error(`[WorldBank] Search failed: ${error.message}`);
  }
  
  return sources;
}
