import { NextApiRequest, NextApiResponse } from 'next';
import { AppError } from '../utils';

export function errorHandler(err: Error, req: NextApiRequest, res: NextApiResponse) {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            errors: err.serializeErrors(),
        });
    }

    console.error('Unexpected error:', err); // Log unexpected errors for debugging
    res.status(500).json({
        errors: [{ message: 'Something went wrong' }],
    });
}
