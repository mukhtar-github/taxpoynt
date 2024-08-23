// This is a scheduled job that fetches tax updates from an external API and saves them to the database

import axios from 'axios';
import { createAdminClient } from '@/lib/appwrite';

export async function fetchTaxUpdates() {
  const { database } = await createAdminClient();
  
  try {
    // Fetch updates from external API
    const response = await axios.get('https://api.tax-authority.gov/updates');
    const updates = response.data;

    // Save each update to the database
    for (const update of updates) {
      await database.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_TAX_UPDATES_COLLECTION_ID!,
        'unique()',
        {
          title: update.title,
          description: update.description,
          category: update.category,
          date: update.date
        }
      );
    }

    console.log('Tax updates fetched and saved successfully');
  } catch (error) {
    console.error('Error fetching tax updates:', error);
  }
}
