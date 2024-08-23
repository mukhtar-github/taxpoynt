import { cache } from 'react'
import { getTaxReturns } from '@/lib/actions/taxReturn.actions'
import { getLoggedInUser } from '@/lib/actions/user.actions'
import { Loader2 } from 'lucide-react'
import { Suspense } from 'react'
import HeaderBox from '@/components/HeaderBox'
import TotalBalanceBox from '@/components/TotalBalanceBox'
import TaxReturnsList from '@/components/TaxReturnsList'
import TaxPlanner from '@/components/TaxPlanner'
import RightSidebar from '@/components/RightSidebar'
import TaxUpdatesAndReminders from '@/components/TaxUpdatesAndReminders'

const getCachedTaxReturns = cache(async (userId: string) => {
  return await getTaxReturns(userId)
})

const Home = async () => {
  const loggedIn = await getLoggedInUser()
  const taxReturns = loggedIn ? await getCachedTaxReturns(loggedIn.id) : []

  return (
    <div className='flex'>
      <section className='flex-grow flex flex-col gap-10 pr-4'>
        <HeaderBox
          title={`Welcome ${loggedIn?.name}`}
          subtext='Access and effectively manage your tax returns for better financial outcomes.'
        />

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <TotalBalanceBox />
          <Suspense fallback={<Loader2 className='animate-spin' />}>
            <TaxReturnsList taxReturns={taxReturns as unknown as TaxReturn[]} />
          </Suspense>
        </div>

        {loggedIn && (
          <TaxUpdatesAndReminders userId={loggedIn.id} />
        )}

        <div>
          <h2 className='text-xl font-semibold mb-4'>Tax Planner</h2>
          <TaxPlanner />
        </div>
      </section>

      <RightSidebar user={loggedIn} taxReturns={taxReturns as unknown as TaxReturn[]} />
    </div>
  )
}

export default Home