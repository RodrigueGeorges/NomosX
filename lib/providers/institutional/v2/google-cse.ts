/**
 * Google Custom Search Engine - Pour sites sans API
 * Solution FIABLE pour ODNI, NATO, NSA, ENISA
 * 
 * Setup:
 * 1. Créer CSE sur https://programmablesearchengine.google.com/
 * 2. Ajouter sites: dni.gov, nato.int, nsa.gov, enisa.europa.eu
 * 3. Get API key: https://developers.google.com/custom-search/v1/introduction
 */

import axios from 'axios';

const GOOGLE_CSE_BASE = 'https://www.googleapis.com/customsearch/v1';

interface GoogleCSEConfig {
  apiKey: string;
  cx: string; // Search Engine ID
}

/**
 * Search via Google Custom Search Engine
 * Plus fiable que le scraping direct !
 */
export async function searchViaGoogleCSE(
  query: string,
  site: string,
  limit = 10,
  config: GoogleCSEConfig = {
    apiKey: process.env.GOOGLE_CSE_KEY || '',
    cx: process.env.GOOGLE_CSE_CX || ''
  }
) {
  if (!config.apiKey || !config.cx) {
    console.warn('[Google CSE] API key or CX missing, skipping');
    return [];
  }
  
  const sources = [];
  
  try {
    console.log(`[Google-CSE] Searching "${query}" on ${site}...`);
    
    const params = {
      key: config.apiKey,
      cx: config.cx,
      q: `${query} site:${site}`,
      num: Math.min(10, limit),
      fileType: 'pdf' // Privilégier PDFs pour docs officiels
    };
    
    const { data } = await axios.get(GOOGLE_CSE_BASE, {
      params,
      timeout: 10000
    });
    
    if (data.items) {
      for (const item of data.items) {
        // Extract year from metadata or content
        const yearMatch = item.snippet?.match(/\b(19|20)\d{2}\b/) || 
                          item.title?.match(/\b(19|20)\d{2}\b/);
        const year = yearMatch ? parseInt(yearMatch[0]) : new Date().getFullYear();
        
        sources.push({
          id: `google-cse:${Buffer.from(item.link).toString('base64').slice(0, 24)}`,
          provider: siteToProvider(site),
          type: 'report',
          title: item.title || 'Untitled',
          abstract: item.snippet || '',
          url: item.link,
          pdfUrl: item.link.endsWith('.pdf') ? item.link : null,
          year,
          publishedDate: null,
          
          // Metadata inférée du site
          documentType: 'report',
          issuer: siteToIssuer(site),
          issuerType: siteToIssuerType(site),
          classification: 'public',
          language: 'en',
          contentFormat: item.link.endsWith('.pdf') ? 'pdf' : 'html',
          oaStatus: 'public-domain',
          hasFullText: true,
          
          raw: item
        });
      }
    }
    
    console.log(`[Google-CSE] Found ${sources.length} results on ${site}`);
  } catch (error: any) {
    if (error.response?.status === 429) {
      console.error('[Google-CSE] Rate limit hit, consider upgrading quota');
    } else {
      console.error(`[Google-CSE] Search failed: ${error.message}`);
    }
  }
  
  return sources;
}

/**
 * Convenience functions pour chaque provider
 */

export async function searchODNIViaGoogle(query: string, limit = 10) {
  return searchViaGoogleCSE(query, 'dni.gov', limit);
}

export async function searchNATOViaGoogle(query: string, limit = 10) {
  return searchViaGoogleCSE(query, 'nato.int', limit);
}

export async function searchNSAViaGoogle(query: string, limit = 10) {
  return searchViaGoogleCSE(query, 'nsa.gov', limit);
}

export async function searchENISAViaGoogle(query: string, limit = 10) {
  return searchViaGoogleCSE(query, 'enisa.europa.eu', limit);
}

// Helpers
function siteToProvider(site: string): string {
  const map: Record<string, string> = {
    'dni.gov': 'odni',
    'nato.int': 'nato',
    'nsa.gov': 'nsa',
    'enisa.europa.eu': 'enisa'
  };
  return map[site] || site;
}

function siteToIssuer(site: string): string {
  const map: Record<string, string> = {
    'dni.gov': 'ODNI',
    'nato.int': 'NATO',
    'nsa.gov': 'NSA',
    'enisa.europa.eu': 'ENISA'
  };
  return map[site] || site;
}

function siteToIssuerType(site: string): string {
  const map: Record<string, string> = {
    'dni.gov': 'intelligence',
    'nato.int': 'defense',
    'nsa.gov': 'intelligence',
    'enisa.europa.eu': 'cyber'
  };
  return map[site] || 'multilateral';
}
