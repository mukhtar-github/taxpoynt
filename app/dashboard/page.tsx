import { getTaxReturns } from 'lib/actions/taxReturn.actions';
import { Loader2 } from 'lucide-react';
import { Suspense } from 'react';
import HeaderBox from 'components/HeaderBox';
import TotalBalanceBox from 'components/TotalBalanceBox';
import TaxReturnsList from 'components/TaxReturnsList';
import RightSidebar from 'components/RightSidebar';
import { parseStringify } from 'lib/utils';
import TaxDashboard from 'components/TaxDashboard';
import { useUser } from 'hooks/useUser';
import { User, TaxReturn } from 'types'; // Ensure correct import

const Dashboard = async () => { // Removed userId from props
    // Use the useUser hook
    const { user, setUser } = useUser();
  
    // Ensure userId is a string. If user?.id can be undefined, handle it appropriately.
    const actualUserId = user?.id || ''; // Default to empty string or handle as needed
    const taxReturns: TaxReturn[] = user ? await getTaxReturns(actualUserId) : [];
  
    return (
        <div className='dashboard-container'>
          <main className='dashboard-main'>
            <HeaderBox
              user={actualUserId}
              title={`Welcome ${user?.firstName || 'User'}`}
              subtext='Access and effectively manage your tax returns for better financial outcomes.'
            />
    
            <div className='dashboard-grid'>
              <TotalBalanceBox />
              <Suspense fallback={<div className='flex justify-center items-center h-full'><Loader2 className='animate-spin' /></div>}>
                <TaxReturnsList taxReturns={taxReturns} />
              </Suspense>
            </div>
    
            <div className="dashboard-wrapper" style={{ padding: '20px' }}>
              <TaxDashboard userId={actualUserId} /> {/* Ensure userId is a string */}
            </div>
          </main>
    
          <aside className='dashboard-sidebar'>
            <RightSidebar taxReturns={parseStringify(taxReturns)} />
          </aside>
        </div>
      )
}

export default Dashboard;