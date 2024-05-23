// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import {useRouter} from 'next/router';
import { jwtDecode } from 'jwt-decode';
import {Transaction} from "@prisma/client";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (token: string) => void;
    logout: () => void;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    isAuthenticated: () => boolean;
}

interface BankAccount {
    userId: string;
    user: User;
    accountNumber: string;
    beneficiaryNumber: string;
    bankName: string;
}

interface Card {
    userId: string;
    user: User;
    brand: string;
    cardType: string;
    cardholderName: string;
    cardNumber: string;
    expiryDate: string;
    cvv: number;
}

interface User {
    id: number;
    email: string;
    name: string;
    profilePicture?: string;
    totalMoney: number;
    bankAccounts: BankAccount[];
    cards: Card[];
    transactions: Transaction[];
}

interface DecodedUser {
    userId: number;
    email: string;
    name: string;
    profilePicture?: string;
    totalMoney: number;
    bankAccounts: BankAccount[];
    cards: Card[];
    transactions: Transaction[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token')

            if (token) {
                const decoded = jwtDecode<DecodedUser>(token);
                setUser(
                    {
                        id: decoded.userId,
                        email: decoded.email,
                        name: decoded.name,
                        profilePicture: decoded?.profilePicture,
                        totalMoney: decoded?.totalMoney,
                        bankAccounts: decoded.bankAccounts,
                        cards: decoded.cards,
                        transactions: decoded.transactions,
                    });
            }
        } catch(err) {
            console.error(err);
            logout();
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    const login = (token: string) => {
        localStorage.setItem('token', token);
        const decoded = jwtDecode<DecodedUser>(token);
        setUser(
            {
                id: decoded.userId,
                email: decoded.email,
                name: decoded.name,
                profilePicture: decoded?.profilePicture,
                totalMoney: decoded?.totalMoney,
                bankAccounts: decoded.bankAccounts,
                cards: decoded.cards,
                transactions: decoded.transactions,
            });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);

        router.push('/'); // Navigate to the home page
    };

    const isAuthenticated = () => {
        if (localStorage.getItem('token')) {
            return true;
        } else {
            return false;
        }
    }

    return (
        <AuthContext.Provider value={{ user, setUser, loading, isAuthenticated, login, logout }}>
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
