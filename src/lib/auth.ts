import jwt from 'jsonwebtoken';

export function isAuthenticated(req: any) {
    const token = req.cookies.token;
    const JWT_SECRET = process.env.JWT_SECRET!;

    if (!token) {
        return false;
    }
    try {
        const decoded: any = jwt.verify(token, JWT_SECRET);
        return Boolean(decoded);
    } catch (err) {
        return false;
    }
}

// Example of using this in getServerSideProps in protected pages
export async function getServerSideProps(context: any) {
    const { req, res } = context;
    const auth = isAuthenticated(req);

    if (!auth) {
        return {
            redirect: {
                destination: '/login', // Redirect to the login if not authenticated
                permanent: false,
            },
        };
    }

    return {
        props: {}, // props for your page
    };
}
