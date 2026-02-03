/**
 * Email Newsletter Service - Service d'envoi de newsletters
 * Suivi des recommandations OpenClaw
 */

const {Resend} = require('resend');
const {Newsletter,NewsletterSubscription,NewsletterCampaign} = require('@/types/newsletter');

// Configuration Resend
const resend = new Resend(process.env.RESEND_API_KEY)

export interface EmailTemplate {
  subject: string
  html: string
  text?: string;
from: string
  to: string[]
  replyTo?: string
  headers?: Record<string, string>
}

export interface SendNewsletterParams {
  newsletter: Newsletter
  campaign?: NewsletterCampaign
  subscriptions: NewsletterSubscription[]
  testMode?: boolean
}

export interface EmailMetrics {
  sent: number
  delivered: number
  opened: number
  clicked: number
  bounced: number
  unsubscribed: number
  complained: number
}

/**
 * Envoie une newsletter aux abonnés
 */
export async function sendNewsletter(params: SendNewsletterParams) {
  try {
    const { newsletter, campaign, subscriptions, testMode = false } = params
    
    // Filtrer les abonnés actifs
    const activeSubscriptions = subscriptions.filter(
      sub => sub.status === 'active' && sub.preferences.format !== 'text'
    )

    if (activeSubscriptions.length === 0) {
      return { success: true, message: 'No active subscribers found' }
    }

    // Préparer le template email
    const emailTemplate = prepareEmailTemplate(newsletter, campaign)
    
    // Envoi par lots pour éviter les limites d'API
    const batchSize = 50
    const batches = []
    
    for (let i = 0; i < activeSubscriptions.length; i += batchSize) {
      batches.push(activeSubscriptions.slice(i, i + batchSize))
    }

    const results = []
    
    for (const batch of batches) {
      const batchResults = await Promise.allSettled(
        batch.map(subscription => sendSingleEmail({
          ...emailTemplate,
          to: [subscription.email],
          subscriptionId: subscription.id,
          newsletterId: newsletter.id,
          testMode,
        }))
      )
      
      results.push(...batchResults)
    }

    // Analyser les résultats
    const successful = results.filter(r => r.status === 'fulfilled').length
    const failed = results.filter(r => r.status === 'rejected').length

    return {
      success: true,
      metrics: {
        sent: successful,
        failed,
        total: activeSubscriptions.length,
      },
      results,
    }
  } catch (error) {
    console.error('Error sending newsletter:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

/**
 * Envoie un email individuel
 */
async function sendSingleEmail(params: EmailTemplate & {
  subscriptionId: string
  newsletterId: string
  testMode?: boolean
}) {
  try {
    const { to, subscriptionId, newsletterId, testMode, ...emailData } = params
    
    // Ajouter des headers pour le tracking
    const headers = {
      'X-Newsletter-ID': newsletterId,
      'X-Subscription-ID': subscriptionId,
      'List-Unsubscribe': `<${process.env.NEXT_PUBLIC_APP_URL}/newsletter/unsubscribe?subscription=${subscriptionId}>`,
      ...emailData.headers,
    }

    if (testMode) {
      console.log('📧 TEST MODE - Email would be sent:', { to, subject: emailData.subject })
      return { success: true, messageId: 'test-mode', testMode: true }
    }

    const { data, error } = await resend.emails.send({
      from: emailData.from,
      to,
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text,
      replyTo: emailData.replyTo,
      headers,
    })

    if (error) {
      throw new Error(error.message)
    }

    return { success: true, messageId: data.id }
  } catch (error) {
    console.error('Error sending single email:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

/**
 * Prépare le template email pour une newsletter
 */
function prepareEmailTemplate(newsletter: Newsletter, campaign?: NewsletterCampaign): EmailTemplate {
  const from = campaign?.fromEmail || process.env.NEWSLETTER_FROM_EMAIL || 'newsletter@nomosx.ai'
  const replyTo = campaign?.replyTo || process.env.NEWSLETTER_REPLY_TO
  
  // Personnaliser le sujet si nécessaire
  const subject = campaign?.subject || newsletter.subject
  
  // Générer le HTML avec tracking
  const html = generateNewsletterHTML(newsletter)
  
  // Générer la version texte
  const text = generateNewsletterText(newsletter)

  return {
    subject,
    html,
    text,
    from,
    replyTo,
  }
}

/**
 * Génère le HTML de la newsletter
 */
function generateNewsletterHTML(newsletter: Newsletter): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://nomosx.ai'
  
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${newsletter.title}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { font-size: 24px; font-weight: bold; color: #1E40AF; }
        .title { font-size: 28px; font-weight: bold; margin-bottom: 10px; color: #1F2937; }
        .summary { font-size: 18px; color: #6B7280; margin-bottom: 30px; font-style: italic; }
        .content { font-size: 16px; line-height: 1.8; }
        .cta { background: #1E40AF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #E5E7EB; font-size: 14px; color: #6B7280; }
        .social-links { margin: 20px 0; }
        .social-links a { margin: 0 10px; color: #1E40AF; text-decoration: none; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🧠 NomosX</div>
            <h1 class="title">${newsletter.title}</h1>
            <div class="summary">${newsletter.summary}</div>
        </div>
        
        <div class="content">
            ${newsletter.content}
        </div>
        
        ${newsletter.metadata.cta ? `
        <div style="text-align: center; margin: 30px 0;">
            <a href="${newsletter.metadata.cta.url}" class="cta">
                ${newsletter.metadata.cta.text}
            </a>
        </div>
        ` : ''}
        
        <div class="footer">
            <p>Vous recevez cet email car vous êtes abonné à la newsletter NomosX.</p>
            <div class="social-links">
                ${newsletter.metadata.socialLinks.map(link => 
                    `<a href="${link.url}">${link.text}</a>`
                ).join('')}
            </div>
            <p>
                <a href="${baseUrl}/newsletter/unsubscribe">Se désabonner</a> | 
                <a href="${baseUrl}/newsletter/preferences">Gérer les préférences</a>
            </p>
            <p style="font-size: 12px; color: #9CA3AF;">
                ${baseUrl} | Intelligence Artificielle pour Think Tanks
            </p>
        </div>
    </div>
</body>
</html>
  `.trim()
}

/**
 * Génère la version texte de la newsletter
 */
function generateNewsletterText(newsletter: Newsletter): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://nomosx.ai'
  
  return `
🧠 NOMOSX - ${newsletter.title.toUpperCase()}

${newsletter.summary}

${newsletter.content}

${newsletter.metadata.cta ? `
➡️ ${newsletter.metadata.cta.text}: ${newsletter.metadata.cta.url}
` : ''}

---
📱 Suivez-nous:
${newsletter.metadata.socialLinks.map(link => `${link.platform}: ${link.url}`).join('\n')}

📧 Gérer votre abonnement:
Se désabonner: ${baseUrl}/newsletter/unsubscribe
Préférences: ${baseUrl}/newsletter/preferences

🌐 ${baseUrl} | Intelligence Artificielle pour Think Tanks
  `.trim()
}

/**
 * Envoie un email de test
 */
export async function sendTestNewsletter(
  newsletter: Newsletter,
  testEmail: string
) {
  try {
    const emailTemplate = prepareEmailTemplate(newsletter)
    
    const result = await sendSingleEmail({
      ...emailTemplate,
      to: [testEmail],
      subscriptionId: 'test',
      newsletterId: newsletter.id,
      testMode: false,
    })

    return result
  } catch (error) {
    console.error('Error sending test newsletter:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

/**
 * Envoie un email de confirmation d'abonnement
 */
export async function sendSubscriptionConfirmation(subscription: NewsletterSubscription) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://nomosx.ai'
    
    const { data, error } = await resend.emails.send({
      from: process.env.NEWSLETTER_FROM_EMAIL || 'newsletter@nomosx.ai',
      to: [subscription.email],
      subject: 'Confirmation d\'abonnement à NomosX',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1E40AF;">🧠 Bienvenue sur NomosX!</h1>
          <p>Merci de vous être abonné à notre newsletter. Vous recevrez bientôt nos prochaines analyses.</p>
          <p>Vos préférences:</p>
          <ul>
            <li>Fréquence: ${subscription.preferences.frequency}</li>
            <li>Format: ${subscription.preferences.format}</li>
            <li>Catégories: ${subscription.preferences.categories.join(', ') || 'Toutes'}</li>
          </ul>
          <div style="margin: 30px 0;">
            <a href="${baseUrl}/newsletter/preferences?subscription=${subscription.id}" 
               style="background: #1E40AF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
              Gérer mes préférences
            </a>
          </div>
          <p style="font-size: 14px; color: #6B7280;">
            Si vous ne souhaitez plus recevoir nos emails, 
            <a href="${baseUrl}/newsletter/unsubscribe?subscription=${subscription.id}">cliquez ici pour vous désabonner</a>.
          </p>
        </div>
      `,
    })

    if (error) {
      throw new Error(error.message)
    }

    return { success: true, messageId: data.id }
  } catch (error) {
    console.error('Error sending subscription confirmation:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

/**
 * Envoie un email de désabonnement
 */
export async function sendUnsubscriptionConfirmation(subscription: NewsletterSubscription) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://nomosx.ai'
    
    const { data, error } = await resend.emails.send({
      from: process.env.NEWSLETTER_FROM_EMAIL || 'newsletter@nomosx.ai',
      to: [subscription.email],
      subject: 'Confirmation de désabonnement',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1E40AF;">Désabonnement confirmé</h1>
          <p>Votre désabonnement à la newsletter NomosX a été confirmé.</p>
          <p>Nous sommes désolés de vous voir partir! Si vous changez d'avis, vous pouvez vous réabonner à tout moment.</p>
          <div style="margin: 30px 0;">
            <a href="${baseUrl}/newsletter" 
               style="background: #1E40AF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
              Me réabonner
            </a>
          </div>
          <p style="font-size: 14px; color: #6B7280;">
            Pour nous faire part de vos raisons de départ, 
            <a href="${baseUrl}/feedback">cliquez ici</a>.
          </p>
        </div>
      `,
    })

    if (error) {
      throw new Error(error.message)
    }

    return { success: true, messageId: data.id }
  } catch (error) {
    console.error('Error sending unsubscription confirmation:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

/**
 * Vérifie la santé du service email
 */
export async function checkEmailHealth() {
  try {
    // Test simple d'envoi d'email
    const testEmail = process.env.EMAIL_TEST_ADDRESS
    
    if (!testEmail) {
      return { success: true, message: 'No test email configured' }
    }

    const { data, error } = await resend.emails.send({
      from: process.env.NEWSLETTER_FROM_EMAIL || 'newsletter@nomosx.ai',
      to: [testEmail],
      subject: '🧠 Test de santé NomosX',
      html: '<p>Ceci est un test de santé du service email NomosX.</p>',
    })

    if (error) {
      throw new Error(error.message)
    }

    return { 
      success: true, 
      message: 'Email service is healthy',
      messageId: data.id 
    }
  } catch (error) {
    console.error('Email health check failed:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

export default {
  sendNewsletter,
  sendTestNewsletter,
  sendSubscriptionConfirmation,
  sendUnsubscriptionConfirmation,
  checkEmailHealth,
}
