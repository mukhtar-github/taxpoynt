'use client'; // This directive makes the component a client component

import { UserProvider } from '../context/UserContext';
import { ReactNode } from 'react';

const UserProviderWrapper = ({ children }: { children: ReactNode }) => {
    return <UserProvider>{children}</UserProvider>;
};

export default UserProviderWrapper;
