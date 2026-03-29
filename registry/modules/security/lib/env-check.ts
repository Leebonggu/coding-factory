/**
 * Environment Variable Checker
 *
 * Call these helpers at application startup (e.g. in `instrumentation.ts` or
 * the top of `src/app/layout.tsx`) to fail fast when required configuration
 * is absent. This surfaces misconfigured deployments immediately rather than
 * producing cryptic runtime errors deep inside the application.
 *
 * @example Fail fast on startup
 *
 *   // src/lib/env.ts
 *   import { checkRequiredEnvVars } from '@/lib/security/env-check'
 *
 *   checkRequiredEnvVars([
 *     'DATABASE_URL',
 *     'NEXTAUTH_SECRET',
 *     'NEXT_PUBLIC_SITE_URL',
 *   ])
 *
 *   export const env = {
 *     databaseUrl: getEnvVar('DATABASE_URL'),
 *     nextAuthSecret: getEnvVar('NEXTAUTH_SECRET'),
 *     siteUrl: getEnvVar('NEXT_PUBLIC_SITE_URL'),
 *     analyticsId: getEnvVar('ANALYTICS_ID', ''),  // optional, empty string fallback
 *   }
 */

export class MissingEnvVarsError extends Error {
  /** The names of every environment variable that was not found. */
  readonly missing: string[]

  constructor(missing: string[]) {
    const list = missing.map((v) => `  - ${v}`).join('\n')
    super(
      `Missing required environment variable(s):\n${list}\n\n` +
        'Set them in your .env.local file (local) or deployment environment (production).'
    )
    this.name = 'MissingEnvVarsError'
    this.missing = missing
  }
}

/**
 * Assert that every name in `vars` resolves to a non-empty string in
 * `process.env`. Throws a single `MissingEnvVarsError` listing ALL missing
 * variables so you can fix them all in one go.
 *
 * @param vars - Array of environment variable names to check.
 * @throws {MissingEnvVarsError} If one or more variables are missing or empty.
 *
 * @example
 *   checkRequiredEnvVars(['DATABASE_URL', 'NEXTAUTH_SECRET'])
 */
export function checkRequiredEnvVars(vars: string[]): void {
  const missing = vars.filter(
    (name) => !process.env[name] || process.env[name]!.trim() === ''
  )

  if (missing.length > 0) {
    throw new MissingEnvVarsError(missing)
  }
}

/**
 * Retrieve the value of an environment variable.
 *
 * - If the variable is set and non-empty, returns its value.
 * - If `fallback` is provided, returns the fallback when the variable is missing.
 * - If no fallback is provided and the variable is missing, throws an error.
 *
 * @param name     - The environment variable name.
 * @param fallback - Optional default value when the variable is absent.
 * @throws {Error} If the variable is missing and no fallback is supplied.
 *
 * @example With fallback (optional var)
 *   const logLevel = getEnvVar('LOG_LEVEL', 'info')
 *
 * @example Without fallback (required var)
 *   const secret = getEnvVar('JWT_SECRET')  // throws if missing
 */
export function getEnvVar(name: string, fallback?: string): string {
  const value = process.env[name]

  if (value !== undefined && value.trim() !== '') {
    return value
  }

  if (fallback !== undefined) {
    return fallback
  }

  throw new Error(
    `Environment variable "${name}" is not set.\n` +
      'Add it to your .env.local file or deployment environment.'
  )
}
