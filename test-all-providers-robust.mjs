// VERSION ULTRA-ROBUSTE - PAS DE BLOCAGE
import { setTimeout as sleep } from 'timers/promises';

// Fonction timeout pour éviter les blocages
async function fetchWithTimeout(url, timeout = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Timeout');
    }
    throw error;
  }
}

async function testAllProvidersRobust() {
  console.log('🚀 VERSION ULTRA-ROBUSTE - PAS DE BLOCAGE\n');
  
  let workingProviders = [];
  let totalSources = 0;
  
  // PROVIDERS ACADÉMIQUES (RAPIDES ET FIABLES)
  console.log('📚 PROVIDERS ACADÉMIQUES');
  
  const academicProviders = [
    { name: 'Crossref', url: 'https://api.crossref.org/works?query=artificial%20intelligence&rows=2' },
    { name: 'OpenAlex', url: 'https://api.openalex.org/works?search=artificial%20intelligence&per_page=2' },
    { name: 'arXiv', url: 'http://export.arxiv.org/api/query?search_query=all:artificial+intelligence&max_results=2' },
    { name: 'Theeses.fr', url: 'https://theses.fr/api/v1/theses/recherche/?q=intelligence&format=json&per_page=2' },
    { name: 'HAL', url: 'https://api.archives-ouvertes.fr/search/?q=artificial+intelligence&rows=2&wt=json' },
    { name: 'Semantic Scholar', url: 'https://api.semanticscholar.org/graph/v1/papers/search?query=artificial%20intelligence&limit=2' }
  ];
  
  for (const provider of academicProviders) {
    try {
      console.log(`\n🔍 ${provider.name}...`);
      const response = await fetchWithTimeout(provider.url, 3000);
      
      if (response.ok) {
        if (provider.name === 'arXiv') {
          const text = await response.text();
          const entries = text.match(/<entry>[\s\S]*?<\/entry>/g) || [];
          console.log(`  ✅ ${provider.name}: ${entries.length} prepapers`);
          workingProviders.push(provider.name);
          totalSources += entries.length;
        } else if (provider.name === 'Theeses.fr') {
          const data = await response.json();
          const theses = data.theses || [];
          console.log(`  ✅ ${provider.name}: ${theses.length} thèses (${data.totalHits || 0} total)`);
          workingProviders.push(provider.name);
          totalSources += theses.length;
        } else if (provider.name === 'HAL') {
          const data = await response.json();
          const docs = data.response?.docs || [];
          console.log(`  ✅ ${provider.name}: ${docs.length} documents`);
          workingProviders.push(provider.name);
          totalSources += docs.length;
        } else {
          const data = await response.json();
          const count = data.message?.items?.length || data.results?.length || data.data?.length || 0;
          console.log(`  ✅ ${provider.name}: ${count} travaux`);
          workingProviders.push(provider.name);
          totalSources += count;
        }
      } else {
        console.log(`  ❌ ${provider.name}: Error ${response.status}`);
      }
    } catch (error) {
      console.log(`  ❌ ${provider.name}: ${error.message}`);
    }
    
    await sleep(200); // Pause courte
  }
  
  // PubMed (spécial)
  console.log('\n🏥 PubMed...');
  try {
    const searchResponse = await fetchWithTimeout('https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=artificial+intelligence&retmax=2&retmode=json', 3000);
    const searchData = await searchResponse.json();
    const ids = searchData.esearchresult?.idlist || [];
    
    if (ids.length > 0) {
      const detailsResponse = await fetchWithTimeout(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${ids.join(',')}&retmode=json`, 3000);
      const detailsData = await detailsResponse.json();
      const articles = Object.values(detailsData.result || {}).filter(item => item.title && item.uid !== 'uids');
      console.log(`  ✅ PubMed: ${articles.length} articles`);
      workingProviders.push('PubMed');
      totalSources += articles.length;
    }
  } catch (error) {
    console.log(`  ❌ PubMed: ${error.message}`);
  }
  
  await sleep(500);
  
  // PROVIDERS INSTITUTIONNELS (ULTRA-ROBUSTES)
  console.log('\n🏛️ PROVIDERS INSTITUTIONNELS - ULTRA-ROBUSTES');
  
  // World Bank (le plus fiable)
  console.log('\n🏦 World Bank...');
  try {
    const response = await fetchWithTimeout('https://api.worldbank.org/v2/country/all/indicator/NY.GDP.MKTP.CD?format=json&per_page=2&date=2023:2024', 3000);
    const data = await response.json();
    const records = data[1] || [];
    console.log(`  ✅ World Bank: ${records.length} enregistrements`);
    workingProviders.push('World Bank');
    totalSources += records.length;
  } catch (error) {
    console.log(`  ❌ World Bank: ${error.message}`);
  }
  
  // BLS (très fiable)
  console.log('\n📊 BLS...');
  try {
    const response = await fetchWithTimeout('https://api.bls.gov/publicAPI/v2/timeseries/data/LNS14000000', 3000);
    const data = await response.json();
    const series = data.Results?.series || [];
    console.log(`  ✅ BLS: ${series.length} series`);
    workingProviders.push('BLS');
    totalSources += series.length;
  } catch (error) {
    console.log(`  ❌ BLS: ${error.message}`);
  }
  
  // FRED (fiable avec demo key)
  console.log('\n🏛️ FRED...');
  try {
    const response = await fetchWithTimeout('https://api.stlouisfed.org/fred/series/observations?series_id=GDP&api_key=demo&observation_start=2023-01-01&file_type=json', 3000);
    const data = await response.json();
    const observations = data.observations || [];
    console.log(`  ✅ FRED: ${observations.length} observations`);
    workingProviders.push('FRED');
    totalSources += observations.length;
  } catch (error) {
    console.log(`  ❌ FRED: ${error.message}`);
  }
  
  // Data.gouv.fr (fiable)
  console.log('\n🇫🇷 Data.gouv.fr...');
  try {
    const response = await fetchWithTimeout('https://www.data.gouv.fr/api/1/datasets/?format=json&page=1&page_size=2', 3000);
    const data = await response.json();
    const datasets = data.data || [];
    console.log(`  ✅ Data.gouv.fr: ${datasets.length} datasets`);
    workingProviders.push('Data.gouv.fr');
    totalSources += datasets.length;
  } catch (error) {
    console.log(`  ❌ Data.gouv.fr: ${error.message}`);
  }
  
  // Unpaywall (fiable)
  console.log('\n🔓 Unpaywall...');
  try {
    const response = await fetchWithTimeout('https://api.unpaywall.org/v2/10.1371/journal.pone.0123456?email=rodrigue.etifier@gmail.com', 3000);
    const data = await response.json();
    console.log(`  ✅ Unpaywall: ${data.title?.substring(0, 30)}...`);
    workingProviders.push('Unpaywall');
    totalSources += 1;
  } catch (error) {
    console.log(`  ❌ Unpaywall: ${error.message}`);
  }
  
  await sleep(500);
  
  // PROVIDERS INSTITUTIONNELS DIFFICILES (AVEC TIMEOUT COURT)
  console.log('\n🏛️ PROVIDERS DIFFICILES - TIMEOUT COURT');
  
  const difficultProviders = [
    { name: 'OECD', urls: ['https://stats.oecd.org/sdmx-json/data/DP_LIFEEXP.TOTAL/?format=sdmx-json'] },
    { name: 'IMF', urls: ['https://dataservices.imf.org/REST/SDMX_JSON.svc/CompactData/IFS/A.US.GDP.MKTP.CD'] },
    { name: 'Eurostat', urls: ['https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/TEA00128?format=JSON'] },
    { name: 'RePEc', urls: ['https://ideas.repec.org/cgi-bin/htsearch?q=artificial+intelligence&nh=2&format=brief'] },
    { name: 'SSRN', urls: ['https://papers.ssrn.com/sol3/JELJOUR_Results.cfm?networking=1&form_name=journalBrowse&limit=2'] }
  ];
  
  for (const provider of difficultProviders) {
    console.log(`\n🔍 ${provider.name}...`);
    let working = false;
    
    for (const url of provider.urls) {
      try {
        console.log(`  🔄 Test: ${url}`);
        const response = await fetchWithTimeout(url, 2000); // Timeout très court
        
        if (response.ok) {
          console.log(`  ✅ ${provider.name}: Accessible`);
          workingProviders.push(provider.name);
          totalSources += 1;
          working = true;
          break;
        }
      } catch (error) {
        console.log(`  ⚠️  ${provider.name}: ${error.message}`);
        continue;
      }
    }
    
    if (!working) {
      console.log(`  ❌ ${provider.name}: All endpoints failed`);
    }
    
    await sleep(300);
  }
  
  // RÉSULTAT FINAL
  console.log('\n📊 RÉSULTAT FINAL ULTRA-ROBUSTE:');
  console.log(`  ✅ Providers opérationnels: ${workingProviders.length}/17`);
  console.log(`  📡 Sources collectées: ${totalSources}`);
  console.log(`  🔧 Actifs: ${workingProviders.join(', ')}`);
  
  const allProviders = ['Crossref', 'OpenAlex', 'arXiv', 'PubMed', 'Theeses.fr', 'HAL', 'Semantic Scholar', 'World Bank', 'OECD', 'IMF', 'Eurostat', 'BLS', 'FRED', 'Data.gouv.fr', 'Unpaywall', 'RePEc', 'SSRN'];
  const failedProviders = allProviders.filter(p => !workingProviders.includes(p));
  
  if (failedProviders.length > 0) {
    console.log(`  ❌ Échecs: ${failedProviders.join(', ')}`);
  }
  
  console.log('\n🎯 COUVERTURE COMPLÈTE:');
  console.log('  📚 Académique: Crossref, OpenAlex, arXiv, PubMed, Theeses.fr, HAL, Semantic Scholar');
  console.log('  🏛️ Institutionnel: World Bank, BLS, FRED, Data.gouv.fr, Unpaywall');
  console.log('  🇫🇷 France: Theeses.fr, HAL, Data.gouv.fr');
  console.log('  🏥 Médical: PubMed');
  console.log('  🔬 Science: arXiv, HAL, OpenAlex, Semantic Scholar');
  console.log('  🔓 Enrichissement: Unpaywall');
  
  if (workingProviders.length >= 12) {
    console.log('\n🚀 SYSTÈME DE VEILLE TRÈS COMPLET - ROBUSTE');
    console.log('   ✅ Providers fiables opérationnels');
    console.log('   ✅ Pas de blocage timeout');
    console.log('   ✅ Gestion d\'erreurs robuste');
    console.log('   ✅ Couverture académique complète');
    console.log('   ✅ Données institutionnelles fiables');
  } else if (workingProviders.length >= 8) {
    console.log('\n✅ SYSTÈME DE VEILLE FONCTIONNEL');
    console.log(`   ⚠️  ${failedProviders.length} providers difficiles`);
  } else {
    console.log('\n⚠️  SYSTÈME PARTIELLEMENT OPÉRATIONNEL');
  }
  
  return {
    workingProviders,
    failedProviders,
    totalSources,
    operational: workingProviders.length >= 12
  };
}

testAllProvidersRobust();
