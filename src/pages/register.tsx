// src/pages/register.tsx
import {FormEvent, useState} from 'react';
import { Container, TextField, Button, Typography } from '@mui/material';
import axios from 'axios';
import {useRouter} from "next/router";
import {useAuth} from "@/context/AuthContext";

export default function Register() {
    const router = useRouter();
    const {login} = useAuth();

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    const [message, setMessage] = useState<string>('');
    const [name, setName] = useState<string>('');

    const handleRegister = async (e: FormEvent<HTMLElement>): Promise<void> => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        formData.append('name', name);
        if (profilePicture) {
            formData.append('profilePicture', profilePicture);
        }

        try {
            const { data } = await axios.post('/api/auth/register', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            login(data.token); // Log the user in
            setMessage('Registration successful');
            router.push('/'); // Navigate to the home page
        } catch (error: any) {
            if (error?.response?.data?.code === 'P2002') {
                setMessage("Email already exists");
            } else {
                setMessage(error.response.data.error); // Display the error message
            }
        }
    };

    return (
        <Container className="flex flex-col items-center justify-center min-h-screen">
            <form onSubmit={(e) => handleRegister(e)}>
            <Typography variant="h4" component="h1" gutterBottom>
                Register
            </Typography>
            <TextField
                label="Full name"
                variant="outlined"
                fullWidth
                margin="normal"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={true}
                />
            <TextField
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required={true}
            />
            <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={true}
            />
            <input
                type="file"
                accept="image/*"
                onChange={(e) => setProfilePicture(e.target.files ? e.target.files[0] : null)}
                className="my-4"
            />
            <Button type="submit" variant="contained" color="secondary" fullWidth className="mt-4">
                Register
            </Button>
            {message && (
                <Typography variant="body1" color="error" align="center" className="mt-2">
                    {message}
                </Typography>
            )}
            </form>
        </Container>
    );
}
