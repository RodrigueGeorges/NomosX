/**
 * MONITORING AGENT - Crawl continu des sources institutionnelles
 * Vérifie régulièrement les nouvelles publications
 */

import { prisma } from '../db';
import { setTimeout as sleep } from 'timers/promises';

// Import tous les providers (chemins relatifs pour compatibilité runtime)
import { searchWorldBankAPI } from '../providers/institutional/stable/worldbank-api';
import { searchCISAAdvisories } from '../providers/institutional/stable/cisa-advisories';
import { searchNARA } from '../providers/institutional/v2/nara-api';
import { searchUKArchives } from '../providers/institutional/v2/uk-archives-api';
import { searchUNDigitalLibrary, searchUNDP, searchUNCTAD } from '../providers/institutional/v2/un-digital-library';
import {
  searchODNIViaGoogle,
  searchNATOViaGoogle,
  searchNSAViaGoogle,
  searchENISAViaGoogle,
  searchLawZeroViaGoogle,
  searchGovAIViaGoogle,
  searchIAPSViaGoogle,
  searchCAIPViaGoogle,
  searchAIPIViaGoogle,
  searchCSETViaGoogle,
  searchAINowViaGoogle,
  searchDataSocietyViaGoogle,
  searchAbundanceViaGoogle,
  searchCAIDPViaGoogle,
  searchSCSPViaGoogle,
  searchIFPViaGoogle,
  searchCDTViaGoogle,
  searchBrookingsViaGoogle,
  searchFAIViaGoogle,
  searchCNASViaGoogle,
  searchRANDViaGoogle,
  searchNewAmericaViaGoogle,
  searchAspenDigitalViaGoogle,
  searchRStreetViaGoogle
} from '../providers/institutional/v2/google-cse';
import { searchCIAFOIAViaArchive } from '../providers/institutional/v2/archive-org';
import { searchEEAS, searchEDA } from '../providers/institutional/v2/eu-open-data';
import { searchMinistereArmees, searchSGDSN, searchArchivesNationales } from '../providers/institutional/v2/france-gov';
import { searchIMFeLibrary } from '../providers/institutional/v2/imf-elibrary';
import { searchOECDiLibrary } from '../providers/institutional/v2/oecd-ilibrary';
import { searchBIS } from '../providers/institutional/v2/bis-papers';
import { searchNIST } from '../providers/institutional/v2/nist-publications';
import { scoreSource } from '../score';

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
 * Mapping des providers vers leurs fonctions de recherche
 */
const PROVIDER_FUNCTIONS: Record<string, (query: string, limit: number) => Promise<any[]>> = {
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
  'ministere-armees': searchMinistereArmees,
  'sgdsn': searchSGDSN,
  'archives-fr': searchArchivesNationales,
  'imf': searchIMFeLibrary,
  'oecd': searchOECDiLibrary,
  'bis': searchBIS,
  'nist': searchNIST,

  // Think Tanks (innovants)
  'lawzero': searchLawZeroViaGoogle,
  'govai': searchGovAIViaGoogle,
  'iaps': searchIAPSViaGoogle,
  'caip': searchCAIPViaGoogle,
  'aipi': searchAIPIViaGoogle,
  'cset': searchCSETViaGoogle,
  'ainow': searchAINowViaGoogle,
  'datasociety': searchDataSocietyViaGoogle,
  'abundance': searchAbundanceViaGoogle,
  'caidp': searchCAIDPViaGoogle,
  'scsp': searchSCSPViaGoogle,
  'ifp': searchIFPViaGoogle,
  'cdt': searchCDTViaGoogle,
  'brookings': searchBrookingsViaGoogle,
  'fai': searchFAIViaGoogle,
  'cnas': searchCNASViaGoogle,
  'rand': searchRANDViaGoogle,
  'newamerica': searchNewAmericaViaGoogle,
  'aspen-digital': searchAspenDigitalViaGoogle,
  'rstreet': searchRStreetViaGoogle
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
      await sleep(1000);
    }
    
    results.push({
      provider,
      newSources: totalNew,
      totalChecked,
      errors,
      lastRun: new Date()
    });
    
    // Rate limiting between providers
    await sleep(2000);
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
    await sleep(waitMs);
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
  limit: 20,
  minQualityScore: 80,
  notifyOnNew: true
};
