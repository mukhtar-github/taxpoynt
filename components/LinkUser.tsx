'use client'

import { useState, useCallback, useEffect } from "react";
import { Button } from './ui/button';
import { toast } from 'react-hot-toast';
import { linkAccount, reauthorizeAccount } from '@/lib/server';

function LinkUser({ user, onAccountLinked }: { user: any; onAccountLinked: (userData: any) => void }) {
  const [scriptLoaded, setScriptLoaded] = useState(false);
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

  const showSuccessMessage = (message: string) => toast.success(message);
  const showErrorMessage = (message: string) => toast.error(message);

  const updateAccountLinkState = useCallback((isLinked: boolean, userData: any = null) => {
    setIsAccountLinked(isLinked);
    if (userData) {
      onAccountLinked(userData);
    }
  }, [onAccountLinked]);

  const handleLinkAccount = useCallback(async (authorizationCode: string) => {
    setLoading(true);
    try {
      const data = await linkAccount(authorizationCode);
      if (data.success) {
        updateAccountLinkState(true, data.user);
        showSuccessMessage('Account linked successfully');
      } else {
        throw new Error(data.message || 'Failed to link account');
      }
    } catch (error) {
      console.error('Error linking account:', error);
      showErrorMessage(error instanceof Error ? error.message : 'An error occurred while linking the account');
      updateAccountLinkState(false);
    } finally {
      setLoading(false);
    }
  }, [updateAccountLinkState]);

  const openMonoWidget = useCallback(async () => {
    const MonoConnect = (await import("@mono.co/connect.js")).default;

    const monoInstance = new MonoConnect({
      key: 'live_pk_iwv8vjj1xslj0ii24zls',
      scope: 'auth',
      onClose: () => {
        console.log("Widget closed");
        if (!loading) {
          showErrorMessage('Account linking was cancelled.');
        }
      },
      onLoad: () => setScriptLoaded(true),
      onSuccess: ({ code }: { code: string }) => handleLinkAccount(code),
    });

    monoInstance.setup();
    monoInstance.open();
  }, [loading, handleLinkAccount]);

  const handleReauthorization = useCallback(async () => {
    try {
      const data = await reauthorizeAccount(user.$id);
      if (data.success) {
        showSuccessMessage('Re-authorization successful');
        onAccountLinked({ ...user, requiresReauth: false });
      } else {
        throw new Error(data.message || 'Failed to re-authorize');
      }
    } catch (error) {
      console.error('Error re-authorizing:', error);
      showErrorMessage(error instanceof Error ? error.message : 'An error occurred during re-authorization');
    }
  }, [user, onAccountLinked]);

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
    <>
      <Button
        onClick={openMonoWidget}
        className='plaidlink-primary'
        disabled={loading}
      >
        {loading ? 'Linking...' : 'Connect Bank Account'}
      </Button>
    </>
  );
}

export default LinkUser;