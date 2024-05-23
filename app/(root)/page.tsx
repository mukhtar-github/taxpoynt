import HeaderBox from '@/components/HeaderBox'
import TotalBalanceBox from '@/components/TotalBalanceBox'

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
            agencies={[2]}
            totalFilings={1}
            totalTaxLiability={1250.35}
          />
        </header>
      </div>
    </section>
  )
}

export default Home