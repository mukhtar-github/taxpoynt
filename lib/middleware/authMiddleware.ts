import { NextApiRequest, NextApiResponse, NextFunction } from 'next';
import { createSessionClient } from 'lib/appwrite'; // Ensure correct import

export const authMiddleware = async (req: NextApiRequest, res: NextApiResponse, next: NextFunction) => {
    try {
        const client = await createSessionClient(req);
        // ... rest of your authentication logic ...
        next();
    } catch (error) {
        // Handle errors appropriately
        next(error);
    }
};