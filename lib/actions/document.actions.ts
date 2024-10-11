import { createAdminClient } from "lib/appwrite";
import { Query } from 'appwrite';

interface Document {
  $id: string;
  name: string;
  type: string;
  uploadDate: string;
  userId: string;
  fileUrl: string;
  size: string;
  status: string;
}

export const getDocuments = async (userId: string): Promise<Document[]> => {
  try {
    const client = await createAdminClient();
    const documents = await client.database.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_DOCUMENTS_COLLECTION_ID!,
      [
        Query.equal('userId', userId)
      ]
    );
    const typedDocuments: Document[] = documents.documents.map(doc => ({
      $id: doc.$id,
      name: doc.name,
      type: doc.type,
      uploadDate: doc.uploadDate,
      userId: doc.userId,
      fileUrl: doc.fileUrl,
      size: doc.size,
      status: doc.status
    }));
    return typedDocuments;
  } catch (error) {
    console.error('Error fetching documents:', error);
    return [];
  }
};