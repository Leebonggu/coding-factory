'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Avatar helpers
// ---------------------------------------------------------------------------

function getInitials(name?: string | null, email?: string | null): string {
  if (name) {
    const parts = name.trim().split(/\s+/)
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    return parts[0].slice(0, 2).toUpperCase()
  }
  if (email) return email[0].toUpperCase()
  return '?'
}

// ---------------------------------------------------------------------------
// UserButton
// ---------------------------------------------------------------------------

interface UserButtonProps {
  /** Where to send the user after sign-out. Defaults to '/'. */
  signOutCallbackUrl?: string
}

export function UserButton({ signOutCallbackUrl = '/' }: UserButtonProps) {
  const { data: session, status } = useSession()
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (containerRef.current && e.target instanceof Node && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [open])

  // Close on Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open])

  // Loading state
  if (status === 'loading') {
    return (
      <div className="h-9 w-9 animate-pulse rounded-full bg-[var(--muted)]" aria-label="Loading" />
    )
  }

  // Unauthenticated
  if (!session?.user) {
    return (
      <Link
        href="/login"
        className={cn(
          'inline-flex h-9 items-center rounded-md px-4 text-sm font-medium',
          'bg-[var(--primary)] text-[var(--primary-foreground)]',
          'transition-colors hover:bg-[var(--primary)]/90',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2',
        )}
      >
        Sign In
      </Link>
    )
  }

  const { name, email, image } = session.user
  const initials = getInitials(name, email)

  return (
    <div ref={containerRef} className="relative inline-block">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={cn(
          'flex h-9 w-9 items-center justify-center rounded-full overflow-hidden',
          'ring-2 ring-transparent transition-all',
          'hover:ring-[var(--ring)] focus-visible:outline-none focus-visible:ring-[var(--ring)]',
        )}
      >
        {image ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={image}
            alt={name ?? 'User avatar'}
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <span
            className="flex h-full w-full items-center justify-center bg-[var(--primary)] text-xs font-semibold text-[var(--primary-foreground)]"
            aria-hidden="true"
          >
            {initials}
          </span>
        )}
        <span className="sr-only">Open user menu</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          role="menu"
          className={cn(
            'absolute right-0 z-50 mt-2 w-52 origin-top-right rounded-md shadow-lg',
            'border border-[var(--border)] bg-[var(--popover)] text-[var(--popover-foreground)]',
            'animate-in fade-in-0 zoom-in-95',
          )}
        >
          {/* User info */}
          <div className="border-b border-[var(--border)] px-4 py-3">
            {name && (
              <p className="truncate text-sm font-medium text-[var(--foreground)]">{name}</p>
            )}
            {email && (
              <p className="truncate text-xs text-[var(--muted-foreground)]">{email}</p>
            )}
          </div>

          {/* Menu items */}
          <div className="py-1" role="none">
            <MenuItem href="/profile" onClick={() => setOpen(false)}>
              Profile
            </MenuItem>
            <MenuItem href="/settings" onClick={() => setOpen(false)}>
              Settings
            </MenuItem>
          </div>

          {/* Sign out */}
          <div className="border-t border-[var(--border)] py-1" role="none">
            <button
              role="menuitem"
              onClick={() => {
                setOpen(false)
                signOut({ callbackUrl: signOutCallbackUrl })
              }}
              className={cn(
                'flex w-full items-center px-4 py-2 text-sm text-[var(--foreground)]',
                'transition-colors hover:bg-[var(--muted)]',
                'focus-visible:outline-none focus-visible:bg-[var(--muted)]',
              )}
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Internal MenuItem
// ---------------------------------------------------------------------------

function MenuItem({
  href,
  onClick,
  children,
}: {
  href: string
  onClick?: () => void
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      role="menuitem"
      onClick={onClick}
      className={cn(
        'flex items-center px-4 py-2 text-sm text-[var(--foreground)]',
        'transition-colors hover:bg-[var(--muted)]',
        'focus-visible:outline-none focus-visible:bg-[var(--muted)]',
      )}
    >
      {children}
    </Link>
  )
}
