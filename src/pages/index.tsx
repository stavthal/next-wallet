// src/pages/index.tsx
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Container, Typography, Button, Box } from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

import walletLogo from '../../public/next-wallet-logo.webp';
import Navbar from '../components/Navbar';

export default function Home() {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.push('/dashboard');
        }
    }, [user, router]);

    return (
        <>
            <Navbar />
            <Container className="flex flex-col items-center pt-20">
                    <>
                        <Image className="w-40 h-40 rounded-full mb-6" src={walletLogo} alt="wallet" />
                        <Typography variant="h4" component="h1" gutterBottom>
                            Welcome to <span className="text-sky-800">Next Wallet</span>
                        </Typography>
                        <Typography variant="body1" component="p" color="text.secondary" className="mb-4">
                            Your personal wallet to manage your finances. Add money, track expenses, and much more.
                        </Typography>
                        <Box display="flex" className="flex gap-4" justifyContent="space-between">
                            <Link href="/login" passHref>
                                <Button variant="contained" color="primary" className="my-2 w-40">
                                    Login
                                </Button>
                            </Link>
                            <Link href="/register" passHref>
                                <Button variant="outlined" color="secondary" className="my-2 w-40">
                                    Register
                                </Button>
                            </Link>
                        </Box>
                    </>
            </Container>
        </>
    );
}