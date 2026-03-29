import { cn } from '@/lib/utils'
import type { PaymentStatus as PaymentStatusType } from '@/types/payment'
import { getStatusLabel, getStatusColor } from '@/lib/payments/format'

interface PaymentStatusProps {
  status: PaymentStatusType
  locale?: 'ko' | 'en'
  className?: string
}

const colorClasses: Record<string, string> = {
  green: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  red: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  gray: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
}

export function PaymentStatus({ status, locale = 'ko', className }: PaymentStatusProps) {
  const color = getStatusColor(status)
  const label = getStatusLabel(status, locale)

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        colorClasses[color] ?? colorClasses.gray,
        className,
      )}
    >
      {label}
    </span>
  )
}
