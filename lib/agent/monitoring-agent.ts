/**
 * MONITORING AGENT - Crawl continu des sources institutionnelles
 * Vérifie régulièrement les nouvelles publications
 */

import { prisma } from '../db';
import { setTimeout } from 'timers/promises';

// Import tous les providers (chemins relatifs pour compatibilité runtime)
import { searchWorldBankAPI } from '../providers/institutional/stable/worldbank-api';
import { searchCISAAdvisories } from '../providers/institutional/stable/cisa-advisories';
import { searchNARA } from '../providers/institutional/v2/nara-api';
import { searchUKArchives } from '../providers/institutional/v2/uk-archives-api';
import { searchUNDigitalLibrary,searchUNDP,searchUNCTAD } from '../providers/institutional/v2/un-digital-library';
import { searchODNIViaGoogle,searchNATOViaGoogle,searchNSAViaGoogle,searchENISAViaGoogle,searchLawZeroViaGoogle,searchGovAIViaGoogle,searchIAPSViaGoogle,searchCAIPViaGoogle,searchAIPIViaGoogle,searchCSETViaGoogle,searchAINowViaGoogle,searchDataSocietyViaGoogle,searchAbundanceViaGoogle,searchCAIDPViaGoogle,searchSCSPViaGoogle,searchIFPViaGoogle,searchCDTViaGoogle,searchBrookingsViaGoogle,searchFAIViaGoogle,searchCNASViaGoogle,searchRANDViaGoogle,searchNewAmericaViaGoogle,searchAspenDigitalViaGoogle,searchRStreetViaGoogle } from '../providers/institutional/v2/google-cse';

// 🚀 LinkUp Integration - Hyper-Intelligent Provider
import { searchCIAFOIAViaArchive } from '../providers/institutional/v2/archive-org';
import { searchEEAS,searchEDA } from '../providers/institutional/v2/eu-open-data';
import { searchMinistereArmees,searchSGDSN,searchArchivesNationales } from '../providers/institutional/v2/france-gov';

// IMF (robust chaining): SDMX first, then fallback eLibrary scraping
import { searchIMFSDMX } from '../providers/institutional/v2/imf-sdmx';
import { searchIMFeLibrary } from '../providers/institutional/v2/imf-elibrary';

// OECD (robust chaining): SDMX first (non-Cloudflare), then fallback iLibrary
import { searchOECDSDMX } from '../providers/institutional/v2/oecd-sdmx';
import { searchOECDiLibrary } from '../providers/institutional/v2/oecd-ilibrary';

import { searchBIS } from '../providers/institutional/v2/bis-papers';
import { searchNIST } from '../providers/institutional/v2/nist-publications';
import { scoreSource } from '../score';

// NOUVEAUX PROVIDERS SOURCES VARIÉES
import { searchCrossref } from '../providers/academic/crossref-api';
import { searchOpenAlex } from '../providers/academic/openalex-api';
import { searchArXiv } from '../providers/academic/arxiv-api';
import { searchPubMed } from '../providers/academic/pubmed-api';
import { searchTechCrunch } from '../providers/business/techcrunch-api';
import { searchCrunchbase } from '../providers/business/crunchbase-api';
import { searchReuters } from '../providers/business/reuters-api';
import { searchGooglePatents } from '../providers/patents/google-patents-api';
import { searchPatentsView } from '../providers/patents/patentsview-api';
import { searchFigshare } from '../providers/data/figshare-api';
import { searchZenodo } from '../providers/data/zenodo-api';

// 🏛️ Macroéconomiques
import { searchEurostat } from '../providers/macro/eurostat-api';
import { searchECB } from '../providers/macro/ecb-api';
import { searchINSEE } from '../providers/macro/insee-api';

// 🚀 LinkUp Integration - Hyper-Intelligent Provider
import { searchWithLinkUp, financialAnalysisWithLinkUp, complementarySearchWithLinkUp } from '../providers/linkup-registry.mjs';

// 🏛️ Macro providers

// Using shared prisma singleton from db.ts

interface MonitoringConfig {
  providers: string[];
  queries: string[];
  interval: number; // minutes
  limit: number;
  minQualityScore: number;
  notifyOnNew: boolean;
}

interface MonitoringResult {
  provider: string;
  newSources: number;
  totalChecked: number;
  errors: string[];
  lastRun: Date;
}

/**
 * IMF chained provider:
 * - SDMX first (official IMF dataservices)
 * - Fallback to IMF eLibrary scraping if SDMX is unreachable or returns only curated fallback results
 */
async function searchIMFChained(query: string, limit: number): Promise<any[]> {
  let sdmxResults: any[] = [];

  try {
    sdmxResults = await searchIMFSDMX(query, limit);
  } catch (err: any) {
    console.warn(`[Monitoring][IMF] SDMX failed: ${err?.message || String(err)}`);
    sdmxResults = [];
  }

  const sdmxAllFallback =
    sdmxResults.length > 0 &&
    sdmxResults.every((s: any) => Boolean(s?.raw?.fallback));

  // If SDMX gave us real catalog matches, prefer them (fast + stable)
  if (sdmxResults.length > 0 && !sdmxAllFallback) {
    return sdmxResults.slice(0, limit);
  }

  // Otherwise try eLibrary scraping (may be blocked, but when it works it provides richer publication content)
  let elibResults: any[] = [];
  try {
    elibResults = await searchIMFeLibrary(query, limit);
  } catch (err: any) {
    console.warn(`[Monitoring][IMF] eLibrary fallback failed: ${err?.message || String(err)}`);
    elibResults = [];
  }

  // Merge: prefer eLibrary, fill remaining with SDMX fallback
  const merged: any[] = [];
  const seen = new Set<string>();

  for (const s of elibResults) {
    if (!s?.id) continue;
    if (seen.has(s.id)) continue;
    seen.add(s.id);
    merged.push(s);
    if (merged.length >= limit) return merged;
  }

  for (const s of sdmxResults) {
    if (!s?.id) continue;
    if (seen.has(s.id)) continue;
    seen.add(s.id);
    merged.push(s);
    if (merged.length >= limit) return merged;
  }

  return merged;
}

/**
 * OECD chained provider:
 * - SDMX first (https://sdmx.oecd.org/public/rest) to avoid Cloudflare blocks on oecd.org
 * - Fallback to OECD iLibrary scraping if SDMX is unreachable or returns curated fallback only
 */
export async function searchOECDChained(query: string, limit: number): Promise<any[]> {
  let sdmxResults: any[] = [];

  try {
    sdmxResults = await searchOECDSDMX(query, limit);
  } catch (err: any) {
    console.warn(`[Monitoring][OECD] SDMX failed: ${err?.message || String(err)}`);
    sdmxResults = [];
  }

  const sdmxAllFallback =
    sdmxResults.length > 0 &&
    sdmxResults.every((s: any) => Boolean(s?.raw?.fallback));

  // If SDMX gave real catalog matches, prefer them
  if (sdmxResults.length > 0 && !sdmxAllFallback) {
    return sdmxResults.slice(0, limit);
  }

  // Otherwise try iLibrary (may be blocked, but can return richer publication metadata when it works)
  let ilibResults: any[] = [];
  try {
    ilibResults = await searchOECDiLibrary(query, limit);
  } catch (err: any) {
    console.warn(`[Monitoring][OECD] iLibrary fallback failed: ${err?.message || String(err)}`);
    ilibResults = [];
  }

  // Prefer iLibrary, fill remaining with SDMX fallback
  const merged: any[] = [];
  const seen = new Set<string>();

  for (const s of ilibResults) {
    if (!s?.id) continue;
    if (seen.has(s.id)) continue;
    seen.add(s.id);
    merged.push(s);
    if (merged.length >= limit) return merged;
  }

  for (const s of sdmxResults) {
    if (!s?.id) continue;
    if (seen.has(s.id)) continue;
    seen.add(s.id);
    merged.push(s);
    if (merged.length >= limit) return merged;
  }

  return merged;
}

/**
 * Patents chained provider:
 * - PatentsView first (stable, API key)
 * - Fallback to legacy Google Patents implementation (scrape + fallbacks)
 */
async function searchPatentsChained(query: string, limit: number): Promise<any[]> {
  // Try PatentsView
  try {
    const pv = await searchPatentsView(query, limit);
    if (pv && pv.length > 0) return pv.slice(0, limit);
  } catch (err: any) {
    console.warn(`[Monitoring][Patents] PatentsView failed: ${err?.message || String(err)}`);
  }

  // Fallback to existing provider (already has its own fallback generation)
  return searchGooglePatents(query, limit);
}

/**
 * Mapping des providers vers leurs fonctions de recherche
 */
const PROVIDER_FUNCTIONS: Record<string, (query: string, limit: number) => Promise<any[]>> = {
  // 🏛️ Institutionnels
  'worldbank': searchWorldBankAPI,
  'cisa': searchCISAAdvisories,
  'nara': searchNARA,
  'uk-archives': searchUKArchives,
  'un': searchUNDigitalLibrary,
  'undp': searchUNDP,
  'unctad': searchUNCTAD,
  'odni': searchODNIViaGoogle,
  'nato': searchNATOViaGoogle,
  'nsa': searchNSAViaGoogle,
  'enisa': searchENISAViaGoogle,
  'cia-foia': searchCIAFOIAViaArchive,
  'eeas': searchEEAS,
  'eda': searchEDA,
  'sgdsn': searchSGDSN,
  'archives-fr': searchArchivesNationales,
  'imf': searchIMFChained,
  'oecd': searchOECDChained,
  'bis': searchBIS,
  'nist': searchNIST,
  'archives-nationales-fr': searchArchivesNationales,

  // 🎓 Académiques
  'crossref': searchCrossref,
  'openalex': searchOpenAlex,
  'arxiv': searchArXiv,
  'pubmed': searchPubMed,

  // 💼 Business
  'techcrunch': searchTechCrunch,
  'crunchbase': searchCrunchbase,
  'reuters': searchReuters,

  // 🔬 Patents
  'google-patents': searchPatentsChained,

  // 📦 Data
  'figshare': searchFigshare,
  'zenodo': searchZenodo,

  // 🏛️ Macroéconomiques
  'eurostat': searchEurostat,
  'ecb': searchECB,
  'insee': searchINSEE,

  // 🧠 Think Tanks
  'cset': searchCSETViaGoogle,
  'ainow': searchAINowViaGoogle,
  'datasociety': searchDataSocietyViaGoogle,
  'brookings': searchBrookingsViaGoogle,
  'rand': searchRANDViaGoogle,
  'lawzero': searchLawZeroViaGoogle,
  'govai': searchGovAIViaGoogle,
  'iaps': searchIAPSViaGoogle,
  'caip': searchCAIPViaGoogle,
  'aipi': searchAIPIViaGoogle,
  'abundance': searchAbundanceViaGoogle,
  'caidp': searchCAIDPViaGoogle,
  'scsp': searchSCSPViaGoogle,
  'ifp': searchIFPViaGoogle,
  'cdt': searchCDTViaGoogle,
  'fai': searchFAIViaGoogle,
  'cnas': searchCNASViaGoogle,
  'newamerica': searchNewAmericaViaGoogle,
  'aspen-digital': searchAspenDigitalViaGoogle,
  'rstreet': searchRStreetViaGoogle,

  // 🚀 LinkUp - Hyper-Intelligent AI Provider
  'linkup': async (query: string, limit: number) => {
    const result = await searchWithLinkUp(query, { 
      depth: 'standard', 
      outputType: 'searchResults',
      includeImages: false 
    });
    return result.success ? (result.data.results || []).slice(0, limit) : [];
  },
  'linkup-financial': async (query: string, limit: number) => {
    const result = await financialAnalysisWithLinkUp(query);
    return result.success ? (result.data.results || []).slice(0, limit) : [];
  },
  'linkup-complement': async (query: string, limit: number) => {
    const result = await complementarySearchWithLinkUp(query, []);
    return result.success ? (result.data.complementary || result.data.results || []).slice(0, limit) : [];
  }
};

/**
 * Check une source existe déjà dans la DB
 */
async function sourceExists(id: string): Promise<boolean> {
  const existing = await prisma.source.findUnique({ where: { id } });
  return Boolean(existing);
}

/**
 * Upsert une source dans la DB
 */
async function upsertSource(source: any): Promise<boolean> {
  try {
    // Calculer qualityScore
    const qualityScore = scoreSource({
      citationCount: 0,
      year: source.year,
      oaStatus: source.oaStatus,
      provider: source.provider,
      type: source.type,
      issuerType: source.issuerType,
      classification: source.classification,
      documentType: source.documentType
    });
    
    await prisma.source.upsert({
      where: { id: source.id },
      create: {
        id: source.id,
        provider: source.provider,
        type: source.type,
        title: source.title,
        abstract: source.abstract,
        url: source.url,
        pdfUrl: source.pdfUrl,
        year: source.year,
        authors: source.authors || [],
        citationCount: 0,
        oaStatus: source.oaStatus || 'unknown',
        qualityScore,
        noveltyScore: 100, // Nouveau = haute novelty
        
        // Institutional fields
        documentType: source.documentType,
        issuer: source.issuer,
        issuerType: source.issuerType,
        classification: source.classification,
        publishedDate: source.publishedDate,
        language: source.language,
        contentFormat: source.contentFormat,
        
        raw: source.raw || {}
      },
      update: {
        title: source.title,
        abstract: source.abstract,
        url: source.url,
        pdfUrl: source.pdfUrl,
        qualityScore,
        updatedAt: new Date()
      }
    });
    
    return true;
  } catch (error: any) {
    console.error(`[Monitoring] Failed to upsert source ${source.id}: ${error.message}`);
    return false;
  }
}

/**
 * Monitor un provider pour une query
 */
async function monitorProvider(
  provider: string,
  query: string,
  limit: number,
  minQualityScore: number
): Promise<{ newSources: number; totalChecked: number; errors: string[] }> {
  const searchFn = PROVIDER_FUNCTIONS[provider];
  
  if (!searchFn) {
    return { newSources: 0, totalChecked: 0, errors: [`Provider ${provider} not found`] };
  }
  
  console.log(`[Monitoring] Checking ${provider} for "${query}"...`);
  
  try {
    const sources = await searchFn(query, limit);
    let newCount = 0;
    const errors: string[] = [];
    
    for (const source of sources) {
      // Check quality threshold
      const qualityScore = scoreSource({
        citationCount: 0,
        year: source.year,
        oaStatus: source.oaStatus,
        provider: source.provider,
        type: source.type,
        issuerType: source.issuerType,
        classification: source.classification,
        documentType: source.documentType
      });
      
      if (qualityScore < minQualityScore) {
        continue;
      }
      
      // Check if new
      const exists = await sourceExists(source.id);
      
      if (!exists) {
        const success = await upsertSource(source);
        if (success) {
          newCount++;
          console.log(`  ✅ NEW: ${source.title.substring(0, 60)}...`);
        }
      }
    }
    
    console.log(`[Monitoring] ${provider}: ${newCount} new / ${sources.length} checked`);
    return { newSources: newCount, totalChecked: sources.length, errors };
    
  } catch (error: any) {
    console.error(`[Monitoring] Error with ${provider}: ${error.message}`);
    return { newSources: 0, totalChecked: 0, errors: [error.message] };
  }
}

/**
 * Lance un cycle de monitoring complet
 */
export async function runMonitoringCycle(config: MonitoringConfig): Promise<MonitoringResult[]> {
  console.log('\n🔍 MONITORING CYCLE START');
  console.log(`  Providers: ${config.providers.length}`);
  console.log(`  Queries: ${config.queries.length}`);
  console.log(`  Min Quality: ${config.minQualityScore}\n`);
  
  const results: MonitoringResult[] = [];
  
  for (const provider of config.providers) {
    let totalNew = 0;
    let totalChecked = 0;
    const errors: string[] = [];
    
    for (const query of config.queries) {
      const result = await monitorProvider(provider, query, config.limit, config.minQualityScore);
      totalNew += result.newSources;
      totalChecked += result.totalChecked;
      errors.push(...result.errors);
      
      // Rate limiting between queries
      await setTimeout(1000);
    }
    
    results.push({
      provider,
      newSources: totalNew,
      totalChecked,
      errors,
      lastRun: new Date()
    });
    
    // Rate limiting between providers
    await setTimeout(2000);
  }
  
  // Summary
  console.log('\n📊 MONITORING CYCLE COMPLETE\n');
  const totalNewSources = results.reduce((sum, r) => sum + r.newSources, 0);
  const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0);
  
  console.log(`  ✅ New sources: ${totalNewSources}`);
  console.log(`  ❌ Errors: ${totalErrors}`);
  
  if (config.notifyOnNew && totalNewSources > 0) {
    await notifyNewSources(results.filter(r => r.newSources > 0));
  }
  
  return results;
}

/**
 * Notification de nouvelles sources
 */
async function notifyNewSources(results: MonitoringResult[]) {
  console.log('\n🔔 NEW SOURCES NOTIFICATION\n');
  
  for (const result of results) {
    if (result.newSources > 0) {
      console.log(`  ${result.provider}: ${result.newSources} new sources`);
      
      // TODO: Envoyer email/webhook/Slack notification
      // await sendSlackNotification({
      //   text: `🆕 ${result.newSources} nouvelles sources de ${result.provider}`,
      //   channel: '#research-updates'
      // });
    }
  }
}

/**
 * Lance le monitoring en continu (boucle infinie)
 */
export async function startContinuousMonitoring(config: MonitoringConfig) {
  console.log('🚀 CONTINUOUS MONITORING STARTED');
  console.log(`  Interval: ${config.interval} minutes\n`);
  
  // Log monitoring config in DB
  const monitoringCorrelationId = `monitoring-${Date.now()}`;
  await prisma.job.create({
    data: {
      type: 'MONITORING',
      status: 'RUNNING',
      correlationId: monitoringCorrelationId,
      payload: config as any
    }
  });
  
  let cycleCount = 0;
  
  while (true) {
    cycleCount++;
    console.log(`\n${'='.repeat(60)}`);
    console.log(`CYCLE #${cycleCount} - ${new Date().toISOString()}`);
    console.log('='.repeat(60));
    
    try {
      const results = await runMonitoringCycle(config);
      
      // Log results in DB
      await prisma.job.create({
        data: {
          type: 'MONITORING_CYCLE',
          status: 'COMPLETED',
          correlationId: `${monitoringCorrelationId}-cycle-${cycleCount}`,
          payload: config as any,
          result: results as any
        }
      });
      
    } catch (error: any) {
      console.error(`❌ Cycle #${cycleCount} failed:`, error.message);
      
      await prisma.job.create({
        data: {
          type: 'MONITORING_CYCLE',
          status: 'FAILED',
          correlationId: `${monitoringCorrelationId}-cycle-${cycleCount}`,
          payload: config as any,
          lastError: error.message
        }
      });
    }
    
    // Wait for next cycle
    const waitMs = config.interval * 60 * 1000;
    console.log(`\n⏳ Waiting ${config.interval} minutes until next cycle...\n`);
    await setTimeout(waitMs);
  }
}

/**
 * Config par défaut pour monitoring institutionnel
 */
export const DEFAULT_INSTITUTIONAL_MONITORING: MonitoringConfig = {
  providers: [
    // High priority (check often)
    'cisa',        // Cyber threats (daily)
    'nist',        // Standards (weekly)
    'worldbank',   // Economic reports (weekly)
    
    // Medium priority (check regularly)
    'odni',
    'nato',
    'un',
    'imf',
    'oecd',
    
    // Lower priority (check less often)
    'nara',
    'uk-archives',
    'cia-foia',
    'bis'
  ],
  queries: [
    'cybersecurity',
    'artificial intelligence',
    'climate change',
    'geopolitical risk',
    'economic stability',
    'critical infrastructure'
  ],
  interval: 360, // 6 heures
  limit: 10,
  minQualityScore: 70,
  notifyOnNew: true
};

/**
 * Config pour monitoring temps réel (cyber threats)
 */
export const REALTIME_CYBER_MONITORING: MonitoringConfig = {
  providers: ['cisa', 'nist', 'enisa'],
  queries: [
    'zero-day vulnerability',
    'ransomware',
    'critical infrastructure attack',
    'supply chain security'
  ],
  interval: 60, // 1 heure
  limit: 3, // Réduit pour plus de providers
  minQualityScore: 60, // Baisser pour plus de sources
  notifyOnNew: true
};

 /**
 * Config pour monitoring sources variées (académique + business + innovation + data)
 */
export const VARIED_SOURCES_MONITORING: MonitoringConfig = {
  providers: [
    // 🎓 Académique Fondamental (15% poids)
    'crossref', 'openalex', 'arxiv', 'pubmed',
    
    // 🏛️ Institutionnel & Politique (25% poids)
    'worldbank', 'cisa', 'nist', 'imf', 'oecd', 'un', 'bis', 'enisa',
    
    // 🕵️ Intelligence & Défense (20% poids)
    'odni', 'cia-foia', 'nsa', 'uk-jic', 'nato', 'eeas', 'sgdsn', 'eda',
    
    // 🌍 Multilatéral & Développement (10% poids)
    'undp', 'unctad',
    
    // 📚 Archives & Historique (5% poids)
    'archives-nationales-fr', 'nara', 'uk-archives',
    
    // 💼 Business & Innovation (15% poids)
    'techcrunch', 'crunchbase', 'reuters', 'bloomberg', 'financial-times',
    
    // 🔬 Innovation & Patents (5% poids)
    'google-patents',
    
    // 📦 Data & Repositories (5% poids)
    'figshare', 'zenodo',
    
    // 🧠 Think Tanks (stratégique - 15% poids)
    'cset', 'ainow', 'datasociety', 'brookings', 'rand',
    'lawzero', 'govai', 'iaps', 'caip', 'aipi', 'abundance', 'caidp', 
    'scsp', 'ifp', 'cdt', 'fai', 'cnas', 'newamerica', 'aspen-digital', 'rstreet',
    
    // 🚀 LinkUp - Hyper-Intelligent AI Provider (prioritaire)
    'linkup', 'linkup-financial', 'linkup-complement'
  ],
  queries: [
    'artificial intelligence',
    'machine learning',
    'cybersecurity',
    'climate change',
    'blockchain',
    'quantum computing',
    'biotechnology',
    'renewable energy',
    'digital transformation',
    'geopolitical risk',
    'startup funding',
    'venture capital',
    'patent innovation',
    'research breakthrough',
    'technology disruption'
  ],
  interval: 180, // 3 heures
  limit: 8,
  minQualityScore: 60,
  notifyOnNew: true
};

/**
 * Config pour monitoring LinkUp - Hyper-Intelligent AI Provider
 * Spécialisé dans les requêtes financières, business et analyses complexes
 */
export const LINKUP_INTELLIGENT_MONITORING: MonitoringConfig = {
  providers: [
    // 🚀 LinkUp - Hyper-Intelligent AI Provider (100% prioritaire)
    'linkup', 'linkup-financial', 'linkup-complement'
  ],
  queries: [
    // 📊 Finance & Business
    'Microsoft revenue operating income 2024',
    'Apple quarterly earnings 2024',
    'Tesla financial performance Q4 2024',
    'NVIDIA AI chip revenue 2024',
    'Google Alphabet financial results 2024',
    
    // 🤖 AI & Technology Trends
    'artificial intelligence market size 2024',
    'machine learning industry trends',
    'ChatGPT OpenAI revenue impact',
    'AI startup funding rounds 2024',
    'enterprise AI adoption rates',
    
    // 💰 Market Analysis
    'S&P 500 technology sector performance',
    'NASDAQ tech stocks analysis 2024',
    'venture capital investment trends',
    'private equity tech deals 2024',
    'cryptocurrency market analysis',
    
    // 🏢 Corporate Intelligence
    'Fortune 500 companies financial health',
    'big tech earnings surprises 2024',
    'supply chain disruptions impact',
    'inflation effect on tech companies',
    'digital transformation ROI'
  ],
  interval: 120, // 2 heures - plus fréquent pour les données financières
  limit: 15, // Plus de résultats pour les analyses financières
  minQualityScore: 75, // Qualité plus élevée pour les données financières
  notifyOnNew: true
};
