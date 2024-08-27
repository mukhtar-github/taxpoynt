import React from 'react';
import AdminTaxManagement from '@/components/AdminTaxManagement';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';
import UserManagement from '@/components/UserManagement';

const AdminTaxManagementPage = async () => {
  const user = await getLoggedInUser();
  
  if (!user || !user.isAdmin) {
    redirect('/');
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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