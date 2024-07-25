// pages/api/mono/webhooks.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { event, data } = req.body;

    switch (event) {
      case 'mono.events.account_connected':
        // Handle account connection
        await handleAccountConnected(data);
        break;
      case 'mono.events.account_updated':
        // Handle account updates
        await handleAccountUpdated(data);
        break;
      default:
        console.log(`Unhandled event type: ${event}`);
    }

    res.status(200).json({ message: 'Webhook received' });
  } else {
    res.status(405).end('Method Not Allowed');
  }
}

async function handleAccountConnected(data: any) {
  const accountId = data.id;
  // Save this account ID in your database
  console.log('Account connected with ID:', accountId);
  // Implement further logic as needed
}

async function handleAccountUpdated(data: any) {
  const { meta: { data_status }, account } = data;
  console.log('Account updated:', account._id, 'Data status:', data_status);
  // Update data status in your database and handle accordingly
}
