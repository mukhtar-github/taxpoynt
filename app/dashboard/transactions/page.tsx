import React from 'react'
import { getMonoTransactions } from 'lib/actions/transaction.actions'
import TransactionList from 'components/TransactionList'
import HeaderBox from 'components/HeaderBox'  // Add this import
import { useUser } from 'hooks/useUser';
import { User } from 'types';

const Transactions = async () => {
  const { user } = useUser();
  const loggedIn = user as unknown as User;
  const transactionResponse = loggedIn ? await getMonoTransactions(loggedIn.id) : { data: [] }
  
  return (
    <div className="p-6">
      <HeaderBox 
        user={loggedIn.id}
        type="title"
        title="My Transactions"
        subtext="View and manage your transaction history"
      />
      <div className="mt-6">
        <TransactionList transactions={Array.isArray(transactionResponse.data) ? transactionResponse.data.map(transaction => ({
          ...transaction,
          description: transaction.narration || ''  // Use narration as description or empty string if not available
        })) : []} />
      </div>
    </div>
  )
}

export default Transactions