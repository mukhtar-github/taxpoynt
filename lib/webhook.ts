"use server";
import { NextApiRequest, NextApiResponse } from 'next';
import { updateUserWithMonoAccountId } from './actions/user.actions';// Import the function to update the user document

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
    verifyWebhook(req, res, async () => {
        const webhook = req.body;

        switch (webhook.event) {
            case "mono.events.account_updated":
                // Handle the account updated event
                const account = webhook.data.account;
                console.log('Account updated:', account);
                break;

            case "mono.events.account_connected":
                // Handle the account connected event
                const accountId = webhook.data.account.id;
                const userId = webhook.data.user.id; // Assuming the user ID is part of the webhook payload

                try {
                    await updateUserWithMonoAccountId({ DOCUMENT_ID: userId, accountId });
                    console.log('Account connected and saved:', accountId);
                } catch (error) {
                    console.error('Error updating user with Mono Account ID', error);
                }
                break;

            // Add more cases as needed for other events
            default:
                console.log('Unhandled event:', webhook.event);
        }

        return res.status(200).end();
    });
};
