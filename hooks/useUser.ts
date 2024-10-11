import { useContext } from 'react';
import { UserContext } from '../context/UserContext'; // Ensure the path is correct
import { UserContextType } from '../types/index.d';

// Create the useUser hook
export function useUser(): UserContextType {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context as unknown as UserContextType;
}