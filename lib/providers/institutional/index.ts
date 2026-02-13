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

