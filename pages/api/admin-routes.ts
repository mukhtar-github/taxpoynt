// This is a route that allows you to create and fetch tax updates from the database
import { createAdminClient } from 'lib/appwrite';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { database } = await createAdminClient();

  switch (method) {
    case 'POST':
      // Create a new tax update
      try {
        const { title, description, category, date } = req.body;
        const result = await database.createDocument(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
          process.env.NEXT_PUBLIC_APPWRITE_TAX_UPDATES_COLLECTION_ID!,
          'unique()',
          { title, description, category, date }
        );
        res.status(201).json(result);
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'GET':
      // Fetch all tax updates
      try {
        const result = await database.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
          process.env.NEXT_PUBLIC_APPWRITE_TAX_UPDATES_COLLECTION_ID!
        );
        res.status(200).json(result);
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
