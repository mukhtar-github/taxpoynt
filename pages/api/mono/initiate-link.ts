// pages/api/mono/initiate-link.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { name, email } = req.body;
    const response = await fetch('<https://api.withmono.com/v2/account>', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'mono-sec-key': process.env.MONO_SECRET_KEY,
      },
      body: JSON.stringify({
        customer: { name, email },
        scope: 'auth',
        redirect_url: '<https://yourdomain.com/success>', // Adjust the redirect URL as needed
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(500).json({ error: 'Failed to initiate Mono Link', details: data });
    }

    res.status(200).json({ monoUrl: data.data.mono_url });
  } else {
    res.status(405).end('Method Not Allowed');
  }
}
