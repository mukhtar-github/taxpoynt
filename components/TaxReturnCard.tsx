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
                    {formatAmount(taxReturn.amount)}
                    {/* Due Date: {taxReturn.dueDate} */}
                    </p>               
                </div>
            </div>
        </Link>
    </div>
  )
}

export default TaxReturnCard