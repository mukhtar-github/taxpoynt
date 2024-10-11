'use client'

import React, { useState, useEffect } from 'react';
import { updateUserAdminStatus, bulkUpdateUserAdminStatus } from 'lib/actions/admin.actions';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { Loader2 } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import { Select } from 'components/ui/select';
import { Checkbox } from 'components/ui/checkbox';
import { fetchUsers } from 'lib/server';
import { useUser } from 'hooks/useUser';

const USERS_PER_PAGE = 10;

type User = {
  $id: string;
  email: string;
  accountId: string | null;
  firstName: string;
  lastName: string;
  businessName: string;
  address: string;
  state: string;
  businessRegDate: string;
  phone: string;
  identificationNo: string;
  requiresReauth: boolean;
  reauthUrl: string | null;
  name: string;
  subscribedCategories: string[];
  isAdmin: boolean;
} | null;

const UserManagement = () => {
  const { user: currentUser, isLoading: isUserLoading } = useUser(); // Use the useUser hook
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  useEffect(() => {
    if (!currentUser || !currentUser.isAdmin) return; // Ensure only admins can fetch users

    const fetchUsersData = async () => {
      setIsLoading(true);
      try {
        const { users: fetchedUsers, total } = await fetchUsers(currentPage, USERS_PER_PAGE, searchTerm, sortBy, sortOrder as 'asc' | 'desc');
        setUsers(fetchedUsers);
        setTotalPages(Math.ceil(total / USERS_PER_PAGE));
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to fetch users');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsersData();
  }, [currentPage, searchTerm, sortBy, sortOrder, currentUser]);

  const handleToggleAdmin = async (userId: string, currentStatus: boolean) => {
    try {
      await updateUserAdminStatus(userId, !currentStatus);
      toast.success(`User admin status updated successfully`);
      const { users: fetchedUsers } = await fetchUsers(currentPage, USERS_PER_PAGE, searchTerm, sortBy, sortOrder as 'asc' | 'desc');
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Error updating user admin status:', error);
      toast.error('Failed to update user admin status');
    }
  };

  const handleBulkAction = async (action: 'makeAdmin' | 'removeAdmin') => {
    try {
      await bulkUpdateUserAdminStatus(selectedUsers, action === 'makeAdmin');
      toast.success(`Bulk action completed successfully`);
      const { users: fetchedUsers } = await fetchUsers(currentPage, USERS_PER_PAGE, searchTerm, sortBy, sortOrder as 'asc' | 'desc');
      setUsers(fetchedUsers);
      setSelectedUsers([]);
    } catch (error) {
      console.error('Error performing bulk action:', error);
      toast.error('Failed to perform bulk action');
    }
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    setSelectedUsers(users.map(user => user?.$id).filter(Boolean) as string[]);
  };

  if (isUserLoading || isLoading) {
    return (
      <div className="flex justify-center mt-8">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!currentUser) {
    return <div className="text-center mt-8">You must be logged in to view this page.</div>;
  }

  if (!currentUser.isAdmin) {
    return <div className="text-center mt-8">You don't have permission to access this page.</div>;
  }

  return (
    <div className="space-y-4">
      <Toaster />
      <div className="flex space-x-2">
        <Input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <Select
          value={sortBy}
          onValueChange={(value) => setSortBy(value)}
        >
          <option value="createdAt">Created At</option>
          <option value="name">Name</option>
          <option value="email">Email</option>
        </Select>
        <Button onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}>
          {sortOrder === 'asc' ? '↑' : '↓'}
        </Button>
      </div>
      <div className="flex justify-between mb-2">
        <Button onClick={handleSelectAll}>Select All</Button>
        <div>
          <Button onClick={() => handleBulkAction('makeAdmin')} disabled={selectedUsers.length === 0}>
            Make Selected Admin
          </Button>
          <Button onClick={() => handleBulkAction('removeAdmin')} disabled={selectedUsers.length === 0}>
            Remove Selected Admin
          </Button>
        </div>
      </div>
      {users.length === 0 ? (
        <div className="text-center">No users found.</div>
      ) : (
        users.map((user: User) => (
          user && (
            <div key={user.$id} className="flex items-center justify-between p-4 border rounded">
              <div className="flex items-center">
                <Checkbox
                  checked={selectedUsers.includes(user.$id)}
                  onCheckedChange={() => handleSelectUser(user.$id)}
                />
                <div className="ml-4">
                  <p className="font-semibold">{user.firstName} {user.lastName}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <Button
                onClick={() => handleToggleAdmin(user.$id, user.isAdmin)}
                variant={user.isAdmin ? "destructive" : "default"}
              >
                {user.isAdmin ? "Remove Admin" : "Make Admin"}
              </Button>
            </div>
          )
        ))
      )}
      <div className="flex justify-between mt-4">
        <Button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span>Page {currentPage} of {totalPages}</span>
        <Button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default UserManagement;