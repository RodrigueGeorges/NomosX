/**
 * NomosX Critical Loop Agent
 * 
 * Runs adversarial review before publication
 * Includes: METHODOLOGY_JUDGE, ADVERSARIAL_REVIEWER, DECISION_CALIBRATOR
 */

import OpenAI from 'openai';
import { CriticalLoopResult,MethodologyJudgment,AdversarialReview,CalibrationAssessment } from '@/lib/think-tank/types';

const ai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const MODEL = "gpt-4o";

// ============================================================================
// TYPES
// ============================================================================

interface CriticalLoopInput {
  draftHtml: string;
  sources: any[];
  readings?: any[];
}

// ============================================================================
// METHODOLOGY JUDGE
// ============================================================================

async function methodologyJudge(
  sources: any[],
  readings?: any[]
): Promise<MethodologyJudgment> {
  console.log(`[METHODOLOGY_JUDGE] Evaluating ${sources.length} sources...`);
  
  const sourceContext = sources.map((s, i) => {
    const reading = readings?.[i];
    return `[SRC-${i + 1}] ${s.title}
Provider: ${s.provider}
Year: ${s.year || "N/A"}
Quality: ${s.qualityScore || 0}/100
Citations: ${s.citationCount || 0}
Methods: ${reading?.methods?.join("; ") || "Not extracted"}
Limitations: ${reading?.limitations?.join("; ") || "Not stated"}`;
  }).join("\n\n");

  const prompt = `You are a methodology expert. Evaluate the research methodology quality of these sources.

SOURCES:
${sourceContext}

Score each dimension 0-100:
1. Study Design: RCT > quasi-experimental > observational > case study > theoretical
2. Sample Size: Adequacy for conclusions drawn
3. Statistical Rigor: Appropriate methods, significance levels
4. Replicability: Can findings be reproduced?
5. Bias Risk: Conflicts of interest, selection bias, publication bias

Return JSON:
{
  "overallScore": 0-100,
  "breakdown": {
    "studyDesign": 0-100,
    "sampleSize": 0-100,
    "statisticalRigor": 0-100,
    "replicability": 0-100,
    "biasRisk": 0-100 (higher = less bias)
  },
  "concerns": ["list of methodological concerns"],
  "recommendations": ["how to address concerns"],
  "passThreshold": true/false (score >= 60)
}`;

  try {
    const response = await ai.chat.completions.create({
      model: MODEL,
      temperature: 0.2,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    console.log(`[METHODOLOGY_JUDGE] Score: ${result.overallScore}/100`);
    
    return {
      overallScore: result.overallScore || 50,
      breakdown: result.breakdown || {
        studyDesign: 50,
        sampleSize: 50,
        statisticalRigor: 50,
        replicability: 50,
        biasRisk: 50
      },
      concerns: result.concerns || [],
      recommendations: result.recommendations || [],
      passThreshold: (result.overallScore || 50) >= 60
    };
  } catch (error: any) {
    console.error(`[METHODOLOGY_JUDGE] Error: ${error.message}`);
    return {
      overallScore: 50,
      breakdown: {
        studyDesign: 50,
        sampleSize: 50,
        statisticalRigor: 50,
        replicability: 50,
        biasRisk: 50
      },
      concerns: ["Evaluation failed"],
      recommendations: ["Manual review required"],
      passThreshold: false
    };
  }
}

// ============================================================================
// ADVERSARIAL REVIEWER
// ============================================================================

async function adversarialReviewer(
  draftHtml: string,
  sources: any[]
): Promise<AdversarialReview> {
  console.log(`[ADVERSARIAL_REVIEWER] Generating counter-arguments...`);
  
  const prompt = `You are an adversarial reviewer. Your job is to find the STRONGEST possible counter-arguments to this analysis. Be rigorous, not charitable.

DRAFT PUBLICATION:
${draftHtml.slice(0, 4000)}

NUMBER OF SOURCES: ${sources.length}

For each major claim in the draft:
1. Find the strongest counter-argument
2. Identify evidence that supports the counter (if any)
3. Note blind spots in the analysis
4. Provide the "steel man" version of the opposing view

Return JSON:
{
  "overallScore": 0-100 (how well does draft handle counter-arguments),
  "counterArguments": [
    {
      "targetClaim": "the claim being challenged",
      "counterArgument": "the strongest counter",
      "strength": "strong|moderate|weak",
      "sourceSupport": ["SRC-N if counter has evidence"]
    }
  ],
  "blindSpots": ["perspectives not considered"],
  "steelManVersion": "strongest version of opposing view",
  "recommendations": ["how to improve"],
  "passThreshold": true/false (score >= 55)
}`;

  try {
    const response = await ai.chat.completions.create({
      model: MODEL,
      temperature: 0.3,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    console.log(`[ADVERSARIAL_REVIEWER] Score: ${result.overallScore}/100`);
    
    return {
      overallScore: result.overallScore || 60,
      counterArguments: result.counterArguments || [],
      blindSpots: result.blindSpots || [],
      steelManVersion: result.steelManVersion || "",
      recommendations: result.recommendations || [],
      passThreshold: (result.overallScore || 60) >= 55
    };
  } catch (error: any) {
    console.error(`[ADVERSARIAL_REVIEWER] Error: ${error.message}`);
    return {
      overallScore: 55,
      counterArguments: [],
      blindSpots: ["Review failed"],
      steelManVersion: "",
      recommendations: ["Manual review required"],
      passThreshold: false
    };
  }
}

// ============================================================================
// DECISION CALIBRATOR
// ============================================================================

async function decisionCalibrator(
  draftHtml: string
): Promise<CalibrationAssessment> {
  console.log(`[DECISION_CALIBRATOR] Assessing confidence calibration...`);
  
  const prompt = `You are a calibration expert. Assess whether confidence levels in this analysis are well-calibrated.

DRAFT PUBLICATION:
${draftHtml.slice(0, 4000)}

CALIBRATION RULES:
- Single source claim: max 60% confidence
- 2-3 sources agreeing: max 75% confidence
- 4+ sources agreeing: max 85% confidence
- Meta-analysis: max 90% confidence
- Never 100% for empirical claims

For each major claim, assess:
1. Stated confidence (implicit or explicit)
2. Calibrated confidence (what it should be)
3. Gap (overconfidence if positive)

Return JSON:
{
  "overallScore": 0-100,
  "claimAssessments": [
    {
      "claim": "the claim text",
      "statedConfidence": 0-100,
      "calibratedConfidence": 0-100,
      "gap": -100 to 100,
      "reasoning": "why this calibration"
    }
  ],
  "uncertaintyQuantification": {
    "adequate": true/false,
    "missing": ["what uncertainty is not addressed"],
    "recommendations": ["how to improve"]
  },
  "hedgingQuality": {
    "score": 0-100,
    "overHedged": ["claims that are too cautious"],
    "underHedged": ["claims that need more caution"]
  },
  "passThreshold": true/false (score >= 50)
}`;

  try {
    const response = await ai.chat.completions.create({
      model: MODEL,
      temperature: 0.2,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    console.log(`[DECISION_CALIBRATOR] Score: ${result.overallScore}/100`);
    
    return {
      overallScore: result.overallScore || 60,
      claimAssessments: result.claimAssessments || [],
      uncertaintyQuantification: result.uncertaintyQuantification || {
        adequate: true,
        missing: [],
        recommendations: []
      },
      hedgingQuality: result.hedgingQuality || {
        score: 60,
        overHedged: [],
        underHedged: []
      },
      passThreshold: (result.overallScore || 60) >= 50
    };
  } catch (error: any) {
    console.error(`[DECISION_CALIBRATOR] Error: ${error.message}`);
    return {
      overallScore: 50,
      claimAssessments: [],
      uncertaintyQuantification: {
        adequate: false,
        missing: ["Calibration failed"],
        recommendations: ["Manual review required"]
      },
      hedgingQuality: {
        score: 50,
        overHedged: [],
        underHedged: []
      },
      passThreshold: false
    };
  }
}

// ============================================================================
// MAIN CRITICAL LOOP
// ============================================================================

export async function runCriticalLoop(
  input: CriticalLoopInput
): Promise<CriticalLoopResult> {
  console.log(`[CRITICAL_LOOP] Running adversarial review...`);
  
  // Run all three agents in parallel
  const [methodology, adversarial, calibration] = await Promise.all([
    methodologyJudge(input.sources, input.readings),
    adversarialReviewer(input.draftHtml, input.sources),
    decisionCalibrator(input.draftHtml)
  ]);
  
  // Compute composite score
  const compositeScore = Math.round(
    methodology.overallScore * 0.35 +
    adversarial.overallScore * 0.35 +
    calibration.overallScore * 0.30
  );
  
  // Determine if human review needed
  const needsHumanReview = 
    !methodology.passThreshold ||
    !adversarial.passThreshold ||
    !calibration.passThreshold ||
    compositeScore < 60;
  
  // Collect all recommendations
  const recommendations = [
    ...methodology.recommendations,
    ...adversarial.recommendations,
    ...calibration.uncertaintyQuantification.recommendations
  ];
  
  console.log(`[CRITICAL_LOOP] Composite score: ${compositeScore}/100, needs review: ${needsHumanReview}`);
  
  return {
    compositeScore,
    methodology,
    adversarial,
    calibration,
    needsHumanReview,
    recommendations
  };
}
