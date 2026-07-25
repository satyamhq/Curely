import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(req: Request) {
  try {
    const { labId, testId, slotTime, amount } = await req.json()

    if (!labId || !testId) {
      return NextResponse.json({ error: 'Missing lab ID or test ID.' }, { status: 400 })
    }

    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Authentication required to book lab tests.' }, { status: 401 })
    }

    const { data: newBooking, error } = await supabase
      .from('lab_bookings')
      .insert({
        patient_id: user.id,
        lab_id: labId,
        test_id: testId,
        slot_time: slotTime || new Date().toISOString(),
        status: 'pending',
        amount: amount || 350,
      } as any)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message || 'Failed to book lab test in database.' }, { status: 400 })
    }

    return NextResponse.json(newBooking)
  } catch (error: any) {
    console.error('Lab Booking Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to book lab test.' },
      { status: 500 }
    )
  }
}

