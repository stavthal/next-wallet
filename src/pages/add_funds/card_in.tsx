import { useEffect, useState } from 'react';
import RequireAuth  from '../../components/RequireAuth';
import {Button, Container, Typography, IconButton, Link} from "@mui/material";
import {theme} from "@/util/theme";
import Navbar from "@/components/Navbar";
import {useAuth} from "@/context/AuthContext";
import CardComponent from "@/components/CardComponent";
import {useRouter} from "next/router";
import axios from 'axios';
import AddCardIcon from '@mui/icons-material/AddCard';
import BackButton from "@/components/BackButton";
import Skeleton from 'react-loading-skeleton';


const AddMoney = () => {
    const { user } = useAuth();
    const router = useRouter();
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCards = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/api/get_cards?userId=${user?.id}`);
                setCards(response.data);
                setTimeout(() => {
                    setLoading(false);
                }, (1200)); // To simulate loading and show the skeletons
            } catch (error) {
                setLoading(false);
                console.error('Failed to fetch cards:', error);
            }
        };

        fetchCards();
    }, []);

    // @ts-ignore
    return (
        <>
            <Navbar />
            <BackButton />
            <Container>
                <Typography
                    component="h1"
                    variant="h2"
                    className="mt-4 border-b-2"
                >
                    Top Up
                </Typography>
                <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-4 ">
                    {loading ? (
                        Array.from({ length: 3 }).map((_, index) => (
                            <CardComponent
                                loading={loading}
                                key={index}
                            />
                        ))
                    ) : (
                        cards.map((card, index) => (
                            <CardComponent
                                card={card}
                                loading={loading}
                                key={index}
                            />)
                        )
                    )}
                </div>
                <Container className="flex flex-row items-center ml-0 pl-0 pb-4 mt-10">
                    <IconButton
                        className="mr-2 text-white"
                        onClick={() => router.push('/add_funds/add_card')}
                        sx={{backgroundColor: theme.palette.primary.main, '&:hover': {backgroundColor: theme.palette.primary.light}}}
                    >
                        <AddCardIcon/>
                    </IconButton>
                    <Typography>Add Card</Typography>
                </Container>
            </Container>
        </>
    )
}

export default RequireAuth(AddMoney);