import { Query, Models } from 'node-appwrite';
import { createAdminClient } from "@/lib/appwrite";
import { getEnvVariable } from '@/lib/utils';
import { TaxReturn } from 'types';
import { transformDocumentToTaxReturn } from '@/lib/utils/transform';

export const getTaxReturns = async (userId: string): Promise<TaxReturn[]> => {
  // Initialize the Appwrite client and get the database instance
  const { database } = await createAdminClient();
  
  const DATABASE_ID = getEnvVariable('NEXT_PUBLIC_APPWRITE_DATABASE_ID');
  const TAX_RETURN_COLLECTION_ID = getEnvVariable('NEXT_PUBLIC_APPWRITE_TAX_RETURN_COLLECTION_ID');

  const taxReturnDocuments = await database.listDocuments(
    DATABASE_ID,
    TAX_RETURN_COLLECTION_ID,
    [Query.equal('userId', [userId])]
  );

  // Transform Documents to TaxReturns
  const taxReturns: TaxReturn[] = taxReturnDocuments.documents.map(transformDocumentToTaxReturn);

  return taxReturns;
};