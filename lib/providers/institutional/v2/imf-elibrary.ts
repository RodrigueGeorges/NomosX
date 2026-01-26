/**
 * IMF eLibrary - Structured scraping
 * Site académique stable, structure HTML prévisible
 */

import axios from 'axios';
import * as cheerio from 'cheerio';

const IMF_ELIBRARY_BASE = 'https://www.elibrary.imf.org';
const USER_AGENT = 'NomosX Research Bot (+https://nomosx.com | contact@nomosx.com)';

/**
 * Search IMF eLibrary
 * Structure stable (site Silverchair comme beaucoup de publishers académiques)
 */
export async function searchIMFeLibrary(query: string, limit = 20) {
  const sources = [];
  
  try {
    console.log(`[IMF-eLibrary] Searching for: "${query}"`);
    
    const searchUrl = `${IMF_ELIBRARY_BASE}/search-results`;
    const params = {
      page: 1,
      q: query,
      pageSize: limit
    };
    
    const { data } = await axios.get(searchUrl, {
      params,
      headers: { 'User-Agent': USER_AGENT },
      timeout: 15000
    });
    
    const $ = cheerio.load(data);
    
    // Structure Silverchair (standard pour publishers académiques)
    $('.search-result').each((i, el) => {
      const $item = $(el);
      
      const title = $item.find('.article-title').text().trim();
      const abstract = $item.find('.article-abstract').text().trim();
      const url = $item.find('.article-link').attr('href');
      const authors = $item.find('.author-link').map((_, a) => $(a).text().trim()).get();
      const yearMatch = $item.find('.publication-date').text().match(/\d{4}/);
      const year = yearMatch ? parseInt(yearMatch[0]) : null;
      
      if (title && url) {
        sources.push({
          id: `imf:${Buffer.from(url).toString('base64').slice(0, 24)}`,
          provider: 'imf',
          type: 'report',
          title,
          abstract,
          url: url.startsWith('http') ? url : `${IMF_ELIBRARY_BASE}${url}`,
          authors,
          year,
          publishedDate: year ? new Date(year, 0, 1) : null,
          
          // Metadata
          documentType: title.includes('Working Paper') ? 'working-paper' : 'report',
          issuer: 'IMF',
          issuerType: 'economic',
          classification: 'public',
          language: 'en',
          contentFormat: 'pdf',
          oaStatus: 'open',
          hasFullText: true
        });
      }
    });
    
    console.log(`[IMF-eLibrary] Found ${sources.length} publications`);
  } catch (error: any) {
    console.error(`[IMF-eLibrary] Search failed: ${error.message}`);
  }
  
  return sources;
}
