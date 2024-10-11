"use server";
import { NextApiRequest, NextApiResponse } from 'next';
import { updateUserWithMonoAccountId, updateUserReauthStatus } from 'lib/actions/user.actions';
import { errorHandler } from 'lib/middleware/errorHandler';
import { Query } from 'appwrite';
import { logger } from 'lib/logger';
import { initiateReauthorization } from 'lib/actions/transaction.actions';
import { createAdminClient } from 'lib/appwrite';
import { getEnvVariable } from 'lib/utils';
import { withUserSession } from 'lib/middleware/userSession';

const secret = getEnvVariable('MONO_WEBHOOK_SEC');

async function verifyWebhook(req: NextApiRequest, res: NextApiResponse): Promise<boolean> {
    try {
        logger.info("Received webhook request", { headers: req.headers });
        logger.debug("Expected secret", { secret });

        if (req.headers['mono-webhook-secret'] !== secret) {
            logger.warn("Unauthorized webhook attempt");
            res.status(401).json({ message: "Unauthorized request due to secret mismatch." });
            return false;
        }
        return true;
    } catch (error) {
        logger.error("Error verifying webhook", { error });
        res.status(401).json({ message: "Failed to verify webhook" });
        return false;
    }
}

async function findUserByBVN(bvn: string): Promise<any> {
    const { database } = await createAdminClient();
    logger.info("Attempting to find user with BVN", { bvn });
    try {
        const users = await database.listDocuments(
            getEnvVariable('NEXT_PUBLIC_APPWRITE_DATABASE_ID'),
            getEnvVariable('NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID'),
            [Query.equal('identification_no', bvn)]
        );
        return users.documents.length > 0 ? users.documents[0] : null;
    } catch (error) {
        logger.error('Error finding user by BVN', { error });
        throw error;
    }
}

async function handleAccountUpdate(webhook: any): Promise<void> {
    const bvn = webhook.data.account.bvn;
    const accountId = webhook.data.account._id;

    if (!bvn || !accountId) {
        throw new Error("BVN or Account ID is missing in the webhook payload.");
    }

    const user = await findUserByBVN(bvn);
    if (!user) {
        throw new Error('No user found with BVN');
    }

    await updateUserWithMonoAccountId({
        DOCUMENT_ID: user.$id,
        accountId: accountId
    });
    logger.info('User account updated successfully', { userId: user.$id });
}

async function handleReauthorizationRequired(webhook: any): Promise<void> {
    const accountId = webhook.data.account;

    if (!accountId) {
        throw new Error('Account ID is missing in the reauthorization webhook payload');
    }

    const reauthorizationResult = await initiateReauthorization(accountId);

    const { database } = await createAdminClient();
    const users = await database.listDocuments(
        getEnvVariable('APPWRITE_DATABASE_ID'),
        getEnvVariable('APPWRITE_USER_COLLECTION_ID'),
        [Query.equal('monoAccountId', accountId)]
    );

    if (users.documents.length === 0) {
        throw new Error('No user found with Mono account ID');
    }

    const user = users.documents[0];

    await updateUserReauthStatus({
        DOCUMENT_ID: user.$id,
        requiresReauth: true,
        reauthUrl: reauthorizationResult.reauthoriseUrl
    });

    logger.info('User marked for reauthorization', { userId: user.$id, accountId, reauthUrl: reauthorizationResult.reauthoriseUrl });
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const isValid = await verifyWebhook(req, res);
        if (!isValid) return;

        const webhook = req.body;
        logger.info("Received webhook data", { webhook });

        switch (webhook.event) {
            case 'mono.events.account_updated':
            case 'mono.events.account_connected':
                await handleAccountUpdate(webhook);
                res.status(200).json({ message: 'User updated successfully' });
                break;
            case 'mono.events.reauthorisation_required':
                await handleReauthorizationRequired(webhook);
                res.status(200).json({ message: 'User marked for reauthorization' });
                break;
            default:
                logger.error('Unhandled event', { event: webhook.event });
                res.status(400).json({ message: 'Unhandled event type' });
        }
    } catch (error) {
        logger.error("Error handling webhook", { error });
        errorHandler(error instanceof Error ? error : new Error('Unknown error occurred'), req, res);
    }
}

export default withUserSession(handler);