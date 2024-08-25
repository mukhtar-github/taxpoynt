import { createAdminClient } from '@/lib/appwrite'; // Ensure this import points to your Appwrite configuration file
import { Query } from 'node-appwrite';
import { parseStringify } from '@/lib/utils'; // Adjust the import path as needed

export async function getTaxReturns(userId: string) {
  if (!userId || typeof userId !== 'string') {
    throw new Error('Invalid user ID');
  }

  try {
    const { database } = await createAdminClient();
    const response = await database.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_TAX_RETURN_COLLECTION_ID!,
      [
        Query.equal('userId', userId),
        Query.orderDesc('year'),
        Query.orderDesc('taxPeriod'),
        Query.limit(5)
      ]
    );

    return parseStringify(response.documents);
  } catch (error) {
    console.error('Failed to fetch tax returns:', error);
    throw new Error('Failed to fetch tax returns');
  }
}