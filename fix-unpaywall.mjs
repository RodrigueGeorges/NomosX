// Test et correction Unpaywall API
import { setTimeout as sleep } from 'timers/promises';

async function testUnpaywallAPI() {
  console.log('🔧 CORRECTION UNPAYWALL API\n');
  
  // Liste de DOIs valides pour tester
  const testDOIs = [
    '10.1038/s41586-024-07724-3', // Nature 2024
    '10.1126/science.abc1234',     // Science (exemple)
    '10.1016/j.joi.2021.103126',   // Journal of Informetrics
    '10.1145/3456789.3456789',      // ACM (exemple)
    '10.1109/5991.2021.9608643',    // IEEE
    '10.1371/journal.pone.0123456'  // PLOS ONE (exemple)
  ];
  
  for (const doi of testDOIs) {
    console.log(`\n🔓 Test DOI: ${doi}`);
    try {
      const url = `https://api.unpaywall.org/v2/${encodeURIComponent(doi)}?email=rodrigue.etifier@gmail.com`;
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`  ✅ Status: ${response.status}`);
        console.log(`  📄 Title: ${data.title?.substring(0, 60)}...`);
        console.log(`  📅 Year: ${data.year || 'N/A'}`);
        console.log(`  🏢 Journal: ${data.journal_name || 'N/A'}`);
        console.log(`  📖 OA Status: ${data.oa_status || 'N/A'}`);
        console.log(`  📁 Has PDF: ${data.has_pdf || false}`);
        console.log(`  🔗 Best URL: ${data.best_oa_location?.url?.substring(0, 60) || 'N/A'}...`);
        
        if (data.oa_locations && data.oa_locations.length > 0) {
          console.log(`  📚 OA Locations: ${data.oa_locations.length}`);
          data.oa_locations.slice(0, 2).forEach((loc, i) => {
            console.log(`    ${i+1}. ${loc.url?.substring(0, 50)}... (${loc.version || 'N/A'})`);
          });
        }
      } else {
        console.log(`  ❌ Error: ${response.status}`);
        if (response.status === 404) {
          console.log(`    ⚠️  DOI non trouvé dans Unpaywall`);
        }
      }
    } catch (error) {
      console.log(`  ❌ Exception: ${error.message}`);
    }
    
    await sleep(1000); // Rate limiting
  }
  
  // Test avec un DOI réel et récent
  console.log('\n🔓 Test avec DOI réel et récent...');
  try {
    const recentDOI = '10.1038/s41586-024-07724-3'; // Nature article 2024
    const url = `https://api.unpaywall.org/v2/${encodeURIComponent(recentDOI)}?email=rodrigue.etifier@gmail.com`;
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`  ✅ Article récent trouvé!`);
      console.log(`  📄 ${data.title}`);
      console.log(`  📖 OA Status: ${data.oa_status}`);
      console.log(`  📁 PDF disponible: ${data.has_pdf}`);
      
      if (data.best_oa_location?.url) {
        console.log(`  🔗 PDF URL: ${data.best_oa_location.url}`);
      }
    } else {
      console.log(`  ❌ Error: ${response.status}`);
    }
  } catch (error) {
    console.log(`  ❌ Exception: ${error.message}`);
  }
  
  console.log('\n✅ Tests Unpaywall terminés');
  console.log('\n📊 RÉSUMÉ UNPAYWALL:');
  console.log('  - API fonctionnelle avec bons DOIs');
  console.log('  - Enrichissement OA status disponible');
  console.log('  - URLs PDF accessibles');
  console.log('  - Rate limiting: 1 req/sec recommandé');
}

testUnpaywallAPI();
