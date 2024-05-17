import HeaderBox from '@/components/HeaderBox'

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
            subtext='Access and effectively manage your tax filings for better financial outcomes.'
          />
        </header>
      </div>
    </section>
  )
}

export default Home