import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const url = request.nextUrl;

    // 1. If the user IS logged in and trying to access auth pages, 
    // send them to the dashboard.
    if (token && (
        url.pathname.startsWith('/sign-in') ||
        url.pathname.startsWith('/sign-up') ||
        url.pathname.startsWith('/verify') ||
        url.pathname === '/' // Only match exact root, not startsWith
    )) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // 2. If the user is NOT logged in and trying to access protected pages,
    // send them to the sign-in page.
    if (!token && url.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    // 3. Allow the request to proceed if no conditions are met
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/sign-in',
        '/sign-up',
        '/',
        '/dashboard/:path*',
        '/verify/:path*',
    ]
}