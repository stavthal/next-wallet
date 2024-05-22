import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).end();
    }

    const { userId, brand, cardType, cardNumber, expiryDate, cvv } = req.body;

    try {
        const card = await prisma.card.create({
            data: {
                brand,
                cardType,
                cardNumber,
                expiryDate,
                cvv,
                userId,
            },
        });

        res.status(200).json(card);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add card' });
    }
}