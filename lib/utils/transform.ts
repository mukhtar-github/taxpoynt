import { Models } from 'node-appwrite';
import { TaxReturn } from 'types'; // Adjust the import path as needed

export const transformDocumentToTaxReturn = (doc: Models.Document): TaxReturn => ({
  taxReturnId: doc.taxReturnId, // Ensure 'taxReturnId' exists in your Document
  taxPeriod: doc.taxPeriod,     // Ensure 'taxPeriod' exists in your Document
  documentUrl: doc.documentUrl, // Ensure 'documentUrl' exists in your Document
  status: doc.status,           // Ensure 'status' exists in your Document
  // Map additional properties as needed
});