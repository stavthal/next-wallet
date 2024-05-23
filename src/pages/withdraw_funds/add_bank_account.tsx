import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, Container, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import RequireAuth from '@/components/RequireAuth';
import { enqueueSnackbar } from 'notistack';

const validationSchema = Yup.object({
    accountNumber: Yup.string()
        .required('Required')
        .matches(/^[0-9 ]{10}$/, 'Account number must be 10 digits'),
    bankName: Yup.string().required('Required'),
    beneficiaryName: Yup.string().required('Required'), // Add beneficiary validation
});

interface BankAccountFormValues {
    accountNumber: string;
    bankName: string;
    beneficiaryName: string;
}

function AddBankAccount() {
    const { user } = useAuth();
    const router = useRouter();

    const handleAddBankAccount = async (values: BankAccountFormValues) => {
        try {
            // Merge the form values with the user id
            const accountData = { ...values, userId: user?.id };

            await axios.post('/api/add_bank_account', accountData);
            enqueueSnackbar('Successfully added bank account', {
                variant: 'success',
            });
            router.back();
        } catch (error) {
            alert('Failed to add bank account');
            enqueueSnackbar('Failed to add bank account', { variant: 'error' });
        }
    };

    return (
        <Container className="flex flex-col gap-4">
            <Typography
                className="mt-4"
                variant="h4"
                component="h1"
                gutterBottom
            >
                Add Bank Account
            </Typography>
            <Formik
                initialValues={{
                    accountNumber: '',
                    bankName: '',
                    beneficiaryName: '',
                }} // Add beneficiary initial value
                validationSchema={validationSchema}
                onSubmit={handleAddBankAccount}
            >
                {({ errors, touched, setFieldValue }) => (
                    <Form>
                        <div className="flex flex-col gap-4">
                            <Field
                                name="accountNumber"
                                as={TextField}
                                label="Account Number"
                                fullWidth
                                error={
                                    errors.accountNumber &&
                                    touched.accountNumber
                                }
                                helperText={
                                    <ErrorMessage name="accountNumber" />
                                }
                                onChange={(event: any) => {
                                    let value = event.target.value.replace(
                                        /\D/g,
                                        '',
                                    );
                                    if (value.length > 10) {
                                        value = value.slice(0, 10);
                                    }
                                    setFieldValue('accountNumber', value);
                                }}
                            />
                            <Field
                                name="bankName"
                                as={TextField}
                                label="Bank Name"
                                fullWidth
                                error={errors.bankName && touched.bankName}
                                helperText={<ErrorMessage name="bankName" />}
                            />
                            <Field
                                name="beneficiaryName"
                                as={TextField}
                                label="Beneficiary Name"
                                fullWidth
                                error={
                                    errors.beneficiaryName &&
                                    touched.beneficiaryName
                                }
                                helperText={
                                    <ErrorMessage name="beneficiaryName" />
                                } // Add beneficiary field
                            />
                        </div>
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            className="mt-4"
                        >
                            Add Bank Account
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

export default RequireAuth(AddBankAccount);
