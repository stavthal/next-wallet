import { Box, Typography, Skeleton } from '@mui/material';
import { green, red } from '@mui/material/colors';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import {DateTime} from "next-auth/providers/kakao";

interface TransactionItemProps {
    transaction?: {
        id: number;
        amount: number;
        type: 'DEPOSIT' | 'WITHDRAW';
        date: DateTime;
        description: String;
    };
    loading: boolean;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, loading }) => {
    // Create a new Date object from the transaction date
    const date = transaction?.date ? new Date(transaction.date) : null;

    // Format the date using toLocaleDateString
    const formattedDate = date?.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <Box display="flex" className="flex flex-row border-b-2 gap-2 pt-2 pb-2" alignItems="center" mb={2}>
            <Typography className="w-1/12">
            { loading ? <Skeleton variant="circular" width={20} height={20} /> :
                transaction?.type === 'DEPOSIT'
                    ? <AccountBalanceWalletIcon/>
                    : <AccountBalanceIcon />
            }
            </Typography>
            <Typography className="font-bold max-md:text-sm w-5/12" variant="body1">
                {loading ? <Skeleton width={100} /> : transaction?.description}
            </Typography>
            <Typography className="text-gray-600 font-light max-md:text-sm w-3/12">
                {loading ? <Skeleton width={70} /> : `on ${formattedDate}`}
            </Typography>

            <Typography className="text-sm md:text-base font-medium ml-2 w-3/12" align={"right"} color={transaction?.type === 'DEPOSIT' ? green[500] : red[500]}>
                {loading ? <Skeleton width={30} /> : `${transaction?.type === 'DEPOSIT' ? '+' : '-'}${transaction?.amount} €`}
            </Typography>
        </Box>
    );
}

export default TransactionItem;