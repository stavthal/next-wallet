import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).end();
    }

    const { userId } = req.query;

    try {
        const bankAccounts = await prisma.bankAccount.findMany({
            where: {
                userId: Number(userId),
            },
        });

        res.status(200).json(bankAccounts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch bank accounts' });
    }
}