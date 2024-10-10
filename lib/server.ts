import axios from 'axios';
import { getLoggedInUser, getUserReminders } from '@/lib/actions/user.actions';
import { getAllUsers } from '@/lib/actions/admin.actions';
import { 
    createTaxUpdate,
    createTaxReminder,
    getTaxUpdates,
    getTaxReminders,
    deleteTaxUpdate,
    deleteTaxReminder,
    deleteUserReminder,
} from '@/lib/actions/tax.actions';
import { logger } from '@/lib/logger';
import { TaxUpdate, TaxReminder } from '@/types';

// Add this utility function
function safeSerialize<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export async function fetchTaxUpdates() {
    try {
        const updates = await getTaxUpdates();
        return updates;
    } catch (error) {
        logger.error('Error fetching tax updates', { error });
        throw new Error('Failed to fetch tax updates');
    }
}

export async function fetchUserData(userId: string) {
    try {
        const userData = await getLoggedInUser(userId);
        if (!userData) {
            throw new Error('User not found or not logged in');
        }
        return safeSerialize(userData);
    } catch (error) {
        logger.error('Error fetching user data', { error });

        try {
            const retryUserData = await getLoggedInUser(userId);
            if (!retryUserData) {
                throw new Error('User not found or not logged in on retry');
            }
            return safeSerialize(retryUserData);
        } catch (retryError) {
            logger.error('Retry failed for fetching user data', { retryError });
            return null;
        }
    }
}

export async function fetchUsers(currentPage: number, usersPerPage: number, searchTerm: string, sortBy: string, sortOrder: 'asc' | 'desc') {
    try {
        const { users, total } = await getAllUsers(currentPage, usersPerPage, searchTerm, sortBy, sortOrder);
        return safeSerialize({ users, total });
    } catch (error) {
        logger.error('Error fetching users', { error, currentPage, usersPerPage, searchTerm, sortBy, sortOrder });
        throw new Error('Failed to fetch users');
    }
}

export async function linkAccount(authorizationCode: string) {
    try {
        const response = await axios.post('/api/link-account', { code: authorizationCode });
        return response.data;
    } catch (error) {
        logger.error('Error linking account', { error, authorizationCode });
        throw new Error('Failed to link account');
    }
}

export async function reauthorizeAccount(userId: string) {
    try {
        const response = await axios.post('/api/reauthorize', { userId });
        return response.data;
    } catch (error) {
        logger.error('Error reauthorizing account', { error, userId });
        throw new Error('Failed to reauthorize account');
    }
}

export async function fetchRecentTaxUpdates() {
    try {
        const updates = await getTaxUpdates();
        const recentUpdates = updates.filter(
            update => new Date(update.date) > new Date(Date.now() - 24 * 60 * 60 * 1000)
        );
        return recentUpdates;
    } catch (error) {
        logger.error('Error fetching recent tax updates', { error });
        throw new Error('Failed to fetch recent tax updates');
    }
}

export async function fetchTaxUpdatesAndReminders() {
    try {
        const updates = await getTaxUpdates();
        const reminders = await getTaxReminders();
        return safeSerialize({ updates, reminders });
    } catch (error) {
        logger.error('Error fetching tax updates and reminders', { error });
        throw new Error('Failed to fetch tax updates and reminders');
    }
}

export async function createNewTaxUpdate(updateData: Partial<TaxUpdate>) {
    try {
        return await createTaxUpdate(updateData);
    } catch (error) {
        logger.error('Error creating new tax update', { error, updateData });
        throw new Error('Failed to create new tax update');
    }
}

export async function createNewTaxReminder(reminderData: Partial<TaxReminder>) {
    try {
        return await createTaxReminder(reminderData);
    } catch (error) {
        logger.error('Error creating new tax reminder', { error, reminderData });
        throw new Error('Failed to create new tax reminder');
    }
}

export async function deleteTaxUpdateById(id: string) {
    try {
        return await deleteTaxUpdate(id);
    } catch (error) {
        logger.error('Error deleting tax update', { error, id });
        throw new Error('Failed to delete tax update');
    }
}

export async function deleteTaxReminderById(id: string) {
    try {
        return await deleteTaxReminder(id);
    } catch (error) {
        logger.error('Error deleting tax reminder', { error, id });
        throw new Error('Failed to delete tax reminder');
    }
}

export async function fetchUserReminders(userId: string) {
    try {
        return await getUserReminders(userId);
    } catch (error) {
        logger.error('Error fetching user reminders', { error, userId });
        throw new Error('Failed to fetch user reminders');
    }
}

export async function createNewUserReminder(userId: string, reminderData: Omit<UserReminder, "$id">) {
    try {
        // Rename 'reminderData' to 'reminderDate'
        return await createUserReminder({ 
            userId, 
            reminderDate: reminderData.reminderDate, 
            reminderType: reminderData.reminderType, 
            reminderStatus: reminderData.reminderStatus, 
            reminderFrequency: reminderData.reminderFrequency, 
            reminderMessage: reminderData.reminderMessage 
        });
    } catch (error) {
        logger.error('Error creating new user reminder', { error, reminderData });
        throw new Error('Failed to create new user reminder');
    }
}

export async function deleteUserReminderById(id: string) {
    try {
        return await deleteUserReminder(id);
    } catch (error) {
        logger.error('Error deleting user reminder', { error, id });
        throw new Error('Failed to delete user reminder');
    }
}