'use client';

import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';

// Define the User type
interface User {
    id: string;
    name: string;
    // ... other user properties
}

// Extend the UserContextType to include isLoading
interface UserContextType {
    user: User | null;
    isLoading: boolean;
    // ... other context properties or methods
}

// Initialize the context with default values
export const UserContext = createContext<UserContextType | undefined>({
    user: null,
    isLoading: false,
    // ... initialize other context properties
});

// Create a provider component
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        // Simulate fetching user data
        const fetchUser = async () => {
            try {
                // Replace with actual data fetching logic
                const fetchedUser: User = await new Promise((resolve) =>
                    setTimeout(() => resolve({ id: '1', name: 'John Doe' }), 2000)
                );
                setUser(fetchedUser);
            } catch (error) {
                console.error('Error fetching user:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, isLoading }}>
            {children}
        </UserContext.Provider>
    );
};

// Create a custom hook for easier context consumption
export const useUserHook = () => useContext(UserContext);
