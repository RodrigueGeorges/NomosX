// Test système via API endpoints
async function testSystem() {
  console.log('🔍 TEST SYSTÈME NOMOSX VIA API\n');
  
  try {
    // Test publications (public)
    const pubResponse = await fetch('http://localhost:3000/api/think-tank/publications?limit=5');
    if (pubResponse.ok) {
      const pubData = await pubResponse.json();
      console.log(`📄 Publications: ${pubData.publications?.length || 0}`);
      
      if (pubData.publications?.length > 0) {
        console.log('Dernières publications:');
        pubData.publications.slice(0, 3).forEach(p => {
          console.log(`  - ${p.title} (${p.type}) - ${p.status}`);
        });
      }
    } else {
      console.log('❌ Publications endpoint error:', pubResponse.status);
    }
    
    // Test verticals
    const vertResponse = await fetch('http://localhost:3000/api/think-tank/verticals');
    if (vertResponse.ok) {
      const vertData = await vertResponse.json();
      console.log(`🎯 Verticals: ${vertData.verticals?.length || 0}`);
      
      if (vertData.verticals?.length > 0) {
        console.log('Verticals actives:');
        vertData.verticals.forEach(v => {
          console.log(`  - ${v.name} (${v.recentPublicationCount || 0} publications)`);
        });
      }
    } else {
      console.log('❌ Verticals endpoint error:', vertResponse.status);
    }
    
    // Test health
    const healthResponse = await fetch('http://localhost:3000/api/health');
    if (healthResponse.ok) {
      const health = await healthResponse.json();
      console.log(`🏥 Health: ${health.status}`);
      console.log(`  Database: ${health.database}`);
      console.log(`  Redis: ${health.redis}`);
    } else {
      console.log('❌ Health endpoint error');
    }
    
    console.log('\n✅ Test API terminé');
    
  } catch (error) {
    console.error('❌ Erreur test:', error.message);
  }
}

testSystem();
