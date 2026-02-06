// Registry Unifié NomosX - Tous les 82 providers
// Fichier généré automatiquement par OpenClaw

// Providers académiques existants
import { OpenAlexProvider } from './openalex';
import { CrossRefProvider } from './crossref';
import { PubMedProvider } from './pubmed';
import { ArxivProvider } from './arxiv';
import { SemanticScholarProvider } from './semanticscholar';
import { HALProvider } from './hal';
import { ThesesFrProvider } from './thesesfr';
import { UnpaywallProvider } from './unpaywall';
import { ORCIDProvider } from './orcid';
import { RORProvider } from './ror';

// Providers institutionnels existants

// Providers innovants
import { AstResProvider } from './ast-res-provider';
import { BerlinPolicyHubProvider } from './berlin-policy-hub-provider';
import { CopenhagenInstituteProvider } from './copenhagen-institute-provider';
import { IdeaFactoryProvider } from './idea-factory-provider';

// Business Elite Complément
import { EYResearchProvider } from './ey-research-provider';
import { BainInsightsProvider } from './bain-insights-provider';
import { AccentureResearchProvider } from './accenture-research-provider';

// Recherche Médicale Avancée

// Intelligence Artificielle Spécialisée
import { DeepMindResearchProvider } from './deepmind-research-provider';
import { AIIndexProvider } from './ai-index-provider';

// Énergie Transition
import { IEAProvider } from './iea-provider';
import { IRENAProvider } from './irena-provider';
import { EnergyFuturesProvider } from './energy-futures-provider';

// Science Fondamentale

// Développement International
import { CGDProvider } from './cgd-provider';

// Think Tanks Afrique
import { ACETProvider } from './acet-provider';

// E-commerce Digital
import { AmazonScienceProvider } from './amazon-science-provider';
import { GoogleAIResearchProvider } from './google-ai-research-provider';

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

export default allProviders;
