import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import MobileNav from '@/components/MobileNav'

const Home = () => {
  return (
    <div className='flex flex-col min-h-screen'>
      <header className='page-header'>
        <div className='logo-container'>
          <Image 
            alt='Taxpoynt Logo' 
            src='/icons/logo-fav.svg' 
            width={40}
            height={40}
          />
          <h1 className='text-3xl font-bold'>Taxpoynt</h1>
        </div>
        <nav className='hidden md:flex'>
          <Link href='/sign-in'>
            <Button variant='outline' className='mr-2'>Sign In</Button>
          </Link>
          <Link href='/sign-up'>
            <Button>Sign Up</Button>
          </Link>
        </nav>
        <div className='md:hidden'>
          <MobileNav />
        </div>
      </header>

      <main className='flex-grow'>
        <section className='hero-section'>
          <h2 className='hero-title'>Simplify Your Tax Management</h2>
          <p className='hero-subtitle'>Effortlessly manage your taxes with Taxpoynt's intuitive tools and expert guidance.</p>
          <Link href='/sign-up'>
            <Button size='lg'>Get Started</Button>
          </Link>
        </section>

        <section className='feature-section'>
          <FeatureCard 
            icon='/icons/tax-form.svg'
            title='Easy Tax Filing'
            description='Complete and submit your tax returns with our user-friendly interface.'
          />
          <FeatureCard 
            icon='/icons/tax-engine.svg'
            title='Real-time Calculations'
            description='Get instant updates on your tax liability as you input your information.'
          />
          <FeatureCard 
            icon='/icons/connect-bank.svg'
            title='Bank Integration'
            description='Securely connect your bank accounts for accurate financial data.'
          />
        </section>
      </main>

      <footer className='bg-gray-100 p-6 text-center'>
        <p>&copy; 2024 Taxpoynt. All rights reserved.</p>
      </footer>
    </div>
  )
}

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <div className='feature-card'>
    <Image src={icon} alt={title} width={48} height={48} className='feature-icon' />
    <h3 className='feature-title'>{title}</h3>
    <p className='feature-description'>{description}</p>
  </div>
)

export default Home