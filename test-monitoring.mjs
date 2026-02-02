// Test monitoring agent avec vrais providers qui fonctionnent
import { setTimeout as sleep } from 'timers/promises';

async function testMonitoringAgent() {
  console.log('🚀 TEST MONITORING AGENT - VÉRIFICATION SYSTÈME\n');
  
  let totalSources = 0;
  let workingProviders = [];
  
  // 1. Crossref (fonctionne)
  console.log('📖 Crossref - Recherche académique...');
  try {
    const queries = ['artificial intelligence', 'climate change', 'economic policy'];
    
    for (const query of queries) {
      const url = `https://api.crossref.org/works?query=${encodeURIComponent(query)}&rows=2&sort=published&order=desc`;
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        const works = data.message?.items || [];
        
        if (works.length > 0) {
          console.log(`  ✅ ${query}: ${works.length} travaux trouvés`);
          totalSources += works.length;
          
          works.forEach(work => {
            console.log(`    📄 ${work.title?.[0]?.substring(0, 50)}... (${work.published?.['date-parts']?.[0]?.[0] || 'N/A'})`);
          });
        }
      }
      
      await sleep(500); // Rate limiting
    }
    
    workingProviders.push('Crossref');
  } catch (error) {
    console.log(`  ❌ Crossref: ${error.message}`);
  }
  
  await sleep(1000);
  
  // 2. World Bank (fonctionne)
  console.log('\n🏦 World Bank - Données institutionnelles...');
  try {
    const indicators = [
      'NY.GDP.MKTP.CD', // GDP
      'SP.POP.TOTL',   // Population
      'FR.INR.LEND'    // Interest rate
    ];
    
    for (const indicator of indicators) {
      const url = `https://api.worldbank.org/v2/country/all/indicator/${indicator}?format=json&per_page=3&date=2023:2024`;
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        const records = data[1] || [];
        
        if (records.length > 0) {
          console.log(`  ✅ ${indicator}: ${records.length} enregistrements`);
          totalSources += records.length;
          
          records.slice(0, 2).forEach(record => {
            console.log(`    📊 ${record.country?.value}: ${record.value?.toFixed(2) || 'N/A'} (${record.date})`);
          });
        }
      }
      
      await sleep(500);
    }
    
    workingProviders.push('World Bank');
  } catch (error) {
    console.log(`  ❌ World Bank: ${error.message}`);
  }
  
  await sleep(1000);
  
  // 3. OpenAlex (corriger la query)
  console.log('\n📚 OpenAlex - Sources académiques...');
  try {
    const url = 'https://api.openalex.org/works?filter=from_publication_year:2024&per_page=3';
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      const works = data.results || [];
      
      if (works.length > 0) {
        console.log(`  ✅ OpenAlex: ${works.length} travaux récents`);
        totalSources += works.length;
        
        works.forEach(work => {
          console.log(`    📄 ${work.title?.substring(0, 50)}... (${work.publication_year})`);
        });
      }
      
      workingProviders.push('OpenAlex');
    } else {
      console.log(`  ❌ OpenAlex: Error ${response.status}`);
    }
  } catch (error) {
    console.log(`  ❌ OpenAlex: ${error.message}`);
  }
  
  // 4. Test Unpaywall avec DOI valide
  console.log('\n🔓 Unpaywall - Enrichissement...');
  try {
    // Utiliser un DOI plus récent et valide
    const doi = '10.1038/s41586-024-07724-3'; // Nature article
    const url = `https://api.unpaywall.org/v2/${encodeURIComponent(doi)}?email=rodrigue.etifier@gmail.com`;
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`  ✅ Unpaywall: ${data.title?.substring(0, 50)}...`);
      console.log(`    OA Status: ${data.oa_status || 'N/A'}`);
      console.log(`    Has PDF: ${data.has_pdf || false}`);
      
      workingProviders.push('Unpaywall');
    } else {
      console.log(`  ❌ Unpaywall: Error ${response.status}`);
    }
  } catch (error) {
    console.log(`  ❌ Unpaywall: ${error.message}`);
  }
  
  // 5. Test Google Search API avec quota
  console.log('\n🔍 Google Custom Search...');
  try {
    const apiKey = 'AIzaSyBqGDe5CwvmhtVcebCVz0nrXu28qPPhZS8';
    const cx = '052848175e3404dc6';
    const query = 'artificial intelligence governance';
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}&num=2`;
    
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      const items = data.items || [];
      
      if (items.length > 0) {
        console.log(`  ✅ Google Search: ${items.length} résultats`);
        totalSources += items.length;
        
        items.forEach(item => {
          console.log(`    🌐 ${item.title?.substring(0, 50)}...`);
        });
        
        workingProviders.push('Google Search');
      }
    } else {
      console.log(`  ❌ Google Search: Error ${response.status}`);
      if (response.status === 403) {
        console.log(`    ⚠️  Quota dépassé ou clé invalide`);
      }
    }
  } catch (error) {
    console.log(`  ❌ Google Search: ${error.message}`);
  }
  
  // Résumé
  console.log('\n📊 RÉSUMÉ MONITORING:');
  console.log(`  ✅ Providers fonctionnels: ${workingProviders.length}/${5}`);
  console.log(`  📡 Sources collectées: ${totalSources}`);
  console.log(`  🔧 Providers actifs: ${workingProviders.join(', ')}`);
  
  if (workingProviders.length >= 3) {
    console.log('\n🚀 SYSTÈME OPÉRATIONNEL POUR VEILLE AUTONOME');
    console.log('   - Sources académiques ✅');
    console.log('   - Données institutionnelles ✅');
    console.log('   - Enrichissement disponible ✅');
  } else {
    console.log('\n⚠️  SYSTÈME PARTIELLEMENT OPÉRATIONNEL');
  }
  
  console.log('\n📈 CAPACITÉS DE DÉTECTION:');
  console.log('   - Nouvelles publications académiques');
  console.log('   - Données économiques institutionnelles');
  console.log('   - Trends et métriques mondiales');
  console.log('   - Enrichissement avec PDFs open access');
}

testMonitoringAgent();
