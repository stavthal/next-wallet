import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { jwtDecode } from 'jwt-decode';
import {
    BankAccount,
    Card,
    Transaction,
    User as UserType,
} from '@prisma/client'; // Assuming you export User type from here

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (token: string) => void;
    logout: () => void;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    isAuthenticated: () => boolean;
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
    profilePicture?: string | undefined;
    totalMoney: number;
    bankAccounts: BankAccount[];
    cards: Card[];
    transactions: Transaction[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();

    useEffect(() => {
        async function loadUserFromCookies() {
            try {
                setLoading(true);
                const { data } = await axios.get('/api/auth/validate'); // Assuming this endpoint checks cookies and returns user data
                setUser(data.user);
            } catch (error) {
                console.error('Failed to validate user:', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        }

        loadUserFromCookies();
    }, []);

    const login = (token: string) => {
        localStorage.setItem('token', token);
        const decoded = jwtDecode<DecodedUser>(token);
        setUser({
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
        axios
            .post('/api/auth/logout')
            .then(() => {
                setUser(null);
                router.push('/login'); // Redirect to login page after logout
            })
            .catch((error) => {
                console.error('Logout failed:', error);
            });
    };

    const isAuthenticated = () => {
        return !!user;
    };

    return (
        <AuthContext.Provider
            value={{ user, setUser, loading, login, logout, isAuthenticated }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
