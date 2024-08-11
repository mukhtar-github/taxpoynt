import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import { Client, Account } from "node-appwrite";

// Extend NextApiRequest to include user property
interface ExtendedNextApiRequest extends NextApiRequest {
    user?: { id: string };
}

// Function to initialize Appwrite client
function initAppwriteClient(sessionToken: string) {
    const client = new Client();
    client
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!) // Set your Appwrite API Endpoint
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)   // Set your project ID
        .setJWT(sessionToken);                                  // Set the JWT token here

    return new Account(client);
}

// Middleware to attach user details to request
export async function withUserSession(req: ExtendedNextApiRequest, res: NextApiResponse, next: NextApiHandler) {
    try {
        const sessionToken = req.cookies['appwrite-session']; // Assuming the session token is stored in a cookie
        if (!sessionToken) {
            return res.status(401).json({ error: 'No session token provided' });
        }

        const account = initAppwriteClient(sessionToken);
        const userData = await account.get();

        req.user = {
            id: userData.$id, // Assuming $id is the user ID in the response from Appwrite
        };

        next(req, res);
    } catch (error) {
        console.error('Failed to authenticate using Appwrite session:', error);
        res.status(401).json({ error: 'Authentication failed' });
    }
}