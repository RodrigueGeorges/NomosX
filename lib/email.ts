/**
 * NomosX Email Service — Resend
 * Central email utility for all transactional emails.
 * Requires: RESEND_API_KEY, EMAIL_FROM env vars.
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM || 'NomosX <noreply@nomosx.com>';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://nomosx.com';

// ─── Low-level send via Resend REST API ────────────────────────────────────

interface SendEmailResult {
  success: boolean;
  error?: string;
}

async function sendEmail({ to, subject, html, text }: { to: string; subject: string; html: string; text?: string }): Promise<SendEmailResult> {
  if (!RESEND_API_KEY) {
    console.warn('[Email] RESEND_API_KEY not set — skipping email to', to);
    return { success: false, error: 'RESEND_API_KEY not configured' };
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: EMAIL_FROM, to, subject, html, text }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error('[Email] Resend error:', res.status, body);
    return { success: false, error: `Resend error: ${res.status}` };
  }

  return { success: true };
}

// ─── Shared layout wrapper ──────────────────────────────────────────────────

function layout(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>NomosX</title>
</head>
<body style="margin:0;padding:0;background:#09090b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#e4e4e7;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#09090b;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <!-- Header -->
          <tr>
            <td style="padding-bottom:32px;text-align:center;">
              <span style="font-size:22px;font-weight:300;letter-spacing:-0.02em;color:#fff;">
                Nomos<span style="background:linear-gradient(135deg,#818cf8,#7c3aed);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-weight:600;">X</span>
              </span>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="background:#18181b;border:1px solid #27272a;border-radius:12px;padding:40px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding-top:24px;text-align:center;">
              <p style="font-size:12px;color:#52525b;margin:0;">
                NomosX · The Autonomous Think Tank<br/>
                <a href="${APP_URL}/unsubscribed" style="color:#6366f1;text-decoration:none;">Unsubscribe</a>
                &nbsp;·&nbsp;
                <a href="${APP_URL}/privacy" style="color:#6366f1;text-decoration:none;">Privacy</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─── Email templates ────────────────────────────────────────────────────────

/**
 * Welcome email sent after account creation.
 */
export async function sendWelcomeEmail(to: string, name?: string | null): Promise<void> {
  const displayName = name || 'Researcher';
  const html = layout(`
    <h1 style="font-size:24px;font-weight:300;color:#fff;margin:0 0 8px;">
      Welcome to NomosX, ${displayName}.
    </h1>
    <p style="font-size:14px;color:#a1a1aa;margin:0 0 24px;line-height:1.6;">
      Your account is active. NomosX is an autonomous think tank — 8 PhD-calibrated AI researchers
      publish peer-reviewed intelligence briefs continuously, across economics, policy, technology,
      climate, law, and more.
    </p>
    <p style="font-size:14px;color:#a1a1aa;margin:0 0 32px;line-height:1.6;">
      As an <strong style="color:#e4e4e7;">Analyst</strong>, you have access to all published briefs
      and the weekly intelligence dispatch. Ready to commission your own research? Upgrade to
      <strong style="color:#e4e4e7;">Researcher</strong>.
    </p>
    <a href="${APP_URL}/dashboard"
       style="display:inline-block;background:linear-gradient(135deg,#6366f1,#7c3aed);color:#fff;
              text-decoration:none;padding:12px 28px;border-radius:8px;font-size:14px;font-weight:500;">
      Go to your dashboard →
    </a>
    <hr style="border:none;border-top:1px solid #27272a;margin:32px 0;" />
    <p style="font-size:12px;color:#52525b;margin:0;">
      Questions? Reply to this email — we read everything.
    </p>
  `);

  await sendEmail({ to, subject: 'Welcome to NomosX — your think tank is ready', html });
}

/**
 * Newsletter subscription confirmation (double opt-in).
 */
export async function sendNewsletterConfirmation(to: string, confirmToken: string): Promise<void> {
  const confirmUrl = `${APP_URL}/api/newsletter/confirm?token=${confirmToken}`;
  const html = layout(`
    <h1 style="font-size:24px;font-weight:300;color:#fff;margin:0 0 8px;">
      Confirm your subscription.
    </h1>
    <p style="font-size:14px;color:#a1a1aa;margin:0 0 24px;line-height:1.6;">
      You requested to receive the NomosX weekly intelligence dispatch — briefs auto-published
      by our PhD research agents across 12 domains.
    </p>
    <p style="font-size:14px;color:#a1a1aa;margin:0 0 32px;line-height:1.6;">
      Click below to confirm your email address and activate your subscription.
    </p>
    <a href="${confirmUrl}"
       style="display:inline-block;background:linear-gradient(135deg,#6366f1,#7c3aed);color:#fff;
              text-decoration:none;padding:12px 28px;border-radius:8px;font-size:14px;font-weight:500;">
      Confirm subscription →
    </a>
    <p style="font-size:12px;color:#52525b;margin:32px 0 0;">
      If you didn't request this, you can safely ignore this email.
      This link expires in 48 hours.
    </p>
  `);

  await sendEmail({ to, subject: 'Confirm your NomosX subscription', html });
}

/**
 * Welcome email for confirmed newsletter subscribers.
 */
export async function sendNewsletterWelcome(to: string): Promise<void> {
  const html = layout(`
    <h1 style="font-size:24px;font-weight:300;color:#fff;margin:0 0 8px;">
      You're subscribed.
    </h1>
    <p style="font-size:14px;color:#a1a1aa;margin:0 0 24px;line-height:1.6;">
      Every week, NomosX publishes peer-reviewed intelligence briefs — written autonomously
      by 8 PhD-calibrated AI researchers, sourced from 250M+ academic publications.
    </p>
    <p style="font-size:14px;color:#a1a1aa;margin:0 0 32px;line-height:1.6;">
      Your first dispatch arrives next Monday. In the meantime, browse our published briefs.
    </p>
    <a href="${APP_URL}/publications"
       style="display:inline-block;background:linear-gradient(135deg,#6366f1,#7c3aed);color:#fff;
              text-decoration:none;padding:12px 28px;border-radius:8px;font-size:14px;font-weight:500;">
      Browse publications →
    </a>
    <hr style="border:none;border-top:1px solid #27272a;margin:32px 0;" />
    <p style="font-size:12px;color:#52525b;margin:0;">
      To unsubscribe at any time:
      <a href="${APP_URL}/api/newsletter/unsubscribe?email=${encodeURIComponent(to)}"
         style="color:#6366f1;text-decoration:none;">click here</a>.
    </p>
  `);

  await sendEmail({ to, subject: 'Welcome to the NomosX intelligence dispatch', html });
}

/**
 * Bulk newsletter send — used by the weekly newsletter cron job.
 * Sends in batches with configurable delay to respect Resend rate limits.
 */
export async function sendBulkNewsletter(
  subscribers: Array<{ id: string; email: string }>,
  subject: string,
  html: string,
  options: { batchSize?: number; delayMs?: number } = {}
): Promise<{ sent: number; failed: number; errors: string[] }> {
  const { batchSize = 50, delayMs = 200 } = options;
  let sent = 0;
  let failed = 0;
  const errors: string[] = [];

  for (let i = 0; i < subscribers.length; i += batchSize) {
    const batch = subscribers.slice(i, i + batchSize);

    await Promise.allSettled(
      batch.map(async (sub) => {
        const result = await sendEmail({ to: sub.email, subject, html });
        if (result.success) {
          sent++;
        } else {
          failed++;
          errors.push(`${sub.email}: ${result.error || 'Unknown error'}`);
        }
      })
    );

    if (i + batchSize < subscribers.length && delayMs > 0) {
      await new Promise(r => setTimeout(r, delayMs));
    }
  }

  return { sent, failed, errors };
}

/**
 * New brief published notification (for subscribers who opted in).
 */
export async function sendBriefPublishedNotification(
  to: string,
  brief: { title: string; summary: string; id: string; trustScore?: number }
): Promise<void> {
  const briefUrl = `${APP_URL}/publications/${brief.id}`;
  const trust = brief.trustScore ? `${brief.trustScore}/100` : '';
  const html = layout(`
    <p style="font-size:11px;font-weight:600;letter-spacing:0.2em;color:#6366f1;text-transform:uppercase;margin:0 0 16px;">
      New Publication
    </p>
    <h1 style="font-size:22px;font-weight:300;color:#fff;margin:0 0 16px;line-height:1.3;">
      ${brief.title}
    </h1>
    ${trust ? `<p style="font-size:12px;color:#52525b;margin:0 0 16px;">Trust score: <strong style="color:#6366f1;">${trust}</strong></p>` : ''}
    <p style="font-size:14px;color:#a1a1aa;margin:0 0 32px;line-height:1.6;">
      ${brief.summary}
    </p>
    <a href="${briefUrl}"
       style="display:inline-block;background:linear-gradient(135deg,#6366f1,#7c3aed);color:#fff;
              text-decoration:none;padding:12px 28px;border-radius:8px;font-size:14px;font-weight:500;">
      Read the full brief →
    </a>
    <hr style="border:none;border-top:1px solid #27272a;margin:32px 0;" />
    <p style="font-size:12px;color:#52525b;margin:0;">
      You're receiving this because you subscribed to NomosX publications.
      <a href="${APP_URL}/api/newsletter/unsubscribe?email=${encodeURIComponent(to)}"
         style="color:#6366f1;text-decoration:none;">Unsubscribe</a>.
    </p>
  `);

  await sendEmail({ to, subject: `New brief: ${brief.title}`, html });
}

// ─── Exports for API routes ───────────────────────────────────────────────

export { sendEmail };

/** Alias for sendEmail — used by digest routes */
export async function sendDigestEmail(to: string, subject: string, html: string): Promise<SendEmailResult> {
  return sendEmail({ to, subject, html });
}
