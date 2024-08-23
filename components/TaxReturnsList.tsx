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
  return (
    <div>
        <h2 className='text-xl font-semibold mb-4'>Recent Tax Returns</h2>
        {taxReturns.length > 0 ? (
            taxReturns.map((taxReturn) => (
              <TaxReturnCard 
                key={taxReturn.$id} 
                taxReturn={{
                  $id: taxReturn.$id,
                  taxReturnId: taxReturn.taxReturnId || '',
                  taxPeriod: taxReturn.taxPeriod || '',
                  documentUrl: taxReturn.documentUrl || '',
                  status: taxReturn.status || '',
                  currentBalance: taxReturn.currentBalance || 0,
                  type: taxReturn.type || '',
                  year: taxReturn.year || '',
                  dueDate: taxReturn.dueDate || ''
                }}
              />
            ))
        ) : (
        <p>No recent tax returns found.</p>
        )}
    </div>
  )
}

export default TaxReturnsList
