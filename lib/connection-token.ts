"use server";

// connection-token.ts
import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';
import { getLoggedInUser } from './actions/user.actions';

// Assuming the environment variable is properly set up for TypeScript recognition
declare global {
    namespace NodeJS {
        interface ProcessEnv {
            MONO_SECRET_KEY: string;
        }
    }
}

// Assuming userData is an object with a userId property
async function generateConnectionToken(userData: { userId: string }): Promise<string> {
    const userId = userData.userId; // Extract userId from userData object

    // Validate userId more robustly
    if (!getLoggedInUser()) {
        throw new Error('Invalid user ID');
    }

    // Call Mono's API to generate/retrieve the connection token
    try {
        const monoApiUrl = 'https://api.mono.co/v1/auth/token';
        const response = await fetch(monoApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'mono-sec-key': process.env.MONO_SECRET_KEY,
            },
            body: JSON.stringify({ userId }),
        });

        if (!response.ok) {
            throw new Error(`Failed to generate connection token: ${response.statusText}`);
        }

        const data = await response.json();
        return data.token;
    } catch (error) {
        console.error('Error generating connection token:', error);
        throw new Error('Error generating connection token');
    }
}

// Example handler using Next.js API routes
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') {
        try {
            const { userId } = req.body;
            const token = await generateConnectionToken(userId);
            res.status(200).json({ token });
        } catch (error) {
            res.status(500).json({ error: 'Failed to generate connection token' });
        }
    } else {
        res.status(405).end('Method Not Allowed');
    }
}