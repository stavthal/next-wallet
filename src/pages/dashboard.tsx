import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import RequireAuth from "@/components/RequireAuth";
import { Container, Typography, Avatar, Button } from "@mui/material";

import React, {useEffect} from 'react';
import {useRouter} from "next/router";
import axios from "axios";
import {User} from "@prisma/client";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';
import RecentTransactions from "@/components/dashboard/recentTransactions/RecentTransactions";
function Dashboard() {
    const { user } = useAuth();
    const router  = useRouter();
    const [userData, setUserData] = React.useState<User | null>(null);
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                setLoading(true);
                const response = await axios.post(`/api/auth/get_user`, { userId: user?.id });
                setUserData(response.data);
            } catch (error) {
                console.error('Failed to fetch user details:', error);
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 1000); // just to show skeletons for a bit longer
            }
        };

        fetchUserDetails();
    }, [user?.id]);

    return (
        <>
            <Navbar />
            <Container>
                <Container className="p-0 m-0 mt-4 flex justify-between">
                    <Typography variant="h4" component="h1" gutterBottom className="border-b-2">
                        Welcome, {user?.name}
                    </Typography>
                </Container>
                <Typography variant="h6" component="h2" gutterBottom className="mt-10">
                    Account Balance:
                </Typography>

                <Container className="flex flex-row p-8 m-0 mb-10 border-2 rounded-2xl shadow-xl">
                    {
                        <Typography variant="h1" component="h2" className="flex flex-row max-md: text-2xl">
                            {loading ?
                                <Skeleton width={100}/>
                                :
                                userData ? `${userData.totalMoney.toFixed(2)} €` : null
                            }
                        </Typography>
                    }
                </Container>
                <Container className="ml-0 mt-4 pl-0 pt-4 border-t-2 flex flex-row">
                    <Button onClick={() => router.push('/add_funds/card_in')} variant="contained" className="rounded-full" color="primary">
                        Add Money
                    </Button>
                    <Button onClick={() => router.push('/withdraw_funds/overview')} variant="outlined"className="rounded-full ml-4" color="primary">
                        Withdraw Money
                    </Button>
                </Container>

                <RecentTransactions />
            </Container>
        </>
    );
}

export default RequireAuth(Dashboard);