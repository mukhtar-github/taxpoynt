import React from 'react'
import { getMonoTransactions } from '@/lib/actions/transaction.actions'
import { getLoggedInUser } from '@/lib/actions/user.actions'
import TransactionList from '@/components/TransactionList'
import HeaderBox from '@/components/HeaderBox'  // Add this import

const Transactions = async () => {
  const loggedIn = await getLoggedInUser()
  const transactionResponse = loggedIn ? await getMonoTransactions(loggedIn.id) : { data: [] }
  
  return (
    <div className="p-6">
      <HeaderBox 
        type="title"
        title="My Transactions"
        subtext="View and manage your transaction history"
      />
      <div className="mt-6">
        <TransactionList transactions={Array.isArray(transactionResponse.data) ? transactionResponse.data : []} />
      </div>
    </div>
  )
}

export default Transactions