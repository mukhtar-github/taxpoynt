import { useContext } from 'react';
import { UserContext } from '../context/UserContext'; // Ensure the path is correct

// Create the useUser hook
export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}