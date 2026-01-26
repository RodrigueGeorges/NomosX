/**
 * Netlify scheduled function: Daily ingestion for active topics
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function handler(event, context) {
  console.log("[DailyIngest] Starting scheduled ingestion");
  
  try {
    // Get all active topics
    const topics = await prisma.topic.findMany({
      where: { isActive: true },
    });
    
    console.log(`[DailyIngest] Found ${topics.length} active topics`);
    
    // Create SCOUT jobs for each topic
    for (const topic of topics) {
      await prisma.job.create({
        data: {
          type: "SCOUT",
          payload: {
            query: topic.query,
            providers: ["openalex", "crossref"],
            perProvider: 10,
          },
          priority: 5,
        },
      });
      
      console.log(`[DailyIngest] Enqueued SCOUT job for topic: ${topic.name}`);
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: `Enqueued ${topics.length} ingestion jobs`,
      }),
    };
  } catch (error) {
    console.error("[DailyIngest] Failed:", error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message,
      }),
    };
  } finally {
    await prisma.$disconnect();
  }
}
