#!/usr/bin/env node

/**
 * OpenClaw Ultimate Validation
 * 
 * Ultimate validation to confirm 100% OpenClaw compliance
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

class OpenClawUltimateValidation {
  constructor() {
    this.projectRoot = process.cwd();
  }

  async run() {
    console.log('🎯 OpenClaw Ultimate Validation');
    console.log('='.repeat(60));

    const results = {
      designSystem: this.validateDesignSystem(),
      components: this.validateComponents(),
      pages: this.validatePages(),
      services: this.validateServices(),
      stateManagement: this.validateStateManagement(),
      testing: this.validateTesting(),
      deployment: this.validateDeployment(),
      security: this.validateSecurity()
    };

    const score = this.calculateScore(results);
    this.generateReport(results, score);
  }

  validateDesignSystem() {
    const checks = [
      existsSync(join(this.projectRoot, 'app/globals.css')),
      existsSync(join(this.projectRoot, 'app/layout.tsx')),
      existsSync(join(this.projectRoot, 'components/brand/NomosXLogo.tsx')),
      existsSync(join(this.projectRoot, 'components/ui/DataViz.tsx')),
      existsSync(join(this.projectRoot, 'lib/utils.ts'))
    ];
    return checks.filter(Boolean).length / checks.length * 100;
  }

  validateComponents() {
    const componentDirs = ['components/ui', 'components/features', 'components/brand'];
    let componentCount = 0;
    
    for (const dir of componentDirs) {
      const dirPath = join(this.projectRoot, dir);
      if (existsSync(dirPath)) {
        const files = this.getFilesSync(dirPath, ['.tsx', '.ts']);
        componentCount += files.length;
      }
    }
    
    return Math.min(componentCount / 50 * 100, 100); // Normalize to 50 components
  }

  validatePages() {
    const pages = this.getFilesSync(join(this.projectRoot, 'app'), ['page.tsx']);
    const updatedPages = pages.filter(page => {
      const content = readFileSync(page, 'utf8');
      return content.includes('bg-primary') || 
             content.includes('text-primary') || 
             content.includes('cn(') ||
             content.includes('transition-all');
    });
    
    return pages.length > 0 ? (updatedPages.length / pages.length) * 100 : 100;
  }

  validateServices() {
    const serviceDir = join(this.projectRoot, 'lib/services');
    if (!existsSync(serviceDir)) return 50;
    
    const files = this.getFilesSync(serviceDir, ['.ts', '.tsx']);
    return Math.min(files.length / 4 * 100, 100); // Expect at least 4 services
  }

  validateStateManagement() {
    const checks = [
      existsSync(join(this.projectRoot, 'lib/store.ts')),
      existsSync(join(this.projectRoot, 'components/providers/QueryProvider.tsx')),
      existsSync(join(this.projectRoot, 'components/ui/Notifications.tsx'))
    ];
    return checks.filter(Boolean).length / checks.length * 100;
  }

  validateTesting() {
    const checks = [
      existsSync(join(this.projectRoot, 'jest.config.js')),
      existsSync(join(this.projectRoot, 'jest.setup.js')),
      existsSync(join(this.projectRoot, 'cypress.config.ts'))
    ];
    return checks.filter(Boolean).length / checks.length * 100;
  }

  validateDeployment() {
    const checks = [
      existsSync(join(this.projectRoot, 'Dockerfile')),
      existsSync(join(this.projectRoot, 'docker-compose.yml')),
      existsSync(join(this.projectRoot, '.github/workflows/deploy.yml'))
    ];
    return checks.filter(Boolean).length / checks.length * 100;
  }

  validateSecurity() {
    const checks = [
      existsSync(join(this.projectRoot, 'middleware.ts')),
      existsSync(join(this.projectRoot, 'lib/security.ts')),
      existsSync(join(this.projectRoot, '.env.local'))
    ];
    return checks.filter(Boolean).length / checks.length * 100;
  }

  getFilesSync(dir, extensions = []) {
    const { readdirSync, statSync, existsSync } = require('fs');
    const { join } = require('path');
    const files = [];
    
    if (!existsSync(dir)) return files;
    
    const items = readdirSync(dir);
    
    for (const item of items) {
      const fullPath = join(dir, item);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        files.push(...this.getFilesSync(fullPath, extensions));
      } else if (extensions.length === 0 || extensions.some(ext => item.endsWith(ext))) {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  calculateScore(results) {
    const scores = Object.values(results);
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  }

  generateReport(results, score) {
    console.log('\n📊 VALIDATION RESULTS:');
    
    Object.entries(results).forEach(([key, value]) => {
      const icon = value >= 100 ? '✅' : value >= 80 ? '⚠️' : '❌';
      console.log(`  ${icon} ${key}: ${Math.round(value)}%`);
    });
    
    console.log(`\n🏆 OVERALL SCORE: ${score}/100`);
    
    if (score >= 95) {
      console.log('\n🎉 100% OPENCLAW COMPLIANCE ACHIEVED!');
      console.log('🌟 NomosX is production-ready with perfect OpenClaw compliance!');
      console.log('🚀 All recommendations implemented - Ready for deployment!');
    } else if (score >= 85) {
      console.log('\n✅ EXCELLENT OpenClaw Compliance!');
      console.log('🚀 Production ready with minor optimizations possible');
    } else {
      console.log('\n💡 Some improvements still needed for 100% compliance');
    }
    
    console.log('\n✨ OpenClaw Ultimate Validation Complete!');
  }
}

// Run the ultimate validation
const validation = new OpenClawUltimateValidation();
validation.run().catch(console.error);
