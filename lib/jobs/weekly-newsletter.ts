/**
 * Weekly Newsletter Job
 * 
 * Compiles 3-5 publications based on user tier:
 * - FREE: Summary Briefs (1 page)
 * - EXECUTIVE: Executive Briefs (2-3 pages) 
 * - STRATEGY: Strategic Reports (10-15 pages)
 * 
 * Schedule: Every Monday at 8:00 AM UTC
 * Run with: npx tsx lib/jobs/weekly-newsletter.ts
 */

import { prisma } from '@/lib/db';
import { sendBulkNewsletter } from '@/lib/email';

// Newsletter HTML template
function generateNewsletterHTML(
  edition: { number: number; date: string },
  briefs: Array<{
    id: string;
    title: string;
    summary: string;
    sourceCount: number;
    publicId?: string;
  }>
): string {
  const briefsHTML = briefs.map((brief, i) => `
    <div style="margin-bottom: 32px; padding-bottom: 32px; border-bottom: 1px solid #e5e7eb;">
      <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px;">
        Brief ${i + 1} of ${briefs.length}
      </div>
      <h2 style="font-size: 20px; font-weight: 600; color: #111827; margin: 0 0 12px 0; line-height: 1.3;">
        ${brief.title}
      </h2>
      <p style="font-size: 15px; color: #4b5563; line-height: 1.6; margin: 0 0 16px 0;">
        ${brief.summary}
      </p>
      <div style="display: flex; align-items: center; gap: 16px;">
        <span style="font-size: 13px; color: #9ca3af;">${brief.sourceCount} sources</span>
        <a href="https://nomosx.com/s/${brief.publicId || brief.id}" 
           style="font-size: 14px; color: #0891b2; text-decoration: none; font-weight: 500;">
          Read full brief →
        </a>
      </div>
    </div>
  `).join("");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NomosX Weekly - Edition ${edition.number}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 40px;">
      <div style="display: inline-block; padding: 8px 16px; background: linear-gradient(135deg, #0891b2 0%, #3b82f6 100%); border-radius: 8px; margin-bottom: 16px;">
        <span style="font-size: 24px; font-weight: 700; color: white; letter-spacing: -0.5px;">
          Nomos<span style="color: #67e8f9;">X</span>
        </span>
      </div>
      <h1 style="font-size: 28px; font-weight: 300; color: #111827; margin: 0 0 8px 0;">
        Executive Briefs
      </h1>
      <p style="font-size: 14px; color: #6b7280; margin: 0;">
        Edition ${edition.number} • ${edition.date}
      </p>
    </div>

    <!-- Intro -->
    <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 32px; border: 1px solid #e5e7eb;">
      <p style="font-size: 15px; color: #4b5563; line-height: 1.6; margin: 0;">
        This week, the NomosX Think Tank published <strong>${briefs.length} Executive Brief${briefs.length > 1 ? 's' : ''}</strong>. 
        Each brief represents a topic that met our editorial standards for novelty, evidence quality, and decision relevance.
      </p>
    </div>

    <!-- Briefs -->
    <div style="background: white; border-radius: 12px; padding: 32px; margin-bottom: 32px; border: 1px solid #e5e7eb;">
      ${briefsHTML}
    </div>

    <!-- Strategic Reports CTA -->
    <div style="background: linear-gradient(135deg, #0c4a6e 0%, #1e3a5f 100%); border-radius: 12px; padding: 32px; margin-bottom: 32px; text-align: center;">
      <h3 style="font-size: 18px; font-weight: 600; color: white; margin: 0 0 12px 0;">
        Want deeper analysis?
      </h3>
      <p style="font-size: 14px; color: #94a3b8; margin: 0 0 20px 0; line-height: 1.5;">
        Upgrade to NomosX Access for full Strategic Reports (10-15 pages), 
        scenario planning, and policy recommendations.
      </p>
      <a href="https://nomosx.com/pricing" 
         style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #0891b2 0%, #3b82f6 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 500; font-size: 14px;">
        Start 15-day free trial
      </a>
    </div>

    <!-- Footer -->
    <div style="text-align: center; padding-top: 24px; border-top: 1px solid #e5e7eb;">
      <p style="font-size: 12px; color: #9ca3af; margin: 0 0 8px 0;">
        NomosX — The Autonomous Think Tank
      </p>
      <p style="font-size: 12px; color: #9ca3af; margin: 0 0 16px 0;">
        You're receiving this because you subscribed to our weekly Executive Briefs.
      </p>
      <a href="https://nomosx.com/api/newsletter/unsubscribe?email={{email}}" 
         style="font-size: 12px; color: #6b7280; text-decoration: underline;">
        Unsubscribe
      </a>
    </div>
  </div>
</body>
</html>
  `.trim();
}

// Get briefs published in the last week
async function getWeeklyBriefs() {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  // Get published Executive Briefs from ThinkTankPublication
  const publications = await prisma.thinkTankPublication.findMany({
    where: {
      status: "PUBLISHED",
      type: { in: ["RESEARCH_BRIEF", "EXECUTIVE_BRIEF"] },
      publishedAt: { gte: oneWeekAgo },
    },
    orderBy: { publishedAt: "desc" },
    take: 5,
    select: {
      id: true,
      title: true,
      html: true,
      publicId: true,
      sourceIds: true,
      trustScore: true,
    },
  });

  // Extract summary from HTML (first paragraph or executive summary)
  return publications.map(pub => ({
    id: pub.id,
    title: pub.title,
    summary: extractSummary(pub.html),
    sourceCount: pub.sourceIds.length,
    publicId: pub.publicId || undefined,
  }));
}

// Extract summary from HTML content
function extractSummary(html: string): string {
  // Try to find executive summary section
  const summaryMatch = html.match(/<section[^>]*id="?executive-summary"?[^>]*>([\s\S]*?)<\/section>/i);
  if (summaryMatch) {
    const text = summaryMatch[1].replace(/<[^>]+>/g, '').trim();
    return text.slice(0, 300) + (text.length > 300 ? '...' : '');
  }

  // Fallback: first paragraph
  const pMatch = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  if (pMatch) {
    const text = pMatch[1].replace(/<[^>]+>/g, '').trim();
    return text.slice(0, 300) + (text.length > 300 ? '...' : '');
  }

  return "Read the full analysis for key insights and recommendations.";
}

// Get next edition number
async function getNextEditionNumber(): Promise<number> {
  const lastEdition = await prisma.newsletterEdition.findFirst({
    orderBy: { editionNumber: "desc" },
    select: { editionNumber: true },
  });
  return (lastEdition?.editionNumber || 0) + 1;
}

// Get active subscribers
async function getActiveSubscribers() {
  return prisma.newsletterSubscriber.findMany({
    where: { status: "active" },
    select: { id: true, email: true },
  });
}

// Main job function
export async function runWeeklyNewsletter() {
  console.log("[Newsletter] Starting weekly newsletter job...");

  try {
    // 1. Get briefs from the last week
    const briefs = await getWeeklyBriefs();
    
    if (briefs.length === 0) {
      console.log("[Newsletter] No briefs published this week. Skipping newsletter.");
      return { success: true, skipped: true, reason: "No briefs published" };
    }

    console.log(`[Newsletter] Found ${briefs.length} briefs to include`);

    // 2. Get next edition number
    const editionNumber = await getNextEditionNumber();
    const editionDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // 3. Generate newsletter HTML
    const html = generateNewsletterHTML(
      { number: editionNumber, date: editionDate },
      briefs
    );

    // 4. Create newsletter edition record
    const edition = await prisma.newsletterEdition.create({
      data: {
        editionNumber,
        subject: `NomosX Weekly #${editionNumber}: ${briefs.length} Executive Brief${briefs.length > 1 ? 's' : ''}`,
        preheader: briefs[0]?.title || "This week's decision-ready insights",
        html,
        briefIds: briefs.map(b => b.id),
        status: "draft",
      },
    });

    console.log(`[Newsletter] Created edition #${editionNumber}`);

    // 5. Get active subscribers
    const subscribers = await getActiveSubscribers();
    console.log(`[Newsletter] ${subscribers.length} active subscribers`);

    if (subscribers.length === 0) {
      console.log("[Newsletter] No active subscribers. Edition saved as draft.");
      return { 
        success: true, 
        editionId: edition.id, 
        editionNumber,
        briefCount: briefs.length,
        subscriberCount: 0,
        status: "draft"
      };
    }

    // 6. Send emails via configured provider (Resend/SendGrid/Console)
    console.log(`[Newsletter] Sending to ${subscribers.length} subscribers...`);
    
    const sendResult = await sendBulkNewsletter(
      subscribers,
      edition.subject,
      html,
      { batchSize: 50, delayMs: 200 }
    );

    console.log(`[Newsletter] Sent: ${sendResult.sent}, Failed: ${sendResult.failed}`);
    if (sendResult.errors.length > 0) {
      console.warn(`[Newsletter] Errors:`, sendResult.errors.slice(0, 5));
    }

    // Mark edition as sent
    await prisma.newsletterEdition.update({
      where: { id: edition.id },
      data: { 
        status: sendResult.failed === 0 ? "sent" : "partial",
        sentAt: new Date(),
        recipientCount: subscribers.length,
      },
    });

    return {
      success: true,
      editionId: edition.id,
      editionNumber,
      briefCount: briefs.length,
      subscriberCount: subscribers.length,
      sent: sendResult.sent,
      failed: sendResult.failed,
      status: sendResult.failed === 0 ? "sent" : "partial",
    };

  } catch (error) {
    console.error("[Newsletter] Error running weekly newsletter:", error);
    throw error;
  }
}

// CLI runner
if (require.main === module) {
  runWeeklyNewsletter()
    .then(result => {
      console.log("[Newsletter] Job completed:", result);
      process.exit(0);
    })
    .catch(error => {
      console.error("[Newsletter] Job failed:", error);
      process.exit(1);
    });
}
