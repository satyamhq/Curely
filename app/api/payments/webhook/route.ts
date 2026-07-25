import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { event, payload } = body

    if (event === 'payment.captured' || event === 'order.paid') {
      const paymentId = payload?.payment?.entity?.id
      const orderId = payload?.payment?.entity?.order_id

      const supabase = await createClient()

      // Update payment record in database server-side
      await (supabase.from('payments') as any)
        .update({ status: 'paid', provider_ref: paymentId })
        .eq('provider_ref', orderId)
    }

    return NextResponse.json({ status: 'success' })
  } catch (error: any) {
    console.error('Razorpay Webhook Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
