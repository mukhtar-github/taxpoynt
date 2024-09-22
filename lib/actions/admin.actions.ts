import { Query } from "node-appwrite";
import { createAdminClient } from "../appwrite";

export async function setUserAsAdmin(userId: string, email: string) {
  try {
    const adminClient = await createAdminClient();
    const userCount = await adminClient.database.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!,
      [Query.limit(1)]
    );

    const isFirstUser = userCount.total === 0;

    // Check if the email domain is admin
    const isAdminDomain = email.endsWith('@taxpoynt.com');

    // Set isAdmin to true if either condition is met
    const isAdmin = isFirstUser || isAdminDomain;

    // Update the user document
    await adminClient.database.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!,
      userId,
      {
        isAdmin: isAdmin
      }
    );

    return { success: true, isAdmin };
  } catch (error) {
    console.error('Error setting user as admin:', error);
    throw error;
  }
}

export async function getAllUsers(page: number = 1, limit: number = 10, searchTerm: string = '', sortBy: string = 'createdAt', sortOrder: 'asc' | 'desc' = 'desc') {
  try {
    const offset = (page - 1) * limit;
    const adminClient = await createAdminClient();
    const users = await adminClient.database.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!,
      [
        Query.limit(limit),
        Query.offset(offset),
        Query[sortOrder === 'desc' ? 'orderDesc' : 'orderAsc'](sortBy),
        ...(searchTerm ? [Query.search('name', searchTerm), Query.search('email', searchTerm)] : [])
      ]
    );
    return { users: users.documents, total: users.total };
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

export async function updateUserAdminStatus(userId: string, isAdmin: boolean) {
  try {
    const adminClient = await createAdminClient();
    await adminClient.database.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!,
      userId,
      {
        isAdmin: isAdmin
      }
    );
    return { success: true };
  } catch (error) {
    console.error('Error updating user admin status:', error);
    throw error;
  }
}

export async function bulkUpdateUserAdminStatus(userIds: string[], isAdmin: boolean) {
  try {
    const adminClient = await createAdminClient();
    const promises = userIds.map(userId => 
      adminClient.database.updateDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!,
        userId,
        { isAdmin }
      )
    );
    await Promise.all(promises);
    return { success: true };
  } catch (error) {
    console.error('Error performing bulk update:', error);
    throw error;
  }
}