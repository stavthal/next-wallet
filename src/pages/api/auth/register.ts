// src/pages/api/auth/register.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from "@/util/auth";
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
    email: any;
    password: any;
    name: any;
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
    try {
        upload.single('profilePicture')(req as any, res as any, async (err) => {
            if (err) {
                console.error('Error uploading file:', err);
                return res.status(500).json({error: 'Failed to upload file'});
            }

            const {email, password, name} = (req as MulterRequest).body;

            if (!email || !password) {
                return res.status(400).json({error: 'Email and password are required'});
            }

            try {
                const hashedPassword = await hashPassword(password as string);

                const user = await prisma.user.create({
                    data: {
                        email: email as string,
                        password: hashedPassword,
                        name: name as string,
                        profilePicture: (req as MulterRequest).file
                            ? `/uploads/${path.basename((req as MulterRequest).file.path)}`
                            : null,
                    },
                });

                res.status(201).json({message: 'User created', user});
            } catch (error) {
                console.error('Error registering user:', error);
                res.status(500).json({error: error, errorMessage: 'User creation failed'});
            }
        });
    } catch (error) {
        console.error(error);
    }
}