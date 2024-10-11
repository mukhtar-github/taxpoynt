import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import { createSessionClient } from "../appwrite";
import jwt from 'jsonwebtoken'; // Import JWT to validate the token format
import { getEnvVariable } from "../utils"; // Import your utility function
import { Account } from 'appwrite'; // Import Account from Appwrite

// Extend NextApiRequest to include user property
export interface ExtendedNextApiRequest extends NextApiRequest {
    user?: { id: string };
}

// Refactor the middleware as a higher-order function
export const withUserSession = (handler: NextApiHandler) => async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
  try {
    const sessionToken = req.cookies['appwrite-session'];
    if (!sessionToken) {
      return res.status(401).json({ error: 'No session token provided' });
    }

    // Validate and verify JWT using getEnvVariable
    let secret: string;
    try {
      secret = getEnvVariable('JWT_SECRET'); // Securely fetched secret
    } catch (envError) {
      console.error(envError.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    try {
      jwt.verify(sessionToken, secret);
    } catch (err) {
      return res.status(400).json({ error: 'Invalid session token format or signature' });
    }

    // Pass the sessionToken to createSessionClient
    const client = await createSessionClient(req);
    if (!client) {
      return res.status(500).json({ error: 'Failed to create session client' });
    }

    client.setJWT(sessionToken); // Ensure the JWT is set correctly

    const account = new Account(client); // Instantiate Account

    try {
      const userData = await account.get();
      req.user = {
        id: userData.$id,
        // Add any other user data you need
      };
      return handler(req, res); // Proceed to the handler
    } catch (error: any) {
      console.error('Unexpected error during Appwrite API call:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } catch (error: any) {
    console.error('Failed to authenticate using Appwrite session:', error);
    return res.status(401).json({ error: 'Authentication failed' });
  }
};