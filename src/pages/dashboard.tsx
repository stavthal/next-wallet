import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import RequireAuth from '@/components/RequireAuth';
import { Container, Typography, Avatar, Button } from '@mui/material';

import React, { useState, useLayoutEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import RecentTransactions from '@/components/dashboard/recentTransactions/RecentTransactions';
import { User } from '@prisma/client';

function Dashboard() {
    const { user, setUser } = useAuth();
    const [userState, setUserState] = useState<User | any>();
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useLayoutEffect(() => {
        const fetchUserDetails = async () => {
            try {
                setLoading(true);
                const response = await axios.post(`/api/auth/get_user`, {
                    userId: user?.id,
                });
                setUserState(response.data);
            } catch (error) {
                console.error('Failed to fetch user details:', error);
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 1000); // just to show skeletons for a bit longer
            }
        };

        fetchUserDetails();
    }, [user]); // Listen for changes to user?.id

    return (
        <>
            <Navbar />
            <Container>
                <Container className="p-0 m-0 mt-4 flex justify-between">
                    <Typography
                        variant="h4"
                        component="h1"
                        gutterBottom
                        className="border-b-2"
                    >
                        Welcome, {userState?.name}
                    </Typography>
                </Container>
                <Typography
                    variant="h6"
                    component="h2"
                    gutterBottom
                    className="mt-10"
                >
                    Account Balance:
                </Typography>

                <Container className="flex flex-row p-8 m-0 mb-10 border-2 rounded-2xl shadow-xl">
                    {
                        <Typography
                            variant="h1"
                            component="h2"
                            className="flex flex-row max-md: text-2xl"
                        >
                            {loading ? (
                                <Skeleton width={100} />
                            ) : user ? (
                                `${userState?.totalMoney.toFixed(2)} €`
                            ) : null}
                        </Typography>
                    }
                </Container>
                <Container className="ml-0 mt-4 pl-0 pt-4 border-t-2 flex flex-row">
                    <Button
                        onClick={() => router.push('/add_funds/card_in')}
                        variant="contained"
                        className="rounded-full"
                        color="primary"
                    >
                        Add Money
                    </Button>
                    <Button
                        onClick={() => router.push('/withdraw_funds/overview')}
                        variant="outlined"
                        className="rounded-full ml-4"
                        color="primary"
                    >
                        Withdraw Money
                    </Button>
                </Container>

                <RecentTransactions
                    transactions={userState?.transactions || []}
                    loading={loading}
                />
            </Container>
        </>
    );
}

export default RequireAuth(Dashboard);
