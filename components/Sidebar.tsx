"use client"

import { sidebarLinks } from '@/constants'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Footer from './Footer'
import { AccountLinkWrapper } from './AccountLinkWrapper'
import { Input } from './ui/input'

interface SidebarProps {
  initialUser: any;
}

const Sidebar = ({ initialUser }: SidebarProps) => {
    
    const pathname = usePathname();

    return (
        <section className='sidebar all-components'>
            <nav className='flex flex-col gap-4'>
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
                <div className="search-bar">
                    <Input placeholder="Search..." />
                </div>
                {sidebarLinks.map((item) => {
                    // Skip rendering admin-only links for non-admin users
                    if (item.adminOnly && initialUser?.isAdmin !== true) return null;

                    const isActive = pathname && (pathname === item.route || pathname.startsWith(`${item.route}/`));
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
                    )
                })}

                <AccountLinkWrapper user={initialUser} />
            </nav>
            <Footer user={initialUser} type='desktop' />
        </section>
    )
}

export default Sidebar