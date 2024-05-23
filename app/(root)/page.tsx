import HeaderBox from '@/components/HeaderBox'
import TotalBalanceBox from '@/components/TotalBalanceBox'
import RightSidebar from '@/components/RightSidebar'

const loggedIn = {
  firstName: 'Mukhtar'
}

const Home = () => {
  return (
    <section className='home'>
      <div className='home-content'>
        <header className='home-header'>
          <HeaderBox
            type='greeting'
            title='Welcome'
            user= {loggedIn?.firstName || 'Guest'}
            subtext='Access and effectively manage your tax returns for better financial outcomes.'
          />

          <TotalBalanceBox
            taxTypes={[]}
            totalAgencies={1}
            totalTaxLiability={1250.35}
          />
        </header>

        RECENT TRANSACTIONS
      </div>

      <RightSidebar
          user={loggedIn}
          transactions={[]}
          taxReturns={[]} // instead of banks
      />
    </section>
  )
}

export default Home