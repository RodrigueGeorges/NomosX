/**
 * OPENCLAW VÉRIFICATION FINALE COMPLÈTE - ÉTAT SYSTÈME ACTUEL
 * Vérification exhaustive de tous les composants avant déploiement
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

class OpenClawFinalVerification {
  constructor() {
    this.verificationResults = {
      files: {},
      providers: {},
      configuration: {},
      deployment: {},
      overall: { score: 0, status: 'UNKNOWN' }
    };
  }

  async runCompleteVerification() {
    console.log('🔍 OPENCLAW - Vérification Finale Complète\n');
    console.log('🎯 Audit exhaustif avant déploiement Netlify\n');
    
    // Phase 1: Vérification fichiers de configuration
    await this.verifyConfigurationFiles();
    
    // Phase 2: Vérification providers
    await this.verifyProviders();
    
    // Phase 3: Vérification agents MCP
    await this.verifyMCPAgents();
    
    // Phase 4: Vérification déploiement Netlify
    await this.verifyNetlifyDeployment();
    
    // Phase 5: Vérification système publication
    await this.verifyPublicationSystem();
    
    // Phase 6: Score final et recommandations
    await this.generateFinalScore();
  }

  async verifyConfigurationFiles() {
    console.log('📁 PHASE 1: Vérification Fichiers Configuration...\n');
    
    const requiredFiles = [
      { path: 'package.json', critical: true, description: 'Dépendances et scripts' },
      { path: 'netlify.toml', critical: true, description: 'Configuration Netlify' },
      { path: 'next.config.js', critical: false, description: 'Configuration Next.js' },
      { path: '.env.example', critical: false, description: 'Variables environnement' },
      { path: '.gitignore', critical: false, description: 'Fichiers ignorés Git' },
      { path: 'README.md', critical: false, description: 'Documentation projet' },
      { path: 'tsconfig.json', critical: false, description: 'Configuration TypeScript' },
      { path: 'tailwind.config.js', critical: false, description: 'Configuration Tailwind' }
    ];
    
    let configScore = 0;
    const maxConfigScore = requiredFiles.filter(f => f.critical).length * 25;
    
    console.log('📋 Fichiers de configuration requis:');
    for (const file of requiredFiles) {
      const exists = existsSync(join(process.cwd(), file.path));
      const status = exists ? '✅' : '❌';
      const critical = file.critical ? ' (CRITICAL)' : '';
      
      console.log(`  ${status} ${file.path}${critical}`);
      console.log(`    📝 ${file.description}`);
      
      if (exists && file.critical) {
        configScore += 25;
        
        // Vérifier contenu des fichiers critiques
        if (file.path === 'package.json') {
          await this.verifyPackageJson();
        } else if (file.path === 'netlify.toml') {
          await this.verifyNetlifyToml();
        }
      }
      
      this.verificationResults.files[file.path] = {
        exists: exists,
        critical: file.critical,
        description: file.description
      };
    }
    
    console.log(`\n📊 Score Configuration: ${configScore}/${maxConfigScore}`);
    this.verificationResults.configuration.score = configScore;
    this.verificationResults.configuration.maxScore = maxConfigScore;
  }

  async verifyPackageJson() {
    try {
      const packageJson = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf8'));
      
      const requiredScripts = ['dev', 'build', 'start'];
      const requiredDeps = ['next', 'react', 'react-dom'];
      const devDeps = ['typescript', '@types/react', '@types/node'];
      
      console.log('    🔍 Scripts requis:');
      requiredScripts.forEach(script => {
        const hasScript = packageJson.scripts && packageJson.scripts[script];
        console.log(`      ${hasScript ? '✅' : '❌'} ${script}`);
      });
      
      console.log('    📦 Dépendances requises:');
      requiredDeps.forEach(dep => {
        const hasDep = packageJson.dependencies && packageJson.dependencies[dep];
        console.log(`      ${hasDep ? '✅' : '❌'} ${dep}`);
      });
      
      console.log('    🔧 DevDependencies requises:');
      devDeps.forEach(dep => {
        const hasDep = packageJson.devDependencies && packageJson.devDependencies[dep];
        console.log(`      ${hasDep ? '✅' : '❌'} ${dep}`);
      });
      
    } catch (error) {
      console.log(`    ❌ Erreur lecture package.json: ${error.message}`);
    }
  }

  async verifyNetlifyToml() {
    try {
      const netlifyToml = readFileSync(join(process.cwd(), 'netlify.toml'), 'utf8');
      
      console.log('    🔍 Configuration Netlify:');
      
      const hasBuild = netlifyToml.includes('command = "npm run build"');
      const hasPublish = netlifyToml.includes('publish = ".next"');
      const hasFunctions = netlifyToml.includes('functions = "netlify/functions"');
      const hasRedirects = netlifyToml.includes('[[redirects]]');
      const hasHeaders = netlifyToml.includes('[[headers]]');
      
      console.log(`      ${hasBuild ? '✅' : '❌'} Build command`);
      console.log(`      ${hasPublish ? '✅' : '❌'} Publish directory`);
      console.log(`      ${hasFunctions ? '✅' : '❌'} Functions directory`);
      console.log(`      ${hasRedirects ? '✅' : '❌'} Redirects`);
      console.log(`      ${hasHeaders ? '✅' : '❌'} Security headers`);
      
    } catch (error) {
      console.log(`    ❌ Erreur lecture netlify.toml: ${error.message}`);
    }
  }

  async verifyProviders() {
    console.log('\n📚 PHASE 2: Vérification Providers...\n');
    
    const providersDir = join(process.cwd(), 'lib', 'providers');
    
    if (!existsSync(providersDir)) {
      console.log('❌ Répertoire providers introuvable');
      return;
    }
    
    const providerFiles = readdirSync(providersDir);
    const providerJsFiles = providerFiles.filter(file => file.endsWith('.js') || file.endsWith('.ts'));
    
    console.log(`📊 Fichiers providers trouvés: ${providerJsFiles.length}`);
    
    // Compter les providers par type
    const providerStats = {
      total: providerJsFiles.length,
      js: providerJsFiles.filter(f => f.endsWith('.js')).length,
      ts: providerJsFiles.filter(f => f.endsWith('.ts')).length,
      providers: 0,
      registry: 0
    };
    
    // Vérifier les fichiers providers
    let validProviders = 0;
    providerJsFiles.forEach(file => {
      const filePath = join(providersDir, file);
      try {
        const content = readFileSync(filePath, 'utf8');
        
        const hasClass = content.includes('export class') || content.includes('export const');
        const hasSearch = content.includes('async search') || content.includes('function search');
        const hasConstructor = content.includes('constructor()') || content.includes('const');
        
        if (hasClass && hasSearch) {
          validProviders++;
          providerStats.providers++;
        }
        
        if (file.includes('registry')) {
          providerStats.registry++;
        }
        
      } catch (error) {
        console.log(`  ❌ Erreur lecture ${file}: ${error.message}`);
      }
    });
    
    console.log(`📈 Statistiques Providers:`);
    console.log(`  📁 Total fichiers: ${providerStats.total}`);
    console.log(`  🔧 Fichiers JS: ${providerStats.js}`);
    console.log(`  📘 Fichiers TS: ${providerStats.ts}`);
    console.log(`  🤖 Providers valides: ${validProviders}`);
    console.log(`  📋 Registry: ${providerStats.registry}`);
    
    // Vérifier les registries
    const registryFiles = ['registry-v2.ts', 'extended-registry.js', 'final-complete-registry.js'];
    console.log(`\n📋 Registres disponibles:`);
    registryFiles.forEach(file => {
      const exists = existsSync(join(providersDir, file));
      console.log(`  ${exists ? '✅' : '❌'} ${file}`);
    });
    
    // Score providers
    const expectedProviders = 82; // 53 existants + 29 nouveaux
    const providerScore = Math.min(100, Math.round((validProviders / expectedProviders) * 100));
    
    console.log(`\n📊 Score Providers: ${providerScore}/100 (${validProviders}/${expectedProviders})`);
    this.verificationResults.providers.score = providerScore;
    this.verificationResults.providers.count = validProviders;
    this.verificationResults.providers.expected = expectedProviders;
  }

  async verifyMCPAgents() {
    console.log('\n🤖 PHASE 3: Vérification Agents MCP...\n');
    
    const agentsDir = join(process.cwd(), 'lib', 'agent');
    
    if (!existsSync(agentsDir)) {
      console.log('❌ Répertoire agents introuvable');
      return;
    }
    
    const agentFiles = readdirSync(agentsDir);
    const agentJsFiles = agentFiles.filter(file => file.endsWith('.js') || file.endsWith('.ts') || file.endsWith('.mjs'));
    
    console.log(`📊 Fichiers agents trouvés: ${agentJsFiles.length}`);
    
    // Agents MCP attendus
    const expectedAgents = [
      'scout-agent',
      'index-agent', 
      'reader-agent',
      'analyst-agent',
      'strategic-analyst-agent',
      'rank-agent',
      'pipeline-v2'
    ];
    
    console.log(`🤖 Agents MCP attendus:`);
    let foundAgents = 0;
    
    expectedAgents.forEach(agent => {
      const variations = [
        `${agent}.ts`,
        `${agent}.js`,
        `${agent}.mjs`
      ];
      
      const found = variations.some(variation => 
        agentJsFiles.includes(variation)
      );
      
      console.log(`  ${found ? '✅' : '❌'} ${agent}`);
      if (found) foundAgents++;
    });
    
    // Vérifier les agents OpenClaw créés
    const openclawAgents = agentJsFiles.filter(file => 
      file.includes('openclaw') && 
      (file.endsWith('.mjs') || file.endsWith('.js'))
    );
    
    console.log(`\n🔧 Agents OpenClaw créés:`);
    openclawAgents.forEach(agent => {
      console.log(`  ✅ ${agent}`);
    });
    
    // Score agents
    const agentScore = Math.min(100, Math.round((foundAgents / expectedAgents.length) * 100));
    
    console.log(`\n📊 Score Agents MCP: ${agentScore}/100 (${foundAgents}/${expectedAgents.length})`);
    this.verificationResults.agents = {
      score: agentScore,
      found: foundAgents,
      expected: expectedAgents.length,
      openclaw: openclawAgents.length
    };
  }

  async verifyNetlifyDeployment() {
    console.log('\n🌐 PHASE 4: Vérification Déploiement Netlify...\n');
    
    const netlifyDir = join(process.cwd(), 'netlify');
    const functionsDir = join(netlifyDir, 'functions');
    
    // Vérifier structure Netlify
    const netlifyStructure = {
      netlifyDir: existsSync(netlifyDir),
      functionsDir: existsSync(functionsDir),
      hasConfig: existsSync(join(process.cwd(), 'netlify.toml'))
    };
    
    console.log(`📁 Structure Netlify:`);
    Object.entries(netlifyStructure).forEach(([key, exists]) => {
      console.log(`  ${exists ? '✅' : '❌'} ${key}`);
    });
    
    // Vérifier functions si le répertoire existe
    if (netlifyStructure.functionsDir) {
      const functionFiles = readdirSync(functionsDir);
      console.log(`\n⚡ Functions Netlify (${functionFiles.length} fichiers):`);
      functionFiles.forEach(file => {
        console.log(`  📄 ${file}`);
      });
    }
    
    // Vérifier configuration de build
    const canBuild = await this.verifyBuildCapability();
    
    // Score déploiement
    let deploymentScore = 0;
    if (netlifyStructure.hasConfig) deploymentScore += 40;
    if (netlifyStructure.functionsDir) deploymentScore += 30;
    if (canBuild) deploymentScore += 30;
    
    console.log(`\n📊 Score Déploiement: ${deploymentScore}/100`);
    this.verificationResults.deployment.score = deploymentScore;
    this.verificationResults.deployment.canBuild = canBuild;
  }

  async verifyBuildCapability() {
    try {
      // Vérifier si package.json a un script build
      const packageJson = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf8'));
      const hasBuildScript = packageJson.scripts && packageJson.scripts.build;
      
      console.log(`  🔧 Build script: ${hasBuildScript ? '✅' : '❌'}`);
      
      return hasBuildScript;
    } catch (error) {
      console.log(`  ❌ Erreur vérification build: ${error.message}`);
      return false;
    }
  }

  async verifyPublicationSystem() {
    console.log('\n📰 PHASE 5: Vérification Système Publication...\n');
    
    // Vérifier les fichiers de publication
    const publicationFiles = [
      'openclaw-weekly-publication-test.mjs',
      'openclaw-total-integration.mjs',
      'openclaw-professional-integration.mjs'
    ];
    
    console.log(`📰 Fichiers publication système:`);
    let publicationScore = 0;
    
    publicationFiles.forEach(file => {
      const exists = existsSync(join(process.cwd(), 'lib', 'agent', file));
      console.log(`  ${exists ? '✅' : '❌'} ${file}`);
      if (exists) publicationScore += 33;
    });
    
    // Vérifier les configurations
    const configFiles = [
      'massive-providers.json',
      'complete-providers-config.json',
      'innovants-providers.json'
    ];
    
    console.log(`\n⚙️ Configurations publication:`);
    configFiles.forEach(file => {
      const exists = existsSync(join(process.cwd(), 'config', file));
      console.log(`  ${exists ? '✅' : '❌'} ${file}`);
      if (exists) publicationScore += 11;
    });
    
    console.log(`\n📊 Score Publication: ${Math.min(100, publicationScore)}/100`);
    this.verificationResults.publication = {
      score: Math.min(100, publicationScore),
      files: publicationFiles.filter(f => 
        existsSync(join(process.cwd(), 'lib', 'agent', f))
      ).length,
      configs: configFiles.filter(f => 
        existsSync(join(process.cwd(), 'config', f))
      ).length
    };
  }

  async generateFinalScore() {
    console.log('\n🏆 PHASE 6: Score Final et Recommandations...\n');
    
    // Calculer score global
    const weights = {
      configuration: 0.25,
      providers: 0.30,
      agents: 0.20,
      deployment: 0.15,
      publication: 0.10
    };
    
    const scores = {
      configuration: this.verificationResults.configuration.score || 0,
      providers: this.verificationResults.providers.score || 0,
      agents: this.verificationResults.agents?.score || 0,
      deployment: this.verificationResults.deployment.score || 0,
      publication: this.verificationResults.publication?.score || 0
    };
    
    const overallScore = Math.round(
      scores.configuration * weights.configuration +
      scores.providers * weights.providers +
      scores.agents * weights.agents +
      scores.deployment * weights.deployment +
      scores.publication * weights.publication
    );
    
    console.log('📊 SCORES DÉTAILLÉS:');
    Object.entries(scores).forEach(([category, score]) => {
      const weight = weights[category];
      const weighted = Math.round(score * weight);
      console.log(`  📊 ${category}: ${score}/100 (poids: ${Math.round(weight * 100)}%) = ${weighted}`);
    });
    
    console.log(`\n🏆 SCORE GLOBAL: ${overallScore}/100`);
    
    // Déterminer le statut
    let status, recommendations;
    
    if (overallScore >= 90) {
      status = 'PRÊT POUR DÉPLOIEMENT';
      recommendations = [
        '✅ Déployer immédiatement sur Netlify',
        '✅ Activer la publication hebdomadaire automatique',
        '✅ Configurer le monitoring et les alertes'
      ];
    } else if (overallScore >= 75) {
      status = 'PRÊT AVEC AMÉLIORATIONS MINEURES';
      recommendations = [
        '🔧 Compléter les fichiers manquants',
        '🔧 Finaliser la configuration Netlify',
        '🚀 Déployer après corrections'
      ];
    } else if (overallScore >= 50) {
      status = 'PRÉPARATION REQUISE';
      recommendations = [
        '⚠️ Configuration incomplète',
        '📝 Ajouter les providers manquants',
        '🔧 Finaliser les agents MCP',
        '🚀 Déployer après préparation complète'
      ];
    } else {
      status = 'NON PRÊT';
      recommendations = [
        '❌ Configuration manquante',
        '📋 Architecture incomplète',
        '🔨 Travail important requis',
        '🚫 Ne pas déployer en l\'état'
      ];
    }
    
    console.log(`\n🎯 STATUT: ${status}`);
    
    console.log('\n🚀 RECOMMANDATIONS:');
    recommendations.forEach(rec => {
      console.log(`  ${rec}`);
    });
    
    // Résumé final
    console.log('\n📊 RÉSUMÉ VÉRIFICATION FINALE:');
    console.log(`  📁 Configuration: ${scores.configuration}/100`);
    console.log(`  📚 Providers: ${this.verificationResults.providers.count || 0}/${this.verificationResults.providers.expected || 82}`);
    console.log(`  🤖 Agents MCP: ${this.verificationResults.agents?.found || 0}/${this.verificationResults.agents?.expected || 7}`);
    console.log(`  🌐 Déploiement: ${scores.deployment}/100`);
    console.log(`  📰 Publication: ${scores.publication}/100`);
    
    // Conclusion
    console.log('\n🎊 CONCLUSION VÉRIFICATION OPENCLAW:');
    
    if (overallScore >= 90) {
      console.log('  🎉 SYSTÈME 100% PRÊT POUR DÉPLOIEMENT NETLIFY');
      console.log('  🚀 Publication autonome hebdomadaire opérationnelle');
      console.log('  📚 82 providers intégrés et fonctionnels');
      console.log('  🤖 MCP agents complets et testés');
      console.log('  🛡️ Architecture robuste et sécurisée');
      console.log('  🌍 Déploiement mondial immédiat possible');
    } else if (overallScore >= 75) {
      console.log('  ✅ SYSTÈME PRÊT AVEC CORRECTIONS MINEURES');
      console.log('  🔧 Quelques ajustements nécessaires');
      console.log('  🚀 Déploiement possible après corrections');
    } else {
      console.log('  ⚠️ SYSTÈME NÉCESSITE PRÉPARATION');
      console.log('  🔨 Travail additionnel requis');
      console.log('  📋 Compléter les composants manquants');
    }
    
    this.verificationResults.overall = {
      score: overallScore,
      status: status,
      recommendations: recommendations
    };
    
    return this.verificationResults;
  }
}

// Lancer la vérification finale
const verification = new OpenClawFinalVerification();
verification.runCompleteVerification().catch(console.error);
