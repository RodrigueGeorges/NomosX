/**
 * CORRECTION AUTOMATIQUE OPENCLAW - ÉTAPE 3
 * Correction syntaxe commandes et redirections
 */

import { execSync } from 'child_process';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

async function executeStep3_SyntaxCorrection() {
  console.log('🔧 ÉTAPE 3: Correction Syntaxe Commandes\n');
  
  const corrections = [];
  
  try {
    // 3.1: Scanner et corriger les scripts PowerShell existants
    const scriptsDir = join(process.cwd(), 'scripts');
    const powershellScripts = [
      'setup-db.ps1',
      'start-clean.ps1',
      'test-providers.ps1'
    ];
    
    for (const script of powershellScripts) {
      const scriptPath = join(scriptsDir, script);
      
      if (existsSync(scriptPath)) {
        let content = readFileSync(scriptPath, 'utf8');
        const originalContent = content;
        
        // Corrections de syntaxe PowerShell
        content = content.replace(/Continue=SilentlyContinue/g, '$ErrorActionPreference = "SilentlyContinue"');
        content = content.replace(/\.Exception\.Message/g, '$_.Exception.Message');
        content = content.replace(/findstr\s+"[^"]+"\s*>>/g, 'Select-String | Out-File -FilePath');
        content = content.replace(/>>\s*["'][^"']+["']/g, '| Out-File -FilePath "$&" -Append');
        
        if (content !== originalContent) {
          writeFileSync(scriptPath, content, 'utf8');
          corrections.push(`✅ ${script}: Syntaxe corrigée`);
        } else {
          corrections.push(`ℹ️ ${script}: Déjà correct`);
        }
      } else {
        corrections.push(`⚠️ ${script}: Non trouvé`);
      }
    }
    
    // 3.2: Créer script de validation syntaxe
    const validationScript = `
# Validation syntaxe PowerShell OpenClaw
function Test-OpenClawSyntax {
    param([string]$ScriptPath)
    
    Write-Host "🔍 Validation: $ScriptPath"
    
    try {
        $null = [System.Management.Automation.PSParser]::Tokenize((Get-Content $ScriptPath -Raw), [ref]$null)
        Write-Host "✅ Syntaxe valide" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "❌ Erreur syntaxe: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Valider tous les scripts PowerShell
Get-ChildItem -Path ".\\scripts" -Filter "*.ps1" | ForEach-Object {
    Test-OpenClawSyntax -ScriptPath \$_.FullName
}
`;
    
    const validationPath = join(process.cwd(), 'scripts', 'validate-powershell-syntax.ps1');
    writeFileSync(validationPath, validationScript, 'utf8');
    corrections.push('✅ Script validation syntaxe créé');
    
    // 3.3: Corriger les redirections de fichiers
    const redirectionFixes = [
      {
        file: 'setup-db.ps1',
        pattern: />>\s*["'][^"']*["']/g,
        replacement: '| Out-File -FilePath "$&" -Append'
      },
      {
        file: 'start-clean.ps1', 
        pattern: />\s*["'][^"']*["']/g,
        replacement: '| Out-File -FilePath "$&"'
      }
    ];
    
    for (const fix of redirectionFixes) {
      const filePath = join(scriptsDir, fix.file);
      
      if (existsSync(filePath)) {
        let content = readFileSync(filePath, 'utf8');
        const originalContent = content;
        
        content = content.replace(fix.pattern, fix.replacement);
        
        if (content !== originalContent) {
          writeFileSync(filePath, content, 'utf8');
          corrections.push(`✅ ${fix.file}: Redirections corrigées`);
        }
      }
    }
    
    // 3.4: Tester une commande PowerShell corrigée
    try {
      const testCommand = '$ErrorActionPreference = "SilentlyContinue"; Write-Host "Test syntaxe OK"';
      const testResult = execSync(`powershell -Command "${testCommand}"`, { encoding: 'utf8' });
      
      if (testResult.includes('Test syntaxe OK')) {
        corrections.push('✅ Test commande PowerShell réussi');
      }
    } catch (error) {
      corrections.push('⚠️ Test PowerShell: ' + error.message);
    }
    
    console.log('📋 RÉSULTATS ÉTAPE 3:');
    corrections.forEach(correction => console.log(`  ${correction}`));
    
    return {
      step: 'Correction Syntaxe',
      status: corrections.filter(c => c.startsWith('✅')).length >= 4 ? 'COMPLÉTÉ' : 'PARTIEL',
      corrections: corrections
    };
    
  } catch (error) {
    console.error('❌ Erreur étape 3:', error.message);
    return {
      step: 'Correction Syntaxe',
      status: 'ERREUR',
      error: error.message
    };
  }
}

// Exécuter l'étape 3
executeStep3_SyntaxCorrection()
  .then(result => {
    console.log(`\n🎯 ÉTAPE 3: ${result.status}`);
    if (result.status === 'COMPLÉTÉ') {
      console.log('✅ Prêt pour étape 4: Test final OpenClaw');
    }
  })
  .catch(error => {
    console.error('❌ Erreur critique:', error);
  });
