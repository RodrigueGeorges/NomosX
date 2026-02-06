/**
 * Exemples concrets d'utilisation des providers institutionnels
 * À utiliser pour tests, démos, documentation
 */

import { scout,runFullPipeline } from '@/lib/agent/pipeline-v2';
import { recommendProviders } from './presets';

/**
 * EXEMPLE 1: Géopolitique - Menaces cyber russes
 */
export async function exampleCyberThreats() {
  console.log('🔴 EXEMPLE 1: Cyber Threats from Russia\n');
  
  const question = "What are the main cyber threats from Russia to critical infrastructure?";
  
  // Recommandation automatique
  const { preset, rationale } = recommendProviders(question);
  console.log(`✨ Preset recommandé: ${preset.name}`);
  console.log(`📝 Rationale: ${rationale}\n`);
  
  // Exécution
  const { briefId, stats } = await runFullPipeline(question, preset.providers);
  
  console.log(`✅ Brief créé: ${briefId}`);
  console.log(`📊 Stats:`, stats);
  
  return briefId;
}

/**
 * EXEMPLE 2: Économie - Inflation FMI
 */
export async function exampleInflationOutlook() {
  console.log('🟡 EXEMPLE 2: IMF Inflation Outlook\n');
  
  const question = "What is the IMF's assessment of global inflation trends for 2026?";
  
  const { preset } = recommendProviders(question);
  console.log(`✨ Preset: ${preset.name}\n`);
  
  // Scout uniquement (plus rapide pour test)
  const result = await scout(question, preset.providers, 15);
  
  console.log(`✅ Sources trouvées: ${result.found}`);
  console.log(`💾 Sources sauvegardées: ${result.upserted}`);
  
  // Afficher échantillon
  if (result.sourceIds.length > 0) {
    console.log('\n📚 Échantillon sources:');
    // Récupérer quelques sources pour affichage
    const { prisma } = await import('@/lib/db');
    const samples = await prisma.source.findMany({
      where: { id: { in: result.sourceIds.slice(0, 5) } },
      select: { id: true, provider: true, title: true, issuerType: true }
    });
    
    samples.forEach(s => {
      const badge = s.issuerType ? `[${s.issuerType}]` : '[academic]';
      console.log(`  ${badge} ${s.provider}: ${s.title.substring(0, 60)}...`);
    });
  }
  
  return result;
}

/**
 * EXEMPLE 3: Mix complet - Défense européenne
 */
export async function exampleEuropeanDefense() {
  console.log('🟠 EXEMPLE 3: European Defense Strategy\n');
  
  const question = "Should EU member states increase defense spending in response to current threats?";
  
  // Providers manuels pour cet exemple spécifique
  const providers = [
    // Intelligence (menaces)
    'odni', 'uk-jic',
    // Défense (doctrine)
    'nato', 'eeas', 'eda',
    // Économie (faisabilité)
    'imf', 'oecd',
    // Académique (théorie)
    'openalex', 'semanticscholar'
  ];
  
  console.log(`🎯 Providers: ${providers.join(', ')}\n`);
  
  const { briefId, stats } = await runFullPipeline(question, providers as any);
  
  console.log(`✅ Brief créé: ${briefId}`);
  console.log(`\n📊 Pipeline Stats:`);
  console.log(`  • Scout: ${stats.scout?.found} sources trouvées`);
  console.log(`  • Index: ${stats.index?.enriched} sources enrichies`);
  console.log(`  • Rank: ${stats.rank?.count} sources sélectionnées`);
  console.log(`  • Reader: ${stats.reader?.count} sources analysées`);
  console.log(`  • Guard: ${stats.guard?.usedCount} citations validées`);
  
  return briefId;
}

/**
 * EXEMPLE 4: Recherche historique - CIA déclassifié
 */
export async function exampleHistoricalResearch() {
  console.log('⚪ EXEMPLE 4: Historical CIA Documents\n');
  
  const question = "What did CIA know about Soviet economic vulnerabilities in the 1980s?";
  
  const providers = [
    'cia-foia',      // Documents déclassifiés
    'nara',          // Archives nationales
    'uk-archives',   // Perspective britannique
    'openalex'       // Contexte académique
  ];
  
  console.log(`📚 Providers: ${providers.join(', ')}\n`);
  
  const result = await scout(question, providers as any, 10);
  
  console.log(`✅ Sources: ${result.found} trouvées, ${result.upserted} sauvegardées`);
  
  return result;
}

/**
 * EXEMPLE 5: Analyse comparative providers
 */
export async function exampleCompareProviders() {
  console.log('📊 EXEMPLE 5: Compare Provider Coverage\n');
  
  const query = "cybersecurity threats";
  
  // Tester plusieurs providers en parallèle
  const tests = [
    { provider: 'cisa', category: 'institutional' },
    { provider: 'enisa', category: 'institutional' },
    { provider: 'nist', category: 'institutional' },
    { provider: 'openalex', category: 'academic' }
  ];
  
  const results = await Promise.all(
    tests.map(async ({ provider, category }) => {
      const result = await scout(query, [provider as any], 10);
      return {
        provider,
        category,
        found: result.found,
        upserted: result.upserted
      };
    })
  );
  
  console.log('Résultats par provider:\n');
  
  results.forEach(r => {
    const badge = r.category === 'institutional' ? '🏛️' : '📚';
    console.log(`${badge} ${r.provider.padEnd(12)} → ${r.found} sources (${r.upserted} saved)`);
  });
  
  const totalInstitutional = results
    .filter(r => r.category === 'institutional')
    .reduce((sum, r) => sum + r.found, 0);
  
  const totalAcademic = results
    .filter(r => r.category === 'academic')
    .reduce((sum, r) => sum + r.found, 0);
  
  console.log(`\n📊 Total institutional: ${totalInstitutional}`);
  console.log(`📊 Total academic: ${totalAcademic}`);
  console.log(`📊 Ratio: ${Math.round(totalInstitutional / totalAcademic * 100)}% institutional vs academic`);
  
  return results;
}

/**
 * Runner pour tous les exemples
 */
export async function runAllExamples() {
  console.log('🚀 RUNNING ALL EXAMPLES\n');
  console.log('='.repeat(70));
  
  try {
    await exampleCyberThreats();
    console.log('\n' + '='.repeat(70) + '\n');
    
    await exampleInflationOutlook();
    console.log('\n' + '='.repeat(70) + '\n');
    
    await exampleEuropeanDefense();
    console.log('\n' + '='.repeat(70) + '\n');
    
    await exampleHistoricalResearch();
    console.log('\n' + '='.repeat(70) + '\n');
    
    await exampleCompareProviders();
    console.log('\n' + '='.repeat(70) + '\n');
    
    console.log('✅ Tous les exemples exécutés avec succès!');
  } catch (error: any) {
    console.error('❌ Erreur:', error.message);
    throw error;
  }
}

/**
 * Exemple rapide pour démo
 */
export async function quickDemo() {
  console.log('⚡ QUICK DEMO - Mix institutionnel + académique\n');
  
  const question = "What are the main AI safety challenges?";
  const { preset } = recommendProviders(question);
  
  console.log(`Question: "${question}"`);
  console.log(`Preset: ${preset.name}`);
  console.log(`Providers: ${preset.providers.join(', ')}\n`);
  
  const result = await scout(question, preset.providers, 12);
  
  console.log(`✅ ${result.found} sources trouvées`);
  console.log(`💾 ${result.upserted} sources sauvegardées en DB`);
  
  return result;
}
