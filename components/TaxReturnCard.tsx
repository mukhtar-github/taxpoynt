import { formatAmount } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'

const TaxReturnCard = ({ taxReturn, userName, showBalance = true }: CreditCardProps) => {
  return (
    <div className='flex flex-col'>
        <Link href='/' className='bank-card'>
            <div className='bank-card_content'>
                <div>
                   <h1 className='text-16 font-semibold text-white'>
                        {taxReturn.name || userName}
                        {/* {taxReturn.type} - {taxReturn.year} */}
                    </h1>
                    <p className='font-ibm-plex-serif font-black text-white'>
                    {formatAmount(taxReturn.currentBalance)}
                    {/* Due Date: {taxReturn.dueDate} */}
                    </p>               
                </div>
                <article className='flex flex-col gap-2'>
                  <div className='flex justify-between'>
                    <h1 className='text-12 text-semibold text-white'>
                      {userName}
                    </h1>
                    <h2 className='text-12 text-semibold text-white'>
                      **/**
                    </h2>
                  </div>
                  <p className='text-14 fond-semibold tracking-[1.1px] text-white'>
                    **** **** ****
                  </p>
                </article>
            </div>
        </Link>
    </div>
  )
}

export default TaxReturnCard