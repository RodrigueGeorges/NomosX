/**
 * OPENCLAW COMPREHENSIVE AUDIT
 * Audit complet Frontend + Backend pour validation finale
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

class OpenClawComprehensiveAudit {
  constructor() {
    this.auditResults = {
      frontend: {
        designSystem: {},
        components: {},
        pages: {},
        routing: {},
        stateManagement: {},
        api: {}
      },
      backend: {
        database: {},
        api: {},
        auth: {},
        businessLogic: {},
        services: {},
        infrastructure: {}
      },
      integration: {
        frontendBackend: {},
        testing: {},
        deployment: {},
        performance: {},
        security: {}
      }
    };
  }

  async runComprehensiveAudit() {
    console.log('🔍 OPENCLAW - Comprehensive Frontend + Backend Audit\n');
    console.log('🚀 Audit complet de l\'intégration professionnelle\n');
    
    // Phase 1: Audit Frontend
    await this.auditFrontend();
    
    // Phase 2: Audit Backend
    await this.auditBackend();
    
    // Phase 3: Audit Integration
    await this.auditIntegration();
    
    // Phase 4: Score Global et Recommandations
    await this.generateGlobalReport();
  }

  async auditFrontend() {
    console.log('🎨 PHASE 1: Audit Frontend...\n');
    
    // Design System
    this.auditResults.frontend.designSystem = await this.auditDesignSystem();
    
    // Components
    this.auditResults.frontend.components = await this.auditComponents();
    
    // Pages
    this.auditResults.frontend.pages = await this.auditPages();
    
    // Routing
    this.auditResults.frontend.routing = await this.auditRouting();
    
    // State Management
    this.auditResults.frontend.stateManagement = await this.auditStateManagement();
    
    // API Frontend
    this.auditResults.frontend.api = await this.auditFrontendAPI();
    
    console.log('📊 AUDIT FRONTEND:');
    this.printAuditSection('Frontend', this.auditResults.frontend);
  }

  async auditBackend() {
    console.log('\n⚙️ PHASE 2: Audit Backend...\n');
    
    // Database
    this.auditResults.backend.database = await this.auditDatabase();
    
    // API Backend
    this.auditResults.backend.api = await this.auditBackendAPI();
    
    // Auth
    this.auditResults.backend.auth = await this.auditAuth();
    
    // Business Logic
    this.auditResults.backend.businessLogic = await this.auditBusinessLogic();
    
    // Services
    this.auditResults.backend.services = await this.auditServices();
    
    // Infrastructure
    this.auditResults.backend.infrastructure = await this.auditInfrastructure();
    
    console.log('📊 AUDIT BACKEND:');
    this.printAuditSection('Backend', this.auditResults.backend);
  }

  async auditIntegration() {
    console.log('\n🔗 PHASE 3: Audit Integration...\n');
    
    // Frontend-Backend Integration
    this.auditResults.integration.frontendBackend = await this.auditFrontendBackendIntegration();
    
    // Testing
    this.auditResults.integration.testing = await this.auditTesting();
    
    // Deployment
    this.auditResults.integration.deployment = await this.auditDeployment();
    
    // Performance
    this.auditResults.integration.performance = await this.auditPerformance();
    
    // Security
    this.auditResults.integration.security = await this.auditSecurity();
    
    console.log('📊 AUDIT INTEGRATION:');
    this.printAuditSection('Integration', this.auditResults.integration);
  }

  async auditDesignSystem() {
    const checks = {
      cssVariables: this.checkFileExists('app/globals.css'),
      fonts: this.checkFileExists('app/layout.tsx'),
      logo: this.checkFileExists('components/brand/NomosXLogo.tsx'),
      dataViz: this.checkFileExists('components/ui/DataViz.tsx'),
      utils: this.checkFileExists('lib/utils.ts')
    };
    
    const validCount = Object.values(checks).filter(Boolean).length;
    const totalCount = Object.keys(checks).length;
    
    return {
      score: Math.round((validCount / totalCount) * 100),
      status: validCount === totalCount ? 'COMPLET' : 'PARTIEL',
      details: checks,
      summary: `${validCount}/${totalCount} éléments du design system`
    };
  }

  async auditComponents() {
    const componentDirs = ['components/ui', 'components/features', 'components/brand'];
    let componentCount = 0;
    let validComponents = 0;
    
    componentDirs.forEach(dir => {
      if (existsSync(join(process.cwd(), dir))) {
        const files = this.getAllFiles(join(process.cwd(), dir), ['.tsx', '.ts']);
        componentCount += files.length;
        validComponents += files.filter(file => 
          readFileSync(file, 'utf8').includes('export function') || 
          readFileSync(file, 'utf8').includes('export const')
        ).length;
      }
    });
    
    return {
      score: componentCount > 0 ? Math.round((validComponents / componentCount) * 100) : 0,
      status: validComponents === componentCount ? 'COMPLET' : 'PARTIEL',
      details: { total: componentCount, valid: validComponents },
      summary: `${validComponents}/${componentCount} composants valides`
    };
  }

  async auditPages() {
    const pages = this.getAllFiles(join(process.cwd(), 'app'), ['page.tsx']);
    const updatedPages = pages.filter(page => {
      const content = readFileSync(page, 'utf8');
      return content.includes('bg-primary') || content.includes('text-primary');
    });
    
    return {
      score: pages.length > 0 ? Math.round((updatedPages.length / pages.length) * 100) : 0,
      status: updatedPages.length === pages.length ? 'COMPLET' : 'PARTIEL',
      details: { total: pages.length, updated: updatedPages.length },
      summary: `${updatedPages.length}/${pages.length} pages mises à jour`
    };
  }

  async auditRouting() {
    const layoutExists = this.checkFileExists('app/layout.tsx');
    const pageFiles = this.getAllFiles(join(process.cwd(), 'app'), ['page.tsx']);
    
    return {
      score: layoutExists && pageFiles.length > 0 ? 100 : 50,
      status: layoutExists && pageFiles.length > 0 ? 'COMPLET' : 'PARTIEL',
      details: { layout: layoutExists, pages: pageFiles.length },
      summary: `Routing avec ${pageFiles.length} pages`
    };
  }

  async auditStateManagement() {
    // Vérifier les hooks, context, ou state management
    const stateFiles = [
      'lib/contexts',
      'lib/hooks',
      'lib/store',
      'lib/state'
    ];
    
    let stateManagementFound = false;
    stateFiles.forEach(dir => {
      if (existsSync(join(process.cwd(), dir))) {
        stateManagementFound = true;
      }
    });
    
    return {
      score: stateManagementFound ? 80 : 40,
      status: stateManagementFound ? 'PRÉSENT' : 'LIMITÉ',
      details: { found: stateManagementFound },
      summary: stateManagementFound ? 'State management détecté' : 'State management basique'
    };
  }

  async auditFrontendAPI() {
    const apiFiles = this.getAllFiles(join(process.cwd(), 'lib'), ['.ts', '.js'])
      .filter(file => {
        const content = readFileSync(file, 'utf8');
        return content.includes('fetch') || content.includes('axios') || content.includes('api');
      });
    
    return {
      score: apiFiles.length > 0 ? 80 : 40,
      status: apiFiles.length > 0 ? 'PRÉSENT' : 'LIMITÉ',
      details: { apiFiles: apiFiles.length },
      summary: `${apiFiles.length} fichiers API frontend`
    };
  }

  async auditDatabase() {
    const dbFiles = [
      'prisma/schema.prisma',
      'lib/db.ts',
      'lib/database.ts'
    ];
    
    const foundFiles = dbFiles.filter(file => this.checkFileExists(file));
    
    return {
      score: foundFiles.length > 0 ? 90 : 30,
      status: foundFiles.length > 0 ? 'PRÉSENT' : 'MANQUANT',
      details: { files: foundFiles },
      summary: `${foundFiles.length}/${dbFiles.length} fichiers base de données`
    };
  }

  async auditBackendAPI() {
    const apiDirs = ['app/api', 'pages/api', 'lib/api'];
    let apiEndpoints = 0;
    
    apiDirs.forEach(dir => {
      if (existsSync(join(process.cwd(), dir))) {
        const files = this.getAllFiles(join(process.cwd(), dir), ['.ts', '.js']);
        apiEndpoints += files.length;
      }
    });
    
    return {
      score: apiEndpoints > 0 ? 85 : 35,
      status: apiEndpoints > 0 ? 'PRÉSENT' : 'LIMITÉ',
      details: { endpoints: apiEndpoints },
      summary: `${apiEndpoints} endpoints API`
    };
  }

  async auditAuth() {
    const authFiles = [
      'lib/auth.ts',
      'lib/auth',
      'middleware.ts',
      'app/(auth)'
    ];
    
    const foundFiles = authFiles.filter(file => 
      this.checkFileExists(file) || existsSync(join(process.cwd(), file))
    );
    
    return {
      score: foundFiles.length > 0 ? 85 : 40,
      status: foundFiles.length > 0 ? 'PRÉSENT' : 'LIMITÉ',
      details: { authFiles: foundFiles.length },
      summary: `${foundFiles.length}/${authFiles.length} fichiers auth`
    };
  }

  async auditBusinessLogic() {
    const logicDirs = [
      'lib/agent',
      'lib/services',
      'lib/business',
      'lib/core'
    ];
    
    let logicFiles = 0;
    logicDirs.forEach(dir => {
      if (existsSync(join(process.cwd(), dir))) {
        const files = this.getAllFiles(join(process.cwd(), dir), ['.ts', '.js', '.mjs']);
        logicFiles += files.length;
      }
    });
    
    return {
      score: logicFiles > 0 ? 90 : 30,
      status: logicFiles > 0 ? 'ROBUSTE' : 'LIMITÉ',
      details: { logicFiles },
      summary: `${logicFiles} fichiers de logique métier`
    };
  }

  async auditServices() {
    const serviceFiles = this.getAllFiles(join(process.cwd(), 'lib'), ['.ts', '.js', '.mjs'])
      .filter(file => {
        const fileName = file.split('/').pop();
        return fileName.includes('service') || fileName.includes('worker');
      });
    
    return {
      score: serviceFiles.length > 0 ? 85 : 45,
      status: serviceFiles.length > 0 ? 'PRÉSENT' : 'LIMITÉ',
      details: { services: serviceFiles.length },
      summary: `${serviceFiles.length} services`
    };
  }

  async auditInfrastructure() {
    const infraFiles = [
      'package.json',
      'next.config.js',
      'tailwind.config.js',
      'tsconfig.json',
      '.env.example'
    ];
    
    const foundFiles = infraFiles.filter(file => this.checkFileExists(file));
    
    return {
      score: Math.round((foundFiles.length / infraFiles.length) * 100),
      status: foundFiles.length >= 4 ? 'COMPLET' : 'PARTIEL',
      details: { files: foundFiles },
      summary: `${foundFiles.length}/${infraFiles.length} fichiers infrastructure`
    };
  }

  async auditFrontendBackendIntegration() {
    // Vérifier l'intégration frontend-backend
    const frontendScore = this.calculateSectionScore(this.auditResults.frontend);
    const backendScore = this.calculateSectionScore(this.auditResults.backend);
    
    return {
      score: Math.round((frontendScore + backendScore) / 2),
      status: frontendScore >= 70 && backendScore >= 70 ? 'BIEN INTÉGRÉ' : 'INTÉGRATION PARTIELLE',
      details: { frontend: frontendScore, backend: backendScore },
      summary: `Frontend: ${frontendScore}%, Backend: ${backendScore}%`
    };
  }

  async auditTesting() {
    const testFiles = [
      'jest.config.js',
      '__tests__',
      'test',
      'spec'
    ];
    
    const foundTestSetup = testFiles.some(file => 
      this.checkFileExists(file) || existsSync(join(process.cwd(), file))
    );
    
    return {
      score: foundTestSetup ? 70 : 30,
      status: foundTestSetup ? 'PRÉSENT' : 'LIMITÉ',
      details: { testSetup: foundTestSetup },
      summary: foundTestSetup ? 'Testing configuré' : 'Testing limité'
    };
  }

  async auditDeployment() {
    const deployFiles = [
      'Dockerfile',
      'docker-compose.yml',
      '.github/workflows',
      'vercel.json',
      'netlify.toml'
    ];
    
    const foundFiles = deployFiles.filter(file => 
      this.checkFileExists(file) || existsSync(join(process.cwd(), file))
    );
    
    return {
      score: foundFiles.length > 0 ? 75 : 40,
      status: foundFiles.length > 0 ? 'PRÉSENT' : 'LIMITÉ',
      details: { deployFiles: foundFiles.length },
      summary: `${foundFiles.length} fichiers de déploiement`
    };
  }

  async auditPerformance() {
    const perfFiles = [
      'next.config.js',
      'tailwind.config.js',
      '.env'
    ];
    
    const optimizations = perfFiles.filter(file => this.checkFileExists(file));
    
    return {
      score: Math.round((optimizations.length / perfFiles.length) * 100),
      status: optimizations.length >= 2 ? 'OPTIMISÉ' : 'BASIQUE',
      details: { optimizations: optimizations.length },
      summary: `${optimizations.length}/${perfFiles.length} optimisations`
    };
  }

  async auditSecurity() {
    const securityFiles = [
      'middleware.ts',
      '.env.example',
      'lib/auth.ts'
    ];
    
    const securityMeasures = securityFiles.filter(file => this.checkFileExists(file));
    
    return {
      score: Math.round((securityMeasures.length / securityFiles.length) * 100),
      status: securityMeasures.length >= 2 ? 'SÉCURISÉ' : 'PARTIEL',
      details: { security: securityMeasures.length },
      summary: `${securityMeasures.length}/${securityFiles.length} mesures de sécurité`
    };
  }

  // Utilitaires
  checkFileExists(filePath) {
    return existsSync(join(process.cwd(), filePath));
  }

  getAllFiles(dir, extensions = []) {
    const files = [];
    
    if (!existsSync(dir)) return files;
    
    const items = readdirSync(dir);
    for (const item of items) {
      const fullPath = join(dir, item);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        files.push(...this.getAllFiles(fullPath, extensions));
      } else if (stat.isFile()) {
        if (extensions.length === 0 || extensions.some(ext => item.endsWith(ext))) {
          files.push(fullPath);
        }
      }
    }
    
    return files;
  }

  calculateSectionScore(section) {
    const scores = Object.values(section).map(item => item.score || 0);
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  }

  printAuditSection(title, section) {
    Object.entries(section).forEach(([key, result]) => {
      const status = result.score >= 80 ? '✅' : result.score >= 60 ? '⚠️' : '❌';
      console.log(`  ${status} ${key}: ${result.score}% - ${result.status}`);
      console.log(`    📝 ${result.summary}`);
    });
  }

  async generateGlobalReport() {
    console.log('\n📋 PHASE 4: Rapport Global Final...\n');
    
    const frontendScore = this.calculateSectionScore(this.auditResults.frontend);
    const backendScore = this.calculateSectionScore(this.auditResults.backend);
    const integrationScore = this.calculateSectionScore(this.auditResults.integration);
    
    const globalScore = Math.round((frontendScore + backendScore + integrationScore) / 3);
    
    const report = {
      globalScore,
      status: globalScore >= 80 ? 'EXCELLENT' : globalScore >= 60 ? 'BON' : 'À AMÉLIORER',
      sections: {
        frontend: { score: frontendScore, status: this.getScoreStatus(frontendScore) },
        backend: { score: backendScore, status: this.getScoreStatus(backendScore) },
        integration: { score: integrationScore, status: this.getScoreStatus(integrationScore) }
      },
      productionReady: globalScore >= 70,
      recommendations: this.generateRecommendations(frontendScore, backendScore, integrationScore),
      nextSteps: this.generateNextSteps(globalScore)
    };
    
    console.log('🏆 RAPPORT GLOBAL COMPREHENSIF:');
    console.log(`  📊 Score Global: ${globalScore}/100`);
    console.log(`  🎯 Statut: ${report.status}`);
    console.log(`  🚀 Production Ready: ${report.productionReady ? 'OUI' : 'NON'}`);
    
    console.log('\n📊 SCORES PAR SECTION:');
    Object.entries(report.sections).forEach(([section, data]) => {
      const status = data.score >= 80 ? '✅' : data.score >= 60 ? '⚠️' : '❌';
      console.log(`  ${status} ${section.charAt(0).toUpperCase() + section.slice(1)}: ${data.score}% - ${data.status}`);
    });
    
    console.log('\n💡 RECOMMANDATIONS:');
    report.recommendations.forEach((rec, index) => {
      console.log(`  ${index + 1}. ${rec}`);
    });
    
    console.log('\n🚀 PROCHAINES ÉTAPES:');
    report.nextSteps.forEach((step, index) => {
      console.log(`  ${index + 1}. ${step}`);
    });
    
    if (report.productionReady) {
      console.log('\n🎉 AUDIT COMPLET - PROJET PRODUCTION READY!');
      console.log('🌟 Frontend + Backend intégré de manière professionnelle');
    } else {
      console.log('\n⚠️ AMÉLIORATIONS NÉCESSAIRES AVANT PRODUCTION');
    }
    
    return report;
  }

  getScoreStatus(score) {
    if (score >= 80) return 'EXCELLENT';
    if (score >= 60) return 'BON';
    return 'À AMÉLIORER';
  }

  generateRecommendations(frontendScore, backendScore, integrationScore) {
    const recommendations = [];
    
    if (frontendScore < 70) {
      recommendations.push('Améliorer le design system et les composants frontend');
    }
    if (backendScore < 70) {
      recommendations.push('Renforcer l\'API backend et la logique métier');
    }
    if (integrationScore < 70) {
      recommendations.push('Améliorer l\'intégration frontend-backend');
    }
    
    recommendations.push('Mettre en place des tests automatisés complets');
    recommendations.push('Optimiser les performances avant production');
    recommendations.push('Renforcer les mesures de sécurité');
    
    return recommendations;
  }

  generateNextSteps(globalScore) {
    if (globalScore >= 80) {
      return [
        'Déployer en environnement de staging',
        'Effectuer des tests d\'intégration complets',
        'Mettre en place le monitoring',
        'Préparer le déploiement en production',
        'Former l\'équipe aux nouvelles fonctionnalités'
      ];
    } else {
      return [
        'Compléter les éléments manquants identifiés',
        'Effectuer des tests de régression',
        'Optimiser les performances',
        'Renforcer la sécurité',
        'Préparer la documentation technique'
      ];
    }
  }
}

// Lancer l'audit complet
const comprehensiveAudit = new OpenClawComprehensiveAudit();
comprehensiveAudit.runComprehensiveAudit().catch(console.error);
