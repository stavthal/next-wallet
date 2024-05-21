import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).end();
    }

    const { userId } = req.query;

    try {
        const cards = await prisma.card.findMany({
            where: {
                userId: Number(userId),
            },
        });

        res.status(200).json(cards);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch cards' });
    }
}