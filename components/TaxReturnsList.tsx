'use client'

import { parseStringify } from '@/lib/utils';
import TaxReturnCard from './TaxReturnCard'

interface TaxReturn {
  $id: string;
  taxReturnId: string;
  taxPeriod: string;
  documentUrl: string;
  status: string;
  currentBalance: number;
  type: string;
  year: string;
  dueDate: string;
}

interface TaxReturnsListProps {
  taxReturns: TaxReturn[];
}

const TaxReturnsList = ({ taxReturns }: TaxReturnsListProps) => {
  const serializedTaxReturns = parseStringify(taxReturns);
  
  return (
    <div className="recent-tax-returns">
      <h2 className='recent-tax-returns-header'>Recent Tax Returns</h2>
      <div className="tax-return-list">
        {serializedTaxReturns.length > 0 ? (
          serializedTaxReturns.map((taxReturn: { $id: any; taxReturnId?: string; taxPeriod?: string; documentUrl?: string; status?: string; currentBalance?: number; type?: string; year?: string; dueDate?: string; }) => (
            <TaxReturnCard 
              key={taxReturn.$id} 
              taxReturn={taxReturn as TaxReturn}
            />
          ))
        ) : (
          <p>No recent tax returns found.</p>
        )}
      </div>
    </div>
  )
}

export default TaxReturnsList