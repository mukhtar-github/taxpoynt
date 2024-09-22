import { createAdminClient } from "../appwrite";
import { ID } from 'node-appwrite';
import { getEnvVariable } from '../utils';

// Define types for our tax updates and reminders
export async function getTaxUpdates(): Promise<any[]> {
  try {
    const { database } = await createAdminClient();
    const response = await database.listDocuments(
      getEnvVariable('NEXT_PUBLIC_APPWRITE_DATABASE_ID'),
      getEnvVariable('NEXT_PUBLIC_APPWRITE_TAX_UPDATES_COLLECTION_ID')
    );

    return response.documents;
  } catch (error) {
    console.error('Error fetching tax updates:', error);
    return [];
  }
}

export async function getTaxReminders(): Promise<any[]> {
  try {
    const { database } = await createAdminClient();
    const response = await database.listDocuments(
      getEnvVariable('NEXT_PUBLIC_APPWRITE_DATABASE_ID'),
      getEnvVariable('NEXT_PUBLIC_APPWRITE_TAX_REMINDERS_COLLECTION_ID')
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
      getEnvVariable('NEXT_PUBLIC_APPWRITE_DATABASE_ID'),
      getEnvVariable('NEXT_PUBLIC_APPWRITE_TAX_REMINDERS_COLLECTION_ID'),
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
      getEnvVariable('NEXT_PUBLIC_APPWRITE_DATABASE_ID'),
      getEnvVariable('NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID'),
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
      getEnvVariable('NEXT_PUBLIC_APPWRITE_DATABASE_ID'),
      getEnvVariable('NEXT_PUBLIC_APPWRITE_TAX_UPDATES_COLLECTION_ID'),
      'unique()',
      updateData
    );
    return response;
  } catch (error) {
    console.error('Error creating tax update:', error);
    throw error;
  }
};

export const createTaxReminder = async (reminderData: any): Promise<any> => {
  try {
    const { database } = await createAdminClient();
    const response = await database.createDocument(
      getEnvVariable('NEXT_PUBLIC_APPWRITE_DATABASE_ID'),
      getEnvVariable('NEXT_PUBLIC_APPWRITE_TAX_REMINDERS_COLLECTION_ID'),
      'unique()',
      reminderData
    );
    return response;
  } catch (error) {
    console.error('Error creating tax reminder:', error);
    throw error;
  }
};

export const deleteTaxUpdate = async (updateId: string): Promise<void> => {
  try {
    const { database } = await createAdminClient();
    await database.deleteDocument(
      getEnvVariable('NEXT_PUBLIC_APPWRITE_DATABASE_ID'),
      getEnvVariable('NEXT_PUBLIC_APPWRITE_TAX_UPDATES_COLLECTION_ID'),
      updateId
    );
  } catch (error) {
    console.error('Error deleting tax update:', error);
    throw error;
  }
};

export const deleteTaxReminder = async (reminderId: string): Promise<void> => {
  try {
    const { database } = await createAdminClient();
    await database.deleteDocument(
      getEnvVariable('NEXT_PUBLIC_APPWRITE_DATABASE_ID'),
      getEnvVariable('NEXT_PUBLIC_APPWRITE_TAX_REMINDERS_COLLECTION_ID'),
      reminderId
    );
  } catch (error) {
    console.error('Error deleting tax reminder:', error);
    throw error;
  }
};

// Additional functions
export async function createTaxType(taxType: Omit<TaxType, '$id'>) {
  const { database } = await createAdminClient();
  return await database.createDocument(
    getEnvVariable('NEXT_PUBLIC_APPWRITE_DATABASE_ID'),
    getEnvVariable('NEXT_PUBLIC_APPWRITE_TAX_TYPES_COLLECTION_ID'),
    ID.unique(),
    taxType
  );
}

export async function createTaxReturn(taxReturn: Omit<TaxReturn, '$id'>) {
  const { database } = await createAdminClient();
  return await database.createDocument(
    getEnvVariable('NEXT_PUBLIC_APPWRITE_DATABASE_ID'),
    getEnvVariable('NEXT_PUBLIC_APPWRITE_TAX_RETURNS_COLLECTION_ID'),
    ID.unique(),
    taxReturn
  );
}

// Add the missing export
export const createUserReminder = async (userReminder: Omit<UserReminder, '$id'>) => {
  const { database } = await createAdminClient();
  return await database.createDocument(
    getEnvVariable('NEXT_PUBLIC_APPWRITE_DATABASE_ID'),
    getEnvVariable('NEXT_PUBLIC_APPWRITE_USER_REMINDERS_COLLECTION_ID'),
    ID.unique(),
    userReminder
  );
};

export const deleteUserReminder = async (reminderId: string): Promise<void> => {
  const { database } = await createAdminClient();
  await database.deleteDocument(
    getEnvVariable('NEXT_PUBLIC_APPWRITE_DATABASE_ID'),
    getEnvVariable('NEXT_PUBLIC_APPWRITE_USER_REMINDERS_COLLECTION_ID'),
    reminderId
  );
};
