// src/components/RequireAuth.tsx
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const RequireAuth = (WrappedComponent: any) => {
    return (props: any) => {
        const router = useRouter();
        const { user } = useAuth();

        useEffect(() => {
            if (!user) {
                router.push('/login');
            }
        }, [user, router]);

        return <WrappedComponent {...props} />;
    };
};

export default RequireAuth;