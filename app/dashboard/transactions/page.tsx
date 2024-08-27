import React from 'react'
import { getMonoTransactions } from '@/lib/actions/transaction.actions'
import { getLoggedInUser } from '@/lib/actions/user.actions'
import TransactionList from '@/components/TransactionList'

const Transactions = async () => {
  const loggedIn = await getLoggedInUser()
  const transactionResponse = loggedIn ? await getMonoTransactions(loggedIn.id) : { data: [] }
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Transactions</h1>
      <TransactionList transactions={Array.isArray(transactionResponse.data) ? transactionResponse.data : []} />
    </div>
  )
}

export default Transactions