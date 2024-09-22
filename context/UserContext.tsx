'use client';

import { createAdminClient } from '@/lib/appwrite';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    // Add other necessary fields here
}

interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
}

// Initialize the context with default values
export const UserContext = createContext<UserContextType | undefined>(undefined);

// Create a provider component
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const client = await createAdminClient();
                const userData = await client.account.get();

                // **Serialize userData into a plain object**
                const plainUserData: User = {
                    id: userData.$id,
                    email: userData.email,
                    firstName: userData.name,
                    lastName: userData.name,
                    // Add other necessary fields here
                };

                setUser(plainUserData);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setUser(null);
            }
        };

        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
