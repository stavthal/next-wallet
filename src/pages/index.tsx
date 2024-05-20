// src/pages/index.tsx
import { Container, Typography, Button } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

export default function Home() {
    const { user, logout } = useAuth();

    return (
        <Container className="flex flex-col items-center justify-center min-h-screen">
            {user ? (
                <>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Welcome, {user.email}!
                    </Typography>
                    <Button variant="contained" color="primary" fullWidth onClick={logout}>
                        Logout
                    </Button>
                </>
            ) : (
                <>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Welcome to Our Website
                    </Typography>
                    <Link href="/login" passHref>
                        <Button variant="contained" color="primary" className="my-2">
                            Login
                        </Button>
                    </Link>
                    <Link href="/register" passHref>
                        <Button variant="contained" color="secondary" className="my-2">
                            Register
                        </Button>
                    </Link>
                </>
            )}
        </Container>
    );
}
