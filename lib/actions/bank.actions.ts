"use server";

import { ID, Query } from 'appwrite';
import { createAdminClient } from "../appwrite";
import { parseStringify } from "../utils";
import { updateUserWithMonoAccountId } from "./user.actions";
import axios from 'axios';
import { getEnvVariable } from '../utils';

// Retrieve and validate environment variables
const MONO_API_BASE_URL = getEnvVariable('MONO_API_URL_TRANSACTIONS').replace('/account/auth', '');
const DATABASE_ID = getEnvVariable('NEXT_PUBLIC_APPWRITE_DATABASE_ID');
const ACCOUNTS_COLLECTION_ID = getEnvVariable('NEXT_PUBLIC_APPWRITE_ACCOUNTS_COLLECTION_ID');

// Helper function to get Mono secret key
const getMonoSecretKey = () => getEnvVariable('MONO_SECRET_KEY');

// Get account details
export const getAccount = async ({ accountId }: { accountId: string }) => {
  try {
    const { database } = createAdminClient();

    const accounts = await database.listDocuments(
      DATABASE_ID,
      ACCOUNTS_COLLECTION_ID,
      [Query.equal('accountId', accountId)]
    );

    if (accounts.documents.length === 0) {
      throw new Error("Account not found");
    }

    const accountData = accounts.documents[0];

    // Fetch the latest account details from Mono
    const monoResponse = await axios.get(`${MONO_API_BASE_URL}/accounts/${accountId}`, {
      headers: {
        'Content-Type': 'application/json',
        'mono-sec-key': getMonoSecretKey(),
      },
    });

    const monoAccountData = monoResponse.data.data;

    // Merge the data from Appwrite and Mono
    const mergedAccountData = {
      ...accountData,
      currentBalance: monoAccountData.balance, // Update with the latest balance from Mono
    };

    return parseStringify(mergedAccountData);
  } catch (error) {
    console.error("An error occurred while getting the account:", error);
    throw error;
  }
};

// Get institution info
export const getInstitution = async ({ bankCode }: { bankCode: string }) => {
  try {
    const response = await axios.get(`${MONO_API_BASE_URL}/coverage/institutions/${bankCode}`, {
      headers: {
        'Content-Type': 'application/json',
        'mono-sec-key': getMonoSecretKey(),
      },
    });

    const institution = response.data;

    return parseStringify(institution);
  } catch (error) {
    console.error("An error occurred while getting the institution:", error);
    throw error;
  }
};

// Link a new bank account
export const linkBankAccount = async ({ userId, authCode }: { userId: string, authCode: string }) => {
  try {
    // Exchange auth code for account ID
    const authResponse = await axios.post(getEnvVariable('MONO_API_URL'), {
      code: authCode,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'mono-sec-key': getMonoSecretKey(),
      },
    });

    const accountId = authResponse.data.id;

    // Get account details
    const accountResponse = await axios.get(`${MONO_API_BASE_URL}/accounts/${accountId}`, {
      headers: {
        'Content-Type': 'application/json',
        'mono-sec-key': getMonoSecretKey(),
      },
    });

    const accountData = accountResponse.data.data;

    // Save account to Appwrite
    const { database } = createAdminClient();
    const newAccount = await database.createDocument(
      DATABASE_ID,
      ACCOUNTS_COLLECTION_ID,
      ID.unique(),
      {
        userId,
        accountId: accountId,
        name: accountData.name,
        type: accountData.type,
        currency: accountData.currency,
        balance: accountData.balance,
        bvn: accountData.bvn,
        accountNumber: accountData.account_number,
        institutionName: accountData.institution.name,
        bankCode: accountData.institution.bank_code,
      }
    );

    // Update user with Mono account ID
    await updateUserWithMonoAccountId({ DOCUMENT_ID: userId, accountId });

    return parseStringify(newAccount);
  } catch (error) {
    console.error("An error occurred while linking a bank account:", error);
    throw error;
  }
};