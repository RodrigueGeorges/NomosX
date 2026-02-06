// Preload script to capture exports error with full stack trace
// Usage: NODE_OPTIONS="--require ./scripts/preload-trace.cjs" npm run build

process.on('unhandledRejection', (reason) => {
  if (reason && reason.message && reason.message.includes('exports is not defined')) {
    console.error('\n\n========================================');
    console.error('🔴 EXPORTS ERROR INTERCEPTED!');
    console.error('========================================');
    console.error('Message:', reason.message);
    console.error('\nFull stack:');
    console.error(reason.stack);
    console.error('========================================\n');
  }
});

// Also patch Module._compile to detect which file triggers the error
const Module = require('module');
const origCompile = Module.prototype._compile;
let lastFile = '';

Module.prototype._compile = function(content, filename) {
  lastFile = filename;
  try {
    return origCompile.call(this, content, filename);
  } catch (err) {
    if (err.message && err.message.includes('exports is not defined')) {
      console.error('\n🔴 ERROR IN FILE:', filename);
      console.error('Stack:', err.stack);
    }
    throw err;
  }
};
