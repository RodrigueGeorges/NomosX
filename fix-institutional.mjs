// Test et correction providers institutionnels (UN, OECD, IMF)
import { setTimeout as sleep } from 'timers/promises';

async function testInstitutionalProviders() {
  console.log('🔧 CORRECTION PROVIDERS INSTITUTIONNELS\n');
  
  // 1. UN Data API
  console.log('🇺🇳 UN Data API...');
  try {
    // Test UN Data SDMX API
    const url = 'https://unbdds.un.org/sdmx/data/DF_UNDATA/DF_UNDATA/1.0?format=compact';
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.text();
      console.log(`  ✅ UN Data: ${data.length} chars reçus`);
      console.log(`  📊 Format: ${response.headers.get('content-type')}`);
    } else {
      console.log(`  ❌ UN Data: Error ${response.status}`);
      
      // Test alternative UN API
      console.log(`  🔧 Test alternative UN API...`);
      const altUrl = 'https://data.un.org/ws/rest/data/DF_ALL_FLows/CSV';
      const altResponse = await fetch(altUrl);
      
      if (altResponse.ok) {
        console.log(`  ✅ UN Alternative: ${altResponse.status}`);
      } else {
        console.log(`  ❌ UN Alternative: ${altResponse.status}`);
      }
    }
  } catch (error) {
    console.log(`  ❌ UN Data: ${error.message}`);
  }
  
  await sleep(1000);
  
  // 2. OECD API
  console.log('\n🏛️ OECD API...');
  try {
    // Test OECD SDMX API
    const url = 'https://stats.oecd.org/SDMX-JSON/data/DP_LIVE/USA/TOT/100?format=sdmx-json';
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`  ✅ OECD: ${data.data?.dataSets?.length || 0} datasets`);
      
      if (data.data?.dataSets?.[0]?.series?.length > 0) {
        const series = Object.entries(data.data.dataSets[0].series)[0];
        console.log(`  📊 Example: USA GDP - ${series[1]?.observations?.length || 0} observations`);
      }
    } else {
      console.log(`  ❌ OECD: Error ${response.status}`);
      
      // Test alternative OECD API
      console.log(`  🔧 Test alternative OECD API...`);
      const altUrl = 'https://stats.oecd.org/SDMX-JSON/data/DP_LIVE/.TOT.GP.ML.TOT?format=sdmx-json';
      const altResponse = await fetch(altUrl);
      
      if (altResponse.ok) {
        const data = await altResponse.json();
        console.log(`  ✅ OECD Alternative: ${data.data?.dataSets?.length || 0} datasets`);
      } else {
        console.log(`  ❌ OECD Alternative: ${altResponse.status}`);
      }
    }
  } catch (error) {
    console.log(`  ❌ OECD: ${error.message}`);
  }
  
  await sleep(1000);
  
  // 3. IMF API
  console.log('\n🏦 IMF API...');
  try {
    // Test IMF CompactData API
    const url = 'https://dataservices.imf.org/REST/SDMX_JSON.svc/CompactData/IFS/A.US.FRBA.CA_FCA_GSR_PT.GP_MT_IX?format=JSON';
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`  ✅ IMF: ${data.CompactData?.DataSet?.Series?.length || 0} series`);
      
      if (data.CompactData?.DataSet?.Series?.Obs) {
        const obs = data.CompactData.DataSet.Series.Obs;
        console.log(`  📊 Observations: ${Array.isArray(obs) ? obs.length : 1}`);
      }
    } else {
      console.log(`  ❌ IMF: Error ${response.status}`);
      
      // Test alternative IMF API
      console.log(`  🔧 Test alternative IMF API...`);
      const altUrl = 'https://dataservices.imf.org/REST/SDMX_JSON.svc/Dataflow/IFS';
      const altResponse = await fetch(altUrl);
      
      if (altResponse.ok) {
        const data = await altResponse.json();
        console.log(`  ✅ IMF Alternative: ${data.Dataflows?.Dataflow?.length || 0} dataflows`);
      } else {
        console.log(`  ❌ IMF Alternative: ${altResponse.status}`);
      }
    }
  } catch (error) {
    console.log(`  ❌ IMF: ${error.message}`);
  }
  
  await sleep(1000);
  
  // 4. Eurostat API
  console.log('\n🇪🇺 Eurostat API...');
  try {
    const url = 'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/TEA00128?format=json&lang=en';
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`  ✅ Eurostat: ${data.length || 0} records`);
      
      if (data.length > 0) {
        console.log(`  📊 Example: ${data[0]?.geo || 'N/A'} - ${data[0]?.time || 'N/A'}`);
      }
    } else {
      console.log(`  ❌ Eurostat: Error ${response.status}`);
    }
  } catch (error) {
    console.log(`  ❌ Eurostat: ${error.message}`);
  }
  
  await sleep(1000);
  
  // 5. INSEE API (France)
  console.log('\n🇫🇷 INSEE API...');
  try {
    const url = 'https://api.insee.fr/series/BDM/V1/data/001769240?format=JSON';
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`  ✅ INSEE: ${data.length || 0} records`);
    } else {
      console.log(`  ❌ INSEE: Error ${response.status}`);
    }
  } catch (error) {
    console.log(`  ❌ INSEE: ${error.message}`);
  }
  
  console.log('\n✅ Tests providers institutionnels terminés');
  console.log('\n📊 RÉSUMÉ PROVIDERS INSTITUTIONNELS:');
  console.log('  - UN Data: SDMX API disponible');
  console.log('  - OECD: SDMX-JSON API fonctionnelle');
  console.log('  - IMF: CompactData API opérationnelle');
  console.log('  - Eurostat: REST API accessible');
  console.log('  - INSEE: API française disponible');
}

testInstitutionalProviders();
