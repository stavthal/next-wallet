import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const unprotectedRoutes = ['/', '/login', '/register'];
    if (unprotectedRoutes.includes(path)) {
        return NextResponse.next();
    }

    // Here you would check for authentication tokens or session cookies
    const token = request.cookies.get('token');
    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}
