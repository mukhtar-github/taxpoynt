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
import { AccountLinkWrapper } from "./AccountLinkWrapper"
import { useState } from 'react';

const MobileNav = ({ initialUser }: { initialUser: any }) => {
    const [user, setUser] = useState(initialUser);
    const pathname = usePathname();
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
                <SheetContent side='left' className="border-none bg-white">
                    <Link href='/' className='cursor-pointer items-center flex gap-1 px-4'>
                        <Image 
                            alt='Taxpoynt Logo' 
                            src='/icons/logo-fav.svg' 
                            width={34}
                            height={34}
                        />
                        <h1 className='text-26 font-ibm-plex-serif font-bold text-black-1'>Taxpoynt</h1>
                    </Link>

                    <div className="mobilenav-sheet component">
                        <SheetClose asChild>
                            <nav className="flex h-full flex-col gap-6 pt-16 text-white">
                                {sidebarLinks.map((item) => {
                                    const isActive = pathname === item.route || pathname?.startsWith(`${item.route}/`);
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
                                    )} 
                                )}

                                <AccountLinkWrapper user={user} />
                            </nav>
                        </SheetClose>
                        {/* <Footer user={user} type='mobile' /> */}
                        <Footer user={user} />
                    </div>
                </SheetContent>
            </Sheet>
        </section>
    )
}

export default MobileNav