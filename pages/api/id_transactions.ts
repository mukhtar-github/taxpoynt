import type { NextApiRequest, NextApiResponse } from 'next';
import { authenticateRequest } from '@/lib/middleware/authMiddleware';
import { getMonoTransactionDetails } from '@/lib/actions/transaction.actions';
;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!await authenticateRequest(req, res)) return;

    if (req.method === 'GET') {
        const { id } = req.query;
        
        if (!id) {
            return res.status(400).json({ error: 'Transaction ID is required' });
        }

        try {
            const transactionDetails = await getMonoTransactionDetails(id as string);
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
