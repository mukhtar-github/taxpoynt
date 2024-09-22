'use client'

import { useState, useCallback, useEffect } from "react";
import { Button } from './ui/button';
import { toast } from 'react-hot-toast';
import { linkAccount, reauthorizeAccount } from '@/lib/server';
import Image from 'next/image';
import { CONNECT_BANK_OPTION } from '@/constants';
import { useRouter, usePathname } from 'next/navigation';
import { useUser } from 'hooks/useUser';

interface LinkUserProps {
  onAccountLinked: (user: User) => void;
}

function LinkUser({ onAccountLinked }: LinkUserProps) {
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [isAccountLinked, setIsAccountLinked] = useState(false);

  useEffect(() => {
    if (user) {
      setIsAccountLinked(!!user.accountId);

      if (user.requiresReauth && user.reauthUrl) {
        toast.error('Re-authorization required. Redirecting...');
        setTimeout(() => {
          window.location.href = user.reauthUrl;
        }, 2000);
      }
    }
  }, [user]);

  const handleLinkAccount = useCallback(async (authorizationCode: string) => {
    setLoading(true);
    try {
      const data = await linkAccount(authorizationCode);
      if (data.success) {
        setIsAccountLinked(true);
        toast.success('Account linked successfully');
        if (pathname !== '/dashboard') {
          router.push('/dashboard');
        }
        onAccountLinked(data.user); // Remove the conditional check
      } else {
        throw new Error(data.message || 'Failed to link account');
      }
    } catch (error) {
      console.error('Error linking account:', error);
      toast.error(error instanceof Error ? error.message : 'An error occurred while linking the account');
      setIsAccountLinked(false);
    } finally {
      setLoading(false);
    }
  }, [router, pathname, onAccountLinked]);

  const openMonoWidget = useCallback(async () => {
    const MonoConnect = (await import("@mono.co/connect.js")).default;

    const monoInstance = new MonoConnect({
      key: 'live_pk_iwv8vjj1xslj0ii24zls',
      scope: 'auth',
      onClose: () => {
        console.log("Widget closed");
        if (!loading) {
          toast.error('Account linking was cancelled.');
        }
      },
      onSuccess: ({ code }: { code: string }) => handleLinkAccount(code),
    });

    monoInstance.setup();
    monoInstance.open();
  }, [loading, handleLinkAccount]);

  const handleReauthorization = useCallback(async () => {
    try {
      const data = await reauthorizeAccount(user.$id);
      if (data.success) {
        toast.success('Re-authorization successful');
        setIsAccountLinked(true);
        router.push('/dashboard'); // Redirect to Dashboard after re-authorization
      } else {
        throw new Error(data.message || 'Failed to re-authorize');
      }
    } catch (error) {
      console.error('Error re-authorizing:', error);
      toast.error(error instanceof Error ? error.message : 'An error occurred during re-authorization');
    }
  }, [user, router]);

  if (!user) {
    return null; // or some loading indicator
  }

  if (user.requiresReauth) {
    return (
      <Button onClick={handleReauthorization} className='plaidlink-primary'>
        Re-authorize Account
      </Button>
    );
  }

  if (isAccountLinked) {
    return <p>Your account is already linked.</p>;
  }

  return (
    <Button
      onClick={openMonoWidget}
      className='plaidlink-default'
      disabled={loading}
    >
      <Image 
        src={CONNECT_BANK_OPTION.icon}
        alt="connect bank"
        width={24}
        height={24}
      />
      <p className='text-[16px] font-semibold text-black-2'>
        {loading ? 'Linking...' : CONNECT_BANK_OPTION.label}
      </p>
    </Button>
  );
}

export default LinkUser;