"use client";

import React from 'react';
import { DashboardLayoutProps } from 'types';
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import Image from "next/image";
import { useUser } from 'hooks/useUser';
//import { UserProvider } from '@/context/UserContext'; // Ensure correct path
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import Notifications from '@/components/Notifications';

export const dynamic = 'force-dynamic';

import { Inter, IBM_Plex_Serif } from "next/font/google";
import { UserProvider } from 'context/UserContext';

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: '--font-ibm-plex-serif'
});

export const metadata = {
  title: "Taxpoynt",
  description: "Taxpoynt strives to streamline and automate tax filing for small businesses.",
  icons: {
    icon: '/icons/logo-fav.svg'
  }
};

export default function RootLayout({ children }: DashboardLayoutProps){
  return (
    <html lang="en">
      <body className={`${inter.variable} ${ibmPlexSerif.variable}`}>
        <UserProvider>
          <Toaster position="top-right" />
          <Notifications />
          {children}
        </UserProvider>
      </body>
    </html>
  )
}