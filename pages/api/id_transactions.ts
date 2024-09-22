import type { NextApiRequest, NextApiResponse } from 'next';
import { getMonoTransactions } from '@/lib/actions/transaction.actions';
import { withUserSession, ExtendedNextApiRequest } from '@/lib/middleware/userSession';

async function handler(req: ExtendedNextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const { id } = req.query;
        
        if (!id) {
            return res.status(400).json({ error: 'Transaction ID is required' });
        }

        // You can access the authenticated user's ID if needed
        const userId = req.user?.id;

        try {
            const transactionDetails = await getMonoTransactions(id as string);
            
            // Optional: You could add a check here to ensure the transaction belongs to the authenticated user
            // if (transactionDetails.userId !== userId) {
            //     return res.status(403).json({ error: 'Unauthorized access to this transaction' });
            // }

            return res.status(200).json(transactionDetails);
        } catch (error) {
            console.error('Error fetching transaction details:', error);
            return res.status(500).json({ error: 'Failed to fetch transaction details' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

export default function idTransactionsRoute(req: NextApiRequest, res: NextApiResponse) {
    withUserSession(req, res, () => handler(req as ExtendedNextApiRequest, res));
}
