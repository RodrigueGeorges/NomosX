/**
 * Email Delivery Service
 * 
 * Configure with Resend, SendGrid, or any email provider
 */

export type EmailProvider = 'resend' | 'sendgrid' | 'smtp';

export type EmailPayload = {
  to: string | string[];
  from?: string;
  subject: string;
  html: string;
  text?: string;
};

/**
 * Send email via configured provider
 */
export async function sendEmail(payload: EmailPayload): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const provider = (process.env.EMAIL_PROVIDER || 'resend') as EmailProvider;
  
  try {
    switch (provider) {
      case 'resend':
        return await sendViaResend(payload);
      case 'sendgrid':
        return await sendViaSendGrid(payload);
      case 'smtp':
        return await sendViaSMTP(payload);
      default:
        throw new Error(`Unknown email provider: ${provider}`);
    }
  } catch (error: any) {
    console.error('[Email] Failed to send:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Send via Resend (recommended)
 * https://resend.com
 */
async function sendViaResend(payload: EmailPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY not configured');
  }

  const from = payload.from || process.env.EMAIL_FROM || 'nomosx@example.com';

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: Array.isArray(payload.to) ? payload.to : [payload.to],
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Resend API error: ${JSON.stringify(error)}`);
  }

  const data = await response.json();
  return {
    success: true,
    messageId: data.id,
  };
}

/**
 * Send via SendGrid
 * https://sendgrid.com
 */
async function sendViaSendGrid(payload: EmailPayload) {
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) {
    throw new Error('SENDGRID_API_KEY not configured');
  }

  const from = payload.from || process.env.EMAIL_FROM || 'nomosx@example.com';
  const toArray = Array.isArray(payload.to) ? payload.to : [payload.to];

  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: toArray.map(email => ({ to: [{ email }] })),
      from: { email: from },
      subject: payload.subject,
      content: [
        { type: 'text/html', value: payload.html },
        ...(payload.text ? [{ type: 'text/plain', value: payload.text }] : []),
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`SendGrid API error: ${error}`);
  }

  return {
    success: true,
    messageId: response.headers.get('x-message-id') || undefined,
  };
}

/**
 * Send via SMTP (using nodemailer)
 * Requires: npm install nodemailer
 */
async function sendViaSMTP(payload: EmailPayload) {
  try {
    const nodemailer = await import('nodemailer');
    
    const transporter = nodemailer.default.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const from = payload.from || process.env.EMAIL_FROM || 'nomosx@example.com';

    const info = await transporter.sendMail({
      from,
      to: Array.isArray(payload.to) ? payload.to.join(', ') : payload.to,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
    });

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error: any) {
    if (error.code === 'MODULE_NOT_FOUND') {
      throw new Error('nodemailer not installed. Run: npm install nodemailer');
    }
    throw error;
  }
}

/**
 * Send digest email to subscribers
 */
export async function sendDigestEmail(
  digestId: string,
  subject: string,
  html: string,
  recipients: string[]
): Promise<{ sent: number; failed: number }> {
  let sent = 0;
  let failed = 0;

  for (const email of recipients) {
    const result = await sendEmail({
      to: email,
      subject,
      html,
    });

    if (result.success) {
      sent++;
    } else {
      failed++;
      console.error(`[Email] Failed to send to ${email}:`, result.error);
    }

    // Rate limiting (if needed)
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log(`[Email] Digest ${digestId}: ${sent} sent, ${failed} failed`);
  
  return { sent, failed };
}

/**
 * Send welcome email to new subscriber
 */
export async function sendWelcomeEmail(email: string, topicName: string) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #EDE9E2; background: #0B0E12; }
        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
        .header { text-align: center; margin-bottom: 40px; }
        .logo { font-size: 32px; font-weight: 700; color: #5EEAD4; }
        .content { background: #10151D; border: 1px solid #232833; border-radius: 16px; padding: 32px; }
        h1 { color: #EDE9E2; font-size: 24px; margin-bottom: 16px; }
        p { color: #8B8F98; line-height: 1.6; margin-bottom: 16px; }
        .topic { display: inline-block; background: rgba(94,234,212,0.1); border: 1px solid rgba(94,234,212,0.3); color: #5EEAD4; padding: 8px 16px; border-radius: 8px; margin: 8px 0; }
        .footer { text-align: center; margin-top: 32px; color: #5A5E66; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">NomosX</div>
          <p style="color: #8B8F98;">The Agentic Think Tank</p>
        </div>
        
        <div class="content">
          <h1>Bienvenue dans NomosX</h1>
          <p>Vous êtes maintenant abonné aux digests hebdomadaires pour :</p>
          <div class="topic">${topicName}</div>
          <p>Chaque semaine, vous recevrez une synthèse intelligente des dernières recherches académiques sur ce sujet.</p>
          <p>Notre système agentic scout, analyse et synthétise automatiquement les sources les plus pertinentes pour vous.</p>
        </div>
        
        <div class="footer">
          <p>NomosX — Intelligence stratégique autonome</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: `Bienvenue — Abonnement NomosX: ${topicName}`,
    html,
  });
}
