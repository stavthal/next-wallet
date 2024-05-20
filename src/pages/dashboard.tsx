import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import RequireAuth from "@/components/RequireAuth";
import { Container, Typography, Avatar, Button } from "@mui/material";

import React from 'react';

function Dashboard() {
    const { user } = useAuth();

    return (
        <>
            <Navbar />
            <Container>
                <Container className="p-0 m-0 mt-4 flex justify-between">
                    <Typography variant="h4" component="h1" gutterBottom>
                        Welcome, {user?.name}
                    </Typography>
                    {/*<Avatar alt={user?.name} src={user?.profilePicture} />*/}
                </Container>
                <Typography variant="h6" component="h2" gutterBottom className="mt-10">
                    Account Balance:
                </Typography>

                <Container className="p-8 m-0 mb-10 border-2 rounded-2xl shadow-xl">
                    <Typography variant="h1" component="h2">
                        $ {user?.totalMoney.toFixed(2)}
                    </Typography>
                </Container>
                <Button variant="contained" size={"large"} className="rounded-full" color="primary">
                    + Add Money
                </Button>
            </Container>
        </>
    );
}

export default RequireAuth(Dashboard);