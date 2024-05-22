import { useState } from 'react';
import { Button, Container, TextField, Typography } from "@mui/material";
import { useAuth } from "@/context/AuthContext";
import axios from 'axios';
import { useRouter } from 'next/router';

const AddMoney = () => {
    const { user } = useAuth();
    const router = useRouter();
    const cardNumber = router.query.cardNumber;
    const maskedCardNumber = cardNumber ? `**** **** **** ${cardNumber.slice(-4)}` : '';

    const [amount, setAmount] = useState('');

    const handleAmountChange = (e) => {
        const value = e.target.value;
        if (!isNaN(value)) {
            setAmount(value);
        }
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
                alert('Money added successfully');
                router.push('/dashboard');
            } else {
                alert('Failed to add money');
            }
        } catch (error) {
            console.error('Failed to add money:', error);
        }
    };

    return (
        <Container className="flex flex-col gap-4">
            <Typography
                component="h1"
                variant="h2"
                className="mt-4 border-b-2"
            >
                Complete Top Up
            </Typography>
            <Typography
                component="h2"
                variant="h5"
                className="mt-4"
            >
                Card: {maskedCardNumber}
            </Typography>
            <TextField
                label="Amount"
                value={amount}
                onChange={handleAmountChange}
                className="mt-4"
            />
            <Button onClick={handleAddMoney} variant="contained" color="primary" className="mt-4">
                Top Up
            </Button>
            <Button onClick={router.back} variant="outlined" color="primary">
                Back
            </Button>
        </Container>
    )
}

export default AddMoney;