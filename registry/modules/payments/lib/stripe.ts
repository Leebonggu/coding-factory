/**
 * Stripe adapter.
 *
 * Implements PaymentAdapter for Stripe (global).
 * Docs: https://docs.stripe.com
 *
 * Required env vars:
 *   STRIPE_PUBLISHABLE_KEY — 퍼블릭 키 (프론트엔드용)
 *   STRIPE_SECRET_KEY      — 시크릿 키 (서버 API 호출용)
 *   STRIPE_WEBHOOK_SECRET  — 웹훅 서명 검증용
 */

import type { PaymentAdapter } from './payment-adapter'
import type {
  PaymentRequest,
  PaymentConfirmRequest,
  PaymentResult,
  PaymentStatus,
  WebhookEvent,
} from '@/types/payment'

const STRIPE_API_BASE = 'https://api.stripe.com/v1'

function getSecretKey(): string {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error('STRIPE_SECRET_KEY is not set')
  return key
}

function authHeader(): string {
  return `Bearer ${getSecretKey()}`
}

function mapStatus(stripeStatus: string): PaymentStatus {
  const map: Record<string, PaymentStatus> = {
    requires_payment_method: 'pending',
    requires_confirmation: 'ready',
    requires_action: 'in_progress',
    processing: 'in_progress',
    succeeded: 'done',
    canceled: 'canceled',
    requires_capture: 'ready',
  }
  return map[stripeStatus] ?? 'pending'
}

export class StripePaymentAdapter implements PaymentAdapter {
  readonly provider = 'stripe' as const

  async createCheckout(request: PaymentRequest): Promise<{ checkoutUrl: string }> {
    // Create a Stripe Checkout Session via the REST API (no SDK needed).
    const body = new URLSearchParams({
      'mode': 'payment',
      'success_url': request.successUrl,
      'cancel_url': request.failUrl,
      'line_items[0][price_data][currency]': request.currency.toLowerCase(),
      'line_items[0][price_data][product_data][name]': request.orderName,
      'line_items[0][price_data][unit_amount]': String(request.amount),
      'line_items[0][quantity]': '1',
      'client_reference_id': request.orderId,
    })

    if (request.customerEmail) {
      body.set('customer_email', request.customerEmail)
    }

    if (request.metadata) {
      for (const [key, value] of Object.entries(request.metadata)) {
        body.set(`metadata[${key}]`, value)
      }
    }

    const res = await fetch(`${STRIPE_API_BASE}/checkout/sessions`, {
      method: 'POST',
      headers: {
        Authorization: authHeader(),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    })

    const data = (await res.json()) as Record<string, unknown>

    if (!res.ok) {
      const error = data.error as Record<string, unknown> | undefined
      throw new Error((error?.message as string) ?? 'Stripe checkout creation failed')
    }

    return { checkoutUrl: data.url as string }
  }

  async confirmPayment(request: PaymentConfirmRequest): Promise<PaymentResult> {
    // Stripe Checkout sessions are confirmed automatically via redirect.
    // This retrieves the payment intent status for server-side verification.
    const res = await fetch(
      `${STRIPE_API_BASE}/payment_intents/${request.paymentKey}`,
      {
        headers: { Authorization: authHeader() },
      }
    )

    const data = (await res.json()) as Record<string, unknown>

    if (!res.ok) {
      const error = data.error as Record<string, unknown> | undefined
      throw new Error((error?.message as string) ?? 'Stripe payment confirmation failed')
    }

    return {
      provider: 'stripe',
      paymentKey: data.id as string,
      orderId: (data.metadata as Record<string, string>)?.orderId ?? request.orderId,
      amount: data.amount as number,
      currency: (data.currency as string).toUpperCase(),
      status: mapStatus(data.status as string),
      method: (data.payment_method_types as string[] | undefined)?.[0],
      approvedAt: data.created
        ? new Date((data.created as number) * 1000).toISOString()
        : undefined,
      raw: data,
    }
  }

  async handleWebhook(request: Request): Promise<WebhookEvent> {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    // Verify webhook signature using HMAC (simplified — no SDK dependency)
    if (webhookSecret && signature) {
      const isValid = await verifyStripeSignature(body, signature, webhookSecret)
      if (!isValid) {
        throw new Error('Invalid Stripe webhook signature')
      }
    }

    const event = JSON.parse(body) as Record<string, unknown>
    const paymentIntent = (event.data as Record<string, unknown>)?.object as Record<string, unknown>

    return {
      provider: 'stripe',
      type: event.type as string,
      paymentKey: paymentIntent?.id as string,
      orderId: (paymentIntent?.metadata as Record<string, string>)?.orderId ?? '',
      status: mapStatus((paymentIntent?.status as string) ?? ''),
      raw: event,
    }
  }
}

/**
 * Verify Stripe webhook signature without the Stripe SDK.
 * Uses the Web Crypto API available in Node 18+ and edge runtimes.
 */
async function verifyStripeSignature(
  payload: string,
  signatureHeader: string,
  secret: string
): Promise<boolean> {
  const parts = Object.fromEntries(
    signatureHeader.split(',').map((part) => {
      const [key, value] = part.split('=')
      return [key, value]
    })
  )

  const timestamp = parts.t
  const expectedSig = parts.v1
  if (!timestamp || !expectedSig) return false

  const signedPayload = `${timestamp}.${payload}`

  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )

  const signatureBytes = await crypto.subtle.sign('HMAC', key, encoder.encode(signedPayload))
  const computed = Array.from(new Uint8Array(signatureBytes))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')

  return computed === expectedSig
}
