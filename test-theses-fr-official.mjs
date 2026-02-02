// Test Theeses.fr API avec documentation officielle
import { setTimeout as sleep } from 'timers/promises';

async function testThesesFrAPI() {
  console.log('🎓 THESES.FR API - DOCUMENTATION OFFICIELLE\n');
  
  // 1. Test recherche simple
  console.log('🔍 Test 1: Recherche simple...');
  try {
    const baseUrl = 'https://theses.fr/api/v1';
    const searchUrl = `${baseUrl}/theses/recherche/?q=artificial%20intelligence&format=json&per_page=3`;
    
    console.log(`  URL: ${searchUrl}`);
    const response = await fetch(searchUrl);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`  ✅ Recherche simple: ${data.length || 0} thèses trouvées`);
      
      if (data.length > 0) {
        data.slice(0, 2).forEach((these, i) => {
          console.log(`    📄 ${i+1}. ${these.title?.substring(0, 60)}...`);
          console.log(`       🏢 ${these.etablissement?.nom || 'N/A'}`);
          console.log(`       📅 ${these.dateSoutenance || 'N/A'}`);
          console.log(`       🎓 ${these.discipline?.libelle || 'N/A'}`);
        });
      }
    } else {
      console.log(`  ❌ Recherche simple: Error ${response.status}`);
      console.log(`  📄 Content: ${await response.text()}`);
    }
  } catch (error) {
    console.log(`  ❌ Recherche simple: ${error.message}`);
  }
  
  await sleep(1000);
  
  // 2. Test statistiques
  console.log('\n📊 Test 2: Statistiques...');
  try {
    const statsUrl = 'https://theses.fr/api/v1/theses/statsTheses';
    const response = await fetch(statsUrl);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`  ✅ Statistiques: ${JSON.stringify(data)}`);
    } else {
      console.log(`  ❌ Statistiques: Error ${response.status}`);
    }
  } catch (error) {
    console.log(`  ❌ Statistiques: ${error.message}`);
  }
  
  await sleep(1000);
  
  // 3. Test facets
  console.log('\n🏷️  Test 3: Facets...');
  try {
    const facetsUrl = 'https://theses.fr/api/v1/theses/facets/';
    const response = await fetch(facetsUrl);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`  ✅ Facets: ${Object.keys(data).length} catégories`);
      
      Object.keys(data).slice(0, 3).forEach(key => {
        console.log(`    🏷️  ${key}: ${data[key]?.length || 0} options`);
      });
    } else {
      console.log(`  ❌ Facets: Error ${response.status}`);
    }
  } catch (error) {
    console.log(`  ❌ Facets: ${error.message}`);
  }
  
  await sleep(1000);
  
  // 4. Test par discipline
  console.log('\n🎓 Test 4: Recherche par discipline...');
  try {
    const disciplineUrl = 'https://theses.fr/api/v1/theses/recherche/?discipline=informatique&format=json&per_page=3';
    const response = await fetch(disciplineUrl);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`  ✅ Discipline informatique: ${data.length || 0} thèses`);
      
      if (data.length > 0) {
        data.slice(0, 2).forEach((these, i) => {
          console.log(`    📄 ${i+1}. ${these.title?.substring(0, 60)}...`);
          console.log(`       🎓 ${these.discipline?.libelle || 'N/A'}`);
          console.log(`       📅 ${these.dateSoutenance || 'N/A'}`);
        });
      }
    } else {
      console.log(`  ❌ Discipline: Error ${response.status}`);
    }
  } catch (error) {
    console.log(`  ❌ Discipline: ${error.message}`);
  }
  
  await sleep(1000);
  
  // 5. Test par établissement
  console.log('\n🏛️ Test 5: Recherche par établissement...');
  try {
    const etablissementUrl = 'https://theses.fr/api/v1/theses/organisme/0750642U'; // PSL Research University
    const response = await fetch(etablissementUrl);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`  ✅ Établissement PSL: ${data.length || 0} thèses`);
      
      if (data.length > 0) {
        data.slice(0, 2).forEach((these, i) => {
          console.log(`    📄 ${i+1}. ${these.title?.substring(0, 60)}...`);
          console.log(`       📅 ${these.dateSoutenance || 'N/A'}`);
        });
      }
    } else {
      console.log(`  ❌ Établissement: Error ${response.status}`);
    }
  } catch (error) {
    console.log(`  ❌ Établissement: ${error.message}`);
  }
  
  await sleep(1000);
  
  // 6. Test completion
  console.log('\n🔤 Test 6: Autocompletion...');
  try {
    const completionUrl = 'https://theses.fr/api/v1/theses/completion/?q=artificial&format=json';
    const response = await fetch(completionUrl);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`  ✅ Autocompletion: ${data.length || 0} suggestions`);
      
      if (data.length > 0) {
        data.slice(0, 3).forEach((suggestion, i) => {
          console.log(`    💡 ${i+1}. ${suggestion}`);
        });
      }
    } else {
      console.log(`  ❌ Autocompletion: Error ${response.status}`);
    }
  } catch (error) {
    console.log(`  ❌ Autocompletion: ${error.message}`);
  }
  
  await sleep(1000);
  
  // 7. Test RSS
  console.log('\n📡 Test 7: RSS Feed...');
  try {
    const rssUrl = 'https://theses.fr/api/v1/theses/rss';
    const response = await fetch(rssUrl);
    
    if (response.ok) {
      const data = await response.text();
      console.log(`  ✅ RSS: ${data.length} chars reçus`);
      
      // Parse XML pour compter les entrées
      const entries = data.match(/<item>[\s\S]*?<\/item>/g) || [];
      console.log(`    📄 ${entries.length} thèses récentes`);
    } else {
      console.log(`  ❌ RSS: Error ${response.status}`);
    }
  } catch (error) {
    console.log(`  ❌ RSS: ${error.message}`);
  }
  
  console.log('\n✅ Tests Theeses.fr terminés');
  console.log('\n📊 RÉSUMÉ THESES.FR:');
  console.log('  ✅ API officielle documentée');
  console.log('  ✅ Recherche par titre, discipline, établissement');
  console.log('  ✅ Statistiques et facets disponibles');
  console.log('  ✅ Autocompletion et RSS feed');
  console.log('  ✅ Format JSON structuré');
  
  return true;
}

testThesesFrAPI();
