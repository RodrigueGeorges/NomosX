/**
 * IMF - International Monetary Fund
 * Legal: IMF Open Data Initiative
 * URL: https://www.imf.org
 * API: https://data.imf.org
 */

import axios from 'axios';
import * as cheerio from 'cheerio';

const BASE_URL = 'https://www.imf.org';
const ELIBRARY_URL = 'https://www.elibrary.imf.org';
const USER_AGENT = 'NomosX Research Bot (+https://nomosx.com | contact@nomosx.com)';

export async function searchIMF(query: string, limit = 10) {
  const sources: any[] = [];
  
  try {
    console.log(`[IMF] Searching publications for: "${query}"`);
    
    // IMF eLibrary search
    const searchUrl = `${ELIBRARY_URL}/search?q=${encodeURIComponent(query)}&f_ContentType=Book,Working%20Paper,Policy%20Paper`;
    
    const { data } = await axios.get(searchUrl, {
      headers: { 'User-Agent': USER_AGENT },
      timeout: 15000
    });
    
    const $ = cheerio.load(data);
    
    $('.publication, .search-result, .item').each((i, elem) => {
      if (sources.length >= limit) return false;
      
      const $elem = $(elem);
      const title = $elem.find('h3, h4, .title').text().trim();
      const href = $elem.find('a').first().attr('href');
      const snippet = $elem.find('.abstract, .description, p').first().text().trim();
      const dateText = $elem.find('.date, .published').text().trim();
      const authors = $elem.find('.authors, .author').text().trim();
      
      if (!title || !href) return;
      
      const url = href.startsWith('http') ? href : new URL(href, ELIBRARY_URL).href;
      
      // IMF publications have year in URL or title
      const yearMatch = dateText.match(/\b(20\d{2})\b/) || url.match(/\/(\d{4})\//);
      const year = yearMatch ? parseInt(yearMatch[1]) : new Date().getFullYear();
      
      // Detect series (WP = Working Paper, CR = Country Report, etc.)
      let series = null;
      const seriesMatch = title.match(/IMF (Working Paper|Staff Discussion Note|Policy Paper|Country Report)/i);
      if (seriesMatch) series = seriesMatch[1];
      
      sources.push({
        id: `imf:${Buffer.from(url).toString('base64').slice(0, 24)}`,
        provider: 'imf',
        type: 'report',
        title,
        abstract: snippet || `IMF publication on ${query}`,
        url,
        pdfUrl: url.toLowerCase().endsWith('.pdf') ? url : null,
        year,
        publishedDate: dateText ? new Date(dateText) : null,
        
        documentType: series ? 'report' : 'dataset',
        issuer: 'IMF',
        issuerType: 'economic',
        classification: 'public',
        language: 'en',
        contentFormat: url.toLowerCase().endsWith('.pdf') ? 'pdf' : 'html',
        economicSeries: series || undefined,
        oaStatus: 'imf-open-data',
        hasFullText: true,
        
        // Store authors if available
        institutions: authors ? [{ name: authors }] : undefined,
        
        raw: { source: 'imf', searchQuery: query, authors }
      });
    });
    
    console.log(`[IMF] Found ${sources.length} publications`);
  } catch (error: any) {
    console.error(`[IMF] Search failed: ${error.message}`);
  }
  
  return sources;
}
