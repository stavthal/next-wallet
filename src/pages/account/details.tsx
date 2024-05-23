import { useEffect, useState, useRef } from 'react';
import {Box, Container, Typography, Avatar, IconButton} from '@mui/material';
import axios from 'axios';
import Navbar from "@/components/Navbar";
import {useAuth} from "@/context/AuthContext";
import {theme} from "@/util/theme";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import {useRouter} from "next/router";

interface User {
    id: string;
    name: string;
    email: string;
    profilePicture?: string;
}

export default function UserDetails() {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { user, setUser } = useAuth();
    const [userState, setUserState] = useState<any>(null);


    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.post(`/api/auth/get_user`, { userId: user?.id });
                setUserState(response.data);
            } catch (error) {
                console.error('Failed to fetch user:', error);
            }
        };

        fetchUser();
    }, [user?.id,]);

    const handleUploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('userId', user?.id.toString() || '');
            try {
                const response = await axios.post('/api/auth/upload_profile_picture', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                // Update the user state with the new profile picture
                if (response.data.user && user?.id) {
                    setUser({
                        ...user,
                        profilePicture: response.data.user.profilePicture,
                    });
                    setUserState({
                        ...user,
                        profilePicture: response.data.user.profilePicture,
                    });
                } else {
                    alert('Failed to upload profile picture');
                }
            } catch (error) {
                console.error('Failed to upload profile picture:', error);
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
                        src={userState?.profilePicture}
                        alt="User profile picture"
                        className="w-24 h-24 mb-5 rounded-full"
                    />
                    <IconButton
                        className="text-white"
                        onClick={handleUploadClick}
                        sx={{
                            position: 'absolute',
                            right: 0,
                            bottom: 0,
                            backgroundColor: theme.palette.primary.main,
                            '&:hover': {backgroundColor: theme.palette.primary.light}
                        }}
                    >
                        <EditOutlinedIcon />
                    </IconButton>
                </Box>

                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                />
                <Typography variant="h4" component="h1" gutterBottom className="text-2xl font-bold mb-2">
                    User Details
                </Typography>
                <Box>
                    <Typography variant="h6" component="h2" className="text-xl mb-1">
                        Name: {user.name}
                    </Typography>
                    <Typography variant="h6" component="h2" className="text-xl mb-1">
                        Email: {user.email}
                    </Typography>
                </Box>
            </Container>
        </>
    );
}