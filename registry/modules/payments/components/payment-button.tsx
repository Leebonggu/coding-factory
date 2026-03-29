'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface PaymentButtonProps {
  /** Order ID — must be unique per payment attempt */
  orderId: string
  /** Amount in the smallest currency unit */
  amount: number
  /** Currency code (default: KRW) */
  currency?: string
  /** Display name for the order */
  orderName: string
  /** Customer email (optional) */
  customerEmail?: string
  /** Customer name (optional) */
  customerName?: string
  /** URL to redirect after successful payment */
  successUrl?: string
  /** URL to redirect after failed payment */
  failUrl?: string
  /** Additional metadata */
  metadata?: Record<string, string>
  /** Button label */
  children?: React.ReactNode
  /** Additional className */
  className?: string
  /** Disabled state */
  disabled?: boolean
}

export function PaymentButton({
  orderId,
  amount,
  currency = 'KRW',
  orderName,
  customerEmail,
  customerName,
  successUrl,
  failUrl,
  metadata,
  children = '결제하기',
  className,
  disabled = false,
}: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  async function handleClick() {
    setIsLoading(true)

    try {
      const origin = window.location.origin

      const res = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          amount,
          currency,
          orderName,
          customerEmail,
          customerName,
          successUrl: successUrl ?? `${origin}/payments/success`,
          failUrl: failUrl ?? `${origin}/payments/fail`,
          metadata,
        }),
      })

      const data = (await res.json()) as { checkoutUrl?: string; error?: string }

      if (!res.ok || !data.checkoutUrl) {
        throw new Error(data.error ?? 'Failed to create checkout')
      }

      window.location.href = data.checkoutUrl
    } catch (error) {
      console.error('[PaymentButton]', error)
      setIsLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-medium',
        'bg-[var(--primary)] text-[var(--primary-foreground)]',
        'transition-colors hover:bg-[var(--primary)]/90',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
    >
      {isLoading ? '처리 중…' : children}
    </button>
  )
}
