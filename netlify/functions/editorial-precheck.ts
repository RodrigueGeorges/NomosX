/**
 * NomosX Think Tank - Editorial Precheck Scheduled Function
 * 
 * Runs daily at 06:00 UTC to evaluate pending signals
 */

import { evaluatePendingSignals } from '../../lib/agent/editorial-gate';

export const config = {
  schedule: "0 6 * * *"
};

type Handler = (event: any, context: any) => Promise<{ statusCode: number; body: string }>;

const handler: Handler = async (event, context) => {
  console.log("[EDITORIAL-PRECHECK] Starting scheduled evaluation...");
  
  try {
    const result = await evaluatePendingSignals();
    
    console.log(`[EDITORIAL-PRECHECK] ✅ Evaluated ${result.evaluated} signals`);
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Editorial precheck complete",
        ...result
      })
    };
  } catch (error: any) {
    console.error("[EDITORIAL-PRECHECK] ❌ Error:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};

;
