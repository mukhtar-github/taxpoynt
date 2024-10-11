'use client'

import React from 'react';
import { TaxReturn } from 'types';

interface TaxReturnsListProps {
  taxReturns: TaxReturn[];
}

const TaxReturnsList: React.FC<TaxReturnsListProps> = ({ taxReturns }) => {
  return (
    <div>
      {taxReturns.map((taxReturn) => (
        <div key={taxReturn.$id}>
          {/* Render tax return details here */}
          <p>Tax Period: {taxReturn.taxPeriod}</p>
          <p>Status: {taxReturn.status}</p>
          {/* Add more fields as needed */}
        </div>
      ))}
    </div>
  );
};

export default TaxReturnsList;