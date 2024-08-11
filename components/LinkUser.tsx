import { useState, useCallback } from "react";
import { Button } from './ui/button';
import { useRouter } from 'next/router';
import axios from 'axios';

function LinkUser({ user }: { user: any }) {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const router = useRouter();

  const openMonoWidget = useCallback(async () => {
    const MonoConnect = (await import("@mono.co/connect.js")).default;

    const customer = {
      name: user.name || '', // Ensure valid values
      email: user.email || '', // Ensure valid values
      identity: {
        type: 'bvn', // Example type, ensure valid value
        number: user.identification_no || '' // Ensure valid values
      },
    };
    
    const monoInstance = new MonoConnect({
      key: "test_pk_xuwpfgfoxj1n6ndjumt0",
      scope: 'auth',
      data: { customer },
      onClose: () => console.log("Widget closed"),
      onLoad: () => setScriptLoaded(true),
      onSuccess: async ({ code }: { code: string }) => {
        console.log(`Linked successfully: ${code}`);
        try {
          const result = await axios.post('/api/link-account', { code });
          console.log('Account linked successfully:', result.data);
          // Handle further actions after successful linking, e.g., redirect or display a success message
        } catch (error) {
          console.error('Failed to link account:', error);
          // Handle errors, e.g., display an error message to the user
        }
      },
    });

    monoInstance.setup();
    monoInstance.open();
  }, [router, user]);

  return (
    <Button
      onClick={openMonoWidget}
      className='plaidlink-primary'
    >
      Connect Bank Account
    </Button>
  );
}

export default LinkUser;