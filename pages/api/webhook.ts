"use server";
import { NextApiRequest, NextApiResponse } from 'next';
import { updateUserWithMonoAccountId } from '../../lib/actions/user.actions';
import { errorHandler } from '../../lib/middleware/errorHandler';

const secret = process.env.MONO_WEBHOOK_SEC;

function verifyWebhook(req: NextApiRequest, res: NextApiResponse, next: Function) {
    if (req.headers['mono-webhook-secret'] !== secret) {
        return res.status(401).json({
            message: "Unauthorized request."
        });
    }
    next();
}

export const handleWebhook = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        verifyWebhook(req, res, async () => {
            const webhook = req.body;
            switch (webhook.event) {
                case "mono.events.account_connected":
                    const { id: accountId } = webhook.data.account;
                    const { id: userId } = webhook.data.user;
                    try {
                        // Update the user's account with the accountId received from the webhook
                        const updatedUser = await updateUserWithMonoAccountId({
                            DOCUMENT_ID: userId, // Assuming userId is the document ID in your database
                            accountId: accountId
                        });
                        console.log('User account updated successfully:', updatedUser);
                    } catch (error) {
                        errorHandler(error as Error, req, res);
                        return;
                    }
                    break;
                default:
                    console.log('Unhandled event:', webhook.event);
            }
            res.status(200).end();
        });
    } catch (error) {
        errorHandler(error as Error, req, res);
    }
};