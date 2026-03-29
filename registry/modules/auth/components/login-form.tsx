'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { cn } from '@/lib/utils'

interface LoginFormProps {
  callbackUrl?: string
}

export function LoginForm({ callbackUrl = '/dashboard' }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // ---------------------------------------------------------------------------
  // Credentials sign-in
  // ---------------------------------------------------------------------------
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (!email.trim()) {
      setError('Email is required.')
      return
    }
    if (!password) {
      setError('Password is required.')
      return
    }

    setIsLoading(true)
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password. Please try again.')
      } else {
        window.location.href = callbackUrl
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // ---------------------------------------------------------------------------
  // Social sign-in
  // ---------------------------------------------------------------------------
  async function handleSocialSignIn(provider: string) {
    setError(null)
    setIsLoading(true)
    try {
      await signIn(provider, { callbackUrl })
    } catch {
      setError('Something went wrong. Please try again.')
      setIsLoading(false)
    }
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="w-full max-w-sm space-y-6">
      {/* Heading */}
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">
          Sign in to your account
        </h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          Enter your email and password below
        </p>
      </div>

      {/* Error banner */}
      {error && (
        <div
          role="alert"
          className="rounded-md border border-[var(--destructive)] bg-[var(--destructive)]/10 px-4 py-3 text-sm text-[var(--destructive)]"
        >
          {error}
        </div>
      )}

      {/* Credentials form */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-[var(--foreground)]"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            disabled={isLoading}
            className={cn(
              'w-full rounded-md border bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)]',
              'border-[var(--border)] placeholder:text-[var(--muted-foreground)]',
              'outline-none ring-offset-[var(--background)]',
              'focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
            )}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[var(--foreground)]"
            >
              Password
            </label>
            {/* Uncomment once you add a forgot-password page */}
            {/* <Link
              href="/forgot-password"
              className="text-xs text-[var(--primary)] hover:underline"
            >
              Forgot password?
            </Link> */}
          </div>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            disabled={isLoading}
            className={cn(
              'w-full rounded-md border bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)]',
              'border-[var(--border)] placeholder:text-[var(--muted-foreground)]',
              'outline-none ring-offset-[var(--background)]',
              'focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
            )}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            'w-full rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)]',
            'transition-colors hover:bg-[var(--primary)]/90',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
          )}
        >
          {isLoading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-[var(--border)]" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-[var(--background)] px-2 text-[var(--muted-foreground)]">
            Or continue with
          </span>
        </div>
      </div>

      {/* Social providers */}
      <div className="space-y-2">
        {/* Google */}
        <button
          type="button"
          onClick={() => handleSocialSignIn('google')}
          disabled={isLoading}
          className={cn(
            'flex w-full items-center justify-center gap-2 rounded-md border border-[var(--border)]',
            'bg-[var(--background)] px-4 py-2 text-sm font-medium text-[var(--foreground)]',
            'transition-colors hover:bg-[var(--muted)]',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
          )}
        >
          {/* Google SVG icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="16"
            height="16"
            aria-hidden="true"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </button>

        {/*
          Kakao Login button
          Requires: KAKAO_CLIENT_ID, KAKAO_CLIENT_SECRET, and Kakao provider enabled in auth.config.ts
          Uncomment when ready:

        <button
          type="button"
          onClick={() => handleSocialSignIn('kakao')}
          disabled={isLoading}
          className={cn(
            'flex w-full items-center justify-center gap-2 rounded-md',
            'bg-[#FEE500] px-4 py-2 text-sm font-medium text-[#3C1E1E]',
            'transition-colors hover:bg-[#FEE500]/90',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
          )}
        >
          Continue with Kakao
        </button>
        */}

        {/*
          Naver Login button
          Requires: NAVER_CLIENT_ID, NAVER_CLIENT_SECRET, and Naver provider enabled in auth.config.ts
          Uncomment when ready:

        <button
          type="button"
          onClick={() => handleSocialSignIn('naver')}
          disabled={isLoading}
          className={cn(
            'flex w-full items-center justify-center gap-2 rounded-md',
            'bg-[#03C75A] px-4 py-2 text-sm font-medium text-white',
            'transition-colors hover:bg-[#03C75A]/90',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
          )}
        >
          Continue with Naver
        </button>
        */}
      </div>

      {/* Register link */}
      <p className="text-center text-sm text-[var(--muted-foreground)]">
        Don&apos;t have an account?{' '}
        <Link
          href="/register"
          className="font-medium text-[var(--primary)] hover:underline"
        >
          Create one
        </Link>
      </p>
    </div>
  )
}
