'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { ADSENSE_CLIENT_ID, ADPOST_ID } from '@/lib/ads'
import type { AdPosition, AdProvider } from '@/lib/ads'

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

interface AdSlotProps {
  position: AdPosition
  provider?: AdProvider
  slotId?: string
  format?: string
  className?: string
}

const MIN_HEIGHTS: Record<AdPosition, number> = {
  header: 90,
  sidebar: 250,
  content: 200,
  footer: 90,
  'in-article': 280,
}

function AdsenseSlot({
  slotId,
  format = 'auto',
  clientId,
}: {
  slotId?: string
  format?: string
  clientId: string
}) {
  const ref = useRef<HTMLModElement>(null)
  const pushed = useRef(false)

  useEffect(() => {
    if (pushed.current) return
    if (!ref.current) return
    try {
      window.adsbygoogle = window.adsbygoogle || []
      window.adsbygoogle.push({})
      pushed.current = true
    } catch {
      // adsbygoogle not loaded yet — silently ignore
    }
  }, [])

  if (!clientId || !slotId) return null

  return (
    <ins
      ref={ref}
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client={clientId}
      data-ad-slot={slotId}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  )
}

function AdpostSlot({ slotId, adpostId }: { slotId?: string; adpostId: string }) {
  if (!adpostId || !slotId) return null

  return (
    <div
      id={`adpost-${slotId}`}
      data-adpost-id={adpostId}
      data-adpost-slot={slotId}
    />
  )
}

function CustomSlot({ slotId }: { slotId?: string }) {
  return (
    <div
      id={slotId ? `ad-custom-${slotId}` : 'ad-custom'}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'hsl(var(--muted))',
        color: 'hsl(var(--muted-foreground))',
        fontSize: '0.75rem',
        borderRadius: '0.375rem',
        width: '100%',
        height: '100%',
      }}
    >
      Advertisement
    </div>
  )
}

export function AdSlot({
  position,
  provider,
  slotId,
  format = 'auto',
  className,
}: AdSlotProps) {
  const minHeight = MIN_HEIGHTS[position]

  // Auto-detect provider from env vars if not specified
  const resolvedProvider: AdProvider =
    provider ?? (ADSENSE_CLIENT_ID ? 'adsense' : ADPOST_ID ? 'adpost' : 'custom')

  return (
    <div
      className={cn('w-full overflow-hidden', className)}
      style={{ minHeight }}
      aria-label={`Advertisement — ${position}`}
    >
      {resolvedProvider === 'adsense' && (
        <AdsenseSlot slotId={slotId} format={format} clientId={ADSENSE_CLIENT_ID} />
      )}
      {resolvedProvider === 'adpost' && (
        <AdpostSlot slotId={slotId} adpostId={ADPOST_ID} />
      )}
      {resolvedProvider === 'custom' && <CustomSlot slotId={slotId} />}
    </div>
  )
}
