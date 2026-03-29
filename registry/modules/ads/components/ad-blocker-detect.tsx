'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

const DISMISSED_KEY = 'ads:blocker-dismissed'

interface AdBlockerDetectProps {
  fallback?: React.ReactNode
  className?: string
}

async function detectAdBlocker(): Promise<boolean> {
  // Strategy 1: check if a known bait URL is blocked
  try {
    const res = await fetch(
      'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
      { method: 'HEAD', mode: 'no-cors', cache: 'no-store' }
    )
    // A successful no-cors fetch returns an opaque response — assume not blocked
    if (res.type === 'opaque' || res.ok) return false
  } catch {
    return true
  }

  // Strategy 2: bait element detection
  return new Promise((resolve) => {
    const bait = document.createElement('div')
    bait.className = 'adsbox pub_300x250 pub_300x250m pub_728x90 text-ad textAd'
    bait.style.cssText =
      'width:1px;height:1px;position:absolute;left:-9999px;top:-9999px;'
    document.body.appendChild(bait)

    window.requestAnimationFrame(() => {
      const blocked =
        bait.offsetParent === null ||
        bait.clientHeight === 0 ||
        bait.offsetHeight === 0
      document.body.removeChild(bait)
      resolve(blocked)
    })
  })
}

function DefaultFallback({
  onDismiss,
  className,
}: {
  onDismiss: () => void
  className?: string
}) {
  return (
    <div
      role="status"
      className={cn(
        'flex items-center justify-between gap-4 rounded-lg border px-4 py-3 text-sm',
        className
      )}
      style={{
        borderColor: 'hsl(var(--border))',
        background: 'hsl(var(--muted))',
        color: 'hsl(var(--muted-foreground))',
      }}
    >
      <p>
        Consider supporting us by disabling your ad blocker on this site. Ads help
        keep the content free.
      </p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss ad blocker notice"
        style={{
          flexShrink: 0,
          padding: '0.25rem 0.75rem',
          borderRadius: '0.375rem',
          border: '1px solid hsl(var(--border))',
          background: 'hsl(var(--background))',
          color: 'hsl(var(--foreground))',
          cursor: 'pointer',
          fontSize: '0.75rem',
          lineHeight: 1.5,
        }}
      >
        Dismiss
      </button>
    </div>
  )
}

export function AdBlockerDetect({ fallback, className }: AdBlockerDetectProps) {
  const [blocked, setBlocked] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Check localStorage first to avoid showing again after dismiss
    try {
      if (localStorage.getItem(DISMISSED_KEY) === '1') {
        setDismissed(true)
        return
      }
    } catch {
      // localStorage not available (e.g. incognito with strict settings)
    }

    detectAdBlocker().then(setBlocked)
  }, [])

  function handleDismiss() {
    setDismissed(true)
    try {
      localStorage.setItem(DISMISSED_KEY, '1')
    } catch {
      // ignore
    }
  }

  if (!blocked || dismissed) return null

  if (fallback) return <>{fallback}</>

  return <DefaultFallback onDismiss={handleDismiss} className={className} />
}
