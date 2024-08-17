import HeaderBox from '@/components/HeaderBox'
import TotalBalanceBox from '@/components/TotalBalanceBox'
import RightSidebar from '@/components/RightSidebar'
import { getLoggedInUser } from '@/lib/actions/user.actions'

// Placeholder data for development use only
const placeholderTaxReturns = [
  { $id: '1', currentBalance: 123.50, type: 'Income Tax', year: '2023' },
  { $id: '2', currentBalance: 500.50, type: 'VAT', year: '2023' }
];

const Home = async () => {
  const loggedIn = await getLoggedInUser()

  return (
    <section className='home'>
      <div className='home-content'>
        <header className='home-header'>
          <HeaderBox
            type='greeting'
            title='Welcome'
            user={loggedIn?.name || 'Guest'}
            subtext='Access and effectively manage your tax returns for better financial outcomes.'
          />

          <TotalBalanceBox
            taxTypes={[]}
            totalReturns={1}
            totalTaxLiability={1250.35}
          />
        </header>

        RECENT TRANSACTIONS
      </div>

      <RightSidebar
        user={loggedIn}
        transactions={[]}
        taxReturns={placeholderTaxReturns} // Placeholder data for development
      />
    </section>
  )
}

export default Home