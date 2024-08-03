import { useState, useCallback } from "react";
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

function LinkUser({ user }: MonoLinkProps) {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const router = useRouter();

  const openMonoWidget = useCallback(async () => {
    const MonoConnect = (await import("@mono.co/connect.js")).default;
    
    const monoInstance = new MonoConnect({
      key: "test_pk_xuwpfgfoxj1n6ndjumt0",
      onClose: () => console.log("Widget closed"),
      onLoad: () => setScriptLoaded(true),
      onSuccess: ({ code }: { code: string }) => {
        console.log(`Linked successfully: ${code}`);
        router.push('/'); // Navigate to the homepage
      },
    });

    monoInstance.setup();
    monoInstance.open();
  }, [router]);

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
