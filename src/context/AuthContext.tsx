import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import jwt_decode from 'jwt-decode'; // Corrected import statement
import { User as UserType } from '@prisma/client'; // Assuming you export User type from here

interface AuthContextType {
    user: UserType | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserType | null>(null);
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

    const login = async (email: string, password: string) => {
        try {
            setLoading(true);
            const { data } = await axios.post('/api/auth/login', {
                email,
                password,
            });
            // Assuming the server sets HttpOnly cookie automatically and just sends back user data
            setUser(data.user);
            router.push('/dashboard'); // Redirect to dashboard upon successful login
        } catch (error) {
            console.error('Login failed:', error);
            throw error; // Rethrow or handle appropriately (e.g., show an error message)
        } finally {
            setLoading(false);
        }
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
            value={{ user, loading, login, logout, isAuthenticated }}
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
