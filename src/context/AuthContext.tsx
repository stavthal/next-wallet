// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import {useRouter} from 'next/router';
import { jwtDecode } from 'jwt-decode';
import {Transaction} from "@prisma/client";

interface AuthContextType {
    user: User | null;
    login: (token: string) => void;
    logout: () => void;
    setUser: React.Dispatch<React.SetStateAction<User | null>>; // Add setUser here
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
    const router = useRouter();

    useEffect(() => {
        try {
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
        }
    }, []);

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

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout }}>
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
