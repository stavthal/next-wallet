// src/pages/api/auth/login.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { verifyPassword, generateToken } from "../../../util/auth";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).end();
    }

    const { email, password } = req.body;

    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
        throw new Error('Missing JWT_SECRET environment variable');
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                bankAccounts: true,
                cards: true,
                transactions: true,
            }
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isValid = await verifyPassword(password, user.password);

        if (!isValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign(
            {
                userId: user.id,
                name: user.name,
                email: user.email,
                profilePicture: user.profilePicture,
                totalMoney: user.totalMoney,
                bankAccounts: user?.bankAccounts,
                cards: user?.cards,
                transactions: user?.transactions,
            }, JWT_SECRET);


        res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Login failed' });
    }
}
