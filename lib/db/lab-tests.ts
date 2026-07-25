import { createClient } from '@/utils/supabase/server'
import type { Database } from '@/types/database.types'

export type LabTestRow = Database['public']['Tables']['lab_tests']['Row']

export async function getLabTests(labId?: string): Promise<LabTestRow[]> {
  const supabase = await createClient()

  let query = supabase.from('lab_tests').select('*')

  if (labId) {
    query = query.eq('lab_id', labId)
  }

  const { data, error } = await query.order('name', { ascending: true })

  if (error) {
    console.error('Error fetching lab tests:', error)
    return []
  }

  return data || []
}

export async function createLabTest(test: {
  lab_id: string
  name: string
  price: number
  sample_type: string
  turnaround_hours: number
  description?: string
}): Promise<LabTestRow | null> {
  const supabase = await createClient()

  const { data, error } = await (supabase.from('lab_tests') as any)
    .insert(test)
    .select()
    .single()

  if (error) {
    console.error('Error creating lab test:', error)
    return null
  }

  return data
}

export async function deleteLabTest(id: string): Promise<boolean> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('lab_tests')
    .delete()
    .eq('id', id)

  return !error
}
