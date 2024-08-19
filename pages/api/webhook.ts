"use server";
import { NextApiRequest, NextApiResponse } from 'next';
import { updateUserWithMonoAccountId, updateUserReauthStatus } from '../../lib/actions/user.actions';
import { errorHandler } from '../../lib/middleware/errorHandler';
import { createAdminClient } from '../../lib/appwrite';
import { Query } from 'node-appwrite';
import { logger } from '../../lib/logger';
import { initiateReauthorization } from '../../lib/actions/transaction.actions';

const secret = process.env.MONO_WEBHOOK_SEC;

async function verifyWebhook(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    logger.info("Received webhook request", { headers: req.headers });
    logger.debug("Expected secret", { secret });

    if (req.headers['mono-webhook-secret'] !== secret) {
        res.status(401).json({ message: "Unauthorized request." });
        throw new Error("Unauthorized request due to secret mismatch.");
    }
}

async function findUserByBVN(bvn: string): Promise<any> {
    const { database } = await createAdminClient();
    logger.info("Attempting to find user with BVN", { bvn });
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
        logger.error('Error finding user by BVN', { error });
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
        logger.info("Received webhook data", { webhook });

        switch (webhook.event) {
            case 'mono.events.account_updated':
            case 'mono.events.account_connected':
                await handleAccountUpdate(webhook, res);
                break;
            case 'mono.events.reauthorisation_required':
                await handleReauthorizationRequired(webhook, res);
                break;
            default:
                logger.error('Unhandled event', { event: webhook.event });
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

async function handleAccountUpdate(webhook: any, res: NextApiResponse) {
    const bvn = webhook.data.account.bvn;
    const accountId = webhook.data.account._id;

    if (!bvn || !accountId) {
        logger.error('BVN or Account ID is missing in the webhook payload');
        return res.status(400).json({ error: "BVN or Account ID is missing in the webhook payload." });
    }

    const user = await findUserByBVN(bvn);
    if (!user) {
        logger.error('No user found with BVN', { bvn });
        return res.status(404).json({ error: 'User not found.' });
    }

    const updatedUser = await updateUserWithMonoAccountId({
        DOCUMENT_ID: user.$id,
        accountId: accountId
    });
    logger.info('User account updated successfully', { updatedUser });
    res.status(200).json({ message: 'User updated successfully' });
}

async function handleReauthorizationRequired(webhook: any, res: NextApiResponse) {
    const accountId = webhook.data.account;

    if (!accountId) {
        logger.error('Account ID is missing in the reauthorization webhook payload');
        return res.status(400).json({ error: "Account ID is missing in the webhook payload." });
    }

    try {
        const reauthorizationResult = await initiateReauthorization(accountId);

        // Find user by Mono account ID
        const { database } = await createAdminClient();
        const users = await database.listDocuments(
            process.env.APPWRITE_DATABASE_ID!,
            process.env.APPWRITE_USER_COLLECTION_ID!,
            [Query.equal('monoAccountId', accountId)]
        );

        if (users.documents.length === 0) {
            logger.error('No user found with Mono account ID', { accountId });
            return res.status(404).json({ error: 'User not found.' });
        }

        const user = users.documents[0];

        // Update user's reauthorization status and store the reauthorize URL
        await updateUserReauthStatus({
            DOCUMENT_ID: user.$id,
            requiresReauth: true,
            reauthUrl: reauthorizationResult.reauthoriseUrl
        });

        logger.info('User marked for reauthorization', { userId: user.$id, accountId, reauthUrl: reauthorizationResult.reauthoriseUrl });
        res.status(200).json({ message: 'User marked for reauthorization', reauthUrl: reauthorizationResult.reauthoriseUrl });
    } catch (error) {
        logger.error('Error handling reauthorization', { error });
        res.status(500).json({ error: 'Failed to handle reauthorization' });
    }
}