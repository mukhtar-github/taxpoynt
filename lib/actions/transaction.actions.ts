'use server'

import axios from 'axios';
import { getMonoSecretKey } from 'lib/utils';
import { createAdminClient } from 'lib/appwrite';
import { ID } from 'node-appwrite';
import { getEnvVariable } from 'lib/utils';
import { Transaction } from 'types';

// Retrieve and validate the MONO_API_URL_TRANSACTIONS environment variable
const MONO_API_BASE_URL = getEnvVariable('MONO_API_URL_TRANSACTIONS');

const NEXT_PUBLIC_APPWRITE_DATABASE_ID = getEnvVariable('NEXT_PUBLIC_APPWRITE_DATABASE_ID');
const NEXT_PUBLIC_APPWRITE_TRANSACTION_COLLECTION_ID = getEnvVariable('NEXT_PUBLIC_APPWRITE_TRANSACTION_COLLECTION_ID');

interface MonoTransaction {
    meta: any;
    id: string;
    narration: string;
    amount: number;
    type: 'debit' | 'credit';
    category: string | null;
    balance: number | null;
    date: string;
    currency: string;
}

interface MonoApiResponse<T> {
    data: T;
    hasNewData: boolean;
}

export const getMonoTransactions = async (
    accountId: string,
    page: number = 1,
    realTime: boolean = false
): Promise<MonoApiResponse<MonoTransaction[]>> => {
    try {
        const response = await axios.get<MonoTransaction[]>(`${MONO_API_BASE_URL}/accounts/${accountId}/transactions`, {
            headers: {
                'Content-Type': 'application/json',
                'mono-sec-key': getMonoSecretKey(),
                'x-realtime': realTime ? 'true' : 'false',
            },
            params: { page },
        });

        // Check if the response is an array of transactions
        if (!Array.isArray(response.data)) {
            throw new Error('Failed to fetch transactions: Invalid response format');
        }

        const hasNewData = response.headers['x-has-new-data'] === 'true';

        return {
            data: response.data,
            hasNewData,
        };
    } catch (error) {
        console.error('Error fetching Mono transactions:', error);
        throw new Error('Failed to fetch transactions from Mono');
    }
};

export const saveTransaction = async (transaction: Transaction, userId: string, accountId: string): Promise<Transaction> => {
    try {
        const { database } = await createAdminClient();
        const savedTransaction = await database.createDocument(
            NEXT_PUBLIC_APPWRITE_DATABASE_ID,
            NEXT_PUBLIC_APPWRITE_TRANSACTION_COLLECTION_ID,
            ID.unique(),
            {
                monoId: transaction.monoId,
                narration: transaction.narration,
                amount: transaction.amount,
                type: transaction.type,
                category: transaction.category,
                balance: transaction.balance,
                date: transaction.date,
                currency: transaction.currency,
                userId,
                accountId,
            }
        );
        console.log('Saved transaction:', savedTransaction.$id);
        return savedTransaction as unknown as Transaction;
    } catch (error) {
        console.error('Error saving transaction:', error);
        throw new Error('Failed to save transaction');
    }
};

export const saveMultipleTransactions = async (transactions: Transaction[], userId: string, accountId: string): Promise<void> => {
    try {
        await Promise.all(transactions.map(transaction => saveTransaction(transaction, userId, accountId)));
        console.log(`Saved ${transactions.length} transactions`);
    } catch (error) {
        console.error('Error saving multiple transactions:', error);
        throw new Error('Failed to save multiple transactions');
    }
};

export const fetchAndSaveAllTransactions = async (accountId: string, userId: string, realTime: boolean = false): Promise<{ success: boolean; totalSaved: number; hasNewData: boolean }> => {
    let page = 1;
    let hasNextPage = true;
    let totalSaved = 0;
    let hasNewData = false;

    try {
        while (hasNextPage) {
            console.log(`Fetching page ${page} of transactions...`);
            const response = await getMonoTransactions(accountId, page, realTime);
            const transactions = response.data;
            // Map MonoTransaction[] to Transaction[]
            const transactionsToSave: Transaction[] = transactions.map((tx: MonoTransaction) => ({
                ...tx,
                $id: ID.unique(), // Assign a unique ID
                monoId: tx.id,
                userId,
                accountId,
            }));

            await saveMultipleTransactions(transactionsToSave, userId, accountId);
            totalSaved += transactionsToSave.length;

            console.log(`Saved ${transactionsToSave.length} transactions from page ${page}`);

            if (transactions.length > 0) {
                hasNextPage = transactions[0].meta?.next !== undefined;
            }
            page++;

            if (response.hasNewData) {
                hasNewData = true;
            }
        }

        console.log(`Finished fetching and saving all transactions. Total saved: ${totalSaved}`);
        return { success: true, totalSaved, hasNewData };
    } catch (error) {
        console.error('Error in fetchAndSaveAllTransactions:', error);
        throw new Error('Failed to fetch and save all transactions');
    }
};

export const syncAccountTransactions = async (accountId: string, userId: string, realTime: boolean = false): Promise<{ success: boolean; message: string; hasNewData: boolean }> => {
    try {
        // First, sync transactions with Mono to ensure we have the latest data
        await getMonoTransactions(accountId, 1, realTime);
        
        // Then fetch and save all transactions
        const result = await fetchAndSaveAllTransactions(accountId, userId, realTime);
        
        return { 
            success: true, 
            message: `Successfully synced and saved ${result.totalSaved} transactions`,
            hasNewData: result.hasNewData
        };
    } catch (error) {
        console.error('Error syncing account transactions:', error);
        return { success: false, message: 'Failed to sync account transactions', hasNewData: false };
    }
};

export const initiateReauthorization = async (accountId: string) => {
    try {
        const response = await axios.post(`${MONO_API_BASE_URL}/accounts/${accountId}/reauthorise`, {}, {
            headers: {
                'Content-Type': 'application/json',
                'mono-sec-key': getMonoSecretKey(),
            },
        });

        if (response.data.status === 'successful') {
            return {
                success: true,
                message: 'Reauthorization initiated successfully',
                reauthoriseUrl: response.data.data.reauthorise_url,
            };
        } else {
            throw new Error(response.data.message || 'Failed to initiate reauthorization');
        }
    } catch (error) {
        console.error('Error initiating reauthorization:', error);
        throw new Error('Failed to initiate reauthorization');
    }
};