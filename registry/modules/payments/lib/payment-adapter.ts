/**
 * Payment adapter interface.
 *
 * All PG providers (Toss, Stripe, etc.) implement this interface so the rest
 * of the application can work with payments without knowing which provider is
 * active.
 */

import type {
  PaymentRequest,
  PaymentConfirmRequest,
  PaymentResult,
  WebhookEvent,
} from '@/types/payment'

export interface PaymentAdapter {
  /** Provider identifier */
  readonly provider: string

  /**
   * Create a checkout session / payment request.
   * Returns a URL (or client-side config) the customer should be redirected to.
   */
  createCheckout(request: PaymentRequest): Promise<{ checkoutUrl: string }>

  /**
   * Confirm (approve) a payment after the customer has completed the PG flow.
   * Called from your server — never from the client.
   */
  confirmPayment(request: PaymentConfirmRequest): Promise<PaymentResult>

  /**
   * Parse and verify an incoming webhook request from the PG.
   * Returns a normalized event or throws if the signature is invalid.
   */
  handleWebhook(request: Request): Promise<WebhookEvent>
}
