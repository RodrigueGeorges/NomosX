/**
 * NomosX Think Tank - Cadence Reset Scheduled Function
 * 
 * Runs daily at 00:00 UTC to reset expired counters
 */

import { resetDailyCounters,resetWeeklyCounters } from '../../lib/agent/cadence-enforcer';

export const config = {
  schedule: "0 0 * * *"
};

type Handler = (event: any, context: any) => Promise<{ statusCode: number; body: string }>;

const handler: Handler = async (event, context) => {
  console.log("[CADENCE-RESET] Starting scheduled reset...");
  
  try {
    const dailyReset = await resetDailyCounters();
    const weeklyReset = await resetWeeklyCounters();
    
    console.log(`[CADENCE-RESET] ✅ Reset ${dailyReset} daily, ${weeklyReset} weekly counters`);
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Cadence reset complete",
        dailyReset,
        weeklyReset
      })
    };
  } catch (error: any) {
    console.error("[CADENCE-RESET] ❌ Error:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};

;
