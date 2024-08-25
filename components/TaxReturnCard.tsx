'use client'

import { formatAmount } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'

interface TaxReturnCardProps {
  taxReturn: {
    $id: string;
    taxReturnId: string;
    taxPeriod: string;
    documentUrl: string;
    status: string;
    currentBalance: number;
    type: string;
    year: string;
    dueDate: string;
  };
}

const TaxReturnCard = ({ taxReturn }: TaxReturnCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-500">{taxReturn.type} - {taxReturn.year}</span>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
          taxReturn.status === 'Paid' ? 'bg-green-100 text-green-800' :
          taxReturn.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {taxReturn.status}
        </span>
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-1">Tax Return #{taxReturn.taxReturnId}</h3>
      <p className="text-sm text-gray-600 mb-2">Period: {taxReturn.taxPeriod}</p>
      <div className="flex justify-between items-end">
        <div>
          <p className="text-xs text-gray-500">Current Balance</p>
          <p className="text-lg font-bold text-blue-600">{formatAmount(taxReturn.currentBalance)}</p>
        </div>
        <p className="text-xs text-gray-500">Due: {new Date(taxReturn.dueDate).toLocaleDateString()}</p>
      </div>
      <Link href={`/tax-return/${taxReturn.taxReturnId}`} className="mt-4 text-blue-500 hover:text-blue-700 text-sm font-medium">
        View Details
      </Link>
    </div>
  )
}

export default TaxReturnCard