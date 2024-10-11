// This is a scheduled job that fetches tax updates from an external API and saves them to the database

import axios from 'axios';
import { createAdminClient } from 'lib/appwrite';
import { TaxUpdate } from 'types/index';

export async function fetchTaxUpdates(): Promise<void> {
  const { database } = await createAdminClient();

  try {
    // Fetch updates from external API
    const response = await axios.get(`${process.env.EXTERNAL_API_URL}/tax-updates`);
    const updates: TaxUpdate[] = response.data;

    for (const update of updates) {
      await database.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_TAX_UPDATES_COLLECTION_ID!,
        'unique()',
        {
          title: update.title,
          description: update.description,
          date: update.date,
          category: update.category,
        }
      );
    }

    console.log('Tax updates fetched and saved successfully');
  } catch (error) {
    console.error('Error fetching tax updates:', error);
  }
}
