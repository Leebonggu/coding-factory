import { NextResponse } from 'next/server'
import { getPaymentAdapter } from '@/lib/payments/payment-config'
import type { PaymentRequest } from '@/types/payment'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as PaymentRequest

    if (!body.orderId || !body.amount || !body.orderName) {
      return NextResponse.json(
        { error: 'orderId, amount, and orderName are required' },
        { status: 400 }
      )
    }

    const adapter = getPaymentAdapter()
    const result = await adapter.createCheckout(body)

    return NextResponse.json(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Checkout creation failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
