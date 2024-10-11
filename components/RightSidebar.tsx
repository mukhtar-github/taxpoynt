'use client'

import Link from 'next/link'
import React from 'react'
import TaxReturnCard from './TaxReturnCard'
import { useUser } from 'hooks/useUser'
import { TaxReturn } from 'types'

// Move useUser inside the component
const RightSidebar = ({ taxReturns }: { taxReturns: TaxReturn[] }) => {
  const { user } = useUser()

  const serializedTaxReturns = taxReturns.map((taxReturn) => ({
    $id: taxReturn.$id,
    taxPeriod: taxReturn.taxPeriod,
    documentUrl: taxReturn.documentUrl,
    status: taxReturn.status,
    currentBalance: taxReturn.currentBalance,
    dueDate: taxReturn.dueDate,
    userId: taxReturn.userId,           // Added
    taxTypeId: taxReturn.taxTypeId,     // Added
    taxYear: taxReturn.taxYear,         // Added
    filingDate: taxReturn.filingDate,   // Added
  }))

  return (
    <aside className='right-sidebar bg-gray-50 p-6 rounded-lg shadow-md all-components'>
      <section className='flex flex-col pb-8'>
        <div className='profile-banner bg-gradient-to-r from-blue-500 to-purple-500 h-24 rounded-t-lg'/>
        <div className='profile -mt-12 flex items-center space-x-4'>
          <div className='profile-img bg-white rounded-full p-2 shadow-lg'>
            <span className='text-4xl font-bold text-blue-500 bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center'>
              {user?.firstName ? user.firstName[0] : 'U'}
            </span>
          </div>
          <div className='profile-details'>
            <h1 className='profile-name text-2xl font-bold text-gray-800'>
              {user?.firstName || ''} {user?.lastName || ''}
            </h1>
            <p className='profile-email text-sm text-gray-600'>{user?.email || ''}</p>
          </div>
        </div>
      </section>

      <section className='banks mt-8'>
        <h2 className='text-xl font-semibold text-gray-700 mb-4'>Recent Tax Returns</h2>
        {serializedTaxReturns.length > 0 ? (
          <div className="flex flex-col gap-4">
            {serializedTaxReturns.slice(0, 2).map((taxReturn) => (
              <TaxReturnCard
                key={taxReturn.$id}
                taxReturn={taxReturn}
              />
            ))}
            <Link
              href="/tax-returns"
              className="text-blue-500 hover:underline text-sm font-medium"
            >
              View All Tax Returns
            </Link>
          </div>
        ) : (
          <p className="text-gray-600">No recent tax returns found.</p>
        )}
      </section>
    </aside>
  )
}

export default RightSidebar