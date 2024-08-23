import React from 'react'
import { getTaxReturns } from '@/lib/actions/taxReturn.actions'
import { getLoggedInUser } from '@/lib/actions/user.actions'
import TaxReturnsList from '@/components/TaxReturnsList'

const TaxReturns = async () => {
  const loggedIn = await getLoggedInUser()
  const taxReturns = loggedIn ? await getTaxReturns(loggedIn.id) : []

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Tax Returns</h1>
      <TaxReturnsList taxReturns={taxReturns as unknown as TaxReturn[]} />
    </div>
  )
}

export default TaxReturns