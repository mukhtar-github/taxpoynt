import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import TaxReturnCard from './TaxReturnCard'

const RightSidebar = ({ user, transactions, taxReturns }: RightSidebarProps) => {
  return (
    <aside className='right-sidebar'>
        <section className='flex flex-col pb-8'>
            <div className='profile-banner'/>
            <div className='profile'>
                <div className='profile-img'>
                    <span className='text-5xl font-bold text-blue-500'>
                        {user.firstName[0]}
                    </span>
                </div>
                
                <div className='profile-details'>
                    <h1 className='profile-name'>{user.firstName} {user.lastName}</h1>
                    <p className='profile-email'>{user.email}</p>
                </div>
            </div>
        </section>

        <section className='banks'>
            <div className='flex w-full justify-between'>
                <h2 className='header-2'>My Tax Returns</h2>
                <Link href='/' className='flex gap-2'>
                    <Image
                        src='/icons/plus.svg'
                        width={20}
                        height={20}
                        alt='plus'
                    />
                    <h2 className='text-14 font-semibold text-grey-600'>
                        Add Tax
                    </h2>
                </Link>
            </div>

            {taxReturns?.length > 0 && (
                <div className="relative flex flex-1 flex-col items-center justify-center gap-5">
                    <div className='relative z-10'>
                    <TaxReturnCard
                        key={taxReturns[0].$id}
                        taxType={taxReturns[0]}
                        userName={`${user.firstName} ${user.lastName}`}
                        showBalance={false}
                    />
                    </div>
                    {taxReturns[1] && (
                        <div className='absolute right-0 top-8 z-0 w-[90%]'>
                            <TaxReturnCard
                                key={taxReturns[1].$id}
                                taxType={taxReturns[1]}
                                userName={`${user.firstName} ${user.lastName}`}
                                showBalance={false}
                            />
                        </div>
                    )}
                </div>
            )}

        </section>
    </aside>
  )
}

export default RightSidebar