import type { NextApiRequest, NextApiResponse } from 'next';
import { updateUserReauthStatus } from 'lib/actions/user.actions';
import { withUserSession, ExtendedNextApiRequest } from 'lib/middleware/userSession';

async function handler(req: ExtendedNextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Get the authenticated user's ID from the session
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    try {
      await updateUserReauthStatus({
        DOCUMENT_ID: userId,
        requiresReauth: false,
        reauthUrl: undefined
      });

      return res.status(200).json({ success: true, message: 'Re-authorization status updated successfully' });
    } catch (error) {
      console.error('Error updating re-authorization status:', error);
      return res.status(500).json({ error: 'Failed to update re-authorization status' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default function reAuthorizationRoute(req: NextApiRequest, res: NextApiResponse) {
  return withUserSession(req, res, () => handler(req as ExtendedNextApiRequest, res));
}
