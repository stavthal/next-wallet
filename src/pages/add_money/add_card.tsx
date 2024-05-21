import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {Button, Container, TextField, Typography} from '@mui/material';
import axios from 'axios';
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import RequireAuth from "@/components/RequireAuth";

const validationSchema = Yup.object({
    cardNumber: Yup.string().required('Required').matches(/^[0-9 ]{19}$/, 'Card number must be 16 digits'),
    expiryDate: Yup.string().required('Required').matches(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Expiry date must be in the format MM/YY'),
    cvv: Yup.string().required('Required').matches(/^\d{3}$/, 'CVV must be 3 digits'),
});

function AddCard() {
    const { user } = useAuth();
    const router = useRouter();

    const handleAddCard = async (values) => {
        try {
            // Randomly assign a card brand (VISA or MASTERCARD)
            const brands = ['VISA', 'MASTERCARD'];
            const brand = brands[Math.floor(Math.random() * brands.length)];

            // Randomly assign a card type (DEBIT or CREDIT)
            const types = ['DEBIT', 'CREDIT'];
            const cardType = types[Math.floor(Math.random() * types.length)];

            // Merge the randomly assigned brand and card type with the rest of the form values
            const cardData = { ...values, brand, cardType };

            await axios.post('/api/cards', cardData);
            alert('Card added successfully');
            router.back();
        } catch (error) {
            alert('Failed to add card');
        }
    };

    return (
        <Container className="flex flex-col gap-4">
            <Typography className="mt-4" variant="h4" component="h1" gutterBottom>
                Add Card
            </Typography>
            <Formik
                initialValues={{ cardNumber: '', expiryDate: '', cvv: '' }}
                validationSchema={validationSchema}
                onSubmit={handleAddCard}
            >
                {({ errors, touched, setFieldValue }) => (
                    <Form>
                        <div className="flex flex-col gap-4">
                            <Field name="cardNumber" as={TextField} label="Card Number" fullWidth error={errors.cardNumber && touched.cardNumber} helperText={<ErrorMessage name="cardNumber" />}
                                   onChange={(event) => {
                                       let value = event.target.value.replace(/\D/g, "");
                                       if (value.length > 16) {
                                           value = value.slice(0, 16);
                                       }
                                       value = value.replace(/(.{4})/g, "$1 ").trim();
                                       setFieldValue('cardNumber', value);
                                   }}
                            />
                            <Field name="expiryDate" as={TextField} label="Expiry Date" fullWidth error={errors.expiryDate && touched.expiryDate} helperText={<ErrorMessage name="expiryDate" />}
                                   onChange={(event) => {
                                       let value = event.target.value.replace(/\D/g, "");
                                       if (value.length > 4) {
                                           value = value.slice(0, 4);
                                       }
                                       if (value.length === 2 && parseInt(value) > 12) {
                                           value = `01/${value[1]}`;
                                       } else if (value.length > 2) {
                                           value = value.replace(/(.{2})/, "$1/");
                                       }
                                       setFieldValue('expiryDate', value);
                                   }}
                            />
                            <Field name="cvv" as={TextField} label="CVV" fullWidth error={errors.cvv && touched.cvv} helperText={<ErrorMessage name="cvv" />}
                                   onChange={(event) => {
                                       let value = event.target.value.replace(/\D/g, "");
                                       if (value.length > 3) {
                                           value = value.slice(0, 3);
                                       }
                                       setFieldValue('cvv', value);
                                   }}
                            />
                        </div>
                        <Button type="submit" variant="contained" fullWidth className="mt-4">
                            Add Card
                        </Button>
                        <Button className="mt-2" variant="outlined" onClick={() => router.back()} fullWidth>
                            Cancel
                        </Button>
                    </Form>
                )}
            </Formik>
        </Container>
    );
}

export default RequireAuth(AddCard);