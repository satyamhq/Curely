import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(req: Request) {
  try {
    const { doctorId, slotTime, mode, amount } = await req.json()

    if (!doctorId || !slotTime) {
      return NextResponse.json({ error: 'Missing doctor ID or slot time.' }, { status: 400 })
    }

    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Authentication required to book appointments.' }, { status: 401 })
    }

    // 1. Double-booking slot lock check
    const { data: existingSlot } = await supabase
      .from('appointments')
      .select('id')
      .eq('doctor_id', doctorId)
      .eq('slot_time', slotTime)
      .neq('status', 'cancelled')
      .maybeSingle()

    if (existingSlot) {
      return NextResponse.json(
        { error: 'This time slot has already been reserved by another patient. Please select a different time.' },
        { status: 409 }
      )
    }

    // 2. Create appointment record
    const { data: newAppointment, error } = await supabase
      .from('appointments')
      .insert({
        patient_id: user.id,
        doctor_id: doctorId,
        slot_time: slotTime,
        status: 'confirmed',
        mode: mode || 'online',
        amount: amount || 500,
      } as any)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message || 'Failed to create appointment in database.' }, { status: 400 })
    }

    return NextResponse.json(newAppointment)
  } catch (error: any) {
    console.error('Appointment Booking Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to reserve appointment slot.' },
      { status: 500 }
    )
  }
}

