import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import monoConnect from '@/lib/mono';
import { Button } from './ui/button';

const MonoLink = ({ user }: MonoLinkProps) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleMonoSuccess = useCallback((response: MonoSuccessResponse) => {
    console.log('Mono connected successfully:', response.code);
    setLoading(false);
    router.push('/dashboard');
  }, [router]);

  const handleMonoClose = useCallback(() => {
    console.log('Mono widget closed');
    setLoading(false);
  }, []);

  const openMonoWidget = useCallback(async () => {
    if (!user) {
      console.error('User information is required to open Mono widget');
      return;
    }

    setLoading(true);
    try {
      await monoConnect(handleMonoSuccess, handleMonoClose);
      const mono = new (window as any).Connect({
        key: process.env.NEXT_PUBLIC_MONO_PUBLIC_KEY,
        onSuccess: handleMonoSuccess,
        onClose: handleMonoClose
      });
      mono.open();
    } catch (error) {
      console.error('Error initializing Mono widget:', error);
      setLoading(false);
    }
  }, [handleMonoSuccess, handleMonoClose, user]);

  return (
    <Button
      onClick={openMonoWidget}
      disabled={loading || !user}
      className='plaidlink-primary'
    >
      {loading ? 'Loading...' : 'Connect Bank Account'}
    </Button>
  );
};

export default MonoLink;
