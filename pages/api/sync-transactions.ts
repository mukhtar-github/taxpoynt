import type { NextApiRequest, NextApiResponse } from 'next';
import { syncAccountTransactions } from '@/lib/actions/transaction.actions';
import { withUserSession } from '@/lib/middleware/userSession';

interface ExtendedNextApiRequest extends NextApiRequest {
    user?: { id: string };
}

async function handler(req: ExtendedNextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { accountId, realTime = false } = req.body;
        const userId = req.user?.id;  // Access user ID from the extended request object
        
        if (!accountId) {
            return res.status(400).json({ error: 'Account ID is required' });
        }

        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
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

export default function syncTransactionsRoute(req: NextApiRequest, res: NextApiResponse) {
    return withUserSession(req, res, () => handler(req as ExtendedNextApiRequest, res));
}