
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/topics/[id] - Get single topic
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const topic = await prisma.topic.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            briefs: true,
            subscriptions: true,
            digests: true,
          },
        },
      },
    });

    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    return NextResponse.json({ topic });
  } catch (error: any) {
    console.error("[Topic GET] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH /api/topics/[id] - Update topic
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = req.headers.get("x-admin-key") || "";
  const required = process.env.ADMIN_KEY || "";
  if (required && admin !== required) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const { name, query, tags, description, isActive } = body;

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (query !== undefined) updateData.query = query;
    if (tags !== undefined) updateData.tags = tags;
    if (description !== undefined) updateData.description = description;
    if (isActive !== undefined) updateData.isActive = isActive;

    const topic = await prisma.topic.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ topic });
  } catch (error: any) {
    console.error("[Topic PATCH] Error:", error);
    
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }
    
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A topic with this name already exists" },
        { status: 409 }
      );
    }
    
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/topics/[id] - Delete topic
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = req.headers.get("x-admin-key") || "";
  const required = process.env.ADMIN_KEY || "";
  if (required && admin !== required) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await prisma.topic.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[Topic DELETE] Error:", error);
    
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }
    
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
