"use client"

import React from 'react'
import { sidebarLinks } from 'constants/index'
import { cn, sanitizeAccount, sanitizeDatabase, sanitizeUsers } from 'lib/utils'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Footer from './Footer'
import { Input } from './ui/input'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import LinkUser from './LinkUser'
import { useUser } from 'hooks/useUser'
import { User } from 'types'

interface SidebarProps {
    user: User | null;
}

function Sidebar({ user }: SidebarProps) {
    const router = useRouter()
    const pathname = usePathname()

    const handleAccountLinked = async () => {
        try {
            // Fetch user data from API endpoint
            const response = await fetch('/api/user', {
                method: 'GET',
                credentials: 'include', // Ensure cookies are included
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }

            const updatedUser = await response.json();

            // Refresh the current route to reflect changes across the app
            router.refresh();

            console.log('Account linked successfully');

            // Show a success notification
            toast.success('Account linked successfully');
        } catch (error) {
            console.error('Error linking account:', error);
            // Show an error notification
            toast.error('Failed to link account. Please try again.');
        }
    };

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
                <LinkUser
                    onAccountLinked={handleAccountLinked}
                />
            </nav>
            <Footer user={user} type='mobile' />
        </section>
    )
}

export default Sidebar