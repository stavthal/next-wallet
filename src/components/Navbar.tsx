// src/components/Navbar.tsx
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { AppBar, Toolbar, IconButton, Typography, Button, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';

import profileImage from '../../public/dummy-profile-pic.png';
import {theme, colors } from "@/util/theme";
import {useRouter} from "next/router";
import {User} from "@prisma/client";

export default function Navbar() {
    const router = useRouter();
    const { user, logout } = useAuth();
    const [userData, setUserData] = useState<User | null>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                    <Link href="/">
                        <Image
                            src="/next-wallet-logo-white.webp"
                            alt="logo"
                            className="rounded-full my-2"
                            width={60}
                            height={60}
                        />
                    </Link>
                </IconButton>
                <Typography variant="h6" component="div" className="max-md:invisible" sx={{ flexGrow: 1 }}>
                    Next Wallet
                </Typography>
                {userData ? (
                    <>
                        <Button color="inherit" onClick={handleClick}>
                            <Image
                                src={userData?.profilePicture ? userData.profilePicture : profileImage}
                                alt="profile"
                                width={50}
                                height={50}
                                style={{width: 50, height: 50}}
                                className="rounded-full"
                            />
                        </Button>
                        <Menu
                            id="simple-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={() => router.push('/account/details')}>My Account</MenuItem>
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
                                sx={{backgroundColor: '#fff', color: colors.primary }}
                            >
                                Login
                            </Button>
                        </Link>
                        <Link href="/register" passHref>
                            <Button
                                variant="outlined"
                                color="secondary"
                            >
                                Register
                            </Button>
                        </Link>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
}