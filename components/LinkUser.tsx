import { useState, useCallback, useEffect } from "react";
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';

function LinkUser({ user, onAccountLinked }: { user: any; onAccountLinked: (userData: any) => void }) {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAccountLinked, setIsAccountLinked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if the account is already linked when the component mounts
    setIsAccountLinked(!!user.accountId);
  }, [user]);

  const showSuccessMessage = (message: string) => toast.success(message);
  const showErrorMessage = (message: string) => toast.error(message);

  const updateAccountLinkState = useCallback((isLinked: boolean, userData: any = null) => {
    setIsAccountLinked(isLinked);
    if (userData) {
      onAccountLinked(userData);
    }
  }, [onAccountLinked]);

  const linkAccount = useCallback(async (authorizationCode: string) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/link-account', { code: authorizationCode });
      if (response.data.success) {
        updateAccountLinkState(true, response.data.user);
        showSuccessMessage('Account linked successfully');
        //router.push('/');
      } else {
        throw new Error(response.data.message || 'Failed to link account');
      }
    } catch (error) {
      console.error('Error linking account:', error);
      showErrorMessage(error instanceof Error ? error.message : 'An error occurred while linking the account');
      updateAccountLinkState(false);
    } finally {
      setLoading(false);
    }
  }, [router, updateAccountLinkState]);

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
      onSuccess: ({ code }: { code: string }) => linkAccount(code),
    });

    monoInstance.setup();
    monoInstance.open();
  }, [loading, linkAccount]);

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