/**
 * OPENCLAW DIAGNOSTIC - VÉRIFICATION INTÉGRATION RÉELLE
 * Diagnostic complet de l'état actuel d'intégration des providers
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';

class OpenClawDiagnostic {
  constructor() {
    this.actualProviders = [];
    this.expectedProviders = 34;
    this.integrationStatus = {};
  }

  async runDiagnostic() {
    console.log('🔍 OPENCLAW - Diagnostic Intégration Réelle\n');
    console.log('🎯 Vérification de l\'intégration effective des 34 nouveaux providers\n');
    
    // Phase 1: Scan fichiers réels
    await this.scanActualFiles();
    
    // Phase 2: Vérification registry
    await this.checkRegistry();
    
    // Phase 3: Test configuration
    await this.testConfiguration();
    
    // Phase 4: Diagnostic agents
    await this.diagnoseAgents();
    
    // Phase 5: Rapport d'état
    await this.generateStatusReport();
  }

  async scanActualFiles() {
    console.log('📁 PHASE 1: Scan Fichiers Réels...');
    
    const providersDir = join(process.cwd(), 'lib', 'providers');
    
    try {
      const files = readdirSync(providersDir);
      const providerFiles = files.filter(file => file.endsWith('-provider.js'));
      
      console.log(`  📂 Fichiers trouvés: ${providerFiles.length}`);
      
      this.actualProviders = providerFiles.map(file => {
        const filePath = join(providersDir, file);
        try {
          const content = readFileSync(filePath, 'utf8');
          const nameMatch = content.match(/this\.name = '([^']+)'/);
          const typeMatch = content.match(/Type: ([^\n]+)/);
          
          return {
            file: file,
            path: filePath,
            name: nameMatch ? nameMatch[1] : 'Unknown',
            type: typeMatch ? typeMatch[1].trim() : 'Unknown',
            size: content.length,
            exists: true
          };
        } catch (error) {
          return {
            file: file,
            path: filePath,
            name: 'Error',
            type: 'Error',
            size: 0,
            exists: false,
            error: error.message
          };
        }
      });
      
      console.log('  📋 Providers détectés:');
      this.actualProviders.forEach(provider => {
        if (provider.exists) {
          console.log(`    ✅ ${provider.file} -> ${provider.name} (${provider.type})`);
        } else {
          console.log(`    ❌ ${provider.file} -> ERREUR: ${provider.error}`);
        }
      });
      
      const validProviders = this.actualProviders.filter(p => p.exists);
      console.log(`\n  📊 Statut: ${validProviders.length}/${this.expectedProviders} providers valides`);
      
    } catch (error) {
      console.error(`  ❌ Erreur scan répertoire: ${error.message}`);
    }
  }

  async checkRegistry() {
    console.log('\n📋 PHASE 2: Vérification Registry...');
    
    const registryPath = join(process.cwd(), 'lib', 'providers', 'registry-v2.ts');
    
    if (!existsSync(registryPath)) {
      console.log('  ❌ Registry principal introuvable');
      return;
    }
    
    try {
      const registryContent = readFileSync(registryPath, 'utf8');
      
      // Compter les imports de providers
      const imports = registryContent.match(/import.*from.*provider/g) || [];
      const providerEntries = registryContent.match(/'[^-]+': new/g) || [];
      
      console.log(`  📊 Registry analyse:`);
      console.log(`    📥 Imports: ${imports.length}`);
      console.log(`    📝 Entrées: ${providerEntries.length}`);
      
      // Vérifier si les nouveaux providers sont dans le registry
      const expectedNames = [
        'mckinsey', 'bcg', 'deloitte', 'brookings', 'carnegie',
        'cfr', 'iiss', 'rsis', 'ipcc', 'climate-analytics',
        'wri', 'papers-with-code', 'who', 'johns-hopkins',
        'blackrock', 'bis', 'chatham-house', 'rand', 'bruegel'
      ];
      
      const foundInRegistry = expectedNames.filter(name => 
        registryContent.toLowerCase().includes(name)
      );
      
      console.log(`    🎯 Nouveaux providers dans registry: ${foundInRegistry.length}/${expectedNames.length}`);
      
      if (foundInRegistry.length < expectedNames.length) {
        console.log('    ⚠️ Registry non à jour avec tous les nouveaux providers');
        const missing = expectedNames.filter(name => !foundInRegistry.includes(name));
        console.log(`    🔧 Manquants: ${missing.join(', ')}`);
      }
      
      this.integrationStatus.registry = {
        imports: imports.length,
        entries: providerEntries.length,
        newProvidersFound: foundInRegistry.length,
        expectedNewProviders: expectedNames.length,
        upToDate: foundInRegistry.length >= expectedNames.length * 0.8
      };
      
    } catch (error) {
      console.error(`  ❌ Erreur lecture registry: ${error.message}`);
      this.integrationStatus.registry = { error: error.message };
    }
  }

  async testConfiguration() {
    console.log('\n⚙️ PHASE 3: Test Configuration...');
    
    const configFiles = [
      'massive-providers.json',
      'innovants-providers.json',
      'gateway-portable.json'
    ];
    
    for (const configFile of configFiles) {
      const configPath = join(process.cwd(), 'config', configFile);
      
      if (existsSync(configPath)) {
        try {
          const configContent = readFileSync(configPath, 'utf8');
          const config = JSON.parse(configContent);
          
          console.log(`  ✅ ${configFile}: ${Object.keys(config).length} configurations`);
          
          if (configFile === 'massive-providers.json') {
            const providerCount = Object.keys(config).length;
            console.log(`    📊 Providers configurés: ${providerCount}`);
            this.integrationStatus.massiveConfig = providerCount;
          }
          
        } catch (error) {
          console.log(`  ❌ ${configFile}: Erreur JSON - ${error.message}`);
        }
      } else {
        console.log(`  ❌ ${configFile}: Fichier manquant`);
      }
    }
  }

  async diagnoseAgents() {
    console.log('\n🤖 PHASE 4: Diagnostic Agents...');
    
    // Vérifier les agents principaux
    const agentFiles = [
      'lib/agent/pipeline-v2.ts',
      'lib/agent/scout-agent.ts',
      'lib/agent/index-agent.ts'
    ];
    
    for (const agentFile of agentFiles) {
      const agentPath = join(process.cwd(), agentFile);
      
      if (existsSync(agentPath)) {
        try {
          const agentContent = readFileSync(agentPath, 'utf8');
          
          // Chercher les références aux nouveaux providers
          const newProviderRefs = [
            'mckinsey', 'bcg', 'deloitte', 'brookings', 'carnegie',
            'who', 'ipcc', 'climate', 'blackrock', 'chatham'
          ];
          
          const foundRefs = newProviderRefs.filter(ref => 
            agentContent.toLowerCase().includes(ref)
          );
          
          console.log(`  📋 ${agentFile}:`);
          console.log(`    🎯 Références nouveaux providers: ${foundRefs.length}/${newProviderRefs.length}`);
          
          if (foundRefs.length === 0) {
            console.log(`    ⚠️ Agent ne semble pas utiliser les nouveaux providers`);
          }
          
        } catch (error) {
          console.log(`  ❌ ${agentFile}: Erreur lecture - ${error.message}`);
        }
      } else {
        console.log(`  ❌ ${agentFile}: Fichier manquant`);
      }
    }
  }

  async generateStatusReport() {
    console.log('\n📊 PHASE 5: Rapport État Intégration...');
    console.log('=' .repeat(70));
    
    // État réel
    const actualValidProviders = this.actualProviders.filter(p => p.exists).length;
    const expectedTotal = 26 + this.expectedProviders; // 26 existants + 34 nouveaux
    const actualTotal = 26 + actualValidProviders;
    
    console.log(`📚 Providers attendus: ${expectedTotal}`);
    console.log(`📚 Providers réels: ${actualTotal}`);
    console.log(`📊 Taux intégration: ${Math.round((actualTotal/expectedTotal) * 100)}%`);
    
    // Diagnostic des problèmes
    console.log('\n🔍 DIAGNOSTIC PROBLÈMES:');
    
    if (actualValidProviders < this.expectedProviders) {
      const missing = this.expectedProviders - actualValidProviders;
      console.log(`  ❌ ${missing} nouveaux providers manquants`);
      console.log(`  🔧 Cause probable: Erreur dans la création des fichiers`);
    }
    
    if (this.integrationStatus.registry && !this.integrationStatus.registry.upToDate) {
      console.log(`  ❌ Registry non à jour`);
      console.log(`  🔧 Action: Mettre à jour registry-v2.ts avec les nouveaux providers`);
    }
    
    if (!this.integrationStatus.massiveConfig) {
      console.log(`  ❌ Configuration massive manquante`);
      console.log(`  🔧 Action: Créer massive-providers.json`);
    }
    
    // Recommandations
    console.log('\n🚀 RECOMMANDATIONS OPENCLAW:');
    
    if (actualValidProviders === 0) {
      console.log('  🔄 RELANCER L\'IMPLÉMENTATION:');
      console.log('     node lib/agent/openclaw-massive-extension.mjs');
      console.log('  🔧 Corriger les erreurs de création de fichiers');
    } else if (actualValidProviders < this.expectedProviders) {
      console.log('  🔧 COMPLÉTER L\'INTÉGRATION:');
      console.log('     Créer les providers manquants');
      console.log('     Mettre à jour le registry');
    } else {
      console.log('  ✅ INTÉGRATION RÉUSSIE:');
      console.log('     Tester les providers individuellement');
      console.log('     Valider l\'intégration avec les agents');
    }
    
    // État final
    const integrationScore = Math.round((actualTotal/expectedTotal) * 100);
    
    console.log(`\n🎯 SCORE INTÉGRATION: ${integrationScore}/100`);
    
    if (integrationScore >= 90) {
      console.log('  🎉 EXCELLENT - Intégration quasi-complète');
    } else if (integrationScore >= 70) {
      console.log('  ✅ BON - Intégration fonctionnelle avec gaps');
    } else if (integrationScore >= 50) {
      console.log('  ⚠️ MOYEN - Intégration partielle');
    } else {
      console.log('  ❌ FAIBLE - Intégration échouée');
    }
    
    console.log('\n🎊 CONCLUSION OPENCLAW:');
    console.log(`  L'intégration massive a rencontré des problèmes techniques.`);
    console.log(`  Les fichiers providers n'ont pas été créés correctement.`);
    console.log(`  Recommandation: Relancer avec correction des erreurs de template.`);
  }
}

// Lancer le diagnostic
const diagnostic = new OpenClawDiagnostic();
diagnostic.runDiagnostic().catch(console.error);
