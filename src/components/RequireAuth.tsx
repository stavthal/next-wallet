import { useRouter } from 'next/router';
import { useEffect, FunctionComponent, ComponentType } from 'react';
import { useAuth } from '../context/AuthContext';

const RequireAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {
    const AuthenticatedComponent: FunctionComponent<P> = (props) => {
        const router = useRouter();
        const { user} = useAuth();

        useEffect(() => {
            // Redirect to login if there is no user
            if (!user) {
                router.push('/');
            }
        }, [ router]);

        return <WrappedComponent {...props} />;
    };

    return AuthenticatedComponent;
};

export default RequireAuth;