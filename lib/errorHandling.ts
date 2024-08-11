import { NextApiResponse } from 'next';
import { AppError } from './utils';

export function handleApiError(res: NextApiResponse, error: any) {
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({ errors: error.serializeErrors() });
    }
    res.status(500).json({ errors: [{ message: 'Something went wrong' }] });
}