import { createClient } from '@/utils/supabase/server'
import type { Database, LabBookingStatus } from '@/types/database.types'

export type LabBookingRow = Database['public']['Tables']['lab_bookings']['Row'] & {
  lab?: {
    name: string
  } | null
  lab_test?: {
    name: string
    sample_type: string
  } | null
  patient?: {
    full_name: string | null
    phone: string | null
  } | null
  lab_reports?: Array<Database['public']['Tables']['lab_reports']['Row']>
}

export async function getPatientLabBookings(patientId: string): Promise<LabBookingRow[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('lab_bookings')
    .select(`
      *,
      lab:labs (
        name
      ),
      lab_test:lab_tests (
        name,
        sample_type
      ),
      lab_reports (
        id,
        file_url
      )
    `)
    .eq('patient_id', patientId)
    .order('slot_time', { ascending: false })

  if (error) {
    console.error('Error fetching patient lab bookings:', error)
    return []
  }

  return (data as unknown as LabBookingRow[]) || []
}

export async function getLabBookings(labId: string): Promise<LabBookingRow[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('lab_bookings')
    .select(`
      *,
      patient:profiles!lab_bookings_patient_id_fkey (
        full_name,
        phone
      ),
      lab_test:lab_tests (
        name,
        sample_type
      )
    `)
    .eq('lab_id', labId)
    .order('slot_time', { ascending: true })

  if (error) {
    console.error('Error fetching lab bookings:', error)
    return []
  }

  return (data as unknown as LabBookingRow[]) || []
}

export async function updateLabBookingStatus(
  id: string,
  status: LabBookingStatus
): Promise<boolean> {
  const supabase = await createClient()

  const { error } = await (supabase.from('lab_bookings') as any)
    .update({ status })
    .eq('id', id)

  return !error
}
