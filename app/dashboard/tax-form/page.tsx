import React from 'react'
import TaxForm from '@/components/TaxForm'
import HeaderBox from '@/components/HeaderBox'  // Add this import

const TaxFormSubmission = async () => {
  
  return (
    <div className="p-6">
      <HeaderBox 
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
