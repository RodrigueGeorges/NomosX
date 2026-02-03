/**
 * OPENCLAW PAGES ANALYSIS & UPDATE
 * Analyse complète des pages et mise à jour avec la nouvelle charte
 */

import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { readdirSync } from 'fs';

class OpenClawPagesAnalysis {
  constructor() {
    this.pages = {};
    this.updates = {};
    this.results = {};
  }

  async analyzeAndUpdatePages() {
    console.log('📄 OPENCLAW - Pages Analysis & Update\n');
    console.log('🔍 Analyse complète des pages et mise à jour charte\n');
    
    // Phase 1: Scanner toutes les pages
    await this.scanAllPages();
    
    // Phase 2: Analyser l'utilisation actuelle
    await this.analyzeCurrentUsage();
    
    // Phase 3: Identifier les pages à mettre à jour
    await this.identifyPagesToUpdate();
    
    // Phase 4: Mettre à jour les pages critiques
    await this.updateCriticalPages();
    
    // Phase 5: Valider les mises à jour
    await this.validateUpdates();
    
    // Phase 6: Rapport final
    await this.generateFinalReport();
  }

  async scanAllPages() {
    console.log('📁 PHASE 1: Scan de toutes les pages...\n');
    
    const appDir = join(process.cwd(), 'app');
    const pageFiles = await this.findPageFiles(appDir);
    
    console.log(`📊 Pages trouvées: ${pageFiles.length}`);
    
    pageFiles.forEach((page, index) => {
      console.log(`  ${index + 1}. ${page.path}`);
      console.log(`     📝 Type: ${page.type}`);
      console.log(`     🎯 Route: ${page.route}`);
    });
    
    this.pages.all = pageFiles;
  }

  async findPageFiles(dir, baseRoute = '') {
    const files = [];
    const { readdirSync, statSync } = await import('fs');
    const items = readdirSync(dir);
    
    for (const item of items) {
      const fullPath = join(dir, item);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Ignorer les dossiers qui ne sont pas des routes
        if (!item.startsWith('.') && item !== 'node_modules' && item !== '.next') {
          files.push(...await this.findPageFiles(fullPath, `${baseRoute}/${item}`));
        }
      } else if (item === 'page.tsx' || item === 'page.js') {
        const route = baseRoute === '' ? '/' : baseRoute;
        files.push({
          path: fullPath,
          relativePath: fullPath.replace(process.cwd(), ''),
          route: route,
          type: this.getPageType(fullPath),
          directory: dir.replace(process.cwd(), '')
        });
      }
    }
    
    return files;
  }

  getPageType(filePath) {
    if (filePath.includes('(dashboard)')) return 'dashboard';
    if (filePath.includes('(auth)')) return 'auth';
    if (filePath.includes('admin')) return 'admin';
    if (filePath.includes('api')) return 'api';
    return 'public';
  }

  async analyzeCurrentUsage() {
    console.log('\n📋 PHASE 2: Analyse de l\'utilisation actuelle...\n');
    
    const analysis = {
      total: this.pages.all.length,
      byType: {},
      usingOldColors: [],
      usingOldComponents: [],
      usingOldTypography: [],
      needsUpdate: []
    };
    
    this.pages.all.forEach(page => {
      // Compter par type
      if (!analysis.byType[page.type]) {
        analysis.byType[page.type] = [];
      }
      analysis.byType[page.type].push(page);
      
      // Analyser le contenu
      try {
        const content = readFileSync(page.path, 'utf8');
        
        // Vérifier l'utilisation des anciennes couleurs
        if (content.includes('bg-blue-') || content.includes('text-blue-')) {
          analysis.usingOldColors.push(page);
        }
        
        // Vérifier l'utilisation des anciens composants
        if (content.includes('className="') && !content.includes('cn(')) {
          analysis.usingOldComponents.push(page);
        }
        
        // Vérifier l'utilisation de l'ancienne typographie
        if (content.includes('text-lg') && !content.includes('text-2xl')) {
          analysis.usingOldTypography.push(page);
        }
        
        // Déterminer si la page a besoin d'être mise à jour
        const needsUpdate = analysis.usingOldColors.includes(page) || 
                           analysis.usingOldComponents.includes(page) || 
                           analysis.usingOldTypography.includes(page);
        
        if (needsUpdate) {
          analysis.needsUpdate.push(page);
        }
        
      } catch (error) {
        console.warn(`⚠️ Erreur lecture ${page.path}: ${error.message}`);
      }
    });
    
    console.log('📊 ANALYSE PAR TYPE:');
    Object.entries(analysis.byType).forEach(([type, pages]) => {
      console.log(`  📂 ${type}: ${pages.length} pages`);
    });
    
    console.log('\n🎨 PAGES UTILISANT ANCIENNES COULEURS:');
    analysis.usingOldColors.forEach((page, index) => {
      console.log(`  ${index + 1}. ${page.relativePath}`);
    });
    
    console.log('\n🧩 PAGES UTILISANT ANCIENS COMPOSANTS:');
    analysis.usingOldComponents.forEach((page, index) => {
      console.log(`  ${index + 1}. ${page.relativePath}`);
    });
    
    console.log('\n📝 PAGES UTILISANT ANCIENNE TYPOGRAPHIE:');
    analysis.usingOldTypography.forEach((page, index) => {
      console.log(`  ${index + 1}. ${page.relativePath}`);
    });
    
    console.log(`\n📈 TOTAL À METTRE À JOUR: ${analysis.needsUpdate.length}/${analysis.total} pages`);
    
    this.pages.analysis = analysis;
  }

  async identifyPagesToUpdate() {
    console.log('\n🎯 PHASE 3: Identification des pages prioritaires...\n');
    
    const priority = {
      critical: [],    // Pages dashboard et billing
      important: [],   // Pages profile et settings
      normal: []       // Autres pages
    };
    
    this.pages.analysis.needsUpdate.forEach(page => {
      if (page.type === 'dashboard' || page.relativePath.includes('billing')) {
        priority.critical.push(page);
      } else if (page.relativePath.includes('profile') || page.relativePath.includes('settings')) {
        priority.important.push(page);
      } else {
        priority.normal.push(page);
      }
    });
    
    console.log('🔴 PAGES CRITIQUES (priorité haute):');
    priority.critical.forEach((page, index) => {
      console.log(`  ${index + 1}. ${page.relativePath}`);
    });
    
    console.log('\n🟡 PAGES IMPORTANTES (priorité moyenne):');
    priority.important.forEach((page, index) => {
      console.log(`  ${index + 1}. ${page.relativePath}`);
    });
    
    console.log('\n🟢 PAGES NORMALES (priorité basse):');
    priority.normal.forEach((page, index) => {
      console.log(`  ${index + 1}. ${page.relativePath}`);
    });
    
    this.pages.priority = priority;
  }

  async updateCriticalPages() {
    console.log('\n🔧 PHASE 4: Mise à jour des pages critiques...\n');
    
    const updates = {
      updated: [],
      errors: [],
      skipped: []
    };
    
    // Mettre à jour les pages critiques en premier
    for (const page of this.pages.priority.critical) {
      try {
        await this.updatePage(page);
        updates.updated.push(page);
        console.log(`✅ Mis à jour: ${page.relativePath}`);
      } catch (error) {
        updates.errors.push({ page, error: error.message });
        console.log(`❌ Erreur mise à jour ${page.relativePath}: ${error.message}`);
      }
    }
    
    // Mettre à jour les pages importantes
    for (const page of this.pages.priority.important) {
      try {
        await this.updatePage(page);
        updates.updated.push(page);
        console.log(`✅ Mis à jour: ${page.relativePath}`);
      } catch (error) {
        updates.errors.push({ page, error: error.message });
        console.log(`❌ Erreur mise à jour ${page.relativePath}: ${error.message}`);
      }
    }
    
    console.log(`\n📊 RÉSULTATS MISE À JOUR:`);
    console.log(`  ✅ Mises à jour: ${updates.updated.length}`);
    console.log(`  ❌ Erreurs: ${updates.errors.length}`);
    console.log(`  ⏭️ Ignorées: ${updates.skipped.length}`);
    
    this.updates = updates;
  }

  async updatePage(page) {
    let content = readFileSync(page.path, 'utf8');
    
    // Remplacer les anciennes couleurs par les variables CSS
    content = content.replace(/bg-blue-500/g, 'bg-primary');
    content = content.replace(/text-blue-600/g, 'text-primary');
    content = content.replace(/border-blue-500/g, 'border-primary');
    content = content.replace(/bg-gray-100/g, 'bg-muted');
    content = content.replace(/text-gray-600/g, 'text-muted-foreground');
    
    // Ajouter l'utilisation du cn() utility si manquant
    if (!content.includes('cn(') && content.includes('className="')) {
      content = content.replace(
        "import { cn } from '@/lib/utils'",
        "import { cn } from '@/lib/utils'"
      );
      
      // Ajouter l'import si manquant
      if (!content.includes('import { cn }')) {
        content = content.replace(
          /import.*from ['"]@\/components\/ui\/['"];?/g,
          "$&\nimport { cn } from '@/lib/utils'"
        );
      }
    }
    
    // Mettre à jour les tailles de typographie
    content = content.replace(/text-lg/g, 'text-xl');
    content = content.replace(/text-xl/g, 'text-2xl');
    
    // Ajouter les classes de micro-interactions si pertinent
    if (content.includes('Button') && !content.includes('btn-interactive')) {
      content = content.replace(
        /className="([^"]*Button[^"]*)"/g,
        'className="$1 btn-interactive"'
      );
    }
    
    if (content.includes('Card') && !content.includes('card-interactive')) {
      content = content.replace(
        /className="([^"]*Card[^"]*)"/g,
        'className="$1 card-interactive"'
      );
    }
    
    writeFileSync(page.path, content);
  }

  async validateUpdates() {
    console.log('\n🔍 PHASE 5: Validation des mises à jour...\n');
    
    const validation = {
      pagesChecked: 0,
      colorsUpdated: 0,
      componentsUpdated: 0,
      typographyUpdated: 0,
      errors: []
    };
    
    this.updates.updated.forEach(page => {
      try {
        const content = readFileSync(page.path, 'utf8');
        validation.pagesChecked++;
        
        if (content.includes('bg-primary') || content.includes('text-primary')) {
          validation.colorsUpdated++;
        }
        
        if (content.includes('cn(')) {
          validation.componentsUpdated++;
        }
        
        if (content.includes('text-2xl') || content.includes('text-xl')) {
          validation.typographyUpdated++;
        }
        
      } catch (error) {
        validation.errors.push({ page: page.relativePath, error: error.message });
      }
    });
    
    console.log('📊 VALIDATION DES MISES À JOUR:');
    console.log(`  📄 Pages vérifiées: ${validation.pagesChecked}`);
    console.log(`  🎨 Couleurs mises à jour: ${validation.colorsUpdated}`);
    console.log(`  🧩 Composants mis à jour: ${validation.componentsUpdated}`);
    console.log(`  📝 Typographie mise à jour: ${validation.typographyUpdated}`);
    console.log(`  ❌ Erreurs: ${validation.errors.length}`);
    
    this.validation = validation;
  }

  async generateFinalReport() {
    console.log('\n📋 PHASE 6: Rapport Final Pages Analysis...\n');
    
    const report = {
      totalPages: this.pages.all.length,
      pagesAnalyzed: this.pages.analysis.total,
      pagesNeedingUpdate: this.pages.analysis.needsUpdate.length,
      pagesUpdated: this.updates.updated.length,
      updateSuccessRate: Math.round((this.updates.updated.length / this.pages.analysis.needsUpdate.length) * 100),
      validationResults: this.validation,
      recommendations: this.generateRecommendations(),
      nextSteps: this.generateNextSteps()
    };
    
    console.log('📊 RAPPORT FINAL PAGES ANALYSIS:');
    console.log(`  📄 Total pages: ${report.totalPages}`);
    console.log(`  🔍 Pages analysées: ${report.pagesAnalyzed}`);
    console.log(`  🎯 Pages à mettre à jour: ${report.pagesNeedingUpdate}`);
    console.log(`  ✅ Pages mises à jour: ${report.pagesUpdated}`);
    console.log(`  📈 Taux de réussite: ${report.updateSuccessRate}%`);
    
    console.log('\n💡 RECOMMANDATIONS:');
    report.recommendations.forEach((rec, index) => {
      console.log(`  ${index + 1}. ${rec}`);
    });
    
    console.log('\n🚀 PROCHAINES ÉTAPES:');
    report.nextSteps.forEach((step, index) => {
      console.log(`  ${index + 1}. ${step}`);
    });
    
    if (report.updateSuccessRate >= 80) {
      console.log('\n🎉 MISE À JOUR DES PAGES TERMINÉE AVEC SUCCÈS!');
      console.log('🌟 Toutes les pages critiques utilisent maintenant la nouvelle charte graphique');
    } else {
      console.log('\n⚠️ MISE À JOUR PARTIELLE - CERTAINES PAGES NÉCESSITENT UNE ATTENTION MANUELLE');
    }
    
    return report;
  }

  generateRecommendations() {
    return [
      'Tester chaque page mise à jour en environnement de développement',
      'Valider le responsive design sur mobile et tablette',
      'Vérifier l\'accessibilité avec les nouvelles classes',
      'Documenter les changements pour l\'équipe de développement',
      'Mettre en place des tests automatisés pour les composants',
      'Créer une documentation de la nouvelle charte graphique'
    ];
  }

  generateNextSteps() {
    return [
      'Déployer les changements en environnement de staging',
      'Effectuer des tests d\'intégration complets',
      'Former l\'équipe à la nouvelle charte graphique',
      'Mettre à jour la documentation utilisateur',
      'Surveiller les performances après déploiement',
      'Planifier la mise à jour des pages restantes (priorité normale)'
    ];
  }
}

// Analyser et mettre à jour toutes les pages
const pagesAnalysis = new OpenClawPagesAnalysis();
pagesAnalysis.analyzeAndUpdatePages().catch(console.error);
