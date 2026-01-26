/**
 * OECD - Organisation for Economic Co-operation and Development
 * Legal: OECD Open Access
 * URL: https://www.oecd-ilibrary.org
 */

import axios from 'axios';
import * as cheerio from 'cheerio';

const BASE_URL = 'https://www.oecd-ilibrary.org';
const USER_AGENT = 'NomosX Research Bot (+https://nomosx.com | contact@nomosx.com)';

export async function searchOECD(query: string, limit = 15) {
  const sources = [];
  
  try {
    console.log(`[OECD] Searching iLibrary for: "${query}"`);
    
    const searchUrl = `${BASE_URL}/search?option1=fulltext&value1=${encodeURIComponent(query)}`;
    
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
      const snippet = $elem.find('.abstract, .description, p').first().text().trim();
      const dateText = $elem.find('.date, .year').text().trim();
      
      if (!title || !href) return;
      
      const url = href.startsWith('http') ? href : new URL(href, BASE_URL).href;
      
      const yearMatch = dateText.match(/\b(20\d{2})\b/) || title.match(/\b(20\d{2})\b/);
      const year = yearMatch ? parseInt(yearMatch[1]) : new Date().getFullYear();
      
      sources.push({
        id: `oecd:${Buffer.from(url).toString('base64').slice(0, 24)}`,
        provider: 'oecd',
        type: 'report',
        title,
        abstract: snippet || `OECD publication on ${query}`,
        url,
        pdfUrl: null,
        year,
        publishedDate: dateText ? new Date(dateText) : null,
        
        documentType: 'report',
        issuer: 'OECD',
        issuerType: 'economic',
        classification: 'public',
        language: 'multi',
        contentFormat: 'html',
        oaStatus: 'oecd-open-access',
        hasFullText: true,
        
        raw: { source: 'oecd', searchQuery: query }
      });
    });
    
    console.log(`[OECD] Found ${sources.length} publications`);
  } catch (error: any) {
    console.error(`[OECD] Search failed: ${error.message}`);
  }
  
  return sources;
}
