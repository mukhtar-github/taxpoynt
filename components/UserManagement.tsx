"use client"

import React, { useState, useEffect } from 'react';
import { getAllUsers, updateUserAdminStatus } from '@/lib/actions/admin.actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import { Models } from 'node-appwrite';

const USERS_PER_PAGE = 10;

// Define the User type
type User = Models.Document;

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const { users: fetchedUsers, total } = await getAllUsers(currentPage, USERS_PER_PAGE, searchTerm);
      setUsers(fetchedUsers);
      setTotalPages(Math.ceil(total / USERS_PER_PAGE));
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleAdmin = async (userId: string, currentStatus: boolean) => {
    try {
      await updateUserAdminStatus(userId, !currentStatus);
      toast.success(`User admin status updated successfully`);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user admin status:', error);
      toast.error('Failed to update user admin status');
    }
  };

  return (
    <div className="space-y-4">
      <Toaster />
      <Input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {isLoading ? (
        <div className="flex justify-center">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <>
          {users.map((user: any) => (
            <div key={user.$id} className="flex items-center justify-between p-4 border rounded">
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <Button
                onClick={() => handleToggleAdmin(user.$id, user.isAdmin)}
                variant={user.isAdmin ? "destructive" : "default"}
              >
                {user.isAdmin ? "Remove Admin" : "Make Admin"}
              </Button>
            </div>
          ))}
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
        </>
      )}
    </div>
  );
};

export default UserManagement;