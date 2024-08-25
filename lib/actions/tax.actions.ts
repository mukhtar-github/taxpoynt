import { createAdminClient } from '@/lib/appwrite';
import { Query } from 'node-appwrite';

// Define types for our tax updates and reminders
export async function getTaxUpdates(): Promise<any[]> {
  try {
    // In a real-world scenario, you would fetch this data from your database
    // For now, we'll return mock data
    const { database } = await createAdminClient();
    const response = await database.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_TAX_UPDATES_COLLECTION_ID!
    );

    return response.documents;
  } catch (error) {
    console.error('Error fetching tax updates:', error);
    return [];
  }
}

export async function getTaxReminders(): Promise<any[]> {
  try {
    // In a real-world scenario, you would fetch this data from your database
    // For now, we'll return mock data
    const { database } = await createAdminClient();
    const response = await database.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_TAX_REMINDERS_COLLECTION_ID!
    );

    return response.documents;
  } catch (error) {
    console.error('Error fetching tax reminders:', error);
    return [];
  }
}

// Additional helper functions
export async function markReminderAsComplete(reminderId: string): Promise<boolean> {
  try {
    const { database } = await createAdminClient();
    await database.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_TAX_REMINDERS_COLLECTION_ID!,
      reminderId,
      { completed: true }
    );
    return true;
  } catch (error) {
    console.error('Error marking reminder as complete:', error);
    return false;
  }
}

export async function subscribeToUpdates(userId: string, categories: string[]): Promise<boolean> {
  try {
    const { database } = await createAdminClient();
    await database.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID!,
      userId,
      { subscribedCategories: categories }
    );
    return true;
  } catch (error) {
    console.error('Error subscribing to updates:', error);
    return false;
  }
}

export const createTaxUpdate = async (updateData: any): Promise<any> => {
  try {
    const { database } = await createAdminClient();
    const response = await database.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_TAX_UPDATES_COLLECTION_ID!,
      'unique()',
      updateData
    );
    return response;
  } catch (error) {
    console.error('Error creating tax update:', error);
    throw error;
  }
}

export const createTaxReminder = async (reminderData: any): Promise<any> => {
  try {
    const { database } = await createAdminClient();
    const response = await database.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_TAX_REMINDERS_COLLECTION_ID!,
      'unique()',
      reminderData
    );
    return response;
  } catch (error) {
    console.error('Error creating tax reminder:', error);
    throw error;
  }
}

export const deleteTaxUpdate = async (updateId: string): Promise<void> => {
  try {
    const { database } = await createAdminClient();
    await database.deleteDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_TAX_UPDATES_COLLECTION_ID!,
      updateId
    );
  } catch (error) {
    console.error('Error deleting tax update:', error);
    throw error;
  }
}

export const deleteTaxReminder = async (reminderId: string): Promise<void> => {
  try {
    const { database } = await createAdminClient();
    await database.deleteDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_TAX_REMINDERS_COLLECTION_ID!,
      reminderId
    );
  } catch (error) {
    console.error('Error deleting tax reminder:', error);
    throw error;
  }
}

export async function getUserReminders(userId: string): Promise<any[]> {
  try {
    const { database } = await createAdminClient();
    const response = await database.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_USER_REMINDERS_COLLECTION_ID!,
      [
        Query.equal('userId', userId),
        Query.orderAsc('dueDate')
      ]
    );
    return response.documents;
  } catch (error) {
    console.error('Error fetching user reminders:', error);
    return [];
  }
}

export async function createUserReminder(userId: string, reminderData: any): Promise<any> {
  try {
    const { database } = await createAdminClient();
    const response = await database.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_USER_REMINDERS_COLLECTION_ID!,
      'unique()',
      {
        ...reminderData,
        userId: userId
      }
    );
    return response;
  } catch (error) {
    console.error('Error creating user reminder:', error);
    throw error;
  }
}

export async function deleteUserReminder(reminderId: string): Promise<void> {
  try {
    const { database } = await createAdminClient();
    await database.deleteDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_USER_REMINDERS_COLLECTION_ID!,
      reminderId
    );
  } catch (error) {
    console.error('Error deleting user reminder:', error);
    throw error;
  }
}