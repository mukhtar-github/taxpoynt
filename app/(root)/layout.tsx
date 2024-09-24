import React from 'react';
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import Image from "next/image";
import { useUser } from 'hooks/useUser';
import { DashboardLayoutProps } from 'types';

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const { user } = useUser(); // Use the hook to get the user

  return (
    <div className="flex h-screen w-full font-inter">
      {user && <Sidebar />}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="root-layout">
          <Image
            alt='logo' 
            src='/icons/logo-fav.svg' 
            width={30}
            height={30}
            className='size-[24px] max-xl:size-14'  
          />
          <div>
            {user && <MobileNav />}
          </div>
        </div>
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
