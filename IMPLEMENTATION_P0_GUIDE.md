#!/usr/bin/env node
/**
 * PRIORITY 0 IMPLEMENTATION GUIDE
 * NomosX Architecture Improvements - Week 1
 * 
 * Fixes to apply ASAP:
 * 1. INDEX Agent: Add parallel batching (10x speedup)
 * 2. Deduplication: Keep best source, not earliest
 * 3. SCOUT: Add Redis cache layer
 */

const tasks = [
  {
    id: 1,
    title: "Index Agent: Parallel ORCID Batching",
    file: "lib/agent/index-agent.ts",
    priority: "P0",
    estimatedTime: "2-3 hours",
    currentIssue: "Sequential ORCID calls: 3000 calls × 500ms = 25 minutes",
    solution: "Batch 20 calls in parallel: 3000/20 batches × 500ms = 2-3 minutes",
    impact: "10x speedup on pipeline",
    lines: "approx 50 lines added",
    testing: [
      "Test with 100 sources (300+ authors)",
      "Measure time: should be <5min",
      "Verify all authors enriched correctly"
    ]
  },
  {
    id: 2,
    title: "Smart Deduplication: Keep Best, Not Earliest",
    file: "lib/agent/index-agent.ts",
    priority: "P0",
    estimatedTime: "1 hour",
    currentIssue: "Removes duplicates but keeps earliest (2020) instead of best (2024 with PDF)",
    solution: "Compare qualityScore before deletion, keep highest-scoring version",
    impact: "Keep PDF sources, better enrichment",
    lines: "approx 15 lines changed",
    testing: [
      "Test with duplicate DOIs",
      "Verify highest qualityScore is kept",
      "Check PDF presence is preserved"
    ]
  },
  {
    id: 3,
    title: "SCOUT Cache Layer: Redis 24h TTL",
    file: "lib/agent/pipeline-v2.ts",
    priority: "P0",
    estimatedTime: "3-4 hours",
    currentIssue: "Repeated queries hit all 21 providers twice: $100 waste/day",
    solution: "Add Redis cache: hash(query + providers) → sourceIds (24h TTL)",
    impact: "50% cost reduction + instant 2nd search",
    lines: "approx 40 lines added",
    testing: [
      "Test cache hit: 2nd identical query returns from cache",
      "Test TTL: cache expires after 24h",
      "Test cache miss: different query hits providers",
      "Measure latency: <200ms on cache hit"
    ]
  }
];

console.log("\n╔════════════════════════════════════════════════════════════════╗");
console.log("║     PRIORITY 0: ARCHITECTURE IMPROVEMENTS - IMPLEMENTATION       ║");
console.log("║              NomosX Pipeline V2 (Week 1 Goals)                   ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

console.log(`📋 TASKS: ${tasks.length} critical improvements\n`);

tasks.forEach((task, i) => {
  console.log(`${'═'.repeat(66)}`);
  console.log(`\n🎯 TASK ${task.id}: ${task.title}`);
  console.log(`   Priority:  ${task.priority}`);
  console.log(`   File:      ${task.file}`);
  console.log(`   Time:      ${task.estimatedTime}`);
  console.log(`   Impact:    ${task.impact}\n`);
  
  console.log(`❌ CURRENT PROBLEM:`);
  console.log(`   ${task.currentIssue}\n`);
  
  console.log(`✅ SOLUTION:`);
  console.log(`   ${task.solution}\n`);
  
  console.log(`📝 IMPLEMENTATION:`);
  console.log(`   • ~${task.lines}`);
  console.log(`   • See implementation code below\n`);
  
  console.log(`🧪 TESTING CHECKLIST:`);
  task.testing.forEach(t => console.log(`   ☐ ${t}`));
  console.log();
});

console.log(`${'═'.repeat(66)}\n`);

console.log(`⏱️  TOTAL ESTIMATED TIME: ~6-8 hours (can be done in 1 sprint)\n`);

console.log(`📊 EXPECTED OUTCOMES:\n`);
const outcomes = [
  { metric: "Pipeline Speed", before: "25+ min", after: "3-4 min", gain: "10x ⚡" },
  { metric: "API Costs/Day", before: "$100", after: "$50", gain: "50% 💰" },
  { metric: "Source Quality", before: "80%", after: "95%", gain: "+19% 📚" },
  { metric: "2nd Query Time", before: "30s", after: "<200ms", gain: "150x 🚀" }
];

console.log("   Metric                  Before      After       Improvement");
console.log("   " + "─".repeat(60));
outcomes.forEach(o => {
  const line = `   ${o.metric.padEnd(23)} ${o.before.padEnd(11)} ${o.after.padEnd(11)} ${o.gain}`;
  console.log(line);
});

console.log(`\n${'═'.repeat(66)}\n`);

console.log(`🔧 IMPLEMENTATION CODE TEMPLATES\n`);

console.log(`╔─ TASK 1: INDEX Batching (lib/agent/index-agent.ts) ─────────────╗\n`);

const code1 = `
// ADD THIS FUNCTION after existing enrichAuthor code:

/**
 * Batch ORCID enrichment - parallel instead of sequential
 * Reduces 3000 sequential calls to 150 batches of 20
 */
async function enrichAuthorsBatch(
  authors: Array<{ name: string; orcid?: string }>,
  existingMap: Map<string, AuthorRecord>
) {
  const BATCH_SIZE = 20;
  const results = new Map<string, any>();
  
  // Filter authors needing ORCID
  const needsOrcid = authors.filter(a => a.orcid && !existingMap.has(a.orcid));
  
  console.log(\`[Index] Enriching \${needsOrcid.length} authors in \${Math.ceil(needsOrcid.length / BATCH_SIZE)} batches\`);
  
  for (let i = 0; i < needsOrcid.length; i += BATCH_SIZE) {
    const batch = needsOrcid.slice(i, i + BATCH_SIZE);
    
    // Process batch in PARALLEL
    const promises = batch.map(a => 
      getORCIDById(a.orcid!)
        .catch(err => {
          console.warn(\`[Index] ORCID failed for \${a.orcid}: \${err.message}\`);
          return null;
        })
    );
    
    const resolved = await Promise.all(promises);
    
    resolved.forEach((data, idx) => {
      if (data && batch[idx].orcid) {
        results.set(batch[idx].orcid, data);
      }
    });
    
    console.log(\`[Index] Batch complete: \${Math.min((i + BATCH_SIZE), needsOrcid.length)}/\${needsOrcid.length}\`);
  }
  
  return results;
}

// REPLACE the sequential loop with:
// OLD:
// for (const author of rawAuthors) {
//   if (author.orcid) {
//     orcidData = await getORCIDById(author.orcid);
//   }
// }

// NEW:
const orcidCache = await enrichAuthorsBatch(rawAuthors, existingAuthors);

for (const author of rawAuthors) {
  const orcidData = orcidCache.get(author.orcid!) || null;
  // ... rest of logic
}
`;

console.log(code1);

console.log(`\n╔─ TASK 2: Smart Dedup (lib/agent/index-agent.ts) ────────────────╗\n`);

const code2 = `
// REPLACE the deduplicateByDOI function:

// OLD:
// function deduplicateByDOI(sources) {
//   const grouped = groupBy(sources, 'doi');
//   return Object.values(grouped).map(g => g[0]); // First = earliest!
// }

// NEW:
function deduplicateBySmarterLogic(sources: Source[]) {
  const grouped = new Map<string, Source[]>();
  
  for (const source of sources) {
    const key = source.doi || source.title; // Use title as fallback
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(source);
  }
  
  const deduped = Array.from(grouped.values()).map(group => {
    if (group.length === 1) return group[0];
    
    // Multiple versions: keep highest quality score
    const best = group.reduce((current, candidate) => {
      const currentScore = current.qualityScore || 0;
      const candidateScore = candidate.qualityScore || 0;
      
      console.log(\`[Dedup] Comparing \${current.id} (quality:\${currentScore}) vs \${candidate.id} (quality:\${candidateScore})\`);
      
      return candidateScore > currentScore ? candidate : current;
    });
    
    const others = group.filter(s => s.id !== best.id);
    console.log(\`[Dedup] Keeping \${best.id} (quality:\${best.qualityScore}), removing \${others.length} duplicates\`);
    
    return best;
  });
  
  console.log(\`[Dedup] Result: \${sources.length} → \${deduped.length} sources\`);
  return deduped;
}
`;

console.log(code2);

console.log(`\n╔─ TASK 3: SCOUT Redis Cache (lib/agent/pipeline-v2.ts) ──────────╗\n`);

const code3 = `
// ADD AT TOP:
import Redis from 'ioredis';
import crypto from 'crypto';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

function hashQuery(query: string, providers: Providers): string {
  const str = \`\${query}|\${providers.join(',')}\`;
  return crypto.createHash('md5').update(str).digest('hex');
}

// WRAP the scout() function:

export async function scoutV2WithCache(
  query: string,
  providers: Providers,
  options?: ScoutOptions
): Promise<ScoutResult> {
  const cacheKey = \`scout:\${hashQuery(query, providers)}\`;
  const cacheTTL = 86400; // 24 hours
  
  try {
    // 1. Try cache first
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log(\`[SCOUT] ✅ Cache HIT for "\${query}"\`);
      const data = JSON.parse(cached);
      return {
        ...data,
        cached: true // Mark as cached
      };
    }
  } catch (err) {
    console.warn(\`[SCOUT] Cache read error (continuing): \${err}\`);
  }
  
  // 2. No cache, run scout normally
  console.log(\`[SCOUT] Cache MISS for "\${query}", running providers...\`);
  const result = await scoutV2(query, providers, options);
  
  // 3. Store in cache (async, don't await)
  redis.setex(
    cacheKey,
    cacheTTL,
    JSON.stringify({
      found: result.found,
      upserted: result.upserted,
      sourceIds: result.sourceIds,
      metrics: result.metrics,
      enhancedQuery: result.enhancedQuery
    })
  ).catch(err => {
    console.warn(\`[SCOUT] Cache write error: \${err}\`);
  });
  
  return { ...result, cached: false };
}

// UPDATE the pipeline to use the cached version:
// OLD: const scoutResult = await scout(query, ...);
// NEW: const scoutResult = await scoutV2WithCache(query, ...);
`;

console.log(code3);

console.log(`\n${'═'.repeat(66)}\n`);

console.log(`🚀 DEPLOYMENT CHECKLIST\n`);

const checklist = [
  { step: "1. Create feature branch", cmd: "git checkout -b feat/p0-improvements" },
  { step: "2. Implement Task 1", cmd: "Edit lib/agent/index-agent.ts" },
  { step: "3. Implement Task 2", cmd: "Edit lib/agent/index-agent.ts" },
  { step: "4. Implement Task 3", cmd: "Edit lib/agent/pipeline-v2.ts" },
  { step: "5. Run tests", cmd: "npm test -- agent/" },
  { step: "6. Load test", cmd: "npm run test:load 100 concurrent" },
  { step: "7. Create PR with perf benchmarks", cmd: "git push origin feat/p0-improvements" },
  { step: "8. Merge after review", cmd: "GitHub Web Interface" },
  { step: "9. Deploy to staging", cmd: "vercel deploy --prod-env staging" },
  { step: "10. Monitor 24h before prod", cmd: "Datadog + Sentry" }
];

checklist.forEach((item, i) => {
  console.log(\`   \${String(i + 1).padEnd(2)} ☐ \${item.step}\`);
  console.log(\`      $ \${item.cmd}\n\`);
});

console.log(`${'═'.repeat(66)}\n`);

console.log(`✅ SUCCESS METRICS\n`);
console.log(\`   After implementation, measure:\n\`);
console.log(\`   • Pipeline time for 100 sources: <5min (target)\`);
console.log(\`   • SCOUT cache hit rate: >40% (2nd+ searches)\`);
console.log(\`   • Source dedup quality: 95%+ sources useful\`);
console.log(\`   • Cost per brief: <\$0.50 (down from \$1.00)\n\`);

console.log(\`${'═'.repeat(66)}\n\`);

console.log(\`📖 Reference Documents:\n\`);
console.log(\`   • ARCHITECTURE_IMPROVEMENTS_2026-01-24.md (full details)\`);
console.log(\`   • AGENTS.md (agent specs)\`);
console.log(\`   • lib/agent/pipeline-v2.ts (current implementation)\n\`);

console.log(\`Generated: January 24, 2026\`);
console.log(\`By: GitHub Copilot (Claude Haiku 4.5)\n\`);
