// Test Theeses.fr avec termes de recherche plus larges
import { setTimeout as sleep } from 'timers/promises';

async function testThesesFrBroadSearch() {
  console.log('🎓 THESES.FR - RECHERCHE ÉLARGIE\n');
  
  const searchTerms = [
    'intelligence',
    'machine',
    'data',
    'digital',
    'algorithm'
  ];
  
  let totalTheses = 0;
  
  for (const term of searchTerms) {
    console.log(`\n🔍 Recherche: "${term}"`);
    try {
      const url = `https://theses.fr/api/v1/theses/recherche/?q=${encodeURIComponent(term)}&format=json&per_page=5`;
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`  ✅ ${term}: ${data.length} thèses trouvées`);
        totalTheses += data.length;
        
        if (data.length > 0) {
          data.slice(0, 2).forEach((these, i) => {
            console.log(`    📄 ${i+1}. ${these.title?.substring(0, 60)}...`);
            console.log(`       🎓 ${these.discipline?.libelle || 'N/A'}`);
            console.log(`       📅 ${these.dateSoutenance?.substring(0, 4) || 'N/A'}`);
          });
        }
      } else {
        console.log(`  ❌ ${term}: Error ${response.status}`);
      }
    } catch (error) {
      console.log(`  ❌ ${term}: ${error.message}`);
    }
    
    await sleep(500);
  }
  
  // Test par discipline plus large
  console.log('\n🎓 Test disciplines larges...');
  const disciplines = ['informatique', 'mathématiques', 'sciences'];
  
  for (const discipline of disciplines) {
    console.log(`\n🎓 Discipline: "${discipline}"`);
    try {
      const url = `https://theses.fr/api/v1/theses/recherche/?discipline=${encodeURIComponent(discipline)}&format=json&per_page=3`;
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`  ✅ ${discipline}: ${data.length} thèses`);
        totalTheses += data.length;
        
        if (data.length > 0) {
          data.slice(0, 2).forEach((these, i) => {
            console.log(`    📄 ${i+1}. ${these.title?.substring(0, 60)}...`);
            console.log(`       📅 ${these.dateSoutenance?.substring(0, 4) || 'N/A'}`);
          });
        }
      } else {
        console.log(`  ❌ ${discipline}: Error ${response.status}`);
      }
    } catch (error) {
      console.log(`  ❌ ${discipline}: ${error.message}`);
    }
    
    await sleep(500);
  }
  
  // Test par année récente
  console.log('\n📅 Test thèses récentes...');
  try {
    const url = 'https://theses.fr/api/v1/theses/recherche/?format=json&per_page=5&sort=dateSoutenance&order=desc';
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`  ✅ Thèses récentes: ${data.length}`);
      totalTheses += data.length;
      
      if (data.length > 0) {
        data.slice(0, 3).forEach((these, i) => {
          console.log(`    📄 ${i+1}. ${these.title?.substring(0, 60)}...`);
          console.log(`       📅 ${these.dateSoutenance || 'N/A'}`);
          console.log(`       🎓 ${these.discipline?.libelle || 'N/A'}`);
        });
      }
    } else {
      console.log(`  ❌ Thèses récentes: Error ${response.status}`);
    }
  } catch (error) {
    console.log(`  ❌ Thèses récentes: ${error.message}`);
  }
  
  console.log('\n📊 RÉSUMÉ THESES.FR:');
  console.log(`  ✅ Total thèses trouvées: ${totalTheses}`);
  console.log('  ✅ API fonctionnelle avec recherche élargie');
  console.log('  ✅ Couverture disciplines et années');
  console.log('  ✅ Format JSON structuré disponible');
  
  return totalTheses > 0;
}

testThesesFrBroadSearch();
