import { linkMonoAccount } from '@/lib/actions/user.actions';
import type { NextApiRequest, NextApiResponse } from 'next';
import { errorHandler } from '@/lib/middleware/errorHandler';
import { withUserSession } from '@/lib/middleware/userSession';

interface ExtendedNextApiRequest extends NextApiRequest {
    user: {
        id: string;
    };
}

const handler = async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }

    if (!req.body.code) {
        res.status(400).json({ error: 'Authorization code is required' });
        return;
    }

    try {
        const { code } = req.body;
        console.log('Attempting to link account for user:', req.user.id);
        const user = await linkMonoAccount({ DOCUMENT_ID: req.user.id, authorizationToken: code });
        if (!user) {
            console.error('Failed to link account: No user returned');
            res.status(500).json({ error: 'Failed to link account' });
            return;
        }
        console.log('Account linked successfully for user:', req.user.id);
        res.status(200).json({ message: 'Account linked successfully', user });
    } catch (error) {
        console.error('Error in link-account handler:', error);
        if (error instanceof Error) {
            errorHandler(error, req, res);
        } else {
            errorHandler(new Error('An unknown error occurred'), req, res);
        }
    }
};

export default function linkAccountRoute(req: NextApiRequest, res: NextApiResponse) {
    withUserSession(req, res, () => handler(req as ExtendedNextApiRequest, res));
}

//export default withUserSession(handler);
