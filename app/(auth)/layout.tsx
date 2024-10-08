import Image from "next/image";
import React from 'react';

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <main className="flex min-h-screen w-full justify-between font-inter">
        {children}
        <div className="auth-asset">
          <div>
            <Image
              alt='Auth image' 
              src='/icons/auth.svg' 
              width={1000}
              height={2000}  
            />
          </div>
        </div>
      </main>
    );
  }
  