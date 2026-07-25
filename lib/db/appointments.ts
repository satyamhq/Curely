import { createClient } from '@/utils/supabase/server'
import type { Database, AppointmentStatus, AppointmentMode } from '@/types/database.types'

export type AppointmentRow = Database['public']['Tables']['appointments']['Row'] & {
  doctor?: {
    speciality: string
    profiles: {
      full_name: string | null
      avatar_url: string | null
      city: string | null
    } | null
  } | null
  patient?: {
    full_name: string | null
    phone: string | null
  } | null
}

export async function getPatientAppointments(patientId: string): Promise<AppointmentRow[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('appointments')
    .select(`
      *,
      doctor:doctors (
        speciality,
        profiles (
          full_name,
          avatar_url,
          city
        )
      )
    `)
    .eq('patient_id', patientId)
    .order('slot_time', { ascending: false })

  if (error) {
    console.error('Error fetching patient appointments:', error)
    return []
  }

  return (data as unknown as AppointmentRow[]) || []
}

export async function getDoctorAppointments(doctorId: string): Promise<AppointmentRow[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('appointments')
    .select(`
      *,
      patient:profiles!appointments_patient_id_fkey (
        full_name,
        phone
      )
    `)
    .eq('doctor_id', doctorId)
    .order('slot_time', { ascending: true })

  if (error) {
    console.error('Error fetching doctor appointments:', error)
    return []
  }

  return (data as unknown as AppointmentRow[]) || []
}

export async function getAppointmentById(id: string): Promise<AppointmentRow | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('appointments')
    .select(`
      *,
      doctor:doctors (
        speciality,
        qualifications,
        profiles (
          full_name,
          avatar_url,
          city
        )
      )
    `)
    .eq('id', id)
    .single()

  if (error || !data) {
    return null
  }

  return data as unknown as AppointmentRow
}

export async function createAppointment(booking: {
  patient_id: string
  doctor_id: string
  slot_time: string
  mode: AppointmentMode
  amount: number
}): Promise<AppointmentRow | null> {
  const supabase = await createClient()

  // Slot locking validation: check for active non-cancelled booking at same slot
  const { data: existing } = await supabase
    .from('appointments')
    .select('id')
    .eq('doctor_id', booking.doctor_id)
    .eq('slot_time', booking.slot_time)
    .neq('status', 'cancelled')
    .single()

  if (existing) {
    throw new Error('This time slot has already been reserved. Please select another slot.')
  }

  const { data, error } = await (supabase.from('appointments') as any)
    .insert({
      patient_id: booking.patient_id,
      doctor_id: booking.doctor_id,
      slot_time: booking.slot_time,
      mode: booking.mode,
      amount: booking.amount,
      status: 'confirmed',
    })
    .select(`
      *,
      doctor:doctors (
        speciality,
        profiles (
          full_name
        )
      )
    `)
    .single()

  if (error) {
    console.error('Error creating appointment:', error)
    return null
  }

  return data as unknown as AppointmentRow
}

export async function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus
): Promise<boolean> {
  const supabase = await createClient()

  const { error } = await (supabase.from('appointments') as any)
    .update({ status })
    .eq('id', id)

  return !error
}
