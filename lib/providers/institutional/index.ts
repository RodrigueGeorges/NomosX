/**
 * Institutional Providers Index
 * Centralized exports for all institutional data sources
 */

// INTELLIGENCE
export { searchODNI } from './intelligence/odni';
export { searchCIAFOIA } from './intelligence/cia-foia';
export { searchNSA } from './intelligence/nsa';
export { searchUKJIC } from './intelligence/uk-jic';

// DEFENSE
export { searchNATO } from './defense/nato';
export { searchEEAS } from './defense/eeas';
export { searchSGDSN } from './defense/sgdsn';
export { searchEDA } from './defense/eda';

// ECONOMIC
export { searchIMF } from './economic/imf';
export { searchWorldBank } from './economic/worldbank';
export { searchOECD } from './economic/oecd';
export { searchBIS } from './economic/bis';

// CYBER & RISK
export { searchNIST } from './cyber/nist';
export { searchCISA } from './cyber/cisa';
export { searchENISA } from './cyber/enisa';

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
export { searchUN } from './multilateral/un';
export { searchUNDP } from './multilateral/undp';
export { searchUNCTAD } from './multilateral/unctad';

// ARCHIVES
export { searchNARA } from './archives/nara';
export { searchUKArchives } from './archives/uk-archives';
export { searchArchivesNationalesFR } from './archives/archives-nationales-fr';

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
