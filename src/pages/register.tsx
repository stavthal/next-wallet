// src/pages/register.tsx
import {FormEvent, useState, useRef} from 'react';
import {Container, TextField, Button, Typography, Link, FormLabel} from '@mui/material';
import axios from 'axios';
import {useRouter} from "next/router";
import Image from 'next/image';

import walletLogo from '../../public/next-wallet-logo.webp';
import {useAuth} from "@/context/AuthContext";

export default function Register() {
    const router = useRouter();
    const { login } = useAuth();

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    const [selectedFileName, setSelectedFileName] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleRegister = async (e: FormEvent<HTMLElement>): Promise<void> => {
        e.preventDefault();



        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        formData.append('name', firstName + " " + lastName);
        if (profilePicture) {
            formData.append('profilePicture', profilePicture);
        }

        try {
            await axios.post('/api/auth/register', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Login request
            const { data } = await axios.post('/api/auth/login', { email, password });
            // Store the token in local storage and update the user state
            localStorage.setItem('token', data.token);

            setMessage('Registration successful');
            alert('Registration successful');
            login(data.token);
            await router.push('/dashboard');
        } catch (error: any) {
            if (error?.response?.data?.code === 'P2002') {
                setMessage("Email already exists");
            } else {
                setMessage(error?.response?.data?.error); // Display the error message
            }
        }
    };

    const handleFileUpload = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setProfilePicture(file);
        setSelectedFileName(file ? file.name : '');
    };

    function Copyright(props: any) {
        return (
            <div className="mt-10">
                <Typography variant="body2" color="text.secondary" align="center" {...props}>
                    {'Copyright © '}
                    <Link color="inherit" href="/">
                        Next Wallet
                    </Link>{' '}
                    {new Date().getFullYear()}
                    {'.'}
                </Typography>
            </div>
        );
    }

    return (
        <Container className="flex flex-col items-center justify-center min-h-screen w-1/2 max-md:w-10/12">
            <form className="flex flex-col" onSubmit={(e) => handleRegister(e)}>
                <div className="flex flex-col justify-items-center items-center">
                    <Image
                        src={walletLogo}
                        alt={"wallet-logo"}
                        className="mb-4 rounded-full shadow-2xl"
                        width={100}
                        height={100}
                    />
                    <Typography sx={{ fontFamily: 'Montserrat'}} variant="h4" component="h1" align="center" gutterBottom>
                        Register
                    </Typography>
                </div>
                <div className="flex row gap-2">
                    <TextField
                        label="First Name"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required={true}
                    />
                    <TextField
                        label="Last Name"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required={true}
                    />
                </div>

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
                <TextField
                    label="Confirm password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required={true}
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="my-4"
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                />
                <FormLabel>
                    <Typography className="mb-1" variant="body1" color="text.secondary" align="left">
                        Profile Picture
                    </Typography>
                </FormLabel>
                <div className="flex row">
                    <Button variant="contained" color="primary" onClick={handleFileUpload}>
                        Select File
                    </Button>
                    {selectedFileName && (
                        <Typography variant="body1" color="text.secondary" align="left" className="mt-2 ml-6">
                            Selected file: {selectedFileName}
                        </Typography>
                    )}
                </div>

                <Button type="submit" variant="outlined" color="primary" fullWidth className="mt-4">
                    Register
                </Button>
                {message && (
                    <Typography variant="body1" color="error" align="center" className="mt-2">
                        {message}
                    </Typography>
                )}
                <Link href="/login" className="self-end mt-10 underline">
                    <Typography component="p" >Already have an account? Login here.</Typography>
                </Link>
            </form>
            <Copyright/>
        </Container>
    );
}