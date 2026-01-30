import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { renderWeeklyBriefEmail, renderWeeklyBriefPlainText } from "@/lib/email-templates/weekly-brief";

/**
 * POST /api/cron/weekly-briefs
 * 
 * Cron job to send weekly personalized briefs to users
 * Triggered weekly (Monday 8am) via Netlify scheduled functions or external cron
 * 
 * Authorization: Requires CRON_SECRET header for security
 */
export async function POST(req: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("[Weekly Briefs Cron] Starting weekly brief delivery...");

    // Get date range for this week
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 7);
    const weekStartStr = weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const weekEndStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

    // Get all users with email enabled
    const users = await prisma.user.findMany({
      where: {
        emailEnabled: true,
        emailFrequency: "WEEKLY",
      },
      include: {
        verticalPreferences: {
          where: { enabled: true },
          include: {
            vertical: {
              select: {
                id: true,
                slug: true,
                name: true,
                color: true,
              },
            },
          },
        },
      },
    });

    console.log(`[Weekly Briefs Cron] Found ${users.length} users with weekly email enabled`);

    let sent = 0;
    let skipped = 0;
    let failed = 0;

    for (const user of users) {
      try {
        // Skip if no vertical preferences
        if (user.verticalPreferences.length === 0) {
          console.log(`[Weekly Briefs Cron] Skipping user ${user.email} - no vertical preferences`);
          skipped++;
          continue;
        }

        // Get vertical IDs
        const verticalIds = user.verticalPreferences.map(vp => vp.verticalId);
        const selectedVerticals = user.verticalPreferences.map(vp => vp.vertical.name);

        // Get latest briefs from user's selected verticals (last 7 days)
        const briefs = await prisma.thinkTankPublication.findMany({
          where: {
            type: "EXECUTIVE_BRIEF",
            status: "PUBLISHED",
            verticalId: { in: verticalIds },
            publishedAt: {
              gte: weekStart,
              lte: now,
            },
          },
          include: {
            vertical: {
              select: {
                name: true,
                color: true,
              },
            },
          },
          orderBy: {
            publishedAt: "desc",
          },
          take: 10, // Max 10 briefs per email
        });

        // Skip if no new briefs
        if (briefs.length === 0) {
          console.log(`[Weekly Briefs Cron] Skipping user ${user.email} - no new briefs`);
          skipped++;
          continue;
        }

        // Group briefs by vertical
        const briefsByVertical: Record<string, any[]> = {};
        briefs.forEach(brief => {
          const verticalName = brief.vertical?.name || "General";
          if (!briefsByVertical[verticalName]) {
            briefsByVertical[verticalName] = [];
          }
          briefsByVertical[verticalName].push({
            id: brief.id,
            title: brief.title,
            summary: brief.summary || brief.content?.substring(0, 200) + "..." || "",
            trustScore: brief.trustScore || 85,
            createdAt: brief.publishedAt?.toISOString() || brief.createdAt.toISOString(),
            verticalName: verticalName,
            verticalColor: brief.vertical?.color,
          });
        });

        // Generate unsubscribe URL (unique token per user)
        const unsubscribeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?email=${encodeURIComponent(user.email)}`;
        const preferencesUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/preferences`;

        // Render email
        const htmlContent = renderWeeklyBriefEmail({
          userName: user.name || "",
          selectedVerticals,
          briefsByVertical,
          weekStart: weekStartStr,
          weekEnd: weekEndStr,
          unsubscribeUrl,
          preferencesUrl,
        });

        const textContent = renderWeeklyBriefPlainText({
          userName: user.name || "",
          selectedVerticals,
          briefsByVertical,
          weekStart: weekStartStr,
          weekEnd: weekEndStr,
          unsubscribeUrl,
          preferencesUrl,
        });

        // Send email
        const result = await sendEmail({
          to: user.email,
          subject: `Your Weekly Intelligence Brief · ${weekEndStr}`,
          html: htmlContent,
          text: textContent,
        });

        if (result.success) {
          // Update last email sent timestamp
          await prisma.user.update({
            where: { id: user.id },
            data: { lastEmailSentAt: now },
          });

          sent++;
          console.log(`[Weekly Briefs Cron] Sent to ${user.email} (${briefs.length} briefs)`);
        } else {
          failed++;
          console.error(`[Weekly Briefs Cron] Failed to send to ${user.email}:`, result.error);
        }

        // Rate limiting: small delay between emails
        await new Promise(resolve => setTimeout(resolve, 200));

      } catch (userError: any) {
        failed++;
        console.error(`[Weekly Briefs Cron] Error processing user ${user.email}:`, userError);
      }
    }

    console.log(`[Weekly Briefs Cron] Completed: ${sent} sent, ${skipped} skipped, ${failed} failed`);

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers: users.length,
        sent,
        skipped,
        failed,
      },
    });

  } catch (error: any) {
    console.error("[Weekly Briefs Cron] Fatal error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

// GET endpoint for manual testing (admin only)
export async function GET(req: NextRequest) {
  // Check if user is admin
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { error: "Unauthorized - Admin only" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    message: "Weekly briefs cron endpoint",
    usage: "POST with Authorization: Bearer <CRON_SECRET>",
    schedule: "Weekly on Monday 8am UTC",
  });
}
