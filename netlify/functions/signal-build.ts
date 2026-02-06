/**
 * NomosX Think Tank - Signal Build Scheduled Function
 * 
 * Runs daily at 03:00 UTC to detect signals from new sources
 */

import { prisma } from '../../lib/db';
import { signalDetector } from '../../lib/agent/signal-detector';

export const config = {
  schedule: "0 3 * * *"
};

type Handler = (event: any, context: any) => Promise<{ statusCode: number; body: string }>;

const handler: Handler = async (event, context) => {
  console.log("[SIGNAL-BUILD] Starting scheduled signal detection...");
  
  try {
    // Get sources created in the last 24 hours
    const since = new Date();
    since.setHours(since.getHours() - 24);
    
    const recentSources = await prisma.source.findMany({
      where: {
        createdAt: { gte: since },
        qualityScore: { gte: 70 }
      },
      select: { id: true }
    });
    
    if (recentSources.length === 0) {
      console.log("[SIGNAL-BUILD] No new sources in last 24h");
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "No new sources", detected: 0 })
      };
    }
    
    console.log(`[SIGNAL-BUILD] Processing ${recentSources.length} recent sources...`);
    
    const result = await signalDetector({
      sourceIds: recentSources.map(s => s.id)
    });
    
    console.log(`[SIGNAL-BUILD] ✅ Detected ${result.detected} signals`);
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Signal detection complete",
        detected: result.detected,
        byType: result.byType
      })
    };
  } catch (error: any) {
    console.error("[SIGNAL-BUILD] ❌ Error:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};

;
