/**
 * NextAuth.js v5 — catch-all API route handler
 *
 * Handles all authentication requests at /api/auth/*:
 *   GET  /api/auth/signin
 *   GET  /api/auth/signout
 *   GET  /api/auth/session
 *   GET  /api/auth/csrf
 *   GET  /api/auth/providers
 *   GET  /api/auth/callback/:provider
 *   POST /api/auth/signin/:provider
 *   POST /api/auth/signout
 *   POST /api/auth/callback/:provider
 */

import { handlers } from '@/lib/auth'

export const { GET, POST } = handlers
