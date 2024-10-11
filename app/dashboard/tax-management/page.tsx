import React from 'react';
import AdminTaxManagement from 'components/AdminTaxManagement';
import { redirect } from 'next/navigation';
import UserManagement from 'components/UserManagement';
import HeaderBox from 'components/HeaderBox';  // Add this import
import { useUser } from 'hooks/useUser';
import { User } from 'types';

const AdminTaxManagementPage = async () => {
  const { user } = useUser();
  const loggedIn = user as unknown as User;
  
  if (!loggedIn || !loggedIn.isAdmin) {
    redirect('/');
  }

  return (
    <div className="container mx-auto p-4">
      <HeaderBox 
        user={loggedIn.id}
        type="title"
        title="Admin Dashboard"
        subtext="Manage taxes and users"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Tax Management</h2>
          <AdminTaxManagement />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">User Management</h2>
          <UserManagement />
        </div>
      </div>
    </div>
  );
};

export default AdminTaxManagementPage;