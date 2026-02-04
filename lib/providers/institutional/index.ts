/**
 * Institutional Providers Index
 * Centralized exports for all institutional data sources
 */

// INTELLIGENCE
export * from './intelligence/odni';
export * from './intelligence/cia-foia';
export * from './intelligence/nsa';
export * from './intelligence/uk-jic';

// DEFENSE
export * from './defense/nato';
export * from './defense/eeas';
export * from './defense/sgdsn';
export * from './defense/eda';

// ECONOMIC
export * from './economic/imf';
export * from './economic/worldbank';
export * from './economic/oecd';
export * from './economic/bis';

// CYBER & RISK
export * from './cyber/nist';
export * from './cyber/cisa';
export * from './cyber/enisa';

// THINK TANKS (Innovative - via Google CSE)
export {
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
} from './v2/google-cse';

// MULTILATERAL
export * from './multilateral/un';
export * from './multilateral/undp';
export * from './multilateral/unctad';

// ARCHIVES
export * from './archives/nara';
export * from './archives/uk-archives';
export * from './archives/archives-nationales-fr';

/**
 * Provider metadata
 */
export const INSTITUTIONAL_PROVIDERS = {
  // Intelligence (Priority: CRITICAL)
  'odni': { category: 'intelligence', priority: 10, rateLimit: 1000 },
  'cia-foia': { category: 'intelligence', priority: 9, rateLimit: 2000 },
  'nsa': { category: 'intelligence', priority: 9, rateLimit: 1000 },
  'uk-jic': { category: 'intelligence', priority: 8, rateLimit: 1000 },
  
  // Defense (Priority: HIGH)
  'nato': { category: 'defense', priority: 9, rateLimit: 1000 },
  'eeas': { category: 'defense', priority: 7, rateLimit: 1000 },
  'sgdsn': { category: 'defense', priority: 7, rateLimit: 1000 },
  'eda': { category: 'defense', priority: 6, rateLimit: 1000 },
  
  // Economic (Priority: HIGH)
  'imf': { category: 'economic', priority: 9, rateLimit: 1000 },
  'worldbank': { category: 'economic', priority: 9, rateLimit: 1000 },
  'oecd': { category: 'economic', priority: 8, rateLimit: 1000 },
  'bis': { category: 'economic', priority: 8, rateLimit: 1000 },
  
  // Cyber (Priority: MEDIUM)
  'nist': { category: 'cyber', priority: 7, rateLimit: 1000 },
  'cisa': { category: 'cyber', priority: 8, rateLimit: 1000 },
  'enisa': { category: 'cyber', priority: 7, rateLimit: 1000 },
  
  // Multilateral (Priority: MEDIUM)
  'un': { category: 'multilateral', priority: 6, rateLimit: 1500 },
  'undp': { category: 'multilateral', priority: 6, rateLimit: 1000 },
  'unctad': { category: 'multilateral', priority: 6, rateLimit: 1000 },
  
  // Archives (Priority: LOW - metadata only)
  'nara': { category: 'archives', priority: 4, rateLimit: 2000 },
  'uk-archives': { category: 'archives', priority: 4, rateLimit: 1500 },
  'archives-fr': { category: 'archives', priority: 4, rateLimit: 1500 },

  // Think Tanks (Priority: MEDIUM - innovative)
  'lawzero': { category: 'think-tank', priority: 7, rateLimit: 1500 },
  'govai': { category: 'think-tank', priority: 7, rateLimit: 1500 },
  'iaps': { category: 'think-tank', priority: 7, rateLimit: 1500 },
  'caip': { category: 'think-tank', priority: 6, rateLimit: 1500 },
  'aipi': { category: 'think-tank', priority: 6, rateLimit: 1500 },
  'cset': { category: 'think-tank', priority: 7, rateLimit: 1500 },
  'ainow': { category: 'think-tank', priority: 6, rateLimit: 1500 },
  'datasociety': { category: 'think-tank', priority: 6, rateLimit: 1500 },
  'abundance': { category: 'think-tank', priority: 6, rateLimit: 1500 },
  'caidp': { category: 'think-tank', priority: 6, rateLimit: 1500 },
  'scsp': { category: 'think-tank', priority: 6, rateLimit: 1500 },
  'ifp': { category: 'think-tank', priority: 6, rateLimit: 1500 },
  'cdt': { category: 'think-tank', priority: 6, rateLimit: 1500 },
  'brookings': { category: 'think-tank', priority: 6, rateLimit: 1500 },
  'fai': { category: 'think-tank', priority: 6, rateLimit: 1500 },
  'cnas': { category: 'think-tank', priority: 6, rateLimit: 1500 },
  'rand': { category: 'think-tank', priority: 6, rateLimit: 1500 },
  'newamerica': { category: 'think-tank', priority: 6, rateLimit: 1500 },
  'aspen-digital': { category: 'think-tank', priority: 6, rateLimit: 1500 },
  'rstreet': { category: 'think-tank', priority: 6, rateLimit: 1500 },
} as const;

export type InstitutionalProvider = keyof typeof INSTITUTIONAL_PROVIDERS;

export { searchODNI, searchCIAFOIA, searchNSA, searchUKJIC, searchNATO, searchEEAS, searchSGDSN, searchEDA, searchIMF, searchWorldBank, searchOECD, searchBIS, searchNIST, searchCISA, searchENISA, searchUN, searchUNDP, searchUNCTAD, searchNARA, searchUKArchives, searchArchivesNationalesFR }