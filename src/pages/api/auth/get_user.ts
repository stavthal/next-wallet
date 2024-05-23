// File: pages/api/get_user.js

import { PrismaClient } from '@prisma/client';
import {NextApiRequest, NextApiResponse} from "next";

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { userId } = req.body;

        // Fetch the user from the database
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { transactions: true },
        });

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.status(200).json(user);
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}