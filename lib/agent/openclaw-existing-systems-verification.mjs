/**
 * OPENCLAW EXISTING SYSTEM VERIFICATION
 * Vérification des systèmes déjà en place pour éviter les doublons
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

class OpenClawExistingSystemVerification {
  constructor() {
    this.existingSystems = {};
    this.verificationResults = {};
    this.recommendations = {};
  }

  async verifyExistingSystems() {
    console.log('🔍 OPENCLAW - Vérification Systèmes Existant\n');
    console.log('🚀 Analyse des systèmes déjà en place pour éviter les doublons\n');
    
    // Phase 1: Vérification authentification
    await this.verifyAuthSystem();
    
    // Phase 2: Vérification billing/monétisation
    await this.verifyBillingSystem();
    
    // Phase 3: Vérification newsletter
    await this.verifyNewsletterSystem();
    
    // Phase 4: Vérification briefs
    await this.verifyBriefsSystem();
    
    // Phase 5: Vérification dashboard
    await this.verifyDashboardSystem();
    
    // Phase 6: Vérification user management
    await this.verifyUserManagement();
    
    // Phase 7: Analyse des dépendances
    await this.verifyDependencies();
    
    // Phase 8: Recommandations optimisées
    await this.generateOptimizedRecommendations();
  }

  async verifyAuthSystem() {
    console.log('🔐 PHASE 1: Vérification Système Authentification...\n');
    
    const authCheck = {
      nextAuth: {
        config: existsSync(join(process.cwd(), 'pages/api/auth/[...nextauth].js')),
        appRouter: existsSync(join(process.cwd(), 'app/api/auth/[...nextauth]/route.ts')),
        client: existsSync(join(process.cwd(), 'lib/auth.ts')) || existsSync(join(process.cwd(), 'lib/auth.js')),
        middleware: existsSync(join(process.cwd(), 'middleware.ts'))
      },
      customAuth: {
        config: existsSync(join(process.cwd(), 'lib/auth/config.js')),
        providers: existsSync(join(process.cwd(), 'lib/auth/providers.js')),
        utils: existsSync(join(process.cwd(), 'lib/auth/utils.js'))
      },
      authComponents: {
        login: existsSync(join(process.cwd(), 'components/auth/LoginForm')),
        register: existsSync(join(process.cwd(), 'components/auth/RegisterForm')),
        profile: existsSync(join(process.cwd(), 'components/auth/Profile'))
      },
      authPages: {
        login: existsSync(join(process.cwd(), 'app/auth/login/page.tsx')),
        register: existsSync(join(process.cwd(), 'app/auth/register/page.tsx')),
        profile: existsSync(join(process.cwd(), 'app/auth/profile/page.tsx'))
      }
    };
    
    console.log('🔐 SYSTÈME AUTHENTIFICATION EXISTANT:');
    
    let authExists = false;
    
    // Vérifier NextAuth
    console.log('\n📱 NextAuth.js:');
    Object.entries(authCheck.nextAuth).forEach(([component, exists]) => {
      const status = exists ? '✅' : '❌';
      console.log(`  ${status} ${component}`);
      if (exists) authExists = true;
    });
    
    // Vérifier auth custom
    console.log('\n🛠️ Auth Custom:');
    Object.entries(authCheck.customAuth).forEach(([component, exists]) => {
      const status = exists ? '✅' : '❌';
      console.log(`  ${status} ${component}`);
      if (exists) authExists = true;
    });
    
    // Vérifier composants auth
    console.log('\n🧩 Composants Auth:');
    Object.entries(authCheck.authComponents).forEach(([component, exists]) => {
      const status = exists ? '✅' : '❌';
      console.log(`  ${status} ${component}`);
      if (exists) authExists = true;
    });
    
    // Vérifier pages auth
    console.log('\n📄 Pages Auth:');
    Object.entries(authCheck.authPages).forEach(([component, exists]) => {
      const status = exists ? '✅' : '❌';
      console.log(`  ${status} ${component}`);
      if (exists) authExists = true;
    });
    
    // Vérifier le contenu si existe
    if (authExists) {
      await this.analyzeAuthContent();
    }
    
    this.existingSystems.auth = {
      exists: authExists,
      details: authCheck,
      type: authCheck.nextAuth.config ? 'NextAuth' : authCheck.customAuth.config ? 'Custom' : 'None'
    };
  }

  async analyzeAuthContent() {
    console.log('\n📋 ANALYSE CONTENU AUTH:');
    
    // Analyser NextAuth config si existe
    const nextAuthConfig = join(process.cwd(), 'pages/api/auth/[...nextauth].js');
    if (existsSync(nextAuthConfig)) {
      try {
        const content = readFileSync(nextAuthConfig, 'utf8');
        const hasProviders = content.includes('providers');
        const hasGoogle = content.includes('google');
        const hasGitHub = content.includes('github');
        const hasEmail = content.includes('email');
        
        console.log('  🔐 NextAuth Configuration:');
        console.log(`    ✅ Providers: ${hasProviders ? 'Oui' : 'Non'}`);
        console.log(`    🔍 Google: ${hasGoogle ? 'Oui' : 'Non'}`);
        console.log(`    🔍 GitHub: ${hasGitHub ? 'Oui' : 'Non'}`);
        console.log(`    📧 Email: ${hasEmail ? 'Oui' : 'Non'}`);
      } catch (error) {
        console.log('  ❌ Erreur lecture NextAuth config');
      }
    }
    
    // Analyser lib/auth.ts si existe
    const libAuth = join(process.cwd(), 'lib/auth.ts');
    if (existsSync(libAuth)) {
      try {
        const content = readFileSync(libAuth, 'utf8');
        const hasHelpers = content.includes('export');
        const hasTypes = content.includes('interface') || content.includes('type');
        
        console.log('  📚 lib/auth.ts:');
        console.log(`    🔧 Helpers: ${hasHelpers ? 'Oui' : 'Non'}`);
        console.log(`    📝 Types: ${hasTypes ? 'Oui' : 'Non'}`);
      } catch (error) {
        console.log('  ❌ Erreur lecture lib/auth.ts');
      }
    }
  }

  async verifyBillingSystem() {
    console.log('\n💰 PHASE 2: Vérification Système Billing...\n');
    
    const billingCheck = {
      stripe: {
        config: existsSync(join(process.cwd(), 'lib/stripe.ts')) || existsSync(join(process.cwd(), 'lib/stripe.js')),
        webhooks: existsSync(join(process.cwd(), 'app/api/stripe/webhook/route.ts')),
        client: existsSync(join(process.cwd(), 'lib/stripe-client.ts'))
      },
      billingComponents: {
        plans: existsSync(join(process.cwd(), 'components/billing/Plans')),
        checkout: existsSync(join(process.cwd(), 'components/billing/Checkout')),
        subscription: existsSync(join(process.cwd(), 'components/billing/Subscription'))
      },
      billingPages: {
        plans: existsSync(join(process.cwd(), 'app/billing/plans/page.tsx')),
        checkout: existsSync(join(process.cwd(), 'app/billing/checkout/page.tsx')),
        success: existsSync(join(process.cwd(), 'app/billing/success/page.tsx'))
      },
      billingTypes: {
        plans: existsSync(join(process.cwd(), 'types/billing.ts')),
        subscription: existsSync(join(process.cwd(), 'types/subscription.ts'))
      }
    };
    
    console.log('💰 SYSTÈME BILLING EXISTANT:');
    
    let billingExists = false;
    
    Object.entries(billingCheck).forEach(([category, items]) => {
      console.log(`\n📂 ${category.toUpperCase()}:`);
      Object.entries(items).forEach(([item, exists]) => {
        const status = exists ? '✅' : '❌';
        console.log(`  ${status} ${item}`);
        if (exists) billingExists = true;
      });
    });
    
    // Vérifier package.json pour Stripe
    try {
      const packageJson = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf8'));
      const hasStripe = packageJson.dependencies?.stripe || packageJson.devDependencies?.stripe;
      console.log(`\n📦 Dependencies: Stripe ${hasStripe ? '✅' : '❌'}`);
      if (hasStripe) billingExists = true;
    } catch (error) {
      console.log('\n❌ Erreur lecture package.json');
    }
    
    this.existingSystems.billing = {
      exists: billingExists,
      details: billingCheck
    };
  }

  async verifyNewsletterSystem() {
    console.log('\n📧 PHASE 3: Vérification Système Newsletter...\n');
    
    const newsletterCheck = {
      emailServices: {
        resend: existsSync(join(process.cwd(), 'lib/email/resend.ts')) || existsSync(join(process.cwd(), 'lib/resend.ts')),
        sendgrid: existsSync(join(process.cwd(), 'lib/email/sendgrid.ts')),
        custom: existsSync(join(process.cwd(), 'lib/email/service.ts'))
      },
      newsletterComponents: {
        template: existsSync(join(process.cwd(), 'components/newsletter/Template')),
        subscription: existsSync(join(process.cwd(), 'components/newsletter/Subscription')),
        viewer: existsSync(join(process.cwd(), 'components/newsletter/Viewer'))
      },
      newsletterPages: {
        newsletter: existsSync(join(process.cwd(), 'app/newsletter/page.tsx')),
        subscribe: existsSync(join(process.cwd(), 'app/newsletter/subscribe/page.tsx')),
        history: existsSync(join(process.cwd(), 'app/newsletter/history/page.tsx'))
      },
      newsletterAPI: {
        subscribe: existsSync(join(process.cwd(), 'app/api/newsletter/subscribe/route.ts')),
        unsubscribe: existsSync(join(process.cwd(), 'app/api/newsletter/unsubscribe/route.ts')),
        send: existsSync(join(process.cwd(), 'app/api/newsletter/send/route.ts'))
      }
    };
    
    console.log('📧 SYSTÈME NEWSLETTER EXISTANT:');
    
    let newsletterExists = false;
    
    Object.entries(newsletterCheck).forEach(([category, items]) => {
      console.log(`\n📂 ${category.toUpperCase()}:`);
      Object.entries(items).forEach(([item, exists]) => {
        const status = exists ? '✅' : '❌';
        console.log(`  ${status} ${item}`);
        if (exists) newsletterExists = true;
      });
    });
    
    // Vérifier les dépendances email
    try {
      const packageJson = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf8'));
      const hasResend = packageJson.dependencies?.resend || packageJson.devDependencies?.resend;
      const hasSendGrid = packageJson.dependencies?.['@sendgrid/mail'] || packageJson.devDependencies?.['@sendgrid/mail'];
      
      console.log(`\n📦 Dependencies Email:`);
      console.log(`  📧 Resend: ${hasResend ? '✅' : '❌'}`);
      console.log(`  📧 SendGrid: ${hasSendGrid ? '✅' : '❌'}`);
      
      if (hasResend || hasSendGrid) newsletterExists = true;
    } catch (error) {
      console.log('\n❌ Erreur lecture package.json');
    }
    
    this.existingSystems.newsletter = {
      exists: newsletterExists,
      details: newsletterCheck
    };
  }

  async verifyBriefsSystem() {
    console.log('\n📋 PHASE 4: Vérification Système Briefs...\n');
    
    const briefsCheck = {
      briefComponents: {
        executive: existsSync(join(process.cwd(), 'components/briefs/ExecutiveBrief')),
        strategic: existsSync(join(process.cwd(), 'components/briefs/StrategicBrief')),
        generator: existsSync(join(process.cwd(), 'components/briefs/BriefGenerator')),
        viewer: existsSync(join(process.cwd(), 'components/briefs/BriefViewer'))
      },
      briefPages: {
        briefs: existsSync(join(process.cwd(), 'app/briefs/page.tsx')),
        generate: existsSync(join(process.cwd(), 'app/briefs/generate/page.tsx')),
        view: existsSync(join(process.cwd(), 'app/briefs/[id]/page.tsx'))
      },
      briefServices: {
        generator: existsSync(join(process.cwd(), 'lib/briefs/generator.ts')),
        exporter: existsSync(join(process.cwd(), 'lib/briefs/exporter.ts')),
        analyzer: existsSync(join(process.cwd(), 'lib/briefs/analyzer.ts'))
      },
      briefTypes: {
        brief: existsSync(join(process.cwd(), 'types/brief.ts')),
        executive: existsSync(join(process.cwd(), 'types/executive-brief.ts')),
        strategic: existsSync(join(process.cwd(), 'types/strategic-brief.ts'))
      }
    };
    
    console.log('📋 SYSTÈME BRIEFS EXISTANT:');
    
    let briefsExists = false;
    
    Object.entries(briefsCheck).forEach(([category, items]) => {
      console.log(`\n📂 ${category.toUpperCase()}:`);
      Object.entries(items).forEach(([item, exists]) => {
        const status = exists ? '✅' : '❌';
        console.log(`  ${status} ${item}`);
        if (exists) briefsExists = true;
      });
    });
    
    this.existingSystems.briefs = {
      exists: briefsExists,
      details: briefsCheck
    };
  }

  async verifyDashboardSystem() {
    console.log('\n📊 PHASE 5: Vérification Système Dashboard...\n');
    
    const dashboardCheck = {
      dashboardComponents: {
        main: existsSync(join(process.cwd(), 'components/dashboard/Dashboard')),
        widgets: existsSync(join(process.cwd(), 'components/dashboard/Widgets')),
        analytics: existsSync(join(process.cwd(), 'components/dashboard/Analytics')),
        charts: existsSync(join(process.cwd(), 'components/dashboard/Charts'))
      },
      dashboardPages: {
        dashboard: existsSync(join(process.cwd(), 'app/dashboard/page.tsx')),
        analytics: existsSync(join(process.cwd(), 'app/dashboard/analytics/page.tsx')),
        settings: existsSync(join(process.cwd(), 'app/dashboard/settings/page.tsx'))
      },
      dashboardHooks: {
        analytics: existsSync(join(process.cwd(), 'hooks/useAnalytics.ts')),
        dashboard: existsSync(join(process.cwd(), 'hooks/useDashboard.ts'))
      }
    };
    
    console.log('📊 SYSTÈME DASHBOARD EXISTANT:');
    
    let dashboardExists = false;
    
    Object.entries(dashboardCheck).forEach(([category, items]) => {
      console.log(`\n📂 ${category.toUpperCase()}:`);
      Object.entries(items).forEach(([item, exists]) => {
        const status = exists ? '✅' : '❌';
        console.log(`  ${status} ${item}`);
        if (exists) dashboardExists = true;
      });
    });
    
    this.existingSystems.dashboard = {
      exists: dashboardExists,
      details: dashboardCheck
    };
  }

  async verifyUserManagement() {
    console.log('\n👤 PHASE 6: Vérification Gestion Utilisateurs...\n');
    
    const userManagementCheck = {
      userComponents: {
        profile: existsSync(join(process.cwd(), 'components/user/Profile')),
        settings: existsSync(join(process.cwd(), 'components/user/Settings')),
        preferences: existsSync(join(process.cwd(), 'components/user/Preferences'))
      },
      userPages: {
        profile: existsSync(join(process.cwd(), 'app/user/profile/page.tsx')),
        settings: existsSync(join(process.cwd(), 'app/user/settings/page.tsx'))
      },
      userServices: {
        profile: existsSync(join(process.cwd(), 'lib/user/profile.ts')),
        preferences: existsSync(join(process.cwd(), 'lib/user/preferences.ts')),
        management: existsSync(join(process.cwd(), 'lib/user/management.ts'))
      },
      userTypes: {
        user: existsSync(join(process.cwd(), 'types/user.ts')),
        profile: existsSync(join(process.cwd(), 'types/profile.ts'))
      }
    };
    
    console.log('👤 GESTION UTILISATEURS EXISTANTE:');
    
    let userManagementExists = false;
    
    Object.entries(userManagementCheck).forEach(([category, items]) => {
      console.log(`\n📂 ${category.toUpperCase()}:`);
      Object.entries(items).forEach(([item, exists]) => {
        const status = exists ? '✅' : '❌';
        console.log(`  ${status} ${item}`);
        if (exists) userManagementExists = true;
      });
    });
    
    this.existingSystems.userManagement = {
      exists: userManagementExists,
      details: userManagementCheck
    };
  }

  async verifyDependencies() {
    console.log('\n📦 PHASE 7: Vérification Dépendances...\n');
    
    try {
      const packageJson = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf8'));
      const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
      
      const relevantDeps = {
        auth: ['next-auth', '@auth/prisma-adapter', '@auth/supabase-adapter'],
        billing: ['stripe', '@stripe/stripe-js'],
        email: ['resend', '@sendgrid/mail', 'nodemailer'],
        ui: ['@radix-ui/react-', '@headlessui/react', 'framer-motion'],
        charts: ['recharts', 'chart.js', 'd3'],
        database: ['@prisma/client', 'prisma', '@supabase/supabase-js'],
        utils: ['clsx', 'tailwind-merge', 'date-fns', 'zod']
      };
      
      console.log('📦 DÉPENDANCES RELEVANTES:');
      
      Object.entries(relevantDeps).forEach(([category, deps]) => {
        console.log(`\n📂 ${category.toUpperCase()}:`);
        deps.forEach(dep => {
          const found = Object.keys(dependencies).some(key => key.includes(dep));
          console.log(`  ${found ? '✅' : '❌'} ${dep}`);
        });
      });
      
      this.existingSystems.dependencies = dependencies;
      
    } catch (error) {
      console.log('❌ Erreur lecture package.json');
    }
  }

  async generateOptimizedRecommendations() {
    console.log('\n💡 PHASE 8: Recommandations Optimisées...\n');
    
    const recommendations = {
      auth: {
        exists: this.existingSystems.auth?.exists || false,
        recommendation: this.existingSystems.auth?.exists ? 
          '✅ CONSERVER et améliorer le système existant' : 
          '🔥 CRÉER système authentification (NextAuth.js recommandé)',
        actions: this.existingSystems.auth?.exists ? [
          'Analyser la configuration existante',
          'Ajouter providers manquants si nécessaire',
          'Optimiser les composants existants',
          'Ajouter role-based access control'
        ] : [
          'Installer NextAuth.js',
          'Créer configuration providers',
          'Développer composants auth',
          'Mettre en place middleware'
        ]
      },
      billing: {
        exists: this.existingSystems.billing?.exists || false,
        recommendation: this.existingSystems.billing?.exists ? 
          '✅ CONSERVER et compléter le système existant' : 
          '🔥 CRÉER système billing (Stripe recommandé)',
        actions: this.existingSystems.billing?.exists ? [
          'Analyser intégration Stripe existante',
          'Ajouter webhooks manquants',
          'Créer composants billing manquants',
          'Implémenter subscription management'
        ] : [
          'Installer Stripe',
          'Créer configuration Stripe',
          'Développer composants billing',
          'Mettre en place webhooks'
        ]
      },
      newsletter: {
        exists: this.existingSystems.newsletter?.exists || false,
        recommendation: this.existingSystems.newsletter?.exists ? 
          '✅ CONSERVER et améliorer le système existant' : 
          '🔥 CRÉER système newsletter (Resend recommandé)',
        actions: this.existingSystems.newsletter?.exists ? [
          'Analyser service email existant',
          'Créer templates newsletter manquants',
          'Développer composants newsletter',
          'Mettre en place scheduling'
        ] : [
          'Installer Resend',
          'Créer service email',
          'Développer composants newsletter',
          'Implémenter subscription management'
        ]
      },
      briefs: {
        exists: this.existingSystems.briefs?.exists || false,
        recommendation: this.existingSystems.briefs?.exists ? 
          '✅ CONSERVER et étendre le système existant' : 
          '🔥 CRÉER système briefs (intégration MCP)',
        actions: this.existingSystems.briefs?.exists ? [
          'Analyser composants briefs existants',
          'Intégrer avec agents MCP',
          'Ajouter export functionality',
          'Créer templates Executive/Strategic'
        ] : [
          'Créer composants briefs',
          'Intégrer avec agents MCP',
          'Développer service génération',
          'Implémenter export multi-formats'
        ]
      },
      dashboard: {
        exists: this.existingSystems.dashboard?.exists || false,
        recommendation: this.existingSystems.dashboard?.exists ? 
          '✅ CONSERVER et améliorer le système existant' : 
          '⚡ CRÉER dashboard personnalisé',
        actions: this.existingSystems.dashboard?.exists ? [
          'Analyser composants dashboard existants',
          'Ajouter widgets personnalisables',
          'Intégrer analytics',
          'Optimiser performance'
        ] : [
          'Créer composants dashboard',
          'Développer widgets analytics',
          'Implémenter personnalisation',
          'Ajouter quick actions'
        ]
      }
    };
    
    console.log('💡 RECOMMANDATIONS OPTIMISÉES:');
    Object.entries(recommendations).forEach(([system, rec]) => {
      const icon = system === 'auth' ? '🔐' : system === 'billing' ? '💰' : system === 'newsletter' ? '📧' : system === 'briefs' ? '📋' : '📊';
      console.log(`\n${icon} ${system.toUpperCase()}:`);
      console.log(`  📊 Existe: ${rec.exists ? 'Oui' : 'Non'}`);
      console.log(`  💡 Recommandation: ${rec.recommendation}`);
      console.log('  🎯 Actions:');
      rec.actions.forEach((action, index) => {
        console.log(`    ${index + 1}. ${action}`);
      });
    });
    
    // Résumé final
    const existingCount = Object.values(recommendations).filter(rec => rec.exists).length;
    const totalCount = Object.keys(recommendations).length;
    
    console.log(`\n📊 RÉSUMÉ VÉRIFICATION:`);
    console.log(`  ✅ Systèmes existants: ${existingCount}/${totalCount}`);
    console.log(`  🔥 Nouveaux systèmes requis: ${totalCount - existingCount}/${totalCount}`);
    
    console.log('\n🎊 CONCLUSION OPENCLAW:');
    if (existingCount > 0) {
      console.log('  ✅ DES SYSTÈMES EXISTENT DÉJÀ - ÉVITER LES DOUBLONS');
      console.log('  🔧 OPTIMISER LES SYSTÈMES EXISTANTS');
      console.log('  🚀 COMPLÉTER UNIQUEMENT CE QUI MANQUE');
      console.log('  💡 RÉUTILISER AU MAXIMUM LES COMPOSANTS EXISTANTS');
    } else {
      console.log('  ❌ AUCUN SYSTÈME EXISTANT - CRÉATION COMPLÈTE REQUISE');
      console.log('  🔥 DÉVELOPPER TOUS LES SYSTÈMES DE ZÉRO');
      console.log('  📋 SUIVRE LA ROADMAP COMPLÈTE');
    }
    
    console.log('\n✅ STRATÉGIE OPTIMISÉE:');
    console.log('  🔍 ANALYSER chaque système existant');
    console.log('  🛠️ AMÉLIORER plutôt que remplacer');
    console.log('  📦 RÉUTILISER les composants existants');
    console.log('  🚀 COMPLÉTER uniquement les gaps');
    console.log('  🎯 OPTIMISER pour éviter les doublons');
    
    this.recommendations = recommendations;
    this.verificationResults = {
      existingCount,
      totalCount,
      hasExistingSystems: existingCount > 0
    };
    
    return {
      existingSystems: this.existingSystems,
      recommendations: recommendations,
      verificationResults: this.verificationResults
    };
  }
}

// Vérifier les systèmes existants
const verification = new OpenClawExistingSystemVerification();
verification.verifyExistingSystems().catch(console.error);
