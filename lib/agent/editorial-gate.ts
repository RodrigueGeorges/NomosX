/**
 * NomosX Editorial Gate Agent
 * 
 * Evaluates signals for publication readiness
 * Runs all gate checks in sequence
 */

import { prisma } from "@/lib/db";
import { 
  EditorialChecks, 
  EditorialDecisionType,
  SIGNAL_THRESHOLDS,
  FORBIDDEN_PHRASES,
  VerticalConfig
} from "@/lib/think-tank/types";
import { cadenceEnforcer } from "./cadence-enforcer";

// ============================================================================
// TYPES
// ============================================================================

interface EditorialGateInput {
  signalId: string;
  draftHtml?: string; // Optional: for content checks
}

interface EditorialGateOutput {
  decision: EditorialDecisionType;
  reasons: string[];
  checks: EditorialChecks;
  humanReviewRequired: boolean;
}

// ============================================================================
// INDIVIDUAL CHECKS
// ============================================================================

async function checkCadence(verticalId: string): Promise<{ passed: boolean; details: string }> {
  const result = await cadenceEnforcer({ verticalId });
  
  if (result.allowed) {
    return { passed: true, details: "Cadence OK" };
  }
  
  return { 
    passed: false, 
    details: result.reason || "Cadence limit reached"
  };
}

function checkThreshold(signal: any): { passed: boolean; details: string } {
  const priority = signal.priorityScore || 0;
  
  if (priority < SIGNAL_THRESHOLDS.MIN_PRIORITY_FOR_PUBLICATION) {
    return {
      passed: false,
      details: `Priority ${priority} < ${SIGNAL_THRESHOLDS.MIN_PRIORITY_FOR_PUBLICATION} minimum`
    };
  }
  
  return { passed: true, details: `Priority ${priority} meets threshold` };
}

function checkQuality(signal: any, config: VerticalConfig): { passed: boolean; score: number } {
  const avgQuality = signal.confidenceScore || 0;
  const minRequired = config.thresholds.minTrustScore;
  
  return {
    passed: avgQuality >= minRequired,
    score: avgQuality
  };
}

function checkCitation(draftHtml?: string): { passed: boolean; coverage: number } {
  if (!draftHtml) {
    // No draft yet, assume will pass
    return { passed: true, coverage: 1.0 };
  }
  
  // Count [SRC-N] citations
  const citationPattern = /\[SRC-\d+\]/g;
  const citations = draftHtml.match(citationPattern) || [];
  
  // For now, just check if there are citations
  // Full coverage check happens after claim extraction
  const hasCitations = citations.length > 0;
  
  return {
    passed: hasCitations,
    coverage: hasCitations ? 1.0 : 0
  };
}

function checkForbiddenPatterns(draftHtml?: string): { passed: boolean; matches: string[] } {
  if (!draftHtml) {
    return { passed: true, matches: [] };
  }
  
  const lowerHtml = draftHtml.toLowerCase();
  const matches = FORBIDDEN_PHRASES.filter(phrase => lowerHtml.includes(phrase.toLowerCase()));
  
  return {
    passed: matches.length === 0,
    matches
  };
}

function checkMethodology(signal: any): { passed: boolean; score: number; flagged: boolean } {
  // Placeholder - will be replaced by METHODOLOGY_JUDGE agent
  const score = signal.confidenceScore || 50;
  const passed = score >= 60;
  const flagged = score < 60;
  
  return { passed, score, flagged };
}

function checkAdversarial(signal: any): { passed: boolean; score: number; flagged: boolean } {
  // Placeholder - will be replaced by ADVERSARIAL_REVIEWER agent
  const score = 70; // Default pass
  const passed = score >= 55;
  const flagged = score < 55;
  
  return { passed, score, flagged };
}

function checkCalibration(signal: any): { passed: boolean; score: number; flagged: boolean } {
  // Placeholder - will be replaced by DECISION_CALIBRATOR agent
  const score = 65; // Default pass
  const passed = score >= 50;
  const flagged = score < 50;
  
  return { passed, score, flagged };
}

// ============================================================================
// MAIN GATE
// ============================================================================

export async function editorialGate(input: EditorialGateInput): Promise<EditorialGateOutput> {
  console.log(`[EDITORIAL_GATE] Evaluating signal ${input.signalId}...`);
  
  // Fetch signal with vertical
  const signal = await prisma.signal.findUnique({
    where: { id: input.signalId },
    include: { vertical: true }
  });
  
  if (!signal) {
    return {
      decision: "REJECT",
      reasons: ["Signal not found"],
      checks: createEmptyChecks(),
      humanReviewRequired: false
    };
  }
  
  const config = signal.vertical.config as VerticalConfig;
  const reasons: string[] = [];
  let decision: EditorialDecisionType = "APPROVE";
  let humanReviewRequired = false;
  
  // Run all checks
  const checks: EditorialChecks = {
    cadence: await checkCadence(signal.verticalId),
    threshold: checkThreshold(signal),
    quality: checkQuality(signal, config),
    citation: checkCitation(input.draftHtml),
    forbiddenPatterns: checkForbiddenPatterns(input.draftHtml),
    methodology: checkMethodology(signal),
    adversarial: checkAdversarial(signal),
    calibration: checkCalibration(signal)
  };
  
  // Evaluate hard checks (REJECT or HOLD)
  if (!checks.cadence.passed) {
    decision = "HOLD";
    reasons.push(`Cadence: ${checks.cadence.details}`);
  }
  
  if (!checks.threshold.passed) {
    decision = "REJECT";
    reasons.push(`Threshold: ${checks.threshold.details}`);
  }
  
  if (!checks.quality.passed) {
    decision = "REJECT";
    reasons.push(`Quality score ${checks.quality.score} below minimum`);
  }
  
  if (!checks.citation.passed) {
    decision = "REJECT";
    reasons.push(`Citation coverage ${Math.round(checks.citation.coverage * 100)}% insufficient`);
  }
  
  if (!checks.forbiddenPatterns.passed) {
    decision = "REJECT";
    reasons.push(`Forbidden patterns detected: ${checks.forbiddenPatterns.matches.join(", ")}`);
  }
  
  // Evaluate soft checks (FLAG for human review)
  if (checks.methodology.flagged) {
    humanReviewRequired = true;
    reasons.push(`Methodology score ${checks.methodology.score} flagged for review`);
  }
  
  if (checks.adversarial.flagged) {
    humanReviewRequired = true;
    reasons.push(`Adversarial score ${checks.adversarial.score} flagged for review`);
  }
  
  if (checks.calibration.flagged) {
    humanReviewRequired = true;
    reasons.push(`Calibration score ${checks.calibration.score} flagged for review`);
  }
  
  // If human review required but otherwise passing, HOLD
  if (humanReviewRequired && decision === "APPROVE") {
    decision = "HOLD";
    reasons.push("Requires human review");
  }
  
  // If no issues, add success reason
  if (reasons.length === 0) {
    reasons.push("All checks passed");
  }
  
  console.log(`[EDITORIAL_GATE] Decision: ${decision} (${reasons.join("; ")})`);
  
  // Store decision
  await prisma.editorialDecision.create({
    data: {
      signalId: signal.id,
      verticalId: signal.verticalId,
      decision,
      reasons,
      checks: checks as any,
      humanReviewRequired
    }
  });
  
  // Update signal status
  const newStatus = decision === "APPROVE" ? "PUBLISHED" : 
                    decision === "HOLD" ? "HELD" : "REJECTED";
  
  await prisma.signal.update({
    where: { id: signal.id },
    data: { status: newStatus }
  });
  
  return {
    decision,
    reasons,
    checks,
    humanReviewRequired
  };
}

// ============================================================================
// HELPERS
// ============================================================================

function createEmptyChecks(): EditorialChecks {
  return {
    cadence: { passed: false, details: "Not evaluated" },
    threshold: { passed: false, details: "Not evaluated" },
    quality: { passed: false, score: 0 },
    citation: { passed: false, coverage: 0 },
    forbiddenPatterns: { passed: false, matches: [] },
    methodology: { passed: false, score: 0, flagged: true },
    adversarial: { passed: false, score: 0, flagged: true },
    calibration: { passed: false, score: 0, flagged: true }
  };
}

// ============================================================================
// BATCH EVALUATION
// ============================================================================

export async function evaluatePendingSignals(): Promise<{
  evaluated: number;
  approved: number;
  held: number;
  rejected: number;
}> {
  console.log(`[EDITORIAL_GATE] Evaluating pending signals...`);
  
  const pendingSignals = await prisma.signal.findMany({
    where: { status: "NEW" },
    orderBy: { priorityScore: "desc" },
    take: 20 // Process top 20 by priority
  });
  
  let approved = 0;
  let held = 0;
  let rejected = 0;
  
  for (const signal of pendingSignals) {
    const result = await editorialGate({ signalId: signal.id });
    
    switch (result.decision) {
      case "APPROVE": approved++; break;
      case "HOLD": held++; break;
      case "REJECT": rejected++; break;
    }
  }
  
  console.log(`[EDITORIAL_GATE] Evaluated ${pendingSignals.length}: ${approved} approved, ${held} held, ${rejected} rejected`);
  
  return {
    evaluated: pendingSignals.length,
    approved,
    held,
    rejected
  };
}
