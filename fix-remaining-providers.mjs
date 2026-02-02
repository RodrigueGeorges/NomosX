// FIX RAPIDE DES 3 PROVIDERS RESTANTS
import { setTimeout as sleep } from 'timers/promises';

async function fixRemainingProviders() {
  console.log('🔧 FIX RAPIDE - 3 PROVIDERS RESTANTS\n');
  
  let fixes = 0;
  
  // 1. Semantic Scholar - endpoint corrigé
  console.log('🎓 Semantic Scholar - endpoint corrigé...');
  try {
    const response = await fetch('https://api.semanticscholar.org/graph/v1/papers/search?query=artificial%20intelligence&limit=2&fields=title');
    if (response.ok) {
      const data = await response.json();
      const papers = data.data || [];
      console.log(`  ✅ Semantic Scholar: ${papers.length} papers`);
      fixes++;
    } else {
      console.log(`  ❌ Semantic Scholar: Error ${response.status}`);
    }
  } catch (error) {
    console.log(`  ❌ Semantic Scholar: ${error.message}`);
  }
  
  // 2. OECD - endpoint simple
  console.log('\n🏛️ OECD - endpoint simple...');
  try {
    const response = await fetch('https://stats.oecd.org/sdmx-json/data/DP_LIFEEXP.TOTAL/?format=sdmx-json');
    if (response.ok) {
      const data = await response.json();
      console.log(`  ✅ OECD: Life expectancy data accessible`);
      fixes++;
    } else {
      console.log(`  ❌ OECD: Error ${response.status}`);
    }
  } catch (error) {
    console.log(`  ❌ OECD: ${error.message}`);
  }
  
  // 3. IMF - endpoint simple
  console.log('\n🏦 IMF - endpoint simple...');
  try {
    const response = await fetch('https://dataservices.imf.org/REST/SDMX_JSON.svc/Dataflow/IFS');
    if (response.ok) {
      const data = await response.json();
      console.log(`  ✅ IMF: Dataflow accessible`);
      fixes++;
    } else {
      console.log(`  ❌ IMF: Error ${response.status}`);
    }
  } catch (error) {
    console.log(`  ❌ IMF: ${error.message}`);
  }
  
  console.log(`\n📊 Fixes appliqués: ${fixes}/3`);
  
  return fixes;
}

fixRemainingProviders();
