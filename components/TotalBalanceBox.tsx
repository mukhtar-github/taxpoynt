import AnimatedCounter from './AnimatedCounter'
import DoughnutChart from './DoughnutChart'

const TotalBalanceBox = ({ agencies = [],totalFilings, totalTaxLiability
}: TotalBalanceBoxProps) => {
  return (
    <section className='total-balance'>
        <div className='total-balace-chart'>
           <DoughnutChart agencies={agencies} />
        </div>

        <div className='flex flex-col gap-6'>
            <h2 className='header-2'>
                Tax Returns: {totalFilings}
            </h2>
            <div className='flex flex-col gap-2'>
                <p className='total-balance-label'>
                    Total Tax Liability
                </p>

                <div className='total-balance-amount flex-center gap-2'>
                    <AnimatedCounter amount={totalTaxLiability} />
                </div>
            </div>
        </div>
    </section>
  )
}

export default TotalBalanceBox