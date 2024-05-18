import { formatAmount } from '@/lib/utils'

const TotalBalanceBox = ({ agencies = [],totalFilings, totalTaxLiability
}: TotlaBalanceBoxProps) => {
  return (
    <section className='total-balance'>
        <div className='total-balace-chart'>
            {/* Doughnut chart */}
        </div>

        <div className='flex flex-col gap-6'>
            <h2 className='header-2'>
                Tax Filings: {totalFilings}
            </h2>
            <div className='flex flex-col gap-2'>
                <p className='total-balance-label'>
                    Total Tax Liability
                </p>

                <p className='total-balance-amount flex-center gap-2'>
                    {formatAmount(totalTaxLiability)}
                </p>
            </div>
        </div>
    </section>
  )
}

export default TotalBalanceBox