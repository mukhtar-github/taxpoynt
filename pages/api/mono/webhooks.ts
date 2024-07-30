// pages/api/mono/webhooks.ts
// import type { NextApiRequest, NextApiResponse } from 'next';

// export default function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   const { event, data } = req.body;

//   switch (event) {
//     case 'mono.events.account_connected':
//       // Handle new account connection
//       break;
//     case 'mono.events.account_updated':
//       // Handle account updates
//       break;
//     default:
//       console.log('Received unhandled event:', event);
//   }

//   res.status(200).json({ message: 'Webhook received' });
// }


// // pages/api/mono/webhooks.ts
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
