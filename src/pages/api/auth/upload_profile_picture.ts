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

const uploadDir = path.join(process.cwd(), 'data/uploads');

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
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const extension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + extension);
    },
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        // Accept image files only
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
            // @ts-ignore
            cb(new Error('Unsupported file type'), false);
        } else {
            cb(null, true);
        }
    },
});

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }

    upload.single('file')(req as any, res as any, async (err: any) => {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            console.error('Multer Error uploading file:', err);
            res.status(500).json({
                error: 'Multer error: Failed to upload file',
                details: err.message,
            });
            return;
        } else if (err) {
            // An unknown error occurred when uploading.
            console.error('Unknown Error uploading file:', err);
            res.status(500).json({
                error: 'Unknown error: Failed to upload file',
                details: err.message,
            });
            return;
        }

        const reqMulter = req as MulterRequest;
        if (!reqMulter.file) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }

        const { userId } = req.body;
        if (!userId) {
            res.status(400).json({ error: 'User ID is required' });
            return;
        }

        try {
            const profilePicture = `/${reqMulter.file.filename}`;

            const user = await prisma.user.update({
                where: { id: Number(userId) },
                data: { profilePicture },
            });

            res.status(200).json({ message: 'Profile picture updated', user });
        } catch (error) {
            console.error('Error updating profile picture:', error);
            res.status(500).json({
                error: 'Profile picture update failed',
                // @ts-ignore
                details: error.message,
            });
        }
    });
}
