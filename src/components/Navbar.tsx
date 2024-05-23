// src/components/Navbar.tsx
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Button,
    Menu,
    MenuItem,
    Avatar,
} from '@mui/material';
import { useEffect, useState } from 'react';

import profileImage from '../media/dummy-profile-pic.png';
import nextLogo from '@/media/next-wallet-logo-white.webp';
import { colors } from '@/util/theme';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function Navbar() {
    const router = useRouter();
    const { user, logout } = useAuth();
    const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    useEffect(() => {
        const fetchProfilePic = async () => {
            try {
                const response = await axios.post('/api/auth/get_user', {
                    userId: user?.id,
                });
                setProfilePicUrl(response.data.profilePicture);
            } catch (error) {
                console.error('Failed to fetch user:', error);
            }
        };

        if (user) {
            fetchProfilePic();
        }
    }, [user?.profilePicture]);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2, color: '#fff' }}
                >
                    <Link href="/">
                        <Image
                            src={nextLogo}
                            alt="logo"
                            className="rounded-full my-2"
                            width={60}
                            height={60}
                        />
                    </Link>
                </IconButton>
                <Typography
                    variant="h6"
                    component="div"
                    className="max-md:invisible"
                    sx={{ flexGrow: 1 }}
                >
                    Next Wallet
                </Typography>
                {user ? (
                    <>
                        <Button color="inherit" onClick={handleClick}>
                            <Avatar
                                src={
                                    profilePicUrl
                                        ? `/api/images/${profilePicUrl}`
                                        : undefined
                                }
                                alt="User profile picture"
                                className="w-14 h-14 my-5 rounded-full"
                            />
                        </Button>
                        <Menu
                            id="simple-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem
                                onClick={() => router.push('/account/details')}
                            >
                                My Account
                            </MenuItem>
                            <MenuItem onClick={logout}>Logout</MenuItem>
                        </Menu>
                    </>
                ) : (
                    <>
                        <Link href="/login" passHref>
                            <Button
                                variant="contained"
                                color="secondary"
                                className="mr-3"
                                sx={{
                                    backgroundColor: '#fff',
                                    color: colors.primary,
                                }}
                            >
                                Login
                            </Button>
                        </Link>
                        <Link href="/register" passHref>
                            <Button variant="outlined" color="secondary">
                                Register
                            </Button>
                        </Link>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
}
