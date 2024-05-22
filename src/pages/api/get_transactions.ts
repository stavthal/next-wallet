import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const { userId } = req.query

        try {
            const transactions = await prisma.transaction.findMany({
                where: {
                    userId: Number(userId),
                },
                orderBy: {
                    date: 'desc',
                },
            })

            res.status(200).json(transactions)
        } catch (error) {
            res.status(500).json({ error: 'Unable to fetch transactions' })
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' })
    }
}