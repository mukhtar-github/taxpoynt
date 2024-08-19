'use server'

import axios from 'axios';
import { getMonoSecretKey } from '@/lib/utils';
import { createAdminClient } from '@/lib/appwrite';
import { ID } from 'node-appwrite';

const MONO_API_BASE_URL = 'https://api.withmono.com/v2';
const { APPWRITE_DATABASE_ID, APPWRITE_TRANSACTIONS_COLLECTION_ID } = process.env;

interface MonoTransaction {
    id: string;
    narration: string;
    amount: number;
    type: 'debit' | 'credit';
    category: string | null;
    balance: number | null;
    date: string;
    currency: string;
}

interface MonoTransactionsResponse {
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

interface MonoApiResponse<T> {
    data: T;
    hasNewData: boolean;
}

export const getMonoTransactions = async (accountId: string, page: number = 1, realTime: boolean = false): Promise<MonoApiResponse<MonoTransactionsResponse>> => {
    try {
        const response = await axios.get<MonoTransactionsResponse>(`${MONO_API_BASE_URL}/accounts/${accountId}/transactions`, {
            headers: {
                'Content-Type': 'application/json',
                'mono-sec-key': getMonoSecretKey(),
                'x-realtime': realTime ? 'true' : 'false',
            },
            params: { page },
        });

        if (response.data.status !== 'successful') {
            throw new Error(`Failed to fetch transactions: ${response.data.message}`);
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

export const saveTransaction = async (transaction: MonoTransaction, userId: string, accountId: string) => {
    try {
        const { database } = await createAdminClient();
        const savedTransaction = await database.createDocument(
            APPWRITE_DATABASE_ID!,
            APPWRITE_TRANSACTIONS_COLLECTION_ID!,
            ID.unique(),
            {
                monoId: transaction.id,
                narration: transaction.narration,
                amount: transaction.amount,
                type: transaction.type,
                category: transaction.category,
                balance: transaction.balance,
                date: transaction.date,
                currency: transaction.currency,
                userId: userId,
                accountId: accountId,
            }
        );
        console.log('Saved transaction:', savedTransaction.$id);
        return savedTransaction;
    } catch (error) {
        console.error('Error saving transaction:', error);
        throw new Error('Failed to save transaction');
    }
};

export const saveMultipleTransactions = async (transactions: MonoTransaction[], userId: string, accountId: string) => {
    try {
        await Promise.all(transactions.map(transaction => saveTransaction(transaction, userId, accountId)));
        console.log(`Saved ${transactions.length} transactions`);
    } catch (error) {
        console.error('Error saving multiple transactions:', error);
        throw new Error('Failed to save multiple transactions');
    }
};

export const fetchAndSaveAllTransactions = async (accountId: string, userId: string, realTime: boolean = false) => {
    let page = 1;
    let hasNextPage = true;
    let totalSaved = 0;
    let hasNewData = false;

    try {
        while (hasNextPage) {
            console.log(`Fetching page ${page} of transactions...`);
            const response = await getMonoTransactions(accountId, page, realTime);
            const transactions = response.data;
            
            await saveMultipleTransactions(transactions.data, userId, accountId);
            totalSaved += transactions.data.length;
            
            console.log(`Saved ${transactions.data.length} transactions from page ${page}`);
            
            hasNextPage = !!transactions.meta.next;
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

export const syncAccountTransactions = async (accountId: string, userId: string, realTime: boolean = false) => {
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
        return { success: false, message: 'Failed to sync account transactions' };
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