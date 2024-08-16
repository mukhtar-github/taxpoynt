import { linkMonoAccount } from '@/lib/actions/user.actions';
import type { NextApiRequest, NextApiResponse } from 'next';
import { errorHandler } from '@/lib/middleware/errorHandler';
import { withUserSession } from '@/lib/middleware/userSession';


// Extend the NextApiRequest type to include the user property
interface ExtendedNextApiRequest extends NextApiRequest {
    user: {
        id: string;
    };
}

const handler = async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
    // Ensure the request method is POST
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }

    // Validate the presence of the 'code' in the request body
    if (!req.body.code) {
        res.status(400).json({ error: 'Authorization code is required' });
        return;
    }

    try {
        const { code } = req.body;
        const user = await linkMonoAccount({ DOCUMENT_ID: req.user.id, authorizationToken: code });
        if (!user) {
            throw new Error('Failed to link account');
        }
        res.status(200).json({ message: 'Account linked successfully', user });
    } catch (error) {
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