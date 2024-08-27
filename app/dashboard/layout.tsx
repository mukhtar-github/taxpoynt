import { getLoggedInUser } from '@/lib/actions/user.actions'
import Sidebar from "@/components/Sidebar";
import Image from "next/image";
import MobileNav from "@/components/MobileNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getLoggedInUser()
  return (
    <div className="flex h-screen w-full font-inter">
      <Sidebar initialUser={user} />
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
            <MobileNav initialUser={user} />
          </div>
        </div>
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
