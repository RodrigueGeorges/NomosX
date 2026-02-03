/**
 * Council Sessions API - Deliberation room operations
 * Council sessions are linked to Signals or Drafts
 */

const {NextRequest,NextResponse} = require('next/server');
const {prisma} = require('@/lib/db');
const {getSession} = require('@/lib/auth');

// GET /api/council-sessions - List council sessions
export async function GET(request: NextRequest) {
  try {
    const user = await getSession();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const signalId = searchParams.get("signalId");
    const draftId = searchParams.get("draftId");
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    const where: any = {
      userId: user.id,
    };

    if (signalId) where.signalId = signalId;
    if (draftId) where.draftId = draftId;
    if (status) where.status = status;

    const [sessions, total] = await Promise.all([
      prisma.councilSession.findMany({
        where,
        include: {
          signal: true,
          draft: true,
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.councilSession.count({ where }),
    ]);

    return NextResponse.json({
      sessions,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error("[API] GET /api/council-sessions error:", error);
    return NextResponse.json(
      { error: "Failed to fetch council sessions" },
      { status: 500 }
    );
  }
}

// POST /api/council-sessions - Create a new council session
export async function POST(request: NextRequest) {
  try {
    const user = await getSession();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { signalId, draftId, question } = body;

    // Must have signalId OR draftId
    if (!signalId && !draftId) {
      return NextResponse.json(
        { error: "Must provide signalId or draftId" },
        { status: 400 }
      );
    }

    if (!question) {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      );
    }

    // Validate signal or draft exists
    if (signalId) {
      const signal = await prisma.signal.findUnique({ where: { id: signalId } });
      if (!signal) {
        return NextResponse.json({ error: "Signal not found" }, { status: 404 });
      }
    }

    if (draftId) {
      const draft = await prisma.draft.findUnique({ where: { id: draftId } });
      if (!draft) {
        return NextResponse.json({ error: "Draft not found" }, { status: 404 });
      }
    }

    // Create council session
    const councilSession = await prisma.councilSession.create({
      data: {
        signalId: signalId || null,
        draftId: draftId || null,
        question,
        status: "PENDING",
        userId: user.id,
      },
      include: {
        signal: true,
        draft: true,
      },
    });

    return NextResponse.json({ session: councilSession }, { status: 201 });
  } catch (error) {
    console.error("[API] POST /api/council-sessions error:", error);
    return NextResponse.json(
      { error: "Failed to create council session" },
      { status: 500 }
    );
  }
}
