import type { Metadata } from "next";
import { Inter, IBM_Plex_Serif } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import Notifications from "@/components/Notifications";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: '--font-ibm-plex-serif'
});

export const metadata: Metadata = {
  title: "Taxpoynt",
  description: "Taxpoynt strives to streamline and automate tax filing for small businesses.",
  icons: {
    icon: '/icons/logo-fav.svg'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${ibmPlexSerif.variable}`}>
        <Toaster position="top-right" />
        <Notifications />
        {children}
      </body>
    </html>
  );
}