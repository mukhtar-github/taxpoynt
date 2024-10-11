/* eslint-disable no-prototype-builtins */
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";
import { User } from 'types/index';

// Replace the direct import with a dynamic import
let queryString: any;
import('query-string').then(module => {
  queryString = module;
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// FORMAT DATE TIME
export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    month: "short", // abbreviated month name (e.g., 'Oct')
    day: "numeric", // numeric day of the month (e.g., '25')
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };

  const dateDayOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    year: "numeric", // numeric year (e.g., '2023')
    month: "2-digit", // abbreviated month name (e.g., 'Oct')
    day: "2-digit", // numeric day of the month (e.g., '25')
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    month: "short", // abbreviated month name (e.g., 'Oct')
    year: "numeric", // numeric year (e.g., '2023')
    day: "numeric", // numeric day of the month (e.g., '25')
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };

  const formattedDateTime: string = new Date(dateString).toLocaleString(
    "en-US",
    dateTimeOptions
  );

  const formattedDateDay: string = new Date(dateString).toLocaleString(
    "en-US",
    dateDayOptions
  );

  const formattedDate: string = new Date(dateString).toLocaleString(
    "en-US",
    dateOptions
  );

  const formattedTime: string = new Date(dateString).toLocaleString(
    "en-US",
    timeOptions
  );

  return {
    dateTime: formattedDateTime,
    dateDay: formattedDateDay,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};

export function formatAmount(amount: number): string {
  const formatter = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  });

  return formatter.format(amount);
}

//Utility Functions for Formatting Tasks
// export const formatDate = (date: Date, formatStr: string = 'PP'): string => {
//   return format(date, formatStr);  // 'PP' is a date-fns format that corresponds to 'MMM do, yyyy'
// };

export const formatCurrency = (amount: number, locale: string = 'en-US', currency: string = 'USD'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(amount);
};

export function parseStringify<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

export function encryptId(id: string) {
  return btoa(id);
}

export function decryptId(id: string) {
  return atob(id);
}

// Ensure schema validations match the User type
export const authFormSchema = (type: string) =>
  z.object({
    // signup
    firstName: type === 'sign-in' ? z.string().optional() : z.string().min(3),
    lastName: type === 'sign-in' ? z.string().optional() : z.string().min(3),
    businessName: type === 'sign-in' ? z.string().optional() : z.string().min(3),
    address: type === 'sign-in' ? z.string().optional() : z.string().max(50),
    state: type === 'sign-in' ? z.string().optional() : z.string().min(3),
    businessRegDate: type === 'sign-in' ? z.string().optional() : z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid date format',
    }),
    phone: type === 'sign-in' ? z.string().optional() : z.string().max(15),
    identificationNo: type === 'sign-in' ? z.string().optional() : z.string().min(3),
    // both signup and login
    email: z.string().email(),
    password: z.string().min(8),
  });

export const removeSpecialCharacters = (value: string) => {
  return value.replace(/[^\w\s]/gi, "");
};

interface UrlQueryParams {
  params: string;
  key: string;
  value: string;
}

export function formUrlQuery({ params, key, value }: UrlQueryParams) {
  const currentUrl = queryString.parse(params);

  currentUrl[key] = value;

  return queryString.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
}

export function extractCustomerIdFromUrl(url: string) {
  // Split the URL string by '/'
  const parts = url.split("/");

  // Extract the last part, which represents the customer ID
  const customerId = parts[parts.length - 1];

  return customerId;
}

export const getTransactionStatus = (date: Date) => {
  const today = new Date();
  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(today.getDate() - 2);

  return date > twoDaysAgo ? "Processing" : "Success";
};

export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;

    constructor(message: string, statusCode: number, isOperational: boolean = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    }

    serializeErrors() {
        return [{ message: this.message }];
    }
}

// utils/taxCalculator.ts
export function calculateVAT(amount: number): number {
    const VAT_RATE = 0.075;  // 7.5%
    return amount * VAT_RATE;
}

interface TaxBracket {
  upperBound: number;
  rate: number;
}

const incomeTaxBrackets: TaxBracket[] = [
  { upperBound: 300000, rate: 0.07 },
  { upperBound: 600000, rate: 0.11 },
  { upperBound: 1100000, rate: 0.15 },
  { upperBound: 1600000, rate: 0.19 },
  { upperBound: 3200000, rate: 0.21 },
  { upperBound: Infinity, rate: 0.24 }
];

export function calculateIncomeTax(income: number): number {
  let tax = 0;
  let previousUpperBound = 0;

  for (const bracket of incomeTaxBrackets) {
      if (income > bracket.upperBound) {
          tax += (bracket.upperBound - previousUpperBound) * bracket.rate;
          previousUpperBound = bracket.upperBound;
      } else {
          tax += (income - previousUpperBound) * bracket.rate;
          break;
      }
  }

  return tax;
}

// Function to securely retrieve the Mono API secret key
export const getMonoSecretKey = (): string => {
  const monoSecretKey = process.env.MONO_SECRET_KEY;

  if (!monoSecretKey) {
    throw new Error('MONO_SECRET_KEY is not set in the environment variables');
  }

  return monoSecretKey;
};

export const getEnvVariable = (key: string): string => {
  const value = process.env[key];
  console.log(`Environment Variable ${key}:`, value); // Temporary debug log
  if (!value) {
    throw new Error(`Environment variable ${key} is not defined.`);
  }
  return value;
};

export const sanitizeAccount = (account: any) => ({
  id: account.id,
  name: account.name,
  // Add other necessary plain properties
});

export const sanitizeDatabase = (database: any) => ({
  dbName: database.dbName,
  // Add other necessary plain properties
});

export const sanitizeUsers = (users: any[]) => users.map(user => ({
  id: user.id,
  username: user.username,
  // Add other necessary plain properties
}));