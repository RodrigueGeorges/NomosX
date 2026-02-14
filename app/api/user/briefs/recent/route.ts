import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

/**
 * GET /api/user/briefs/recent
 * 
 * Returns recent briefs for dashboard
 * Respects subscription tier for content access
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.email },
      include: { subscription: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const subscription = user.subscription;
    const tier = subscription?.plan || 'TRIAL';

    // Get recent briefs
    const briefs = await prisma.thinkTankPublication.findMany({
      where: {
        status: "PUBLISHED",
        publishedAt: { not: null },
      },
      orderBy: { publishedAt: 'desc' },
      take: 12,
      select: {
        id: true,
        title: true,
        type: true,
        publishedAt: true,
        wordCount: true,
        html: true,
        // Add trending/critical flags based on recent activity
      },
    });

    // Transform for dashboard
    const transformedBriefs = briefs.map(brief => {
      // Determine if trending (published in last 48h)
      const publishedAt = new Date(brief.publishedAt!);
      const now = new Date();
      const hoursSincePublished = (now.getTime() - publishedAt.getTime()) / (1000 * 60 * 60);
      const isTrending = hoursSincePublished <= 48;
      
      // Determine if critical (based on keywords)
      const criticalKeywords = ['crisis', 'urgent', 'critical', 'breakthrough', 'disruption'];
      const isCritical = criticalKeywords.some(keyword => 
        brief.title.toLowerCase().includes(keyword)
      );

      // Estimate read time
      const readTime = Math.max(1, Math.ceil(brief.wordCount / 200));

      return {
        id: brief.id,
        title: brief.title,
        type: brief.type, // Keep original type for frontend mapping
        publishedAt: brief.publishedAt!.toISOString(),
        readTime,
        trending: isTrending,
        critical: isCritical,
        // For TRIAL users, we'll show limited preview
        preview: tier === 'TRIAL' ? brief.html.substring(0, 200) + '...' : null,
      };
    });

    return NextResponse.json({
      briefs: transformedBriefs,
      tier,
      canAccessFull: tier !== 'TRIAL',
    });

  } catch (error) {
    console.error('[API/User/Briefs/Recent] Error:', error);
    return NextResponse.json(
      { error: "Failed to fetch briefs" },
      { status: 500 }
    );
  }
}
