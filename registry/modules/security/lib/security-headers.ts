/**
 * Security Headers
 *
 * Returns HTTP security headers for use in Next.js middleware.
 * Apply these headers to all responses to protect against common web vulnerabilities.
 *
 * Usage in middleware:
 *   import { getSecurityHeaders } from '@/lib/security/security-headers'
 *   const headers = getSecurityHeaders()
 *   Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value))
 */

export interface CspDirectives {
  'default-src'?: string[]
  'script-src'?: string[]
  'style-src'?: string[]
  'img-src'?: string[]
  'font-src'?: string[]
  'connect-src'?: string[]
  'media-src'?: string[]
  'object-src'?: string[]
  'frame-src'?: string[]
  'frame-ancestors'?: string[]
  'form-action'?: string[]
  'base-uri'?: string[]
  'upgrade-insecure-requests'?: boolean
  [key: string]: string[] | boolean | undefined
}

const DEFAULT_CSP_DIRECTIVES: CspDirectives = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'strict-dynamic'"],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", 'data:', 'blob:'],
  'font-src': ["'self'"],
  'connect-src': ["'self'"],
  'media-src': ["'self'"],
  'object-src': ["'none'"],
  'frame-src': ["'none'"],
  'frame-ancestors': ["'none'"],
  'form-action': ["'self'"],
  'base-uri': ["'self'"],
  'upgrade-insecure-requests': true,
}

/**
 * Build a Content-Security-Policy header string from directives.
 *
 * @param overrides - Partial directives to merge with defaults.
 *   Pass an empty object to use defaults unchanged.
 *   Each key's array value replaces (not extends) the default for that directive.
 *
 * @example
 * // Allow scripts from a CDN
 * buildCsp({ 'script-src': ["'self'", 'https://cdn.example.com'] })
 *
 * @example
 * // Allow Google Fonts
 * buildCsp({
 *   'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
 *   'font-src': ["'self'", 'https://fonts.gstatic.com'],
 * })
 */
export function buildCsp(overrides: Partial<CspDirectives> = {}): string {
  const directives: CspDirectives = { ...DEFAULT_CSP_DIRECTIVES, ...overrides }

  return Object.entries(directives)
    .map(([key, value]) => {
      if (value === false || value === undefined) return null
      if (value === true) return key
      if (Array.isArray(value) && value.length > 0) return `${key} ${value.join(' ')}`
      return null
    })
    .filter(Boolean)
    .join('; ')
}

/**
 * Returns all recommended security headers as a flat key-value object.
 * Pass the result directly to `response.headers.set()` in Next.js middleware.
 *
 * @param cspOverrides - Optional CSP directive overrides forwarded to `buildCsp`.
 */
export function getSecurityHeaders(
  cspOverrides: Partial<CspDirectives> = {}
): Record<string, string> {
  return {
    // Prevent MIME-type sniffing
    'X-Content-Type-Options': 'nosniff',

    // Deny all framing (use CSP frame-ancestors for more granular control)
    'X-Frame-Options': 'DENY',

    // Disable legacy XSS auditor — rely on CSP instead
    'X-XSS-Protection': '0',

    // Send origin only when navigating to same-origin; send nothing for cross-origin downgrade
    'Referrer-Policy': 'strict-origin-when-cross-origin',

    // Enforce HTTPS for 1 year, include subdomains
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',

    // Disable browser features that are rarely needed
    'Permissions-Policy': [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'payment=()',
      'usb=()',
      'interest-cohort=()',
    ].join(', '),

    // Content Security Policy
    'Content-Security-Policy': buildCsp(cspOverrides),
  }
}
