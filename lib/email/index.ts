/**
 * Email Service
 * 
 * Abstraction layer for email sending.
 * Supports multiple providers: Resend, SendGrid, etc.
 * 
 * Configure via environment variables:
 * - EMAIL_PROVIDER: "resend" | "sendgrid" | "console" (default for dev)
 * - RESEND_API_KEY: API key for Resend
 * - SENDGRID_API_KEY: API key for SendGrid
 * - EMAIL_FROM: Default sender email
 */

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
  tags?: string[];
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// Get provider from environment
const EMAIL_PROVIDER = process.env.EMAIL_PROVIDER || "console";
const EMAIL_FROM = process.env.EMAIL_FROM || "NomosX <newsletter@nomosx.com>";

/**
 * Send email using configured provider
 */
export async function sendEmail(options: EmailOptions): Promise<EmailResult> {
  const from = options.from || EMAIL_FROM;
  
  switch (EMAIL_PROVIDER) {
    case "resend":
      return sendWithResend({ ...options, from });
    case "sendgrid":
      return sendWithSendGrid({ ...options, from });
    case "console":
    default:
      return sendToConsole({ ...options, from });
  }
}

/**
 * Console provider (development)
 */
async function sendToConsole(options: EmailOptions): Promise<EmailResult> {
  console.log("\n" + "=".repeat(60));
  console.log("[EMAIL] Development Mode - Email not actually sent");
  console.log("=".repeat(60));
  console.log(`To: ${Array.isArray(options.to) ? options.to.join(", ") : options.to}`);
  console.log(`From: ${options.from}`);
  console.log(`Subject: ${options.subject}`);
  console.log("-".repeat(60));
  console.log("HTML Preview (first 500 chars):");
  console.log(options.html.slice(0, 500) + "...");
  console.log("=".repeat(60) + "\n");
  
  return { 
    success: true, 
    messageId: `dev-${Date.now()}` 
  };
}

/**
 * Resend provider
 * https://resend.com
 */
async function sendWithResend(options: EmailOptions): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  
  if (!apiKey) {
    console.error("[Email] RESEND_API_KEY not configured");
    return { success: false, error: "RESEND_API_KEY not configured" };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: options.from,
        to: Array.isArray(options.to) ? options.to : [options.to],
        subject: options.subject,
        html: options.html,
        text: options.text,
        reply_to: options.replyTo,
        tags: options.tags?.map(tag => ({ name: tag, value: "true" })),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("[Email] Resend error:", data);
      return { success: false, error: data.message || "Resend API error" };
    }

    return { success: true, messageId: data.id };
  } catch (error) {
    console.error("[Email] Resend exception:", error);
    return { success: false, error: String(error) };
  }
}

/**
 * SendGrid provider
 * https://sendgrid.com
 */
async function sendWithSendGrid(options: EmailOptions): Promise<EmailResult> {
  const apiKey = process.env.SENDGRID_API_KEY;
  
  if (!apiKey) {
    console.error("[Email] SENDGRID_API_KEY not configured");
    return { success: false, error: "SENDGRID_API_KEY not configured" };
  }

  try {
    const recipients = Array.isArray(options.to) ? options.to : [options.to];
    
    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [{ to: recipients.map(email => ({ email })) }],
        from: { email: options.from?.match(/<(.+)>/)?.[1] || options.from },
        subject: options.subject,
        content: [
          { type: "text/html", value: options.html },
          ...(options.text ? [{ type: "text/plain", value: options.text }] : []),
        ],
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("[Email] SendGrid error:", text);
      return { success: false, error: text || "SendGrid API error" };
    }

    const messageId = response.headers.get("x-message-id") || `sg-${Date.now()}`;
    return { success: true, messageId };
  } catch (error) {
    console.error("[Email] SendGrid exception:", error);
    return { success: false, error: String(error) };
  }
}

/**
 * Send newsletter to multiple subscribers
 */
export async function sendBulkNewsletter(
  subscribers: Array<{ email: string; id: string }>,
  subject: string,
  htmlTemplate: string,
  options?: { batchSize?: number; delayMs?: number }
): Promise<{ sent: number; failed: number; errors: string[] }> {
  const batchSize = options?.batchSize || 50;
  const delayMs = options?.delayMs || 100;
  
  let sent = 0;
  let failed = 0;
  const errors: string[] = [];

  console.log(`[Newsletter] Sending to ${subscribers.length} subscribers in batches of ${batchSize}`);

  for (let i = 0; i < subscribers.length; i += batchSize) {
    const batch = subscribers.slice(i, i + batchSize);
    
    const results = await Promise.all(
      batch.map(async (subscriber) => {
        // Replace {{email}} placeholder for unsubscribe link
        const personalizedHtml = htmlTemplate.replace(/\{\{email\}\}/g, encodeURIComponent(subscriber.email));
        
        const result = await sendEmail({
          to: subscriber.email,
          subject,
          html: personalizedHtml,
          tags: ["newsletter"],
        });
        
        return { subscriber, result };
      })
    );

    for (const { subscriber, result } of results) {
      if (result.success) {
        sent++;
      } else {
        failed++;
        errors.push(`${subscriber.email}: ${result.error}`);
      }
    }

    // Rate limiting delay between batches
    if (i + batchSize < subscribers.length) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }

  console.log(`[Newsletter] Completed: ${sent} sent, ${failed} failed`);
  
  return { sent, failed, errors };
}
