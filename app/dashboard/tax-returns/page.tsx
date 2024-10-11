import React from 'react'
import { getTaxReturns } from 'lib/actions/taxReturn.actions'
import TaxReturnsList from 'components/TaxReturnsList'
import HeaderBox from 'components/HeaderBox'  // Add this import
import { useUser } from 'hooks/useUser';
import { User } from 'types';
import { transformDocumentToTaxReturn } from 'lib/utils/transform'; // Ensure correct import

const Taxreturns = async () => {
  const { user } = useUser();
  const loggedIn = user as unknown as User;
  const taxReturns = loggedIn ? await getTaxReturns(loggedIn.id) : []

  return (
    <div className="p-6">
      <HeaderBox 
        user={loggedIn.id}
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

export default Taxreturns