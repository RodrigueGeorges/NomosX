// Test et correction OpenAlex API
import { setTimeout as sleep } from 'timers/promises';

async function testOpenAlexAPI() {
  console.log('🔧 CORRECTION OPENALEX API\n');
  
  // Test 1: Query simple sans filtres
  console.log('📚 Test 1: Query simple...');
  try {
    const url = 'https://api.openalex.org/works?per_page=3';
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`  ✅ Simple query: ${data.results?.length || 0} travaux`);
      
      if (data.results?.length > 0) {
        data.results.forEach(work => {
          console.log(`    📄 ${work.title?.substring(0, 60)}... (${work.publication_year})`);
        });
      }
    } else {
      console.log(`  ❌ Simple query: Error ${response.status}`);
    }
  } catch (error) {
    console.log(`  ❌ Simple query: ${error.message}`);
  }
  
  await sleep(1000);
  
  // Test 2: Query avec filtre par année
  console.log('\n📚 Test 2: Filtre par année...');
  try {
    const url = 'https://api.openalex.org/works?filter=publication_year:2024&per_page=3';
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`  ✅ Year filter: ${data.results?.length || 0} travaux 2024`);
      
      if (data.results?.length > 0) {
        data.results.forEach(work => {
          console.log(`    📄 ${work.title?.substring(0, 60)}... (${work.publication_year})`);
        });
      }
    } else {
      console.log(`  ❌ Year filter: Error ${response.status}`);
    }
  } catch (error) {
    console.log(`  ❌ Year filter: ${error.message}`);
  }
  
  await sleep(1000);
  
  // Test 3: Query avec keywords
  console.log('\n📚 Test 3: Query avec keywords...');
  try {
    const url = 'https://api.openalex.org/works?search=artificial%20intelligence&per_page=3';
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`  ✅ Keywords: ${data.results?.length || 0} travaux AI`);
      
      if (data.results?.length > 0) {
        data.results.forEach(work => {
          console.log(`    📄 ${work.title?.substring(0, 60)}... (${work.publication_year})`);
          console.log(`      Relevance: ${work.relevance_score || 'N/A'}`);
        });
      }
    } else {
      console.log(`  ❌ Keywords: Error ${response.status}`);
    }
  } catch (error) {
    console.log(`  ❌ Keywords: ${error.message}`);
  }
  
  await sleep(1000);
  
  // Test 4: Query avec concepts (sujets)
  console.log('\n📚 Test 4: Query avec concepts...');
  try {
    const url = 'https://api.openalex.org/works?filter=concept.id:C41008148&per_page=3'; // Computer Science
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`  ✅ Concepts: ${data.results?.length || 0} travaux Computer Science`);
      
      if (data.results?.length > 0) {
        data.results.forEach(work => {
          console.log(`    📄 ${work.title?.substring(0, 60)}... (${work.publication_year})`);
        });
      }
    } else {
      console.log(`  ❌ Concepts: Error ${response.status}`);
    }
  } catch (error) {
    console.log(`  ❌ Concepts: ${error.message}`);
  }
  
  await sleep(1000);
  
  // Test 5: Query par institution
  console.log('\n📚 Test 5: Query par institution...');
  try {
    const url = 'https://api.openalex.org/works?filter=institutions.id:I4210120641&per_page=3'; // MIT
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`  ✅ Institution: ${data.results?.length || 0} travaux MIT`);
      
      if (data.results?.length > 0) {
        data.results.forEach(work => {
          console.log(`    📄 ${work.title?.substring(0, 60)}... (${work.publication_year})`);
        });
      }
    } else {
      console.log(`  ❌ Institution: Error ${response.status}`);
    }
  } catch (error) {
    console.log(`  ❌ Institution: ${error.message}`);
  }
  
  console.log('\n✅ Tests OpenAlex terminés');
}

testOpenAlexAPI();
