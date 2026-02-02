// Test et correction Google Custom Search API
import { setTimeout as sleep } from 'timers/promises';

async function testGoogleSearchAPI() {
  console.log('🔧 CORRECTION GOOGLE CUSTOM SEARCH API\n');
  
  const apiKey = 'AIzaSyBqGDe5CwvmhtVcebCVz0nrXu28qPPhZS8';
  const cx = '052848175e3404dc6';
  
  // Test 1: Query simple
  console.log('🔍 Test 1: Query simple...');
  try {
    const query = 'artificial intelligence';
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}&num=3`;
    
    console.log(`  URL: ${url}`);
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`  ✅ Status: ${response.status}`);
      console.log(`  📊 Résultats: ${data.items?.length || 0}`);
      
      if (data.items?.length > 0) {
        data.items.forEach((item, i) => {
          console.log(`    ${i+1}. ${item.title?.substring(0, 50)}...`);
          console.log(`       ${item.link}`);
          console.log(`       ${item.snippet?.substring(0, 80)}...`);
        });
      }
    } else {
      const errorData = await response.json();
      console.log(`  ❌ Error: ${response.status}`);
      console.log(`  📄 Message: ${errorData.error?.message || 'Unknown'}`);
      console.log(`  🔧 Details: ${errorData.error?.errors?.[0]?.reason || 'N/A'}`);
    }
  } catch (error) {
    console.log(`  ❌ Exception: ${error.message}`);
  }
  
  await sleep(2000);
  
  // Test 2: Query avec filtre date
  console.log('\n🔍 Test 2: Query avec filtre date...');
  try {
    const query = 'artificial intelligence policy 2024';
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}&num=3&sort=date:r:20240101:20241231`;
    
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`  ✅ Status: ${response.status}`);
      console.log(`  📊 Résultats: ${data.items?.length || 0}`);
      
      if (data.items?.length > 0) {
        data.items.forEach((item, i) => {
          console.log(`    ${i+1}. ${item.title?.substring(0, 50)}...`);
          console.log(`       ${item.link}`);
        });
      }
    } else {
      const errorData = await response.json();
      console.log(`  ❌ Error: ${response.status}`);
      console.log(`  📄 Message: ${errorData.error?.message || 'Unknown'}`);
    }
  } catch (error) {
    console.log(`  ❌ Exception: ${error.message}`);
  }
  
  await sleep(2000);
  
  // Test 3: Query institutionnelle
  console.log('\n🔍 Test 3: Query institutionnelle...');
  try {
    const query = 'World Bank economic report';
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}&num=3`;
    
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`  ✅ Status: ${response.status}`);
      console.log(`  📊 Résultats: ${data.items?.length || 0}`);
      
      if (data.items?.length > 0) {
        data.items.forEach((item, i) => {
          console.log(`    ${i+1}. ${item.title?.substring(0, 50)}...`);
          console.log(`       ${item.link}`);
          console.log(`       🏢 ${item.displayLink || 'N/A'}`);
        });
      }
    } else {
      const errorData = await response.json();
      console.log(`  ❌ Error: ${response.status}`);
      console.log(`  📄 Message: ${errorData.error?.message || 'Unknown'}`);
      
      // Si erreur 403, vérifier quota
      if (response.status === 403) {
        console.log(`  ⚠️  Possible quota exceeded - Check Google Cloud Console`);
        console.log(`  🔗 https://console.cloud.google.com/apis/credentials`);
      }
    }
  } catch (error) {
    console.log(`  ❌ Exception: ${error.message}`);
  }
  
  await sleep(2000);
  
  // Test 4: Vérifier quota API
  console.log('\n🔍 Test 4: Vérifier quota...');
  try {
    // Test avec une query simple pour voir si l'API fonctionne
    const query = 'test';
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}&num=1`;
    
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`  ✅ API Key valide - ${data.items?.length || 0} résultats`);
      console.log(`  📊 Search information: ${data.searchInformation?.totalResults || 'N/A'} total results`);
    } else {
      const errorData = await response.json();
      console.log(`  ❌ API Key problème: ${response.status}`);
      console.log(`  📄 Error: ${errorData.error?.message || 'Unknown'}`);
      
      if (response.status === 403) {
        console.log(`  🔧 Solutions possibles:`);
        console.log(`     1. Activer Custom Search API dans Google Cloud Console`);
        console.log(`     2. Vérifier quota (100 queries/day gratuit)`);
        console.log(`     3. Créer nouvelle clé API`);
      }
    }
  } catch (error) {
    console.log(`  ❌ Exception: ${error.message}`);
  }
  
  console.log('\n✅ Tests Google Search terminés');
  console.log('\n📊 RÉSUMÉ GOOGLE SEARCH:');
  console.log('  - API Key configurée');
  console.log('  - Search Engine ID défini');
  console.log('  - Rate limiting: 2 sec entre requêtes');
  console.log('  - Quota: 100 requêtes/jour gratuit');
}

testGoogleSearchAPI();
