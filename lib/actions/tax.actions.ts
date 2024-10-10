import { createAdminClient } from "../appwrite";
import { ID } from 'node-appwrite';
import { getEnvVariable } from '../utils';
import { TaxUpdate, TaxReminder, TaxType, TaxReturn, UserReminder, Transaction } from '@/types';

// Define types for our tax updates and reminders
export async function getTaxUpdates(): Promise<TaxUpdate[]> {
  try {
    const { database } = await createAdminClient();
    const response = await database.listDocuments(
      getEnvVariable('NEXT_PUBLIC_APPWRITE_DATABASE_ID'),
      getEnvVariable('NEXT_PUBLIC_APPWRITE_TAX_UPDATES_COLLECTION_ID')
    );

    const taxUpdates: TaxUpdate[] = response.documents.map(transformDocumentToTaxUpdate);

    return taxUpdates;
  } catch (error) {
    console.error('Error fetching tax updates:', error);
    return [];
  }
}

export async function getTaxReminders(): Promise<TaxReminder[]> {
  try {
    const { database } = await createAdminClient();
    const response = await database.listDocuments(
      getEnvVariable('NEXT_PUBLIC_APPWRITE_DATABASE_ID'),
      getEnvVariable('NEXT_PUBLIC_APPWRITE_TAX_REMINDERS_COLLECTION_ID')
    );

    const taxReminders: TaxReminder[] = response.documents.map(transformDocumentToTaxReminder);

    return taxReminders;
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

export const createTaxUpdate = async (updateData: Partial<TaxUpdate>): Promise<TaxUpdate> => {
  try {
    const { database } = await createAdminClient();
    const response = await database.createDocument(
      getEnvVariable('NEXT_PUBLIC_APPWRITE_DATABASE_ID'),
      getEnvVariable('NEXT_PUBLIC_APPWRITE_TAX_UPDATES_COLLECTION_ID'),
      'unique()',
      updateData
    );

    const taxUpdate: TaxUpdate = transformDocumentToTaxUpdate(response);
    return taxUpdate;
  } catch (error) {
    console.error('Error creating tax update:', error);
    throw error;
  }
};

export const createTaxReminder = async (reminderData: Partial<TaxReminder>): Promise<TaxReminder> => {
  try {
    const { database } = await createAdminClient();
    const response = await database.createDocument(
      getEnvVariable('NEXT_PUBLIC_APPWRITE_DATABASE_ID'),
      getEnvVariable('NEXT_PUBLIC_APPWRITE_TAX_REMINDERS_COLLECTION_ID'),
      'unique()',
      reminderData
    );

    const taxReminder: TaxReminder = transformDocumentToTaxReminder(response);
    return taxReminder;
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
  const response = await database.createDocument(
    getEnvVariable('NEXT_PUBLIC_APPWRITE_DATABASE_ID'),
    getEnvVariable('NEXT_PUBLIC_APPWRITE_TAX_TYPES_COLLECTION_ID'),
    ID.unique(),
    taxType
  );

  const createdTaxType: TaxType = {
    $id: response.$id,
    ...taxType,
  };

  return createdTaxType;
}

export async function createTaxReturn(taxReturn: Omit<TaxReturn, '$id'>) {
  const { database } = await createAdminClient();
  const response = await database.createDocument(
    getEnvVariable('NEXT_PUBLIC_APPWRITE_DATABASE_ID'),
    getEnvVariable('NEXT_PUBLIC_APPWRITE_TAX_RETURNS_COLLECTION_ID'),
    ID.unique(),
    taxReturn
  );

  const createdTaxReturn: TaxReturn = {
    $id: response.$id,
    ...taxReturn,
  };

  return createdTaxReturn;
};

// Add the missing export
export const createUserReminder = async (userReminder: Omit<UserReminder, '$id'>): Promise<UserReminder> => {
  const { database } = await createAdminClient();
  const response = await database.createDocument(
    getEnvVariable('NEXT_PUBLIC_APPWRITE_DATABASE_ID'),
    getEnvVariable('NEXT_PUBLIC_APPWRITE_USER_REMINDERS_COLLECTION_ID'),
    ID.unique(),
    userReminder
  );

  const createdUserReminder: UserReminder = {
    $id: response.$id,
    ...userReminder,
  };

  return createdUserReminder;
};

export const deleteUserReminder = async (reminderId: string): Promise<void> => {
  try {
    const { database } = await createAdminClient();
    await database.deleteDocument(
      getEnvVariable('NEXT_PUBLIC_APPWRITE_DATABASE_ID'),
      getEnvVariable('NEXT_PUBLIC_APPWRITE_USER_REMINDERS_COLLECTION_ID'),
      reminderId
    );
  } catch (error) {
    console.error('Error deleting user reminder:', error);
    throw error;
  }
};

// Transformation Functions
import { Models } from 'node-appwrite';
import { TaxUpdate, TaxReminder } from '@/types';

const transformDocumentToTaxUpdate = (doc: Models.Document): TaxUpdate => ({
  $id: doc.$id as string,
  title: doc.title as string,
  description: doc.description as string,
  date: doc.date as string,
  category: doc.category as 'law_change' | 'new_regulation' | 'deadline_extension',
});

const transformDocumentToTaxReminder = (doc: Models.Document): TaxReminder => ({
  id: doc.id as string,
  title: doc.title as string,
  dueDate: doc.dueDate as string,
  description: doc.description as string,
  priority: doc.priority as 'high' | 'medium' | 'low',
  completed: doc.completed as boolean,
});
