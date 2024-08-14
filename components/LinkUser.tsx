import { useState, useCallback } from "react";
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import axios from 'axios';

function LinkUser({ user }: { user: any }) {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const openMonoWidget = useCallback(async () => {
    const MonoConnect = (await import("@mono.co/connect.js")).default;

    const monoInstance = new MonoConnect({
      key: 'live_pk_iwv8vjj1xslj0ii24zls',
      scope: 'auth',
      onClose: () => {
        console.log("Widget closed");
        if (!loading) {
          setError('Account linking was cancelled.');
        }
      },
      onLoad: () => setScriptLoaded(true),
      onSuccess: async ({ code }: { code: string }) => {
        setLoading(true);
        try {
          const response = await axios.post('/api/link-account', { code });
          if (response.status === 200) {
            console.log('Account linked successfully:', response.data);
            router.push('/');
          } else {
            throw new Error('Failed to link account with non-success status from server.');
          }
        } catch (error) {
          console.error('Error linking account:', error);
          setError('Failed to link account. Please try again.');
        } finally {
          setLoading(false);
        }
      },
    });

    monoInstance.setup();
    monoInstance.open();
  }, [router, user]);

  return (
    <>
      <Button
        onClick={openMonoWidget}
        className='plaidlink-primary'
        disabled={loading}
      >
        {loading ? 'Linking...' : 'Connect Bank Account'}
      </Button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </>
  );
}

export default LinkUser;