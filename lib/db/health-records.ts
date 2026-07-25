import { createClient } from '@/utils/supabase/server'
import type { Database } from '@/types/database.types'

export type HealthRecordRow = Database['public']['Tables']['health_records']['Row']

export async function getHealthRecords(patientId: string): Promise<HealthRecordRow[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('health_records')
    .select('*')
    .eq('patient_id', patientId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching health records:', error)
    return []
  }

  return data || []
}

export async function createHealthRecord(record: {
  patient_id: string
  title: string
  type: string
  file_url: string
  uploaded_by?: string
}): Promise<HealthRecordRow | null> {
  const supabase = await createClient()

  const { data, error } = await (supabase.from('health_records') as any)
    .insert(record)
    .select()
    .single()

  if (error) {
    console.error('Error creating health record:', error)
    return null
  }

  return data
}

export async function deleteHealthRecord(id: string): Promise<boolean> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('health_records')
    .delete()
    .eq('id', id)

  return !error
}
