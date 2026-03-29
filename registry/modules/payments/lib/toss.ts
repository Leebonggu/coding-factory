/**
 * Toss Payments adapter.
 *
 * Implements PaymentAdapter for the Toss Payments (Korea) gateway.
 * Docs: https://docs.tosspayments.com
 *
 * Required env vars:
 *   TOSS_CLIENT_KEY — 클라이언트 키 (프론트엔드용)
 *   TOSS_SECRET_KEY — 시크릿 키 (서버 결제 승인용)
 */

import type { PaymentAdapter } from './payment-adapter'
import type {
  PaymentRequest,
  PaymentConfirmRequest,
  PaymentResult,
  PaymentStatus,
  WebhookEvent,
} from '@/types/payment'

const TOSS_API_BASE = 'https://api.tosspayments.com/v1'

function getSecretKey(): string {
  const key = process.env.TOSS_SECRET_KEY
  if (!key) throw new Error('TOSS_SECRET_KEY is not set')
  return key
}

function authHeader(): string {
  return `Basic ${Buffer.from(getSecretKey() + ':').toString('base64')}`
}

function mapStatus(tossStatus: string): PaymentStatus {
  const map: Record<string, PaymentStatus> = {
    READY: 'ready',
    IN_PROGRESS: 'in_progress',
    WAITING_FOR_DEPOSIT: 'pending',
    DONE: 'done',
    CANCELED: 'canceled',
    PARTIAL_CANCELED: 'canceled',
    ABORTED: 'failed',
    EXPIRED: 'expired',
  }
  return map[tossStatus] ?? 'pending'
}

export class TossPaymentAdapter implements PaymentAdapter {
  readonly provider = 'toss' as const

  async createCheckout(request: PaymentRequest): Promise<{ checkoutUrl: string }> {
    // Toss Payments uses a client-side SDK for the checkout UI.
    // The server prepares the payment parameters and the client redirects.
    // We return a URL that includes query params for the Toss checkout page.
    const params = new URLSearchParams({
      clientKey: process.env.TOSS_CLIENT_KEY ?? '',
      orderId: request.orderId,
      amount: String(request.amount),
      orderName: request.orderName,
      successUrl: request.successUrl,
      failUrl: request.failUrl,
    })

    if (request.customerEmail) params.set('customerEmail', request.customerEmail)
    if (request.customerName) params.set('customerName', request.customerName)

    return {
      checkoutUrl: `https://api.tosspayments.com/v1/brandpay/payments?${params.toString()}`,
    }
  }

  async confirmPayment(request: PaymentConfirmRequest): Promise<PaymentResult> {
    const res = await fetch(`${TOSS_API_BASE}/payments/confirm`, {
      method: 'POST',
      headers: {
        Authorization: authHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentKey: request.paymentKey,
        orderId: request.orderId,
        amount: request.amount,
      }),
    })

    const data = (await res.json()) as Record<string, unknown>

    if (!res.ok) {
      const message = (data.message as string) ?? 'Toss payment confirmation failed'
      throw new Error(message)
    }

    return {
      provider: 'toss',
      paymentKey: data.paymentKey as string,
      orderId: data.orderId as string,
      amount: data.totalAmount as number,
      currency: (data.currency as string) ?? 'KRW',
      status: mapStatus(data.status as string),
      method: data.method as string | undefined,
      approvedAt: data.approvedAt as string | undefined,
      raw: data,
    }
  }

  async handleWebhook(request: Request): Promise<WebhookEvent> {
    const body = (await request.json()) as Record<string, unknown>

    // Toss sends webhook events with a `data` field containing the payment info
    const eventType = body.eventType as string | undefined
    const data = (body.data ?? body) as Record<string, unknown>

    return {
      provider: 'toss',
      type: eventType ?? 'payment.update',
      paymentKey: data.paymentKey as string,
      orderId: data.orderId as string,
      status: mapStatus(data.status as string),
      raw: body,
    }
  }
}
