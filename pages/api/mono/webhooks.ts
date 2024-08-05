// pages/api/mono/webhooks.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { event, data } = req.body;

        // Handle different types of webhook events
        switch(event) {
            case 'mono.events.account_connected':
                // Process the account connected event
                break;
            case 'mono.events.account_updated':
                // Process account updates
                break;
            default:
                console.log('Unhandled event:', event);
        }

        res.status(200).json({ message: 'Webhook received' });
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}

// example js implementation from docs
// const secret = process.env.MONO_WEBHOOK_SEC;

// function verifyWebhook(req, res, next) {
//   if (req.headers['mono-webhook-secret'] !== secret) {
//     return res.status(401).json({
//       message: "Unauthorized request."
//     });
//   }
//   next();
// }

// router.post('/webhook', verifyWebhook, (req, res) => {
//   const webhook = req.body;
//   switch(webhook.event) {
//     case "mono.events.account_updated":
//     // do something with webhook.data.account;
//     break;
//   }
//   return res.sendStatus(200);
// });

