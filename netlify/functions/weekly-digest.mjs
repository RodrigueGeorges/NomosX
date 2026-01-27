/**
 * Netlify scheduled function: Weekly digest generation
 * Runs every Monday at 10 AM UTC
 */

import { PrismaClient } from "@prisma/client";

export const config = {
  schedule: "0 10 * * 1"
};

const prisma = new PrismaClient();

function getWeekIdentifier() {
  const now = new Date();
  const year = now.getFullYear();
  const weekNumber = Math.ceil((now.getDate() + 6 - now.getDay()) / 7);
  return `${year}-W${String(weekNumber).padStart(2, "0")}`;
}

export async function handler(event, context) {
  console.log("[WeeklyDigest] Starting scheduled digest generation");
  
  try {
    // Get all active topics with subscriptions
    const topics = await prisma.topic.findMany({
      where: {
        isActive: true,
        subscriptions: {
          some: {
            isActive: true,
            frequency: "weekly",
          },
        },
      },
      include: {
        subscriptions: {
          where: {
            isActive: true,
            frequency: "weekly",
          },
        },
      },
    });
    
    console.log(`[WeeklyDigest] Found ${topics.length} topics with weekly subscriptions`);
    
    const period = getWeekIdentifier();
    
    // Create digest jobs
    for (const topic of topics) {
      // Check if digest already exists
      const existing = await prisma.digest.findUnique({
        where: {
          topicId_period: {
            topicId: topic.id,
            period,
          },
        },
      });
      
      if (existing) {
        console.log(`[WeeklyDigest] Digest already exists for ${topic.name} (${period})`);
        continue;
      }
      
      // Create digest job
      await prisma.job.create({
        data: {
          type: "GENERATE_DIGEST",
          payload: {
            topicId: topic.id,
            period,
          },
          priority: 3,
        },
      });
      
      console.log(`[WeeklyDigest] Enqueued digest job for topic: ${topic.name}`);
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: `Enqueued digest jobs for ${topics.length} topics`,
        period,
      }),
    };
  } catch (error) {
    console.error("[WeeklyDigest] Failed:", error);
    
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
