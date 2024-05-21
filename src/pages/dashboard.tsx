import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import RequireAuth from "@/components/RequireAuth";
import { Container, Typography, Avatar, Button } from "@mui/material";

import React from 'react';
import {useRouter} from "next/router";

function Dashboard() {
    const { user } = useAuth();
    const router  = useRouter();

    return (
        <>
            <Navbar />
            <Container>
                <Container className="p-0 m-0 mt-4 flex justify-between">
                    <Typography variant="h4" component="h1" gutterBottom className="border-b-2">
                        Welcome, {user?.name}
                    </Typography>
                    {/*<Avatar alt={user?.name} src={user?.profilePicture} />*/}
                </Container>
                <Typography variant="h6" component="h2" gutterBottom className="mt-10">
                    Account Balance:
                </Typography>

                <Container className="p-8 m-0 mb-10 border-2 rounded-2xl shadow-xl">
                    <Typography variant="h1" component="h2">
                        $ {user?.totalMoney?.toFixed(2)}
                    </Typography>
                </Container>
                <Container className="ml-0 mt-4 pl-0 pt-4 border-t-2 flex flex-row">
                    <Button onClick={() => router.push('/add_money/card_in')} variant="contained" className="rounded-full" color="primary">
                        Add Money
                    </Button>
                    <Button variant="outlined"className="rounded-full ml-4" color="primary">
                        Withdraw Money
                    </Button>
                </Container>
            </Container>
        </>
    );
}

export default RequireAuth(Dashboard);