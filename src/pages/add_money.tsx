import RequireAuth  from '../components/RequireAuth';
import {Button, Container, Typography} from "@mui/material";
import Navbar from "@/components/Navbar";
import {useAuth} from "@/context/AuthContext";
import CardComponent from "@/components/CardComponent";

const AddMoney = () => {
    const { user } = useAuth();

    return (
        <>
            <Navbar />
            <Container>
                <Typography
                    component="h1"
                    variant="h2"
                    className="mt-4 border-b-2"
                >
                    Add Money
                </Typography>

                {/* Cards Container */}
                {user?.cards?.length === 0 ?
                    <Typography className="mt-2">You have no cards in your account.</Typography>
                    :
                    user?.cards?.map(
                    (card, index) => (
                        <CardComponent
                            cardNumber={card.cardNumber}
                            expiryDate={new Date(card.expiryDate)}
                            brand={card.brand}
                            cardType={card.cardType}
                            cvv={card.cvv}
                            key={card.id}
                        />)
                )}
                <Button variant="contained" color="primary" className="mt-4">
                    Add New Card
                </Button>
            </Container>
        </>
    )


}

export default RequireAuth(AddMoney);