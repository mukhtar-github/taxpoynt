'use client'

import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import Image from "next/image"
import Link from "next/link"
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { sidebarLinks } from '@/constants'
import Footer from "./Footer"
import LinkUser from "./LinkUser"
import { useUser } from 'hooks/useUser'

const MobileNav = () => {
    const { user, setUser } = useUser();
    const pathname = usePathname();

    const handleAccountLinked = (updatedUser: any) => {
        setUser(updatedUser);
    };

    return (
        <section className="w-full max-w-[264px] all-components">
            <Sheet>
                <SheetTrigger>
                    <Image
                        alt='menu'
                        src='/icons/hamburger.svg'
                        width={30}
                        height={30}
                        className='cursor-pointer'    
                    />
                </SheetTrigger>
                <SheetContent side='left' className="border-none bg-white flex flex-col">
                    <Link href='/' className='cursor-pointer items-center flex gap-1 px-4'>
                        <Image 
                            alt='Taxpoynt Logo' 
                            src='/icons/logo-fav.svg' 
                            width={34}
                            height={34}
                        />
                        <h1 className='text-26 font-ibm-plex-serif font-bold text-black-1'>Taxpoynt</h1>
                    </Link>

                    <div className="mobilenav-sheet component flex-grow">
                        <SheetClose asChild>
                            <nav className="flex h-full flex-col gap-6 pt-16 text-white">
                                {user ? (
                                    <>
                                        {sidebarLinks.map((item) => {
                                            // Skip rendering admin-only links for non-admin users
                                            if (item.adminOnly && user?.isAdmin !== true) return null;

                                            // Determine if the link is active
                                            let isActive = false;
                                            if (item.route === "/") {
                                                isActive = pathname === "/";
                                            } else {
                                                isActive = pathname
                                                    ? pathname === item.route || pathname.startsWith(`${item.route}/`)
                                                    : false;
                                            }

                                            return (
                                                <SheetClose asChild key={item.route}>
                                                    <Link href={item.route} className={cn('mobilenav-sheet_close w-full', {'bg-bank-gradient': isActive})}>
                                                        <Image 
                                                            alt={item.label} 
                                                            src={item.imgURL} 
                                                            width={20}
                                                            height={20}
                                                            className={cn({'brightness-[3] invert-0': isActive})}
                                                        />
                                                        <p className={cn('text-16 font-semibold text-black-2', {'text-white': isActive})}>
                                                            {item.label}
                                                        </p>
                                                    </Link>
                                                </SheetClose>
                                            ) 
                                        })}
                                        <SheetClose asChild>
                                            <LinkUser
                                                onAccountLinked={handleAccountLinked}
                                            />
                                        </SheetClose>
                                    </>
                                ) : (
                                    <>
                                        <SheetClose asChild>
                                            <Link href="/sign-in" className="mobilenav-sheet_close w-full bg-blue-500 text-white rounded-md py-2 px-4 text-center">
                                                <p className="text-16 font-semibold">Sign In</p>
                                            </Link>
                                        </SheetClose>
                                        <SheetClose asChild>
                                            <Link href="/sign-up" className="mobilenav-sheet_close w-full bg-green-500 text-white rounded-md py-2 px-4 text-center">
                                                <p className="text-16 font-semibold">Sign Up</p>
                                            </Link>
                                        </SheetClose>
                                    </>
                                )}
                            </nav>
                        </SheetClose>
                    </div>
                    <Footer user={user} type={user ? 'mobile' : 'public'} />
                </SheetContent>
            </Sheet>
        </section>
    )
}

export default MobileNav