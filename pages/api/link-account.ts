import { linkMonoAccount } from '@/lib/actions/user.actions';
import { withUserSession } from '@/lib/middleware/userSession';
import type { NextApiRequest, NextApiResponse } from 'next';
import { errorHandler } from '@/lib/middleware/errorHandler';

// Extend the NextApiRequest type to include the user property
interface ExtendedNextApiRequest extends NextApiRequest {
    user: {
        id: string;
    };
}

const handler = async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
    try {
        const { code } = req.body;

        const user = await linkMonoAccount({ DOCUMENT_ID: req.user.id, authorizationToken: code });
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