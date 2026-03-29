import { NextResponse } from 'next/server'
import { getPaymentAdapter } from '@/lib/payments/payment-config'

export async function POST(request: Request) {
  try {
    const adapter = getPaymentAdapter()
    const event = await adapter.handleWebhook(request)

    // TODO: Process the webhook event based on your business logic.
    // For example, update order status, send confirmation email, etc.
    //
    // if (event.status === 'done') {
    //   await db.order.update({ where: { id: event.orderId }, data: { status: 'paid' } })
    // }

    console.log(`[payments/webhook] ${event.provider} ${event.type}: ${event.orderId} → ${event.status}`)

    return NextResponse.json({ received: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Webhook processing failed'
    console.error('[payments/webhook] Error:', message)
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
