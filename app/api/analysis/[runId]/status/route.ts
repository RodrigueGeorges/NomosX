/**
 * API Route: Get Analysis Run Status
 */

import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ runId: string }> }
) {
  try {
    // P2 FIX: Next.js 15+ params is a Promise
    const { runId } = await params;

    // Forward to backend
    const response = await fetch(`${BACKEND_URL}/api/v1/analysis/${runId}`, {
      headers: {
        "X-Correlation-Id": request.headers.get("x-correlation-id") || crypto.randomUUID(),
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      run: data.run,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Internal server error",
      message: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}
