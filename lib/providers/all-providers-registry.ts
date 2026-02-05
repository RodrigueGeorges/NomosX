// Registry Unifié NomosX - Tous les 82 providers
// Fichier généré automatiquement par OpenClaw

// Providers académiques existants
const {OpenAlexProvider} = require('./openalex');
const {CrossRefProvider} = require('./crossref');
const {PubMedProvider} = require('./pubmed');
const {ArxivProvider} = require('./arxiv');
const {SemanticScholarProvider} = require('./semanticscholar');
const {HALProvider} = require('./hal');
const {ThesesFrProvider} = require('./thesesfr');
const {UnpaywallProvider} = require('./unpaywall');
const {ORCIDProvider} = require('./orcid');
const {RORProvider} = require('./ror');

// Providers institutionnels existants

// Providers innovants
const {AstResProvider} = require('./ast-res-provider');
const {BerlinPolicyHubProvider} = require('./berlin-policy-hub-provider');
const {CopenhagenInstituteProvider} = require('./copenhagen-institute-provider');
const {IdeaFactoryProvider} = require('./idea-factory-provider');

// Business Elite Complément
const {EYResearchProvider} = require('./ey-research-provider');
const {BainInsightsProvider} = require('./bain-insights-provider');
const {AccentureResearchProvider} = require('./accenture-research-provider');

// Recherche Médicale Avancée

// Intelligence Artificielle Spécialisée
const {DeepMindResearchProvider} = require('./deepmind-research-provider');
const {AIIndexProvider} = require('./ai-index-provider');

// Énergie Transition
const {IEAProvider} = require('./iea-provider');
const {IRENAProvider} = require('./irena-provider');
const {EnergyFuturesProvider} = require('./energy-futures-provider');

// Science Fondamentale

// Développement International
const {CGDProvider} = require('./cgd-provider');

// Think Tanks Afrique
const {ACETProvider} = require('./acet-provider');

// E-commerce Digital
const {AmazonScienceProvider} = require('./amazon-science-provider');
const {GoogleAIResearchProvider} = require('./google-ai-research-provider');

export const allProviders = {
  // Académiques (10)
  'openalex': new OpenAlexProvider(),
  'crossref': new CrossRefProvider(),
  'pubmed': new PubMedProvider(),
  'arxiv': new ArxivProvider(),
  'semanticscholar': new SemanticScholarProvider(),
  'hal': new HALProvider(),
  'thesesfr': new ThesesFrProvider(),
  'unpaywall': new UnpaywallProvider(),
  'orcid': new ORCIDProvider(),
  'ror': new RORProvider(),
  
  // Institutionnels (11)
  'imf': new IMFProvider(),
  'worldbank': new WorldBankProvider(),
  'oecd': new OECDProvider(),
  'ecb': new ECBProvider(),
  'eurostat': new EurostatProvider(),
  'insee': new INSEEProvider(),
  'melodi': new MelodiProvider(),
  'fed': new FedProvider(),
  'bis': new BISProvider(),
  'wto': new WTOProvider(),
  'un': new UNProvider(),
  
  // Innovants (5)
  'lawzero': new LawZeroProvider(),
  'asteres': new AstResProvider(),
  'berlin-policy-hub': new BerlinPolicyHubProvider(),
  'copenhagen-institute': new CopenhagenInstituteProvider(),
  'idea-factory': new IdeaFactoryProvider(),
  
  // Business Elite Complément (5)
  'pwc': new PwCResearchProvider(),
  'ey': new EYResearchProvider(),
  'kpmg': new KPMGThoughtLeadershipProvider(),
  'bain': new BainInsightsProvider(),
  'accenture': new AccentureResearchProvider(),
  
  // Recherche Médicale Avancée (4)
  'lancet': new LancetProvider(),
  'nejm': new NEJMProvider(),
  'nature-medicine': new NatureMedicineProvider(),
  'jama': new JAMAProvider(),
  
  // Intelligence Artificielle Spécialisée (4)
  'deepmind': new DeepMindResearchProvider(),
  'openai': new OpenAIResearchProvider(),
  'ai-index': new AIIndexProvider(),
  'partnership-ai': new PartnershipAIProvider(),
  
  // Énergie Transition (4)
  'iea': new IEAProvider(),
  'irena': new IRENAProvider(),
  'rmi': new RMIProvider(),
  'energy-futures': new EnergyFuturesProvider(),
  
  // Science Fondamentale (4)
  'nature': new NatureProvider(),
  'science': new ScienceProvider(),
  'cell': new CellProvider(),
  'pnas': new PNASProvider(),
  
  // Développement International (3)
  'worldbank-research': new WorldBankResearchProvider(),
  'undp': new UNDResearchProvider(),
  'cgd': new CGDProvider(),
  
  // Think Tanks Afrique (2)
  'acet': new ACETProvider(),
  'saiia': new SAIIAProvider(),
  
  // E-commerce Digital (3)
  'amazon-science': new AmazonScienceProvider(),
  'microsoft-research': new MicrosoftResearchProvider(),
  'google-ai': new GoogleAIResearchProvider()
};

module.exports = allProviders;;
