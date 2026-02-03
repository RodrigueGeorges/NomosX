// Registry Final Complet - Tous les providers NomosX
// Providers existants (53) + Nouveaux providers (29) = 82 providers totaux

const {PwCResearchProvider} = require('./pwc-research-provider.js');
const {EYResearchProvider} = require('./ey-research-provider.js');
const {KPMGThoughtLeadershipProvider} = require('./kpmg-thought-leadership-provider.js');
const {BainInsightsProvider} = require('./bain-insights-provider.js');
const {AccentureResearchProvider} = require('./accenture-research-provider.js');
const {LancetProvider} = require('./lancet-provider.js');
const {NEJMProvider} = require('./nejm-provider.js');
const {NatureMedicineProvider} = require('./nature-medicine-provider.js');
const {JAMAProvider} = require('./jama-provider.js');
const {DeepMindResearchProvider} = require('./deepmind-research-provider.js');
const {OpenAIResearchProvider} = require('./openai-research-provider.js');
const {AIIndexProvider} = require('./ai-index-provider.js');
const {PartnershipAIProvider} = require('./partnership-ai-provider.js');
const {IEAProvider} = require('./iea-provider.js');
const {IRENAProvider} = require('./irena-provider.js');
const {RMIProvider} = require('./rmi-provider.js');
const {EnergyFuturesProvider} = require('./energy-futures-provider.js');
const {NatureProvider} = require('./nature-provider.js');
const {ScienceProvider} = require('./science-provider.js');
const {CellProvider} = require('./cell-provider.js');
const {PNASProvider} = require('./pnas-provider.js');
const {WorldBankResearchProvider} = require('./worldbank-research-provider.js');
const {UNDResearchProvider} = require('./undp-research-provider.js');
const {CGDProvider} = require('./cgd-provider.js');
const {ACETProvider} = require('./acet-provider.js');
const {SAIIAProvider} = require('./saiia-provider.js');
const {AmazonScienceProvider} = require('./amazon-science-provider.js');
const {MicrosoftResearchProvider} = require('./microsoft-research-provider.js');
const {GoogleAIResearchProvider} = require('./google-ai-research-provider.js');

export const finalProviders = {
  // Nouveaux providers - Vague 1: Business Elite Complément
    'pwc-research-institute': new PwCResearchProvider(),
    'ey-research': new EYResearchProvider(),
    'kpmg-thought-leadership': new KPMGThoughtLeadershipProvider(),
    'bain---company-insights': new BainInsightsProvider(),
    'accenture-research': new AccentureResearchProvider(),
  
  // Nouveaux providers - Vague 2: Recherche Médicale Avancée
    'the-lancet': new LancetProvider(),
    'new-england-journal-of-medicine': new NEJMProvider(),
    'nature-medicine': new NatureMedicineProvider(),
    'jama---journal-of-american-medical-association': new JAMAProvider(),
  
  // Nouveaux providers - Vague 3: Intelligence Artificielle Spécialisée
    'deepmind-research': new DeepMindResearchProvider(),
    'openai-research': new OpenAIResearchProvider(),
    'ai-index---stanford-hai': new AIIndexProvider(),
    'partnership-on-ai': new PartnershipAIProvider(),
  
  // Nouveaux providers - Vague 4: Énergie Transition
    'iea---international-energy-agency': new IEAProvider(),
    'irena---international-renewable-energy-agency': new IRENAProvider(),
    'rmi---rocky-mountain-institute': new RMIProvider(),
    'energy-futures-initiative': new EnergyFuturesProvider(),
  
  // Nouveaux providers - Vague 5: Science Fondamentale
    'nature': new NatureProvider(),
    'science': new ScienceProvider(),
    'cell': new CellProvider(),
    'pnas---proceedings-of-national-academy-of-sciences': new PNASProvider(),
  
  // Nouveaux providers - Vague 6: Développement International
    'world-bank-research---development': new WorldBankResearchProvider(),
    'undp-research': new UNDResearchProvider(),
    'center-for-global-development': new CGDProvider(),
  
  // Nouveaux providers - Vague 7: Think Tanks Afrique
    'acet---african-center-for-economic-transformation': new ACETProvider(),
    'saiia---south-african-institute-of-international-affairs': new SAIIAProvider(),
  
  // Nouveaux providers - Vague 8: E-commerce Digital
    'amazon-science': new AmazonScienceProvider(),
    'microsoft-research': new MicrosoftResearchProvider(),
    'google-ai-research': new GoogleAIResearchProvider()
};

module.exports = finalProviders;;
