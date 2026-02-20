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

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://nomosx.com';

// Newsletter HTML template — dark premium design
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
    <div style="margin-bottom:28px;padding-bottom:28px;border-bottom:1px solid #27272a;">
      <p style="font-size:11px;font-weight:600;letter-spacing:0.2em;color:#6366f1;text-transform:uppercase;margin:0 0 10px;">
        Brief ${i + 1} of ${briefs.length}
      </p>
      <h2 style="font-size:18px;font-weight:300;color:#f4f4f5;margin:0 0 10px;line-height:1.4;">
        ${brief.title}
      </h2>
      <p style="font-size:14px;color:#a1a1aa;line-height:1.6;margin:0 0 16px;">
        ${brief.summary}
      </p>
      <div style="display:flex;align-items:center;gap:16px;">
        <span style="font-size:12px;color:#52525b;">${brief.sourceCount} sources cited</span>
        <a href="${APP_URL}/publications/${brief.publicId || brief.id}"
           style="font-size:13px;color:#818cf8;text-decoration:none;font-weight:500;">
          Read full brief →
        </a>
      </div>
    </div>
  `).join("");

  // Remove trailing border from last brief
  const lastDivider = briefsHTML.lastIndexOf('border-bottom:1px solid #27272a;');
  const cleanBriefsHTML = lastDivider >= 0
    ? briefsHTML.slice(0, lastDivider) + 'border-bottom:none;' + briefsHTML.slice(lastDivider + 'border-bottom:1px solid #27272a;'.length)
    : briefsHTML;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>NomosX Weekly #${edition.number}</title>
</head>
<body style="margin:0;padding:0;background:#09090b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#e4e4e7;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#09090b;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr><td style="padding-bottom:32px;text-align:center;">
          <span style="font-size:22px;font-weight:300;letter-spacing:-0.02em;color:#fff;">
            Nomos<span style="color:#818cf8;font-weight:600;">X</span>
          </span>
          <p style="font-size:11px;font-weight:600;letter-spacing:0.2em;color:#6366f1;text-transform:uppercase;margin:8px 0 0;">
            Intelligence Dispatch
          </p>
        </td></tr>

        <!-- Edition label -->
        <tr><td style="padding-bottom:24px;text-align:center;">
          <p style="font-size:13px;color:#52525b;margin:0;">
            Edition #${edition.number} &nbsp;·&nbsp; ${edition.date}
          </p>
        </td></tr>

        <!-- Intro card -->
        <tr><td style="background:#18181b;border:1px solid #27272a;border-radius:12px;padding:24px;margin-bottom:24px;">
          <p style="font-size:14px;color:#a1a1aa;line-height:1.6;margin:0;">
            This week, the NomosX Think Tank published
            <strong style="color:#e4e4e7;">${briefs.length} peer-reviewed brief${briefs.length > 1 ? 's' : ''}</strong>
            — sourced from 250M+ academic publications, validated by 8 PhD-calibrated research agents.
          </p>
        </td></tr>

        <tr><td style="padding:24px 0;"></td></tr>

        <!-- Briefs -->
        <tr><td style="background:#18181b;border:1px solid #27272a;border-radius:12px;padding:32px;">
          ${cleanBriefsHTML}
        </td></tr>

        <tr><td style="padding:24px 0;"></td></tr>

        <!-- CTA -->
        <tr><td style="background:linear-gradient(135deg,rgba(99,102,241,0.15),rgba(124,58,237,0.1));border:1px solid rgba(99,102,241,0.25);border-radius:12px;padding:32px;text-align:center;">
          <p style="font-size:11px;font-weight:600;letter-spacing:0.2em;color:#6366f1;text-transform:uppercase;margin:0 0 12px;">
            Go deeper
          </p>
          <h3 style="font-size:18px;font-weight:300;color:#fff;margin:0 0 10px;">
            Commission your own research
          </h3>
          <p style="font-size:13px;color:#a1a1aa;margin:0 0 20px;line-height:1.5;">
            Upgrade to <strong style="color:#e4e4e7;">Researcher</strong> to commission strategic briefs
            and 15-page reports on any topic — delivered in minutes.
          </p>
          <a href="${APP_URL}/pricing"
             style="display:inline-block;background:linear-gradient(135deg,#6366f1,#7c3aed);color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-size:14px;font-weight:500;">
            See plans →
          </a>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding-top:32px;text-align:center;">
          <p style="font-size:12px;color:#52525b;margin:0 0 8px;">
            NomosX · The Autonomous Think Tank
          </p>
          <p style="font-size:12px;color:#3f3f46;margin:0;">
            <a href="${APP_URL}/api/newsletter/unsubscribe?email={{email}}" style="color:#6366f1;text-decoration:none;">Unsubscribe</a>
            &nbsp;·&nbsp;
            <a href="${APP_URL}/privacy" style="color:#6366f1;text-decoration:none;">Privacy</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
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
