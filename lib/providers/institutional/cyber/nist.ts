/**
 * NIST - National Institute of Standards and Technology
 * Legal: 17 U.S.C. §105 - US Government works in public domain
 * URL: https://csrc.nist.gov
 */

import axios from 'axios';
import * as cheerio from 'cheerio';

const BASE_URL = 'https://csrc.nist.gov';
const USER_AGENT = 'NomosX Research Bot (+https://nomosx.com | contact@nomosx.com)';

export async function searchNIST(query: string, limit = 15) {
  const sources = [];
  
  try {
    console.log(`[NIST] Searching publications for: "${query}"`);
    
    const searchUrl = `${BASE_URL}/search?keywords=${encodeURIComponent(query)}`;
    
    const { data } = await axios.get(searchUrl, {
      headers: { 'User-Agent': USER_AGENT },
      timeout: 15000
    });
    
    const $ = cheerio.load(data);
    
    $('.publication, .search-result, .result-item').each((i, elem) => {
      if (sources.length >= limit) return false;
      
      const $elem = $(elem);
      const title = $elem.find('h3, h4, .title a').text().trim();
      const href = $elem.find('a').first().attr('href');
      const snippet = $elem.find('.abstract, .description, p').first().text().trim();
      const dateText = $elem.find('.date, .published').text().trim();
      
      if (!title || !href) return;
      
      const url = href.startsWith('http') ? href : new URL(href, BASE_URL).href;
      const isPDF = url.toLowerCase().endsWith('.pdf');
      
      const yearMatch = dateText.match(/\b(20\d{2})\b/) || title.match(/\b(20\d{2})\b/);
      const year = yearMatch ? parseInt(yearMatch[1]) : new Date().getFullYear();
      
      // Detect NIST series (SP = Special Publication, IR = Interagency Report, etc.)
      let series = null;
      const seriesMatch = title.match(/NIST (SP|IR|FIPS|CSWP) [\d-]+/);
      if (seriesMatch) series = seriesMatch[0];
      
      sources.push({
        id: `nist:${Buffer.from(url).toString('base64').slice(0, 24)}`,
        provider: 'nist',
        type: 'report',
        title,
        abstract: snippet || `NIST publication on ${query}`,
        url,
        pdfUrl: isPDF ? url : null,
        year,
        publishedDate: dateText ? new Date(dateText) : null,
        
        documentType: 'report',
        issuer: 'NIST',
        issuerType: 'cyber',
        classification: 'unclassified',
        language: 'en',
        contentFormat: isPDF ? 'pdf' : 'html',
        economicSeries: series || undefined,
        oaStatus: 'public-domain',
        hasFullText: true,
        
        raw: { source: 'nist', searchQuery: query, series }
      });
    });
    
    console.log(`[NIST] Found ${sources.length} publications`);
  } catch (error: any) {
    console.error(`[NIST] Search failed: ${error.message}`);
  }
  
  return sources;
}
