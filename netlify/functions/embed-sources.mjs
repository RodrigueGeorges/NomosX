/**
 * Netlify scheduled function: Generate embeddings for sources without them
 * Runs every day at 4 AM UTC
 */

import { PrismaClient } from "@prisma/client";
import { embedSources } from "../../lib/embeddings.js";

export const config = {
  schedule: "0 4 * * *"
};

const prisma = new PrismaClient();

export async function handler(event, context) {
  console.log("[EmbedSources] Starting scheduled embedding generation");
  
  try {
    // Find sources without embeddings
    const sources = await prisma.source.findMany({
      where: {
        embeddings: null,
        abstract: { not: null },
      },
      take: 50, // Batch size to avoid timeout
      select: { id: true },
    });
    
    console.log(`[EmbedSources] Found ${sources.length} sources to embed`);
    
    if (sources.length === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          message: "No sources to embed",
        }),
      };
    }
    
    // Generate embeddings
    const result = await embedSources(sources.map((s) => s.id));
    
    console.log(`[EmbedSources] Embedded ${result.success}/${sources.length} sources`);
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        embedded: result.success,
        failed: result.failed,
      }),
    };
  } catch (error) {
    console.error("[EmbedSources] Failed:", error);
    
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
