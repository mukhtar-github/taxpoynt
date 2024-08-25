'use client'

import { logoutAccount } from '@/lib/actions/user.actions'
import { useRouter } from 'next/navigation'
import React from 'react'
import Image from 'next/image';

interface FooterProps {
  user: any;
  type: 'desktop' | 'mobile';
}

const Footer: React.FC<FooterProps> = ({ user }) => {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAccount();
    router.push('/sign-in'); // Redirect to login page after logout
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <footer className="sidebar-footer flex justify-between items-center p-4">
      <div className="user-info flex items-center">
        <div 
          className="user-avatar w-10 h-10 rounded-full flex items-center justify-center text-white mr-4"
          style={{ backgroundColor: getRandomColor() }}
        >
          {user?.name ? getInitials(user.name) : 'U'}
        </div>
        <div>
          <p className="user-name">{user?.name || 'User'}</p>
          <p className="user-email">{user?.email || 'No email'}</p>
        </div>
      </div>
      <button onClick={handleLogout} className="logout-button">
        <Image src="/icons/logout.svg" alt="Logout" width={24} height={24} />
      </button>
    </footer>
  );
}

export default Footer