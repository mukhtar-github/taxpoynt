/* eslint-disable no-unused-vars */

import { ReactNode } from "react";

declare type SearchParamProps = {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

// ========================================

declare type SignUpParams = {
  firstName: string;
  lastName: string;
  businessName: string;
  address: string;
  state: string;
  businessRegDate: string;
  phone: string;
  identificationNo: string;
  email: string;
  password: string;
};

declare type LoginUser = {
  email: string;
  password: string;
};

declare type User = {
  $id: string;
  firstName: string;
  lastName: string;
  email: string;
  accountId?: string;
  // Add other necessary properties
};

declare type NewUserParams = {
  userId: string;
  email: string;
  name: string;
  password: string;
};

declare type UserContextType = {
  user: User | null;
};

declare type UserProviderProps = {
  children: ReactNode;
  user: User | null;
}

declare type DashboardLayoutProps = {
  children: React.ReactNode;
  user: User; // Define UserType based on your user structure
}

declare interface LinkUserProps {
  onAccountLinked?: () => Promise<void>;
  account: {
    id: string;
    name: string;
    // Add other necessary plain properties
  };
  database: {
    dbName: string;
    // Add other necessary plain properties
  };
  users: Array<{
    id: string;
    username: string;
    // Add other necessary plain properties
  }>;
}

declare type Transaction = {
  monoId: string;
  narration: string;
  amount: number;
  type: 'debit' | 'credit';
  balance: number;
  date: string;
  category: string;
  userId: string;
  accountId: string;
  status: string;
  isTaxRelated: boolean;
}

declare type MonoTransactionsResponse = {
  // Define the structure of the MonoTransactionsResponse interface
  // based on the actual response from the Mono API
  // Example:
  // id: string;
  // amount: number;
  // type: string;
  // date: string;
  // narration: string;
  // balance: number;
};

declare type MonoApiResponse<T> = {
  data: T;
  hasNewData: boolean;
}

declare type TaxReturnsListProps = {
  taxReturns: TaxReturn[];
}

declare type Document = {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  userId: string;
  fileUrl: string;
  size?: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  downloadUrl: string;
}

declare type DocumentListProps = {
  documents: Document[];
}

interface TaxUpdatesAndRemindersProps {
  // No userId needed
}

declare type TaxUpdate = {
  $id: string;
  title: string;
  description: string;
  date: string;
  category: 'law_change' | 'new_regulation' | 'deadline_extension';
};

declare type TaxUpdatesListProps = {
  taxUpdates: TaxUpdate[];
}

declare type TaxReminder = {
  id: string;
  title: string;
  dueDate: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
};

declare type TaxRemindersListProps = {
  taxReminders: TaxReminder[];
}

declare type UserReminder = {
  $id: string;
  userId: string;
  reminderType: string;
  reminderDate: string;
  reminderStatus: string;
  reminderFrequency: string;
  reminderMessage: string;
};

declare type Account = {
  id: string;
  userId: string;
  balance: number;
  accountId: string;
  bvn: string;
  name: string;
  type: string;
  currency: string;
  accountNumber: string;
  bankCode: string;
  institutionName: string;
};

declare type TaxType = {
  $id: string;
  name: string;
  description: string;
  taxRate: number;
  filingFrequency: 'annual' | 'quarterly' | 'monthly';
  documentationRequired: string[];
};

declare type TaxReturn = {
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
};

declare type TaxReturnCardProps = {
  taxReturn: TaxReturn;
};

declare interface HeaderBoxProps {
  type?: "title" | "greeting";
  title: string;
  subtext: string;
  user?: string;
}

declare interface MobileNavProps {
  user: User;
}

declare interface PageHeaderProps {
  topTitle: string;
  bottomTitle: string;
  topDescription: string;
  bottomDescription: string;
  connectBank?: boolean;
}

declare interface PaginationProps {
  page: number;
  totalPages: number;
}

// Define a type for the response you expect from the onSuccess callback
interface MonoSuccessResponse {
  code: string; // This typically will be the authorization code received from Mono
}

declare interface MonoLinkProps {
  user: User;
  // loading: boolean;
  // openMonoWidget: () => void;
}

declare interface AuthFormProps {
  type: "sign-in" | "sign-up";
}

declare interface BankDropdownProps {
  accounts: Account[];
  setValue?: (name: string, value: any) => void;
  otherStyles?: string;
}

declare interface BankTabItemProps {
  account: Account;
  appwriteItemId?: string;
}

// declare interface TotalBalanceBoxProps {
//   accounts: Account[];
//   totalBanks: number;
//   totalCurrentBalance: number;
// }

declare interface TotalBalanceBoxProps {
  taxTypes: TaxType[];
  // agencies: Agency[];
  totalReturns: number;
  // totalFilings: number;
  totalTaxLiability: number;
}

declare interface FooterProps {
  user: User;
  type?: "desktop" | "mobile";
}

declare type RightSidebarProps = {
  user: User;
  // transactions: Transaction[]; // Removed Transaction reference
  taxReturns: TaxReturn[];
}

declare interface SiderbarProps {
  user: User;
}

declare interface RecentTransactionsProps {
  accounts: Account[];
  // transactions: Transaction[]; // Removed Transaction reference
  appwriteItemId: string;
  page: number;
}

declare interface TransactionHistoryTableProps {
  // transactions: Transaction[]; // Removed Transaction reference
  page: number;
}

declare interface CategoryBadgeProps {
  category: string;
}

declare interface TransactionTableProps {
  transactions: Transaction[];
}
declare interface CategoryProps {
  category: string; // Changed from CategoryCount to string
}

declare interface DoughnutChartProps {
  taxTypes: TaxType[];
}

declare interface PaymentTransferFormProps {
  accounts: Account[];
}

// Actions
declare interface getAccountsProps {
  userId: string;
}

declare interface getAccountProps {
  appwriteItemId: string;
  accountId: string;
}

declare interface getInstitutionProps {
  institutionId: string;
}

declare interface getTransactionsProps {
  accessToken: string;
  accountId: string;
}

// declare interface CreateFundingSourceOptions {
//   customerId: string; // Dwolla Customer ID
//   fundingSourceName: string; // Dwolla Funding Source Name
//   plaidToken: string; // Plaid Account Processor Token
//   _links: object; // Dwolla On Demand Authorization Link
// }

declare interface CreateTransactionProps {
  name: string;
  amount: string;
  senderId: string;
  senderBankId: string;
  receiverId: string;
  receiverBankId: string;
  email: string;
}

declare interface getTransactionsByBankIdProps {
  bankId: string;
}

declare interface signInProps {
  email: string;
  password: string;
}

declare interface getUserInfoProps {
  userId: string;
}

declare interface exchangePublicTokenProps {
  publicToken: string;
  user: User;
}

// Define the properties expected for creating a tax return
declare interface createTaxReturnProps {
  taxReturnId: string;  // Unique identifier for the tax return instance
  userId: string;
  taxYear: number;
  taxTypeId: string;   // Identifier for the type of tax return
  status: 'drafted' | 'submitted' | 'pending review';
  documentUrl?: string; // Optional, only if the document is already generated
}

// declare interface createBankAccountProps {
//   accessToken: string;
//   userId: string;
//   accountId: string;
//   bankId: string;
//   fundingSourceUrl: string;
//   sharableId: string;
// }

declare interface getBanksProps {
  userId: string;
}

declare interface getBankProps {
  documentId: string;
}

declare interface getBankByAccountIdProps {
  accountId: string;
}

declare interface addBankAccountProps {
  userId: string;
  accessToken: string;
  institutionId: string;
}

declare interface removeBankAccountProps {
  appwriteItemId: string;
}
// mono-connect.d.ts
declare module 'mono.co/connect.js' {
  export interface MonoConnectOptions {
    key: string;
    onClose?: () => void;
    onSuccess: (publicToken: string) => void;
    onEvent?: (eventName: string, data?: any) => void;
    onLoad?: () => void;
  }

  export class MonoConnect {
    constructor(options: MonoConnectOptions);
    open(): void;
    close(): void;
    reauthorise(reauth_token: string): void;
  }
}
