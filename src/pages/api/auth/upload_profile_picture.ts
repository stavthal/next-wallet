// src/pages/api/user/upload_profile_picture.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export const config = {
    api: {
        bodyParser: false,
    },
};

interface MulterRequest extends NextApiRequest {
    file: any;
}


const uploadDir = path.join(process.cwd(), 'public/uploads');

// Ensure the upload directory exists
fs.mkdirSync(uploadDir, { recursive: true });

// Configure multer
const upload = multer({ dest: uploadDir });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).end();
    }

    upload.single('file')(req as any, res as any, async (err: any) => {
        if (err) {
            console.error('Error uploading file:', err);
            return res.status(500).json({ error: 'Failed to upload file' });
        }

        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        try {
            const profilePicture = `/uploads/${path.basename((req as MulterRequest).file.path)}`;

            const user = await prisma.user.update({
                where: { id: Number(userId) },
                data: { profilePicture },
            });

            res.status(200).json({ message: 'Profile picture updated', user });
        } catch (error) {
            console.error('Error updating profile picture:', error);
            res.status(500).json({ error: 'Profile picture update failed' });
        }
    });
}