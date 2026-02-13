import { NextRequest,NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendEmail } from '@/lib/email';
import { renderWeeklyBriefEmail,renderWeeklyBriefPlainText } from '@/lib/email-templates/weekly-brief';

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

    // Also get newsletter subscribers
    const newsletterSubscribers = await prisma.newsletterSubscriber.findMany({
      where: {
        status: "active",
      },
      select: {
        id: true,
        email: true,
        lastEmailSentAt: true,
        emailsSent: true,
      },
    });

    console.log(`[Weekly Briefs Cron] Found ${newsletterSubscribers.length} active newsletter subscribers`);

    let sent = 0;
    let skipped = 0;
    let failed = 0;

    // Send to registered users (personalized)
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
            summary: brief.html.substring(0, 200).replace(/<[^>]*>/g, "") + "...",
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
          // Update user email stats
          await prisma.user.update({
            where: { id: user.id },
            data: {
              lastEmailSentAt: new Date(),
            },
          });

          sent++;
          console.log(`[Weekly Briefs Cron] Sent to ${user.email}`);
        } else {
          console.error(`[Weekly Briefs Cron] Failed to send to ${user.email}:`, result.error);
          failed++;
        }

        // Rate limiting: small delay between emails
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (userError: any) {
        failed++;
        console.error(`[Weekly Briefs Cron] Error processing user ${user.email}:`, userError);
      }
    }

    // Send to newsletter subscribers (all briefs, no filtering)
    for (const subscriber of newsletterSubscribers) {
      try {
        // Get ALL executive briefs (no filtering for newsletter)
        const allBriefs = await prisma.thinkTankPublication.findMany({
          where: {
            type: "EXECUTIVE_BRIEF",
            status: "PUBLISHED",
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
        });

        if (allBriefs.length === 0) {
          console.log(`[Weekly Briefs Cron] No briefs to send to ${subscriber.email}`);
          skipped++;
          continue;
        }

        // Group all briefs by vertical for newsletter
        const newsletterBriefsByVertical: Record<string, any[]> = {};
        allBriefs.forEach(brief => {
          const verticalName = brief.vertical?.name || "General";
          if (!newsletterBriefsByVertical[verticalName]) {
            newsletterBriefsByVertical[verticalName] = [];
          }
          newsletterBriefsByVertical[verticalName].push({
            id: brief.id,
            title: brief.title,
            summary: brief.html.substring(0, 200).replace(/<[^>]*>/g, "") + "...",
            trustScore: brief.trustScore || 85,
            createdAt: brief.publishedAt?.toISOString() || brief.createdAt.toISOString(),
            verticalName: verticalName,
            verticalColor: brief.vertical?.color,
          });
        });

        // Generate URLs for newsletter subscriber
        const unsubscribeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/unsubscribe?email=${encodeURIComponent(subscriber.email)}`;
        const preferencesUrl = `${process.env.NEXT_PUBLIC_APP_URL}`;

        // Use same premium template for everyone
        const htmlContent = renderWeeklyBriefEmail({
          userName: "", // No personalization for newsletter
          selectedVerticals: allBriefs.map(b => b.vertical?.name).filter(Boolean),
          briefsByVertical: newsletterBriefsByVertical,
          weekStart: weekStartStr,
          weekEnd: weekEndStr,
          unsubscribeUrl,
          preferencesUrl,
        });

        const textContent = renderWeeklyBriefPlainText({
          userName: "",
          selectedVerticals: allBriefs.map(b => b.vertical?.name).filter(Boolean),
          briefsByVertical: newsletterBriefsByVertical,
          weekStart: weekStartStr,
          weekEnd: weekEndStr,
          unsubscribeUrl,
          preferencesUrl,
        });

        // Send email
        await sendEmail({
          to: subscriber.email,
          subject: `Your Weekly Intelligence Brief · ${weekStartStr} – ${weekEndStr}`,
          html: htmlContent,
          text: textContent,
        });

        // Update subscriber stats
        await prisma.newsletterSubscriber.update({
          where: { id: subscriber.id },
          data: {
            lastEmailSentAt: new Date(),
            emailsSent: subscriber.emailsSent + 1,
          },
        });

        sent++;
        console.log(`[Weekly Briefs Cron] Sent to newsletter subscriber ${subscriber.email}`);
      } catch (error) {
        console.error(`[Weekly Briefs Cron] Failed to send to ${subscriber.email}:`, error);
        failed++;
      }
    }

    console.log(`[Weekly Briefs Cron] Completed: ${sent} sent, ${skipped} skipped, ${failed} failed`);

    return NextResponse.json({
      success: true,
      message: "Weekly briefs delivered successfully",
      stats: { 
        sent, 
        skipped, 
        failed,
        users: users.length,
        newsletterSubscribers: newsletterSubscribers.length,
        totalRecipients: users.length + newsletterSubscribers.length
      },
    });

  } catch (error: any) {
    console.error("[Weekly Briefs Cron] Fatal error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
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
