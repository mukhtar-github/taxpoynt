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
import { parseStringify } from '@/lib/utils'
import TaxDashboard from '@/components/TaxDashboard'; // Adjust the path as necessary
import { mockUser, mockTaxReturns } from '@/__mocks__/mockData'

const Home = async () => {
  //const loggedIn = await getLoggedInUser();
  //const taxReturns = loggedIn ? await getTaxReturns(loggedIn.id) : [];
  const loggedIn = mockUser;
  const taxReturns = mockTaxReturns;

  return (
    <div className='flex flex-col lg:flex-row gap-8 p-6'>
      <main className='flex-grow space-y-8'>
        <HeaderBox
          title={`Welcome ${loggedIn?.name || 'User'}`}
          subtext='Access and effectively manage your tax returns for better financial outcomes.'
        />

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <TotalBalanceBox />
          <Suspense fallback={<div className='flex justify-center items-center h-full'><Loader2 className='animate-spin' /></div>}>
            <TaxReturnsList taxReturns={parseStringify(taxReturns)} />
          </Suspense>
        </div>

        <div className="tax-dashboard-wrapper" style={{ padding: '20px' }}>
          <TaxDashboard />
        </div>
          {/* {loggedIn && (
            // <TaxUpdatesAndReminders userId={loggedIn.id} />
            <TaxUpdatesAndReminders />
          )} */}

        {/* <section>
          <h2 className='text-2xl font-semibold mb-4'>Tax Planner</h2>
          <TaxPlanner />
        </section> */}
      </main>

      <aside className='w-full lg:w-1/3 xl:w-1/4'>
        <RightSidebar user={parseStringify(loggedIn)} taxReturns={parseStringify(taxReturns)} />
      </aside>
    </div>
  )
}

export default Home