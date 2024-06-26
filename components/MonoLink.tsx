import monoConnect from '@/lib/mono';
import React, { useCallback } from 'react';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

const MonoLink = ({ user }: MonoLinkProps) => {
  const router = useRouter()

  const handleMonoSuccess = useCallback((response: any) => {
    if (!response.code) {
      console.error('Unexpected response structure:', response);
      return;
    }
  
    console.log('Mono connected successfully:', response.code);
    // Proceed with handling the correctly structured response
    console.log('Mono connected successfully:', response.code);
    
    router.push('/dashboard') // Navigate to /dashboard
  }, [user]);
  
  const handleMonoClose = useCallback(() => {
    console.log('Mono widget closed');
    // Optionally handle widget close, such as re-enabling buttons or updating state
  }, []);

  const openMonoWidget = useCallback(() => {
    const mono = monoConnect(handleMonoSuccess, handleMonoClose);
    mono.open();
  }, [handleMonoSuccess, handleMonoClose]);

  return (
    <>
      <Button
        className='plaidlink-primary'
        onClick={openMonoWidget}
      >
        Connect Bank Account
      </Button>
    </>
  );
};

export default MonoLink;


// const handleMonoSuccess = useCallback((response: MonoSuccessResponse) => {
  //   console.log('Mono connected successfully:', response);
  //   // Handle successful connection, such as storing returned data or updating UI
  // }, []);