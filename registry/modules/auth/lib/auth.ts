/**
 * NextAuth.js v5 — Auth utilities
 *
 * Initialises NextAuth with the shared config + PrismaAdapter and re-exports
 * the core handlers used throughout the app.
 *
 * Exports:
 *   handlers  — { GET, POST } route handlers for /api/auth/[...nextauth]
 *   signIn    — server-side sign-in helper
 *   signOut   — server-side sign-out helper
 *   auth      — returns the current Session (or null) in Server Components / API routes
 *
 * Helper functions:
 *   getCurrentUser()  — returns the authenticated User object or null
 *   requireAuth()     — throws a redirect to /login if no session is present
 */

import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { db } from '@/lib/db'
import { authConfig } from '@/lib/auth.config'

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  ...authConfig,
})

// ---------------------------------------------------------------------------
// Helper: getCurrentUser
// ---------------------------------------------------------------------------

/**
 * Returns the authenticated user from the current session, or null if the
 * request is unauthenticated.
 *
 * Safe to call in Server Components, Route Handlers, and Server Actions.
 *
 * @example
 * const user = await getCurrentUser()
 * if (!user) redirect('/login')
 */
export async function getCurrentUser() {
  const session = await auth()
  return session?.user ?? null
}

// ---------------------------------------------------------------------------
// Helper: requireAuth
// ---------------------------------------------------------------------------

/**
 * Asserts that the current request is authenticated.
 * Throws a Next.js redirect to /login when no session is found — this is
 * caught by the framework and handled transparently, so the calling code
 * does not need to handle it explicitly.
 *
 * @returns The authenticated user object.
 *
 * @example
 * // In a Server Component or Server Action:
 * const user = await requireAuth()
 * // user is guaranteed to be defined here
 */
export async function requireAuth() {
  const { redirect } = await import('next/navigation')

  const session = await auth()
  const user = session?.user

  if (!user) {
    redirect('/login')
  }

  return user
}
