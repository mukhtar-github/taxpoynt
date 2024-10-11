import { NextApiRequest, NextApiResponse } from 'next';
import { createAdminClient } from "../../lib/appwrite";
import { parseStringify } from '../../lib/utils';
import { withUserSession, ExtendedNextApiRequest } from 'lib/middleware/userSession';

const {
  NEXT_PUBLIC_APPWRITE_DATABASE_ID: DATABASE_ID,
  NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
} = process.env;

async function handler(req: ExtendedNextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { database } = await createAdminClient(); // Await the client creation
    
    // Get the user ID from the authenticated session
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Fetch user data from Appwrite
    const user = await database.getDocument(DATABASE_ID!, USER_COLLECTION_ID!, userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return the user data
    res.status(200).json(parseStringify(user));
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export default withUserSession(handler);
