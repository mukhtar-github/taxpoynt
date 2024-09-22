import React from 'react'
import { getTaxReturns } from '@/lib/actions/taxReturn.actions'
import { getLoggedInUser } from '@/lib/actions/user.actions'
import TaxReturnsList from '@/components/TaxReturnsList'
import HeaderBox from '@/components/HeaderBox'  // Add this import

const TaxReturns = async () => {
  const loggedIn = await getLoggedInUser()
  const taxReturns = loggedIn ? await getTaxReturns(loggedIn.id) : []

  return (
    <div className="p-6">
      <HeaderBox 
        type="title"
        title="My Tax Returns"
        subtext="View and manage your tax return history"
      />
      <div className="mt-6">
        <TaxReturnsList taxReturns={taxReturns} />
      </div>
    </div>
  )
}

export default TaxReturns