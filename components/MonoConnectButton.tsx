// components/MonoConnectButton.tsx
import React, { useState } from 'react';

const MonoConnectButton = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleConnect = async () => {
    const response = await fetch('/api/mono/initiate-link', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email }),
    });

    const data = await response.json();
    if (response.ok) {
      window.location.href = data.monoUrl; // Redirect user to Mono's link
    } else {
      alert('Failed to connect to Mono: ' + data.error);
    }
  };

  return (
    <div>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" />
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your Email" />
      <button onClick={handleConnect}>Connect to Bank</button>
    </div>
  );
};

export default MonoConnectButton;
