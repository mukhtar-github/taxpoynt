import Sidebar from "@/components/Sidebar";
import Image from "next/image";
import MobileNav from "@/components/MobileNav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const loggedIn = {
    firstName: 'Mukhtar',
    lastName: 'Garba'
  }

  return (
    <main className="flex h-screen w-full font-inter">
        <Sidebar user={loggedIn}/>

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
              <MobileNav user={loggedIn}/>
            </div>
          </div>
          {children}
        </div>
    </main>
  );
}
