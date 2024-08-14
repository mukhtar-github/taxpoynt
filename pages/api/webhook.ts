"use server";
import { NextApiRequest, NextApiResponse } from 'next';
import { updateUserWithMonoAccountId } from '../../lib/actions/user.actions';
import { errorHandler } from '../../lib/middleware/errorHandler';

const secret = process.env.MONO_WEBHOOK_SEC;

async function verifyWebhook(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    console.log("Received headers:", req.headers); // Log all headers for debugging
    console.log("Expected secret:", secret); // Debugging line

    if (req.headers['mono-webhook-secret'] !== secret) {
        res.status(401).json({ message: "Unauthorized request." });
        return; // Stop further execution after sending response
    }
}

export default async function handleWebhook(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return;
    }

    console.log('Received webhook payload:', req.body);

    try {
        await verifyWebhook(req, res);

        // Validate the structure of the webhook payload
        if (!req.body.data || !req.body.data.account) {
            console.error('Webhook data is incomplete or missing:', req.body);
            return res.status(400).json({ error: 'Bad Request: Incomplete data' });
        }

        const { account } = req.body.data;
        if (!account._id || !account.name || !account.accountNumber) {
            console.error('Required account fields are missing:', account);
            return res.status(400).json({ error: 'Bad Request: Missing required account fields' });
        }

        const userId = account._id; // Assuming _id is the user ID

        try {
            const updatedUser = await updateUserWithMonoAccountId({
                DOCUMENT_ID: userId,
                accountId: account._id, // Map account ID from webhook
                // Add other fields as necessary
            });
            console.log('User account updated successfully:', updatedUser);
            res.status(200).json({ message: 'User updated successfully' });
        } catch (error) {
            console.error('Error updating user:', error);
            return res.status(404).json({ error: 'Error: Document with the requested ID could not be found.' });
        }
    } catch (error) {
        console.error('Error in webhook verification:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}