/**
 * Security Middleware
 *
 * Wraps a Next.js middleware handler and injects HTTP security headers into
 * every response. Designed to work with a middleware chain pattern.
 *
 * Integration — update your root `src/middleware.ts`:
 *
 *   import { type NextRequest } from 'next/server'
 *   import { securityMiddleware } from '@/lib/middlewares/security'
 *
 *   // Base middleware (your existing logic, or a no-op)
 *   function baseMiddleware(request: NextRequest) {
 *     return NextResponse.next()
 *   }
 *
 *   // Wrap with security headers
 *   export default securityMiddleware(baseMiddleware)
 *
 *   export const config = {
 *     matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
 *   }
 *
 * Customising CSP — pass overrides to `getSecurityHeaders`:
 *
 *   import { getSecurityHeaders } from '@/lib/security/security-headers'
 *
 *   const headers = getSecurityHeaders({
 *     'script-src': ["'self'", 'https://cdn.example.com'],
 *   })
 */

import { NextResponse } from 'next/server'
import type { NextRequest, NextMiddleware } from 'next/server'
import { getSecurityHeaders } from '@/lib/security/security-headers'

/**
 * Higher-order function that wraps a Next.js middleware with security headers.
 *
 * @param next - The middleware function to wrap. Can be any valid `NextMiddleware`.
 * @returns A new middleware that runs `next`, then attaches security headers to the response.
 *
 * @example
 *   export default securityMiddleware(myMiddleware)
 */
export function securityMiddleware(next: NextMiddleware): NextMiddleware {
  return async function middleware(request: NextRequest, event: Parameters<NextMiddleware>[1]) {
    // Run the inner middleware (or fall back to a pass-through response)
    const response = (await next(request, event)) ?? NextResponse.next()

    // Attach all security headers
    const headers = getSecurityHeaders()
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    return response
  }
}
