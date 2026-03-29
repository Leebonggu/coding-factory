/**
 * Payment provider configuration.
 *
 * Reads PAYMENT_PROVIDER from env and returns the appropriate adapter.
 * Defaults to 'toss' if not set.
 */

import type { PaymentAdapter } from './payment-adapter'
import type { PaymentProvider } from '@/types/payment'
import { TossPaymentAdapter } from './toss'
import { StripePaymentAdapter } from './stripe'

let cachedAdapter: PaymentAdapter | null = null

/**
 * Returns the active payment adapter based on PAYMENT_PROVIDER env var.
 */
export function getPaymentAdapter(): PaymentAdapter {
  if (cachedAdapter) return cachedAdapter

  const provider = (process.env.PAYMENT_PROVIDER ?? 'toss') as PaymentProvider

  switch (provider) {
    case 'stripe':
      cachedAdapter = new StripePaymentAdapter()
      break
    case 'toss':
    default:
      cachedAdapter = new TossPaymentAdapter()
      break
  }

  return cachedAdapter
}

/**
 * Returns the current provider name.
 */
export function getPaymentProvider(): PaymentProvider {
  return (process.env.PAYMENT_PROVIDER ?? 'toss') as PaymentProvider
}

/**
 * Returns the client-side publishable key for the active provider.
 * Safe to expose to the browser.
 */
export function getPublishableKey(): string {
  const provider = getPaymentProvider()

  switch (provider) {
    case 'stripe':
      return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ''
    case 'toss':
    default:
      return process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY ?? ''
  }
}
