import { useState } from 'react';
import {
    Button,
    Container,
    TextField,
    Typography,
    Snackbar,
    Alert,
} from '@mui/material';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { useRouter } from 'next/router';
import { enqueueSnackbar, useSnackbar } from 'notistack';

const AddMoney = () => {
    const { user } = useAuth();
    const router = useRouter();
    const cardNumber = router.query.cardNumber;
    const maskedCardNumber = cardNumber
        ? `**** **** **** ${cardNumber.slice(-4)}`
        : '';

    const [amount, setAmount] = useState<string>('');

    const handleAmountChange = (e: any) => {
        const value = e.target.value;
        if (!isNaN(value)) {
            setAmount(value);
        }
    };

    const addAmount = (num: number) => {
        setAmount((prevAmount) => {
            if (prevAmount && !isNaN(parseFloat(prevAmount))) {
                return (parseFloat(prevAmount) + num).toString();
            } else {
                return num.toString();
            }
        });
    };

    const handleAddMoney = async () => {
        try {
            const response = await axios.post(`/api/add_funds`, {
                userId: user?.id,
                amount: parseFloat(amount),
                type: 'DEPOSIT',
                date: new Date(),
                last_digits: cardNumber?.slice(-4),
            });

            if (response.status === 200) {
                await router.push('/dashboard');
                enqueueSnackbar('Successfully added money', {
                    variant: 'success',
                    autoHideDuration: 3000,
                });
            } else {
                enqueueSnackbar('Failed to add money', {
                    variant: 'error',
                });
            }
        } catch (error) {
            console.error('Failed to add money:', error);
            enqueueSnackbar('Failed to add money', {
                variant: 'error',
            });
        }
    };

    return (
        <Container className="flex flex-col gap-4">
            <Typography
                component="h1"
                variant="h2"
                className="mt-4 border-b-2 max-md:text-2xl"
            >
                Complete Top Up
            </Typography>
            <Typography
                component="h2"
                variant="h5"
                className="mt-4 italic text-lg max-md:text-xl"
            >
                Card: {maskedCardNumber}
            </Typography>
            <Container className="mx-0 px-0 flex items-center content-center gap-2">
                <Button
                    onClick={() => addAmount(5)}
                    color="primary"
                    variant="contained"
                >
                    +5
                </Button>
                <Button
                    onClick={() => addAmount(10)}
                    color="primary"
                    variant="contained"
                >
                    +10
                </Button>
                <Button
                    onClick={() => addAmount(20)}
                    color="primary"
                    variant="contained"
                >
                    +20
                </Button>
                <Button
                    onClick={() => addAmount(50)}
                    color="primary"
                    variant="contained"
                >
                    +50
                </Button>
            </Container>
            <Container className="mx-0 px-0 flex items-center content-center">
                <TextField
                    label="Amount"
                    value={amount}
                    onChange={handleAmountChange}
                    className="mt-4 max-md:w-80 w-3/12"
                />
                <Typography
                    component="h1"
                    variant="h4"
                    className="mt-4 ml-2 w-1/12"
                >
                    €
                </Typography>
            </Container>

            <Button
                onClick={handleAddMoney}
                variant="contained"
                color="primary"
                className="mt-4 w-80"
            >
                Top Up
            </Button>
            <Button
                onClick={router.back}
                variant="outlined"
                color="primary"
                className="w-80"
            >
                Back
            </Button>
        </Container>
    );
};

export default AddMoney;
