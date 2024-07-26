// pages/api/mono/exchange-token.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  const { code } = req.body;

  try {
    const response = await fetch('https://api.withmono.com/v2/account', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'mono-sec-key': process.env.MONO_SECRET_KEY,
      } as HeadersInit,
      body: JSON.stringify({ code })
    });

    const data = await response.json();

    if (response.ok) {
      return res.status(200).json({ accountId: data.id });
    } else {
      return res.status(500).json({ error: 'Failed to exchange token' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
