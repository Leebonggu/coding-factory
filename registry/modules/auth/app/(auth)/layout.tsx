import type { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
}

/**
 * Layout for authentication pages (/login, /register, etc.).
 * Provides a centered, minimal container with a logo area at the top.
 */
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--background)] px-4 py-12">
      {/* Logo / brand area */}
      <div className="mb-8 flex flex-col items-center gap-2">
        {/* Replace this placeholder with your actual logo component */}
        <div
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--primary)]"
          aria-hidden="true"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 text-[var(--primary-foreground)]"
            aria-hidden="true"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <span className="text-lg font-semibold tracking-tight text-[var(--foreground)]">
          {/* Replace with your app name */}
          My App
        </span>
      </div>

      {/* Page content (login form, register form, etc.) */}
      <main className="w-full max-w-sm">{children}</main>

      {/* Footer */}
      <p className="mt-8 text-center text-xs text-[var(--muted-foreground)]">
        By continuing, you agree to our{' '}
        <a href="/terms" className="underline hover:text-[var(--foreground)]">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="/privacy" className="underline hover:text-[var(--foreground)]">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  )
}
