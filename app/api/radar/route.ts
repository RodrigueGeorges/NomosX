import { NextRequest, NextResponse } from "next/server";
import { generateRadarCards } from "@/lib/agent/radar-agent";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limitStr = searchParams.get("limit");
    const limit = limitStr ? parseInt(limitStr, 10) : 5;

    const cards = await generateRadarCards(limit);

    return NextResponse.json({ cards });
  } catch (error: any) {
    console.error("[API /radar] Error:", error);
    return NextResponse.json(
      { error: "Failed to generate radar cards", details: error.message },
      { status: 500 }
    );
  }
}
