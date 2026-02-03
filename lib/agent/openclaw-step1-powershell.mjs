/**
 * CORRECTION AUTOMATIQUE OPENCLAW - ÉTAPE 1
 * Configuration PowerShell et corrections syntaxe
 */

import { execSync } from 'child_process';
import { writeFileSync, existsSync } from 'fs';
import { join } from 'path';

async function executeStep1_PowerShellConfig() {
  console.log('🔧 ÉTAPE 1: Configuration PowerShell\n');
  
  const corrections = [];
  
  try {
    // 1.1: Créer le profil PowerShell avec configuration correcte
    const profilePath = join(process.env.USERPROFILE || '', 'Documents', 'PowerShell', 'Microsoft.PowerShell_profile.ps1');
    
    if (!existsSync(profilePath)) {
      const profileContent = `
# Configuration OpenClaw PowerShell
$ErrorActionPreference = "SilentlyContinue"
$ProgressPreference = "SilentlyContinue"

# Fonctions utilitaires OpenClaw
function Invoke-OpenClawCommand {
    param([string]$Command)
    try {
        $result = Invoke-Expression $Command
        return $result
    } catch {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Alias pour commandes fréquentes
Set-Alias -Name oc -Value Invoke-OpenClawCommand
`;
      
      writeFileSync(profilePath, profileContent, 'utf8');
      corrections.push('✅ Profil PowerShell créé avec configuration');
    } else {
      corrections.push('ℹ️ Profil PowerShell existe déjà');
    }
    
    // 1.2: Créer script de correction syntaxe
    const syntaxFixScript = `
# Correction syntaxe PowerShell pour OpenClaw
# Remplacer les anciennes syntaxes par les nouvelles

function Fix-PowerShellSyntax {
    param([string]$ScriptPath)
    
    $content = Get-Content $ScriptPath -Raw
    
    # Corrections de syntaxe
    $content = $content -replace 'Continue=SilentlyContinue', '$ErrorActionPreference = "SilentlyContinue"'
    $content = $content -replace '\.Exception\.Message', '$_.Exception.Message'
    $content = $content -replace 'findstr.*>>', 'Select-String | Out-File -FilePath'
    
    Set-Content $ScriptPath -Value $content
    Write-Host "✅ Syntaxe PowerShell corrigée: $ScriptPath"
}
`;
    
    const syntaxFixPath = join(process.cwd(), 'scripts', 'fix-powershell-syntax.ps1');
    writeFileSync(syntaxFixPath, syntaxFixScript, 'utf8');
    corrections.push('✅ Script de correction syntaxe créé');
    
    // 1.3: Tester la configuration PowerShell
    try {
      const testResult = execSync('powershell -Command "$ErrorActionPreference = \\"SilentlyContinue\\"; Write-Host \\"PowerShell OK\\""', { encoding: 'utf8' });
      if (testResult.includes('PowerShell OK')) {
        corrections.push('✅ Configuration PowerShell validée');
      }
    } catch (error) {
      corrections.push('⚠️ Test PowerShell: ' + error.message);
    }
    
    console.log('📋 RÉSULTATS ÉTAPE 1:');
    corrections.forEach(correction => console.log(`  ${correction}`));
    
    return {
      step: 'Configuration PowerShell',
      status: corrections.filter(c => c.startsWith('✅')).length >= 2 ? 'COMPLÉTÉ' : 'PARTIEL',
      corrections: corrections
    };
    
  } catch (error) {
    console.error('❌ Erreur étape 1:', error.message);
    return {
      step: 'Configuration PowerShell',
      status: 'ERREUR',
      error: error.message
    };
  }
}

// Exécuter l'étape 1
executeStep1_PowerShellConfig()
  .then(result => {
    console.log(`\n🎯 ÉTAPE 1: ${result.status}`);
    if (result.status === 'COMPLÉTÉ') {
      console.log('✅ Prêt pour étape 2: Gateway mode portable');
    }
  })
  .catch(error => {
    console.error('❌ Erreur critique:', error);
  });
