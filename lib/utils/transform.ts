import { TaxUpdate, TaxReminder } from 'types/index';
import { Models } from 'appwrite';

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

// Add the export for `transformDocumentToTaxReturn`
export function transformDocumentToTaxReturn(document: Document): TaxReturn {
  // Implement the transformation logic here
  return {
    $id: document.$id,
    userId: document.userId,
    taxTypeId: "exampleTaxTypeId",
    taxYear: "2023",
    taxPeriod: "Q4",
    status: "draft",
    filingDate: null,
    dueDate: "2024-01-31",
    documentUrl: document.fileUrl,
    currentBalance: 0,
    // Add other necessary transformations
  };
}

// ... other exports ...