import React from 'react'

const Footer = ({ user, type = 'desktop' }: FooterProps) => {
  return (
    <footer className='footer'>
        <div className={type === 'mobile' ? 'footer_name-moble' : 'footer_name'}>
            <p className='text-xl font-bold text-grey-700'>
                {user.firstName[0]}
            </p>
        </div>
    </footer>
  )
}

export default Footer