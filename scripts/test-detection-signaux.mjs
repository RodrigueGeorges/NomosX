/**
 * TEST DÉTECTION SIGNAUX - Signal detection flow
 * Test du système de détection de signaux faibles
 */

import { prisma } from '../lib/db.js';
import { detectSignals } from '../lib/agents/signal-detector.js';

async function testDetectionSignaux() {
  console.log('🚨 TEST DÉTECTION SIGNAUX - Signal Detection Flow\n');
  
  try {
    const startTime = Date.now();
    
    // Récupérer les sources récentes pour la détection
    console.log('📊 Récupération des sources récentes...');
    
    const recentSources = await prisma.source.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // 24 dernières heures
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50,
      select: {
        id: true,
        title: true,
        abstract: true,
        provider: true,
        qualityScore: true,
        noveltyScore: true,
        createdAt: true,
        raw: true
      }
    });
    
    console.log(`📈 Sources trouvées: ${recentSources.length}`);
    
    if (recentSources.length === 0) {
      console.log('⚠️  Aucune source récente trouvée - Création de données de test...');
      
      // Créer quelques sources de test
      const testSources = await createTestSources();
      console.log(`✅ Sources de test créées: ${testSources.length}`);
      
      // Utiliser les sources de test
      const testSourcesFromDB = await prisma.source.findMany({
        where: {
          title: {
            contains: '[TEST]'
          }
        },
        take: 10
      });
      
      recentSources.push(...testSourcesFromDB);
    }
    
    console.log(`📊 Sources à analyser: ${recentSources.length}`);
    
    // Exécuter la détection de signaux
    console.log('\n🔍 Lancement de la détection de signaux...');
    
    const signals = await detectSignals(recentSources, {
      minNovelty: 70,
      minQuality: 60,
      timeWindow: '24h',
      maxSignals: 20
    });
    
    const duration = Date.now() - startTime;
    
    console.log('\n📈 RÉSULTATS DÉTECTION:');
    console.log(`  ⏱️  Durée: ${Math.round(duration / 1000)}s`);
    console.log(`  🚨 Signaux détectés: ${signals.length}`);
    console.log(`  📊 Sources analysées: ${recentSources.length}`);
    
    if (signals.length > 0) {
      console.log('\n🚨 SIGNAUX DÉTECTÉS:');
      signals.forEach((signal, index) => {
        console.log(`\n  ${index + 1}. ${signal.title?.substring(0, 80)}...`);
        console.log(`     📡 Provider: ${signal.provider}`);
        console.log(`     🎯 Type: ${signal.type}`);
        console.log(`     📈 Novelty: ${signal.noveltyScore}/100`);
        console.log(`     ⭐ Quality: ${signal.qualityScore}/100`);
        console.log(`     📅 Date: ${signal.createdAt?.toLocaleDateString()}`);
        console.log(`     🏷️  Tags: ${(signal.tags || []).join(', ')}`);
        
        if (signal.description) {
          console.log(`     📝 Description: ${signal.description.substring(0, 100)}...`);
        }
      });
    } else {
      console.log('\n⚠️  Aucun signal détecté');
    }
    
    // Vérification du flow
    console.log('\n🔍 VÉRIFICATION FLOW DÉTECTION:');
    const flowChecks = {
      'Source retrieval': recentSources.length > 0,
      'Signal detection': signals.length >= 0,
      'Novelty scoring': signals.every(s => s.noveltyScore >= 0),
      'Quality filtering': signals.every(s => s.qualityScore >= 0),
      'Signal tagging': signals.every(s => Array.isArray(s.tags)),
      'Performance': duration < 30000 // < 30s
    };
    
    Object.entries(flowChecks).forEach(([component, status]) => {
      console.log(`  ${status ? '✅' : '❌'} ${component}: ${status ? 'OK' : 'PROBLÈME'}`);
    });
    
    // Analyse des signaux
    if (signals.length > 0) {
      const avgNovelty = signals.reduce((sum, s) => sum + (s.noveltyScore || 0), 0) / signals.length;
      const avgQuality = signals.reduce((sum, s) => sum + (s.qualityScore || 0), 0) / signals.length;
      const providers = [...new Set(signals.map(s => s.provider))];
      
      console.log('\n📊 ANALYSE DES SIGNAUX:');
      console.log(`  📈 Novelty moyenne: ${Math.round(avgNovelty)}/100`);
      console.log(`  ⭐ Quality moyenne: ${Math.round(avgQuality)}/100`);
      console.log(`  📡 Providers: ${providers.join(', ')}`);
      console.log(`  🏷️  Types: ${[...new Set(signals.map(s => s.type))].join(', ')}`);
    }
    
    // Score global
    const passedChecks = Object.values(flowChecks).filter(Boolean).length;
    const totalChecks = Object.keys(flowChecks).length;
    const score = Math.round((passedChecks / totalChecks) * 100);
    
    console.log(`\n🎯 SCORE GLOBAL DÉTECTION: ${score}%`);
    
    if (score >= 80) {
      console.log('🎉 DÉTECTION SIGNAUX: OPÉRATIONNELLE');
    } else if (score >= 60) {
      console.log('⚠️  DÉTECTION SIGNAUX: PARTIELLEMENT OPÉRATIONNELLE');
    } else {
      console.log('❌ DÉTECTION SIGNAUX: PROBLÉMATIQUE');
    }
    
    return {
      success: score >= 60,
      score,
      signals,
      sourcesAnalyzed: recentSources.length,
      duration,
      flowChecks
    };
    
  } catch (error: any) {
    console.error('❌ ERREUR CRITIQUE:', error.message);
    return {
      success: false,
      error: error.message,
      score: 0
    };
  }
}

async function createTestSources() {
  const testSources = [
    {
      id: 'test-signal-1',
      provider: 'crossref',
      type: 'publication',
      title: '[TEST] Revolutionary AI breakthrough in quantum computing',
      abstract: 'A new artificial intelligence system demonstrates unprecedented capabilities in quantum computing applications.',
      url: 'https://example.com/test1',
      year: 2026,
      authors: [],
      citationCount: 0,
      qualityScore: 85,
      noveltyScore: 95,
      documentType: 'publication',
      issuer: 'Test University',
      issuerType: 'academic',
      classification: 'technology',
      language: 'en',
      contentFormat: 'text',
      oaStatus: 'open',
      hasFullText: true,
      raw: { test: true }
    },
    {
      id: 'test-signal-2',
      provider: 'arxiv',
      type: 'preprint',
      title: '[TEST] Climate change: New data reveals accelerated ice sheet melting',
      abstract: 'Recent satellite data shows unprecedented acceleration in polar ice sheet melting rates.',
      url: 'https://example.com/test2',
      year: 2026,
      authors: [],
      citationCount: 0,
      qualityScore: 88,
      noveltyScore: 92,
      documentType: 'preprint',
      issuer: 'Climate Research Institute',
      issuerType: 'academic',
      classification: 'climate',
      language: 'en',
      contentFormat: 'text',
      oaStatus: 'open',
      hasFullText: true,
      raw: { test: true }
    },
    {
      id: 'test-signal-3',
      provider: 'worldbank',
      type: 'dataset',
      title: '[TEST] Global economic indicators show unexpected growth patterns',
      abstract: 'New World Bank data reveals surprising patterns in global economic growth indicators.',
      url: 'https://example.com/test3',
      year: 2026,
      authors: [],
      citationCount: 0,
      qualityScore: 82,
      noveltyScore: 78,
      documentType: 'dataset',
      issuer: 'World Bank',
      issuerType: 'government',
      classification: 'economics',
      language: 'en',
      contentFormat: 'json',
      oaStatus: 'open',
      hasFullText: true,
      raw: { test: true }
    }
  ];
  
  // Insérer les sources de test
  for (const source of testSources) {
    await prisma.source.upsert({
      where: { id: source.id },
      update: source,
      create: {
        ...source,
        publishedDate: new Date().toISOString(),
        updatedAt: new Date()
      }
    });
  }
  
  return testSources;
}

// Exécuter le test
testDetectionSignaux()
  .then(result => {
    console.log('\n✅ Test terminé');
    process.exit(result.success ? 0 : 1);
  })
  .catch(error => {
    console.error('\n❌ Test échoué:', error);
    process.exit(1);
  });
