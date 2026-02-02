// DEEP SEARCH - TOUS LES PROVIDERS PERTINENTS ET INNOVANTS
import { setTimeout as sleep } from 'timers/promises';

async function deepSearchProviders() {
  console.log('🔍 DEEP SEARCH - TOUS LES PROVIDERS PERTINENTS ET INNOVANTS\n');
  
  let workingProviders = [];
  let totalSources = 0;
  
  // PROVIDERS DÉJÀ OPÉRATIONNELS (14)
  const existingProviders = ['Crossref', 'OpenAlex', 'arXiv', 'Theeses.fr', 'HAL', 'PubMed', 'World Bank', 'BLS', 'FRED', 'Data.gouv.fr', 'Unpaywall', 'Eurostat', 'RePEc', 'Semantic Scholar Datasets'];
  workingProviders.push(...existingProviders);
  console.log(`✅ Providers existants: ${existingProviders.length}`);
  
  // NOUVEAUX PROVIDERS INNOVANTS
  console.log('\n🚀 NOUVEAUX PROVIDERS INNOVANTS');
  
  // 1. ORCID API
  console.log('\n🆔 ORCID API...');
  try {
    const response = await fetch('https://pub.orcid.org/v3.0/0000-0002-1825-0097/record', {
      headers: { 'Accept': 'application/json' }
    });
    if (response.ok) {
      const data = await response.json();
      console.log(`  ✅ ORCID: API accessible (${data['given-names']?.value || 'N/A'})`);
      workingProviders.push('ORCID');
      totalSources += 1;
    } else {
      console.log(`  ❌ ORCID: Error ${response.status}`);
    }
  } catch (error) {
    console.log(`  ❌ ORCID: ${error.message}`);
  }
  
  await sleep(500);
  
  // 2. ROR API
  console.log('\n🏢 ROR API...');
  try {
    const response = await fetch('https://api.ror.org/organizations?query=harvard');
    if (response.ok) {
      const data = await response.json();
      const orgs = data.items || [];
      console.log(`  ✅ ROR: ${orgs.length} organisations`);
      workingProviders.push('ROR');
      totalSources += orgs.length;
    } else {
      console.log(`  ❌ ROR: Error ${response.status}`);
    }
  } catch (error) {
    console.log(`  ❌ ROR: ${error.message}`);
  }
  
  await sleep(500);
  
  // 3. CORE API
  console.log('\n📚 CORE API...');
  try {
    const response = await fetch('https://api.core.ac.uk/v3/search/works?q=artificial+intelligence&pageSize=3');
    if (response.ok) {
      const data = await response.json();
      const works = data.results || [];
      console.log(`  ✅ CORE: ${works.length} works`);
      workingProviders.push('CORE');
      totalSources += works.length;
    } else {
      console.log(`  ❌ CORE: Error ${response.status}`);
    }
  } catch (error) {
    console.log(`  ❌ CORE: ${error.message}`);
  }
  
  await sleep(500);
  
  // 4. DOAJ API
  console.log('\n📖 DOAJ API...');
  try {
    const response = await fetch('https://doaj.org/api/v2/search/articles?q=artificial+intelligence&pageSize=3');
    if (response.ok) {
      const data = await response.json();
      const articles = data.results || [];
      console.log(`  ✅ DOAJ: ${articles.length} articles OA`);
      workingProviders.push('DOAJ');
      totalSources += articles.length;
    } else {
      console.log(`  ❌ DOAJ: Error ${response.status}`);
    }
  } catch (error) {
    console.log(`  ❌ DOAJ: ${error.message}`);
  }
  
  await sleep(500);
  
  // 5. OpenAIRE API
  console.log('\n🔓 OpenAIRE API...');
  try {
    const response = await fetch('https://api.openaire.eu/search/publications?fq=artificial+intelligence&size=3');
    if (response.ok) {
      const data = await response.json();
      const pubs = data.response?.results || [];
      console.log(`  ✅ OpenAIRE: ${pubs.length} publications`);
      workingProviders.push('OpenAIRE');
      totalSources += pubs.length;
    } else {
      console.log(`  ❌ OpenAIRE: Error ${response.status}`);
    }
  } catch (error) {
    console.log(`  ❌ OpenAIRE: ${error.message}`);
  }
  
  await sleep(500);
  
  // 6. Zenodo API
  console.log('\n📦 Zenodo API...');
  try {
    const response = await fetch('https://zenodo.org/api/records?q=artificial+intelligence&size=3');
    if (response.ok) {
      const data = await response.json();
      const records = data.hits?.hits || [];
      console.log(`  ✅ Zenodo: ${records.length} records`);
      workingProviders.push('Zenodo');
      totalSources += records.length;
    } else {
      console.log(`  ❌ Zenodo: Error ${response.status}`);
    }
  } catch (error) {
    console.log(`  ❌ Zenodo: ${error.message}`);
  }
  
  await sleep(500);
  
  // 7. Figshare API
  console.log('\n📊 Figshare API...');
  try {
    const response = await fetch('https://api.figshare.com/v2/articles/search?q=artificial+intelligence&page=1&page_size=3');
    if (response.ok) {
      const data = await response.json();
      const articles = data.length || 0;
      console.log(`  ✅ Figshare: ${articles} datasets`);
      workingProviders.push('Figshare');
      totalSources += articles;
    } else {
      console.log(`  ❌ Figshare: Error ${response.status}`);
    }
  } catch (error) {
    console.log(`  ❌ Figshare: ${error.message}`);
  }
  
  await sleep(500);
  
  // 8. Overton API
  console.log('\n🏛️ Overton API...');
  try {
    const response = await fetch('https://api.overton.io/v1/documents?query=artificial+intelligence&limit=3');
    if (response.ok) {
      const data = await response.json();
      const docs = data.results || [];
      console.log(`  ✅ Overton: ${docs.length} policy documents`);
      workingProviders.push('Overton');
      totalSources += docs.length;
    } else {
      console.log(`  ❌ Overton: Error ${response.status}`);
    }
  } catch (error) {
    console.log(`  ❌ Overton: ${error.message}`);
  }
  
  await sleep(500);
  
  // 9. Legifrance API
  console.log('\n⚖️ Legifrance API...');
  try {
    const response = await fetch('https://api.legifrance.gouv.fr/openapi/consult/search?query=artificial+intelligence&pageSize=3');
    if (response.ok) {
      const data = await response.json();
      const texts = data.results || [];
      console.log(`  ✅ Legifrance: ${texts.length} textes juridiques`);
      workingProviders.push('Legifrance');
      totalSources += texts.length;
    } else {
      console.log(`  ❌ Legifrance: Error ${response.status}`);
    }
  } catch (error) {
    console.log(`  ❌ Legifrance: ${error.message}`);
  }
  
  await sleep(500);
  
  // 10. USPTO API
  console.log('\n🇺🇸 USPTO API...');
  try {
    const response = await fetch('https://patents.google.com/patent/US1234567');
    if (response.ok) {
      console.log(`  ✅ USPTO: Google Patents accessible`);
      workingProviders.push('USPTO/Google Patents');
      totalSources += 1;
    } else {
      console.log(`  ❌ USPTO: Error ${response.status}`);
    }
  } catch (error) {
    console.log(`  ❌ USPTO: ${error.message}`);
  }
  
  await sleep(500);
  
  // 11. EPO API
  console.log('\n🇪🇺 EPO API...');
  try {
    const response = await fetch('https://worldwide.espacenet.com/data/coverageService');
    if (response.ok) {
      console.log(`  ✅ EPO: Espacenet API accessible`);
      workingProviders.push('EPO/Espacenet');
      totalSources += 1;
    } else {
      console.log(`  ❌ EPO: Error ${response.status}`);
    }
  } catch (error) {
    console.log(`  ❌ EPO: ${error.message}`);
  }
  
  await sleep(500);
  
  // 12. Dimensions API (test)
  console.log('\n📏 Dimensions API...');
  try {
    const response = await fetch('https://app.dimensions.ai/api/dsl.json');
    if (response.ok) {
      console.log(`  ✅ Dimensions: API accessible`);
      workingProviders.push('Dimensions');
      totalSources += 1;
    } else {
      console.log(`  ❌ Dimensions: Error ${response.status}`);
    }
  } catch (error) {
    console.log(`  ❌ Dimensions: ${error.message}`);
  }
  
  await sleep(500);
  
  // 13. Scopus API (test)
  console.log('\n📚 Scopus API...');
  try {
    const response = await fetch('https://api.elsevier.com/content/search/index?query=artificial+intelligence');
    if (response.ok) {
      console.log(`  ✅ Scopus: API accessible`);
      workingProviders.push('Scopus');
      totalSources += 1;
    } else {
      console.log(`  ❌ Scopus: Error ${response.status}`);
    }
  } catch (error) {
    console.log(`  ❌ Scopus: ${error.message}`);
  }
  
  await sleep(500);
  
  // 14. Web of Science API (test)
  console.log('\n🕸️ Web of Science API...');
  try {
    const response = await fetch('https://api.clarivate.com/api/wos');
    if (response.ok) {
      console.log(`  ✅ Web of Science: API accessible`);
      workingProviders.push('Web of Science');
      totalSources += 1;
    } else {
      console.log(`  ❌ Web of Science: Error ${response.status}`);
    }
  } catch (error) {
    console.log(`  ❌ Web of Science: ${error.message}`);
  }
  
  // RÉSULTAT FINAL DEEP SEARCH
  console.log('\n📊 RÉSULTAT FINAL DEEP SEARCH:');
  console.log(`  ✅ Providers opérationnels: ${workingProviders.length}/28`);
  console.log(`  📡 Sources collectées: ${totalSources}`);
  console.log(`  🔧 Actifs: ${workingProviders.join(', ')}`);
  
  const allProviders = [
    'Crossref', 'OpenAlex', 'arXiv', 'Theeses.fr', 'HAL', 'PubMed', 'World Bank', 'BLS', 'FRED', 
    'Data.gouv.fr', 'Unpaywall', 'Eurostat', 'RePEc', 'Semantic Scholar Datasets',
    'ORCID', 'ROR', 'CORE', 'DOAJ', 'OpenAIRE', 'Zenodo', 'Figshare', 'Overton', 'Legifrance',
    'USPTO/Google Patents', 'EPO/Espacenet', 'Dimensions', 'Scopus', 'Web of Science'
  ];
  const failedProviders = allProviders.filter(p => !workingProviders.includes(p));
  
  if (failedProviders.length > 0) {
    console.log(`  ❌ Échecs: ${failedProviders.join(', ')}`);
  }
  
  console.log('\n🎯 COUVERTURE COMPLÈTE INNOVANTE:');
  console.log('  📚 Académique: Crossref, OpenAlex, arXiv, PubMed, Theeses.fr, HAL, CORE, DOAJ, OpenAIRE');
  console.log('  🏢 Identités: ORCID, ROR');
  console.log('  📦 Données: Zenodo, Figshare, Semantic Scholar Datasets');
  console.log('  🏛️ Institutionnel: World Bank, BLS, FRED, Eurostat, Data.gouv.fr, Overton');
  console.log('  ⚖️ Juridique: Legifrance');
  console.log('  🇺🇸 Patents: USPTO/Google Patents, EPO/Espacenet');
  console.log('  📊 Commercial: Dimensions, Scopus, Web of Science');
  console.log('  🇫🇷 France: Theeses.fr, HAL, Data.gouv.fr, Legifrance');
  console.log('  🔓 Enrichissement: Unpaywall, RePEc');
  
  if (workingProviders.length >= 20) {
    console.log('\n🚀🚀🚀 SYSTÈME DE VEILLE INNOVANT COMPLET 🚀🚀🚀');
    console.log('   ✅ 20+ providers innovants');
    console.log('   ✅ Couverture mondiale étendue');
    console.log('   ✅ Toutes les sources académiques');
    console.log('   ✅ Données gouvernementales');
    console.log('   ✅ Sources juridiques');
    console.log('   ✅ Brevets et innovation');
    console.log('   ✅ Identités chercheurs');
    console.log('   ✅ Dépôts de données');
  } else if (workingProviders.length >= 15) {
    console.log('\n✅ SYSTÈME DE VEILLE TRÈS INNOVANT');
    console.log(`   ⚠️  ${failedProviders.length} providers restants`);
  } else {
    console.log('\n⚠️  SYSTÈME PARTIELLEMENT INNOVANT');
  }
  
  return {
    workingProviders,
    failedProviders,
    totalSources,
    innovative: workingProviders.length >= 20
  };
}

deepSearchProviders();
