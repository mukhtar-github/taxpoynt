import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import monoConnect from '@/lib/mono'; // Ensure this is TypeScript for type safety
import { Button } from './ui/button';

const MonoLink = ({ user }: MonoLinkProps) => {
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');
  const router = useRouter();

  const handleMonoSuccess = useCallback((response: MonoSuccessResponse) => {
    console.log('Mono connected successfully:', response.code);
    router.push('/dashboard');
  }, [router]);

  const handleMonoClose = useCallback(() => {
    console.log('Mono widget closed');
    setLoading(false);
  }, []);

  useEffect(() => {
    const getLinkToken = async () => {
      try {
        const response = await fetch('/api/mono/connection-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user || '' }), // Assuming you have a user ID to send
        });

        if (!response.ok) {
          throw new Error('Failed to fetch the Mono connection token');
        }

        const data = await response.json();
        setToken(data?.token);
      } catch (error) {
        console.error('Error fetching Mono connection token:', error);
      }
    };

    if (user) {
      getLinkToken();
    }
  }, [user]);

  const openMonoWidget = useCallback(async () => {
    if (!user) {
      console.log('No user information available');
      return;
    }
    if (!token) {
      console.log('No token available');
      return;
    }
    setLoading(true);

    try {
      // Initialize the Mono widget with the fetched token
      const mono = await monoConnect(handleMonoSuccess, handleMonoClose); // Adjusted monoConnect to accept token
      mono.open();
    } catch (error) {
      console.error('Error initializing Mono widget:', error);
      setLoading(false);
    }
  }, [user, token, handleMonoSuccess]);

  return (
    <>
      <Button
        onClick={openMonoWidget}
        disabled={loading}
        className='plaidlink-primary'
      >
        {loading ? 'Loading...' : 'Connect Bank Account'}
      </Button>
    </>
  );
};

export default MonoLink;


// import React, { useState, useCallback } from 'react';
// import { useRouter } from 'next/navigation';
// import monoConnect from '@/lib/mono'; // Assuming this is a custom hook or function you've created for Mono integration
// import { Button } from './ui/button';

// // Assuming MonoLinkProps and MonoSuccessResponse are defined elsewhere
// interface MonoLinkProps {
//   user: {
//     id: string; // Assuming the user object has an id property
//     // Add other user properties as needed
//   };
// }

// interface MonoSuccessResponse {
//   code: string; // Assuming the response has a code property
//   // Add other response properties as needed
// }

// const MonoLink = ({ user }: MonoLinkProps) => {
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   const handleMonoSuccess = useCallback((response: MonoSuccessResponse) => {
//     console.log('Mono connected successfully:', response.code);
//     router.push('/dashboard');
//   }, [router]);

//   const handleMonoClose = useCallback(() => {
//     console.log('Mono widget closed');
//     setLoading(false);
//   }, []);

//   const openMonoWidget = useCallback(async () => {
//     if (!user) {
//       console.log('No user information available');
//       return;
//     }
//     setLoading(true);

//     try {
//       // Fetch the Mono connection token from your server
//       const response = await fetch('/api/mono/connection-token', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ userId: user.id }), // Assuming you have a user ID to send
//       });

//       if (!response.ok) {
//         throw new Error('Failed to fetch the Mono connection token');
//       }

//       const { token } = await response.json();

//       // Initialize the Mono widget with the fetched token
//       const mono = await monoConnect(handleMonoSuccess, token); // Adjusted monoConnect to accept token
//       mono.open();
//     } catch (error) {
//       console.error('Error fetching Mono connection token:', error);
//       setLoading(false);
//     }
//   }, [user, handleMonoSuccess, handleMonoClose]);

//   return (
//     <>
//       <Button
//         onClick={openMonoWidget}
//         disabled={loading}
//         className='plaidlink-primary'
//       >
//         {loading ? 'Loading...' : 'Connect Bank Account'}
//       </Button>
//     </>
//   );
// };

// export default MonoLink;



// import monoConnect from '@/lib/mono';
// import React, { useCallback } from 'react';
// import { Button } from './ui/button';
// import { useRouter } from 'next/navigation';

// const MonoLink = ({ user }: MonoLinkProps) => {
//   const router = useRouter()

//   const handleMonoSuccess = useCallback((response: any) => {
//     if (!response.code) {
//       console.error('Unexpected response structure:', response);
//       return;
//     }
  
//     console.log('Mono connected successfully:', response.code);
//     // Proceed with handling the correctly structured response

//     console.log('Mono connected successfully:', response.code);
    
//     router.push('/dashboard') // Navigate to /dashboard
//   }, [user]);
  
//   const handleMonoClose = useCallback(() => {
//     console.log('Mono widget closed');
//     // Optionally handle widget close, such as re-enabling buttons or updating state
//   }, []);

//   const openMonoWidget = useCallback(() => {
//     const mono = monoConnect(handleMonoSuccess, handleMonoClose);
//     mono.open();
//   }, [handleMonoSuccess, handleMonoClose]);

//   return (
//     <>
//       <Button
//         className='plaidlink-primary'
//         onClick={openMonoWidget}
//       >
//         Connect Bank Account
//       </Button>
//     </>
//   );
// };

// export default MonoLink;


// // const handleMonoSuccess = useCallback((response: MonoSuccessResponse) => {
//   //   console.log('Mono connected successfully:', response);
//   //   // Handle successful connection, such as storing returned data or updating UI
//   // }, []);