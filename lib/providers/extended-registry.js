// Registry étendu avec tous les providers
const {LawZeroProvider} = require('./lawzero-provider.js');
const {AstResProvider} = require('./ast-res-provider.js');
const {BerlinPolicyHubProvider} = require('./berlin-policy-hub-provider.js');
const {CopenhagenInstituteProvider} = require('./copenhagen-institute-provider.js');
const {IdeaFactoryProvider} = require('./idea-factory-provider.js');

// Nouveaux providers Business Elite
const {McKinseyGlobalInstituteProvider} = require('./mckinsey-global-institute-provider.js');
const {BCGHendersonInstituteProvider} = require('./bcg-henderson-institute-provider.js');
const {DeloitteInsightsProvider} = require('./deloitte-insights-provider.js');

// Policy US
const {BrookingsInstitutionProvider} = require('./brookings-institution-provider.js');
const {CarnegieEndowmentProvider} = require('./carnegie-endowment-provider.js');
const {CouncilOnForeignRelationsProvider} = require('./council-foreign-relations-provider.js');

// Think Tanks Asie
const {IISSProvider} = require('./iiss-provider.js');
const {RSISProvider} = require('./rsis-provider.js');
const {CISProvider} = require('./cis-provider.js');

// Climate Research
const {IPCCProvider} = require('./ipcc-provider.js');
const {ClimateAnalyticsProvider} = require('./climate-analytics-provider.js');
const {WRIProvider} = require('./wri-provider.js');

// Data Science
const {PapersWithCodeProvider} = require('./papers-with-code-provider.js');
const {KaggleResearchProvider} = require('./kaggle-research-provider.js');
const {ArXivCSProvider} = require('./arxiv-cs-provider.js');

// Santé Publique
const {WHOProvider} = require('./who-provider.js');
const {JohnsHopkinsProvider} = require('./johns-hopkins-provider.js');
const {HarvardChanProvider} = require('./harvard-chan-provider.js');

// Finance
const {BlackRockProvider} = require('./blackrock-provider.js');
const {BISProvider} = require('./bis-provider.js');
const {VanguardProvider} = require('./vanguard-provider.js');

// Géopolitique
const {ChathamHouseProvider} = require('./chatham-house-provider.js');
const {RANDProvider} = require('./rand-provider.js');
const {CSISProvider} = require('./csis-provider.js');

// Think Tank Europe
const {BruegelProvider} = require('./bruegel-provider.js');
const {CEPRProvider} = require('./cepr-provider.js');
const {DGAPProvider} = require('./dgap-provider.js');

export const providers = {
  // Innovants existants
  'lawzero': new LawZeroProvider(),
  'asteres': new AstResProvider(),
  'berlin-policy-hub': new BerlinPolicyHubProvider(),
  'copenhagen-institute': new CopenhagenInstituteProvider(),
  'idea-factory': new IdeaFactoryProvider(),
  
  // Business Elite
  'mckinsey': new McKinseyGlobalInstituteProvider(),
  'bcg': new BCGHendersonInstituteProvider(),
  'deloitte': new DeloitteInsightsProvider(),
  
  // Policy US
  'brookings': new BrookingsInstitutionProvider(),
  'carnegie': new CarnegieEndowmentProvider(),
  'cfr': new CouncilOnForeignRelationsProvider(),
  
  // Think Tanks Asie
  'iiss': new IISSProvider(),
  'rsis': new RSISProvider(),
  'cis': new CISProvider(),
  
  // Climate Research
  'ipcc': new IPCCProvider(),
  'climate-analytics': new ClimateAnalyticsProvider(),
  'wri': new WRIProvider(),
  
  // Data Science
  'papers-with-code': new PapersWithCodeProvider(),
  'kaggle': new KaggleResearchProvider(),
  'arxiv-cs': new ArXivCSProvider(),
  
  // Santé Publique
  'who': new WHOProvider(),
  'johns-hopkins': new JohnsHopkinsProvider(),
  'harvard-chan': new HarvardChanProvider(),
  
  // Finance
  'blackrock': new BlackRockProvider(),
  'bis': new BISProvider(),
  'vanguard': new VanguardProvider(),
  
  // Géopolitique
  'chatham-house': new ChathamHouseProvider(),
  'rand': new RANDProvider(),
  'csis': new CSISProvider(),
  
  // Think Tank Europe
  'bruegel': new BruegelProvider(),
  'cepr': new CEPRProvider(),
  'dgap': new DGAPProvider()
};

module.exports = providers;;
