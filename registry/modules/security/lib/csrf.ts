/**
 * CSRF Protection — Cookie-based Double Submit Pattern
 *
 * How it works:
 *  1. Server generates a random token and sets it in a cookie (HttpOnly=false so JS can read it).
 *  2. Client reads the cookie value and sends it back in every mutating request
 *     via the `x-csrf-token` header (or `_csrf` body field).
 *  3. Server validates that the header/body value matches the cookie value.
 *
 * Because a cross-origin attacker cannot read cookies from another origin,
 * they cannot reproduce the correct token in the header.
 *
 * Usage — generate a token when rendering a protected page:
 *   import { generateCsrfToken } from '@/lib/security/csrf'
 *   const { token, cookieValue } = generateCsrfToken()
 *   // Set-Cookie: csrf_token=<cookieValue>; SameSite=Strict; Secure; Path=/
 *
 * Usage — validate in an API route handler:
 *   import { validateCsrfToken } from '@/lib/security/csrf'
 *   validateCsrfToken(request, cookieStore.get('csrf_token')?.value ?? '')
 */

export const CSRF_COOKIE_NAME = 'csrf_token'
export const CSRF_HEADER_NAME = 'x-csrf-token'
export const CSRF_BODY_FIELD = '_csrf'

export interface CsrfToken {
  /** The raw token — embed this in forms or expose to client-side JS. */
  token: string
  /** Same value; kept as a separate field for clarity when setting cookies. */
  cookieValue: string
}

/**
 * Generate a cryptographically random CSRF token (hex string, 32 bytes).
 */
export function generateCsrfToken(): CsrfToken {
  let token: string

  if (
    typeof crypto !== 'undefined' &&
    typeof (crypto as Crypto).randomUUID === 'function'
  ) {
    // Node 19+ / modern browsers
    token = (crypto as Crypto).randomUUID().replace(/-/g, '')
  } else if (
    typeof crypto !== 'undefined' &&
    typeof (crypto as Crypto).getRandomValues === 'function'
  ) {
    const bytes = new Uint8Array(32)
    ;(crypto as Crypto).getRandomValues(bytes)
    token = Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
  } else {
    // Fallback for very old environments (not recommended for production)
    token = Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('')
  }

  return { token, cookieValue: token }
}

/**
 * Extract the CSRF token submitted by the client.
 * Checks the `x-csrf-token` header first, then falls back to a JSON body field `_csrf`.
 *
 * @throws {Error} If neither source provides a token.
 */
async function extractSubmittedToken(request: Request): Promise<string> {
  // 1. Check header (preferred — works for fetch/XHR)
  const headerToken = request.headers.get(CSRF_HEADER_NAME)
  if (headerToken) return headerToken

  // 2. Fall back to JSON body field (traditional form-like submissions)
  const contentType = request.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    try {
      // Clone so we don't consume the body for downstream handlers
      const body = await request.clone().json()
      if (typeof body === 'object' && body !== null && CSRF_BODY_FIELD in body) {
        const field = (body as Record<string, unknown>)[CSRF_BODY_FIELD]
        if (typeof field === 'string' && field.length > 0) return field
      }
    } catch {
      // Ignore parse errors — treat as missing token
    }
  }

  throw new CsrfError('CSRF token not found in request header or body')
}

export class CsrfError extends Error {
  constructor(message = 'Invalid or missing CSRF token') {
    super(message)
    this.name = 'CsrfError'
  }
}

/**
 * Validate a CSRF token from an incoming request against the expected cookie value.
 *
 * Performs a constant-time-equivalent comparison to prevent timing attacks.
 *
 * @param request - The incoming Next.js/Fetch API request.
 * @param cookieToken - The value from the CSRF cookie (retrieved from `cookies()` or `request.cookies`).
 *
 * @throws {CsrfError} If the token is missing or does not match.
 *
 * @example
 * // In a Next.js Route Handler
 * import { cookies } from 'next/headers'
 * import { validateCsrfToken } from '@/lib/security/csrf'
 *
 * export async function POST(request: Request) {
 *   const cookieToken = (await cookies()).get(CSRF_COOKIE_NAME)?.value ?? ''
 *   validateCsrfToken(request, cookieToken) // throws CsrfError on failure
 *   // ... handle request
 * }
 */
export async function validateCsrfToken(
  request: Request,
  cookieToken: string
): Promise<void> {
  if (!cookieToken) {
    throw new CsrfError('CSRF cookie is missing')
  }

  const submitted = await extractSubmittedToken(request)

  // Constant-time comparison: iterate all characters regardless of mismatch position
  if (!timingSafeEqual(submitted, cookieToken)) {
    throw new CsrfError('CSRF token mismatch')
  }
}

/** Simple constant-time string comparison (avoids early-exit timing leaks). */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    // Still iterate to avoid length-based timing leak
    let diff = 0
    const maxLen = Math.max(a.length, b.length)
    for (let i = 0; i < maxLen; i++) {
      diff |= (a.charCodeAt(i) ?? 0) ^ (b.charCodeAt(i) ?? 0)
    }
    return false // lengths differ, always invalid
  }

  let diff = 0
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return diff === 0
}
