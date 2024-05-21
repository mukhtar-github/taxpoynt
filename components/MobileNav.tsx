'use client'

import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import Image from "next/image"
import Link from "next/link"
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { sidebarLinks } from '@/constants'
  
const MobileNav = ({ user }: MobileNavProps) => {
    const pathname = usePathname();
  return (
    <section className="w-full max-w-[264px]">
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
            <SheetContent side='left'>
                <Link href='/' className='mb-12 cursor-pointer items-center flex gap-2'>
                    <Image 
                        alt='Taxpoynt Logo' 
                        src='/icons/logo-fav.svg' 
                        width={34}
                        height={34}
                        className='size-[24px] max-xl:size-14'
                    />
                    <h1 className='sidebar-logo'>Taxpoynt</h1>
                </Link>

                {sidebarLinks.map((item) => {
                    const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`);
                    return (
                        <Link href={item.route} key={item.label} className={cn('sidebar-link', {'bg-bank-gradient': isActive})}>
                            <div className='relative size-6'>
                                <Image 
                                    alt={item.label} 
                                    src={item.imgURL} 
                                    fill
                                    className={cn({'brightness-[3] invert-0': isActive})}
                                />
                            </div>
                            <p className={cn('sidebar-label', {'!text-white': isActive})}>
                                {item.label}
                            </p>
                        </Link>
                    )} 
                )}
            </SheetContent>
        </Sheet>
    </section>
  )
}

export default MobileNav