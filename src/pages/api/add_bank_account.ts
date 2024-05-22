import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).end();
    }

    const {
        userId,
        beneficiaryName,
        accountNumber,
        bankName,
    } = req.body;

    try {
        const bankAccount = await prisma.bankAccount.create({
            data: {
                beneficiaryName,
                accountNumber,
                bankName,
                userId,
            },
        });

        res.status(200).json(bankAccount);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add card' });
    }
}