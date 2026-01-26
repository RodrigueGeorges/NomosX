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
} as const;

export type InstitutionalProvider = keyof typeof INSTITUTIONAL_PROVIDERS;
