import { calculateIncomeTax, calculateVAT } from '@/lib/utils';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { income, amount } = req.body;
        const vat = calculateVAT(amount);
        const incomeTax = calculateIncomeTax(income);

        return res.status(200).json({ vat, incomeTax });
    } else {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
}
