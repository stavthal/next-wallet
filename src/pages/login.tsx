import {useState} from 'react';
import { Container, TextField, Button, Typography } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {useRouter} from "next/router";
import Image from "next/image";
import {theme} from '../util/theme';


import walletLogo from '../../public/next-wallet-logo.webp';

export default function Login() {
    const router = useRouter();
    const {user} = useAuth();
    const { login } = useAuth();



    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [message, setMessage] = useState<string>('');

    const handleLogin = async () => {
        try {
            const { data } = await axios.post('/api/auth/login', { email, password });
            login(data.token);
            setMessage('Login successful');
            router.push('/dashboard');
        } catch (error) {
            setMessage('Login failed');
        }
    };

    return (
        <Container className="flex flex-col items-center justify-center min-h-screen w-1/2 max-md:w-10/12">
            <Image
                src={walletLogo}
                alt={"wallet-logo"}
                className="mb-4 rounded-full"
                width={100}
                height={100}
            />
            <Typography variant="h4" component="h1" gutterBottom>
                Login
            </Typography>
            <TextField
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button variant="contained" sx={{backgroundColor: '#0f1b41', '&:hover': {backgroundColor: theme.palette.primary.light }}} fullWidth onClick={handleLogin} className="mt-4">
                Login
            </Button>
            <Button
                onClick={() => router.push('/')}
                fullWidth
                className="mt-2"
                variant="outlined"
            >
                Back to home
            </Button>
            {message && (
                <Typography variant="body1" color="error" align="center" className="mt-2">
                    {message}
                </Typography>
            )}
        </Container>
    );
}
