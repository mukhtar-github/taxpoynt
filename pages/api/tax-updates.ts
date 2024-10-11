import { NextApiRequest, NextApiResponse } from 'next';
import { getTaxUpdates } from 'lib/actions/tax.actions';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const updates = await getTaxUpdates();
      res.status(200).json(updates);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch tax updates' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
