import axios from 'axios';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import { getAllUsers } from '@/lib/actions/admin.actions';
import { 
    createTaxReminder,
    createTaxUpdate,
    createUserReminder,
    deleteTaxReminder,
    deleteTaxUpdate,
    deleteUserReminder,
    getTaxReminders,
    getTaxUpdates,
    getUserReminders
} from '@/lib/actions/tax.actions';

export async function fetchTaxUpdates() {
    const updates = await getTaxUpdates();
    return updates;
}

export async function fetchUserData() {
    const userData = await getLoggedInUser();
    return userData;
}



export async function fetchUsers(currentPage: number, usersPerPage: number, searchTerm: string, sortBy: string, sortOrder: 'asc' | 'desc') {
    const { users, total } = await getAllUsers(currentPage, usersPerPage, searchTerm, sortBy, sortOrder);
    return { users, total };
}

export async function linkAccount(authorizationCode: string) {
  const response = await axios.post('/api/link-account', { code: authorizationCode });
  return response.data;
}

export async function reauthorizeAccount(userId: string) {
  const response = await axios.post('/api/reauthorize', { userId });
  return response.data;
}

export async function fetchRecentTaxUpdates() {
    const updates = await getTaxUpdates();
    const recentUpdates = updates.filter(
        update => new Date(update.date) > new Date(Date.now() - 24 * 60 * 60 * 1000)
    );
    return recentUpdates;
}

export async function fetchTaxUpdatesAndReminders() {
    const updates = await getTaxUpdates();
    const reminders = await getTaxReminders();
    return { updates, reminders };
}

export async function createNewTaxUpdate(updateData: Partial<TaxUpdate>) {
    return await createTaxUpdate(updateData);
}

export async function createNewTaxReminder(reminderData: Partial<TaxReminder>) {
    return await createTaxReminder(reminderData);
}

export async function deleteTaxUpdateById(id: string) {
    return await deleteTaxUpdate(id);
}

export async function deleteTaxReminderById(id: string) {
    return await deleteTaxReminder(id);
}

export async function fetchUserReminders(userId: string) {
    return await getUserReminders(userId);
}

export async function createNewUserReminder(userId: string, reminderData: Partial<TaxReminder>) {
    return await createUserReminder(userId, reminderData);
}

export async function deleteUserReminderById(id: string) {
    return await deleteUserReminder(id);
}