
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { analyst,citationGuard,renderBriefHTML,rank } from '@/lib/agent/pipeline-v2';
import { getSession } from '@/lib/auth';
import { assertRateLimit, RateLimitError } from '@/lib/security/rate-limit';

// GET /api/briefs - List all briefs
export async function GET(req: Request) {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "30", 10);

    const briefs = await prisma.brief.findMany({
      take: limit,
      orderBy: [{ createdAt: "desc" }],
      select: {
        id: true,
        publicId: true,
        question: true,
        kind: true,
        createdAt: true,
        sources: true,
      },
    });

    return NextResponse.json({ briefs });
  } catch (error: any) {
    console.error("[API /briefs GET] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch briefs" },
      { status: 500 }
    );
  }
}

// POST /api/briefs - Create a new brief
export async function POST(req: Request) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    assertRateLimit(`briefs:user:${user.id}`, 5, 60_000);
  } catch (err) {
    if (err instanceof RateLimitError) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429, headers: { 'Retry-After': String(Math.ceil(err.retryAfterMs / 1000)) } }
      );
    }
    throw err;
  }

  const { question } = await req.json().catch(() => ({}));
  const q = String(question || "").trim();
  if (!q) return NextResponse.json({ error: "question_required" }, { status: 400 });

  const sources = await rank(q, 10);
  const out = await analyst(q, sources);
  const guard = citationGuard(out, sources.length);
  if (!guard.ok) return NextResponse.json({ error: "citation_guard_failed", details: guard }, { status: 422 });

  const html = renderBriefHTML(out, sources);
  const brief = await prisma.brief.create({ data: { kind: "brief", question: q, html, sources: sources.map(s => s.id), publicId: null } });
  await prisma.brief.update({ where: { id: brief.id }, data: { publicId: brief.id } });

  return NextResponse.json({ id: brief.id, html });
}
