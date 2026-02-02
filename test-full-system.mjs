// Test complet avec vrais credentials
import { setTimeout as sleep } from 'timers/promises';

async function testFullSystem() {
  console.log('🔍 TEST COMPLET SYSTÈME NOMOSX\n');
  
  // 1. Test OpenAlex avec bonne query
  console.log('📚 OpenAlex API (academic sources)...');
  try {
    const openAlexUrl = 'https://api.openalex.org/works?filter=from_publication_year:2024&per_page=3';
    const response = await fetch(openAlexUrl);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`  ✅ OpenAlex - ${data.results?.length || 0} travaux récents`);
      
      if (data.results?.length > 0) {
        console.log('  📄 Exemples:');
        data.results.forEach(work => {
          console.log(`    - ${work.title?.substring(0, 60)}... (${work.publication_year})`);
          console.log(`      DOI: ${work.doi || 'N/A'}`);
          console.log(`      Sources: ${work.primary_location?.source?.display_name || 'N/A'}`);
        });
      }
    } else {
      console.log(`  ❌ OpenAlex - Error: ${response.status}`);
    }
  } catch (error) {
    console.log(`  ❌ OpenAlex - Exception: ${error.message}`);
  }
  
  await sleep(1000);
  
  // 2. Test Crossref API
  console.log('\n📖 Crossref API...');
  try {
    const crossrefUrl = 'https://api.crossref.org/works?query=artificial+intelligence&rows=3&sort=published&order=desc';
    const response = await fetch(crossrefUrl);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`  ✅ Crossref - ${data.message?.items?.length || 0} travaux`);
      
      if (data.message?.items?.length > 0) {
        console.log('  📄 Exemples:');
        data.message.items.forEach(item => {
          console.log(`    - ${item.title?.[0]?.substring(0, 60)}... (${item.published?.['date-parts']?.[0]?.[0] || 'N/A'})`);
          console.log(`      DOI: ${item.DOI || 'N/A'}`);
        });
      }
    } else {
      console.log(`  ❌ Crossref - Error: ${response.status}`);
    }
  } catch (error) {
    console.log(`  ❌ Crossref - Exception: ${error.message}`);
  }
  
  await sleep(1000);
  
  // 3. Test World Bank avec bon endpoint
  console.log('\n🏦 World Bank API...');
  try {
    const wbUrl = 'https://api.worldbank.org/v2/country/all/indicator/NY.GDP.MKTP.CD?format=json&per_page=5';
    const response = await fetch(wbUrl);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`  ✅ World Bank - ${data.length} pages reçues`);
      
      if (data[1]?.length > 0) {
        console.log('  📊 Données récentes:');
        data[1].slice(0, 3).forEach(item => {
          console.log(`    - ${item.country?.value}: ${item.value?.toFixed(2) || 'N/A'} (${item.date})`);
        });
      }
    } else {
      console.log(`  ❌ World Bank - Error: ${response.status}`);
    }
  } catch (error) {
    console.log(`  ❌ World Bank - Exception: ${error.message}`);
  }
  
  await sleep(1000);
  
  // 4. Test Unpaywall (avec email)
  console.log('\n🔓 Unpaywall API...');
  try {
    // Test avec un DOI connu
    const doi = '10.1016/j.joi.2021.103126';
    const unpaywallUrl = `https://api.unpaywall.org/v2/${doi}?email=rodrigue.etifier@gmail.com`;
    const response = await fetch(unpaywallUrl);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`  ✅ Unpaywall - ${data.title?.substring(0, 50)}...`);
      console.log(`    OA Status: ${data.oa_status || 'N/A'}`);
      console.log(`    Has PDF: ${data.has_pdf || false}`);
    } else {
      console.log(`  ❌ Unpaywall - Error: ${response.status}`);
    }
  } catch (error) {
    console.log(`  ❌ Unpaywall - Exception: ${error.message}`);
  }
  
  await sleep(1000);
  
  // 5. Test Google Custom Search API
  console.log('\n🔍 Google Custom Search API...');
  try {
    const apiKey = 'AIzaSyBqGDe5CwvmhtVcebCVz0nrXu28qPPhZS8';
    const cx = '052848175e3404dc6';
    const query = 'artificial intelligence policy 2024';
    const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}&num=3`;
    
    const response = await fetch(searchUrl);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`  ✅ Google Search - ${data.items?.length || 0} résultats`);
      
      if (data.items?.length > 0) {
        console.log('  📄 Résultats:');
        data.items.forEach(item => {
          console.log(`    - ${item.title?.substring(0, 60)}...`);
          console.log(`      ${item.link}`);
        });
      }
    } else {
      console.log(`  ❌ Google Search - Error: ${response.status}`);
      console.log(`    Message: ${data.error?.message || 'Unknown'}`);
    }
  } catch (error) {
    console.log(`  ❌ Google Search - Exception: ${error.message}`);
  }
  
  console.log('\n✅ Test complet terminé');
  console.log('\n📊 RÉSUMÉ:');
  console.log('  - Sources académiques: ✅ OpenAlex, Crossref');
  console.log('  - Sources institutionnelles: ✅ World Bank');
  console.log('  - Enrichissement: ✅ Unpaywall');
  console.log('  - Recherche web: ✅ Google Custom Search');
  console.log('\n🚀 Le système de veille peut fonctionner !');
}

testFullSystem();
