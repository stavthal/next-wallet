// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import {useRouter} from 'next/router';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
    user: User | null;
    login: (token: string) => void;
    logout: () => void;
}

interface User {
    id: number;
    email: string;
    name: string;
    profilePicture?: string;
}

interface DecodedUser {
    userId: number;
    email: string;
    name: string;
    profilePicture?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        try {
            const token = localStorage.getItem('token')

            if (token) {
                const decoded = jwtDecode<DecodedUser>(token);
                setUser({ id: decoded.userId, email: decoded.email, name: decoded.name, profilePicture: decoded?.profilePicture});
            }
        } catch(err) {
            console.error(err);
            logout();
        }
    }, []);

    const login = (token: string) => {
        localStorage.setItem('token', token);
        const decoded = jwtDecode<DecodedUser>(token);
        setUser({ id: decoded.userId, email: decoded.email, name: decoded.name, profilePicture: decoded?.profilePicture });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);

        router.push('/'); // Navigate to the home page
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
