import { logoutAccount } from '@/lib/actions/user.actions'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import React from 'react'


const Footer = ({ user, type='desktop' }: FooterProps) => {

    const router = useRouter()

    const handleLogOut = async () => {
        const loggedOut = await logoutAccount()

        if(loggedOut) {
            router.push('/sign-in')
        }
    }

  return (
    <footer className='footer'>
    <div className='flex items-center gap-3'>
      <div className={type === 'mobile' ? 'footer_name-mobile' : 'footer_name'}>
        <p className='text-xl font-bold text-grey-700'>
          {user && user.name[0]}
        </p>
      </div>
      <div className={type === 'mobile' ? 'footer_email-mobile' : 'footer_email'}>
        <h1 className='text-14 truncate text-grey-700 font-semibold'>
          {user && user.name}
        </h1>
        <p className='text-14 truncate font-normal text-grey-600'>
          {user && user.email}
        </p>
      </div>
    </div>
    <Button className='footer_image' onClick={handleLogOut}>
      <Image
        src='/icons/logout.svg'
        width={20}
        height={20}
        alt='logout'
      />
    </Button>
  </footer>
  )
}

export default Footer