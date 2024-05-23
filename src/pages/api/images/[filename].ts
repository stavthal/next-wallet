// pages/api/images/[filename].js
import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const { filename }: any = req.query;
    const filePath = path.join(process.cwd(), '/data/uploads', filename);

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.status(404).send('Image not found');
            return;
        }

        const ext = path.extname(filename).toLowerCase();
        let contentType = 'image/jpeg'; // Default to jpeg
        if (ext === '.png') {
            contentType = 'image/png';
        } else if (ext === '.gif') {
            contentType = 'image/gif';
        }

        res.setHeader('Content-Type', contentType);
        res.send(data);
    });
}
