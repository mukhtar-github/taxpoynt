"use client"

import { sidebarLinks } from '@/constants'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Footer from './Footer'

const Sidebar = ({ user }: SiderbarProps) => {

    const pathname = usePathname();

  return (
    <section className='sidebar'>
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

            USER
        </nav>

        <Footer user={user} type='desktop' />
    </section>
  )
}

export default Sidebar