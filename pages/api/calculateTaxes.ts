import { getMonoTransactions } from '@/lib/actions/transaction.actions';
import { calculateIncomeTax, calculateVAT } from '@/lib/utils';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const { accountId, realTime } = req.body; // Extract accountId and realTime from request body
            if (!accountId) {
                return res.status(400).json({ error: 'accountId is required' });
            }
            const transactions = await getMonoTransactions(accountId, 1, realTime); // Fetch transactions from Mono
            let totalIncome = 0;
            let totalAmount = 0;

            // Aggregate transaction amounts
            transactions.forEach((transaction: { income: number; amount: number; }) => {
                totalIncome += transaction.income;
                totalAmount += transaction.amount;
            });

            const vat = calculateVAT(totalAmount);
            const incomeTax = calculateIncomeTax(totalIncome);

            return res.status(200).json({ vat, incomeTax });
        } catch (error) {
            return res.status(500).json({ error: 'Failed to fetch transactions or calculate taxes' });
        }
    } else {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
}