import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname

    // Protect all /admin routes except /admin/login
    if (path.startsWith('/admin') && path !== '/admin/login') {
        // Check if the auth cookie exists
        const token = request.cookies.get('token')?.value

        if (!token) {
            // Redirect to login if no token is found
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }
    }

    return NextResponse.next()
}

// Only match admin routes
export const config = {
    matcher: ['/admin/:path*'],
}
