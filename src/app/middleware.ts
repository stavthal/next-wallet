// pages/_middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname; // This gets the path without query parameters

    // List of unprotected (publicly accessible) routes
    const unprotectedRoutes = ['/', '/login', '/register'];

    // Check if the current route exactly matches any of the unprotected routes
    if (unprotectedRoutes.includes(path)) {
        return NextResponse.next(); // Proceed without any checks
    }

    // Here you would check for authentication tokens or session cookies
    const token = request.cookies.get('token'); // Get a token from the request cookies

    // If no token is found and the path is not one of the unprotected routes, redirect to login
    if (!token) {
        // Redirect user to the login page
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    // If a token is found, or the path is unprotected, allow the request to proceed
    return NextResponse.next();
}
