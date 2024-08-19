import type { NextApiRequest, NextApiResponse } from 'next';
import { updateUserReauthStatus } from '@/lib/actions/user.actions';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
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
