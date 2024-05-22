import React from 'react';
import {Card, CardContent, Container, Typography} from '@mui/material';
import { Card as CardType } from '@prisma/client';
import Image from 'next/image';
import VisaIcon from '@/../public/icons/visaIcon.png';
import MastercardIcon from '@/../public/icons/mastercardIcon.png';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import {useRouter} from "next/router";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';



interface CardProps {
    card: CardType;
    loading: boolean;
}

const CardComponent: React.FC<CardProps> = ({ card, loading }) => {
    const cardType = card?.cardType.charAt(0).toUpperCase() + card?.cardType.slice(1).toLowerCase();
    const router = useRouter();


    const handleAddMoney = () => {
        router.push({
            pathname: '/add_funds/add_funds',
            query: { cardNumber: card?.cardNumber },
        });
    }

    if (loading) {
        return (
            <Card className="cursor-pointer my-4 shadow-xl border-2 rounded-xl">
                <CardContent>
                    <Skeleton height={30} width={300}/>
                    <Skeleton height={20} width={50} className="mt-3 mb-2" />
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
                    {card?.cardNumber}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {card?.brand !== 'GENERIC' ? (
                        card?.brand === 'VISA' ?
                            <Image src={VisaIcon} width={50} height={50} alt="Visa" />
                            :
                            <Image src={MastercardIcon} width={50} height={50} alt="Mastercard" />
                    ) :
                        <Container className="ml-0 pl-0 my-3.5">
                            <CreditCardIcon sx={{height: 30 , width: 30}} />
                        </Container>
                    }
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