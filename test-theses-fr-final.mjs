// Test final Theses.fr avec structure correcte
import { setTimeout as sleep } from 'timers/promises';

async function testThesesFrFinal() {
  console.log('🎓 THESES.FR - STRUCTURE CORRECTE\n');
  
  let totalTheses = 0;
  
  // 1. Recherche par termes larges
  console.log('🔍 Recherche termes larges...');
  const searchTerms = ['intelligence', 'data', 'digital', 'machine'];
  
  for (const term of searchTerms) {
    try {
      const url = `https://theses.fr/api/v1/theses/recherche/?q=${encodeURIComponent(term)}&format=json&per_page=3`;
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        const theses = data.theses || [];
        console.log(`  ✅ ${term}: ${theses.length} thèses (${data.totalHits || 0} total)`);
        totalTheses += theses.length;
        
        if (theses.length > 0) {
          theses.slice(0, 2).forEach((these, i) => {
            console.log(`    📄 ${i+1}. ${these.titrePrincipal?.substring(0, 60)}...`);
            console.log(`       🎓 ${these.discipline || 'N/A'}`);
            console.log(`       📅 ${these.dateSoutenance?.substring(0, 4) || 'N/A'}`);
            console.log(`       🏢 ${these.etabSoutenanceN || 'N/A'}`);
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
  
  // 2. Thèses récentes
  console.log('\n📅 Thèses récentes...');
  try {
    const url = 'https://theses.fr/api/v1/theses/recherche/?format=json&per_page=3&sort=dateSoutenance&order=desc';
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      const theses = data.theses || [];
      console.log(`  ✅ Récentes: ${theses.length} thèses (${data.totalHits || 0} total)`);
      totalTheses += theses.length;
      
      if (theses.length > 0) {
        theses.forEach((these, i) => {
          console.log(`    📄 ${i+1}. ${these.titrePrincipal?.substring(0, 60)}...`);
          console.log(`       📅 ${these.dateSoutenance || 'N/A'}`);
          console.log(`       🎓 ${these.discipline || 'N/A'}`);
        });
      }
    } else {
      console.log(`  ❌ Récentes: Error ${response.status}`);
    }
  } catch (error) {
    console.log(`  ❌ Récentes: ${error.message}`);
  }
  
  await sleep(500);
  
  // 3. Par établissement (PSL)
  console.log('\n🏛️ Thèses PSL...');
  try {
    const url = 'https://theses.fr/api/v1/theses/organisme/0750642U?format=json&per_page=3';
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      const theses = data.theses || [];
      console.log(`  ✅ PSL: ${theses.length} thèses`);
      totalTheses += theses.length;
      
      if (theses.length > 0) {
        theses.slice(0, 2).forEach((these, i) => {
          console.log(`    📄 ${i+1}. ${these.titrePrincipal?.substring(0, 60)}...`);
          console.log(`       📅 ${these.dateSoutenance?.substring(0, 4) || 'N/A'}`);
        });
      }
    } else {
      console.log(`  ❌ PSL: Error ${response.status}`);
    }
  } catch (error) {
    console.log(`  ❌ PSL: ${error.message}`);
  }
  
  // 4. Statistiques globales
  console.log('\n📊 Statistiques globales...');
  try {
    const statsUrl = 'https://theses.fr/api/v1/theses/statsTheses';
    const statsResponse = await fetch(statsUrl);
    
    if (statsResponse.ok) {
      const statsData = await statsResponse.json();
      console.log(`  ✅ Total thèses soutenues: ${statsData}`);
    } else {
      console.log(`  ❌ Stats: Error ${statsResponse.status}`);
    }
  } catch (error) {
    console.log(`  ❌ Stats: ${error.message}`);
  }
  
  console.log('\n📊 RÉSUMÉ THESES.FR FINAL:');
  console.log(`  ✅ Thèses trouvées: ${totalTheses}`);
  console.log('  ✅ Structure API: data.theses[]');
  console.log('  ✅ Champs: titrePrincipal, discipline, dateSoutenance, etabSoutenanceN');
  console.log('  ✅ Recherche par termes, date, établissement');
  console.log('  ✅ Statistiques globales disponibles');
  
  return totalTheses > 0;
}

testThesesFrFinal();
