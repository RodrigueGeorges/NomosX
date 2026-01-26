/**
 * BIS - Bank for International Settlements
 * Legal: Open Access Publications
 * URL: https://www.bis.org
 */

import axios from 'axios';
import * as cheerio from 'cheerio';

const BASE_URL = 'https://www.bis.org';
const USER_AGENT = 'NomosX Research Bot (+https://nomosx.com | contact@nomosx.com)';

export async function searchBIS(query: string, limit = 15) {
  const sources = [];
  
  try {
    console.log(`[BIS] Searching for: "${query}"`);
    
    const searchUrl = `${BASE_URL}/search/?q=${encodeURIComponent(query)}&sct=publications`;
    
    const { data } = await axios.get(searchUrl, {
      headers: { 'User-Agent': USER_AGENT },
      timeout: 15000
    });
    
    const $ = cheerio.load(data);
    
    $('.publicationsearch-item, .search-result, article').each((i, elem) => {
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
      
      // Detect BIS series (Working Papers, Quarterly Review, etc.)
      let series = null;
      if (title.includes('Working Paper')) series = 'Working Paper';
      if (title.includes('Quarterly Review')) series = 'Quarterly Review';
      if (title.includes('Annual Economic Report')) series = 'Annual Economic Report';
      
      sources.push({
        id: `bis:${Buffer.from(url).toString('base64').slice(0, 24)}`,
        provider: 'bis',
        type: 'report',
        title,
        abstract: snippet || `BIS publication on ${query}`,
        url,
        pdfUrl: isPDF ? url : null,
        year,
        publishedDate: dateText ? new Date(dateText) : null,
        
        documentType: 'report',
        issuer: 'BIS',
        issuerType: 'economic',
        classification: 'public',
        language: 'en',
        contentFormat: isPDF ? 'pdf' : 'html',
        economicSeries: series || undefined,
        oaStatus: 'open-access',
        hasFullText: true,
        
        raw: { source: 'bis', searchQuery: query, series }
      });
    });
    
    console.log(`[BIS] Found ${sources.length} publications`);
  } catch (error: any) {
    console.error(`[BIS] Search failed: ${error.message}`);
  }
  
  return sources;
}
