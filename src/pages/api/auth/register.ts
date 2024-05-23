import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '@/util/auth';

const prisma = new PrismaClient();


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res
                .status(400)
                .json({ error: 'Email, password, and name are required' });
        }

        try {
            const hashedPassword = await hashPassword(password);

            const user = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                    profilePicture: null,
                },
            });

            res.status(201).json({ message: 'User created', user });
        } catch (error: any) {
            console.error('Error registering user:', error);
            res.status(500).json({
                error: 'User creation failed',
                details: error.message,
            });
        }
    });
}
