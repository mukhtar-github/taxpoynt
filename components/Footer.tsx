import React from 'react'

const Footer = ({ user, type = 'desktop' }: FooterProps) => {
  return (
    <footer className='footer'>
        <div className={type === 'mobile' ? 'footer_name-moble' : 'footer_name'}>
            <p className='text-xl font-bold text-grey-700'>
                {user.firstName[0]}
            </p>
        </div>

        <div className={type === 'mobile' ? 'footer_email-moble' : 'footer_email'}>
            <h1 className='text-14 truncate font-normal text-grey-600'>
                {user.name}
            </h1>
            <p className='footer_email'>
                {user.email}
            </p>
        </div>
    </footer>
  )
}

export default Footer