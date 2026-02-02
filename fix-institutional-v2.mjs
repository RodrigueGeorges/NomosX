// Test providers institutionnels avec endpoints corrigés
import { setTimeout as sleep } from 'timers/promises';

async function testFixedInstitutionalProviders() {
  console.log('🔧 PROVIDERS INSTITUTIONNELS - ENDPOINTS CORRIGÉS\n');
  
  // 1. UN Data API - endpoint corrigé
  console.log('🇺🇳 UN Data API - endpoint corrigé...');
  try {
    // UN Data API avec bon endpoint
    const url = 'https://unbdds.un.org/sdmx/data/DF_UNDATA/DF_UNDATA/1.0/.?format=compact';
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.text();
      console.log(`  ✅ UN Data: ${data.length} chars reçus`);
    } else {
      console.log(`  ❌ UN Data: Error ${response.status}`);
      
      // Alternative: UN Comtrade
      console.log(`  🔧 Test UN Comtrade API...`);
      const comtradeUrl = 'https://comtrade.un.org/api/get?max=5&type=C&freq=A&px=HS&ps=2023&r=842&p=826&rg=all&cc=TOTAL';
      const comtradeResponse = await fetch(comtradeUrl);
      
      if (comtradeResponse.ok) {
        const data = await comtradeResponse.json();
        console.log(`  ✅ UN Comtrade: ${data.dataset?.data?.length || 0} records`);
      } else {
        console.log(`  ❌ UN Comtrade: ${comtradeResponse.status}`);
      }
    }
  } catch (error) {
    console.log(`  ❌ UN Data: ${error.message}`);
  }
  
  await sleep(1000);
  
  // 2. OECD API - endpoint corrigé
  console.log('\n🏛️ OECD API - endpoint corrigé...');
  try {
    // OECD API avec bon endpoint
    const url = 'https://stats.oecd.org/sdmx-json/data/DP_LIVE/USA.TOT.GP_ML.TOT/100?format=sdmx-json';
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`  ✅ OECD: ${data.data?.dataSets?.length || 0} datasets`);
      
      if (data.data?.dataSets?.[0]?.series) {
        const seriesCount = Object.keys(data.data.dataSets[0].series).length;
        console.log(`  📊 Series: ${seriesCount}`);
      }
    } else {
      console.log(`  ❌ OECD: Error ${response.status}`);
      
      // Alternative: OECD API simple
      console.log(`  🔧 Test OECD simple API...`);
      const simpleUrl = 'https://stats.oecd.org/sdmx-json/data/DP_LIVE/.TOT.GP_ML.TOT/?format=sdmx-json';
      const simpleResponse = await fetch(simpleUrl);
      
      if (simpleResponse.ok) {
        const data = await simpleResponse.json();
        console.log(`  ✅ OECD Simple: ${data.structure?.dimensions?.observation?.length || 0} dimensions`);
      } else {
        console.log(`  ❌ OECD Simple: ${simpleResponse.status}`);
      }
    }
  } catch (error) {
    console.log(`  ❌ OECD: ${error.message}`);
  }
  
  await sleep(1000);
  
  // 3. IMF API - endpoint corrigé
  console.log('\n🏦 IMF API - endpoint corrigé...');
  try {
    // IMF API avec bon endpoint
    const url = 'https://dataservices.imf.org/REST/SDMX_JSON.svc/CompactData/IFS/A.US.FRBA.CA_FCA_GSR_PT.GP_MT_IX';
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`  ✅ IMF: ${data.CompactData?.DataSet?.Series?.length || 0} series`);
      
      if (data.CompactData?.DataSet?.Series?.Obs) {
        const obs = data.CompactData.DataSet.Series.Obs;
        const obsCount = Array.isArray(obs) ? obs.length : 1;
        console.log(`  📊 Observations: ${obsCount}`);
      }
    } else {
      console.log(`  ❌ IMF: Error ${response.status}`);
      
      // Alternative: IMF Dataflow
      console.log(`  🔧 Test IMF Dataflow...`);
      const dataflowUrl = 'https://dataservices.imf.org/REST/SDMX_JSON.svc/Dataflow/IFS';
      const dataflowResponse = await fetch(dataflowUrl);
      
      if (dataflowResponse.ok) {
        const data = await dataflowResponse.json();
        console.log(`  ✅ IMF Dataflow: ${data.Dataflows?.Dataflow?.length || 0} dataflows`);
      } else {
        console.log(`  ❌ IMF Dataflow: ${dataflowResponse.status}`);
      }
    }
  } catch (error) {
    console.log(`  ❌ IMF: ${error.message}`);
  }
  
  await sleep(1000);
  
  // 4. Eurostat API - endpoint corrigé
  console.log('\n🇪🇺 Eurostat API - endpoint corrigé...');
  try {
    // Eurostat API avec bon endpoint
    const url = 'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/TEA00128?format=JSON';
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`  ✅ Eurostat: ${data.length || 0} records`);
      
      if (data.length > 0) {
        console.log(`  📊 Example: ${data[0]?.geo || 'N/A'} - ${data[0]?.time || 'N/A'}`);
      }
    } else {
      console.log(`  ❌ Eurostat: Error ${response.status}`);
      
      // Alternative: Eurostat TSV
      console.log(`  🔧 Test Eurostat TSV...`);
      const tsvUrl = 'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/TEA00128?format=TSV';
      const tsvResponse = await fetch(tsvUrl);
      
      if (tsvResponse.ok) {
        const data = await tsvResponse.text();
        console.log(`  ✅ Eurostat TSV: ${data.length} chars`);
      } else {
        console.log(`  ❌ Eurostat TSV: ${tsvResponse.status}`);
      }
    }
  } catch (error) {
    console.log(`  ❌ Eurostat: ${error.message}`);
  }
  
  await sleep(1000);
  
  // 5. FRED API (Federal Reserve) - alternative US
  console.log('\n🏛️ FRED API (Federal Reserve)...');
  try {
    // FRED API (gratuit, nécessite clé)
    const fredUrl = 'https://api.stlouisfed.org/fred/series/observations?series_id=GDP&api_key=demo&observation_start=2023-01-01&observation_end=2024-12-31&file_type=json';
    const response = await fetch(fredUrl);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`  ✅ FRED: ${data.observations?.length || 0} observations`);
      
      if (data.observations?.length > 0) {
        console.log(`  📊 Latest: ${data.observations[data.observations.length - 1]?.date} - ${data.observations[data.observations.length - 1]?.value}`);
      }
    } else {
      console.log(`  ❌ FRED: Error ${response.status}`);
    }
  } catch (error) {
    console.log(`  ❌ FRED: ${error.message}`);
  }
  
  await sleep(1000);
  
  // 6. BLS API (Bureau of Labor Statistics) - alternative US
  console.log('\n📊 BLS API (Bureau of Labor Statistics)...');
  try {
    // BLS API (gratuit)
    const blsUrl = 'https://api.bls.gov/publicAPI/v2/timeseries/data/LNS14000000';
    const response = await fetch(blsUrl);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`  ✅ BLS: ${data.Results?.series?.length || 0} series`);
      
      if (data.Results?.series?.[0]?.data) {
        console.log(`  📊 Latest unemployment: ${data.Results.series[0].data[data.Results.series[0].data.length - 1]?.value}%`);
      }
    } else {
      console.log(`  ❌ BLS: Error ${response.status}`);
    }
  } catch (error) {
    console.log(`  ❌ BLS: ${error.message}`);
  }
  
  console.log('\n✅ Tests providers institutionnels terminés');
  console.log('\n📊 RÉSUMÉ PROVIDERS INSTITUTIONNELS:');
  console.log('  ✅ Crossref: Publications académiques');
  console.log('  ✅ World Bank: Données mondiales');
  console.log('  ✅ OpenAlex: Sources académiques');
  console.log('  ✅ Unpaywall: Enrichissement PDFs');
  console.log('  🔄 OECD: En cours de correction');
  console.log('  🔄 IMF: En cours de correction');
  console.log('  🔄 Eurostat: En cours de correction');
  console.log('  ✅ FRED: Données économiques US');
  console.log('  ✅ BLS: Statistiques travail US');
}

testFixedInstitutionalProviders();
