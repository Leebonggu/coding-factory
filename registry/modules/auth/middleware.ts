/**
 * Auth Middleware
 *
 * Composable middleware for protecting routes and redirecting authenticated users
 * away from auth pages. Designed to be chained with other middleware modules
 * via src/middleware.ts.
 *
 * Protected routes — redirect to /login when unauthenticated:
 *   /dashboard, /settings, /profile  (extend protectedRoutes as needed)
 *
 * Auth routes — redirect to /dashboard when already authenticated:
 *   /login, /register
 *
 * Usage in src/middleware.ts:
 *   import { authMiddleware } from '@/lib/middlewares/auth'
 *   export default authMiddleware(nextMiddleware)
 */

import { NextResponse, type NextFetchEvent } from 'next/server'
import type { NextRequest, NextMiddleware } from 'next/server'
import { auth } from '@/lib/auth'

const protectedRoutes = ['/dashboard', '/settings', '/profile']
const authRoutes = ['/login', '/register']

export function authMiddleware(next: NextMiddleware) {
  return async function middleware(request: NextRequest, event: NextFetchEvent) {
    const { pathname } = request.nextUrl

    // Check if route needs protection
    const isProtected = protectedRoutes.some((route) => pathname.startsWith(route))
    const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

    if (isProtected || isAuthRoute) {
      const session = await auth()

      if (isProtected && !session) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(loginUrl)
      }

      if (isAuthRoute && session) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }

    return next(request, event)
  }
}
