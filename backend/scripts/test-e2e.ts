/**
 * End-to-End Test Script
 * 
 * Teste le flow complet utilisateur → résultat
 */

import { createLogger } from "../src/shared/logging/Logger";

const logger = createLogger({ service: "e2e-test" });

const API_URL = process.env.API_URL || "http://localhost:3000";

interface TestResult {
  test: string;
  status: "✅ PASS" | "❌ FAIL";
  message: string;
  duration?: number;
}

const results: TestResult[] = [];

async function testHealthCheck(): Promise<TestResult> {
  const start = Date.now();
  try {
    const response = await fetch(`${API_URL}/health`);
    const data = await response.json();
    
    if (response.ok && data.status === "healthy") {
      return {
        test: "Health Check",
        status: "✅ PASS",
        message: `API is healthy (v${data.version})`,
        duration: Date.now() - start,
      };
    } else {
      return {
        test: "Health Check",
        status: "❌ FAIL",
        message: `Unexpected response: ${JSON.stringify(data)}`,
        duration: Date.now() - start,
      };
    }
  } catch (error) {
    return {
      test: "Health Check",
      status: "❌ FAIL",
      message: error instanceof Error ? error.message : String(error),
      duration: Date.now() - start,
    };
  }
}

async function testCreateAnalysis(): Promise<TestResult> {
  const start = Date.now();
  try {
    const response = await fetch(`${API_URL}/api/v1/analysis`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: "Quel est l'impact des taxes carbone sur les émissions de CO2 ?",
        mode: "brief",
        providers: ["openalex"],
        maxSources: 5,
      }),
    });
    
    const data = await response.json();
    
    if (response.status === 201 && data.run && data.run.id) {
      return {
        test: "Create Analysis",
        status: "✅ PASS",
        message: `Analysis created: ${data.run.id}`,
        duration: Date.now() - start,
      };
    } else {
      return {
        test: "Create Analysis",
        status: "❌ FAIL",
        message: `Unexpected response: ${JSON.stringify(data)}`,
        duration: Date.now() - start,
      };
    }
  } catch (error) {
    return {
      test: "Create Analysis",
      status: "❌ FAIL",
      message: error instanceof Error ? error.message : String(error),
      duration: Date.now() - start,
    };
  }
}

async function testCorrelationId(): Promise<TestResult> {
  const start = Date.now();
  try {
    const correlationId = "test-" + Date.now();
    const response = await fetch(`${API_URL}/health`, {
      headers: {
        "X-Correlation-Id": correlationId,
      },
    });
    
    const responseCorrelationId = response.headers.get("X-Correlation-Id");
    
    if (responseCorrelationId === correlationId) {
      return {
        test: "Correlation ID",
        status: "✅ PASS",
        message: "Correlation ID correctly propagated",
        duration: Date.now() - start,
      };
    } else {
      return {
        test: "Correlation ID",
        status: "❌ FAIL",
        message: `Expected ${correlationId}, got ${responseCorrelationId}`,
        duration: Date.now() - start,
      };
    }
  } catch (error) {
    return {
      test: "Correlation ID",
      status: "❌ FAIL",
      message: error instanceof Error ? error.message : String(error),
      duration: Date.now() - start,
    };
  }
}

async function testErrorHandling(): Promise<TestResult> {
  const start = Date.now();
  try {
    const response = await fetch(`${API_URL}/api/v1/analysis`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: "Short", // Too short, should fail validation
        mode: "brief",
      }),
    });
    
    const data = await response.json();
    
    if (response.status === 400 && data.error) {
      return {
        test: "Error Handling",
        status: "✅ PASS",
        message: "Validation error correctly handled",
        duration: Date.now() - start,
      };
    } else {
      return {
        test: "Error Handling",
        status: "❌ FAIL",
        message: `Expected 400 error, got ${response.status}`,
        duration: Date.now() - start,
      };
    }
  } catch (error) {
    return {
      test: "Error Handling",
      status: "❌ FAIL",
      message: error instanceof Error ? error.message : String(error),
      duration: Date.now() - start,
    };
  }
}

async function runE2ETests() {
  logger.info("🧪 Starting E2E tests...\n");
  
  // Run tests sequentially
  results.push(await testHealthCheck());
  results.push(await testCorrelationId());
  results.push(await testCreateAnalysis());
  results.push(await testErrorHandling());
  
  // Print results
  console.log("\n" + "=".repeat(80));
  console.log("🧪 E2E TEST RESULTS");
  console.log("=".repeat(80) + "\n");
  
  for (const result of results) {
    console.log(`${result.status} ${result.test}`);
    console.log(`   ${result.message}`);
    if (result.duration) {
      console.log(`   Duration: ${result.duration}ms`);
    }
    console.log();
  }
  
  console.log("=".repeat(80));
  
  const failures = results.filter((r) => r.status === "❌ FAIL");
  const passes = results.filter((r) => r.status === "✅ PASS");
  
  console.log(`✅ ${passes.length}/${results.length} tests passed`);
  
  if (failures.length === 0) {
    console.log("=".repeat(80) + "\n");
    process.exit(0);
  } else {
    console.log(`❌ ${failures.length} test(s) failed`);
    console.log("=".repeat(80) + "\n");
    process.exit(1);
  }
}

runE2ETests().catch((error) => {
  logger.error("E2E test script failed", { error: error.message });
  process.exit(1);
});
