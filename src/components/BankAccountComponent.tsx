import React from 'react';
import {Card, CardContent, Typography} from '@mui/material';
import { BankAccount as BankAccountType } from '@prisma/client'; // Replace with your BankAccount type
import {useRouter} from "next/router";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'; // Bank icon

interface BankAccountProps {
    account: BankAccountType;
    loading: boolean;
}

const BankAccountComponent: React.FC<BankAccountProps> = ({ account, loading }) => {
    const router = useRouter();

    const handleAddMoney = () => {
        router.push({
            pathname: '/withdraw_funds/withdraw_funds',
            query: { accountId: account?.id }, // Replace with your account id field
        });
    }

    if (loading) {
        return (
            <Card className="cursor-pointer my-4 shadow-xl border-2 rounded-xl">
                <CardContent>
                    <Skeleton height={30} width={260}/>
                    <Skeleton height={20} width={40}/>
                    <Skeleton height={20} width={120}/>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card
            onClick={handleAddMoney}
            className="cursor-pointer my-4 shadow-xl border-2 rounded-xl"
            sx={{
                maxWidth: 345,
                transition: 'transform 0.3s',
                '&:hover': {
                    transform: 'scale(1.05)'
                }
            }}
        >
            <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                    {account?.accountNumber}
                </Typography>
                <Typography variant="body2" sx={{marginBottom: 2,marginTop: 1}}color="text.secondary">
                    <AccountBalanceIcon sx={{height: 30 , width: 30}} />
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {account?.bankName}
                </Typography>
            </CardContent>
        </Card>
    );
}

export default BankAccountComponent;