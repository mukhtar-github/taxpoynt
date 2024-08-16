// pages/api/webhook.ts
"use server";
import { NextApiRequest, NextApiResponse } from 'next';
import { updateUserWithMonoAccountId } from '../../lib/actions/user.actions';
import { errorHandler } from '../../lib/middleware/errorHandler';
import { createAdminClient } from '../../lib/appwrite';
import { Query } from 'node-appwrite'; // Add this import

const secret = process.env.MONO_WEBHOOK_SEC;

async function verifyWebhook(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    console.log("Received headers:", req.headers); // Log all headers for debugging
    console.log("Expected secret:", secret); // Debugging line

    if (req.headers['mono-webhook-secret'] !== secret) {
        res.status(401).json({ message: "Unauthorized request." });
        throw new Error("Unauthorized request due to secret mismatch.");
    }
}

async function findUserByBVN(bvn: string): Promise<any> {
    const { database } = await createAdminClient();
    console.log("Attempting to find user with BVN:", bvn);
    try {
        const users = await database.listDocuments(
            process.env.APPWRITE_DATABASE_ID!,
            process.env.APPWRITE_USER_COLLECTION_ID!,
            [Query.equal('identification_no', bvn)]
        );
        if (users.documents.length > 0) {
            return users.documents[0];
        }
        return null;
    } catch (error) {
        console.error('Error finding user by BVN:', error);
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

        if (webhook.event === 'mono.events.account_updated' || webhook.event === 'mono.events.account_connected') {
            const bvn = webhook.data.account.bvn;
            const accountId = webhook.data.account._id;

            if (!bvn || !accountId) {
                console.error('BVN or Account ID is missing in the webhook payload');
                return res.status(400).json({ error: "BVN or Account ID is missing in the webhook payload." });
            }

            const user = await findUserByBVN(bvn);
            if (!user) {
                console.error('No user found with BVN:', bvn);
                return res.status(404).json({ error: 'User not found.' });
            }

            const updatedUser = await updateUserWithMonoAccountId({
                DOCUMENT_ID: user.$id, // Use the Appwrite document ID
                accountId: accountId
            });
            console.log('User account updated successfully:', updatedUser);
            res.status(200).json({ message: 'User updated successfully' });
        } else {
            console.log('Unhandled event:', webhook.event);
            res.status(400).json({ message: 'Unhandled event type' });
        }
    } catch (error) {
        if (error instanceof Error) {
            errorHandler(error, req, res);
        } else {
            errorHandler(new Error('Unknown error occurred'), req, res);
        }
    }
}