import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { Card as CardType } from '@prisma/client';
import Image from 'next/image';
import VisaIcon from '@/../public/icons/visaIcon.png';
import MastercardIcon from '@/../public/icons/mastercardIcon.png';
import {useRouter} from "next/router";

interface CardProps {
    card: CardType;
}

const CardComponent: React.FC<CardProps> = ({ card }) => {
    const cardType = card?.cardType.charAt(0).toUpperCase() + card?.cardType.slice(1).toLowerCase();
    const router = useRouter();


    const handleAddMoney = () => {
        router.push({
            pathname: '/add_funds/add_funds',
            query: { cardNumber: card.cardNumber },
        });
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
                    {card?.cardNumber}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {card?.brand === 'VISA' ? <Image src={VisaIcon} width={50} height={50} alt="Visa" /> : <Image src={MastercardIcon} width={50} height={50} alt="Mastercard" />}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {cardType}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    <strong>Exp. Date:</strong> {card?.expiryDate}
                </Typography>
            </CardContent>
        </Card>
    );
}

export default CardComponent;