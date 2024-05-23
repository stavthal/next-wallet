import { useEffect, useState } from 'react';
import { Button, Container, Typography, IconButton } from '@mui/material';
import { theme } from '@/util/theme';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import BankAccountComponent from '@/components/BankAccountComponent';
import { useRouter } from 'next/router';
import axios from 'axios';
import BackButton from '@/components/BackButton';
import BankIcon from '@mui/icons-material/AccountBalance';
import jwt from 'jsonwebtoken';

export default function BankAccounts() {
    const { user } = useAuth();
    const router = useRouter();
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `/api/get_bank_accounts?userId=${user?.id}`,
                );
                setAccounts(response.data);
                setTimeout(() => {
                    setLoading(false);
                }, 1200); // To simulate loading and show the skeletons
            } catch (error) {
                setLoading(false);
                console.error('Failed to fetch accounts:', error);
            }
        };

        fetchAccounts();
    }, []);

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
                    Bank Accounts
                </Typography>
                <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-4 ">
                    {loading
                        ? Array.from({ length: 3 }).map((_, index) => (
                              <BankAccountComponent
                                  loading={loading}
                                  key={index}
                              />
                          ))
                        : accounts.map((account, index) => (
                              <BankAccountComponent
                                  account={account}
                                  loading={loading}
                                  key={index}
                              />
                          ))}
                </div>
                <Container className="flex flex-row items-center ml-0 pl-0 pb-4 mt-10">
                    <IconButton
                        className="mr-2 text-white"
                        onClick={() =>
                            router.push('/withdraw_funds/add_bank_account')
                        }
                        sx={{
                            backgroundColor: theme.palette.primary.main,
                            '&:hover': {
                                backgroundColor: theme.palette.primary.light,
                            },
                        }}
                    >
                        <BankIcon />
                    </IconButton>
                    <Typography>Add Account</Typography>
                </Container>
            </Container>
        </>
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
