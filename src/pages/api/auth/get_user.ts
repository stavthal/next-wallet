// File: pages/api/get_user.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handle(req, res) {
    if (req.method === 'POST') {
        const { userId } = req.body;

        // Fetch the user from the database
        const user = await prisma.user.findUnique({
            where: { id: userId },
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