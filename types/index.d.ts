/* eslint-disable no-unused-vars */

declare type SearchParamProps = {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

// ========================================

declare type SignUpParams = {
  first_name: string;
  last_name: string;
  business_name: string;
  address: string;
  state: string;
  business_reg_date: string;
  phone: string;
  identification_no: string;
  email: string;
  password: string;
};

declare type LoginUser = {
  email: string;
  password: string;
};

declare type User = {
  $id: string;
  email: string;
  accountId: string | null;
  first_name: string;
  last_name: string;
  business_name: string;
  address: string;
  state: string;
  business_reg_date: string;
  phone: string;
  identification_no: string;
  requiresReauth: boolean;
  reauthUrl: string | null;
  taxpoyntId: string;
  name: string;
  subscribed_categories: string[];
  isAdmin: boolean;
} | null;

declare type NewUserParams = {
  userId: string;
  email: string;
  name: string;
  password: string;
};

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
  status: string;
  message: string;
  timestamp: string;
  data: MonoTransaction[];
  meta: {
      total: number;
      page: number;
      previous: string | null;
      next: string | null;
  };
}

declare type MonoApiResponse<T> = {
  forEach(arg0: (transaction: { income: number; amount: number; }) => void): unknown;
  data: T;
  hasNewData: boolean;
}

declare type TaxReturn = {
  $id: string;
  taxReturnId: string;
  taxPeriod: string;
  documentUrl: string;
  status: string;
  currentBalance: number;
  type: string;
  year: string;
  dueDate: string;
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
  userId: string;
}

interface TaxUpdate {
  date: string | number | Date;
  category: ReactNode;
  $id: string;
  title: string;
  description: string;
}

interface Reminder {
  $id: string;
  title: string;
  description: string;
  dueDate: string;
}

declare type TaxUpdate = {
  $id: Key | null | undefined;
  id: string;
  title: string;
  description: string;
  date: string;
  category: 'law_change' | 'new_regulation' | 'deadline_extension';
}

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
}

declare type TaxRemindersListProps = {
  taxReminders: TaxReminder[];
}

declare type Account = {
  id: string;
  availableBalance: number;
  currentBalance: number;
  officialName: string;
  mask: string;
  institutionId: string;
  name: string;
  type: string;
  subtype: string;
  appwriteItemId: string;
  sharableId: string;
};

declare type Transaction = {
  id: string;
  $id: string;
  name: string;
  paymentChannel: string;
  type: string;
  accountId: string;
  amount: number;
  pending: boolean;
  category: string;
  date: string;
  image: string;
  type: string;
  $createdAt: string;
  channel: string;
  senderBankId: string;
  receiverBankId: string;
};

declare type Bank = {
  $id: string;
  accountId: string;
  bankId: string;
  accessToken: string;
  fundingSourceUrl: string;
  userId: string;
  sharableId: string;
};

declare type AccountTypes =
  | "depository"
  | "credit"
  | "loan "
  | "investment"
  | "other";

declare type Category = "Food and Drink" | "Travel" | "Transfer";

declare type CategoryCount = {
  name: string;
  count: number;
  totalCount: number;
};

declare type Receiver = {
  firstName: string;
  lastName: string;
};

declare type TransferParams = {
  sourceFundingSourceUrl: string;
  destinationFundingSourceUrl: string;
  amount: string;
};

declare type AddFundingSourceParams = {
  dwollaCustomerId: string;
  processorToken: string;
  bankName: string;
};

declare type NewDwollaCustomerParams = {
  firstName: string;
  lastName: string;
  email: string;
  type: string;
  address1: string;
  city: string;
  state: string;
  postalCode: string;
  dateOfBirth: string;
  ssn: string;
};

declare interface CreditCardProps {
  // account: Account;
  taxReturn: TaxReturn;
  userName: string;
  showBalance?: boolean;
}

declare interface BankInfoProps {
  account: Account;
  appwriteItemId?: string;
  type: "full" | "card";
}

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

// declare interface PlaidLinkProps {
//   user: User;
//   variant?: "primary" | "ghost";
//   dwollaCustomerId?: string;
// }

// declare type User = sdk.Models.Document & {
//   accountId: string;
//   email: string;
//   name: string;
//   items: string[];
//   accessToken: string;
//   image: string;
// };

declare interface AuthFormProps {
  type: "sign-in" | "sign-up";
}

declare interface BankDropdownProps {
  accounts: Account[];
  setValue?: UseFormSetValue<any>;
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

declare interface RightSidebarProps {
  user: User;
  transactions: Transaction[];
  taxReturns: Agency[] & TaxReturn[];
  // banks: Bank[] & Account[];
}

declare interface SiderbarProps {
  user: User;
}

declare interface RecentTransactionsProps {
  accounts: Account[];
  transactions: Transaction[];
  appwriteItemId: string;
  page: number;
}

declare interface TransactionHistoryTableProps {
  transactions: Transaction[];
  page: number;
}

declare interface CategoryBadgeProps {
  category: string;
}

declare interface TransactionTableProps {
  transactions: Transaction[];
}

declare interface CategoryProps {
  category: CategoryCount;
}

// declare interface DoughnutChartProps {
//   accounts: Account[];
// }

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
}

declare interface getInstitutionProps {
  institutionId: string;
}

declare interface getTransactionsProps {
  accessToken: string;
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

// mono-connect.d.ts
declare interface MonoConnectOptions {
    key: string;
    onSuccess: (data: any) => void;
    onClose: () => void;
    onLoad?: () => void;
  }

// mono-connect.d.ts
declare module '@mono.co/connect.js';
