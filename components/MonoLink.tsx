import monoConnect from '@/lib/mono';
import React, { useCallback } from 'react';

const MonoLink = ({ user }: MonoLinkProps) => {
  // const handleMonoSuccess = useCallback((response: MonoSuccessResponse) => {
  //   console.log('Mono connected successfully:', response);
  //   // Handle successful connection, such as storing returned data or updating UI
  // }, []);

  const handleMonoSuccess = useCallback((response: any) => {
    if (!response.code) {
      console.error('Unexpected response structure:', response);
      return;
    }
  
    console.log('Mono connected successfully:', response.code);
    // Proceed with handling the correctly structured response
  }, []);
  

  const handleMonoClose = useCallback(() => {
    console.log('Mono widget closed');
    // Optionally handle widget close, such as re-enabling buttons or updating state
  }, []);

  const openMonoWidget = useCallback(() => {
    const mono = monoConnect(handleMonoSuccess, handleMonoClose);
    mono.open();
  }, [handleMonoSuccess, handleMonoClose]);

  return (
    <div>
      <button onClick={openMonoWidget}>Link Bank Account with Mono</button>
    </div>
  );
};

export default MonoLink;
