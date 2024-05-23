import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import multer, { StorageEngine } from 'multer';
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
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Custom storage configuration
const storage: StorageEngine = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Generate a unique filename with the original extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + extension);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        // Accept image files only
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error("Unsupported file type"), false);
        }
        cb(null, true);
    },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).end('Method Not Allowed');
    }

    upload.single('file')(req as any, res as any, async (err: any) => {
        if (err) {
            console.error('Error uploading file:', err);
            return res.status(500).json({ error: 'Failed to upload file', message: err.message });
        }

        const reqMulter = req as MulterRequest;
        if (!reqMulter.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        try {
            const profilePicture = `/uploads/${reqMulter.file.filename}`;

            const user = await prisma.user.update({
                where: { id: Number(userId) },
                data: { profilePicture },
            });

            res.status(200).json({ message: 'Profile picture updated', user });
        } catch (error) {
            console.error('Error updating profile picture:', error);
            res.status(500).json({ error: 'Profile picture update failed', details: error.message });
        }
    });
}
