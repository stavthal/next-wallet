import React, { useEffect, useState, useRef } from 'react';
import { Box, Container, Typography, Avatar, IconButton } from '@mui/material';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { enqueueSnackbar } from 'notistack';
import jwt from 'jsonwebtoken';

export default function UserDetails() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { user, setUser } = useAuth();
    const [userState, setUserState] = useState<any>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.post(`/api/auth/get_user`, {
                    userId: user?.id,
                });
                setUserState(response.data);
            } catch (error) {
                console.error('Failed to fetch user:', error);
            }
        };

        fetchUser();
    }, [user?.id]);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = event.target.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('userId', user?.id.toString() || '');
            try {
                const response = await axios.post(
                    '/api/auth/upload_profile_picture',
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    },
                );

                if (response.data.user && user?.id) {
                    setUser({
                        ...user,
                        profilePicture: response.data.user.profilePicture,
                    });
                    setUserState({
                        ...user,
                        profilePicture: response.data.user.profilePicture,
                    });
                    enqueueSnackbar('Successfully uploaded profile picture', {
                        variant: 'success',
                    });
                }
            } catch (error) {
                console.error('Failed to upload profile picture:', error);
                enqueueSnackbar('Failed to upload profile picture', {
                    variant: 'error',
                });
            }
        }
    };

    if (!user) {
        return <Typography variant="h6">User not found</Typography>;
    }

    return (
        <>
            <Navbar />
            <Container className="flex flex-col items-center mt-5 min-h-screen py-5">
                <Box position="relative" className="mb-4" display="inline-flex">
                    <Avatar
                        src={
                            userState?.profilePicture
                                ? `/api/images/${userState.profilePicture}`
                                : undefined
                        }
                        alt="User profile picture"
                        className="w-24 h-24 mb-5 rounded-full"
                    />
                </Box>

                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                />

                <Typography
                    variant="h4"
                    component="h1"
                    gutterBottom
                    className="text-2xl font-bold mb-2"
                >
                    User Details
                </Typography>
                <Box>
                    <Typography
                        variant="h6"
                        component="h2"
                        className="text-xl mb-1"
                    >
                        Name: {user.name}
                    </Typography>
                    <Typography
                        variant="h6"
                        component="h2"
                        className="text-xl mb-1"
                    >
                        Email: {user.email}
                    </Typography>
                </Box>
            </Container>
        </>
    );
}

export async function getServerSideProps(context: any) {
    const { req, res } = context;

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
