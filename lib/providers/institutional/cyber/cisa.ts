/**
 * CISA - Cybersecurity and Infrastructure Security Agency
 * Legal: 17 U.S.C. §105 - US Government works in public domain
 * URL: https://www.cisa.gov
 */

import axios from 'axios';
import * as cheerio from 'cheerio';

const BASE_URL = 'https://www.cisa.gov';
const USER_AGENT = 'NomosX Research Bot (+https://nomosx.com | contact@nomosx.com)';

export async function searchCISA(query: string, limit = 10) {
  const sources: any[] = [];
  
  try {
    console.log(`[CISA] Searching advisories and reports for: "${query}"`);
    
    const searchUrl = `${BASE_URL}/search?query=${encodeURIComponent(query)}`;
    
    const { data } = await axios.get(searchUrl, {
      headers: { 'User-Agent': USER_AGENT },
      timeout: 15000
    });
    
    const $ = cheerio.load(data);
    
    $('.search-result, .c-teaser, article').each((i, elem) => {
      if (sources.length >= limit) return false;
      
      const $elem = $(elem);
      const title = $elem.find('h3, h4, .c-teaser__title a').text().trim();
      const href = $elem.find('a').first().attr('href');
      const snippet = $elem.find('.c-teaser__body, .description, p').first().text().trim();
      const dateText = $elem.find('.date, time').text().trim();
      
      if (!title || !href) return;
      
      const url = href.startsWith('http') ? href : new URL(href, BASE_URL).href;
      const isPDF = url.toLowerCase().endsWith('.pdf');
      
      const yearMatch = dateText.match(/\b(20\d{2})\b/);
      const year = yearMatch ? parseInt(yearMatch[1]) : new Date().getFullYear();
      
      // Detect alert type
      let docType = 'report';
      const lowerTitle = title.toLowerCase();
      if (lowerTitle.includes('alert') || lowerTitle.includes('advisory')) docType = 'assessment';
      if (lowerTitle.includes('vulnerability')) docType = 'assessment';
      
      sources.push({
        id: `cisa:${Buffer.from(url).toString('base64').slice(0, 24)}`,
        provider: 'cisa',
        type: 'report',
        title,
        abstract: snippet || `CISA publication on ${query}`,
        url,
        pdfUrl: isPDF ? url : null,
        year,
        publishedDate: dateText ? new Date(dateText) : null,
        
        documentType: docType,
        issuer: 'CISA',
        issuerType: 'cyber',
        classification: 'unclassified',
        language: 'en',
        contentFormat: isPDF ? 'pdf' : 'html',
        oaStatus: 'public-domain',
        hasFullText: true,
        
        raw: { source: 'cisa', searchQuery: query }
      });
    });
    
    console.log(`[CISA] Found ${sources.length} advisories/reports`);
  } catch (error: any) {
    console.error(`[CISA] Search failed: ${error.message}`);
  }
  
  return sources;
}
