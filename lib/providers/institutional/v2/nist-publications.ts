/**
 * NIST Publications - RSS + Database search
 * Site très stable avec plusieurs feeds
 */

import axios from 'axios';
import Parser from 'rss-parser';

const NIST_RSS = 'https://csrc.nist.gov/publications/search/rss';
const NIST_SEARCH_API = 'https://csrc.nist.gov/CSRC/media/feeds';
const USER_AGENT = 'NomosX Research Bot (+https://nomosx.com | contact@nomosx.com)';

const parser = new Parser({ headers: { 'User-Agent': USER_AGENT } });

/**
 * Search NIST publications via RSS feed
 * Très stable, mis à jour régulièrement
 */
export async function searchNIST(query: string, limit = 20) {
  const sources = [];
  
  try {
    console.log(`[NIST] Searching for: "${query}"`);
    
    const feed = await parser.parseURL(NIST_RSS);
    
    const filtered = feed.items
      .filter(item => 
        item.title?.toLowerCase().includes(query.toLowerCase()) ||
        item.contentSnippet?.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, limit);
    
    for (const item of filtered) {
      const year = item.pubDate ? new Date(item.pubDate).getFullYear() : null;
      
      // Detect publication type from title
      let docType = 'standard';
      if (item.title?.includes('SP 800')) docType = 'special-publication';
      if (item.title?.includes('FIPS')) docType = 'fips';
      if (item.title?.includes('IR ')) docType = 'internal-report';
      
      sources.push({
        id: `nist:${Buffer.from(item.link || '').toString('base64').slice(0, 24)}`,
        provider: 'nist',
        type: 'standard',
        title: item.title || 'Untitled',
        abstract: item.contentSnippet || '',
        url: item.link || '',
        year,
        publishedDate: item.pubDate ? new Date(item.pubDate) : null,
        
        // Metadata
        documentType: docType,
        issuer: 'NIST',
        issuerType: 'cyber',
        classification: 'public',
        language: 'en',
        contentFormat: 'pdf',
        oaStatus: 'public-domain',
        hasFullText: true
      });
    }
    
    console.log(`[NIST] Found ${sources.length} publications`);
  } catch (error: any) {
    console.error(`[NIST] Search failed: ${error.message}`);
  }
  
  return sources;
}
