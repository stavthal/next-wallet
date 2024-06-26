import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {Box, Container, Typography} from '@mui/material';
import TransactionItem from '../../TransactionItem';
import {useAuth} from "@/context/AuthContext";
import {Transaction} from "@prisma/client";

interface TransactionsProps {
    transactions: Transaction[];
    loading: boolean;
}
const RecentTransactions: React.FC<TransactionsProps> = ({transactions, loading}) => {    if (loading) {
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