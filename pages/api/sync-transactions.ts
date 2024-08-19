import type { NextApiRequest, NextApiResponse } from 'next';
import { syncAccountTransactions } from '@/lib/actions/transaction.actions';
import { authenticateRequest } from '@/lib/middleware/authMiddleware';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!await authenticateRequest(req, res)) return;

    if (req.method === 'POST') {
        const { accountId, realTime = false } = req.body;
        const userId = (req as any).user.id;  // Assuming your auth middleware adds user info to the request
        
        if (!accountId) {
            return res.status(400).json({ error: 'Account ID is required' });
        }

        try {
            const result = await syncAccountTransactions(accountId, userId, realTime);
            return res.status(200).json(result);
        } catch (error) {
            console.error('Error syncing transactions:', error);
            return res.status(500).json({ error: 'Failed to sync transactions' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}