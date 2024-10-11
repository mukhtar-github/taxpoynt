export interface TaxUpdate {
  $id: string;
  title: string;
  description: string;
  date: string;
  category: 'law_change' | 'new_regulation' | 'deadline_extension';
}

export interface TaxReminder {
  id: string;
  title: string;
  dueDate: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
}

export interface TaxType {
  $id: string;
  name: string;
  description: string;
  taxRate: number;
  filingFrequency: 'annual' | 'quarterly' | 'monthly';
  documentationRequired: string[];
}

export interface TaxReturn {
  $id: string;
  userId: string;
  taxTypeId: string;
  taxYear: string;
  taxPeriod: string;
  status: 'draft' | 'submitted' | 'processing' | 'completed';
  filingDate: string | null;
  dueDate: string;
  documentUrl: string | null;
  currentBalance: number;
}

export interface UserReminder {
  $id: string;
  userId: string;
  reminderType: string;
  reminderDate: string;
  reminderStatus: string;
  reminderFrequency: string;
  reminderMessage: string;
}

export interface Transaction {
  $id: string;
  monoId: string;
  narration: string;
  amount: number;
  type: 'debit' | 'credit';
  category: string | null;
  balance: number | null;
  date: string;
  currency: string;
}

export interface SignUpParams {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  // Add any other required properties here
}

export interface User {
  id: string;
  // ... other user properties ...
}

// **Add the DashboardLayoutProps interface**
export interface DashboardLayoutProps {
  children: React.ReactNode;
  // Add any other props required by your layout here
}

// Ensure all other interfaces are correctly exported
export interface TaxReturn { /* ... */ }
export interface Document { /* ... */ }