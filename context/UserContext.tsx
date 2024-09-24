'use client';

import React, { createContext, useState, ReactNode, Dispatch, SetStateAction, useContext } from 'react';
import { User } from 'types'; // Ensure this import exists and is correct

// Removed the local interface User declaration

// Updated UserContextType to use the imported User
export interface UserContextType {
    user: User | null;
    setUser: Dispatch<SetStateAction<User | null>>;
}

// Initialize the context with default values
export const UserContext = createContext<UserContextType | undefined>(undefined);

// Create a provider component
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

// Optional: If you prefer to define the `useUser` hook in a separate file, consider removing it from here
export const useUserHook = () => useContext(UserContext);
