/**
 * Drafts API - CRUD operations for publication drafts
 * Part of the Publication Studio workflow
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

// GET /api/drafts - List drafts with filters
export async function GET(request: NextRequest) {
  try {
    const user = await getSession();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const verticalId = searchParams.get("verticalId");
    const type = searchParams.get("type");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    const where: any = {
      userId: user.id,
    };

    if (status) where.status = status;
    if (verticalId) where.verticalId = verticalId;
    if (type) where.type = type;

    const [drafts, total] = await Promise.all([
      prisma.draft.findMany({
        where,
        include: {
          vertical: true,
          signal: true,
        },
        orderBy: { updatedAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.draft.count({ where }),
    ]);

    return NextResponse.json({
      drafts,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error("[API] GET /api/drafts error:", error);
    return NextResponse.json(
      { error: "Failed to fetch drafts" },
      { status: 500 }
    );
  }
}

// POST /api/drafts - Create a new draft
export async function POST(request: NextRequest) {
  try {
    const user = await getSession();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { verticalId, signalId, type, question, title } = body;

    if (!verticalId || !type || !question) {
      return NextResponse.json(
        { error: "Missing required fields: verticalId, type, question" },
        { status: 400 }
      );
    }

    // Validate vertical exists
    const vertical = await prisma.vertical.findUnique({
      where: { id: verticalId },
    });

    if (!vertical) {
      return NextResponse.json(
        { error: "Vertical not found" },
        { status: 404 }
      );
    }

    // Create draft
    const draft = await prisma.draft.create({
      data: {
        verticalId,
        signalId: signalId || null,
        type,
        question,
        title: title || null,
        status: "DRAFT",
        userId: user.id,
      },
      include: {
        vertical: true,
        signal: true,
      },
    });

    return NextResponse.json({ draft }, { status: 201 });
  } catch (error) {
    console.error("[API] POST /api/drafts error:", error);
    return NextResponse.json(
      { error: "Failed to create draft" },
      { status: 500 }
    );
  }
}
