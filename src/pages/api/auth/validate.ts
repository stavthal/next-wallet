// pages/api/auth/validate.js
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    try {
        const token = req.cookies.token; // Assuming your token is stored in a cookie named 'token'
        if (!token) {
            return res
                .status(401)
                .json({ error: 'No authentication token found' });
        }

        const JWT_SECRET = process.env.JWT_SECRET!;

        const decoded: any = jwt.verify(token, JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        // Optionally, fetch user details from the database
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId }, // Assuming 'userId' is stored in the token
            select: {
                id: true,
                email: true,
                name: true,
                profilePicture: true,
                totalMoney: true,
                bankAccounts: true,
                cards: true,
                transactions: true,
            },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (error: any) {
        console.error('Authentication validation error:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: error.message,
        });
    }
}
