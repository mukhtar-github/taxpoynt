import { useState, useCallback } from "react";
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

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
        // Add logic to handle the success case, e.g., call an API to link the account
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