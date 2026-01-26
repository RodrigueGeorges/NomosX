
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/topics - List all topics
export async function GET() {
  try {
    const topics = await prisma.topic.findMany({
      orderBy: { createdAt: "desc" },
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
    
    return NextResponse.json({ topics });
  } catch (error: any) {
    console.error("[Topics GET] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/topics - Create new topic
export async function POST(req: Request) {
  const admin = req.headers.get("x-admin-key") || "";
  const required = process.env.ADMIN_KEY || "";
  if (required && admin !== required) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, query, tags, description, isActive } = body;

    if (!name || !query) {
      return NextResponse.json(
        { error: "name and query are required" },
        { status: 400 }
      );
    }

    const topic = await prisma.topic.create({
      data: {
        name,
        query,
        tags: tags || [],
        description: description || null,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json({ topic }, { status: 201 });
  } catch (error: any) {
    console.error("[Topics POST] Error:", error);
    
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A topic with this name already exists" },
        { status: 409 }
      );
    }
    
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
