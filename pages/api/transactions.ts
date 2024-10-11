import type { NextApiRequest, NextApiResponse } from 'next';
import getMonoTransactions from 'lib/mono';
import { withUserSession } from 'lib/middleware/userSession';

interface ExtendedNextApiRequest extends NextApiRequest {
    user?: { id: string };
}

async function handler(req: ExtendedNextApiRequest, res: NextApiResponse) {
    // User Authentication Check
    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized access' });
    }

    if (req.method === 'GET') {
        const { accountId, start, end } = req.query;
        
        if (!accountId) {
            return res.status(400).json({ error: 'Account ID is required' });
        }

        try {
            const transactions = await getMonoTransactions(accountId as string, start as string, end as string);
            return res.status(200).json(transactions);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            return res.status(500).json({ error: 'Failed to fetch transactions' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

export default function transactionsRoute(req: NextApiRequest, res: NextApiResponse) {
    return withUserSession(req, res, () => handler(req as ExtendedNextApiRequest, res));
}