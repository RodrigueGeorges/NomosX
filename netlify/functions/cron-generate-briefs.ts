import { schedule } from '@netlify/functions';

const handler = schedule('0 22 * * 0', async () => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.URL || 'http://localhost:3000';
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    console.error('[Cron/GenerateBriefs] CRON_SECRET not set');
    return { statusCode: 500 };
  }

  try {
    const response = await fetch(`${appUrl}/api/cron/generate-briefs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cronSecret}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    console.log('[Cron/GenerateBriefs] Result:', JSON.stringify(data));

    return { statusCode: response.ok ? 200 : 500 };
  } catch (error) {
    console.error('[Cron/GenerateBriefs] Error:', error);
    return { statusCode: 500 };
  }
});

export { handler };
