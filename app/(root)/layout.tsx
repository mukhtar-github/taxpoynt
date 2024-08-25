'use client'

import Sidebar from "@/components/Sidebar";
import Image from "next/image";
import MobileNav from "@/components/MobileNav";

interface RootLayoutProps {
  children: React.ReactNode;
  initialUser: any;
}

export default function RootLayout({ children, initialUser }: RootLayoutProps) {
  return (
    <main className="flex h-screen w-full font-inter">
      <Sidebar initialUser={initialUser} />

      <div className="flex size-full flex-col">
        <div className="root-layout">
          <Image
            alt='logo' 
            src='/icons/logo-fav.svg' 
            width={30}
            height={30}
            className='size-[24px] max-xl:size-14'  
          />
          <div>
            <MobileNav initialUser={initialUser} />
          </div>
        </div>
        {children}
      </div>
    </main>
  );
}