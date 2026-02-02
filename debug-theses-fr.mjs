// Debug Theeses.fr API response structure
import { setTimeout as sleep } from 'timers/promises';

async function debugThesesFrResponse() {
  console.log('🔍 DEBUG THESES.FR API RESPONSE\n');
  
  try {
    const url = 'https://theses.fr/api/v1/theses/recherche/?q=intelligence&format=json&per_page=3';
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      console.log('📄 Response structure:');
      console.log(`  Type: ${typeof data}`);
      console.log(`  Is Array: ${Array.isArray(data)}`);
      console.log(`  Keys: ${Object.keys(data)}`);
      console.log(`  Length: ${data.length}`);
      
      // Try different access patterns
      console.log('\n🔍 Testing access patterns:');
      
      if (Array.isArray(data)) {
        console.log(`  ✅ Direct array access: ${data.length} items`);
        if (data.length > 0) {
          console.log(`    First item keys: ${Object.keys(data[0])}`);
          console.log(`    First title: ${data[0]?.title?.substring(0, 50) || 'N/A'}`);
        }
      } else if (data.theses) {
        console.log(`  ✅ data.theses: ${data.theses.length} items`);
        if (data.theses.length > 0) {
          console.log(`    First item keys: ${Object.keys(data.theses[0])}`);
          console.log(`    First title: ${data.theses[0]?.title?.substring(0, 50) || 'N/A'}`);
        }
      } else if (data.results) {
        console.log(`  ✅ data.results: ${data.results.length} items`);
        if (data.results.length > 0) {
          console.log(`    First item keys: ${Object.keys(data.results[0])}`);
          console.log(`    First title: ${data.results[0]?.title?.substring(0, 50) || 'N/A'}`);
        }
      } else {
        console.log('  ❌ Unknown structure');
        console.log('  📄 Full response:');
        console.log(JSON.stringify(data, null, 2));
      }
    } else {
      console.log(`  ❌ Error: ${response.status}`);
      console.log(`  📄 Error content: ${await response.text()}`);
    }
  } catch (error) {
    console.log(`  ❌ Exception: ${error.message}`);
  }
}

debugThesesFrResponse();
