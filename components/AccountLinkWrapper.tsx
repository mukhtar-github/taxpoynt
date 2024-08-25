'use client';

import React, { useCallback } from 'react';
import LinkUser from './LinkUser';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export function AccountLinkWrapper({ user }: { user: any }) {
  const router = useRouter();

  const onAccountLinked = useCallback(() => {
    console.log('Account linked');
    toast.success('Account linked successfully!');
    // Add a slight delay before redirecting to ensure the toast message is visible
    setTimeout(() => {
      router.push('/');
    }, 1500); // 1.5 seconds delay
  }, [router]);

  return <LinkUser user={user} onAccountLinked={onAccountLinked} />;
}