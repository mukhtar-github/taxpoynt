import React from 'react'
import TaxForm from 'components/TaxForm'
import HeaderBox from 'components/HeaderBox'  // Add this import
import { useUser } from 'hooks/useUser';
import { User } from 'types';

const TaxFormSubmission = async () => {
  const { user } = useUser();
  const loggedIn = user as unknown as User;
  return (
    <div className="p-6">
      <HeaderBox 
        user={loggedIn.id}
        type="title"
        title="Submit Tax Return"
        subtext="Complete your tax form submission"
      />
      <div className="mt-6">
        <TaxForm />
      </div>
    </div>
  )
}

export default TaxFormSubmission
