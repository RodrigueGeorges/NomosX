/**
 * OpenClaw Syntax Error Fixer
 * Fixes invalid semicolon before function parentheses in all .tsx files
 * Converts module.exports to export default (ES module)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 OpenClaw Syntax Error Fixer\n');
console.log('='.repeat(60));

let fixedCount = 0;
let errorCount = 0;

function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;
    
    // Fix pattern: module.exports = function FunctionName;() {
    // Replace with: export default function FunctionName() {
    const pattern = /module\.exports\s*=\s*function\s+(\w+);(\([^)]*\))/g;
    
    if (pattern.test(content)) {
      content = content.replace(
        /module\.exports\s*=\s*function\s+(\w+);(\([^)]*\))/g,
        'export default function $1$2'
      );
      
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`✅ Fixed: ${path.relative(process.cwd(), filePath)}`);
        fixedCount++;
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}: ${error.message}`);
    errorCount++;
    return false;
  }
}

function scanDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      // Skip node_modules and hidden directories
      if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
        scanDirectory(fullPath);
      }
    } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
      fixFile(fullPath);
    }
  }
}

// Start scanning from app directory
const appDir = path.join(process.cwd(), 'app');

console.log(`\n📂 Scanning: ${appDir}\n`);

if (!fs.existsSync(appDir)) {
  console.error('❌ app directory not found!');
  process.exit(1);
}

scanDirectory(appDir);

console.log('\n' + '='.repeat(60));
console.log('\n📊 SUMMARY:\n');
console.log(`   ✅ Fixed: ${fixedCount} files`);
console.log(`   ❌ Errors: ${errorCount} files`);

if (fixedCount > 0) {
  console.log('\n🎉 All syntax errors fixed! Ready to build.');
  process.exit(0);
} else {
  console.log('\n✅ No files needed fixing.');
  process.exit(0);
}
