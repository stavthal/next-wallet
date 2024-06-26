import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, Container, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import { enqueueSnackbar } from 'notistack';
import jwt from 'jsonwebtoken';

const validationSchema = Yup.object({
    cardNumber: Yup.string()
        .required('Required')
        .matches(/^[0-9 ]{19}$/, 'Card number must be 16 digits'),
    expiryDate: Yup.string()
        .required('Required')
        .matches(
            /^(0[1-9]|1[0-2])\/\d{2}$/,
            'Expiry date must be in the format MM/YY',
        ),
    cvv: Yup.string()
        .required('Required')
        .matches(/^\d{3}$/, 'CVV must be 3 digits'),
});

interface CardFormValues {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
}

export default function AddCard() {
    const { user } = useAuth();
    const router = useRouter();

    const handleAddCard = async (values: CardFormValues) => {
        try {
            // Determine the card brand (VISA or MASTERCARD) based on the first digit (should be in backend)
            let brand;
            if (values.cardNumber.startsWith('4')) {
                brand = 'VISA';
            } else if (values.cardNumber.startsWith('5')) {
                brand = 'MASTERCARD';
            } else {
                brand = 'GENERIC';
            }

            // Randomly assign a card type (DEBIT or CREDIT)
            const types = ['DEBIT', 'CREDIT'];
            const cardType = types[Math.floor(Math.random() * types.length)];

            // Merge the determined brand and card type with the rest of the form values
            const cardData = { ...values, brand, cardType, userId: user?.id };

            await axios.post('/api/add_card', cardData);
            enqueueSnackbar('Successfully added card', { variant: 'success' });
            router.back();
        } catch (error) {
            enqueueSnackbar('Failed to add card', { variant: 'error' });
        }
    };

    return (
        <Container className="flex flex-col gap-4">
            {/* TODO: Add an icon to make it more nice*/}
            <Typography
                className="mt-4"
                variant="h4"
                component="h1"
                gutterBottom
            >
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
                            <Field
                                name="cardNumber"
                                as={TextField}
                                label="Card Number"
                                fullWidth
                                error={errors.cardNumber && touched.cardNumber}
                                helperText={<ErrorMessage name="cardNumber" />}
                                onChange={(event: any) => {
                                    let value = event.target.value.replace(
                                        /\D/g,
                                        '',
                                    );
                                    if (value.length > 16) {
                                        value = value.slice(0, 16);
                                    }
                                    value = value
                                        .replace(/(.{4})/g, '$1 ')
                                        .trim();
                                    setFieldValue('cardNumber', value);
                                }}
                            />
                            <Field
                                name="expiryDate"
                                as={TextField}
                                label="Expiry Date"
                                fullWidth
                                error={errors.expiryDate && touched.expiryDate}
                                helperText={<ErrorMessage name="expiryDate" />}
                                onChange={(event: any) => {
                                    let value = event.target.value.replace(
                                        /\D/g,
                                        '',
                                    );
                                    if (value.length > 4) {
                                        value = value.slice(0, 4);
                                    }
                                    if (
                                        value.length === 2 &&
                                        parseInt(value) > 12
                                    ) {
                                        value = `01/${value[1]}`;
                                    } else if (value.length > 2) {
                                        value = value.replace(/(.{2})/, '$1/');
                                    }
                                    setFieldValue('expiryDate', value);
                                }}
                            />
                            <Field
                                name="cvv"
                                as={TextField}
                                label="CVV"
                                fullWidth
                                error={errors.cvv && touched.cvv}
                                helperText={<ErrorMessage name="cvv" />}
                                onChange={(event: any) => {
                                    let value = event.target.value.replace(
                                        /\D/g,
                                        '',
                                    );
                                    if (value.length > 3) {
                                        value = value.slice(0, 3);
                                    }
                                    setFieldValue('cvv', value);
                                }}
                            />
                        </div>
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            className="mt-4"
                        >
                            Add Card
                        </Button>
                        <Button
                            className="mt-2"
                            variant="outlined"
                            onClick={() => router.back()}
                            fullWidth
                        >
                            Cancel
                        </Button>
                    </Form>
                )}
            </Formik>
        </Container>
    );
}

export async function getServerSideProps(context: any) {
    const { req, res } = context;

    const auth = await isAuthenticated(req);

    if (!auth) {
        res.setHeader('location', '/login');
        res.statusCode = 302;
        res.end();
        return { props: {} };
    }

    return {
        props: {},
    };
}

async function isAuthenticated(req: any) {
    const token = req.cookies.token;
    const JWT_SECRET = process.env.JWT_SECRET!;

    if (!token) {
        return false;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        return true;
    } catch (err) {
        return false;
    }
}
