import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(req: Request) {
  try {
    const { amount, currency, relatedType, relatedId } = await req.json()

    if (!amount || !relatedType || !relatedId) {
      return NextResponse.json({ error: 'Missing payment order parameters.' }, { status: 400 })
    }

    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Authentication required to initiate payments.' }, { status: 401 })
    }

    // Insert pending payment audit record
    const { data: paymentRecord, error: insertErr } = await supabase
      .from('payments')
      .insert({
        user_id: user.id,
        related_type: relatedType,
        related_id: relatedId,
        amount,
        status: 'pending',
        provider_ref: `razorpay_order_${Date.now()}`,
      } as any)
      .select()
      .single()

    if (insertErr) {
      return NextResponse.json({ error: insertErr.message || 'Failed to initialize payment record.' }, { status: 400 })
    }

    const razorpayOrderId = `order_${Date.now()}`

    return NextResponse.json({
      orderId: razorpayOrderId,
      amount: amount * 100, // In paise
      currency: currency || 'INR',
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_key',
      paymentId: (paymentRecord as any).id,
    })
  } catch (error: any) {
    console.error('Payment Order Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create payment order.' },
      { status: 500 }
    )
  }
}

