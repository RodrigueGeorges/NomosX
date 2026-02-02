// Test direct du monitoring agent
import { setTimeout as sleep } from 'timers/promises';

// Test providers un par un
async function testProviders() {
  console.log('🔍 TEST PROVIDERS DE VEILLE\n');
  
  const providers = [
    { name: 'World Bank', url: 'https://api.worldbank.org/v2/country/all/indicator/SP.POP.TOTL?format=json' },
    { name: 'UN Data', url: 'https://data.un.org/ws/rest/data/DF_ALL_FLows/CSV' },
    { name: 'OECD', url: 'https://stats.oecd.org/SDMX-JSON/data/DP_LIVE/USA/TOT/100' },
    { name: 'IMF', url: 'https://dataservices.imf.org/REST/SDMX_JSON.svc/CompactData/IFS/A.US.FRBA.CA_FCA_GSR_PT.GP_MT_IX?format=JSON' }
  ];
  
  for (const provider of providers) {
    try {
      console.log(`📡 Test ${provider.name}...`);
      const response = await fetch(provider.url, { 
        method: 'GET',
        headers: { 'User-Agent': 'NomosX-Monitoring/1.0' }
      });
      
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        console.log(`  ✅ ${provider.name} - Status: ${response.status} - Type: ${contentType}`);
        
        // Test parsing
        if (contentType?.includes('json')) {
          const data = await response.json();
          console.log(`  📊 JSON reçu: ${Array.isArray(data) ? data.length : 'object'} items`);
        } else {
          const text = await response.text();
          console.log(`  📊 Text reçu: ${text.length} chars`);
        }
      } else {
        console.log(`  ❌ ${provider.name} - Error: ${response.status}`);
      }
      
      await sleep(1000); // Rate limiting
      
    } catch (error) {
      console.log(`  ❌ ${provider.name} - Exception: ${error.message}`);
    }
  }
  
  // Test OpenAlex API (academic sources)
  console.log('\n📚 Test OpenAlex API...');
  try {
    const openAlexUrl = 'https://api.openalex.org/works?filter=keywords.display_name:artificial%20intelligence&sort=publication_year:desc&per_page=5';
    const response = await fetch(openAlexUrl);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`  ✅ OpenAlex - ${data.results?.length || 0} travaux trouvés`);
      
      if (data.results?.length > 0) {
        console.log('  📄 Derniers travaux:');
        data.results.slice(0, 3).forEach(work => {
          console.log(`    - ${work.title?.substring(0, 50)}... (${work.publication_year})`);
        });
      }
    } else {
      console.log(`  ❌ OpenAlex - Error: ${response.status}`);
    }
  } catch (error) {
    console.log(`  ❌ OpenAlex - Exception: ${error.message}`);
  }
  
  console.log('\n✅ Test providers terminé');
}

testProviders();
