'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { cn } from '@/lib/utils'

interface SignupFormProps {
  /**
   * Where to send the user after a successful registration + auto sign-in.
   * Defaults to '/dashboard'.
   */
  callbackUrl?: string
}

export function SignupForm({ callbackUrl = '/dashboard' }: SignupFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------
  function validate(): string | null {
    if (!name.trim()) return 'Name is required.'
    if (!email.trim()) return 'Email is required.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Enter a valid email address.'
    if (password.length < 8) return 'Password must be at least 8 characters.'
    if (password !== confirmPassword) return 'Passwords do not match.'
    return null
  }

  // ---------------------------------------------------------------------------
  // Submit
  // ---------------------------------------------------------------------------
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setIsLoading(true)
    try {
      // Call the registration API route.
      // Create src/app/api/auth/register/route.ts if it doesn't exist yet.
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      const data = (await res.json()) as { message?: string }

      if (!res.ok) {
        setError(data.message ?? 'Registration failed. Please try again.')
        return
      }

      // Auto sign-in after successful registration
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        // Account created but sign-in failed — redirect to login
        window.location.href = '/login'
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
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="w-full max-w-sm space-y-6">
      {/* Heading */}
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">
          Create an account
        </h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          Fill in the details below to get started
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

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Name */}
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-[var(--foreground)]"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
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

        {/* Email */}
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

        {/* Password */}
        <div className="space-y-2">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-[var(--foreground)]"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min. 8 characters"
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

        {/* Confirm password */}
        <div className="space-y-2">
          <label
            htmlFor="confirm-password"
            className="block text-sm font-medium text-[var(--foreground)]"
          >
            Confirm password
          </label>
          <input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat your password"
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
          {isLoading ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      {/* Login link */}
      <p className="text-center text-sm text-[var(--muted-foreground)]">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-medium text-[var(--primary)] hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}
