// src/pages/index.tsx
import { useAuth } from '../context/AuthContext';
import { Container, Typography, Button } from '@mui/material';
import Link from 'next/link';
import {useEffect} from "react";

export default function Home() {
    const { user, logout } = useAuth();

    return (
        <Container className="flex flex-col items-center justify-center min-h-screen">
            {user ? (
                <>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Welcome, {user.email}!
                    </Typography>

                            <img src={user.profilePicture} alt={user.profilePicture} />
                            <h1>1{user.profilePicture}</h1>
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