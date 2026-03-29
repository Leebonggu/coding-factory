/**
 * Payment formatting utilities.
 */

import type { PaymentStatus } from '@/types/payment'

/**
 * Format an amount for display.
 *
 * @example
 * formatAmount(50000, 'KRW') // '₩50,000'
 * formatAmount(1999, 'USD')  // '$19.99'
 */
export function formatAmount(amount: number, currency: string): string {
  const isZeroDecimal = ['KRW', 'JPY', 'VND'].includes(currency.toUpperCase())
  const displayAmount = isZeroDecimal ? amount : amount / 100

  return new Intl.NumberFormat(getLocale(currency), {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: isZeroDecimal ? 0 : 2,
  }).format(displayAmount)
}

function getLocale(currency: string): string {
  const localeMap: Record<string, string> = {
    KRW: 'ko-KR',
    JPY: 'ja-JP',
    USD: 'en-US',
    EUR: 'de-DE',
    GBP: 'en-GB',
  }
  return localeMap[currency.toUpperCase()] ?? 'en-US'
}

/**
 * Human-readable payment status labels.
 */
export function getStatusLabel(status: PaymentStatus, locale: 'ko' | 'en' = 'ko'): string {
  const labels: Record<PaymentStatus, { ko: string; en: string }> = {
    pending: { ko: '결제 대기', en: 'Pending' },
    ready: { ko: '결제 준비', en: 'Ready' },
    in_progress: { ko: '결제 진행 중', en: 'In Progress' },
    done: { ko: '결제 완료', en: 'Completed' },
    canceled: { ko: '결제 취소', en: 'Canceled' },
    failed: { ko: '결제 실패', en: 'Failed' },
    expired: { ko: '결제 만료', en: 'Expired' },
  }

  return labels[status]?.[locale] ?? status
}

/**
 * Returns a color hint for rendering payment status badges.
 */
export function getStatusColor(status: PaymentStatus): string {
  const colors: Record<PaymentStatus, string> = {
    pending: 'yellow',
    ready: 'blue',
    in_progress: 'blue',
    done: 'green',
    canceled: 'gray',
    failed: 'red',
    expired: 'gray',
  }

  return colors[status] ?? 'gray'
}
