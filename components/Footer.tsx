'use client'

import { useRouter } from 'next/navigation';
import React from 'react';
import Image from 'next/image';
import { useUser } from '../hooks/useUser';
import { logoutAccount } from 'lib/actions/user.actions';
import { NextApiRequest } from 'next';
import { User } from 'types';

interface FooterProps {
  user: User | null;
  type: 'mobile' | 'public';
}

const Footer: React.FC<FooterProps> = () => {
  const { user: userProp } = useUser();
  const router = useRouter();
  const handleLogout = async () => {
    if (userProp) {
      await logoutAccount({ query: { id: userProp.id } } as unknown as NextApiRequest);
    }
    router.push('/sign-in');
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

  const displayName = userProp?.firstName || 'User';
  const displayInitials = userProp?.firstName ? getInitials(userProp.firstName) : 'U';

  return (
    <footer className="sidebar-footer flex justify-between items-center p-4">
      <div className="user-info flex items-center">
        <div 
          className="user-avatar w-10 h-10 rounded-full flex items-center justify-center text-white mr-4"
          style={{ backgroundColor: getRandomColor() }}
        >
          {displayInitials}
        </div>
        <div>
          <p className="user-name">{displayName}</p>
          <p className="user-email">{userProp?.email || 'No email'}</p>
        </div>
      </div>
      <button onClick={handleLogout} className="logout-button">
        <Image src="/icons/logout.svg" alt="Logout" width={24} height={24} />
      </button>
    </footer>
  );
};

export default Footer;