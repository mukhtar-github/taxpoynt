import { getMonoTransactions } from 'lib/actions/transaction.actions';
import { calculateVAT, calculateIncomeTax } from 'lib/utils'; // Ensure these functions are correctly imported
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { accountId, start, end } = req.body;

        if (!accountId) {
            return res.status(400).json({ error: 'Account ID is required' });
        }

        const transactionsResponse = await getMonoTransactions(accountId, start, end);
        const transactions = transactionsResponse.data.data;

        const totalAmount = transactions.reduce((sum, txn) => sum + txn.amount, 0);
        const totalIncome = transactions
            .filter(txn => txn.type === 'credit')
            .reduce((sum, txn) => sum + txn.amount, 0);

        const vat = calculateVAT(totalAmount);
        const incomeTax = calculateIncomeTax(totalIncome);

        return res.status(200).json({ vat, incomeTax });
    } catch (error) {
        console.error('Error calculating taxes:', error);
        return res.status(500).json({ error: 'Failed to fetch transactions or calculate taxes' });
    }
}