import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { Card as CardType } from '@prisma/client';
import Image from 'next/image';
import VisaIcon from '@/../public/icons/visaIcon.png';
import MastercardIcon from '@/../public/icons/mastercardIcon.png';

interface CardProps {
    card: CardType;
}

const CardComponent: React.FC<CardProps> = ({ card }) => {
    const cardType = card?.cardType.charAt(0).toUpperCase() + card?.cardType.slice(1).toLowerCase();

    return (
        <Card className="my-4 shadow-xl border-2 rounded-xl" sx={{ maxWidth: 345 }}>
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
                {/*<Typography variant="body2" color="text.secondary">*/}
                {/*    <strong>CVV:</strong> {card?.cvv}*/}
                {/*</Typography>*/}
                <Typography variant="body2" color="text.secondary">
                    <strong>Exp. Date:</strong> {card?.expiryDate}
                </Typography>
            </CardContent>
        </Card>
    );
}

export default CardComponent;