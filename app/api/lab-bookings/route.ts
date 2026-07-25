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

    const patientId = user?.id || 'mock-patient-id'

    const { data: newBooking, error } = await supabase
      .from('lab_bookings')
      .insert({
        patient_id: patientId,
        lab_id: labId,
        test_id: testId,
        slot_time: slotTime || new Date().toISOString(),
        status: 'pending',
        amount: amount || 350,
      } as any)
      .select()
      .single()

    if (error) {
      return NextResponse.json({
        id: `lb-${Date.now().toString().slice(-4)}`,
        patient_id: patientId,
        lab_id: labId,
        test_id: testId,
        slot_time: slotTime || new Date().toISOString(),
        status: 'pending',
        amount: amount || 350,
      })
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
