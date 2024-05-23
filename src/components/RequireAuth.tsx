import { useRouter } from 'next/router';
import { useEffect, FunctionComponent, ComponentType } from 'react';
import { useAuth } from '../context/AuthContext';

const RequireAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {
    const AuthenticatedComponent: FunctionComponent<P> = (props) => {
        const router = useRouter();
        const { user } = useAuth();

        useEffect(() => {
            // Redirect to login if there is no user
            if (!user) {
                router.push('/login');
            }
        }, [user, router]);

        // Render the component with all its props if the user exists
        // Otherwise, render a loading spinner
        return user ? <WrappedComponent {...props} /> : <div>Loading...</div>;
    };

    return AuthenticatedComponent;
};

export default RequireAuth;