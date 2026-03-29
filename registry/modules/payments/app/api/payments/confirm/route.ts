import { NextResponse } from 'next/server'
import { getPaymentAdapter } from '@/lib/payments/payment-config'
import type { PaymentConfirmRequest } from '@/types/payment'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as PaymentConfirmRequest

    if (!body.paymentKey || !body.orderId || !body.amount) {
      return NextResponse.json(
        { error: 'paymentKey, orderId, and amount are required' },
        { status: 400 }
      )
    }

    const adapter = getPaymentAdapter()
    const result = await adapter.confirmPayment(body)

    // TODO: If using the db module, save the payment result here.
    // import { db } from '@/lib/db'
    // await db.payment.create({ data: { ... } })

    return NextResponse.json(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Payment confirmation failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
