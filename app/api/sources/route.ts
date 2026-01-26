
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/sources - List recent sources
export async function GET() {
  try {
    const sources = await prisma.source.findMany({ 
      take: 18, 
      orderBy: [{ createdAt: "desc" }],
      select: {
        id: true,
        provider: true,
        qualityScore: true,
        title: true,
        authors: true,
        abstract: true,
        topics: true,
        year: true,
      },
    });
    
    return NextResponse.json({ sources });
  } catch (error: any) {
    console.error("[Sources GET] Error:", error);
    return NextResponse.json({ error: error.message, sources: [] }, { status: 500 });
  }
}
