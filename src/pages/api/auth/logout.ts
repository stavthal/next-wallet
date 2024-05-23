import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    // Set the cookie's expiration date to a past date, effectively clearing it
    res.setHeader(
        'Set-Cookie',
        'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly',
    );

    res.status(200).json({ message: 'Logged out successfully' });
}
