import { PrismaClient } from '@prisma/client';
import {NextApiRequest, NextApiResponse} from "next";

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { userId, amount, type, date, last_digits } = req.body;

        // Fetch the user from the database
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        // Update the user's balance
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { totalMoney: user.totalMoney + parseFloat(amount) },
        });

        // Create a new transaction
        const newTransaction = await prisma.transaction.create({
            data: {
                userId: userId,
                amount: parseFloat(amount),
                status: 'COMPLETED',
                type: type,
                description: 'Top-up with card',
                date: new Date(date),
                last_digits: last_digits,
            },
        });

        res.status(200).json({ user: updatedUser, transaction: newTransaction });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}