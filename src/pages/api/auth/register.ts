import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '@/util/auth';
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
    body: {
        email: string;
        password: string;
        name: string;
    };
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
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const extension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + extension);
    },
});

const upload = multer({ storage: storage });

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    upload.single('profilePicture')(req as any, res as any, async (err) => {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            console.error('Multer Error uploading file:', err);
            return res.status(500).json({
                error: 'Multer error: Failed to upload file',
                details: err.message,
            });
        } else if (err) {
            // An unknown error occurred when uploading.
            console.error('Unknown Error uploading file:', err);
            return res.status(500).json({
                error: 'Unknown error: Failed to upload file',
                details: err.message,
            });
        }

        const reqMulter = req as MulterRequest;
        const { email, password, name } = reqMulter.body;

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
                    profilePicture: reqMulter.file
                        ? `/${reqMulter.file.filename}`
                        : null,
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
