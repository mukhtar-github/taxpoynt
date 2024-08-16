// pages/api/webhook.ts
"use server";
import { NextApiRequest, NextApiResponse } from 'next';
import { updateUserWithMonoAccountId } from '../../lib/actions/user.actions';
import { errorHandler } from '../../lib/middleware/errorHandler';
import { createAdminClient } from '../../lib/appwrite'; // Ensure this import is correct based on your actual file structure

const secret = process.env.MONO_WEBHOOK_SEC;

async function verifyWebhook(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    console.log("Received headers:", req.headers); // Log all headers for debugging
    console.log("Expected secret:", secret); // Debugging line

    if (req.headers['mono-webhook-secret'] !== secret) {
        res.status(401).json({ message: "Unauthorized request." });
        throw new Error("Unauthorized request due to secret mismatch.");
    }
}

async function extractUserId(webhook: any): Promise<string | null> {
    // Adjust this logic based on your webhook payload structure
    return webhook.data.user ? webhook.data.user.id : null;
}

async function fetchUserById(userId: string): Promise<any> {
    const { database } = await createAdminClient();
    try {
        const userDocument = await database.getDocument(process.env.APPWRITE_DATABASE_ID!, process.env.APPWRITE_USER_COLLECTION_ID!, userId);
        return userDocument;
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        throw error;
    }
}

export default async function handleWebhook(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return;
    }

    try {
        await verifyWebhook(req, res);

        const webhook = req.body;
        console.log("Received webhook data:", webhook);  // Detailed logging

        const userId = await extractUserId(webhook);
        if (!userId) {
            return res.status(400).json({ error: "User identifier missing in webhook payload." });
        }

        const user = await fetchUserById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        if (webhook.event === "mono.events.account_connected" || webhook.event === "mono.events.account_updated") {
            if (user.accountId === null) { // Check if accountId is initially null
                const accountId = webhook.data.account._id; // Assuming this is how you get accountId from webhook
                if (!accountId) {
                    return res.status(400).json({ error: "Account ID missing in webhook data." });
                }

                await updateUserWithMonoAccountId({
                    DOCUMENT_ID: userId,
                    accountId: accountId
                });
                return res.status(200).json({ message: "Account linked successfully." });
            } else {
                return res.status(400).json({ error: "Account already linked." });
            }
        } else {
            console.log('Unhandled event:', webhook.event);
            return res.status(400).json({ message: 'Unhandled event type' });
        }
    } catch (error) {
        if (error instanceof Error) {
            errorHandler(error, req, res);
        } else {
            errorHandler(new Error('Unknown error occurred'), req, res);
        }
    }
}