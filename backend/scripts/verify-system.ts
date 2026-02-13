/**
 * System Verification Script
 * 
 * Vérifie que tout le système fonctionne correctement
 */

import { createLogger } from "../src/shared/logging/Logger";
import { getPrismaClient, disconnectPrisma } from "../src/infrastructure/persistence/prisma/client";
import Redis from "ioredis";

const logger = createLogger({ service: "system-verify" });

interface VerificationResult {
  component: string;
  status: "✅ OK" | "❌ FAIL";
  message: string;
  duration?: number;
}

const results: VerificationResult[] = [];

async function verifyDatabase(): Promise<VerificationResult> {
  const start = Date.now();
  try {
    const prisma = getPrismaClient();
    await prisma.$queryRaw`SELECT 1`;
    
    const sourceCount = await prisma.source.count();
    
    return {
      component: "Database (PostgreSQL)",
      status: "✅ OK",
      message: `Connected, ${sourceCount} sources`,
      duration: Date.now() - start,
    };
  } catch (error) {
    return {
      component: "Database (PostgreSQL)",
      status: "❌ FAIL",
      message: error instanceof Error ? error.message : String(error),
      duration: Date.now() - start,
    };
  }
}

async function verifyPgVector(): Promise<VerificationResult> {
  const start = Date.now();
  try {
    const prisma = getPrismaClient();
    const result = await prisma.$queryRaw<any[]>`
      SELECT * FROM pg_extension WHERE extname='vector'
    `;
    
    if (result.length > 0) {
      return {
        component: "pgvector Extension",
        status: "✅ OK",
        message: "Extension installed",
        duration: Date.now() - start,
      };
    } else {
      return {
        component: "pgvector Extension",
        status: "❌ FAIL",
        message: "Extension not found",
        duration: Date.now() - start,
      };
    }
  } catch (error) {
    return {
      component: "pgvector Extension",
      status: "❌ FAIL",
      message: error instanceof Error ? error.message : String(error),
      duration: Date.now() - start,
    };
  }
}

async function verifyRedis(): Promise<VerificationResult> {
  const start = Date.now();
  try {
    const redis = new Redis({
      host: process.env.REDIS_HOST || "localhost",
      port: parseInt(process.env.REDIS_PORT || "6379"),
      password: process.env.REDIS_PASSWORD,
    });
    
    await redis.ping();
    await redis.quit();
    
    return {
      component: "Redis",
      status: "✅ OK",
      message: "Connected",
      duration: Date.now() - start,
    };
  } catch (error) {
    return {
      component: "Redis",
      status: "❌ FAIL",
      message: error instanceof Error ? error.message : String(error),
      duration: Date.now() - start,
    };
  }
}

async function verifyAPI(): Promise<VerificationResult> {
  const start = Date.now();
  try {
    const port = process.env.PORT || "3000";
    const response = await fetch(`http://localhost:${port}/health`);
    
    if (response.ok) {
      const data = await response.json();
      return {
        component: "API Server",
        status: "✅ OK",
        message: `Healthy, version ${data.version}`,
        duration: Date.now() - start,
      };
    } else {
      return {
        component: "API Server",
        status: "❌ FAIL",
        message: `HTTP ${response.status}`,
        duration: Date.now() - start,
      };
    }
  } catch (error) {
    return {
      component: "API Server",
      status: "❌ FAIL",
      message: error instanceof Error ? error.message : String(error),
      duration: Date.now() - start,
    };
  }
}

async function verifyOpenAI(): Promise<VerificationResult> {
  const start = Date.now();
  try {
    if (!process.env.OPENAI_API_KEY) {
      return {
        component: "OpenAI API",
        status: "❌ FAIL",
        message: "OPENAI_API_KEY not set",
        duration: Date.now() - start,
      };
    }
    
    return {
      component: "OpenAI API",
      status: "✅ OK",
      message: "API key configured",
      duration: Date.now() - start,
    };
  } catch (error) {
    return {
      component: "OpenAI API",
      status: "❌ FAIL",
      message: error instanceof Error ? error.message : String(error),
      duration: Date.now() - start,
    };
  }
}

async function verifySchema(): Promise<VerificationResult> {
  const start = Date.now();
  try {
    const prisma = getPrismaClient();
    
    // Check critical tables
    const tables = await prisma.$queryRaw<any[]>`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema='public' AND table_type='BASE TABLE'
      ORDER BY table_name
    `;
    
    const requiredTables = [
      "Source",
      "Claim",
      "EvidenceSpan",
      "AnalysisRun",
      "Job",
      "CostLog",
    ];
    
    const tableNames = tables.map((t: any) => t.table_name);
    const missingTables = requiredTables.filter((t: string) => !tableNames.includes(t));
    
    if (missingTables.length === 0) {
      return {
        component: "Database Schema",
        status: "✅ OK",
        message: `${tables.length} tables, all required tables present`,
        duration: Date.now() - start,
      };
    } else {
      return {
        component: "Database Schema",
        status: "❌ FAIL",
        message: `Missing tables: ${missingTables.join(", ")}`,
        duration: Date.now() - start,
      };
    }
  } catch (error) {
    return {
      component: "Database Schema",
      status: "❌ FAIL",
      message: error instanceof Error ? error.message : String(error),
      duration: Date.now() - start,
    };
  }
}

async function runVerification() {
  logger.info("🔍 Starting system verification...\n");
  
  // Run all verifications
  results.push(await verifyDatabase());
  results.push(await verifyPgVector());
  results.push(await verifySchema());
  results.push(await verifyRedis());
  results.push(await verifyAPI());
  results.push(await verifyOpenAI());
  
  // Print results
  console.log("\n" + "=".repeat(80));
  console.log("📊 VERIFICATION RESULTS");
  console.log("=".repeat(80) + "\n");
  
  for (const result of results) {
    console.log(`${result.status} ${result.component}`);
    console.log(`   ${result.message}`);
    if (result.duration) {
      console.log(`   Duration: ${result.duration}ms`);
    }
    console.log();
  }
  
  console.log("=".repeat(80));
  
  const failures = results.filter((r) => r.status === "❌ FAIL");
  
  if (failures.length === 0) {
    console.log("✅ ALL CHECKS PASSED - System is ready!");
    console.log("=".repeat(80) + "\n");
    process.exit(0);
  } else {
    console.log(`❌ ${failures.length} CHECK(S) FAILED`);
    console.log("=".repeat(80) + "\n");
    process.exit(1);
  }
}

runVerification()
  .catch((error) => {
    logger.error("Verification script failed", { error: error.message });
    process.exit(1);
  })
  .finally(async () => {
    await disconnectPrisma();
  });
