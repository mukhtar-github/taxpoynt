import { getTaxReturns } from '@/lib/actions/taxReturn.actions'
import { getLoggedInUser } from '@/lib/actions/user.actions'
import { Loader2 } from 'lucide-react'
import { Suspense } from 'react'
import HeaderBox from '@/components/HeaderBox'
import TotalBalanceBox from '@/components/TotalBalanceBox'
import TaxReturnsList from '@/components/TaxReturnsList'
import RightSidebar from '@/components/RightSidebar'
import { parseStringify } from '@/lib/utils'
import TaxDashboard from '@/components/TaxDashboard'

const Dashboard = async () => {
    const loggedIn = await getLoggedInUser();
    const taxReturns = loggedIn ? await getTaxReturns(loggedIn.id) : [];
  
    return (
        <div className='dashboard-container'>
          <main className='dashboard-main'>
            <HeaderBox
              title={`Welcome ${loggedIn?.name || 'User'}`}
              subtext='Access and effectively manage your tax returns for better financial outcomes.'
            />
    
            <div className='dashboard-grid'>
              <TotalBalanceBox />
              <Suspense fallback={<div className='flex justify-center items-center h-full'><Loader2 className='animate-spin' /></div>}>
                <TaxReturnsList taxReturns={parseStringify(taxReturns)} />
              </Suspense>
            </div>
    
            <div className="dashboard-wrapper" style={{ padding: '20px' }}>
              <TaxDashboard />
            </div>
          </main>
    
          <aside className='dashboard-sidebar'>
            <RightSidebar user={parseStringify(loggedIn)} taxReturns={parseStringify(taxReturns)} />
          </aside>
        </div>
      )
}

export default Dashboard