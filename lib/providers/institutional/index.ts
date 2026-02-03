/**
 * Institutional Providers Index
 * Centralized exports for all institutional data sources
 */

// INTELLIGENCE;
from './intelligence/odni';
from './intelligence/cia-foia';
from './intelligence/nsa';
from './intelligence/uk-jic';

// DEFENSE;
from './defense/nato';
from './defense/eeas';
from './defense/sgdsn';
from './defense/eda';

// ECONOMIC;
from './economic/imf';
from './economic/worldbank';
from './economic/oecd';
from './economic/bis';

// CYBER & RISK;
from './cyber/nist';
from './cyber/cisa';
from './cyber/enisa';

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

// MULTILATERAL;
from './multilateral/un';
from './multilateral/undp';
from './multilateral/unctad';

// ARCHIVES;
from './archives/nara';
from './archives/uk-archives';
from './archives/archives-nationales-fr';

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