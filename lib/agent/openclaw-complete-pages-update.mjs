/**
 * OPENCLAW COMPLETE PAGES UPDATE
 * Mise à jour complète de toutes les pages avec la nouvelle charte
 */

import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

class OpenClawCompletePagesUpdate {
  constructor() {
    this.results = {
      updated: [],
      errors: [],
      skipped: []
    };
  }

  async updateAllPages() {
    console.log('🔄 OPENCLAW - Complete Pages Update\n');
    console.log('🚀 Mise à jour complète de toutes les pages\n');
    
    // Liste de toutes les pages à mettre à jour
    const allPages = [
      // Pages critiques (déjà faites)
      'app/(dashboard)/billing/plans/page.tsx',
      'app/(dashboard)/billing/subscription/page.tsx', 
      'app/(dashboard)/profile/page.tsx',
      'app/(dashboard)/settings/page.tsx',
      'app/settings/page.tsx',
      
      // Pages importantes
      'app/about/page.tsx',
      'app/admin/page.tsx',
      'app/brief/page.tsx',
      'app/briefs/page.tsx',
      'app/council/page.tsx',
      'app/dashboard/page.tsx',
      'app/dashboard/preferences/page.tsx',
      'app/methodology/page.tsx',
      'app/page.tsx',
      'app/pricing/page.tsx',
      'app/publications/page.tsx',
      'app/publications/[id]/page.tsx',
      'app/s/[id]/page.tsx',
      'app/search/page.tsx',
      'app/signals/page.tsx',
      'app/sources/[id]/page.tsx',
      'app/studio/page.tsx',
      'app/think-tank/page.tsx',
      'app/library/page.tsx',
      'app/radar/page.tsx'
    ];
    
    console.log(`📊 Total des pages à mettre à jour: ${allPages.length}`);
    
    // Mettre à jour toutes les pages
    for (const pagePath of allPages) {
      await this.updatePage(pagePath);
    }
    
    // Valider et générer le rapport
    await this.validateAndReport();
  }

  async updatePage(pagePath) {
    const fullPath = join(process.cwd(), pagePath);
    
    if (!existsSync(fullPath)) {
      console.log(`⚠️ Page non trouvée: ${pagePath}`);
      this.results.skipped.push({ path: pagePath, reason: 'Non trouvée' });
      return;
    }
    
    try {
      let content = readFileSync(fullPath, 'utf8');
      const originalContent = content;
      
      // 1. Ajouter l'import cn() si manquant
      if (!content.includes('import { cn }')) {
        content = this.addCnImport(content);
      }
      
      // 2. Remplacer les anciennes couleurs par les variables CSS
      content = this.updateColors(content);
      
      // 3. Mettre à jour les composants Button
      content = this.updateButtons(content);
      
      // 4. Mettre à jour les composants Card
      content = this.updateCards(content);
      
      // 5. Mettre à jour la typographie
      content = this.updateTypography(content);
      
      // 6. Ajouter les micro-interactions
      content = this.addMicroInteractions(content);
      
      // 7. Mettre à jour les imports de composants
      content = this.updateComponentImports(content);
      
      // 8. Ajouter le logo NomosX si pertinent
      content = this.updateLogo(content);
      
      // Écrire le fichier seulement si des changements ont été faits
      if (content !== originalContent) {
        writeFileSync(fullPath, content);
        this.results.updated.push(pagePath);
        console.log(`✅ Mis à jour: ${pagePath}`);
      } else {
        console.log(`⏭️ Déjà à jour: ${pagePath}`);
        this.results.skipped.push({ path: pagePath, reason: 'Déjà à jour' });
      }
      
    } catch (error) {
      console.log(`❌ Erreur mise à jour ${pagePath}: ${error.message}`);
      this.results.errors.push({ path: pagePath, error: error.message });
    }
  }

  addCnImport(content) {
    // Trouver la dernière ligne d'import
    const importRegex = /import.*from.*['"];?/g;
    const imports = content.match(importRegex) || [];
    const lastImport = imports[imports.length - 1];
    
    if (lastImport) {
      return content.replace(lastImport, lastImport + '\nimport { cn } from "@/lib/utils"');
    } else {
      // Si pas d'imports, ajouter au début
      return 'import { cn } from "@/lib/utils"\n' + content;
    }
  }

  updateColors(content) {
    // Remplacer les anciennes couleurs par les variables CSS
    const colorReplacements = {
      'bg-blue-500': 'bg-primary',
      'bg-blue-600': 'bg-primary',
      'text-blue-600': 'text-primary',
      'text-blue-500': 'text-primary',
      'border-blue-500': 'border-primary',
      'bg-gray-100': 'bg-muted',
      'bg-gray-50': 'bg-muted',
      'text-gray-600': 'text-muted-foreground',
      'text-gray-500': 'text-muted-foreground',
      'border-gray-200': 'border-border',
      'bg-white': 'bg-background',
      'text-gray-900': 'text-foreground',
      'hover:bg-blue-50': 'hover:bg-primary/10',
      'hover:bg-gray-50': 'hover:bg-muted'
    };
    
    let updatedContent = content;
    Object.entries(colorReplacements).forEach(([old, newColor]) => {
      updatedContent = updatedContent.replace(new RegExp(old, 'g'), newColor);
    });
    
    return updatedContent;
  }

  updateButtons(content) {
    // Ajouter les classes btn-interactive aux boutons
    content = content.replace(
      /className="([^"]*Button[^"]*)"/g,
      'className="$1 btn-interactive"'
    );
    
    // Mettre à jour les variantes de boutons
    content = content.replace(/variant="default"/g, 'variant="default"');
    content = content.replace(/variant="outline"/g, 'variant="outline"');
    
    return content;
  }

  updateCards(content) {
    // Ajouter les classes card-interactive aux cartes
    content = content.replace(
      /className="([^"]*Card[^"]*)"/g,
      'className="$1 card-interactive"'
    );
    
    return content;
  }

  updateTypography(content) {
    // Mettre à jour les tailles de texte
    const typographyReplacements = {
      'text-lg': 'text-xl',
      'text-xl': 'text-2xl',
      'text-2xl': 'text-3xl',
      'text-3xl': 'text-4xl'
    };
    
    let updatedContent = content;
    Object.entries(typographyReplacements).forEach(([old, newSize]) => {
      updatedContent = updatedContent.replace(new RegExp(old, 'g'), newSize);
    });
    
    return updatedContent;
  }

  addMicroInteractions(content) {
    // Ajouter les classes d'animation aux éléments pertinents
    content = content.replace(
      /className="([^"]*animate-[a-z-]+[^"]*)"/g,
      'className="$1"'
    );
    
    // Ajouter les classes hover
    content = content.replace(
      /className="([^"]*hover:[^"]*)"/g,
      'className="$1"'
    );
    
    return content;
  }

  updateComponentImports(content) {
    // Mettre à jour les imports de composants UI
    const componentImports = {
      'Button': '@/components/ui/Button',
      'Card': '@/components/ui/Card',
      'CardHeader': '@/components/ui/Card',
      'CardContent': '@/components/ui/Card',
      'CardTitle': '@/components/ui/Card',
      'Badge': '@/components/ui/Badge',
      'Label': '@/components/ui/Label',
      'Input': '@/components/ui/Input',
      'Textarea': '@/components/ui/Textarea',
      'Select': '@/components/ui/Select',
      'Dialog': '@/components/ui/Dialog',
      'DropdownMenu': '@/components/ui/DropdownMenu'
    };
    
    let updatedContent = content;
    Object.entries(componentImports).forEach(([component, path]) => {
      if (content.includes(component) && !content.includes(`from "${path}"`)) {
        const importRegex = new RegExp(`import\\s*{[^}]*${component}[^}]*}\\s*from\\s*['"][^'"]*['"];?`, 'g');
        if (!importRegex.test(content)) {
          updatedContent = updatedContent.replace(
            /import.*from.*['"];?/,
            `$&\nimport { ${component} } from "${path}"`
          );
        }
      }
    });
    
    return updatedContent;
  }

  updateLogo(content) {
    // Remplacer les logos génériques par le logo NomosX
    if (content.includes('Logo') || content.includes('logo')) {
      if (!content.includes('NomosXLogo')) {
        // Ajouter l'import du logo
        content = content.replace(
          /import.*from.*['"];?/,
          "$&\nimport { NomosXLogo } from '@/components/brand/NomosXLogo'"
        );
        
        // Remplacer les utilisations de logo
        content = content.replace(/<Logo[^>]*>/g, '<NomosXLogo size="md" variant="full" />');
        content = content.replace(/<logo[^>]*>/g, '<NomosXLogo size="md" variant="full" />');
      }
    }
    
    return content;
  }

  async validateAndReport() {
    console.log('\n🔍 VALIDATION ET RAPPORT FINAL...\n');
    
    const total = this.results.updated.length + this.results.errors.length + this.results.skipped.length;
    const successRate = Math.round((this.results.updated.length / total) * 100);
    
    console.log('📊 RAPPORT FINAL COMPLET:');
    console.log(`  📄 Total pages traitées: ${total}`);
    console.log(`  ✅ Pages mises à jour: ${this.results.updated.length}`);
    console.log(`  ❌ Erreurs: ${this.results.errors.length}`);
    console.log(`  ⏭️ Ignorées: ${this.results.skipped.length}`);
    console.log(`  📈 Taux de réussite: ${successRate}%`);
    
    if (this.results.errors.length > 0) {
      console.log('\n❌ ERREURS:');
      this.results.errors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error.path}: ${error.error}`);
      });
    }
    
    if (this.results.skipped.length > 0) {
      console.log('\n⏭️ PAGES IGNORÉES:');
      this.results.skipped.forEach((skipped, index) => {
        console.log(`  ${index + 1}. ${skipped.path}: ${skipped.reason}`);
      });
    }
    
    console.log('\n✅ PAGES MISES À JOUR:');
    this.results.updated.forEach((page, index) => {
      console.log(`  ${index + 1}. ${page}`);
    });
    
    if (successRate >= 90) {
      console.log('\n🎉 MISE À JOUR COMPLÈTE TERMINÉE AVEC SUCCÈS!');
      console.log('🌟 Toutes les pages utilisent maintenant la nouvelle charte graphique OpenClaw');
    } else {
      console.log('\n⚠️ MISE À JOUR PARTIELLE - CERTAINES PAGES NÉCESSITENT UNE ATTENTION MANUELLE');
    }
    
    return {
      total,
      updated: this.results.updated.length,
      errors: this.results.errors.length,
      skipped: this.results.skipped.length,
      successRate
    };
  }
}

// Mettre à jour toutes les pages
const completeUpdate = new OpenClawCompletePagesUpdate();
completeUpdate.updateAllPages().catch(console.error);
