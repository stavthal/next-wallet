import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {Box, Container, Typography} from '@mui/material';
import TransactionItem from '../../TransactionItem';
import {useAuth} from "@/context/AuthContext";

const RecentTransactions: React.FC = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    const { user } = useAuth();

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axios.get('/api/get_transactions', { params: { userId: user?.id } });
                setTransactions(response.data);
            } catch (err) {
                console.error(err);
                setLoading(false);
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, (1000)); // to show skeletons a bit longer
            }
        };

        fetchTransactions();
    }, [user?.id]);

    if (loading) {
        return (
            <Box className="max-md:max-w-full md:w-3/5  custom-scrollbar border-2 rounded-xl p-4 mt-10 max-h-50" style={{ height: '300px', maxHeight: '300px', overflow: 'auto' }}>
                <Container className="pl-0 content-start items-start">
                    {Array(3).fill(null).map((_, index) => (
                        <TransactionItem key={index} loading={loading} />
                    ))}
                </Container>
            </Box>
        )
    }

    if (!transactions.length) {
        return (
            <Box className="max-md:max-w-full md:w-3/5  custom-scrollbar border-2 rounded-xl p-4 mt-10 max-h-50" style={{ height: '300px', maxHeight: '300px', overflow: 'auto' }}>
                <Container className="pl-0 content-start items-start">
                    <Typography variant="h6" component="h2" gutterBottom>
                        No transactions found
                    </Typography>
                </Container>
            </Box>
        );
    }
    return (
        <Box className="max-md:max-w-full md:w-3/5  custom-scrollbar border-2 rounded-xl p-4 mt-10 max-h-50" style={{ height: '300px', maxHeight: '300px', overflow: 'auto' }}>
            <Container className="pl-0 content-start items-start">
                {transactions.slice(0, 10).map((transaction, index) => (
                    <TransactionItem key={index} transaction={transaction} loading={loading} />
                ))}
            </Container>
        </Box>
    );
}

export default RecentTransactions;