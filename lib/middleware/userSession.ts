import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import { Client, Account } from "node-appwrite";

// Extend NextApiRequest to include user property
interface ExtendedNextApiRequest extends NextApiRequest {
    user?: { id: string };
}

// Helper function to validate JWT format
function isValidJwt(token: string): boolean {
    return /^([^.]+\.){2}[^.]+$/.test(token);
}

// Function to initialize Appwrite client
function initAppwriteClient(sessionToken: string) {
    const client = new Client();
    client
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!) // Set your Appwrite API Endpoint
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)   // Set your project ID
        .setJWT(sessionToken);                                  // Ensure this is the expected method for your Appwrite setup

    return new Account(client);
}

// Middleware to attach user details to request
export async function withUserSession(req: ExtendedNextApiRequest, res: NextApiResponse, next: NextApiHandler) {
    try {
        const sessionToken = req.cookies['appwrite-session']; // Assuming the session token is stored in a cookie
        if (!sessionToken) {
            return res.status(401).json({ error: 'No session token provided' });
        }

        console.log("Retrieved JWT:", sessionToken); // Log the retrieved JWT
        if (!isValidJwt(sessionToken)) {
            console.error("Invalid JWT format:", sessionToken); // Log invalid JWT format
            return res.status(400).json({ error: 'Invalid JWT format' }); // Return error response
        }

        const account = initAppwriteClient(sessionToken);

        try {
            const userData = await account.get(); // Remove fetchOptions argument
            req.user = {
                id: userData.$id, // Assuming $id is the user ID in the response from Appwrite
            };
            next(req, res);
        } catch (error: any) {
            console.error('Unexpected error during Appwrite API call:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    } catch (error: any) {
        console.error('Failed to authenticate using Appwrite session:', error);
        res.status(401).json({ error: 'Authentication failed' });
    }
}