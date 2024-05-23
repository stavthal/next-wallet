import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Container, Typography, Button, Box } from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import '@/app/globals.css';

// MUI Icons
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PaymentIcon from '@mui/icons-material/Payment';
import SecurityIcon from '@mui/icons-material/Security';

import walletLogo from '../media/next-wallet-logo.webp';
import backgroundImage from '@/media/background-dark.webp';
import Navbar from '../components/Navbar';
import jwt from 'jsonwebtoken';

export default function Home() {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.push('/dashboard');
        }
    }, [user, router]);

    return (
        <div
            style={{
                backgroundImage: `url(${backgroundImage.src})`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center center',
                backgroundAttachment: 'fixed',
                WebkitBackgroundSize: 'cover',
                MozBackgroundSize: 'cover',
                OBackgroundSize: 'cover',
                backgroundSize: 'cover',
                minHeight: '100vh',
                width: '100%',
            }}
        >
            <Navbar />
            <Container className="flex flex-col items-center mt-14 pb-10 rounded-2xl bg-opacity-90 bg-white max-md:w-11/12">
                <>
                    <Image
                        className="mt-10 w-40 h-40 rounded-full mb-6"
                        src={walletLogo}
                        alt="wallet"
                    />
                    <Typography
                        variant="h4"
                        component="h1"
                        align="center"
                        className="mt-8 max-md:text-2xl"
                        gutterBottom
                    >
                        Revolutionize your finances with{' '}
                        <span className="text-sky-800">Next Wallet</span>
                    </Typography>
                    <Typography
                        variant="body1"
                        component="p"
                        color="text.secondary"
                        className="mb-4 max-md:text-sm"
                    >
                        Manage, spend, and save your money with ease.
                    </Typography>
                    <Box
                        display="flex"
                        className="flex gap-4"
                        justifyContent="space-between"
                    >
                        <Link href="/login" passHref>
                            <Button
                                variant="contained"
                                color="primary"
                                className="my-2 w-40"
                            >
                                Login
                            </Button>
                        </Link>
                        <Link href="/register" passHref>
                            <Button
                                variant="outlined"
                                color="primary"
                                className="my-2 w-40"
                            >
                                Register
                            </Button>
                        </Link>
                    </Box>
                </>
            </Container>
            {/* Features Container */}
            <Container className="mt-10">
                <Typography
                    variant="h4"
                    component="h2"
                    align="center"
                    className="text-white"
                    gutterBottom
                >
                    Features
                </Typography>
                <div className="grid pb-5 sm:grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-6 border bg-white bg-opacity-90 rounded-xl shadow-md text-center transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-105">
                        <AccountBalanceWalletIcon
                            fontSize="large"
                            color="primary"
                        />
                        <Typography
                            variant="h6"
                            component="h3"
                            align="center"
                            gutterBottom
                        >
                            Digital Wallet
                        </Typography>
                        <Typography
                            variant="body1"
                            component="p"
                            align="center"
                        >
                            Securely manage and store your digital assets in one
                            place.
                        </Typography>
                    </div>
                    <div className="p-6 border bg-white bg-opacity-90 rounded-xl shadow-md text-center transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-105">
                        <PaymentIcon fontSize="large" color="primary" />
                        <Typography
                            variant="h6"
                            component="h3"
                            align="center"
                            gutterBottom
                        >
                            Easy Payments
                        </Typography>
                        <Typography
                            variant="body1"
                            component="p"
                            align="center"
                        >
                            Make seamless and quick payments with just a few
                            clicks.
                        </Typography>
                    </div>
                    <div className="p-6 border bg-white bg-opacity-90 rounded-xl shadow-md text-center transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-105">
                        <SecurityIcon fontSize="large" color="primary" />
                        <Typography
                            variant="h6"
                            component="h3"
                            align="center"
                            gutterBottom
                        >
                            Advanced Security
                        </Typography>
                        <Typography
                            variant="body1"
                            component="p"
                            align="center"
                        >
                            Your transactions and data are protected with
                            top-notch security.
                        </Typography>
                    </div>
                </div>
            </Container>
        </div>
    );
}

export async function getServerSideProps(context: any) {
    const { req, res } = context;

    // Replace this with your actual logic to check if the user is authenticated
    const auth = await isAuthenticated(req);

    if (!auth) {
        res.setHeader('location', '/login');
        res.statusCode = 302;
        res.end();
        return { props: {} };
    }

    return {
        props: {},
    };
}

async function isAuthenticated(req: any) {
    const token = req.cookies.token;
    const JWT_SECRET = process.env.JWT_SECRET!;

    if (!token) {
        return false;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        return true;
    } catch (err) {
        return false;
    }
}
