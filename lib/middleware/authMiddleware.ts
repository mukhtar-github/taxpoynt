import { NextApiRequest, NextApiResponse } from 'next';
import { createSessionClient } from '@/lib/appwrite';

export async function authenticateRequest(req: NextApiRequest, res: NextApiResponse): Promise<boolean> {
    const sessionToken = req.cookies['appwrite-session'];
    if (!sessionToken) {
        res.status(401).json({ error: 'No session token provided' });
        return false;
    }
    try {
        const sessionClient = await createSessionClient();
        const account = sessionClient.account;
        await account.get();  // This will throw an error if the session is not valid
        return true;
    } catch (error) {
        res.status(401).json({ error: 'Invalid session token' });
        return false;
    }
}