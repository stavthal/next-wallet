// src/pages/login.tsx
import { useState } from 'react';
import { Container, TextField, Button, Typography } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {useRouter} from "next/router";

export default function Login() {
    const router = useRouter();
    const { login } = useAuth();


    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [message, setMessage] = useState<string>('');

    const handleLogin = async () => {
        try {
            const { data } = await axios.post('/api/auth/login', { email, password });
            login(data.token);
            setMessage('Login successful');
            router.push('/');
        } catch (error) {
            setMessage('Login failed');
        }
    };

    return (
        <Container className="flex flex-col items-center justify-center min-h-screen">
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
            <Button variant="contained" color="primary" fullWidth onClick={handleLogin} className="mt-4">
                Login
            </Button>
            {message && (
                <Typography variant="body1" color="error" align="center" className="mt-2">
                    {message}
                </Typography>
            )}
        </Container>
    );
}
