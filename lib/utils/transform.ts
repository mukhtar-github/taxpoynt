import { Models } from 'node-appwrite';
import { TaxUpdate, TaxReminder } from '@/types'; // Updated import path

export const transformDocumentToTaxUpdate = (doc: Models.Document): TaxUpdate => ({
  $id: doc.$id as string,
  title: doc.title as string,
  description: doc.description as string,
  date: doc.date as string,
  category: doc.category as 'law_change' | 'new_regulation' | 'deadline_extension',
});

export const transformDocumentToTaxReminder = (doc: Models.Document): TaxReminder => ({
  id: doc.id as string,
  title: doc.title as string,
  dueDate: doc.dueDate as string,
  description: doc.description as string,
  priority: doc.priority as 'high' | 'medium' | 'low',
  completed: doc.completed as boolean,
});