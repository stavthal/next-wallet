// File: pages/api/withdraw_funds.ts

import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { userId, amount } = req.body;

        // Check if the amount is valid
        if (parseFloat(amount) <= 0) {
            res.status(400).json({ error: 'Invalid amount. Amount must be greater than zero.' });
            return;
        }

        // Fetch the user from the database
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        // Check if the user has enough funds
        if (user?.totalMoney < parseFloat(amount)) {
            res.status(202).json({ error: 'Insufficient funds' });
            return;
        }

        // Update the user's balance
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { totalMoney: user.totalMoney - parseFloat(amount) },
        });

        // Create a new transaction
        const newTransaction = await prisma.transaction.create({
            data: {
                userId: userId,
                amount: parseFloat(amount),
                status: 'COMPLETED',
                type: 'WITHDRAW',
                description: 'Withdrawal to account',
                date: new Date(),
                last_digits: 'XXXX',
            },
        });

        res.status(200).json({ user: updatedUser, transaction: newTransaction });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}