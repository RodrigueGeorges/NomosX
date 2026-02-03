/**
 * CORRECTION AUTOMATIQUE OPENCLAW - ÉTAPE 2
 * Gateway mode portable (sans service Windows)
 */

import { execSync } from 'child_process';
import { writeFileSync, existsSync } from 'fs';
import { join } from 'path';

async function executeStep2_GatewayPortable() {
  console.log('🔧 ÉTAPE 2: Gateway Mode Portable\n');
  
  const corrections = [];
  
  try {
    // 2.1: Créer configuration gateway portable
    const gatewayConfig = {
      mode: "portable",
      service: false,
      permissions: "user",
      endpoints: {
        api: "http://localhost:3001/api",
        monitoring: "http://localhost:3001/health",
        admin: "http://localhost:3001/admin"
      },
      security: {
        auth: "local",
        encryption: "AES256",
        timeout: 30000
      }
    };
    
    const configPath = join(process.cwd(), 'config', 'gateway-portable.json');
    writeFileSync(configPath, JSON.stringify(gatewayConfig, null, 2), 'utf8');
    corrections.push('✅ Configuration gateway portable créée');
    
    // 2.2: Script de démarrage portable
    const portableScript = `@echo off
echo 🚀 Démarrage OpenClaw Gateway Mode Portable
echo.

REM Vérifier Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js non installé
    pause
    exit /b 1
)

REM Démarrer le serveur gateway
echo 🔧 Démarrage serveur gateway...
cd /d "%~dp0.."
node lib/gateway/portable-server.js

if errorlevel 1 (
    echo ❌ Erreur démarrage gateway
    pause
    exit /b 1
) else (
    echo ✅ Gateway démarré en mode portable
    echo 🌐 API: http://localhost:3001
    echo 📊 Monitoring: http://localhost:3001/health
    pause
)
`;
    
    const scriptPath = join(process.cwd(), 'scripts', 'start-gateway-portable.bat');
    writeFileSync(scriptPath, portableScript, 'utf8');
    corrections.push('✅ Script démarrage portable créé');
    
    // 2.3: Créer serveur gateway portable
    const gatewayServer = `
/**
 * OpenClaw Gateway - Mode Portable
 * Serveur léger sans service Windows
 */

const express = require('express');
const cors = require('cors');
const { createServer } = require('http');

const app = express();
const server = createServer(app);
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    mode: 'portable',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get('/api/status', (req, res) => {
  res.json({
    gateway: 'portable',
    version: '1.0.0',
    endpoints: ['/health', '/api/status', '/api/monitor']
  });
});

app.post('/api/fix', (req, res) => {
  const { issue } = req.body;
  console.log('🔧 Fix request:', issue);
  
  res.json({
    status: 'processing',
    issue: issue,
    timestamp: new Date().toISOString()
  });
});

// Démarrage serveur
server.listen(PORT, () => {
  console.log('🚀 OpenClaw Gateway Portable');
  console.log('🌐 Port:', PORT);
  console.log('📊 Health: http://localhost:' + PORT + '/health');
  console.log('🔧 Mode: Portable (no Windows service)');
});

// Arrêt propre
process.on('SIGINT', () => {
  console.log('\\n🛑 Arrêt gateway portable...');
  server.close(() => {
    console.log('✅ Gateway arrêté');
    process.exit(0);
  });
});
`;
    
    const serverPath = join(process.cwd(), 'lib', 'gateway', 'portable-server.js');
    writeFileSync(serverPath, gatewayServer, 'utf8');
    corrections.push('✅ Serveur gateway portable créé');
    
    // 2.4: Tester les dépendances
    try {
      const expressCheck = execSync('npm list express', { encoding: 'utf8' });
      if (expressCheck.includes('express')) {
        corrections.push('✅ Dépendance Express vérifiée');
      }
    } catch (error) {
      corrections.push('⚠️ Installation Express nécessaire');
    }
    
    console.log('📋 RÉSULTATS ÉTAPE 2:');
    corrections.forEach(correction => console.log(`  ${correction}`));
    
    return {
      step: 'Gateway Portable',
      status: corrections.filter(c => c.startsWith('✅')).length >= 3 ? 'COMPLÉTÉ' : 'PARTIEL',
      corrections: corrections
    };
    
  } catch (error) {
    console.error('❌ Erreur étape 2:', error.message);
    return {
      step: 'Gateway Portable',
      status: 'ERREUR',
      error: error.message
    };
  }
}

// Exécuter l'étape 2
executeStep2_GatewayPortable()
  .then(result => {
    console.log(`\n🎯 ÉTAPE 2: ${result.status}`);
    if (result.status === 'COMPLÉTÉ') {
      console.log('✅ Prêt pour étape 3: Correction syntaxe commandes');
    }
  })
  .catch(error => {
    console.error('❌ Erreur critique:', error);
  });
